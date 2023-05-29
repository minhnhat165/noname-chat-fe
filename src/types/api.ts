type Pagination = {
  page: number;
  limit: number;
  total: number;
};

type PaginationWithCursor = {
  hasMore: boolean;
  endCursor: string;
};

type listResponse<T> = {
  data: T[];
} & Pagination;

type listResponseWithCursor<T> = {
  data: T[];
  pageInfo: PaginationWithCursor;
};

type singleResponse<T> = {
  data: T;
};
