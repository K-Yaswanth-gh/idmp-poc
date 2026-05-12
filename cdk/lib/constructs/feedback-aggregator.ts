import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as iam from "aws-cdk-lib/aws-iam";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as scheduler from "aws-cdk-lib/aws-scheduler";
import * as schedulerTargets from "aws-cdk-lib/aws-scheduler-targets";
import * as path from "path";
import { Construct } from "constructs";
import { DockerPrismaFunction } from "./docker-prisma-function";
import { Platform } from "aws-cdk-lib/aws-ecr-assets";
import { DatabaseConnectionProps } from "./database";

export interface FeedbackAggregatorProps {
  vpc: ec2.IVpc;
  databaseConnection: DatabaseConnectionProps;
  bedrockRegion: string;
  aggregationDays?: number;
  scheduleExpression?: string;
  summaryModelId?: string;
}

export class FeedbackAggregator extends Construct {
  public readonly lambda: lambda.Function;
  public readonly securityGroup: ec2.SecurityGroup;

  constructor(scope: Construct, id: string, props: FeedbackAggregatorProps) {
    super(scope, id);

    const aggregationDays = props.aggregationDays || 7;
    const scheduleExpression = props.scheduleExpression || "cron(0 2 * * ? *)";
    const summaryModelId =
      props.summaryModelId || "global.anthropic.claude-sonnet-4-20250514-v1:0";

    // Security group
    this.securityGroup = new ec2.SecurityGroup(this, "SecurityGroup", {
      vpc: props.vpc,
      description: "Security group for Feedback Aggregator Lambda",
      allowAllOutbound: true,
    });

    const lambdaRole = new iam.Role(this, "FeedbackAggregatorLambdaRole", {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
      permissionsBoundary: iam.ManagedPolicy.fromManagedPolicyArn(
        scope,
        "FeedbackAggregatorLambdaRolePermissionsBoundary",
        "arn:aws:iam::553607017161:policy/VA-PB-Standard"
      ),
    });

    lambdaRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaBasicExecutionRole")
    );

    lambdaRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaVPCAccessExecutionRole")
    );


    // Lambda function
    this.lambda = new DockerPrismaFunction(this, "Function", {
      role: lambdaRole,
      code: lambda.DockerImageCode.fromImageAsset(
        path.join(__dirname, "../../../backend/"),
        {
          file: "Dockerfile.prisma.lambda",
          platform: Platform.LINUX_ARM64,
          cmd: ["dist/feedback-aggregator/index.handler"],
        }
      ),
      memorySize: 1024,
      timeout: cdk.Duration.minutes(15),
      vpc: props.vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
      environment: {
        FEEDBACK_AGGREGATION_DAYS: aggregationDays.toString(),
        BEDROCK_REGION: props.bedrockRegion,
        SUMMARY_MODEL_ID: summaryModelId,
        MAX_CONTEXT_TOKENS: "8000",
      },
      securityGroups: [this.securityGroup],
      database: props.databaseConnection,
      architecture: lambda.Architecture.ARM_64,
    });

    // Bedrock permissions
    lambdaRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ["bedrock:InvokeModel"],
        resources: ["*"],
      })
    );

    const schedulerRole = new iam.Role(this, "FeedbackAggregatorSchedulerRole", {
      assumedBy: new iam.ServicePrincipal("scheduler.amazonaws.com"),
      permissionsBoundary: iam.ManagedPolicy.fromManagedPolicyArn(
        scope,
        "FeedbackAggregatorSchedulerRolePermissionsBoundary",
        "arn:aws:iam::553607017161:policy/VA-PB-Standard"
      ),
    });

    this.lambda.grantInvoke(schedulerRole);

    // EventBridge Scheduler for scheduled execution
    new scheduler.Schedule(this, "FeedbackAggregatorSchedule", {
      schedule: scheduler.ScheduleExpression.expression(scheduleExpression),
      target: new schedulerTargets.LambdaInvoke(this.lambda, {
        role: schedulerRole,
      }),
      description: "Daily feedback summary aggregation",
    });
    console.log("[COMPLETED] FeedbackAggregator Creation")
  }
}
