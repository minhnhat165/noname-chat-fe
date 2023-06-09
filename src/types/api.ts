type Pagination = {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
};

type PaginationWithCursor = {
  hasMore: boolean;
  endCursor: string;
};

export type ListResponse<T> = {
  data: T[];
} & Pagination;

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
