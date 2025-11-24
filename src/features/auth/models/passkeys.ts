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

export interface CreatePasskeyRequest {
  credential: PublicKeyCredential;
}

export interface CreatePasskeyResponse {
  id: string;
  credentialId: string;
  deviceName: string;
  deviceType: PasskeyDeviceType;
  creationTimestamp: string;
}

export interface UpdatePasskeyRequest {
  deviceName?: string;
  lastUsedTimestamp?: string;
}

export type UpdatePasskeyResponse = Passkey;

export interface DeletePasskeyRequest {
  forceLastDelete?: boolean;
  cleanupOrphaned?: boolean;
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
  username?: string;
}

// Hook interfaces
export interface PasskeyModalStateReturn {
  isModalOpen: boolean;
  isEditMode: boolean;
  selectedPasskey: Passkey | null;
  openCreateModal: () => void;
  openEditModal: (passkey: Passkey) => void;
  closeModal: () => void;
}

export interface PasskeyActionsReturn {
  submitting: boolean;
  handleView: (record: Passkey) => void;
  handleEdit: (record: Passkey) => void;
  handleDelete: (record: Passkey, forceLastDelete?: boolean) => Promise<void>;
  handleCreate: (values: Record<string, any>) => Promise<void>;
  handleUpdate: (values: Record<string, any>, selectedPasskey: Passkey | null) => Promise<void>;
}

// Handler function interfaces
export interface CreatePasskeyHandlerParams {
  deviceName: string;
  dispatch: AppDispatch;
  setSubmitting: (value: boolean) => void;
}

export interface UpdatePasskeyHandlerParams {
  passkey: Passkey;
  deviceName: string;
  dispatch: AppDispatch;
  setSubmitting: (value: boolean) => void;
}

export interface DeletePasskeyHandlerParams {
  passkey: Passkey;
  forceLastDelete: boolean;
  dispatch: AppDispatch;
}

// Validation interfaces
export interface ValidateDeviceNameOptions {
  value: string;
  existingPasskeys: Passkey[];
  isEditMode?: boolean;
  currentDeviceName?: string;
}

// Component interfaces
export interface PasskeyFormModalProps {
  open: boolean;
  isEditMode: boolean;
  selectedPasskey: Passkey | null;
  passkeys: Passkey[];
  submitting: boolean;
  onCancel: () => void;
  onSubmit: (values: Record<string, any>) => Promise<void>;
}
