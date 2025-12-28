export type HeaderBreadcrumb = {
  href: string;
  label: string;
};

export type HeaderDescriptor = {
  title: string;
  breadcrumbs: readonly HeaderBreadcrumb[];
};

export type HeaderTemplate<T> =
  | {
      type: 'static';
      descriptor: HeaderDescriptor;
    }
  | {
      type: 'entity';
      build: (item: T) => HeaderDescriptor;
      fallback?: HeaderDescriptor;
    };
