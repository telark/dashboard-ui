import { APPLICATIONS_UI } from '../../../constants';
import { APPLICATION_TRACKING_ANNOTATION_PREFIX } from '../../../constants/applications';
import type { ApplicationChangeLogEntry } from '../../../models';
import type { ApplicationChange } from '../../../models/application';

// The tracking annotations the policy engine stamps on every write are the
// source of "last modified"; as change rows they are noise.
export const visibleChanges = (entry: ApplicationChangeLogEntry) =>
  (entry.changes ?? []).filter((c) => !c.field.includes(APPLICATION_TRACKING_ANNOTATION_PREFIX));

export const hasText = (value?: string | null) => value != null && String(value).length > 0;

// A rollback has no old value to diff against, so the generic
// "field: value" form renders as "snapshot: snap-3415eeaa" and drops
// the generation it restored. The description already states both.
export const rollbackText = (c: ApplicationChange) =>
  hasText(c.newValue)
    ? c.description.replace(
        `${APPLICATIONS_UI.SECTIONS.CHANGE_LOG.ROLLBACK_SNAPSHOT_JOINER}${String(c.newValue)}`,
        '',
      )
    : c.description;
