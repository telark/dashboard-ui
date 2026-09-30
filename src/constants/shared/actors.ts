// Telark user ids; any other actor names itself and is never looked up.
export const TELARK_USER_ID_PATTERN = /^u-/;

export const ACTORS = {
  // A non-Telark actor shows the segment after its last '/' or ':'.
  SEGMENT_SEPARATOR: /[/:]/,
  // The exporter's per-request cap on users/names.
  NAMES_BATCH_SIZE: 100,
  UNKNOWN_USER: 'Unknown user',
  NONE: '—',
} as const;
