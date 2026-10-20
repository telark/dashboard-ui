export type BootstrapAction = 'approve' | 'deny';

export type BootstrapRequestState = 'pending' | 'approved' | 'canceled' | 'completed';

// The exporter keeps these in TelarkConfig, newest first, and no account can delete one.
export interface BootstrapRequest {
  id: string;
  kind: 'recover' | 'replace';
  targetEmail?: string;
  state: BootstrapRequestState;
  reason?: 'signed-in' | 'denied' | 'expired';
  openedAt: string;
  approvedAt?: string;
  canceledAt?: string;
  completedAt?: string;
}

export interface BootstrapStatus {
  userID?: string;
  email?: string;
  pinnedAt?: string;
  requests?: BootstrapRequest[];
}

export interface BootstrapRequestResult {
  request: BootstrapRequest;
  eligible: boolean;
  enrolled: boolean;
}
