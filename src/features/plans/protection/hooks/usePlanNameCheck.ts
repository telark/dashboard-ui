import { useEffect, useMemo, useRef } from 'react';
import { Form } from 'antd';
import type { FormInstance } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../../../../store';
import { validateNameFormat } from '../../../shared/utils/nameValidation';
import { PLAN_NAME_VALIDATION } from '../constants/protectionPlans';
import { fetchProtectionPlansThunk, selectProtectionPlans } from '../store';
import type { ProtectionPlan } from '../models';

// Same key as the backend's name lock: lower(trim(name)).
const nameKey = (name: string): string => name.trim().toLowerCase();

const planNameError = (
  value: string,
  plans: ProtectionPlan[],
  currentName?: string,
): string | null => {
  // An unchanged name keeps the rules the plan was created under.
  if (currentName !== undefined && nameKey(value) === nameKey(currentName)) return null;
  const formatError = validateNameFormat(value, PLAN_NAME_VALIDATION);
  if (formatError) return formatError;
  return plans.some((p) => nameKey(p.name) === nameKey(value))
    ? PLAN_NAME_VALIDATION.duplicateErrorMessage
    : null;
};

// Checks the name field against the full plan list the UI holds, fetched once per open if
// missing. The backend still answers a race with 409, which the panels show as-is.
export const usePlanNameCheck = (form: FormInstance, open: boolean, currentName?: string) => {
  const dispatch: AppDispatch = useDispatch();
  const plans = useSelector(selectProtectionPlans);
  const name = Form.useWatch('name', form) as string | undefined;
  const requested = useRef(false);

  useEffect(() => {
    if (!open) {
      requested.current = false;
      return;
    }
    if (requested.current || plans.length > 0) return;
    requested.current = true;
    void dispatch(fetchProtectionPlansThunk());
  }, [open, plans.length, dispatch]);

  return useMemo(
    () => ({
      nameValidator: (_: unknown, value: string | undefined): Promise<void> => {
        const error = value?.trim() ? planNameError(value, plans, currentName) : null;
        return error ? Promise.reject(new Error(error)) : Promise.resolve();
      },
      nameInvalid: !name?.trim() || planNameError(name, plans, currentName) !== null,
    }),
    [plans, name, currentName],
  );
};
