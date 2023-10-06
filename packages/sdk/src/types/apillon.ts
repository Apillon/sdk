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

export enum LogLevel {
  NONE = 1,
  ERROR = 2,
  VERBOSE = 3,
}
