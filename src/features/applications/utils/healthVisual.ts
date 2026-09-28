import { DEFAULT_COLORS } from '../../../constants';
import { CONNECTIVITY_CONSTANTS } from '../../../constants/pages/connectivity';

export function getApplicationHealthAccentColor(status: string | undefined): string {
  const s = (status || '').toLowerCase();
  if (s === 'healthy') return DEFAULT_COLORS.SUCCESS;
  if (s === 'degraded') return CONNECTIVITY_CONSTANTS.COLORS.WARNING;
  if (s === 'down') return DEFAULT_COLORS.DANGER;
  return DEFAULT_COLORS.TEXT_MUTED;
}

/** Severity strings vary ("high", "Critical"), so match on substrings. */
export function getApplicationSeverityAccentColor(severity: string | undefined): string {
  const s = (severity || '').toLowerCase();
  if (s.includes('critical')) return DEFAULT_COLORS.DANGER;
  if (s.includes('high')) return CONNECTIVITY_CONSTANTS.COLORS.WARNING;
  if (s.includes('low') || s.includes('info')) return DEFAULT_COLORS.SUCCESS;
  return DEFAULT_COLORS.ICON_SECONDARY;
}
