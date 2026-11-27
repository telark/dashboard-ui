import { pluralize } from '../../../utils/helpers/format';

export const BOOTSTRAP_CONSTANTS = {
  HOUR_MS: 60 * 60 * 1000,
  // telark auth enroll prints /auth/request#request=<id>&kind=<recover|replace>.
  FRAGMENT_REQUEST: 'request',
  FRAGMENT_KIND: 'kind',
  ACTION: { APPROVE: 'approve', DENY: 'deny' },
  STATE: { PENDING: 'pending', APPROVED: 'approved' },
  KIND_RECOVER: 'recover',
  KIND_REPLACE: 'replace',
  LAYOUT: {
    LINE_GAP: 4,
    BUTTON_GAP: 8,
    PAGE_GAP: 12,
    ALERT: { borderRadius: 8, fontSize: 13 },
  },
  // antd styles this class like :disabled, so an aria-disabled button keeps that look and its focus.
  DISABLED_CLASS: 'ant-btn-disabled',
} as const;

export const BOOTSTRAP_TEXTS = {
  PAGE_TITLE: 'Auth request',
  PAGE_SUBTITLE:
    'Approve or deny it with a passkey of the bootstrap account. This does not sign you in.',
  PAGE_SUBTITLE_RECOVER:
    'Only a passkey of the bootstrap account can deny it. This does not sign you in.',
  PAGE_NO_REQUEST:
    'Open the link printed by telark auth enroll. It includes #request= and the id of the request.',
  PAGE_WARNING:
    'Approve only if you asked for this. Approving lets whoever ran telark auth enroll complete the replacement by running it again, which makes the account they named the bootstrap account. A recovery can only be denied.',
  PAGE_WARNING_RECOVER:
    "Deny it if you did not ask for this. A recovery can't be approved: it completes when its waiting period ends unless the bootstrap account signs in or denies it. Then running telark auth enroll again prints an enrollment link, and removes the account's other passkeys and sessions only once a new passkey is enrolled from it.",
  APPROVE_RECOVERY: 'A recovery can only be denied',
  PAGE_APPROVED:
    'Approved. Whoever ran telark auth enroll can now run it again to complete the replacement.',
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
  CARD_DESCRIPTION: (waitHours?: number) => {
    const wait = waitHours
      ? `after ${pluralize(waitHours, 'hour')}`
      : 'once its waiting period ends';
    return `The telark auth enroll command recovers this account. Once pinned, each run opens a request that completes ${wait} unless the account signs in or denies it. A passkey approval completes a replacement sooner.`;
  },
  PINNED_LABEL: 'Pinned account',
  // The exporter sends the email only to the bootstrap account itself.
  PINNED: (email: string | undefined, since: string) =>
    `${email || 'Bootstrap account'} · Pinned ${since}`,
  LINE_SEPARATOR: ' · ',
  NOT_PINNED:
    'No account is pinned yet. The telark auth enroll command acts at once until the bootstrap account saves its first passkey.',
  REQUESTS_LABEL: 'Auth requests',
  NO_REQUESTS: 'No auth request yet.',
  ALERTS_LABEL: 'Alert administrators about auth requests',
  ALERTS_HINT:
    'Admins on all scopes are always alerted when telark auth enroll prints a recovery link or recovers the account. Turn this on to also alert them when a request opens or is canceled, and to list requests here.',
  ALERTS_SAVED: 'Auth alerts saved',
  ALERTS_SAVE_FAILED: 'Failed to save auth alerts',
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
