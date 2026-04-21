import { NagSuppressions } from "cdk-nag";
import { RapidStack } from "./rapid-stack";

/**
 * Apply NagSuppressions to resources based on business requirements
 */
export function applyNagSuppressions(stack: RapidStack): void {
  // Individual construct-specific suppressions have been moved to their respective construct files
  // Only applying general stack-level suppressions here
  applyIamSuppressions(stack);
  applyLambdaSuppressions(stack);
}

/**
 * Apply suppressions for Lambda-related findings
 */
function applyLambdaSuppressions(stack: RapidStack): void {
  // Target specific auto-generated Lambda functions instead of the entire stack

  // AWS Custom Resource handlers
  const awsCustomResourceHandlers = stack.node
    .findAll()
    .filter((resource) =>
      resource.node.path.includes("AWS679f53fac002430cb0da5b7982bd2287")
    );

  if (awsCustomResourceHandlers.length > 0) {
    awsCustomResourceHandlers.forEach((handler) => {
      NagSuppressions.addResourceSuppressions(
        handler,
        [
          {
            id: "AwsSolutions-L1",
            reason: "AwsCustomResource is controlled internally by CDK",
          },
        ],
        true
      );
    });
  }

  // NodejsBuildCustomResource handlers
  const nodejsCustomResourceHandler = stack.node
    .findAll()
    .find((resource) =>
      resource.node.path.includes("NodejsBuildCustomResourceHandler")
    );
  if (nodejsCustomResourceHandler) {
    NagSuppressions.addResourceSuppressions(
      nodejsCustomResourceHandler,
      [
        {
          id: "AwsSolutions-L1",
          reason:
            "CDK-generated NodejsBuild Lambda function - Runtime version is fixed and cannot be modified",
        },
      ],
      true
    );
  }

  // S3 bucket deployment handlers
  const bucketDeployment = stack.node
    .findAll()
    .find((resource) => resource.node.path.includes("CDKBucketDeployment"));
  if (bucketDeployment) {
    NagSuppressions.addResourceSuppressions(
      bucketDeployment,
      [
        {
          id: "AwsSolutions-L1",
          reason:
            "S3 bucket deployment Lambda function - Third-party library with fixed runtime version",
        },
      ],
      true
    );
  }
}

/**
 * Apply stack-level suppressions for IAM-related findings
 */
function applyIamSuppressions(stack: RapidStack): void {
  // These construct-specific suppressions have been moved to their respective construct files
  // Only stack-level suppressions remain here

  // General suppressions for IAM wildcard permissions across the stack
  NagSuppressions.addStackSuppressions(stack, [
    {
      id: "AwsSolutions-IAM4",
      reason:
        "Managed policies are used for simplicity in this sample application",
    },
    {
      id: "AwsSolutions-IAM5",
      reason:
        "Bucket access with wildcards is needed for convenience in sample environment",
    },
  ]);
}
