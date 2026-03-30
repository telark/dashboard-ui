import { DEFAULT_COLORS } from '../../../../constants';
import { CONNECTIVITY_CONSTANTS } from '../../../../constants/pages/connectivity';

export function getApplicationHealthAccentColor(status: string | undefined): string {
  const s = (status || '').toLowerCase();
  if (s === 'healthy') return DEFAULT_COLORS.SUCCESS;
  if (s === 'degraded') return CONNECTIVITY_CONSTANTS.COLORS.WARNING;
  if (s === 'down') return DEFAULT_COLORS.DANGER;
  return DEFAULT_COLORS.TEXT_MUTED;
}
