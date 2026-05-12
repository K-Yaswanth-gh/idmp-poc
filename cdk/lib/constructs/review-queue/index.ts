import * as cdk from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaEventSources from "aws-cdk-lib/aws-lambda-event-sources";
import * as sqs from "aws-cdk-lib/aws-sqs";
import { NagSuppressions } from "cdk-nag/lib/nag-suppressions";
import { Construct } from "constructs";
import * as path from "path";
import * as logs from "aws-cdk-lib/aws-logs";

export interface ReviewQueueProcessorProps {
  /**
   * Environment variables for the review queue consumer Lambda.
   */
  environment?: { [key: string]: string };

  /**
   * Lambda log retention days (see parameter-schema.ts).
   */
  lambdaLogRetentionDays?: number;
}

export class ReviewQueueProcessor extends Construct {
  public readonly lambdaFunction: lambda.Function;
  public readonly queue: sqs.Queue;

  constructor(
    scope: Construct,
    id: string,
    props: ReviewQueueProcessorProps = {},
  ) {
    super(scope, id);

    const dlq = new sqs.Queue(this, "ReviewDLQ", {
      queueName: `${cdk.Stack.of(this).stackName}-ReviewDLQ.fifo`,
      fifo: true,
      enforceSSL: true,
      retentionPeriod: cdk.Duration.days(14),
    });

    this.queue = new sqs.Queue(this, "MainQueue", {
      queueName: `${cdk.Stack.of(this).stackName}-ReviewQueue.fifo`,
      encryption: sqs.QueueEncryption.SQS_MANAGED,
      enforceSSL: true,
      fifo: true,
      visibilityTimeout: cdk.Duration.minutes(18),
      retentionPeriod: cdk.Duration.days(4),
      deliveryDelay: cdk.Duration.seconds(0),
      contentBasedDeduplication: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      deadLetterQueue: {
        queue: dlq,
        maxReceiveCount: 5,
      },
    });
    
	  const lambdaRole = new iam.Role(this, "ReviewQueueLambdaRole", {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
      permissionsBoundary: iam.ManagedPolicy.fromManagedPolicyArn(
        scope,
        "ReviewQueueLambdaRolePermissionsBoundary",
        "arn:aws:iam::553607017161:policy/VA-PB-Standard"
      ),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          "service-role/AWSLambdaBasicExecutionRole",
        ),
      ],
    });


    this.lambdaFunction = new lambda.Function(this, "PythonFunction", {
      role: lambdaRole,
      runtime: lambda.Runtime.PYTHON_3_14,
      handler: "handler.lambda_handler",
      code: lambda.Code.fromAsset(path.join(__dirname, "consumer")),
      timeout: cdk.Duration.minutes(3),
      memorySize: 512,
      environment: {
        REVIEW_QUEUE_URL: this.queue.queueUrl,
        ...props.environment,
      },
      reservedConcurrentExecutions: 1,
    });

    new logs.LogGroup(this, "ReviewQueueLogGroup", {
      logGroupName: `/aws/lambda/${this.lambdaFunction.functionName}`,
      retention:
      props.lambdaLogRetentionDays ??
      logs.RetentionDays.THREE_YEARS,
      removalPolicy: cdk.RemovalPolicy.RETAIN, // recommended for prod
});

    const eventSource = new lambdaEventSources.SqsEventSource(this.queue, {
      batchSize: 1,
      reportBatchItemFailures: true,
    });

    this.lambdaFunction.addEventSource(eventSource);

    lambdaRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["lambda:InvokeFunction"],
        resources: ["*"],
      }),
    );

    lambdaRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["states:ListExecutions", "states:StartExecution"],
        resources: ["*"],
      }),
    );

    this.queue.grantConsumeMessages(lambdaRole);
    this.queue.grantSendMessages(lambdaRole);

    new cdk.CfnOutput(this, "LambdaFunctionName", {
      value: this.lambdaFunction.functionName,
      description: "Review queue consumer Lambda function name",
    });

    new cdk.CfnOutput(this, "QueueUrl", {
      value: this.queue.queueUrl,
      description: "Review queue URL",
    });

    NagSuppressions.addResourceSuppressions(this.queue, [
      {
        id: "AwsSolutions-SQS3",
        reason:
          "FIFO queue with content-based deduplication; retry handling uses batch item failures.",
      },
    ]);
    console.log("[COMPLETED] ReviewQueueProcessor Creation");
  }
}
