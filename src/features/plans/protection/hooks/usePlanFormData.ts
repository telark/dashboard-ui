import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../../../../store';
import { Client, discoveryApiClient } from '../../../../api/index';
import { Endpoints } from '../../../../constants';
import type { ResourceDetailsResponse } from '../../../../interfaces/http';
import {
  fetchProtectionPlanTemplatesThunk,
  selectProtectionPlanTemplates,
  selectProtectionPlanTemplatesLoading,
} from '../store';
import {
  selectApplications,
  selectApplicationsLoading,
  fetchAllApplicationsThunk,
} from '../../../resources/applications/store';
import { useUsers } from '../../../access-and-permissions/users/hooks/user/useUsers';
import { getCurrentUser } from '../../../auth/utils';
import type { User } from '../../../access-and-permissions/users/models';

export const usePlanFormData = (enabled: boolean) => {
  const dispatch: AppDispatch = useDispatch();
  const templates = useSelector(selectProtectionPlanTemplates);
  const templatesLoading = useSelector(selectProtectionPlanTemplatesLoading);
  const applications = useSelector(selectApplications);
  const applicationsLoading = useSelector(selectApplicationsLoading);
  const { users, loading: usersLoading } = useUsers();

  const [namespaceOptions, setNamespaceOptions] = useState<string[]>([]);
  const [namespacesLoading, setNamespacesLoading] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    void dispatch(fetchProtectionPlanTemplatesThunk());
    void dispatch(fetchAllApplicationsThunk());
  }, [enabled, dispatch]);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    const load = async () => {
      setNamespacesLoading(true);
      try {
        const { path, method } = Endpoints.NAMESPACES.GET;
        const res = await Client<ResourceDetailsResponse<string[]>>(discoveryApiClient, path, {
          method,
        });
        if (!cancelled) {
          setNamespaceOptions((res?.data ?? []).filter(Boolean));
        }
      } catch {
        // silent
      } finally {
        if (!cancelled) setNamespacesLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  const currentUserId = getCurrentUser()?.id;

  const selectableUsers = useMemo(
    () => (users ?? []).filter((u) => u.id !== currentUserId),
    [users, currentUserId],
  );

  const userOptions = useMemo(
    () => selectableUsers.map((u) => ({ value: u.id, label: u.username })),
    [selectableUsers],
  );

  const userMap = useMemo<Map<string, User>>(
    () => new Map(selectableUsers.map((u) => [u.id, u])),
    [selectableUsers],
  );

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

  return {
    templates,
    templatesLoading,
    applicationOptions,
    applicationsLoading,
    namespaceOptions,
    namespacesLoading,
    userOptions,
    userMap,
    usersLoading,
  };
};
