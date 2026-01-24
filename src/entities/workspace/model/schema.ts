import z from 'zod';

export const workspaceSchema = z.object({
  id: z.string().min(1, 'Workspace ID is required'),
  name: z
    .string()
    .min(1, 'Workspace name is required')
    .max(500, 'Todo text must be at most 500 characters')
    .trim(),
  description: z.string().nullable().optional(),
  isDefault: z.boolean().default(false),
  ownerId: z.string().min(1, 'Owner ID is required'),
  createdAt: z
    .string()
    .optional()
    .default(() => new Date().toISOString()),
  updatedAt: z
    .string()
    .optional()
    .default(() => new Date().toISOString()),
});

export type Workspace = z.infer<typeof workspaceSchema>;

// Схема для создания workspace
export const createWorkspaceSchema = workspaceSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial({
    isDefault: true, // isDefault опционален при создании
  });

// Схема для обновления workspace
export const updateWorkspaceSchema = workspaceSchema.partial().required({ id: true });

export const workspaceUserSchema = z.object({
  id: z.string().min(1),
  workspaceId: z.string().min(1),
  userId: z.string().min(1),
  role: z.enum(['admin', 'member']),
  joinedAt: z
    .string()
    .optional()
    .default(() => new Date().toISOString()),
  createdAt: z
    .string()
    .optional()
    .default(() => new Date().toISOString()),
  updatedAt: z
    .string()
    .optional()
    .default(() => new Date().toISOString()),
});

export type WorkspaceUser = z.infer<typeof workspaceUserSchema>;

export const inviteSchema = z.object({
  id: z.string(),
  workspaceId: z.string(),
  email: z.email().optional(),
  token: z.string(),
  role: z.enum(['admin', 'member']),
  expiresAt: z.iso.datetime(),
  createdAt: z.iso.datetime(),
});
