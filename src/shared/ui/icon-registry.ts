import { Check, Undo2, Pencil, Trash2 } from 'lucide-react';

import type { LucideIcon } from 'lucide-react';

export type IconName = 'Check' | 'Undo2' | 'Pencil' | 'Trash2';

const iconRegistry: Record<IconName, LucideIcon> = {
  Check,
  Undo2,
  Pencil,
  Trash2,
};

export function getIconByName(name: IconName): LucideIcon | undefined {
  return iconRegistry[name];
}
