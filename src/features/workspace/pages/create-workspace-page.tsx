'use client';

import { useState } from 'react';

import { useWorkspaceState } from '@/entities/workspace';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label } from '@/shared/ui';

export function CreateWorkspacePage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { addWorkspace } = useWorkspaceState();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsCreating(true);

    // Имитация создания воркспейса
    setTimeout(() => {
      const newWorkspace = {
        id: `ws-${Date.now()}`,
        name: name.trim(),
        description: description.trim() || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        members: [
          {
            id: 'member-1',
            userId: 'user-1',
            role: 'owner' as const,
            joinedAt: new Date().toISOString(),
          },
        ],
      };

      addWorkspace(newWorkspace);
      setIsCreating(false);
    }, 1000);
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
