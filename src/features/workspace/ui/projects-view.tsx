'use client';

import { useState } from 'react';

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

import {
  canCreateProject,
  prepareProjectData,
  validateProjectData,
} from '../lib/project-management';

import type { Workspace } from '@/entities/workspace/model/schema';

export interface ProjectsViewProps {
  workspace: Workspace;
  className?: string;
}

export function ProjectsView({ workspace, className }: ProjectsViewProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const handleCreateProject = () => {
    const projectData = prepareProjectData({
      name: newProjectName,
      description: newProjectDescription,
    });

    const validation = validateProjectData(projectData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // TODO: Implement project creation logic
    console.log('Creating project:', projectData);

    // Reset form
    setNewProjectName('');
    setNewProjectDescription('');
    setErrors([]);
    setIsCreateDialogOpen(false);
  };

  return (
    <div className={className}>
      {/* Projects List */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Active Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">No projects yet</p>
            <p className="text-sm text-gray-500 mt-2">Create your first project to get started</p>
          </div>
        </CardContent>
      </Card>

      {/* Create New Project */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Project</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="project-name">Project Name</Label>
              <Input
                id="project-name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Enter project name"
              />
            </div>
            <div>
              <Label htmlFor="project-description">Description</Label>
              <Input
                id="project-description"
                value={newProjectDescription}
                onChange={(e) => setNewProjectDescription(e.target.value)}
                placeholder="Enter project description"
              />
            </div>

            {errors.length > 0 && (
              <div className="space-y-1">
                {errors.map((error, index) => (
                  <p key={index} className="text-sm text-red-600">
                    {error}
                  </p>
                ))}
              </div>
            )}

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="w-full"
                  disabled={
                    !canCreateProject({ name: newProjectName, description: newProjectDescription })
                  }
                >
                  Create Project
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Project Creation</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <p>
                      <strong>Workspace:</strong> {workspace.name}
                    </p>
                    <p>
                      <strong>Project Name:</strong> {newProjectName || 'Untitled'}
                    </p>
                    {newProjectDescription && (
                      <p>
                        <strong>Description:</strong> {newProjectDescription}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateProject}>Create Project</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
