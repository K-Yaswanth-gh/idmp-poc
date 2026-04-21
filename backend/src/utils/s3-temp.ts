import {
  S3Client,
  GetObjectCommand,
  DeleteObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { ulid } from "ulid";

export interface S3TempReference {
  __s3_temp_ref__: true;
  bucket: string;
  key: string;
  expires_at: string;
}

export class S3TempStorage {
  private keyPrefix: string;
  private ttlHours: number;

  constructor(
    private s3Client: S3Client,
    private bucketName: string,
    keyPrefix: string = "temp/",
    ttlHours: number = 24
  ) {
    this.keyPrefix = keyPrefix;
    this.ttlHours = ttlHours;
  }

  async store<T>(payload: T): Promise<S3TempReference> {
    /**
     * ペイロード全体をS3に保存し、参照情報を返す
     */
    const tempKey = `${this.keyPrefix}${ulid()}.json`;
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + this.ttlHours);

    const payloadJson = JSON.stringify(payload);

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: tempKey,
        Body: payloadJson,
        ContentType: "application/json",
        Metadata: {
          expires_at: expiresAt.toISOString(),
          size: payloadJson.length.toString(),
        },
      })
    );

    console.log(
      `[S3Temp] Stored data to: ${tempKey} (${payloadJson.length} bytes)`
    );

    return {
      __s3_temp_ref__: true,
      bucket: this.bucketName,
      key: tempKey,
      expires_at: expiresAt.toISOString(),
    };
  }

  async resolve<T>(input: T | S3TempReference): Promise<T> {
    /**
     * S3参照から実データを復元
     */
    if (this._isS3TempRef(input)) {
      console.log(`[S3Temp] Resolving data from: ${input.key}`);

      // S3から実データを取得
      const response = await this.s3Client.send(
        new GetObjectCommand({
          Bucket: input.bucket,
          Key: input.key,
        })
      );

      const body = await response.Body?.transformToString();
      const resolvedData = JSON.parse(body || "{}");

      console.log(
        `[S3Temp] Resolved data from: ${input.key} (${body?.length || 0} bytes)`
      );

      // 取得後にクリーンアップ
      await this._cleanup(input);

      return resolvedData;
    }

    return input as T;
  }

  private _isS3TempRef(data: any): data is S3TempReference {
    return (
      data &&
      typeof data === "object" &&
      data.__s3_temp_ref__ === true &&
      data.bucket &&
      data.key
    );
  }

  private async _cleanup(ref: S3TempReference): Promise<void> {
    try {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: ref.bucket,
          Key: ref.key,
        })
      );
      console.log(`[S3Temp] Cleaned up: ${ref.key}`);
    } catch (error) {
      console.warn(`[S3Temp] Failed to cleanup ${ref.key}:`, error);
    }
  }
}
