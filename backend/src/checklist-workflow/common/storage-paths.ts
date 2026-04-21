/**
 * ストレージパス関連のユーティリティ
 */

/**
 * オリジナルドキュメントのS3キーを生成する
 * @param documentId ドキュメントID
 * @param filename ファイル名
 * @returns S3キー
 */
export function getChecklistOriginalKey(
  documentId: string,
  filename: string
): string {
  return `checklist/original/${documentId}/${filename}`;
}

/**
 * 審査ドキュメントのS3キーを生成する
 * @param documentId 審査ドキュメントID
 * @param filename ファイル名
 * @returns S3キー
 */
export function getReviewDocumentKey(
  documentId: string,
  filename: string
): string {
  return `review/original/${documentId}/${filename}`;
}

/**
 * 審査画像ファイルのS3キーを生成する
 * @param documentId 審査ドキュメントID
 * @param filename ファイル名
 * @param index ファイルインデックス (複数画像の場合)
 * @returns S3キー
 */
export function getReviewImageKey(
  documentId: string,
  filename: string,
  index?: number
): string {
  if (index !== undefined) {
    return `review/images/${documentId}/${index}_${filename}`;
  }
  return `review/images/${documentId}/${filename}`;
}

/**
 * 処理済みドキュメントのS3キーを生成する
 * @param documentId ドキュメントID
 * @param filename ファイル名
 * @returns S3キー
 */
export function getChecklistProcessedKey(
  documentId: string,
  filename: string
): string {
  return `checklist/processed/${documentId}/${filename}`;
}

/**
 * ドキュメントページのS3キーを生成する
 * @param documentId ドキュメントID
 * @param pageNumber ページ番号
 * @returns S3キー
 */
export function getChecklistPageKey(
  documentId: string,
  pageNumber: number,
  extension: string
): string {
  return `checklist/pages/${documentId}/page_${pageNumber}.${extension}`;
}

/**
 * ページLLM OCRテキストのS3キーを生成する
 * @param documentId ドキュメントID
 * @param pageNumber ページ番号
 * @returns S3キー
 */
export function getChecklistLlmOcrTextKey(
  documentId: string,
  pageNumber: number
): string {
  return `checklist/llm_ocr/${documentId}/page_${pageNumber}.json`;
}

/**
 * ドキュメント集計結果のS3キーを生成する
 * @param documentId ドキュメントID
 * @returns S3キー
 */
export function getChecklistAggregateKey(documentId: string): string {
  return `checklist/aggregate/${documentId}/result.json`;
}
