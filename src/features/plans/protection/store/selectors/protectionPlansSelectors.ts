import type { RootState } from '../../../../../store';

export const selectProtectionPlans = (s: RootState) => s.protectionPlans.plans;
export const selectProtectionPlansLoaded = (s: RootState) => s.protectionPlans.loaded;
export const selectProtectionPlansError = (s: RootState) => s.protectionPlans.error;
export const selectProtectionPlanTemplates = (s: RootState) => s.protectionPlans.templates;
export const selectProtectionPlanTemplatesLoading = (s: RootState) =>
  s.protectionPlans.templatesLoading;
