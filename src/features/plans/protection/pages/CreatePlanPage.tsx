import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Form, Button, Alert } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { APP_ROUTES } from '../../../../constants';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../constants/protectionPlans';
import { DEFAULT_COLORS, Icons } from '../../../../constants';
import { PAGE_CONTENT_LAYOUT } from '../../../../constants/shared/pages';
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
import { PrimaryButton } from '../../../../components/display/buttons';
import { useUsers } from '../../../access-and-permissions/users/hooks/user/useUsers';
import {
  BasicInfoSection,
  ScopeSection,
  PoliciesSection,
  ScheduleSection,
  ParticipantsSection,
} from '../components/create';
import type { PolicyEntry, FormValues } from '../components/create';

const ProtectionPlansIcon = Icons.ProtectionPlans;

const { SECTIONS: _SECTIONS, FORM: _FORM } = PPC.CREATE_PAGE;
void _SECTIONS;
void _FORM;

const CreatePlanPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const [form] = Form.useForm<FormValues>();

  const templates = useSelector(selectProtectionPlanTemplates);
  const templatesLoading = useSelector(selectProtectionPlanTemplatesLoading);
  const applications = useSelector(selectApplications);
  const applicationsLoading = useSelector(selectApplicationsLoading);
  const { users, loading: usersLoading } = useUsers();

  const [policies, setPolicies] = useState<PolicyEntry[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [namespaceOptions, setNamespaceOptions] = useState<string[]>([]);
  const [namespacesLoading, setNamespacesLoading] = useState(false);

  const scopeType = Form.useWatch('scopeType', form);
  const timeMode = Form.useWatch('timeMode', form);

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

  const availableTemplates = useMemo(
    () => (!scopeType ? templates : templates.filter((t) => t.supportedScopes.includes(scopeType))),
    [templates, scopeType],
  );

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
          : app.displayName || app.name;
        return { value: app.name, label };
      }),
    [applications],
  );

  const handlePolicyParamChange = useCallback((index: number, key: string, values: string[]) => {
    setPolicies((prev) =>
      prev.map((p, i) => (i === index ? { ...p, params: { ...p.params, [key]: values } } : p)),
    );
  }, []);

  const handleScopeTypeChange = useCallback(() => {
    form.resetFields(['applicationIds', 'namespaces']);
    setPolicies([]);
  }, [form]);

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
              ? { startAt: values.startAt.toISOString(), endAt: values.endAt.toISOString() }
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

  const breadcrumbItems = useMemo(
    () => [
      { label: PPC.LABELS.BREADCRUMBS.ROOT, onClick: () => navigate(APP_ROUTES.PROTECTION_PLANS) },
      { label: PPC.LABELS.BREADCRUMBS.CREATE },
    ],
    [navigate],
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
            <BasicInfoSection />
            <ScopeSection
              scopeType={scopeType}
              applicationOptions={applicationOptions}
              applicationsLoading={applicationsLoading}
              namespaceOptions={namespaceOptions}
              namespacesLoading={namespacesLoading}
              onScopeTypeChange={handleScopeTypeChange}
            />
            <PoliciesSection
              policies={policies}
              availableTemplates={availableTemplates}
              templates={templates}
              templatesLoading={templatesLoading}
              onPoliciesChange={setPolicies}
              onPolicyParamChange={handlePolicyParamChange}
            />
            <ScheduleSection timeMode={timeMode} />
            <ParticipantsSection
              userOptions={userOptions}
              userMap={userMap}
              usersLoading={usersLoading}
            />
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
