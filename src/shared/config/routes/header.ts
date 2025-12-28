import { dynamicPaths, paths } from './paths';

export const headerTemplates = {
  todos: {
    type: 'static',
    descriptor: {
      title: 'Todos',
      breadcrumbs: [{ href: paths.todos, label: 'Todos' }],
    },
  },
  about: {
    type: 'static',
    descriptor: {
      title: 'About',
      breadcrumbs: [{ href: paths.about, label: 'About' }],
    },
  },
  profile: {
    type: 'static',
    descriptor: {
      title: 'Profile',
      breadcrumbs: [{ href: paths.profile, label: 'Profile' }],
    },
  },
  settings: {
    type: 'static',
    descriptor: {
      title: 'Settings',
      breadcrumbs: [{ href: paths.settings, label: 'Settings' }],
    },
  },
  todoDetail: {
    type: 'entity',
    fallback: {
      title: 'Loading todo...',
      breadcrumbs: [
        { href: paths.todos, label: 'Todos' },
        { href: '#', label: '...' },
      ],
    },
    build: (todo: { id: string; text: string }) => ({
      title: todo.text,
      breadcrumbs: [
        { href: paths.todos, label: 'Todos' },
        { href: dynamicPaths.todoDetail(todo.id), label: todo.text },
      ],
    }),
  },
  todoEdit: {
    type: 'entity',
    fallback: {
      title: 'Edit Todo',
      breadcrumbs: [
        { href: paths.todos, label: 'Todos' },
        { href: '#', label: '...' },
      ],
    },
    build: (todo: { id: string; text: string }) => ({
      title: `Edit: ${todo.text}`,
      breadcrumbs: [
        { href: paths.todos, label: 'Todos' },
        { href: dynamicPaths.todoDetail(todo.id), label: todo.text },
        { href: dynamicPaths.todoEdit(todo.id), label: 'Edit' },
      ],
    }),
  },
} as const;

export type HeaderTemplateKey = keyof typeof headerTemplates;
