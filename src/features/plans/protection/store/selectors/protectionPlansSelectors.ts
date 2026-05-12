import type { RootState } from '../../../../../store';

export const selectProtectionPlans = (s: RootState) => s.protectionPlans.plans;
export const selectProtectionPlansLoading = (s: RootState) => s.protectionPlans.loading;
export const selectProtectionPlansError = (s: RootState) => s.protectionPlans.error;
export const selectProtectionPlanTemplates = (s: RootState) => s.protectionPlans.templates;
export const selectProtectionPlanTemplatesLoading = (s: RootState) =>
  s.protectionPlans.templatesLoading;
export const selectProtectionPlanDetails = (s: RootState) => s.protectionPlans.details;
export const selectProtectionPlanDetailsLoading = (s: RootState) =>
  s.protectionPlans.detailsLoading;
export const selectProtectionPlanDetailsError = (s: RootState) => s.protectionPlans.detailsError;
export const selectProtectionPlanByName = (name: string) => (s: RootState) =>
  s.protectionPlans.plans.find((p) => p.name === name) ?? null;
