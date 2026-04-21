import * as cdk from "aws-cdk-lib";
import { Template, Match } from "aws-cdk-lib/assertions";
import { Auth } from "../lib/constructs/auth";

describe("Auth Cognito Tests", () => {
  describe("Resource Creation and Import", () => {
    test("creates new UserPool and UserPoolClient when no import parameters provided", () => {
      // GIVEN
      const app = new cdk.App();
      const stack = new cdk.Stack(app, "TestStack");

      // WHEN
      new Auth(stack, "TestAuth", {});

      // THEN
      const template = Template.fromStack(stack);

      // Should create a new UserPool
      template.resourceCountIs("AWS::Cognito::UserPool", 1);

      // Should create a new UserPoolClient
      template.resourceCountIs("AWS::Cognito::UserPoolClient", 1);
    });

    test("imports existing UserPool when ID is provided", () => {
      // GIVEN
      const app = new cdk.App();
      const stack = new cdk.Stack(app, "TestStack");
      const userPoolId = "ap-northeast-1_testUserPoolId";

      // WHEN
      new Auth(stack, "TestAuth", {
        cognitoUserPoolId: userPoolId,
      });

      // THEN
      const template = Template.fromStack(stack);

      // Should NOT create a new UserPool (because we're importing)
      template.resourceCountIs("AWS::Cognito::UserPool", 0);

      // Should still create a new UserPoolClient (because we didn't provide a client ID)
      template.resourceCountIs("AWS::Cognito::UserPoolClient", 1);

      // Should have a string UserPoolId (rather than a Ref when creating new resources)
      template.hasResourceProperties("AWS::Cognito::UserPoolClient", {
        UserPoolId: userPoolId,
      });
    });

    test("imports both UserPool and Client when both IDs are provided", () => {
      // GIVEN
      const app = new cdk.App();
      const stack = new cdk.Stack(app, "TestStack");
      const userPoolId = "ap-northeast-1_testUserPoolId";
      const userPoolClientId = "testUserPoolClientId";

      // WHEN
      new Auth(stack, "TestAuth", {
        cognitoUserPoolId: userPoolId,
        cognitoUserPoolClientId: userPoolClientId,
      });

      // THEN
      const template = Template.fromStack(stack);

      // Should NOT create any new Cognito resources (because we're importing both)
      template.resourceCountIs("AWS::Cognito::UserPool", 0);
      template.resourceCountIs("AWS::Cognito::UserPoolClient", 0);
    });

    test("creates domain when domain prefix is provided", () => {
      // GIVEN
      const app = new cdk.App();
      const stack = new cdk.Stack(app, "TestStack");
      const domainPrefix = "test-domain";

      // WHEN
      new Auth(stack, "TestAuth", {
        cognitoDomainPrefix: domainPrefix,
      });

      // THEN
      const template = Template.fromStack(stack);

      // Should create a UserPoolDomain
      template.resourceCountIs("AWS::Cognito::UserPoolDomain", 1);

      // Domain should use the provided prefix
      template.hasResourceProperties("AWS::Cognito::UserPoolDomain", {
        Domain: domainPrefix,
      });
    });

    test("correctly handles Cognito parameters", () => {
      // GIVEN
      const app = new cdk.App();
      const stack = new cdk.Stack(app, "TestStack");
      const userPoolId = "ap-northeast-1_testUserPoolId";
      const userPoolClientId = "testUserPoolClientId";
      const domainPrefix = "test-domain";

      // WHEN
      new Auth(stack, "TestAuth", {
        cognitoUserPoolId: userPoolId,
        cognitoUserPoolClientId: userPoolClientId,
        cognitoDomainPrefix: domainPrefix,
      });

      // THEN
      const template = Template.fromStack(stack);

      // Should NOT create any new Cognito resources (because we're importing both)
      template.resourceCountIs("AWS::Cognito::UserPool", 0);
      template.resourceCountIs("AWS::Cognito::UserPoolClient", 0);

      // A domain is not created when importing a user pool
      template.resourceCountIs("AWS::Cognito::UserPoolDomain", 0);

      // Check for the correct output values
      const outputs = template.findOutputs("*");

      // Check for userPool ID in outputs
      const userPoolIdOutput = Object.values(outputs).some(
        (output) =>
          output.Value &&
          (output.Value === userPoolId ||
            (typeof output.Value === "string" &&
              output.Value.includes(userPoolId)))
      );
      expect(userPoolIdOutput).toBe(true);

      // Check for userPoolClient ID in outputs
      const clientIdOutput = Object.values(outputs).some(
        (output) =>
          output.Value &&
          (output.Value === userPoolClientId ||
            (typeof output.Value === "string" &&
              output.Value.includes(userPoolClientId)))
      );
      expect(clientIdOutput).toBe(true);
    });
  });

  describe("Self-Signup Configuration", () => {
    test("enables self-signup by default", () => {
      // GIVEN
      const app = new cdk.App();
      const stack = new cdk.Stack(app, "TestStack");

      // WHEN
      new Auth(stack, "TestAuth", {});

      // THEN
      const template = Template.fromStack(stack);

      // In CloudFormation, self sign-up is controlled by AdminCreateUserConfig.AllowAdminCreateUserOnly
      template.hasResourceProperties("AWS::Cognito::UserPool", {
        AdminCreateUserConfig: {
          AllowAdminCreateUserOnly: false,
        },
      });
    });

    test("disables self-signup when cognitoSelfSignUpEnabled=false", () => {
      // GIVEN
      const app = new cdk.App();
      const stack = new cdk.Stack(app, "TestStack");

      // WHEN
      new Auth(stack, "TestAuth", {
        cognitoSelfSignUpEnabled: false,
      });

      // THEN
      const template = Template.fromStack(stack);

      // In CloudFormation, self sign-up is controlled by AdminCreateUserConfig.AllowAdminCreateUserOnly
      template.hasResourceProperties("AWS::Cognito::UserPool", {
        AdminCreateUserConfig: {
          AllowAdminCreateUserOnly: true,
        },
      });
    });

    test("explicitly enables self-signup when cognitoSelfSignUpEnabled=true", () => {
      // GIVEN
      const app = new cdk.App();
      const stack = new cdk.Stack(app, "TestStack");

      // WHEN
      new Auth(stack, "TestAuth", {
        cognitoSelfSignUpEnabled: true,
      });

      // THEN
      const template = Template.fromStack(stack);

      // In CloudFormation, self sign-up is controlled by AdminCreateUserConfig.AllowAdminCreateUserOnly
      template.hasResourceProperties("AWS::Cognito::UserPool", {
        AdminCreateUserConfig: {
          AllowAdminCreateUserOnly: false,
        },
      });
    });
  });
});
