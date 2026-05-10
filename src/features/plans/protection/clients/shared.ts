export interface ApiResponse<T> {
  status: string;
  operation: string;
  message?: string;
  data: T;
}
