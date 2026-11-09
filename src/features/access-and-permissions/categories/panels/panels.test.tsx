import { screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { BUTTON_TEXTS, Endpoints } from '../../../../constants';
import { mockEndpoint, mockNetworkError, renderApp, fillFields, mockList } from '../../../../test';
import { buildCategory } from '../../../../test/factories/categories';
import { clickAction, pressIn } from '../../../../test/helpers/accessForms';
import { findPanel } from '../../../../test/helpers/panel';
import { CATEGORIES_CONSTANTS as CC, labelsFor, type CategoryScope } from '../constants';
import type { Category } from '../models';
import AddCategoryPanel from './AddCategoryPanel';
import EditCategoryPanel from './EditCategoryPanel';

const NEW_NAME = 'platform_ops';

const mockCategories = (scope: string, items: Category[]) =>
  mockList('exporter', Endpoints.CATEGORIES.GET_BY_SCOPE(scope), items);

const SCOPES: CategoryScope[] = [CC.SCOPES.ROLES, CC.SCOPES.GROUPS, CC.SCOPES.PLAN_KINDS];

describe.each(SCOPES)('create category panel (%s)', (scope) => {
  const L = labelsFor(scope);
  const NAME = L.PANELS.ADD_CATEGORY.NAME_LABEL;
  const SUBMIT = L.PANELS.ADD_CATEGORY.SUBMIT_BUTTON;

  const setup = async (items: Category[] = []) => {
    mockCategories(scope, items);
    const onClose = vi.fn();
    const view = renderApp(<AddCategoryPanel open onClose={onClose} scope={scope} />);
    const panel = await findPanel();
    await within(panel).findByLabelText(NAME);
    return { ...view, panel, onClose };
  };

  it('creates a category in its scope', async () => {
    const created = mockEndpoint('exporter', Endpoints.CATEGORIES.CREATE, { data: {} });
    const { user, panel, onClose } = await setup();

    await fillFields(user, { [NAME]: `  ${NEW_NAME}  ` });
    await pressIn(user, panel, SUBMIT);

    expect(await screen.findByText(L.MESSAGES.CATEGORY_CREATED(NEW_NAME))).toBeInTheDocument();
    expect(created.calls[0].body).toEqual({ name: NEW_NAME, scope, type: CC.TYPES.CUSTOM });
    expect(onClose).toHaveBeenCalled();
  });

  it('refuses a name that exists, in any case', async () => {
    const { user, panel } = await setup([buildCategory({ name: 'Platform_OPS', scope })]);

    await fillFields(user, { [NAME]: NEW_NAME });

    expect(
      await within(panel).findByText(L.PANELS.ADD_CATEGORY.NAME_EXISTS_MESSAGE),
    ).toBeInTheDocument();
    expect(within(panel).getByRole('button', { name: SUBMIT })).toBeDisabled();
  });

  it('reports a failed create and stays open', async () => {
    mockNetworkError('exporter', Endpoints.CATEGORIES.CREATE);
    const { user, panel, onClose } = await setup();

    await fillFields(user, { [NAME]: NEW_NAME });
    await pressIn(user, panel, SUBMIT);

    expect(await screen.findByText(L.MESSAGES.CATEGORY_CREATE_FAILED)).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('cancels without saving', async () => {
    const { user, onClose } = await setup();

    await clickAction(user, L.PANELS.ADD_CATEGORY.CANCEL);

    expect(onClose).toHaveBeenCalled();
  });
});

describe('edit category panel', () => {
  const L = labelsFor(CC.SCOPES.ROLES);
  const NAME = L.PANELS.EDIT_CATEGORY.NAME_LABEL;
  const category = buildCategory({ name: 'ops_team', scope: CC.SCOPES.ROLES });

  const setup = async (others: Category[] = []) => {
    mockCategories(CC.SCOPES.ROLES, [category, ...others]);
    const onClose = vi.fn();
    const view = renderApp(<EditCategoryPanel open onClose={onClose} editingCategory={category} />);
    const panel = await findPanel();
    await within(panel).findByDisplayValue(category.name);
    return { ...view, panel, onClose };
  };
  const save = (panel: Awaited<ReturnType<typeof setup>>['panel']) =>
    within(panel).getByRole('button', { name: BUTTON_TEXTS.SAVE_CHANGES });

  it('saves a new name', async () => {
    const updated = mockEndpoint('exporter', Endpoints.CATEGORIES.PATCH_BY_ID(category.id), {
      data: {},
    });
    const { user, panel, onClose } = await setup();
    expect(save(panel)).toBeDisabled();

    await fillFields(user, { [NAME]: NEW_NAME });
    await user.click(save(panel));

    expect(await screen.findByText(L.MESSAGES.CATEGORY_UPDATED(NEW_NAME))).toBeInTheDocument();
    expect(updated.calls[0].body).toEqual({ name: NEW_NAME });
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it('refuses the name of another category', async () => {
    const { user, panel } = await setup([buildCategory({ name: 'taken', scope: CC.SCOPES.ROLES })]);

    await fillFields(user, { [NAME]: 'taken' });

    expect(
      await within(panel).findByText(L.PANELS.EDIT_CATEGORY.NAME_EXISTS_MESSAGE),
    ).toBeInTheDocument();
    expect(save(panel)).toBeDisabled();
  });

  it('reports a failed save', async () => {
    mockNetworkError('exporter', Endpoints.CATEGORIES.PATCH_BY_ID(category.id));
    const { user, panel, onClose } = await setup();

    await fillFields(user, { [NAME]: NEW_NAME });
    await user.click(save(panel));

    expect(await screen.findByText(L.MESSAGES.CATEGORY_UPDATE_FAILED)).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('renders nothing without a category', () => {
    mockCategories(CC.SCOPES.ROLES, []);

    renderApp(<EditCategoryPanel open onClose={vi.fn()} editingCategory={null} />);

    expect(
      screen.queryByRole('button', { name: BUTTON_TEXTS.SAVE_CHANGES }),
    ).not.toBeInTheDocument();
  });
});
