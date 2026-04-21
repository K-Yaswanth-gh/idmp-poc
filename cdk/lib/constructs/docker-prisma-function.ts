// Ref: https://github.com/aws-samples/prisma-lambda-cdk/blob/main/lib/construct/prisma-function.ts

import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import * as iam from "aws-cdk-lib/aws-iam";
import { DatabaseConnectionProps } from "./database";

interface DockerPrismaFunctionProps extends lambda.DockerImageFunctionProps {
  database: DatabaseConnectionProps;
}

export class DockerPrismaFunction extends lambda.DockerImageFunction {
  constructor(scope: Construct, id: string, props: DockerPrismaFunctionProps) {
    const handlerRole =
      props.role ||
      new iam.Role(scope, "HandlerRole", {
        assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
      });
    // Add VPC access to the Lambda function
    handlerRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName(
        "service-role/AWSLambdaVPCAccessExecutionRole"
      )
    );

    // SecretsManagerへのアクセス権限を追加
    props.database.secret.grantRead(handlerRole);

    super(scope, id, {
      ...props,
      role: handlerRole,
      environment: {
        ...props.environment,
        DATABASE_SECRET_ARN: props.database.secret.secretArn,
        DATABASE_OPTION: "?pool_timeout=20&connect_timeout=20",
      },
    });
  }
}
