export interface Options {
  [key: string]: string;
}

export interface GlobalOptions {
  key: string;
  secret: string;
  apiUrl?: string;
  [key: string]: string;
}
