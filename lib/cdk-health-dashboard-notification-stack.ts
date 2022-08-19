import { Duration, Stack, StackProps } from "aws-cdk-lib";
import * as sns from "aws-cdk-lib/aws-sns";
import * as subs from "aws-cdk-lib/aws-sns-subscriptions";
import { Construct } from "constructs";
import * as events from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";

export class CdkHealthDashboardNotificationStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const topic = new sns.Topic(this, "CdkHealthDashboardNotificationTopic");
    new events.Rule(this, "CdkHealthDashboardNotificationRule", {
      eventPattern: {
        source: ["aws.health"],
      },
      targets: [new targets.SnsTopic(topic)],
    });
  }
}
