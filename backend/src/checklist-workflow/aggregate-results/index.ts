/**
 * ページ結果の集計処理
 */
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import {
  getChecklistAggregateKey,
  getChecklistLlmOcrTextKey,
} from "../common/storage-paths";
import { ParsedChecklistItem, AggregatePageResult } from "../common/types";

export interface AggregatePageResultsParams {
  documentId: string;
  processedPages: {
    documentId: string;
    pageNumber: number;
  }[];
}

/**
 * ページ結果を集計する
 * @param params 集計パラメータ
 * @returns 集計結果
 */
export async function aggregatePageResults({
  documentId,
  processedPages,
}: AggregatePageResultsParams): Promise<AggregatePageResult> {
  const s3Client = new S3Client({});
  const bucketName = process.env.DOCUMENT_BUCKET || "";

  // 各ページの結果を統合
  const allChecklistItems: ParsedChecklistItem[] = [];

  // 各ページごとに処理
  for (const page of processedPages) {
    const pageNumber = page.pageNumber;

    // S3から結合済み結果を取得
    const combinedKey = getChecklistLlmOcrTextKey(documentId, pageNumber);
    console.log(`Combined Key for page ${pageNumber}: ${combinedKey}`);
    let pageItems: ParsedChecklistItem[];

    try {
      const response = await s3Client.send(
        new GetObjectCommand({
          Bucket: bucketName,
          Key: combinedKey,
        })
      );

      const bodyContents = await response.Body?.transformToString();
      if (!bodyContents) {
        throw new Error(`S3オブジェクトの内容が空です: ${combinedKey}`);
      }

      pageItems = JSON.parse(bodyContents);
    } catch (error) {
      console.error(`S3から結合結果の取得に失敗しました: ${error}`);
      throw new Error(
        `ページ ${pageNumber} の結合結果の取得に失敗しました: ${error}`
      );
    }

    // 数値IDからULIDへのマッピングを作成
    const idMapping: Record<string, string> = {};

    // 各項目にULIDを割り当て
    for (let i = 0; i < pageItems.length; i++) {
      const item = pageItems[i];
      // IDはすでに存在するはずなので、マッピングのみ行う
      const newId = item.id;
      idMapping[i] = newId;

      // 項目をコピー
      const newItem = { ...item };

      // parent_idの変換
      if (newItem.parent_id !== null && newItem.parent_id !== undefined) {
        newItem.parent_id = idMapping[newItem.parent_id] || null;
      }

      allChecklistItems.push(newItem);
    }
  }

  // 結果をS3に保存
  const aggregateKey = getChecklistAggregateKey(documentId);
  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: aggregateKey,
      Body: JSON.stringify(allChecklistItems),
      ContentType: "application/json",
    })
  );

  return {
    documentId,
  };
}
