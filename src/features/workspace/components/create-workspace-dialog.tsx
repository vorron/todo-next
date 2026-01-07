'use client';

import { useState } from 'react';

import { useCurrentUserId } from '@/features/auth/hooks';
import { Dialog, DialogContent, DialogHeader, DialogTitle, Input, Label } from '@/shared/ui';
import { Button } from '@/shared/ui/button';

import { useCreateWorkspace } from '../model/mutations';

interface CreateWorkspaceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateWorkspaceDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateWorkspaceDialogProps) {
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

      // Очистка формы после успешного создания
      setName('');
      setDescription('');

      // Закрываем диалог
      onOpenChange(false);

      // Вызываем callback успеха
      onSuccess?.();
    } catch (error) {
      console.error('Failed to create workspace:', error);
    }
  };

  const handleCancel = () => {
    // Просто закрываем диалог без подтверждения
    setName('');
    setDescription('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Workspace</DialogTitle>
        </DialogHeader>
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
            />
          </div>
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
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isCreating}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim() || isCreating}>
              {isCreating ? 'Creating...' : 'Create Workspace'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
