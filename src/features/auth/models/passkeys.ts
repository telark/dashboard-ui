import type { PublicKeyCredential } from './credentials';
import type { AppDispatch } from '../../../store';
import type { PasskeyDeviceType } from './types';

export interface Passkey {
  id: string;
  credentialId: string;
  deviceName: string;
  deviceType: PasskeyDeviceType;
  creationTimestamp: string;
  lastUsedTimestamp?: string;
  backupEligible?: boolean;
  backupState?: boolean;
  publicKey?: string;
  userId?: string;
}

export interface CreatePasskeyResponse {
  id: string;
  credentialId: string;
  deviceName: string;
  deviceType: PasskeyDeviceType;
  creationTimestamp: string;
}

export interface EnrollLinkResponse {
  token: string;
  expiresAt: string;
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
  deviceType: PasskeyDeviceType;
  email?: string;
}

export interface PasskeyActionsReturn {
  submitting: boolean;
  handleEdit: (record: Passkey) => void;
  handleDelete: (record: Passkey, forceLastDelete?: boolean) => Promise<void>;
  handleCreate: (values: Record<string, unknown>) => Promise<void>;
  handleUpdate: (values: Record<string, unknown>, selectedPasskey: Passkey | null) => Promise<void>;
}

export interface PasskeyMessageApi {
  success: (content: string) => void;
  error: (content: string) => void;
}

export interface CreatePasskeyHandlerParams {
  deviceName: string;
  dispatch: AppDispatch;
  setSubmitting: (value: boolean) => void;
  message: PasskeyMessageApi;
}

export interface UpdatePasskeyHandlerParams {
  passkey: Passkey;
  deviceName: string;
  dispatch: AppDispatch;
  setSubmitting: (value: boolean) => void;
  message: PasskeyMessageApi;
}

export interface DeletePasskeyHandlerParams {
  passkey: Passkey;
  forceLastDelete: boolean;
  dispatch: AppDispatch;
  message: PasskeyMessageApi;
}

export interface ValidateDeviceNameOptions {
  value: string;
  existingPasskeys: Passkey[];
  isEditMode?: boolean;
  currentDeviceName?: string;
}
