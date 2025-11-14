export interface PublicKeyCredentialRequestOptions {
  challenge: string;
  timeout?: number;
  rpId?: string;
  allowCredentials?: PublicKeyCredentialDescriptor[];
  userVerification?: UserVerificationRequirement;
}

export interface PublicKeyCredentialCreationOptions {
  challenge: string;
  rp: PublicKeyCredentialRpEntity;
  user: PublicKeyCredentialUserEntity;
  pubKeyCredParams: PublicKeyCredentialParameters[];
  timeout?: number;
  attestation?: AttestationConveyancePreference;
  authenticatorSelection?: AuthenticatorSelectionCriteria;
  excludeCredentials?: PublicKeyCredentialDescriptor[];
}

export interface PublicKeyCredentialDescriptor {
  id: string;
  type: 'public-key';
  transports?: AuthenticatorTransport[];
}

export interface PublicKeyCredentialRpEntity {
  id: string;
  name: string;
}

export interface PublicKeyCredentialUserEntity {
  id: string;
  name: string;
  displayName: string;
}

export interface PublicKeyCredentialParameters {
  type: 'public-key';
  alg: number;
}

export interface AuthenticatorSelectionCriteria {
  authenticatorAttachment?: AuthenticatorAttachment;
  userVerification?: UserVerificationRequirement;
  requireResidentKey?: boolean;
}

export type UserVerificationRequirement = 'required' | 'preferred' | 'discouraged';
export type AttestationConveyancePreference = 'none' | 'indirect' | 'direct';
export type AuthenticatorAttachment = 'platform' | 'cross-platform';
export type AuthenticatorTransport = 'usb' | 'nfc' | 'ble' | 'internal';

export interface AuthenticatorAttestationResponse {
  attestationObject: string;
  clientDataJSON: string;
}

export interface AuthenticatorAssertionResponse {
  authenticatorData: string;
  clientDataJSON: string;
  signature: string;
  userHandle: string | null;
}

export interface PublicKeyCredential {
  id: string;
  rawId: string;
  response: AuthenticatorAttestationResponse | AuthenticatorAssertionResponse;
  type: 'public-key';
  getClientExtensionResults?: Record<string, unknown>; // Optional: client extension results
}

export interface LoginStartRequest {
  username: string;
}

export interface LoginStartResponse {
  options?: {
    publicKey?: PublicKeyCredentialRequestOptions;
    response?: PublicKeyCredentialRequestOptions;
  };
  challenge?: string;
  allowCredentials?: PublicKeyCredentialDescriptor[];
  timeout?: number;
  rpId?: string;
}

export interface LoginFinishRequest {
  username: string;
  id: string;
  rawId: string;
  response: AuthenticatorAssertionResponse;
  type: string;
}

export interface LoginFinishResponse {
  sessionToken: string;
  user: User;
}

export interface RegisterStartResponse {
  options?: {
    publicKey?: PublicKeyCredentialCreationOptions;
    response?: PublicKeyCredentialCreationOptions;
  };
  challenge?: string;
  rp?: PublicKeyCredentialRpEntity;
  user?: PublicKeyCredentialUserEntity;
  pubKeyCredParams?: PublicKeyCredentialParameters[];
  timeout?: number;
  attestation?: AttestationConveyancePreference;
  authenticatorSelection?: AuthenticatorSelectionCriteria;
}

export type RegisterFinishRequest = PublicKeyCredential;

export interface RegisterFinishResponse {
  id: string;
  credentialId: string;
  deviceName: string;
  deviceType: 'platform' | 'cross-platform';
  creationTimestamp: string;
}

export interface User {
  id: string;
  username: string;
  fullname?: string;
  email?: string;
  role?: string;
}

export interface Session {
  token: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
}

export interface SessionDetails {
  createdTimestamp: string;
  expiresTimestamp: string;
  sessionToken: string;
  userId: string;
}

export interface SessionDetailsResponse {
  status: number;
  operation: string;
  message: string;
  data: SessionDetails;
}

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

export interface UpdatePasskeyResponse extends Passkey {}

export interface DeletePasskeyRequest {
  forceLastDelete?: boolean;
}

export interface DeletePasskeyResponse {
  success: boolean;
  message: string;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

export interface DeleteSessionResponse {
  status: number;
  operation: string;
  message: string;
}
