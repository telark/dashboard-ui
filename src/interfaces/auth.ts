// WebAuthn Types
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

// WebAuthn Credential Response
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

// Login Request/Response
export interface LoginStartRequest {
  username: string;
}

export interface LoginStartResponse {
  options?: {
    publicKey?: PublicKeyCredentialRequestOptions;
    response?: PublicKeyCredentialRequestOptions;
  };
  // Direct fields (if backend returns flattened structure)
  challenge?: string;
  allowCredentials?: PublicKeyCredentialDescriptor[];
  timeout?: number;
  rpId?: string;
}

// LoginFinishRequest - credential should be sent at the top level (not nested)
// The go-webauthn library's FinishLogin expects the credential at the top level of the request body
// Similar to registration, but we also include username for user lookup
export interface LoginFinishRequest {
  username: string;
  // Credential fields at top level (WebAuthn format)
  id: string;
  rawId: string;
  response: AuthenticatorAssertionResponse;
  type: string;
}

export interface LoginFinishResponse {
  sessionToken: string;
  user: User;
}

// Registration Request/Response
export interface RegisterStartResponse {
  options?: {
    publicKey?: PublicKeyCredentialCreationOptions;
    response?: PublicKeyCredentialCreationOptions; // Alternative structure
  };
  // Direct fields (if backend returns flattened structure)
  challenge?: string;
  rp?: PublicKeyCredentialRpEntity;
  user?: PublicKeyCredentialUserEntity;
  pubKeyCredParams?: PublicKeyCredentialParameters[];
  timeout?: number;
  attestation?: AttestationConveyancePreference;
  authenticatorSelection?: AuthenticatorSelectionCriteria;
}

// RegisterFinishRequest - credential should be sent directly (not nested)
// The go-webauthn library expects the credential at the top level of the request body
export type RegisterFinishRequest = PublicKeyCredential;

export interface RegisterFinishResponse {
  id: string;
  credentialId: string;
  deviceName: string;
  deviceType: 'platform' | 'cross-platform';
  createdAt: string;
}

// User Types
export interface User {
  id: string;
  username: string;
  fullname?: string;
  email?: string;
  role?: string;
}

// Session Types
export interface Session {
  token: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
}

// Passkey Types
export interface Passkey {
  id: string;
  credentialId: string;
  deviceName: string;
  deviceType: 'platform' | 'cross-platform';
  createdAt: string;
  lastUsedAt?: string;
}

export interface CreatePasskeyRequest {
  credential: PublicKeyCredential;
}

export interface CreatePasskeyResponse {
  id: string;
  credentialId: string;
  deviceName: string;
  deviceType: 'platform' | 'cross-platform';
  createdAt: string;
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

// Logout
export interface LogoutResponse {
  success: boolean;
  message: string;
}

