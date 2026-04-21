import type { DeviceMetadata } from '../../models/device';

// Required fields only — concrete values collected from navigator.
export interface ClientMetadata extends DeviceMetadata {
  browser: string;
  device: string;
  os: string;
  userAgent: string;
}

export const getClientMetadata = (): ClientMetadata => {
  const ua = globalThis.navigator?.userAgent ?? '';
  const platform = globalThis.navigator?.platform ?? '';

  let browser = 'Unknown';
  if (/Edg\//.test(ua)) {
    browser = `Edge ${ua.match(/Edg\/([\d]+)/)?.[1] ?? ''}`.trim();
  } else if (/OPR\//.test(ua)) {
    browser = `Opera ${ua.match(/OPR\/([\d]+)/)?.[1] ?? ''}`.trim();
  } else if (/Chrome\//.test(ua) && !/Chromium\//.test(ua)) {
    browser = `Chrome ${ua.match(/Chrome\/([\d]+)/)?.[1] ?? ''}`.trim();
  } else if (/Firefox\//.test(ua)) {
    browser = `Firefox ${ua.match(/Firefox\/([\d]+)/)?.[1] ?? ''}`.trim();
  } else if (/Safari\//.test(ua) && !/Chrome\//.test(ua)) {
    browser = `Safari ${ua.match(/Version\/([\d]+)/)?.[1] ?? ''}`.trim();
  }

  let os = 'Unknown';
  if (/Windows NT 10|Windows NT 11/.test(ua)) os = 'Windows 10/11';
  else if (/Windows/.test(ua)) os = 'Windows';
  else if (/iPhone|iPad/.test(ua)) os = 'iOS';
  else if (/Android/.test(ua)) os = 'Android';
  else if (/Mac OS X/.test(ua)) os = 'macOS';
  else if (/Linux/.test(ua)) os = 'Linux';

  const device = platform || 'Unknown';

  return { browser, os, device, userAgent: ua };
};
