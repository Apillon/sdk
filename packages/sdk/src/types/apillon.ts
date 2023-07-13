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
