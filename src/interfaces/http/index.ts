export interface ApiResponse<T> {
  status: number;
  data?: {
    items?: T[];
  };
}

export interface StandardApiResponse {
  status: number;
  message: string;
  data?: unknown;
}

export interface ResourceListResponse<T> {
  status: number;
  operation: string;
  message: string;
  data: {
    items: T[];
  };
}

export interface ResourceDetailsResponse<T> {
  status: number;
  operation: string;
  message: string;
  data: T;
}

export interface ErrorInterceptorOptions {
  silent404?: boolean;
}
