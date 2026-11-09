import { screen, waitFor } from '@testing-library/react';
import type { UserEvent } from '@testing-library/user-event';
import { Form } from 'antd';
import { useEffect, type ReactElement } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Endpoints, BUTTON_TEXTS } from '../../../../../constants';
import {
  clickButton,
  fillFields,
  mockEndpoint,
  renderApp,
  selectOption,
} from '../../../../../test';
import { buildApplication } from '../../../../../test/factories/applications';
import { buildPlan } from '../../../../../test/factories/plans';
import { clickInDialog } from '../../../../../test/helpers/dialogs';
import { mockPlanForm } from '../../../../../test/helpers/featureApi';
import { pickPolicy } from '../../../../../test/helpers/planForm';
import { CREATE_PANEL_TEXTS as T } from '../../constants/createPanel';
import {
  PROTECTION_PLANS_CONSTANTS as PPC,
  PLAN_NAME_VALIDATION,
  POLICY_CHIP_LABEL,
} from '../../constants/protectionPlans';
import type { ProtectionPlan } from '../../models';
import CreatePlanPanel from './CreatePlanPanel';
import DuplicatePlanPanel from './DuplicatePlanPanel';
import EditPlanPanel from './EditPlanPanel';

const { FORM } = PPC.CREATE_PAGE;
const ENFORCE_OPTION = PPC.CREATE_PAGE.MODE_OPTIONS[1].label;
const MEDIUM = PPC.CREATE_PAGE.SEVERITY_OPTIONS[1].label;
const DELETES = POLICY_CHIP_LABEL['block-delete'];

// A form-level prefill for the tests whose subject is not the typing, which is slow under load.
const FILLED = { name: 'freeze', severity: 'medium', namespaces: ['payments'] };

const CreateHost = ({
  onClose,
  values,
}: {
  onClose: () => void;
  values?: typeof FILLED;
}): ReactElement => {
  const [form] = Form.useForm();
  useEffect(() => {
    if (values) form.setFieldsValue(values);
  }, [form, values]);
  return <CreatePlanPanel open onClose={onClose} form={form} />;
};

const EditHost = ({ plan, onClose }: { plan: ProtectionPlan; onClose: () => void }) => {
  const [form] = Form.useForm();
  return <EditPlanPanel open plan={plan} onClose={onClose} form={form} />;
};

type PlanFormSetup = Parameters<typeof mockPlanForm>[0];

const openForm = async (
  setup: PlanFormSetup,
  panel: (onClose: () => void) => ReactElement,
  findLoaded: () => Promise<HTMLElement>,
) => {
  mockPlanForm(setup);
  const onClose = vi.fn();
  const { user } = renderApp(panel(onClose));
  await findLoaded();
  return { user, onClose };
};

const openCreate = (setup: PlanFormSetup = {}, values?: typeof FILLED) =>
  openForm(
    setup,
    (onClose) => <CreateHost onClose={onClose} values={values} />,
    () => screen.findByText(FORM.ADD_POLICY_BUTTON),
  );

describe('create plan panel', () => {
  const created = buildPlan({ name: FILLED.name, phase: 'active', mode: 'audit' });
  const mockPrepare = (plan = created) =>
    mockEndpoint('discovery', Endpoints.PROTECTION_PLANS.PREPARE, { data: plan });

  const submitAudit = async (user: UserEvent) => {
    await pickPolicy(user, DELETES);
    await clickButton(user, T.SUBMIT.audit);
  };

  it('sends the plan and says what happens next', async () => {
    const prepare = mockPrepare();
    const { user, onClose } = await openCreate();

    await user.click(screen.getByLabelText(FORM.NAME_LABEL));
    await user.paste(FILLED.name);
    await selectOption(user, FORM.SEVERITY_LABEL, MEDIUM);
    await selectOption(user, FORM.NAMESPACES_LABEL, 'payments');
    await submitAudit(user);

    await waitFor(() => expect(prepare.calls).toHaveLength(1));
    expect(prepare.calls[0].body).toMatchObject({
      name: FILLED.name,
      severity: 'medium',
      mode: 'audit',
      timeMode: 'permanent',
      scope: { type: 'namespaces', namespaces: ['payments'] },
      policies: [{ templateID: 'block-delete', params: {} }],
    });
    expect(await screen.findByText(T.TOASTS.audit(created.name, ''))).toBeInTheDocument();
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('asks before enforcing at once', async () => {
    const prepare = mockPrepare({ ...created, mode: 'enforce' });
    const { user } = await openCreate({}, FILLED);

    await pickPolicy(user, DELETES);
    await selectOption(user, new RegExp(FORM.MODE_LABEL), ENFORCE_OPTION);
    await clickButton(user, T.SUBMIT.enforce);
    await clickInDialog(user, T.CONFIRM.OK);

    await waitFor(() => expect(prepare.calls).toHaveLength(1));
    expect(prepare.calls[0].body).toMatchObject({ mode: 'enforce' });
  });

  it('keeps the panel open with the reason when the server refuses', async () => {
    mockEndpoint(
      'discovery',
      Endpoints.PROTECTION_PLANS.PREPARE,
      { message: 'Quota reached' },
      { status: 409 },
    );
    const { user, onClose } = await openCreate({}, FILLED);

    await submitAudit(user);

    expect(await screen.findByText('Quota reached')).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('refuses a name another plan holds', async () => {
    const { user } = await openCreate({ plans: [buildPlan({ name: FILLED.name })] });

    await fillFields(user, { [FORM.NAME_LABEL]: FILLED.name });

    expect(
      await screen.findByText(PLAN_NAME_VALIDATION.duplicateErrorMessage as string),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: new RegExp(T.SUBMIT.audit) })).toBeDisabled();
  });

  it('keeps the submit disabled until a policy is picked', async () => {
    await openCreate({}, FILLED);

    expect(screen.getByRole('button', { name: new RegExp(T.SUBMIT.audit) })).toBeDisabled();
  });

  it('asks for the required parameters of a policy', async () => {
    const { user } = await openCreate();

    await pickPolicy(user, 'Block tags');

    expect(await screen.findByText(FORM.PARAM_PLACEHOLDER('Tags'))).toBeInTheDocument();
    expect(screen.getByText(FORM.PARAM_REQUIRED_ERROR)).toBeInTheDocument();
  });

  it('turns to approval when execution requires it', async () => {
    const { user } = await openCreate();

    await selectOption(
      user,
      FORM.APPROVAL_MODE_LABEL,
      PPC.CREATE_PAGE.APPROVAL_MODE_OPTIONS[1].label,
    );

    expect(
      await screen.findByRole('button', { name: new RegExp(T.SUBMIT.approval) }),
    ).toBeInTheDocument();
  });

  it('targets applications when the scope type changes', async () => {
    const application = buildApplication({ name: 'orders', displayName: 'Orders' });
    const prepare = mockPrepare();
    mockEndpoint('exporter', Endpoints.APPLICATIONS.GET_DETAILS('orders'), { data: application });
    const { user } = await openCreate({ applications: [application] }, FILLED);

    await selectOption(user, FORM.SCOPE_TYPE_LABEL, PPC.CREATE_PAGE.SCOPE_TYPE_OPTIONS[0].label);
    await selectOption(user, FORM.APPLICATIONS_LABEL, 'Orders (payments)');
    await submitAudit(user);

    await waitFor(() => expect(prepare.calls).toHaveLength(1));
    expect(prepare.calls[0].body).toMatchObject({
      scope: { type: 'applications', applicationRefs: ['orders'], namespaces: [] },
    });
  });
});

describe('edit plan panel', () => {
  const plan = buildPlan({
    id: 'plan-e',
    name: 'freeze-orders',
    severity: 'low',
    scope: { type: 'namespaces', applicationRefs: [], namespaces: ['payments'] },
  });

  const openEdit = (target = plan) =>
    openForm(
      { plans: [target] },
      (onClose) => <EditHost plan={target} onClose={onClose} />,
      () => screen.findByDisplayValue(target.name),
    );

  it('keeps Save disabled until something changes', async () => {
    await openEdit();

    expect(screen.getByRole('button', { name: BUTTON_TEXTS.SAVE_CHANGES })).toBeDisabled();
  });

  it('saves a change and reports it', async () => {
    const update = mockEndpoint('discovery', Endpoints.PROTECTION_PLANS.UPDATE(plan.id), {
      data: { ...plan, description: 'Updated' },
    });
    const { user, onClose } = await openEdit();

    await fillFields(user, { [FORM.DESCRIPTION_LABEL]: 'Updated' });
    await clickButton(user, BUTTON_TEXTS.SAVE_CHANGES);

    await waitFor(() => expect(update.calls).toHaveLength(1));
    expect(update.calls[0].body).toMatchObject({ description: 'Updated', name: plan.name });
    expect(update.calls[0].body).not.toHaveProperty('approvalMode');
    expect(
      await screen.findByText(PPC.LABELS.ACTIONS.UPDATE_SUCCESS(plan.name)),
    ).toBeInTheDocument();
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('locks material fields of an approved running plan', async () => {
    const locked = buildPlan({ name: 'locked', approvalMode: 'required', phase: 'active' });

    await openEdit(locked);

    expect(await screen.findByText(PPC.PANELS.EDIT.APPROVED_LOCKED_ALERT)).toBeInTheDocument();
  });

  it('warns that a scope edit on an active plan redeploys', async () => {
    const active = buildPlan({
      name: 'active-freeze',
      phase: 'active',
      scope: { type: 'namespaces', applicationRefs: [], namespaces: ['payments'] },
    });
    const { user } = await openEdit(active);

    await selectOption(user, FORM.NAMESPACES_LABEL, 'ops');

    expect(await screen.findByText(PPC.PANELS.EDIT.ACTIVE_SCOPE_WARNING)).toBeInTheDocument();
  });
});

describe('duplicate plan panel', () => {
  const plan = buildPlan({ id: 'plan-d', name: 'freeze-orders' });

  const openDuplicate = () =>
    openForm(
      { plans: [plan] },
      (onClose) => <DuplicatePlanPanel open plan={plan} onClose={onClose} />,
      () => screen.findByDisplayValue(`Copy of ${plan.name}`),
    );
  const actionsLabel = PPC.LABELS.DETAIL_PAGE.ACTIONS.DUPLICATE;

  it('copies the plan under a new name and opens it', async () => {
    const copy = mockEndpoint('discovery', Endpoints.PROTECTION_PLANS.DUPLICATE(plan.id), {
      data: buildPlan({ name: 'freeze-orders-2' }),
    });
    const { user, onClose } = await openDuplicate();

    await fillFields(user, { [FORM.NAME_LABEL]: 'freeze-orders-2' });
    await clickButton(user, actionsLabel);

    await waitFor(() => expect(copy.calls).toHaveLength(1));
    expect(copy.calls[0].body).toEqual({ name: 'freeze-orders-2', timeMode: 'permanent' });
    expect(await screen.findByText(PPC.LABELS.ACTIONS.DUPLICATE_SUCCESS)).toBeInTheDocument();
    await waitFor(() => expect(onClose).toHaveBeenCalledOnce());
  });

  it('shows why the copy failed', async () => {
    mockEndpoint(
      'discovery',
      Endpoints.PROTECTION_PLANS.DUPLICATE(plan.id),
      { message: 'Name taken' },
      { status: 409 },
    );
    const { user } = await openDuplicate();

    await fillFields(user, { [FORM.NAME_LABEL]: 'freeze-orders-2' });
    await clickButton(user, actionsLabel);

    expect(await screen.findByText('Name taken')).toBeInTheDocument();
  });

  it('refuses the name of an existing plan', async () => {
    const { user } = await openDuplicate();

    await fillFields(user, { [FORM.NAME_LABEL]: plan.name });

    expect(
      await screen.findByText(PLAN_NAME_VALIDATION.duplicateErrorMessage as string),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: actionsLabel })).toBeDisabled();
  });

  it('needs dates before a time-ranged copy can be submitted', async () => {
    const { user } = await openDuplicate();

    await selectOption(user, FORM.TIME_MODE_LABEL, PPC.CREATE_PAGE.TIME_MODE_OPTIONS[1].label);

    expect(await screen.findByRole('button', { name: actionsLabel })).toBeDisabled();
  });
});
