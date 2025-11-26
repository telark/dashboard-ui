import type { ResourceListResponse, ResourceDetailsResponse } from '../../../../interfaces/http';

export type CategoryType = 'built-in' | 'custom';

export interface Category {
  id: string;
  name: string;
  scope: string;
  type: CategoryType;
  creationDate: string;
}

export type CategoryListResponse = ResourceListResponse<Category>;
export type CategoryResponse = ResourceDetailsResponse<Category>;
