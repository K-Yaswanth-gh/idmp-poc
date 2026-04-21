/**
 * Step Functions関連のユーティリティ
 */
import { SFNClient, StartExecutionCommand } from "@aws-sdk/client-sfn";
import { ApplicationError } from "./errors";

// SFNクライアントのシングルトンインスタンス
let sfnClient: SFNClient | null = null;

/**
 * SFNクライアントを取得する
 * @returns SFNクライアントインスタンス
 */
export function getSfnClient(): SFNClient {
  if (!sfnClient) {
    sfnClient = new SFNClient({
      region: process.env.AWS_REGION || "ap-northeast-1",
    });
  }
  return sfnClient;
}

/**
 * ステートマシンの実行を開始する
 * @param stateMachineArn ステートマシンのARN
 * @param input 入力データ
 * @returns 実行ARN
 */
export async function startStateMachineExecution(
  stateMachineArn: string,
  input: Record<string, any>
): Promise<string> {
  const client = getSfnClient();
  const command = new StartExecutionCommand({
    stateMachineArn,
    input: JSON.stringify(input),
  });

  const response = await client.send(command);

  if (response.$metadata.httpStatusCode !== 200) {
    throw new ApplicationError(
      `Failed to start state machine execution: ${response}`
    );
  }

  return response.executionArn || "";
}
