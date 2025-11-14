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

