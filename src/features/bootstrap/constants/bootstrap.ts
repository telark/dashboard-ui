export const BOOTSTRAP_CONSTANTS = {
  // The exporter's rule, never a setting: 72 hours with no sign-in by the bootstrap account complete a request.
  REQUEST_WAIT_MS: 72 * 60 * 60 * 1000,
  // break-glass prints /break-glass#request=<id>.
  FRAGMENT_REQUEST: 'request',
  ACTION: { APPROVE: 'approve', DENY: 'deny' },
  STATE: { PENDING: 'pending', APPROVED: 'approved' },
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
  PAGE_NO_REQUEST:
    'Open the link break-glass printed. It ends with #request= and the id of the request.',
  PAGE_WARNING:
    'Approve only if you asked for this. Whoever ran break-glass then completes the request by running it again. A recovery removes every passkey and session of this account and issues a new enrollment link. A replacement makes the account they named the bootstrap account.',
  PAGE_APPROVED:
    'Approved. Whoever ran break-glass can now run it again to get the enrollment link.',
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
  CARD_DESCRIPTION:
    'Break-glass recovers this account. Once it is pinned, a break-glass run opens a request that completes when the account approves it with a passkey, or after 72 hours without a sign-in.',
  PINNED_LABEL: 'Pinned account',
  // The exporter sends the email only to the bootstrap account itself.
  PINNED: (email: string | undefined, since: string) =>
    `${email || 'Bootstrap account'} · Pinned ${since}`,
  LINE_SEPARATOR: ' · ',
  NOT_PINNED:
    'No account is pinned yet. Break-glass acts at once until the bootstrap account saves its first passkey.',
  REQUESTS_LABEL: 'Break-glass requests',
  NO_REQUESTS: 'No break-glass request yet.',
  REQUESTS_PRIVATE: 'The bootstrap account keeps its break-glass requests private.',
  ALERTS_LABEL: 'Alert administrators about break-glass requests',
  ALERTS_HINT:
    'When on, every Admin on all scopes is notified of a request and can see it here. When off, only the bootstrap account is.',
  ALERTS_BOOTSTRAP_ONLY: 'Only the bootstrap account can change who is alerted',
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
  COMPLETES: (at: string) => `Completes without approval ${at}`,
  APPROVED_AT: (at: string) => `Approved ${at}`,
  CANCELED_AT: (at: string) => `Ended ${at}`,
  COMPLETED_AT: (at: string) => `Completed ${at}`,
  READ_ONLY: 'Only the bootstrap account approves or denies a request',
  LOAD_FAILED: 'Could not load the bootstrap account',
  LOAD_FAILED_LOG: 'bootstrap status load failed',
} as const;
