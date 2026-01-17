/**
 * Project Management Library
 * Бизнес-логика для управления проектами без UI
 */

export interface ProjectData {
  name: string;
  description?: string;
}

export interface ProjectValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Валидирует данные проекта
 */
export function validateProjectData(data: ProjectData): ProjectValidationResult {
  const errors: string[] = [];

  if (!data.name || data.name.trim().length === 0) {
    errors.push('Project name is required');
  }

  if (data.name && data.name.trim().length > 100) {
    errors.push('Project name must be less than 100 characters');
  }

  if (data.description && data.description.length > 500) {
    errors.push('Description must be less than 500 characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Подготавливает данные проекта для создания
 */
export function prepareProjectData(data: ProjectData): ProjectData {
  return {
    name: data.name.trim(),
    description: data.description?.trim() || undefined,
  };
}

/**
 * Проверяет, можно ли создавать проект
 */
export function canCreateProject(data: ProjectData): boolean {
  return validateProjectData(data).isValid;
}
