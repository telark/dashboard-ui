import { Endpoints } from '../../../../constants';
import { describeClients } from '../../../../test';
import { describeVoidClients } from '../../../../test/contracts/voidClients';
import { describeSilentClients } from '../../../../test/helpers/silentClients';
import { createCategory, deleteCategory, fetchCategoriesByScope, updateCategory } from '.';

const CATEGORY_ID = 'category-1';
const SCOPE = 'roles';

describeClients('categories', [
  {
    name: 'fetchCategoriesByScope',
    service: 'exporter',
    endpoint: Endpoints.CATEGORIES.GET_BY_SCOPE(SCOPE),
    call: () => fetchCategoriesByScope(SCOPE),
    response: { data: { items: [] } },
  },
  {
    name: 'createCategory',
    service: 'exporter',
    endpoint: Endpoints.CATEGORIES.CREATE,
    call: () => createCategory({ name: 'ops', scope: SCOPE, type: 'custom' }),
    response: { data: { id: CATEGORY_ID } },
    body: { name: 'ops', scope: SCOPE, type: 'custom' },
  },
  {
    name: 'updateCategory',
    service: 'exporter',
    endpoint: Endpoints.CATEGORIES.PATCH_BY_ID(CATEGORY_ID),
    call: () => updateCategory(CATEGORY_ID, { name: 'renamed' }),
    response: { data: { id: CATEGORY_ID } },
    body: { name: 'renamed' },
  },
]);

describeSilentClients('categories', [
  {
    name: 'fetchCategoriesByScope',
    endpoint: Endpoints.CATEGORIES.GET_BY_SCOPE(SCOPE),
    call: () => fetchCategoriesByScope(SCOPE, true),
  },
]);

describeVoidClients('categories', [
  {
    name: 'deleteCategory',
    service: 'exporter',
    endpoint: Endpoints.CATEGORIES.DELETE_BY_ID(CATEGORY_ID),
    call: () => deleteCategory(CATEGORY_ID),
  },
]);
