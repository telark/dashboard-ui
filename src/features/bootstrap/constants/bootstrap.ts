import { pluralize } from '../../../utils/helpers/format';

export const BOOTSTRAP_CONSTANTS = {
  HOUR_MS: 60 * 60 * 1000,
  // break-glass prints /break-glass#request=<id>&kind=<recover|replace>. Older links carry no kind.
  FRAGMENT_REQUEST: 'request',
  FRAGMENT_KIND: 'kind',
  ACTION: { APPROVE: 'approve', DENY: 'deny' },
  STATE: { PENDING: 'pending', APPROVED: 'approved' },
  KIND_RECOVER: 'recover',
  KIND_REPLACE: 'replace',
  LAYOUT: {
    ROW_GAP: 12,
    LINE_GAP: 4,
    BUTTON_GAP: 8,
    PAGE_GAP: 12,
    ALERT: { borderRadius: 8, fontSize: 13 },
  },
  // antd styles this class like :disabled, so an aria-disabled button keeps that look and its focus.
  DISABLED_CLASS: 'ant-btn-disabled',
} as const;

export const BOOTSTRAP_TEXTS = {
  PAGE_TITLE: 'Break-glass request',
  PAGE_SUBTITLE:
    'Approve or deny it with a passkey of the bootstrap account. This does not sign you in.',
  PAGE_SUBTITLE_RECOVER:
    'Only a passkey of the bootstrap account can deny it. This does not sign you in.',
  PAGE_NO_REQUEST:
    'Open the link break-glass printed. It includes #request= and the id of the request.',
  PAGE_WARNING:
    'Approve only if you asked for this. Approving lets whoever ran break-glass complete the replacement by running it again, which makes the account they named the bootstrap account. A recovery can only be denied.',
  PAGE_WARNING_RECOVER:
    "Deny it if you did not ask for this. A recovery can't be approved: it completes when its waiting period ends unless the bootstrap account signs in or denies it. Then running break-glass again prints an enrollment link, and removes the account's other passkeys and sessions only once a new passkey is enrolled from it.",
  APPROVE_RECOVERY: 'A recovery can only be denied',
  PAGE_APPROVED:
    'Approved. Whoever ran break-glass can now run it again to complete the replacement.',
  PAGE_DENIED: 'Denied. This request can no longer complete.',
  APPROVE: 'Approve with passkey',
  DENY: 'Deny with passkey',
  DECIDE_FAILED: 'Could not approve or deny the request',
  NOT_OPEN:
    'This request can no longer be approved or denied. It was already decided or ended, or a newer request replaced it.',
  PASSKEYS_UNAVAILABLE: 'Passkeys need this page on https:// or localhost',
  APPROVED_MESSAGE: 'Request approved',
  DENIED_MESSAGE: 'Request denied',
  CARD_TITLE: 'Bootstrap account',
  // Until the status loads, no wait is known: the chart sets it.
  CARD_DESCRIPTION: (waitHours?: number) =>
    `Break-glass recovers this account. Once it is pinned, a break-glass run opens a request. A recovery completes ${waitHours ? `${pluralize(waitHours, 'hour')} after it opened` : 'when its waiting period ends'} unless the account signs in or denies it. A replacement can also complete sooner, once the account approves it with a passkey.`,
  PINNED_LABEL: 'Pinned account',
  // The exporter sends the email only to the bootstrap account itself.
  PINNED: (email: string | undefined, since: string) =>
    `${email || 'Bootstrap account'} · Pinned ${since}`,
  LINE_SEPARATOR: ' · ',
  NOT_PINNED:
    'No account is pinned yet. Break-glass acts at once until the bootstrap account saves its first passkey.',
  REQUESTS_LABEL: 'Break-glass requests',
  NO_REQUESTS: 'No break-glass request yet.',
  ALERTS_LABEL: 'Alert administrators about break-glass requests',
  ALERTS_HINT:
    'Every Admin on all scopes is always told when break-glass prints a recovery link or recovers the account. When on, they are also told when a request opens or is canceled, and can see the requests here. When off, only the bootstrap account is.',
  ALERTS_SAVED: 'Break-glass alerts saved',
  ALERTS_SAVE_FAILED: 'Failed to save break-glass alerts',
  KIND_RECOVER: 'Recovery',
  KIND_REPLACE: (email?: string) => `Make ${email || 'another account'} the bootstrap account`,
  STATE: {
    pending: 'Pending',
    approved: 'Approved',
    canceled: 'Canceled',
    completed: 'Completed',
  },
  REASON: {
    'signed-in': 'Canceled by a sign-in',
    denied: 'Denied with a passkey',
    expired: 'Expired after a sign-in',
  },
  OPENED: (at: string) => `Opened ${at}`,
  COMPLETES: (at: string) => `Completes on its own ${at}`,
  APPROVED_AT: (at: string) => `Approved ${at}`,
  CANCELED_AT: (at: string) => `Ended ${at}`,
  COMPLETED_AT: (at: string) => `Completed ${at}`,
  READ_ONLY: 'Only the bootstrap account decides a request',
  LOAD_FAILED: 'Could not load the bootstrap account',
  LOAD_FAILED_LOG: 'bootstrap status load failed',
} as const;
