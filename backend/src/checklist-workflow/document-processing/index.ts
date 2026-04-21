/**
 * ドキュメント処理モジュールのエントリポイント
 */
import { S3Client } from "@aws-sdk/client-s3";
import { splitPdfPages } from "./split-pages";
import { ProcessDocumentResult } from "../common/types";
import { makePrismaCheckRepository } from "../../api/features/checklist/domain/repository";
import { CHECK_LIST_STATUS } from "../../api/features/checklist/domain/model/checklist";

export interface ProcessDocumentParams {
  documentId: string;
  fileName: string;
}

/**
 * ドキュメントを処理する
 * @param params ドキュメント処理パラメータ
 * @returns 処理結果
 */
export async function processDocument({
  documentId,
  fileName,
}: ProcessDocumentParams): Promise<ProcessDocumentResult> {
  // ドキュメントステータスを処理中に更新
  const checkRepository = await makePrismaCheckRepository();
  await checkRepository.updateDocumentStatus({
    documentId,
    status: CHECK_LIST_STATUS.PROCESSING,
  });

  // ファイル拡張子の確認
  const fileExtension = fileName.split(".").pop()?.toLowerCase();
  if (fileExtension !== "pdf") {
    throw new Error(`サポートされていないファイル形式です: ${fileExtension}`);
  }

  const s3Client = new S3Client({});
  const bucketName = process.env.DOCUMENT_BUCKET || "";

  // PDFをページに分割
  const pageCount = await splitPdfPages(
    s3Client,
    bucketName,
    documentId,
    fileName
  );

  // 各ページの情報を返す
  const pages = Array.from({ length: pageCount }, (_, i) => ({
    pageNumber: i + 1,
  }));

  return {
    documentId,
    pageCount,
    pages,
  };
}
