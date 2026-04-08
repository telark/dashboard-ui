const inFlight = new Set<string>();

export function markApplicationSyncInFlight(name: string): void {
  if (!name) return;
  inFlight.add(name);
}

export function clearApplicationSyncInFlight(name: string): void {
  if (!name) return;
  inFlight.delete(name);
}

export function isApplicationSyncInFlight(name: string): boolean {
  if (!name) return false;
  return inFlight.has(name);
}

export function listApplicationSyncInFlight(): string[] {
  return Array.from(inFlight);
}

