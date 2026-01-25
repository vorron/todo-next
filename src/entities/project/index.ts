// API
export { projectApi } from './api/project-api';

// Schema и типы
export {
  projectSchema,
  createProjectSchema,
  updateProjectSchema,
  type Project,
  type CreateProject,
  type UpdateProject,
} from './model/schema';

// Form schemas
export {
  createProjectFormSchema,
  editProjectFormSchema,
  type CreateProjectFormData,
  type EditProjectFormData,
  getDefaultCreateProjectValues,
  getDefaultEditProjectValues,
} from './model/project-form-schemas';
