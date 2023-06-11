type Pagination = {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
};

type PaginationWithCursor = {
  hasMore: boolean;
  endCursor: string;
};

export type ListResponse<T> = {
  data: T[];
  pageInfo: Pagination;
};

type ListResponseWithCursor<T> = {
  data: T[];
  pageInfo: PaginationWithCursor;
};

type singleResponse<T> = {
  data: T;
};

export interface ListParams {
  page: number;
  limit: number;
}
