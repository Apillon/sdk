export interface IApillonList<I> {
  items: I[];
  total: number;
}

export interface IApillonPagination {
  search?: string;
  page?: number;
  limit?: number;
  orderBy?: string;
  desc?: boolean;
}

export enum LogLevel {
  NONE = 1,
  ERROR = 2,
  VERBOSE = 3,
}
