'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
} from '@/shared/ui';
import { Button } from '@/shared/ui/button';

import type { Workspace } from '@/entities/workspace/model/schema';

/**
 * Projects Page
 * Управление проектами в workspace
 */
export function ProjectsPage({ workspace: _workspace }: { workspace: Workspace }) {
  const router = useRouter();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [editingProject, setEditingProject] = useState<{
    id: string;
    name: string;
    description: string;
  } | null>(null);
  const [deletingProject, setDeletingProject] = useState<{ id: string; name: string } | null>(null);
  const [isCreateWorkspaceOpen, setIsCreateWorkspaceOpen] = useState(false);
  const [workspaceName, setWorkspaceName] = useState('');
  const [workspaceDescription, setWorkspaceDescription] = useState('');

  const handleCreateProject = () => {
    if (!newProjectName.trim()) return;

    // TODO: Здесь будет API вызов для создания проекта
    console.log('Creating project:', { name: newProjectName, description: newProjectDescription });

    // Закрываем диалог и сбрасываем форму
    setIsCreateDialogOpen(false);
    setNewProjectName('');
    setNewProjectDescription('');
  };

  const handleEditProject = (id: string, name: string, description: string) => {
    setEditingProject({ id, name, description });
  };

  const handleSaveEdit = () => {
    if (!editingProject || !editingProject.name.trim()) return;

    // TODO: Здесь будет API вызов для редактирования проекта
    console.log('Editing project:', editingProject);

    // Закрываем диалог
    setEditingProject(null);
  };

  const handleDeleteProject = (id: string, name: string) => {
    setDeletingProject({ id, name });
  };

  const handleConfirmDelete = () => {
    if (!deletingProject) return;

    // TODO: Здесь будет API вызов для удаления проекта
    console.log('Deleting project:', deletingProject);

    // Закрываем диалог
    setDeletingProject(null);
  };

  const handleCreateWorkspace = () => {
    if (!workspaceName.trim()) return;

    // TODO: Здесь будет API вызов для создания workspace
    console.log('Creating workspace:', { name: workspaceName, description: workspaceDescription });

    // Закрываем диалог и сбрасываем форму
    setIsCreateWorkspaceOpen(false);
    setWorkspaceName('');
    setWorkspaceDescription('');
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Projects</h1>
        <p className="text-muted-foreground">Manage your projects and track progress</p>
      </div>

      {/* Quick Actions */}
      <div className="mb-6 flex gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          ← Back
        </Button>
        <Button onClick={() => router.push('/workspace/manage')}>Switch Workspace</Button>
        <Button onClick={() => router.push('/workspace/[id]/time-entry')}>Time Entry</Button>
        <Button onClick={() => router.push('/workspace/[id]/reports')}>Reports</Button>
        <Button onClick={() => setIsCreateWorkspaceOpen(true)}>+ Create Workspace</Button>
      </div>

      {/* Create New Project */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Create New Project</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full max-w-sm">+ Create Project</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="project-name">Project Name *</Label>
                    <Input
                      id="project-name"
                      placeholder="Enter project name"
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-description">Description</Label>
                    <textarea
                      id="project-description"
                      placeholder="Enter project description (optional)"
                      value={newProjectDescription}
                      onChange={(e) => setNewProjectDescription(e.target.value)}
                      className="w-full min-h-[80px] px-3 py-2 border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateProject} disabled={!newProjectName.trim()}>
                      Create Project
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Active Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Website Redesign</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-muted-foreground">60%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>12 of 20 tasks</span>
                <span>Due in 2 weeks</span>
              </div>
              <div className="flex gap-2 mt-4">
                <Button className="flex-1" variant="outline">
                  View Details
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    handleEditProject('1', 'Website Redesign', 'Complete website redesign project')
                  }
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteProject('1', 'Website Redesign')}
                >
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mobile App */}
        <Card>
          <CardHeader>
            <CardTitle>Mobile App Development</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-muted-foreground">30%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '30%' }}></div>
              </div>
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>6 of 20 tasks</span>
                <span>Due in 1 month</span>
              </div>
              <Button className="w-full mt-4" variant="outline">
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Marketing Campaign */}
        <Card>
          <CardHeader>
            <CardTitle>Marketing Campaign</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-muted-foreground">90%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '90%' }}></div>
              </div>
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>18 of 20 tasks</span>
                <span>Due tomorrow</span>
              </div>
              <Button className="w-full mt-4" variant="outline">
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Internal Tools */}
        <Card>
          <CardHeader>
            <CardTitle>Internal Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-muted-foreground">100%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>8 of 8 tasks</span>
                <span>Completed</span>
              </div>
              <Button className="w-full mt-4" variant="outline">
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Client Portal */}
        <Card>
          <CardHeader>
            <CardTitle>Client Portal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-muted-foreground">45%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>9 of 20 tasks</span>
                <span>Due in 3 weeks</span>
              </div>
              <Button className="w-full mt-4" variant="outline">
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Research Project */}
        <Card>
          <CardHeader>
            <CardTitle>Research Project</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-muted-foreground">15%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '15%' }}></div>
              </div>
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>3 of 20 tasks</span>
                <span>Due in 2 months</span>
              </div>
              <Button className="w-full mt-4" variant="outline">
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Archived Projects */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Archived Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No archived projects</p>
            <Button variant="outline">View Archive</Button>
          </div>
        </CardContent>
      </Card>

      {/* Edit Project Dialog */}
      <Dialog open={!!editingProject} onOpenChange={() => setEditingProject(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-project-name">Project Name *</Label>
              <Input
                id="edit-project-name"
                placeholder="Enter project name"
                value={editingProject?.name || ''}
                onChange={(e) =>
                  setEditingProject(
                    editingProject ? { ...editingProject, name: e.target.value } : null,
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-project-description">Description</Label>
              <textarea
                id="edit-project-description"
                placeholder="Enter project description (optional)"
                value={editingProject?.description || ''}
                onChange={(e) =>
                  setEditingProject(
                    editingProject ? { ...editingProject, description: e.target.value } : null,
                  )
                }
                className="w-full min-h-[80px] px-3 py-2 border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditingProject(null)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit} disabled={!editingProject?.name.trim()}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Project Dialog */}
      <Dialog open={!!deletingProject} onOpenChange={() => setDeletingProject(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Are you sure you want to delete &quot;<strong>{deletingProject?.name}</strong>&quot;?
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeletingProject(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleConfirmDelete}>
                Delete Project
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Workspace Dialog */}
      <Dialog open={isCreateWorkspaceOpen} onOpenChange={setIsCreateWorkspaceOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Workspace</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="workspace-name">Workspace Name *</Label>
              <Input
                id="workspace-name"
                placeholder="Enter workspace name"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workspace-description">Description</Label>
              <textarea
                id="workspace-description"
                placeholder="Enter workspace description (optional)"
                value={workspaceDescription}
                onChange={(e) => setWorkspaceDescription(e.target.value)}
                className="w-full min-h-[80px] px-3 py-2 border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateWorkspaceOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateWorkspace} disabled={!workspaceName.trim()}>
                Create Workspace
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
