'use client';

import { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label } from '@/shared/ui';

import { useWorkspaceContext } from '../model/workspace-context';

export function CreateWorkspacePage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { actions, refetch, isCreating } = useWorkspaceContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await actions.createWorkspace({
        name: name.trim(),
        description: description.trim() || undefined,
        ownerId: '4', // Временно захардкожен, потом взять из auth
      });

      // Очистка формы после успешного создания
      setName('');
      setDescription('');

      // Возвращаемся к выбору воркспейса
      actions.setCurrentWorkspace(null);

      // Обновляем список воркспейсов
      refetch();
    } catch (error) {
      // Ошибка уже обработана в хуке
      console.error('Create workspace failed:', error);
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

              <Button type="submit" className="w-full" disabled={!name.trim() || isCreating}>
                {isCreating ? 'Creating...' : 'Create Workspace'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
