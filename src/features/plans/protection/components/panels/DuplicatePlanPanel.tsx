import React, { useEffect, useMemo, useState } from 'react';
import { App as AntdApp, Form, Input, Select } from 'antd';
import type { Dayjs } from 'dayjs';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { SlideOutPanel } from '../../../../../components/display/panels/slide-out';
import { APP_ROUTES, DEFAULT_COLORS, FILTER_PANEL } from '../../../../../constants';
import DatePicker from '../../../../../components/display/inputs/DatePicker';
import { zonedNow } from '../../../../../utils/layout';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../../constants/protectionPlans';
import { duplicatePlanThunk } from '../../store';
import { usePlanNameCheck } from '../../hooks/usePlanNameCheck';
import type { AppDispatch } from '../../../../../store';
import type { PlanApprovalMode, ProtectionPlan } from '../../models';
import { mapCategoriesToOptions } from '../../../../access-and-permissions/categories/utils/helpers';
import { usePlanTaxonomyLists } from '../../hooks/usePlanTaxonomies';
import PlanTaxonomyFields from '../shared/PlanTaxonomyFields';
import PlanApprovalModeField from '../shared/PlanApprovalModeField';
import RepeatFields from '../shared/RepeatFields';
import type { RepeatFormValues } from '../create/types';
import { repeatFormValues, repeatPayload } from '../../utils/planFormValues';
import type { DuplicatePlanPayload } from '../../clients';

const { FORM } = PPC.CREATE_PAGE;

interface DuplicatePlanPanelProps {
  open: boolean;
  onClose: () => void;
  plan: ProtectionPlan | null;
}

interface DuplicateFormShape extends RepeatFormValues {
  name?: string;
  timeMode?: string;
  startAt?: Dayjs;
  endAt?: Dayjs;
  kindRef?: string;
  environmentRef?: string;
  tagRefs?: string[];
  approvalMode?: PlanApprovalMode;
}

// Untouched classification, and a rule the form never showed, are left to the server: it copies the source's.
const buildDuplicatePayload = (
  v: DuplicateFormShape,
  touched: (fields: string[]) => boolean,
): DuplicatePlanPayload => {
  const timeMode = v.timeMode ?? 'permanent';
  const payload: DuplicatePlanPayload = { name: (v.name ?? '').trim(), timeMode };
  if (touched(['kindRef'])) payload.kindRef = v.kindRef ?? '';
  if (touched(['environmentRef', 'tagRefs'])) {
    payload.environmentRef = v.environmentRef ?? '';
    payload.tagRefs = v.tagRefs ?? [];
  }
  if (touched(['approvalMode'])) payload.approvalMode = v.approvalMode;
  if (timeMode === 'time_range' && v.startAt && v.endAt) {
    payload.timeRange = { startAt: v.startAt.toISOString(), endAt: v.endAt.toISOString() };
  }
  if (timeMode === 'repeating' && v.repeatDays?.length) payload.repeat = repeatPayload(v);
  return payload;
};

const DuplicatePlanPanel: React.FC<DuplicatePlanPanelProps> = ({ open, onClose, plan }) => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { message } = AntdApp.useApp();
  const [form] = Form.useForm();
  const { nameValidator, nameInvalid } = usePlanNameCheck(form, open);
  useEffect(() => {
    if (open) form.resetFields();
  }, [open, form]);
  const { kinds, environments, tags } = usePlanTaxonomyLists();
  const planKindOptions = useMemo(() => mapCategoriesToOptions(kinds), [kinds]);
  const environmentOptions = useMemo(() => mapCategoriesToOptions(environments), [environments]);
  const tagOptions = useMemo(() => mapCategoriesToOptions(tags), [tags]);
  const watchedStartAt = Form.useWatch('startAt', form) as Dayjs | undefined;
  const watchedEndAt = Form.useWatch('endAt', form) as Dayjs | undefined;
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Read from the form: the panel can stay mounted, and a reset on reopen restores the source's mode.
  const timeMode =
    (Form.useWatch('timeMode', form) as string | undefined) ?? plan?.timeMode ?? 'permanent';

  const initialValues = useMemo<Record<string, unknown>>(() => {
    return {
      name: plan ? `Copy of ${plan.name}` : '',
      timeMode: plan?.timeMode ?? 'permanent',
      startAt: undefined,
      endAt: undefined,
      ...repeatFormValues(plan?.timeMode === 'repeating' ? plan.repeat : undefined),
      kindRef: plan?.kindRef || undefined,
      environmentRef: plan?.environmentRef || undefined,
      tagRefs: plan?.tagRefs ?? [],
      approvalMode: plan?.approvalMode ?? 'automatic',
    };
  }, [plan]);

  const isTimeRangeIncomplete = timeMode === 'time_range' && (!watchedStartAt || !watchedEndAt);
  const submitDisabled = nameInvalid || isTimeRangeIncomplete;

  const handleClose = () => {
    setError(null);
    onClose();
  };

  const handleSubmit = async (values: Record<string, unknown>) => {
    if (!plan) return;

    setSubmitting(true);
    setError(null);
    try {
      const payload = buildDuplicatePayload(values as DuplicateFormShape, (fields) =>
        form.isFieldsTouched(fields),
      );
      const created = await dispatch(
        duplicatePlanThunk({ planId: plan.id, overrides: payload }),
      ).unwrap();
      message.success(PPC.LABELS.ACTIONS.DUPLICATE_SUCCESS);
      handleClose();
      navigate(
        APP_ROUTES.PROTECTION_PLAN_DETAILS.replace(':name', encodeURIComponent(created.name)),
      );
    } catch (err: unknown) {
      const text =
        typeof err === 'string'
          ? err
          : err instanceof Error
            ? err.message
            : PPC.LABELS.ACTIONS.DUPLICATE_ERROR;
      setError(text);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const formContent = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Form.Item
        name="name"
        label={FORM.NAME_LABEL}
        validateTrigger={['onChange', 'onBlur']}
        rules={[
          { required: true, message: FORM.NAME_REQUIRED_ERROR },
          { validator: nameValidator },
        ]}
        style={{ marginBottom: 0 }}
      >
        <Input placeholder={FORM.NAME_PLACEHOLDER} />
      </Form.Item>

      <Form.Item name="timeMode" label={FORM.TIME_MODE_LABEL} style={{ marginBottom: 0 }}>
        <Select options={PPC.CREATE_PAGE.TIME_MODE_OPTIONS} style={{ width: '100%' }} />
      </Form.Item>

      <PlanTaxonomyFields
        planKindOptions={planKindOptions}
        environmentOptions={environmentOptions}
        tagOptions={tagOptions}
      />
      <PlanApprovalModeField />

      {timeMode === 'time_range' && (
        <div style={{ ...FILTER_PANEL.DATE_RANGE_CONTAINER, alignItems: 'flex-end' }}>
          <div style={FILTER_PANEL.DATE_INPUT_WRAPPER}>
            <Form.Item
              name="startAt"
              label={FORM.START_AT_LABEL}
              style={{ marginBottom: 0 }}
              rules={[{ required: true, message: 'Start time is required' }]}
            >
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm"
                style={FILTER_PANEL.DATE_INPUT}
                disabledDate={(d) => d.isBefore(zonedNow(), 'day')}
              />
            </Form.Item>
          </div>
          <div style={{ ...FILTER_PANEL.DATE_ARROW, marginBottom: 4 }}>→</div>
          <div style={FILTER_PANEL.DATE_INPUT_WRAPPER}>
            <Form.Item
              name="endAt"
              label={FORM.END_AT_LABEL}
              style={{ marginBottom: 0 }}
              rules={[
                { required: true, message: 'End time is required' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const start = getFieldValue('startAt') as Dayjs | undefined;
                    if (!value || !start || (value as Dayjs).isAfter(start)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('End must be after start'));
                  },
                }),
              ]}
            >
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm"
                style={FILTER_PANEL.DATE_INPUT}
                disabledDate={(d) => d.isBefore(zonedNow(), 'day')}
              />
            </Form.Item>
          </div>
        </div>
      )}

      {timeMode === 'repeating' && <RepeatFields />}

      {error && <div style={{ color: DEFAULT_COLORS.DANGER, fontSize: 13 }}>{error}</div>}
    </div>
  );

  return (
    <SlideOutPanel
      open={open}
      onClose={handleClose}
      title={PPC.LABELS.DETAIL_PAGE.ACTIONS.DUPLICATE_PANEL_TITLE}
      formContent={formContent}
      onSubmit={handleSubmit}
      onCancel={handleClose}
      submitButtonText={PPC.LABELS.DETAIL_PAGE.ACTIONS.DUPLICATE}
      loading={submitting}
      disabled={submitDisabled}
      form={form}
      initialValues={initialValues}
    />
  );
};

export default DuplicatePlanPanel;
