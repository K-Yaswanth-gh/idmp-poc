import { S3TempStorage, S3TempReference } from "./s3-temp";
import { getS3Client } from "../api/core/s3";

/**
 * Step Functions タスクでS3 Temp対応を自動化
 * 他のタスクからS3参照データを受け取る場合に使用
 */
export function withS3TempResolve<TInput, TOutput>(
  handler: (input: TInput) => Promise<TOutput>
) {
  return async (input: TInput): Promise<TOutput> => {
    const s3TempStorage = new S3TempStorage(
      getS3Client(),
      process.env.TEMP_BUCKET || ""
    );

    // 🎯 入力データがS3参照なら自動復元
    const resolvedInput = await s3TempStorage.resolve(input);

    // 実際の処理を実行
    return await handler(resolvedInput);
  };
}

/**
 * Step Functions タスクでS3 Temp保存を自動化
 * 大きなデータを次のタスクに渡す場合に使用
 */
export function withS3TempStore<TInput, TOutput>(
  handler: (input: TInput) => Promise<TOutput>
) {
  return async (input: TInput): Promise<S3TempReference> => {
    const s3TempStorage = new S3TempStorage(
      getS3Client(),
      process.env.TEMP_BUCKET || ""
    );

    // 入力データがS3参照なら復元
    const resolvedInput = await s3TempStorage.resolve(input);

    // 実際の処理を実行
    const output = await handler(resolvedInput);

    // 🎯 出力データをS3に保存
    return await s3TempStorage.store(output);
  };
}
