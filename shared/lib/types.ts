/** Standard envelope returned by every IRB Forge API endpoint. */
export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  data: T;
  message: string | null;
  timestamp: string;
}

export interface ApiError {
  success: false;
  statusCode: number;
  error: {
    code: string;
    message: string;
    details: Array<{ message: string }>;
  };
  path: string;
  timestamp: string;
}

export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}
