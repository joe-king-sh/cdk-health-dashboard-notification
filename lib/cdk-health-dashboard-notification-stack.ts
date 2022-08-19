import { Stack, StackProps } from "aws-cdk-lib";
import * as sns from "aws-cdk-lib/aws-sns";
import { Construct } from "constructs";
import * as events from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";
import { SlackChannelConfiguration } from "aws-cdk-lib/aws-chatbot";
import * as ssm from "aws-cdk-lib/aws-ssm";
import * as iam from "aws-cdk-lib/aws-iam";

export class CdkHealthDashboardNotificationStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // SNSトピックの作成
    const topic = new sns.Topic(this, "CdkHealthDashboardNotificationTopic");

    // イベントルールの作成
    new events.Rule(this, "CdkHealthDashboardNotificationRule", {
      eventPattern: {
        source: ["aws.health"],
      },
      targets: [new targets.SnsTopic(topic)],
    });

    // Slack通知の作成
    const role = new iam.Role(this, "AWSChatBot", {
      assumedBy: new iam.ServicePrincipal("chatbot.amazonaws.com"),
    });
    role.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("CloudWatchReadOnlyAccess")
    );
    new SlackChannelConfiguration(this, "SlackChannel", {
      slackChannelConfigurationName: "SlackChannelForAlert",
      // 通知先のSlackのIDは事前にパラメーターストアに登録した値を使用します
      slackWorkspaceId: ssm.StringParameter.valueForStringParameter(
        this,
        `/SlackWorkSpaceId`
      ),
      slackChannelId: ssm.StringParameter.valueForStringParameter(
        this,
        `/SlackChannelId`
      ),
      notificationTopics: [topic],
      role,
    });
  }
}
