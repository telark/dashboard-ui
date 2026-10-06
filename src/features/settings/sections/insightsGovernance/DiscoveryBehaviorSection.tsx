import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Select, Tooltip, App as AntdApp } from 'antd';
import SettingsCard from '../../components/SettingsCard';
import { SettingsField } from '../../components/SettingsFields';
import Toolbar from '../../../../components/display/toolbar/Toolbar';
import type { ToolbarConfig } from '../../../../interfaces/layout/toolbar';
import { Client, discoveryApiClient, exporterApiClient } from '../../../../api';
import { DEFAULT_COLORS, Endpoints } from '../../../../constants';
import type { ResourceDetailsResponse } from '../../../../interfaces/http';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGlobalConfigThunk, selectGlobalConfigState } from '../../../globalconfig/store';
import type { AppDispatch, RootState } from '../../../../store';
import { SETTINGS_CONSTANTS } from '../../constants';
import { INSIGHTS_GOVERNANCE_CONSTANTS as C } from './constants';
import { pluralize } from '../../../../utils/helpers/format';
import {
  ACTION_PERMISSIONS,
  usePermission,
} from '../../../auth/hooks/permissions/permissionEngine';

const EDIT_DISCOVERY_PERMISSION = ACTION_PERMISSIONS.settings.editDiscoveryConfig;
const VIEW_APPLICATIONS_PERMISSION = ACTION_PERMISSIONS.applications.view;
const VIEW_INSIGHTS_PERMISSION = ACTION_PERMISSIONS.insights.view;

const DiscoveryBehaviorSection: React.FC = memo(() => {
  const dispatch = useDispatch<AppDispatch>();
  const globalConfig = useSelector(selectGlobalConfigState);
  const applications = useSelector((s: RootState) => s.applications.applications);
  // The save always sends excludedNamespaces, so this deny rule refuses the whole section.
  const canEditDiscoveryConfig = usePermission(
    EDIT_DISCOVERY_PERMISSION.scope,
    EDIT_DISCOVERY_PERMISSION.level,
    EDIT_DISCOVERY_PERMISSION.deny,
  );
  const canViewApplications = usePermission(
    VIEW_APPLICATIONS_PERMISSION.scope,
    VIEW_APPLICATIONS_PERMISSION.level,
  );
  const canViewInsights = usePermission(
    VIEW_INSIGHTS_PERMISSION.scope,
    VIEW_INSIGHTS_PERMISSION.level,
  );
  // cluster/namespaces answers only callers who can read applications or insights.
  const canListNamespaces = canViewApplications || canViewInsights;
  const { message } = AntdApp.useApp();

  const [initialExcluded, setInitialExcluded] = useState<string[] | null>(null);
  const [namespacesOptions, setNamespacesOptions] = useState<string[]>([]);
  const [excludedNamespaces, setExcludedNamespaces] = useState<string[]>([]);
  const [savingDiscoveryBehavior, setSavingDiscoveryBehavior] = useState(false);

  useEffect(() => {
    if (!globalConfig?.data) return;
    const cfg = globalConfig.data;
    const savedExcluded = Array.isArray(cfg?.excludedNamespaces) ? cfg.excludedNamespaces : [];
    setExcludedNamespaces(savedExcluded);
    setInitialExcluded([...savedExcluded].sort());
  }, [globalConfig?.data]);

  const discoveryHasChanges = useMemo(() => {
    if (!initialExcluded) return false;
    const current = [...(excludedNamespaces || [])].sort();
    if (current.length !== initialExcluded.length) return true;
    for (let i = 0; i < current.length; i++) {
      if (current[i] !== initialExcluded[i]) return true;
    }
    return false;
  }, [excludedNamespaces, initialExcluded]);

  const loadNamespaces = useCallback(async () => {
    try {
      const { path, method } = Endpoints.NAMESPACES.GET;
      const res = await Client<ResourceDetailsResponse<string[]>>(discoveryApiClient, path, {
        method,
      });
      const all = (res?.data ?? []).filter(Boolean);
      setNamespacesOptions(all);
    } catch {
      message.error(C.MESSAGES.NAMESPACES_LOAD_FAILED);
    }
  }, [message]);

  useEffect(() => {
    if (canListNamespaces) loadNamespaces();
  }, [loadNamespaces, canListNamespaces]);

  const saveDiscoveryAndBehavior = useCallback(async () => {
    setSavingDiscoveryBehavior(true);
    try {
      const { path, method } = Endpoints.GLOBALCONFIG.PATCH;
      await Client<ResourceDetailsResponse<unknown>>(exporterApiClient, path, {
        method,
        data: { excludedNamespaces },
      });
      message.success(C.MESSAGES.SAVE_SUCCESS);
      setInitialExcluded([...(excludedNamespaces || [])].sort());
      dispatch(fetchGlobalConfigThunk());
    } catch {
      message.error(C.MESSAGES.SAVE_FAILED);
    } finally {
      setSavingDiscoveryBehavior(false);
    }
  }, [dispatch, excludedNamespaces, message]);

  const namespacesImpactPreview = useMemo(() => {
    const saved = Array.isArray(globalConfig?.data?.excludedNamespaces)
      ? globalConfig.data.excludedNamespaces
      : [];
    const current = excludedNamespaces || [];
    const savedSet = new Set(saved);
    const currentSet = new Set(current);

    if (saved.length === current.length) {
      let same = true;
      for (const v of saved) {
        if (!currentSet.has(v)) {
          same = false;
          break;
        }
      }
      if (same) return null;
    }

    const added = new Set<string>();
    const removed = new Set<string>();
    for (const ns of currentSet) {
      if (!savedSet.has(ns)) added.add(ns);
    }
    for (const ns of savedSet) {
      if (!currentSet.has(ns)) removed.add(ns);
    }
    if (added.size === 0 && removed.size === 0) return null;

    let hidden = 0;
    let revealed = 0;
    for (const a of applications || []) {
      const primary = a.namespaces?.items?.[0]?.name ?? '';
      if (!primary) continue;
      if (added.has(primary)) hidden++;
      if (removed.has(primary)) revealed++;
    }

    if (hidden === 0 && revealed === 0) return null;
    return { hidden, revealed };
  }, [applications, excludedNamespaces, globalConfig?.data?.excludedNamespaces]);

  const maxNamespaceTagPlaceholder = useCallback((omitted: Array<{ value?: unknown }>) => {
    const hidden = omitted.map((v) => String(v.value ?? '')).filter(Boolean);
    if (hidden.length === 0) return null;
    return (
      <Tooltip title={hidden.join(', ')}>
        <span className="ant-select-selection-item">
          <span className="ant-select-selection-item-content">+{hidden.length}</span>
        </span>
      </Tooltip>
    );
  }, []);

  const saveToolbarConfig: ToolbarConfig = useMemo(
    () => ({
      buttons: [
        {
          key: SETTINGS_CONSTANTS.TOOLBAR.SAVE_KEY,
          label: C.LABELS.SAVE_BUTTON,
          variant: 'primary',
          loading: savingDiscoveryBehavior,
          disabled: !discoveryHasChanges || !canEditDiscoveryConfig,
          tooltip: canEditDiscoveryConfig
            ? undefined
            : C.LABELS.EDIT_DISCOVERY_CONFIG_PERMISSION_DENIED,
          onClick: saveDiscoveryAndBehavior,
        },
      ],
    }),
    [
      savingDiscoveryBehavior,
      discoveryHasChanges,
      canEditDiscoveryConfig,
      saveDiscoveryAndBehavior,
    ],
  );

  return (
    <SettingsCard
      title={C.LABELS.DISCOVERY_SCOPE_TITLE}
      description={C.LABELS.DISCOVERY_SCOPE_DESCRIPTION}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <SettingsField label={C.LABELS.NAMESPACES_TITLE}>
          <Select
            mode="multiple"
            value={excludedNamespaces}
            onChange={(vals) => setExcludedNamespaces(vals)}
            options={namespacesOptions.map((n) => ({ value: n, label: n }))}
            placeholder={C.LABELS.NAMESPACES_SELECTOR_PLACEHOLDER}
            style={{ width: '100%' }}
            maxTagCount={5}
            maxTagPlaceholder={maxNamespaceTagPlaceholder}
            disabled={!canEditDiscoveryConfig}
          />
        </SettingsField>
        {namespacesImpactPreview ? (
          <div
            style={{
              fontSize: SETTINGS_CONSTANTS.CONTENT.HINT_FONT_SIZE,
              fontWeight: 700,
              color: DEFAULT_COLORS.TEXT_MUTED,
            }}
          >
            {namespacesImpactPreview.hidden > 0 ? (
              <span>
                {pluralize(namespacesImpactPreview.hidden, C.LABELS.NAMESPACES_IMPACT_NOUN)}{' '}
                {C.LABELS.NAMESPACES_IMPACT_HIDDEN}
              </span>
            ) : null}
            {namespacesImpactPreview.hidden > 0 && namespacesImpactPreview.revealed > 0 ? (
              <span style={{ fontWeight: 600 }}> · </span>
            ) : null}
            {namespacesImpactPreview.revealed > 0 ? (
              <span>
                {pluralize(namespacesImpactPreview.revealed, C.LABELS.NAMESPACES_IMPACT_NOUN)}{' '}
                {C.LABELS.NAMESPACES_IMPACT_REVEALED}
              </span>
            ) : null}
          </div>
        ) : null}

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Toolbar config={saveToolbarConfig} />
        </div>
      </div>
    </SettingsCard>
  );
});

DiscoveryBehaviorSection.displayName = 'DiscoveryBehaviorSection';

export default DiscoveryBehaviorSection;
