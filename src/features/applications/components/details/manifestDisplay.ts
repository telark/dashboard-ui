/**
 * Payload shown in manifest JSON/YAML: prefers `items` (Kubernetes-style lists),
 * otherwise omits top-level `apiVersion` and `kind`.
 */
export function getManifestViewPayload(data: unknown): unknown {
  if (data == null) return data;
  if (typeof data !== 'object' || Array.isArray(data)) return data;
  const record = data as Record<string, unknown>;
  if ('items' in record && record.items !== undefined) {
    return record.items;
  }
  return Object.fromEntries(
    Object.entries(record).filter(([key]) => key !== 'apiVersion' && key !== 'kind'),
  );
}

export function isManifestDocumentArray(payload: unknown): payload is unknown[] {
  return Array.isArray(payload);
}
