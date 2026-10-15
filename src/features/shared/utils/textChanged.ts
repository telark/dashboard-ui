// The API omits an empty text field while the form holds '', so both are the same value.
export const textChanged = (stored?: string | null, current?: string | null): boolean =>
  (stored ?? '') !== (current ?? '');
