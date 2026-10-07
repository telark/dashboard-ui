import { DEFAULT_COLORS, STATUS_COLORS } from '../../../constants';

export function getApplicationHealthAccentColor(status: string | undefined): string {
  return (
    STATUS_COLORS.APPLICATION_HEALTH[(status || '').toLowerCase()] ?? DEFAULT_COLORS.TEXT_MUTED
  );
}
