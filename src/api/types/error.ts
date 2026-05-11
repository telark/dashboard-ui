export type NormalizedErrorKind =
  | 'network'
  | 'timeout'
  | 'circuit_open'
  | 'http_4xx'
  | 'http_5xx'
  | 'unknown';

export interface NormalizedError {
  kind: NormalizedErrorKind;
  status: number | null;
  message: string;
  serverMessage: string | null;
}
