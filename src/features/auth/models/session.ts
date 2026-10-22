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
  // GET self carries it too since 0.2.0, so only an older exporter leaves it off that answer.
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
  duplicateCookie?: boolean;
}

export interface ListSessionsResponse {
  status?: number;
  operation?: string;
  message?: string;
  data: {
    items: SessionDetails[];
  };
}
