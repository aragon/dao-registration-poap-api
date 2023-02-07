type HttpHeaders = Record<string, string>;

export type HttpConfig = {
  headers: HttpHeaders;
  baseURL: string;
};
