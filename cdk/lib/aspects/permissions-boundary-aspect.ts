import { IAspect } from 'aws-cdk-lib';
import { IConstruct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';

export class PermissionsBoundaryAspect implements IAspect {
  constructor(private readonly boundaryPolicyArn: string) {}

  visit(node: IConstruct): void {
    if (node instanceof iam.Role) {
      // Attach permissions boundary to ALL roles
      node.permissionsBoundary = iam.ManagedPolicy.fromManagedPolicyArn(
        node,
        'PermissionsBoundary',
        this.boundaryPolicyArn,
      );
    }
  }
}