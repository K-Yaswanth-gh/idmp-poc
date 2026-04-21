/**
 * チェックリスト項目をRDBに格納する
 */
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getChecklistAggregateKey } from "../common/storage-paths";
import { ParsedChecklistItem } from "../common/types";
import { makePrismaCheckRepository } from "../../api/features/checklist/domain/repository";
import {
  CheckListItemDomain,
  CHECK_LIST_STATUS,
} from "../../api/features/checklist/domain/model/checklist";

export interface StoreToDbParams {
  documentId: string;
  checkListSetId: string;
}

export interface StoreToDbResult {
  documentId: string;
  checkListSetId: string;
  success: boolean;
}

/**
 * S3から集約されたチェックリスト項目を取得してRDBに格納する
 * @param params パラメータ
 * @returns 処理結果
 */
export async function storeChecklistItemsToDb({
  documentId,
  checkListSetId,
}: StoreToDbParams): Promise<StoreToDbResult> {
  const s3Client = new S3Client({});
  const bucketName = process.env.DOCUMENT_BUCKET || "";
  const checkRepo = await makePrismaCheckRepository();

  try {
    // S3から集約結果を取得
    const aggregateKey = getChecklistAggregateKey(documentId);
    console.log(`S3から集約結果を取得: ${aggregateKey}`);

    const response = await s3Client.send(
      new GetObjectCommand({
        Bucket: bucketName,
        Key: aggregateKey,
      })
    );

    const bodyContents = await response.Body?.transformToString();
    if (!bodyContents) {
      throw new Error(`S3オブジェクトの内容が空です: ${aggregateKey}`);
    }

    console.log(`S3から取得した内容: ${bodyContents}`);

    const parsedItems: ParsedChecklistItem[] = JSON.parse(bodyContents);
    console.log(`パースされたアイテム数: ${parsedItems.length}`);

    if (!parsedItems || parsedItems.length === 0) {
      console.warn(`チェックリスト項目が見つかりませんでした: ${aggregateKey}`);
      // 項目がなくても処理は続行し、ドキュメントステータスを更新する
    } else {
      console.log(`チェックリスト項目を変換して保存します`);

      const items = parsedItems.map((parsedItem) => {
        console.log(`変換中のアイテム: ${JSON.stringify(parsedItem)}`);
        return CheckListItemDomain.fromParsedChecklistItem({
          item: parsedItem,
          setId: checkListSetId,
        });
      });

      console.log(`変換後のアイテム: ${JSON.stringify(items)}`);

      try {
        console.log(`リポジトリのbulkStoreCheckListItemsを呼び出します`);
        await checkRepo.bulkStoreCheckListItems({
          items,
        });
        console.log(`bulkStoreCheckListItems呼び出し成功`);
      } catch (repoError) {
        console.error(`リポジトリ呼び出し中にエラーが発生: ${repoError}`);
        throw repoError;
      }
    }

    console.log(`ドキュメントステータスを更新: ${documentId}`);
    try {
      await checkRepo.updateDocumentStatus({
        documentId,
        status: CHECK_LIST_STATUS.COMPLETED,
      });
      console.log(`ドキュメントステータス更新成功`);
    } catch (statusError) {
      console.error(`ステータス更新中にエラーが発生: ${statusError}`);
      throw statusError;
    }

    return {
      documentId,
      checkListSetId,
      success: true,
    };
  } catch (error) {
    console.error(`RDBへの格納に失敗しました: ${error}`);
    throw new Error(`チェックリスト項目のRDBへの格納に失敗しました: ${error}`);
  }
}
