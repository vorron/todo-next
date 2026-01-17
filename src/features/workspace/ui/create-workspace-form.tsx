'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { useCurrentUserId } from '@/features/auth/hooks';
import { Input, Label } from '@/shared/ui';
import { Button } from '@/shared/ui/button';

import { useCreateWorkspace } from '../model/mutations';

interface CreateWorkspaceFormProps {
  onSuccess?: string;
  showDescription?: boolean;
}

/**
 * Форма создания workspace
 * Переиспользуемая компонента для разных контекстов
 */
export function CreateWorkspaceForm({
  onSuccess,
  showDescription = false,
}: CreateWorkspaceFormProps) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { createWorkspace, isCreating } = useCreateWorkspace();
  const currentUserId = useCurrentUserId();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await createWorkspace({
        name: name.trim(),
        description: description.trim() || undefined,
        ownerId: currentUserId,
      });

      // Очистка формы
      setName('');
      setDescription('');

      // Редирект после успешного создания
      if (onSuccess) {
        router.push(onSuccess);
      }
    } catch (error) {
      console.error('Failed to create workspace:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="workspace-name">Workspace Name *</Label>
        <Input
          id="workspace-name"
          placeholder="Enter workspace name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isCreating}
          required
          autoFocus
        />
      </div>

      {showDescription && (
        <div className="space-y-2">
          <Label htmlFor="workspace-description">Description</Label>
          <textarea
            id="workspace-description"
            placeholder="Enter workspace description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full min-h-[80px] px-3 py-2 border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            disabled={isCreating}
          />
        </div>
      )}

      <div className="flex justify-end">
        <Button type="submit" disabled={!name.trim() || isCreating}>
          {isCreating ? 'Creating...' : 'Create Workspace'}
        </Button>
      </div>
    </form>
  );
}
