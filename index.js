const cron = require("node-cron");
const express = require("express");
const fetch = require("node-fetch");
const checkHeb = require("./heb");
const checkRandalls = require("./albertsons");

const cronJobInterval = "*/2 * * * *";

app = express();

const keepaliveURL = "https://texas-vaccines.herokuapp.com/";

app.get("/", function (req, res) {
  res.send("Staying alive.");
});

cron.schedule(cronJobInterval, async () => {
  try {
    const keep = await fetch(keepaliveURL);
    const alive = await keep.text();
    console.log(alive);

    await checkHeb();
    await checkRandalls();
  } catch (error) {
    console.error(error);
  }
});

app.listen(process.env.PORT);