export type ApiResult<T> =
  | { ok: true; value: T }
  | { ok: false; code: string; message: string; recoverable: boolean };

export type SignedReadUrl = {
  url: string;
  expiresAt: number;
};
