// Single source of truth for device/session metadata fields.
// Extend or intersect this interface everywhere device context is needed.
export interface DeviceMetadata {
  browser?: string;
  device?: string;
  os?: string;
  location?: string;
  userAgent?: string;
}
