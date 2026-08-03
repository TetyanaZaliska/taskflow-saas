export interface PaginationMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface PaginationQuery {
  page?: number | string;
  limit?: number | string;
}
