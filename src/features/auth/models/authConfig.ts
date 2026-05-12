export interface AuthConfigData {
  selfRegistrationEnabled: boolean;
}

export interface AuthConfigResponse {
  status: number;
  operation: string;
  message: string;
  data: AuthConfigData;
}

export interface AuthConfigState {
  initialized: boolean;
  loading: boolean;
  error: string | null;
  data: AuthConfigData | null;
  lastFetchedAt: number | null;
}
