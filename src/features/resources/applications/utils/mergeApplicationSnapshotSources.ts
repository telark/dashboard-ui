import { APPLICATIONS_UI } from '../constants';
import type { ApplicationSnapshot, ApplicationSnapshotSummary } from '../models';
import { SNAPSHOT_SCOPE_APPS } from '../clients/snapshots';

/**
 * Prefer snapshots from application details (full list), enrich with exporter summary
 * rows when IDs match. Append exporter-only rows afterward.
 */
export function mergeApplicationSnapshotSources(
  fromDetails: ApplicationSnapshot[] | undefined,
  fromExporter: ApplicationSnapshotSummary[],
): ApplicationSnapshotSummary[] {
  const details = fromDetails ?? [];
  const byExporterId = new Map(fromExporter.map((s) => [s.id, s] as const));
  const ordered: ApplicationSnapshotSummary[] = [];
  const seen = new Set<string>();

  for (const d of details) {
    const enriched = byExporterId.get(d.id);
    if (enriched) {
      ordered.push(enriched);
    } else {
      ordered.push({
        id: d.id,
        scope: SNAPSHOT_SCOPE_APPS,
        namespace: d.namespace,
        generation: d.generation,
        size: APPLICATIONS_UI.FALLBACKS.EMPTY,
        consumed: APPLICATIONS_UI.FALLBACKS.EMPTY,
      });
    }
    seen.add(d.id);
  }

  for (const s of fromExporter) {
    if (!seen.has(s.id)) {
      ordered.push(s);
    }
  }

  return ordered.sort((a, b) => b.generation - a.generation);
}
