'use client';

import { useState } from 'react';

import { type CreateProjectFormData } from '@/entities/project/model/project-form-schemas';
import { type Workspace } from '@/entities/workspace/model/schema';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Form,
  DataErrorState,
  DataLoadingState,
} from '@/shared/ui';

import { ProjectFormFields } from './project-form-fields';
import { useProjects } from '../model/queries/use-projects';
import { useProjectForm } from '../model/use-project-form';

export interface ProjectsViewProps {
  workspace: Workspace;
  className?: string;
}

export function ProjectsView({ workspace, className }: ProjectsViewProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Получаем проекты из API
  const { data: projects = [], isLoading, error } = useProjects();

  const { form, onSubmit, isSubmitting } = useProjectForm({
    workspaceId: workspace.id,
    onSuccess: (data: CreateProjectFormData) => {
      console.log('Project created:', data);
      setIsCreateDialogOpen(false);
      // Проект автоматически обновится через RTK Query cache invalidation
    },
  });

  return (
    <div className={className}>
      {/* Projects List */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Активные проекты</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <DataLoadingState message="Загрузка проектов..." />
          ) : error ? (
            <DataErrorState
              title="Ошибка загрузки проектов"
              error={error}
              onRetry={() => window.location.reload()}
            />
          ) : projects.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Пока нет проектов</p>
              <p className="text-sm text-gray-500 mt-2">Создайте первый проект для начала работы</p>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <h4 className="font-medium">{project.name}</h4>
                    {project.description && (
                      <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        project.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {project.isActive ? 'Активен' : 'Неактивен'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create New Project */}
      <Card>
        <CardHeader>
          <CardTitle>Создать новый проект</CardTitle>
        </CardHeader>
        <CardContent>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">Создать проект</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Создание проекта</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={onSubmit} className="space-y-4">
                  <ProjectFormFields
                    control={form.control}
                    disabled={isSubmitting}
                    showSubmitButton={true}
                  />
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
