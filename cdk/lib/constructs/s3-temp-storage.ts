import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

export interface S3TempStorageProps {
  accessLogBucket: s3.IBucket;
}

export class S3TempStorage extends Construct {
  public readonly bucket: s3.Bucket;

  constructor(scope: Construct, id: string, props: S3TempStorageProps) {
    super(scope, id);

    // S3 Temp 専用バケットの作成
    this.bucket = new s3.Bucket(this, 'TempBucket', {
      // セキュリティ設定
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
      
      // ライフサイクル設定 - 一時データの自動削除
      lifecycleRules: [{
        id: 'DeleteTempData',
        expiration: cdk.Duration.days(7), // 7日で自動削除
        prefix: 'temp/',
        abortIncompleteMultipartUploadAfter: cdk.Duration.days(1)
      }, {
        id: 'DeleteExpiredMultipartUploads',
        abortIncompleteMultipartUploadAfter: cdk.Duration.days(1)
      }],
      
      // 開発環境では自動削除を有効化
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      
      // オブジェクト所有権設定
      objectOwnership: s3.ObjectOwnership.OBJECT_WRITER,
      
      // バージョニングは無効（一時データなので不要）
      versioned: false,
      
      // サーバーアクセスログ設定（CDK-NAG対応）
      serverAccessLogsBucket: props.accessLogBucket,
      serverAccessLogsPrefix: "TempBucket",
    });

    // CloudFormation 出力
    new cdk.CfnOutput(this, 'TempBucketName', {
      value: this.bucket.bucketName,
      description: 'S3 Temp Storage Bucket Name'
    });
  }
}