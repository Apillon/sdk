export interface IApillonList<I> {
  items: I[];
  total: number;
}

export interface IApillonResponse<D> {
  id: string;
  status: number;
  data: D;
}

export interface IApillonStatus {
  status: number;
}

export interface IApillonPagination {
  search?: string;
  page?: number;
  limit?: number;
  orderBy?: string;
  desc?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IApillonListResponse<T>
  extends IApillonResponse<IApillonList<T>> {}

export interface IApillonBoolResponse {
  success: boolean;
}

export enum LogLevel {
  NONE = 1,
  ERROR = 2,
  VERBOSE = 3,
}
