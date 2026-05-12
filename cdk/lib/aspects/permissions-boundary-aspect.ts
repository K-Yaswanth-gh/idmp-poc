import { IAspect } from 'aws-cdk-lib';
import { IConstruct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Stack } from 'aws-cdk-lib';

export class PermissionsBoundaryAspect implements IAspect {
  private readonly boundaryPolicyPerStack = new Map<Stack, iam.IManagedPolicy>();

  constructor(private readonly boundaryPolicyArn: string) {}

  visit(node: IConstruct): void {
    if (node instanceof iam.Role) {
      const stack = Stack.of(node);

      // Create the boundary policy ONCE per stack
      let boundaryPolicy = this.boundaryPolicyPerStack.get(stack);
      if (!boundaryPolicy) {
        boundaryPolicy = iam.ManagedPolicy.fromManagedPolicyArn(
          stack,
          'PermissionsBoundaryPolicy',
          this.boundaryPolicyArn,
        );
        this.boundaryPolicyPerStack.set(stack, boundaryPolicy);
      }

      // Correct, supported API
      iam.PermissionsBoundary.of(node).apply(boundaryPolicy);
    }
  }
}