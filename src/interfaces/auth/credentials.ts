import type {
  PasskeyDeviceType,
  PublicKeyCredentialType,
  UserVerificationRequirement,
  AttestationConveyancePreference,
  AuthenticatorTransport,
} from './types';

export interface PublicKeyCredentialRequestOptions {
  challenge: string;
  timeout?: number;
  rpId?: string;
  allowCredentials?: PublicKeyCredentialDescriptor[];
  userVerification?: UserVerificationRequirement;
}

export interface PublicKeyCredentialCreationOptions {
  challenge: string;
  rp: PublicKeyCredentialEntity;
  user: PublicKeyCredentialEntity;
  pubKeyCredParams: PublicKeyCredentialParameters[];
  timeout?: number;
  attestation?: AttestationConveyancePreference;
  authenticatorSelection?: AuthenticatorSelectionCriteria;
  excludeCredentials?: PublicKeyCredentialDescriptor[];
}

export interface PublicKeyCredentialDescriptor {
  id: string;
  type: PublicKeyCredentialType;
  transports?: AuthenticatorTransport[];
}

export interface PublicKeyCredentialEntity {
  id: string;
  name: string;
  displayName?: string;
}

export interface PublicKeyCredentialParameters {
  type: PublicKeyCredentialType;
  alg: number;
}

export interface AuthenticatorSelectionCriteria {
  authenticatorAttachment?: PasskeyDeviceType;
  userVerification?: UserVerificationRequirement;
  requireResidentKey?: boolean;
  residentKey?: UserVerificationRequirement;
}

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
  type: PublicKeyCredentialType;
  getClientExtensionResults?: Record<string, unknown>;
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
  userId?: string;
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
  rp?: PublicKeyCredentialEntity;
  user?: PublicKeyCredentialEntity;
  pubKeyCredParams?: PublicKeyCredentialParameters[];
  timeout?: number;
  attestation?: AttestationConveyancePreference;
  authenticatorSelection?: AuthenticatorSelectionCriteria;
  excludeCredentials?: PublicKeyCredentialDescriptor[];
}

export type RegisterFinishRequest = PublicKeyCredential;

export interface RegisterFinishResponse {
  id: string;
  credentialId: string;
  deviceName: string;
  deviceType: PasskeyDeviceType;
  creationTimestamp: string;
}

export interface User {
  id: string;
  username: string;
  fullname?: string;
  email?: string;
  role?: string;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}
