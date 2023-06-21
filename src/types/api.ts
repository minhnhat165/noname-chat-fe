type Pagination = {
  limit: number;
  total: number;
  currentPage: number;
  totalPages: number;
};

type CursorPagination = {
  hasMore: boolean;
  endCursor: string;
};

export type ListResponse<T> = {
  data: T[];
  pageInfo: Pagination;
};

export type CursorPaginationResponse<T> = {
  data: T[];
  pageInfo: CursorPagination;
};

export type SingleResponse<T> = {
  data: T;
};

export interface ListParams {
  page: number;
  limit: number;
}
export type CursorPaginationParams = {
  limit: number;
  cursor: string;
};
export type SuccessResponse = {
  message: string;
};
