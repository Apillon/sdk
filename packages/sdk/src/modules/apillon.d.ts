interface ApillonList<I> {
  items: I[];
  total: number;
}

interface ApillonResponse<D> {
  id: string;
  status: number;
  data: D;
}

interface ApillonStatus {
  status: number;
}
