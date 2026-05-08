import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Form,
  Input,
  Select,
  Radio,
  Button,
  Space,
  Typography,
  Spin,
  Alert,
  ConfigProvider,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { APP_ROUTES } from '../../../../constants';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../constants/protectionPlans';
import { DEFAULT_COLORS, FILTER_PANEL } from '../../../../constants';
import { PAGE_CONTENT_LAYOUT } from '../../../../constants/shared/pages';
import { Icons } from '../../../../constants';
import type { AppDispatch } from '../../../../store';
import {
  fetchProtectionPlanTemplatesThunk,
  preparePlanThunk,
  selectProtectionPlanTemplates,
  selectProtectionPlanTemplatesLoading,
} from '../store';
import {
  selectApplications,
  selectApplicationsLoading,
  fetchAllApplicationsThunk,
} from '../../../resources/applications/store';
import { Client, discoveryApiClient } from '../../../../api/index';
import { Endpoints } from '../../../../constants';
import type { ResourceDetailsResponse } from '../../../../interfaces/http';
import { getCurrentUser } from '../../../auth/utils';
import type { ScopeType } from '../models';
import SectionCard from '../components/create/SectionCard';
import DatePicker from '../../../../components/display/inputs/DatePicker';
import { PrimaryButton } from '../../../../components/display/buttons';
import { useUsers } from '../../../access-and-permissions/users/hooks/user/useUsers';
import UserAvatar from '../../../../components/display/avatars/UserAvatar';
import { ATTACHED_MEMBERS_CONSTANTS as AMC } from '../../../access-and-permissions/groups/constants';

const ProtectionPlansIcon = Icons.ProtectionPlans;

interface PolicyEntry {
  templateID: string;
  params: Record<string, string[]>;
}

interface FormValues {
  name: string;
  description?: string;
  severity?: string;
  priority?: number;
  mode: string;
  scopeType: ScopeType;
  applicationIds?: string[];
  namespaces?: string[];
  timeMode: string;
  startAt?: dayjs.Dayjs;
  endAt?: dayjs.Dayjs;
  participantsIDs?: string[];
}

const { SECTIONS, FORM } = PPC.CREATE_PAGE;
const FORM_ITEM_CLASS = 'form-item-compact no-asterisk';

const CreatePlanPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const [form] = Form.useForm<FormValues>();
  const templates = useSelector(selectProtectionPlanTemplates);
  const templatesLoading = useSelector(selectProtectionPlanTemplatesLoading);
  const applications = useSelector(selectApplications);
  const applicationsLoading = useSelector(selectApplicationsLoading);
  const [policies, setPolicies] = useState<PolicyEntry[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [namespaceOptions, setNamespaceOptions] = useState<string[]>([]);
  const [namespacesLoading, setNamespacesLoading] = useState(false);
  const scopeType = Form.useWatch('scopeType', form);
  const timeMode = Form.useWatch('timeMode', form);
  const { users, loading: usersLoading } = useUsers();

  useEffect(() => {
    void dispatch(fetchProtectionPlanTemplatesThunk());
    void dispatch(fetchAllApplicationsThunk());
  }, [dispatch]);

  useEffect(() => {
    const load = async () => {
      setNamespacesLoading(true);
      try {
        const { path, method } = Endpoints.NAMESPACES.GET;
        const res = await Client<ResourceDetailsResponse<string[]>>(discoveryApiClient, path, {
          method,
        });
        setNamespaceOptions((res?.data ?? []).filter(Boolean));
      } catch {
        // silent
      } finally {
        setNamespacesLoading(false);
      }
    };
    void load();
  }, []);

  const availableTemplates = useMemo(() => {
    if (!scopeType) return templates;
    return templates.filter((t) => t.supportedScopes.includes(scopeType));
  }, [templates, scopeType]);

  const userOptions = useMemo(
    () => (users ?? []).map((u) => ({ value: u.id, label: u.username })),
    [users],
  );
  const userMap = useMemo(() => new Map((users ?? []).map((u) => [u.id, u])), [users]);

  const applicationOptions = useMemo(
    () =>
      applications.map((app) => {
        const primaryNs = app.namespaces?.items?.[0]?.name;
        const label = primaryNs
          ? `${app.displayName || app.name} (${primaryNs})`
          : (app.displayName || app.name);
        return { value: app.name, label };
      }),
    [applications],
  );

  const updatePolicyParam = useCallback((index: number, key: string, values: string[]) => {
    setPolicies((prev) =>
      prev.map((p, i) => (i === index ? { ...p, params: { ...p.params, [key]: values } } : p)),
    );
  }, []);

  const breadcrumbItems = useMemo(
    () => [
      { label: PPC.LABELS.BREADCRUMBS.ROOT, onClick: () => navigate(APP_ROUTES.PROTECTION_PLANS) },
      { label: PPC.LABELS.BREADCRUMBS.CREATE },
    ],
    [navigate],
  );

  const handleFinish = useCallback(
    async (values: FormValues) => {
      const userId = getCurrentUser()?.id;
      if (!userId) return;
      setSubmitError(null);
      setSubmitting(true);
      try {
        const payload = {
          name: values.name,
          description: values.description,
          severity: values.severity,
          priority:
            values.priority != null && values.priority !== ('' as unknown)
              ? parseInt(String(values.priority), 10)
              : undefined,
          mode: values.mode,
          timeMode: values.timeMode,
          scope: {
            type: values.scopeType,
            applicationIds:
              values.scopeType === 'applications' ? (values.applicationIds ?? []) : [],
            namespaces: values.scopeType === 'namespaces' ? (values.namespaces ?? []) : [],
          },
          policies: policies.map((p) => ({ templateID: p.templateID, params: p.params })),
          timeRange:
            values.timeMode === 'time_range' && values.startAt && values.endAt
              ? {
                  startAt: values.startAt.toISOString(),
                  endAt: values.endAt.toISOString(),
                }
              : undefined,
          participantsIDs: values.participantsIDs ?? [],
        };
        await dispatch(preparePlanThunk({ userId, payload })).unwrap();
        navigate(APP_ROUTES.PROTECTION_PLANS);
      } catch (err: unknown) {
        setSubmitError(err instanceof Error ? err.message : String(err));
      } finally {
        setSubmitting(false);
      }
    },
    [dispatch, navigate, policies],
  );

  const titleContent = (
    <>
      {breadcrumbItems.map((b, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span style={{ color: '#64748b' }}> / </span>}
          {b.onClick ? (
            <button
              type="button"
              onClick={b.onClick}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                color: '#64748b',
                fontSize: 28,
                fontWeight: 700,
                fontFamily: 'inherit',
              }}
            >
              {b.label}
            </button>
          ) : (
            <span style={{ color: '#0B1F33' }}>{b.label}</span>
          )}
        </React.Fragment>
      ))}
    </>
  );

  return (
    <div
      style={{
        minHeight: '100vh',
        background: DEFAULT_COLORS.BACKGROUND_WHITE,
        padding: PAGE_CONTENT_LAYOUT.PADDING,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: '#0B1F33',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            {titleContent}
          </h1>
          <p style={{ fontSize: 14, color: '#64748b', margin: 0, marginTop: 2 }}>
            {PPC.LABELS.CREATE_SUBTITLE}
          </p>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{ mode: 'audit', timeMode: 'permanent', scopeType: 'namespaces' }}
          style={{ display: 'flex', flexDirection: 'column', gap: 0 }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: PPC.CREATE_PAGE.GAP_BETWEEN_CARDS,
              marginTop: 24,
            }}
          >
            {/* Basic info */}
            <SectionCard
              title={SECTIONS.BASIC_INFO_TITLE}
              description={SECTIONS.BASIC_INFO_DESCRIPTION}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                <Form.Item
                  name="name"
                  label={FORM.NAME_LABEL}
                  rules={[{ required: true, message: 'Plan name is required' }]}
                  style={{ marginBottom: 12 }}
                  className={FORM_ITEM_CLASS}
                >
                  <Input placeholder={FORM.NAME_PLACEHOLDER} />
                </Form.Item>
                <Form.Item
                  name="description"
                  label={FORM.DESCRIPTION_LABEL}
                  style={{ marginBottom: 12 }}
                  className={FORM_ITEM_CLASS}
                >
                  <Input placeholder={FORM.DESCRIPTION_PLACEHOLDER} />
                </Form.Item>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  <Form.Item
                    name="severity"
                    label={FORM.SEVERITY_LABEL}
                    style={{ marginBottom: 0 }}
                    className={FORM_ITEM_CLASS}
                  >
                    <Select
                      placeholder="Select severity"
                      options={PPC.CREATE_PAGE.SEVERITY_OPTIONS}
                      allowClear
                    />
                  </Form.Item>
                  <Form.Item
                    name="priority"
                    label={FORM.PRIORITY_LABEL}
                    style={{ marginBottom: 0 }}
                    className={FORM_ITEM_CLASS}
                  >
                    <Input type="number" min={0} placeholder="e.g. 1" />
                  </Form.Item>
                  <Form.Item
                    name="mode"
                    label={FORM.MODE_LABEL}
                    style={{ marginBottom: 0 }}
                    className={FORM_ITEM_CLASS}
                  >
                    <ConfigProvider theme={{ token: { colorPrimary: DEFAULT_COLORS.SUCCESS } }}>
                      <Radio.Group>
                        <Space direction="vertical" size={4}>
                          {PPC.CREATE_PAGE.MODE_OPTIONS.map((o) => (
                            <Radio key={o.value} value={o.value} style={{ fontSize: 13 }}>
                              {o.label}
                            </Radio>
                          ))}
                        </Space>
                      </Radio.Group>
                    </ConfigProvider>
                  </Form.Item>
                </div>
              </div>
            </SectionCard>

            {/* Scope */}
            <SectionCard title={SECTIONS.SCOPE_TITLE} description={SECTIONS.SCOPE_DESCRIPTION}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                <Form.Item
                  name="scopeType"
                  label={FORM.SCOPE_TYPE_LABEL}
                  style={{ marginBottom: 12 }}
                  className={FORM_ITEM_CLASS}
                >
                  <Select
                    options={PPC.CREATE_PAGE.SCOPE_TYPE_OPTIONS}
                    style={{ width: 200 }}
                    onChange={() => {
                      form.resetFields(['applicationIds', 'namespaces']);
                      setPolicies([]);
                    }}
                  />
                </Form.Item>

                {scopeType === 'applications' && (
                  <Form.Item
                    name="applicationIds"
                    label={FORM.APPLICATIONS_LABEL}
                    rules={[{ required: true, message: 'Select at least one application' }]}
                    style={{ marginBottom: 0 }}
                    className={FORM_ITEM_CLASS}
                  >
                    <Select
                      mode="multiple"
                      placeholder={FORM.APPLICATIONS_PLACEHOLDER}
                      style={{ width: '100%' }}
                      loading={applicationsLoading}
                      options={applicationOptions}
                      filterOption={(input, option) =>
                        String(option?.label ?? '')
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                    />
                  </Form.Item>
                )}

                {scopeType === 'namespaces' && (
                  <Form.Item
                    name="namespaces"
                    label={FORM.NAMESPACES_LABEL}
                    rules={[{ required: true, message: 'Select at least one namespace' }]}
                    style={{ marginBottom: 0 }}
                    className={FORM_ITEM_CLASS}
                  >
                    <Select
                      mode="multiple"
                      placeholder={FORM.NAMESPACES_PLACEHOLDER}
                      style={{ width: '100%' }}
                      loading={namespacesLoading}
                      options={namespaceOptions.map((n) => ({ value: n, label: n }))}
                      filterOption={(input, option) =>
                        String(option?.label ?? '')
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                    />
                  </Form.Item>
                )}
              </div>
            </SectionCard>

            {/* Policies */}
            <SectionCard
              title={SECTIONS.POLICIES_TITLE}
              description={SECTIONS.POLICIES_DESCRIPTION}
            >
              {templatesLoading ? (
                <Spin size="small" />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <Select
                    mode="multiple"
                    placeholder={FORM.ADD_POLICY_BUTTON}
                    style={{ width: '100%' }}
                    value={policies.map((p) => p.templateID)}
                    options={availableTemplates.map((t) => ({ value: t.id, label: t.name }))}
                    onChange={(selectedIds: string[]) => {
                      setPolicies((prev) =>
                        selectedIds.map((id) => {
                          const existing = prev.find((p) => p.templateID === id);
                          if (existing) return existing;
                          const tpl = templates.find((t) => t.id === id);
                          const initialParams: Record<string, string[]> = {};
                          tpl?.params?.forEach((p) => {
                            initialParams[p.key] = [];
                          });
                          return { templateID: id, params: initialParams };
                        }),
                      );
                    }}
                    filterOption={(input, option) =>
                      String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                  />

                  {policies
                    .filter((entry) => {
                      const tpl = templates.find((t) => t.id === entry.templateID);
                      return (tpl?.params?.length ?? 0) > 0;
                    })
                    .map((entry) => {
                      const tpl = templates.find((t) => t.id === entry.templateID);
                      if (!tpl) return null;
                      const policyIndex = policies.findIndex(
                        (p) => p.templateID === entry.templateID,
                      );
                      return (
                        <div
                          key={entry.templateID}
                          style={{
                            border: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
                            borderRadius: 8,
                            padding: 12,
                          }}
                        >
                          <span style={{ fontWeight: 600, fontSize: 13, display: 'block', marginBottom: 8 }}>
                            {tpl.name}
                          </span>
                          {(tpl.params ?? []).map((param) => (
                            <div key={param.key} style={{ marginTop: 8 }}>
                              <Typography.Text
                                style={{
                                  fontSize: 12,
                                  fontWeight: 500,
                                  display: 'block',
                                  marginBottom: 4,
                                }}
                              >
                                {param.label}
                                {param.required && (
                                  <span style={{ color: '#ef4444', marginLeft: 2 }}>*</span>
                                )}
                              </Typography.Text>
                              <Select
                                mode="tags"
                                placeholder={
                                  param.placeholder ?? `Enter ${param.label.toLowerCase()}`
                                }
                                value={entry.params[param.key] ?? []}
                                onChange={(vals: string[]) =>
                                  updatePolicyParam(policyIndex, param.key, vals)
                                }
                                style={{ width: '100%' }}
                                tokenSeparators={[',']}
                              />
                              {param.description && (
                                <Typography.Text
                                  type="secondary"
                                  style={{ fontSize: 11, display: 'block', marginTop: 2 }}
                                >
                                  {param.description}
                                </Typography.Text>
                              )}
                            </div>
                          ))}
                        </div>
                      );
                    })}
                </div>
              )}
            </SectionCard>

            {/* Schedule */}
            <SectionCard
              title={SECTIONS.SCHEDULE_TITLE}
              description={SECTIONS.SCHEDULE_DESCRIPTION}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Form.Item
                  name="timeMode"
                  label={FORM.TIME_MODE_LABEL}
                  style={{ marginBottom: 0 }}
                  className={FORM_ITEM_CLASS}
                >
                  <Select
                    options={PPC.CREATE_PAGE.TIME_MODE_OPTIONS}
                    style={{ width: 200 }}
                  />
                </Form.Item>

                {timeMode === 'time_range' && (
                  <div style={{ ...FILTER_PANEL.DATE_RANGE_CONTAINER, alignItems: 'flex-end' }}>
                    <div style={FILTER_PANEL.DATE_INPUT_WRAPPER}>
                      <Form.Item
                        name="startAt"
                        label={FORM.START_AT_LABEL}
                        style={{ marginBottom: 0 }}
                        className={FORM_ITEM_CLASS}
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
                        className={FORM_ITEM_CLASS}
                        rules={[
                          { required: true, message: 'End time is required' },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              const start = getFieldValue('startAt') as dayjs.Dayjs | undefined;
                              if (!value || !start || value.isAfter(start))
                                return Promise.resolve();
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
              </div>
            </SectionCard>

            {/* Participants */}
            <SectionCard
              title="Participants"
              description="Select users to associate with this plan."
            >
              <Form.Item
                name="participantsIDs"
                label={FORM.PARTICIPANTS_LABEL}
                style={{ marginBottom: 0 }}
                className={FORM_ITEM_CLASS}
              >
                <Select
                  mode="multiple"
                  loading={usersLoading}
                  placeholder={FORM.PARTICIPANTS_PLACEHOLDER}
                  style={{ width: '100%' }}
                  options={userOptions}
                  optionRender={(option) => {
                    const u = userMap.get(String(option.value));
                    return (
                      <div style={AMC.LIST.MEMBER_CONTENT}>
                        <div style={AMC.LIST.MEMBER_AVATAR_CONTAINER}>
                          <UserAvatar avatar={u?.avatar} username={u?.username} size={32} />
                        </div>
                        <div style={AMC.LIST.MEMBER_INFO}>
                          <div style={AMC.LIST.MEMBER_NAME}>{u?.username}</div>
                          {u?.email && <div style={AMC.LIST.MEMBER_EMAIL}>{u.email}</div>}
                        </div>
                      </div>
                    );
                  }}
                  filterOption={(input, option) =>
                    String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                />
              </Form.Item>
            </SectionCard>
          </div>

          {submitError && (
            <Alert
              type="error"
              message={submitError}
              style={{ marginTop: 16 }}
              showIcon
              closable
              onClose={() => setSubmitError(null)}
            />
          )}

          <div style={{ marginTop: 32, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <Button onClick={() => navigate(APP_ROUTES.PROTECTION_PLANS)}>Cancel</Button>
            <PrimaryButton
              action={PPC.LABELS.CREATE_BUTTON_TEXT}
              onClick={() => form.submit()}
              loading={submitting}
              loadingLabel="Creating..."
              icon={<ProtectionPlansIcon size={16} />}
            />
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CreatePlanPage;
