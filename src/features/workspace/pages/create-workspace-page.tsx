'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label } from '@/shared/ui';

import { useCreateWorkspace } from '../model/mutations';

export function CreateWorkspacePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { createWorkspace, isCreating } = useCreateWorkspace();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await createWorkspace({
        name: name.trim(),
        description: description.trim() || undefined,
        ownerId: 'user-1', // Временно, потом взять из auth
      });

      // Очистка формы после успешного создания
      setName('');
      setDescription('');

      // Перенаправляем на select workspace
      router.push('/workspace/select');
    } catch (error) {
      console.error('Failed to create workspace:', error);
    }
  };

  const handleCancel = () => {
    // Если есть введенные данные, спросим подтверждение
    if (name.trim() || description.trim()) {
      if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
        router.back();
      }
    } else {
      // Если форма пуста, просто возвращаемся назад
      router.back();
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Create Your First Workspace</CardTitle>
            <p className="text-muted-foreground">
              A workspace is where you and your team collaborate on tasks and projects.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Workspace Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My Awesome Workspace"
                  required
                  disabled={isCreating}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What's this workspace about?"
                  disabled={isCreating}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={handleCancel}
                  disabled={isCreating}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={!name.trim() || isCreating}>
                  {isCreating ? 'Creating...' : 'Create Workspace'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
