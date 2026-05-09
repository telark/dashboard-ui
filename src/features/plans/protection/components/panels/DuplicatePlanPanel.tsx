import React, { useMemo, useState } from 'react';
import { Form, Input, Select } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { SlideOutPanel } from '../../../../../components/display/panels/slide-out';
import { APP_ROUTES, DEFAULT_COLORS, FILTER_PANEL } from '../../../../../constants';
import DatePicker from '../../../../../components/display/inputs/DatePicker';
import { createNameValidator } from '../../../../shared/utils/nameValidation';
import { DEFAULT_NAME_VALIDATION_CONFIG } from '../../../../shared/constants/nameValidation';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../../constants/protectionPlans';
import { duplicatePlanThunk, selectProtectionPlans } from '../../store';
import { getCurrentUser } from '../../../../auth/utils';
import type { AppDispatch, RootState } from '../../../../../store';
import type { ProtectionPlan } from '../../models';

const { FORM } = PPC.CREATE_PAGE;

interface DuplicatePlanPanelProps {
  open: boolean;
  onClose: () => void;
  plan: ProtectionPlan | null;
}

interface DuplicateFormShape {
  name?: string;
  timeMode?: string;
  startAt?: Dayjs;
  endAt?: Dayjs;
}

const DuplicatePlanPanel: React.FC<DuplicatePlanPanelProps> = ({ open, onClose, plan }) => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const plans = useSelector((s: RootState) => selectProtectionPlans(s));
  const [form] = Form.useForm();
  const watchedName = Form.useWatch('name', form);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeMode, setTimeMode] = useState<string>(plan?.timeMode ?? 'permanent');

  const initialValues = useMemo<Record<string, unknown>>(() => {
    const startAt = plan?.timeRange?.startAt ? dayjs(plan.timeRange.startAt) : undefined;
    const endAt = plan?.timeRange?.endAt ? dayjs(plan.timeRange.endAt) : undefined;
    return {
      name: plan ? `Copy of ${plan.name}` : '',
      timeMode: plan?.timeMode ?? 'permanent',
      startAt,
      endAt,
    };
  }, [plan]);

  const fallbackName =
    typeof initialValues.name === 'string' ? (initialValues.name as string) : '';
  const effectiveName = typeof watchedName === 'string' ? watchedName : fallbackName;
  const trimmedName = effectiveName.trim();
  const isDuplicate = useMemo(
    () => plans.some((p) => p.name.toLowerCase() === trimmedName.toLowerCase()),
    [plans, trimmedName],
  );
  const isNameInvalid = trimmedName.length === 0 || isDuplicate;

  const nameValidationConfig = useMemo(
    () => ({
      ...DEFAULT_NAME_VALIDATION_CONFIG,
      minLength: 1,
      maxLength: 64,
      allowedPattern: /^[a-zA-Z0-9_\- ]+$/,
      duplicateErrorMessage: 'A plan with this name already exists',
      invalidCharsErrorMessage:
        'Name can only contain letters, numbers, spaces, hyphens (-), and underscores (_)',
    }),
    [],
  );

  const nameValidator = useMemo(
    () => createNameValidator(plans, (p: ProtectionPlan) => p.name, nameValidationConfig),
    [plans, nameValidationConfig],
  );

  const handleClose = () => {
    setError(null);
    onClose();
  };

  const handleValuesChange = (_changed: unknown, all: Record<string, unknown>) => {
    const next = (all as DuplicateFormShape).timeMode;
    if (typeof next === 'string' && next !== timeMode) {
      setTimeMode(next);
    }
  };

  const handleSubmit = async (values: Record<string, unknown>) => {
    if (!plan) return;
    const userId = getCurrentUser()?.id;
    if (!userId) return;

    const v = values as DuplicateFormShape;
    setSubmitting(true);
    setError(null);
    try {
      const payload: {
        name: string;
        timeMode: string;
        timeRange?: { startAt: string; endAt: string };
      } = {
        name: (v.name ?? '').trim(),
        timeMode: v.timeMode ?? 'permanent',
      };
      if (payload.timeMode === 'time_range' && v.startAt && v.endAt) {
        payload.timeRange = {
          startAt: v.startAt.toISOString(),
          endAt: v.endAt.toISOString(),
        };
      }
      const created = await dispatch(
        duplicatePlanThunk({ userId, planId: plan.id, overrides: payload }),
      ).unwrap();
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
          { required: true, message: 'Plan name is required' },
          { validator: nameValidator },
        ]}
        style={{ marginBottom: 0 }}
      >
        <Input placeholder={FORM.NAME_PLACEHOLDER} />
      </Form.Item>

      <Form.Item name="timeMode" label={FORM.TIME_MODE_LABEL} style={{ marginBottom: 0 }}>
        <Select options={PPC.CREATE_PAGE.TIME_MODE_OPTIONS} style={{ width: '100%' }} />
      </Form.Item>

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
                disabledDate={(d) => d.isBefore(dayjs(), 'day')}
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
                disabledDate={(d) => d.isBefore(dayjs(), 'day')}
              />
            </Form.Item>
          </div>
        </div>
      )}

      {error && <div style={{ color: DEFAULT_COLORS.ERROR, fontSize: 13 }}>{error}</div>}
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
      submitButtonIcon={<CopyOutlined />}
      loading={submitting}
      disabled={isNameInvalid}
      form={form}
      initialValues={initialValues}
      onValuesChange={handleValuesChange}
    />
  );
};

export default DuplicatePlanPanel;
