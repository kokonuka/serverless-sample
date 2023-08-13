import { IncomingWebhook } from "@slack/webhook";
import moment from "moment";
import AWS from "aws-sdk";

export async function handler(event, context) {
  const now = moment();
  const start = now.format("YYYY-MM-01");
  const end = now.add(1, "month").format("YYYY-MM-01");

  const ce = new AWS.CostExplorer({ region: "us-east-1" });
  const params = {
    TimePeriod: {
      Start: start,
      End: end,
    },
    Granularity: "MONTHLY",
    Metrics: ["UnblendedCost"],
  };

  const costAndUsage = await ce.getCostAndUsage(params).promise();

  const usdCost = costAndUsage.ResultsByTime[0].Total.UnblendedCost.Amount;
  const roundedUsdCost = Math.round(parseFloat(usdCost) * 100) / 100;

  const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
  const slackWebhook = new IncomingWebhook(slackWebhookUrl);
  const result = await slackWebhook.send(
    `今月のAWS使用量: ${roundedUsdCost}ドル`
  );

  return {
    message: "Hello Serverless Framework",
    body: JSON.stringify(result),
  };
}
