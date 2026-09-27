import { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import logger from '../../../../logging';
import { STORE_MESSAGES } from '../../../../constants/store/store';
import { fetchApplicationDetails } from '../../../resources/applications/clients';
import { selectApplications } from '../../../resources/applications/store';
import { DEFAULT_RESOURCE_SUMMARY } from '../../../resources/applications/utils/mappers/applicationMapper';
import type { ApplicationResourceRef } from '../../../resources/applications/models';
import type { ScopeType } from '../models';
import { encodeResourceKey } from '../utils/planFormValues';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectOptionGroup {
  label: string;
  options: SelectOption[];
}

interface ScopeExclusionOptionsArgs {
  scopeType: ScopeType;
  applicationRefs: string[];
}

const APP_KEY_SEPARATOR = ',';

const toOption = (value: string): SelectOption => ({ value, label: value });

const byName = (a: ApplicationResourceRef, b: ApplicationResourceRef) =>
  a.name.localeCompare(b.name);

export const useScopeExclusionOptions = ({
  scopeType,
  applicationRefs,
}: ScopeExclusionOptionsArgs) => {
  const applications = useSelector(selectApplications);
  const cache = useRef(new Map<string, ApplicationResourceRef[]>());
  const [cached, setCached] = useState<Map<string, ApplicationResourceRef[]>>(new Map());
  const [resourcesLoading, setResourcesLoading] = useState(false);

  // applicationRefs is a fresh array on every render; key the effect on its content.
  const appsKey = applicationRefs.join(APP_KEY_SEPARATOR);
  const selected = useMemo(() => (appsKey ? appsKey.split(APP_KEY_SEPARATOR) : []), [appsKey]);
  const isApplications = scopeType === 'applications';

  useEffect(() => {
    if (!isApplications) return;
    const missing = selected.filter((name) => !cache.current.has(name));
    if (missing.length === 0) return;
    let cancelled = false;
    const load = async () => {
      setResourcesLoading(true);
      await Promise.all(
        missing.map(async (name) => {
          try {
            const res = await fetchApplicationDetails(name);
            cache.current.set(name, res.data.resources ?? []);
          } catch (error) {
            logger.error(STORE_MESSAGES.ERROR_FETCHING_APPLICATION_DETAILS, error);
          }
        }),
      );
      if (!cancelled) {
        setCached(new Map(cache.current));
        setResourcesLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
      setResourcesLoading(false);
    };
  }, [isApplications, selected]);

  const kindOptions = useMemo<SelectOption[]>(() => {
    if (!isApplications) return Object.keys(DEFAULT_RESOURCE_SUMMARY).map(toOption);
    const kinds = new Set(
      applications
        .filter((app) => selected.includes(app.name))
        .flatMap((app) =>
          Object.entries(app.resourceSummary)
            .filter(([, count]) => count > 0)
            .map(([kind]) => kind),
        ),
    );
    return [...kinds].sort().map(toOption);
  }, [isApplications, applications, selected]);

  const resourceOptions = useMemo<SelectOptionGroup[]>(() => {
    if (!isApplications) return [];
    const refs = selected.flatMap((name) => cached.get(name) ?? []);
    const unique = [...new Map(refs.map((ref) => [encodeResourceKey(ref), ref])).values()];
    const kinds = [...new Set(unique.map((ref) => ref.kind))].sort();
    return kinds.map((kind) => ({
      label: kind,
      options: unique
        .filter((ref) => ref.kind === kind)
        .sort(byName)
        .map((ref) => ({ value: encodeResourceKey(ref), label: ref.name })),
    }));
  }, [isApplications, selected, cached]);

  return { kindOptions, resourceOptions, resourcesLoading };
};
