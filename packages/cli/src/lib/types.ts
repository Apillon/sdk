export interface Params {
  [Key: string]: string;
}

export interface GlobalParams {
  key: string;
  secret: string;
  apiUrl?: string;
}
