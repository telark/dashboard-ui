import type { DeviceMetadata } from './device';

export interface Session {
  token: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
}

export interface SessionResourceMetadata {
  name: string;
}

export interface SessionDetails {
  createdTimestamp: string;
  expiresTimestamp: string;
  userId: string;
  ipAddress?: string;
  deviceMetadata?: DeviceMetadata;
  // Absent on the single-session response, which returns the spec alone.
  metadata?: SessionResourceMetadata;
}

export interface SessionDetailsResponse {
  status: number;
  operation: string;
  message: string;
  data: SessionDetails;
}

export interface DeleteSessionResponse {
  status: number;
  operation: string;
  message: string;
}

export interface SessionValidationResult {
  isValid: boolean;
  isExpired: boolean;
  sessionDetails?: SessionDetails;
  error?: string;
}

export interface ListSessionsResponse {
  status?: number;
  operation?: string;
  message?: string;
  data: {
    items: SessionDetails[];
  };
}
