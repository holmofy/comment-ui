export interface BaseAPIOptions {
  /**
   * Waline 服务端地址
   *
   * Waline serverURL
   */
  serverURL: string;
}

export interface APIErrorResponse {
  errno: number;
  errmsg: string;
}

export const JSON_HEADERS: Record<string, string> = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'Content-Type': 'application/json',
};

export const errorCheck = <T = unknown>(
  data: T | APIErrorResponse,
  name = ''
): T => {
  if (typeof data === 'object' && (data as APIErrorResponse).errno)
    throw new TypeError(
      `Fetch ${name} failed with ${(data as APIErrorResponse).errno}: ${
        (data as APIErrorResponse).errmsg
      }`
    );

  return data as T;
};
