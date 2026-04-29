export interface ApiResponse<T = unknown> {
  statusCode: number;
  description: string[];
  data: T;
}

export interface PagedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ApiError {
  statusCode: number;
  description: string[];
}




