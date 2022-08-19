#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { CdkHealthDashboardNotificationStack } from "../lib/cdk-health-dashboard-notification-stack";

const app = new cdk.App();
new CdkHealthDashboardNotificationStack(
  app,
  "CdkHealthDashboardNotificationStack"
);
