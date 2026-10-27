import type { CreateOutcome, ScopeType } from '../models';

// The Create panel's review: the "This plan will" summary, then a submit label, a success toast
// and (for an instant Enforce) a confirm that each follow the plan's outcome.
export const CREATE_PANEL_TEXTS = {
  SUBMIT: {
    approval: 'Create and request approval',
    schedule: 'Create and schedule',
    audit: 'Create and start auditing',
    enforce: 'Create and enforce now',
  } as Record<CreateOutcome, string>,
  TOASTS: {
    approval: (name: string) => `${name} is waiting for approval.`,
    schedule: (name: string, start: string) => `${name} starts ${start}.`,
    audit: (name: string) => `${name} is auditing now.`,
    enforce: (name: string) => `${name} is enforcing now.`,
  } as Record<CreateOutcome, (name: string, start: string) => string>,
  CONFIRM: {
    TITLE: (name: string) => `Enforce ${name} now?`,
    OK: 'Enforce now',
    NOTE: 'Matching changes are refused from now on.',
  },
  SUMMARY: {
    TITLE: 'This plan will',
    REFUSE: (operations: string) => `Refuse ${operations}.`,
    RECORD: (operations: string) => `Record, without blocking, ${operations}.`,
    NO_POLICIES: 'No policy picked yet.',
    POLICY: (label: string, values: string) => (values ? `${label} (${values})` : label),
    IN_APPLICATIONS: (applications: string, except: string) => `In ${applications}${except}.`,
    IN_NAMESPACES: (count: number, namespaces: string, except: string) =>
      `In ${count === 1 ? 'namespace' : 'namespaces'} ${namespaces}${except}.`,
    NO_TARGETS: {
      applications: 'No application picked yet.',
      namespaces: 'No namespace picked yet.',
    } as Record<ScopeType, string>,
    EXCEPT: (excluded: string) => `, except ${excluded}`,
    EXCLUDED_KIND: (kind: string) => `${kind} resources`,
    EXCLUDED_RESOURCE: (kind: string, name: string) => `${kind} ${name}`,
    PERMANENT: 'Permanently, until you end it.',
    WINDOW: (start: string, end: string, zone: string) => `From ${start} to ${end} (${zone}).`,
    NO_WINDOW: 'No time range picked yet.',
    REPEATING: (days: string, start: string, end: string, zone: string) =>
      `Every ${days}, ${start} to ${end} (${zone}).`,
    NO_REPEAT: 'No days and times picked yet.',
    REPEATING_DEPLOY: 'Policies are deployed when each window opens and removed when it ends.',
    ZONE: (zone: string, offset: string) => `${zone}, ${offset}`,
    TIME_FORMAT: 'EEE MMM d, HH:mm',
    LIST_LOCALE: 'en-US',
  },
  APPROVAL_IMMUTABLE_HELP: "You can't change this after the plan is created.",
  // Protect on an application prefills a plan named after it.
  DEFAULT_PLAN_NAME: (application: string) => `${application} protection`,
} as const;
