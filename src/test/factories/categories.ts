import type { Category } from '../../features/access-and-permissions/categories/models';
import { createFactory } from '../factory';

export const buildCategory = createFactory<Category>((sequence) => ({
  id: `category-${sequence}`,
  name: `release_category_${sequence}`,
  scope: 'roles',
  type: 'custom',
  creationDate: '2026-01-15T10:00:00Z',
}));
