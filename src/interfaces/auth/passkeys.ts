import type { PublicKeyCredential } from './credentials';

export interface Passkey {
  id: string;
  credentialId: string;
  deviceName: string;
  deviceType: 'platform' | 'cross-platform';
  creationTimestamp: string;
  lastUsedTimestamp?: string;
  backupEligible?: boolean;
  backupState?: boolean;
  publicKey?: string;
  userId?: string;
}

export interface CreatePasskeyRequest {
  credential: PublicKeyCredential;
}

export interface CreatePasskeyResponse {
  id: string;
  credentialId: string;
  deviceName: string;
  deviceType: 'platform' | 'cross-platform';
  creationTimestamp: string;
}

export interface UpdatePasskeyRequest {
  deviceName?: string;
  lastUsedTimestamp?: string;
}

export type UpdatePasskeyResponse = Passkey;

export interface DeletePasskeyRequest {
  forceLastDelete?: boolean;
}

export interface DeletePasskeyResponse {
  success: boolean;
  message: string;
}

export interface PasskeysState {
  passkeys: Passkey[];
  details: Passkey | null;
  loading: boolean;
  error: string | null;
}

export interface CreatePasskeyParams {
  credential: PublicKeyCredential;
  deviceName: string;
  deviceType: 'platform' | 'cross-platform';
  username?: string;
}

