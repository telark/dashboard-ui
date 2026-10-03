import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../../store';
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
} from '../../../applications/store';
import { useUsers } from '../../../access-and-permissions/users/hooks/user/useUsers';
import { getCurrentUser } from '../../../auth/utils';
import type { User } from '../../../access-and-permissions/users/models';
import { mapCategoriesToOptions } from '../../../access-and-permissions/categories/utils/helpers';
import { usePlanTaxonomyLists } from './usePlanTaxonomies';

export const usePlanFormData = (enabled: boolean) => {
  const dispatch: AppDispatch = useDispatch();
  const templates = useSelector(selectProtectionPlanTemplates);
  const templatesLoading = useSelector(selectProtectionPlanTemplatesLoading);
  const applications = useSelector(selectApplications);
  const applicationsLoading = useSelector(selectApplicationsLoading);
  const { users, loading: usersLoading } = useUsers();
  const { environments, tags } = usePlanTaxonomyLists();

  const [allNamespaces, setAllNamespaces] = useState<string[]>([]);
  const [namespacesLoading, setNamespacesLoading] = useState(false);
  const excludedNamespaces = useSelector((s: RootState) => s.globalconfig.data?.excludedNamespaces);

  useEffect(() => {
    if (!enabled) return;
    void dispatch(fetchProtectionPlanTemplatesThunk());
    void dispatch(fetchAllApplicationsThunk());
  }, [enabled, dispatch]);

  useEffect(() => {
    if (!enabled) return;
    let canceled = false;
    const load = async () => {
      setNamespacesLoading(true);
      try {
        const { path, method } = Endpoints.NAMESPACES.GET;
        const res = await Client<ResourceDetailsResponse<string[]>>(discoveryApiClient, path, {
          method,
        });
        if (!canceled) {
          setAllNamespaces((res?.data ?? []).filter(Boolean));
        }
      } catch {
        // silent
      } finally {
        if (!canceled) setNamespacesLoading(false);
      }
    };
    void load();
    return () => {
      canceled = true;
    };
  }, [enabled]);

  const namespaceOptions = useMemo(() => {
    const excluded = new Set(excludedNamespaces ?? []);
    return allNamespaces.filter((n) => !excluded.has(n));
  }, [allNamespaces, excludedNamespaces]);

  const currentUserId = getCurrentUser()?.id;

  const selectableUsers = useMemo(
    () => (users ?? []).filter((u) => u.id !== currentUserId),
    [users, currentUserId],
  );

  const userOptions = useMemo(
    () => selectableUsers.map((u) => ({ value: u.id, label: u.username })),
    [selectableUsers],
  );

  // Every user, not only the selectable ones: an editor who is already a participant has no option.
  const userMap = useMemo<Map<string, User>>(
    () => new Map((users ?? []).map((u) => [u.id, u])),
    [users],
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

  const environmentOptions = useMemo(() => mapCategoriesToOptions(environments), [environments]);
  const tagOptions = useMemo(() => mapCategoriesToOptions(tags), [tags]);

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
    environmentOptions,
    tagOptions,
  };
};
