import { STATUS_COLORS } from '../../../../constants';
import type { ApplicationChangeLogEntry } from '../../models';

// The flags, not the class: a rollback is a recovery, and a health drop inside
// another change is an incident.
export function getChangeLogDotColor(
  entry: Pick<ApplicationChangeLogEntry, 'isIncident' | 'isRecovery'>,
): string {
  if (entry.isIncident) return STATUS_COLORS.APPLICATION_CHANGE.incident;
  if (entry.isRecovery) return STATUS_COLORS.APPLICATION_CHANGE.recovery;
  return STATUS_COLORS.APPLICATION_CHANGE.other;
}
