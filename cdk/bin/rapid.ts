#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { Aspects } from "aws-cdk-lib";
import { RapidStack } from "../lib/rapid-stack";
import { FrontendWafStack } from "../lib/frontend-waf-stack";
import {
  extractContextParameters,
  resolveParameters,
} from "../lib/parameter-schema";
import { AwsSolutionsChecks } from "cdk-nag";
import { applyNagSuppressions } from "../lib/nag-suppressions";

const app = new cdk.App();

/**
 * ---------------------------------------------------------------------------
 * ✅ CUSTOM SYNTHESIZER (FOR CDKToolkit-uwdmstest)
 * ---------------------------------------------------------------------------
 * This forces ALL stacks to use the existing bootstrap stack:
 *   CDKToolkit-uwdmstest
 *
 * CDK will NO LONGER look for:
 *   /cdk-bootstrap/hnb659fds/version
 */
const account = process.env.CDK_DEFAULT_ACCOUNT;
const region = process.env.CDK_DEFAULT_REGION;

const uwdmstestSynthesizer = new cdk.DefaultStackSynthesizer({
  qualifier: "uwdmstest",

  // MUST already exist in CDKToolkit-uwdmstest
  bootstrapStackVersionSsmParameter:
    "/cdk-bootstrap/uwdmstest/version",

  // MUST match the existing assets bucket
  bucketPrefix: "cdk-uwdmstest-assets",

  // OPTIONAL but strongly recommended for clarity
  deployRoleArn: `arn:aws:iam::${account}:role/cdk-uwdmstest-deploy-role-${account}-${region}`,
  lookupRoleArn: `arn:aws:iam::${account}:role/cdk-uwdmstest-lookup-role-${account}-${region}`,
  fileAssetPublishingRoleArn: `arn:aws:iam::${account}:role/cdk-uwdmstest-file-publishing-role-${account}-${region}`,
});

/**
 * ---------------------------------------------------------------------------
 * Parameter handling
 * ---------------------------------------------------------------------------
 */
const contextParams = extractContextParameters(app);
const parameters = resolveParameters(contextParams);

/**
 * ---------------------------------------------------------------------------
 * Frontend WAF stack (us-east-1 REQUIRED)
 * ---------------------------------------------------------------------------
 */
const waf = new FrontendWafStack(app, "RapidFrontendWafStack", {
  env: {
    account,
    region: "us-east-1",
  },
  synthesizer: uwdmstestSynthesizer, // ✅ REQUIRED
  envPrefix: "",
  allowedIpV4AddressRanges: parameters.allowedIpV4AddressRanges,
  allowedIpV6AddressRanges: parameters.allowedIpV6AddressRanges,
});

/**
 * ---------------------------------------------------------------------------
 * Main application stack
 * ---------------------------------------------------------------------------
 */
new RapidStack(app, "RapidStack", {
  env: {
    account,
    region: region || "us-west-2",
  },
  synthesizer: uwdmstestSynthesizer, // ✅ REQUIRED
  crossRegionReferences: true,
  webAclId: waf.webAclArn.value,
  enableIpV6: waf.ipV6Enabled,
  parameters,
});

/**
 * ---------------------------------------------------------------------------
 * CDK‑Nag
 * ---------------------------------------------------------------------------
 */
Aspects.of(app).add(new AwsSolutionsChecks());

// Apply suppressions
const stacks = app.node.children.filter(
  (child) => child instanceof cdk.Stack
);
for (const stack of stacks) {
  if (stack instanceof RapidStack) {
    applyNagSuppressions(stack);
  }
}