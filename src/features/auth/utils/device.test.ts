import { afterEach, describe, expect, it } from 'vitest';
import { buildPasskey } from '../../../test/factories/auth';
import { PASSKEYS_CONSTANTS as PPC } from '../constants/passkeys';
import { getClientMetadata } from './device/metadata';
import { getDeviceInfo } from './passkey/device/detection';
import { generateDeviceNameSuggestions } from './passkey/device/suggestions';
import { createDeviceNameValidator, validateDeviceName } from './passkey/validation';

const originalAgent = navigator.userAgent;

const setUserAgent = (userAgent: string) => {
  Object.defineProperty(navigator, 'userAgent', { configurable: true, value: userAgent });
};

const CHROME_MAC =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/130.0.0.0 Safari/537.36';

afterEach(() => setUserAgent(originalAgent));

describe('client metadata', () => {
  it.each([
    [CHROME_MAC, 'Chrome 130', 'macOS'],
    ['Mozilla/5.0 (Windows NT 10.0; Win64) Chrome/130.0 Edg/130.0', 'Edge 130', 'Windows 10/11'],
    ['Mozilla/5.0 (X11; Linux x86_64) Gecko Firefox/131.0', 'Firefox 131', 'Linux'],
    [
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Version/17.0 Mobile Safari/604.1',
      'Safari 17',
      'iOS',
    ],
    ['Mozilla/5.0 (Linux; Android 14) Chrome/130.0 OPR/110.0', 'Opera 110', 'Android'],
    ['curl/8.0', 'Unknown', 'Unknown'],
  ])('reads %j', (agent, browser, os) => {
    setUserAgent(agent);

    expect(getClientMetadata()).toMatchObject({ browser, os, userAgent: agent });
  });
});

describe('device suggestions', () => {
  it('detects the browser and the system', () => {
    setUserAgent(CHROME_MAC);

    expect(getDeviceInfo()).toEqual({ os: 'macOS', browser: 'Chrome' });
  });

  it('numbers names and skips the ones already taken', () => {
    setUserAgent(CHROME_MAC);
    const [taken] = generateDeviceNameSuggestions([], 0);

    const next = generateDeviceNameSuggestions([taken], 1);

    expect(next).toHaveLength(3);
    expect(next).not.toContain(taken);
    expect(next.every((name) => name.endsWith('-pk-02'))).toBe(true);
  });
});

describe('device name validation', () => {
  const existing = [buildPasskey({ deviceName: 'Work Laptop' })];

  it('accepts an empty or unique name and refuses a duplicate in any case', async () => {
    await expect(
      validateDeviceName({ value: '  ', existingPasskeys: existing }),
    ).resolves.toBeUndefined();
    await expect(
      validateDeviceName({ value: 'new', existingPasskeys: existing }),
    ).resolves.toBeUndefined();
    await expect(
      validateDeviceName({ value: 'WORK LAPTOP', existingPasskeys: existing }),
    ).rejects.toThrow(PPC.FORM.DEVICE_NAME_DUPLICATE);
  });

  it('allows the passkey being edited to keep its name', async () => {
    const validate = createDeviceNameValidator(existing, true, 'Work Laptop');

    await expect(validate(null, 'Work Laptop')).resolves.toBeUndefined();
  });
});
