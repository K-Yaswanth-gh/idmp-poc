/**
 * API関連の共通型定義
 */

export type SuccessResponse<T = any> = {
  success: true;
  data: T;
};

export type ErrorResponse = {
  success: false;
  error: string;
  errorType?: string;
};

/**
 * API レスポンスの共通型
 */
export type ApiResponse<T = any> = SuccessResponse<T> | ErrorResponse;
