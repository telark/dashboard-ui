import type { Passkey } from '../../../../interfaces/passkeys';
import { PASSKEYS_PAGE_CONSTANTS as PPC } from '../../../../constants/pages/passkeys';

export type PasskeysSortKey =
  | 'deviceName'
  | 'deviceType'
  | 'creationTimestamp'
  | 'lastUsedTimestamp';

type Comparator<T> = (a: T, b: T) => number;
type SortOrder = 'asc' | 'desc';

const compareStrings = (a: string | undefined, b: string | undefined) =>
  String(a || '').localeCompare(String(b || ''));

const compareDates = (a: string | undefined, b: string | undefined) => {
  const dateA = a ? new Date(a).getTime() : 0;
  const dateB = b ? new Date(b).getTime() : 0;
  return dateA - dateB;
};

export const sortPasskeys = (
  passkeys: Passkey[],
  sortKey: PasskeysSortKey,
  sortOrder: SortOrder,
): Passkey[] => {
  const comparator: Comparator<Passkey> = (() => {
    switch (sortKey) {
      case PPC.KEYS.DEVICE_NAME:
        return (a, b) => compareStrings(a.deviceName, b.deviceName);
      case PPC.KEYS.DEVICE_TYPE:
        return (a, b) => compareStrings(a.deviceType, b.deviceType);
      case PPC.KEYS.CREATED_AT:
        return (a, b) => compareDates(a.creationTimestamp, b.creationTimestamp);
      case PPC.KEYS.LAST_USED_AT: {
        // Treat undefined/null as "never used" (sort to end)
        return (a, b) => {
          if (!a.lastUsedTimestamp && !b.lastUsedTimestamp) return 0;
          if (!a.lastUsedTimestamp) return 1;
          if (!b.lastUsedTimestamp) return -1;
          return compareDates(a.lastUsedTimestamp, b.lastUsedTimestamp);
        };
      }
      default:
        return () => 0;
    }
  })();

  const items = [...passkeys];
  items.sort((a, b) => (sortOrder === 'asc' ? comparator(a, b) : -comparator(a, b)));
  return items;
};
