export interface IApiRes<T = unknown> {
  ok: boolean;
  data?: T;
  message?: string;
}
