import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import { Construct } from "constructs";
import { NagSuppressions } from "cdk-nag";

export interface FrontendProps {
  accessLogBucket: s3.IBucket;
  webAclId: string;
  enableIpV6: boolean;
}

export class Frontend extends Construct {
  public readonly bucket: s3.Bucket;
  public readonly distribution: cloudfront.Distribution;

  constructor(scope: Construct, id: string, props: FrontendProps) {
    super(scope, id);

    /**
     * Access logs bucket for all frontend-related buckets
     */
    const frontendAccessLogsBucket = new s3.Bucket(
      this,
      "FrontendAccessLogsBucket",
      {
        encryption: s3.BucketEncryption.S3_MANAGED,
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
        enforceSSL: true,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        objectOwnership: s3.ObjectOwnership.OBJECT_WRITER,
      }
    );

    /**
     * Frontend hosting bucket
     */
    this.bucket = new s3.Bucket(this, "FrontendBucket", {
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      objectOwnership: s3.ObjectOwnership.OBJECT_WRITER,

      serverAccessLogsBucket: frontendAccessLogsBucket,
      serverAccessLogsPrefix: "FrontendBucket/",
    });

    /**
     * CloudFront logs bucket
     */
    const cloudfrontLogsBucket = new s3.Bucket(
      this,
      "CloudFrontLogsBucket",
      {
        encryption: s3.BucketEncryption.S3_MANAGED,
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
        enforceSSL: true,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        objectOwnership: s3.ObjectOwnership.OBJECT_WRITER,

        serverAccessLogsBucket: frontendAccessLogsBucket,
        serverAccessLogsPrefix: "CloudFrontLogsBucket/",
      }
    );

    /**
     * Origin Access Control
     */
    const origin = origins.S3BucketOrigin.withOriginAccessControl(
      this.bucket
    );

    /**
     * CloudFront distribution
     */
    this.distribution = new cloudfront.Distribution(
      this,
      "FrontendDistribution",
      {
        defaultRootObject: "index.html",
        
        defaultBehavior: {
          origin,
          viewerProtocolPolicy:
          cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
        
        errorResponses: [
          {
            httpStatus: 403,
            responseHttpStatus: 200,
            responsePagePath: "/index.html",
            ttl: cdk.Duration.seconds(0),
          },
          {
            httpStatus: 404,
            responseHttpStatus: 200,
            responsePagePath: "/index.html",
            ttl: cdk.Duration.seconds(0),
          },
        ],

        minimumProtocolVersion:
        cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
        enableIpv6: props.enableIpV6,
        webAclId: props.webAclId,
        logBucket: cloudfrontLogsBucket,
        logFilePrefix: "cloudfront-access-logs/",
      });

    /**
     * Outputs
     */
    new cdk.CfnOutput(this, "FrontendURL", {
      value: `https://${this.distribution.domainName}`,
    });

    new cdk.CfnOutput(this, "FrontendBucketName", {
      value: this.bucket.bucketName,
    });

    new cdk.CfnOutput(this, "CloudFrontDistributionId", {
      value: this.distribution.distributionId,
    });

    /**
     * cdk-nag suppressions
     */
    NagSuppressions.addResourceSuppressions(
      this.distribution,
      [
        {
          id: "AwsSolutions-CFR1",
          reason:
            "Geo restrictions are not required for this internal enterprise deployment.",
        },
        {
          id: "AwsSolutions-CFR4",
          reason:
            "CloudFront distribution explicitly enforces TLS 1.2_2021.",
        },
      ],
      true
    );
  }
}