import type { Metadata } from 'next';
import { paths, type StaticPath } from './paths';

export const metadataConfig = {
  [paths.home]: {
    title: 'Home - Todo App',
    description: 'Welcome to our application',
  },
  [paths.login]: {
    title: 'Login - Todo App',
    description: 'Sign in to your account',
  },
  [paths.about]: {
    title: 'About - Todo App',
    description: 'Learn about our application',
  },
  [paths.todos]: {
    title: 'My Todos - Todo App',
    description: 'Manage your tasks',
  },
  [paths.profile]: {
    title: 'Profile - Todo App',
    description: 'Manage your account',
  },
  [paths.settings]: {
    title: 'Settings - Todo App',
    description: 'Customize your experience',
  },
} as const satisfies Record<StaticPath, Metadata>;

export const dynamicMetadata = {
  todoDetail: (title: string): Metadata => ({
    title: `${title} - Todo App`,
    description: `Details for ${title}`,
  }),
  todoEdit: (title: string): Metadata => ({
    title: `Edit ${title} - Todo App`,
    description: `Edit details for ${title}`,
  }),
} as const;

export type MetadataKey = keyof typeof metadataConfig;

export function getStaticMetadata(path: string): Metadata | undefined {
  return metadataConfig[path as MetadataKey];
}
