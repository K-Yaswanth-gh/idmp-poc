/**
 * PDFをページに分割する処理
 */
import { PDFDocument } from "pdf-lib";
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import {
  getChecklistOriginalKey,
  getChecklistPageKey,
} from "../common/storage-paths";

/**
 * PDFをページに分割してS3に保存する
 * @param s3Client S3クライアント
 * @param bucketName バケット名
 * @param documentId ドキュメントID
 * @param fileName ファイル名
 * @returns ページ数
 */
export async function splitPdfPages(
  s3Client: S3Client,
  bucketName: string,
  documentId: string,
  fileName: string
): Promise<number> {
  // S3からPDFファイルを取得
  const originalKey = getChecklistOriginalKey(documentId, fileName);
  const { Body } = await s3Client.send(
    new GetObjectCommand({
      Bucket: bucketName,
      Key: originalKey,
    })
  );

  if (!Body) {
    throw new Error(`ファイルが見つかりません: ${originalKey}`);
  }

  // PDFをバイナリデータとして読み込み
  const pdfBytes = await Body.transformToByteArray();
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const pageCount = pdfDoc.getPageCount();

  // 各ページを個別のPDFとして保存
  for (let i = 0; i < pageCount; i++) {
    const newPdf = await PDFDocument.create();
    const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
    newPdf.addPage(copiedPage);

    const pageBytes = await newPdf.save();
    const pageKey = getChecklistPageKey(documentId, i + 1, "pdf");

    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: pageKey,
        Body: pageBytes,
        ContentType: "application/pdf",
      })
    );
  }

  return pageCount;
}
