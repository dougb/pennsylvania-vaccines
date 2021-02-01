const cron = require("node-cron");
const express = require("express");
const fetch = require("node-fetch");
const dotenv = require("dotenv");
const { IncomingWebhook } = require("@slack/webhook");
const hebURL =
  "https://heb-ecom-covid-vaccine.hebdigital-prd.com/vaccine_locations.json";

const cronJobInterval = "*/2 * * * *";

app = express();
dotenv.config();

const url = process.env.SLACK_WEBHOOK_URL;
const webhook = new IncomingWebhook(url);

const interval = 25 * 60 * 1000; // interval in milliseconds - {25mins x 60s x 1000}ms
const keepaliveURL = "https://texas-vaccines.herokuapp.com/";

app.get("/", function (req, res) {
  res.send("Keep alive.");
});

(() => {
  const cronJob = cron.CronJob("0 */25 * * * *", () => {
    fetch(url)
      .then((res) =>
        console.log(`response-ok: ${res.ok}, status: ${res.status}`)
      )
      .catch((err) => console.error(err));
  });

  cronJob.start();
})();

const slackMessageBlock = {
  blocks: [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*Vaccines are available! 💉*",
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "Click here to schedule:",
      },
      accessory: {
        type: "button",
        text: {
          type: "plain_text",
          text: "Schedule",
          emoji: true,
        },
        value: "vaccine",
        url: "https://vaccine.heb.com/scheduler",
        action_id: "button-action",
      },
    },
  ],
};

// cron.schedule(cronJobInterval, () => {
try {
  (async () => {
    const response = await fetch(hebURL);
    const vaccineLocations = await response.json();
    if (response.status === 200) {
      console.log("Checking for vaccines...");
      for (const location in vaccineLocations.locations) {
        const openTimeslot = vaccineLocations.locations[location].openTimeslots;

        if (openTimeslot !== 0) {
          console.log("Vaccines available.");
          await webhook.send(slackMessageBlock);
          return;
        }
      }
    }
    console.log("Done.");
  })();
} catch (error) {
  console.error(error);
}
// });

app.listen(process.env.PORT);
