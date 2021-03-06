const express = require('express');
const cron = require('node-cron');
const fetch = require('node-fetch');
const checkWeis = require('./crawlers/weis');
const checkLancaster = require('./crawlers/lancaster');
const checkMacdonalds = require('./crawlers/macdonalds');
const checkPrimaryHealth = require('./crawlers/primary-health');
const checkSeeRight = require('./crawlers/see-right');
const checkAnderson = require('./crawlers/anderson');
const checkChambers = require('./crawlers/chambers');
const checkCNS = require('./crawlers/cns');
const checkGeisinger = require('./crawlers/geisinger');
const checkGiant = require('./crawlers/giant');
const checkBirdsboro = require('./crawlers/birdsboro');
const checkIndependent = require('./crawlers/independent');
const checkRiteAid = require('./crawlers/rite-aid');
const checkGiantEagle = require('./crawlers/giant-eagle');
const cronJobInterval = '*/2 * * * *';

app = express();


app.get('/', function(req, res) {
  res.send('Staying alive.');
});

cron.schedule(cronJobInterval, async () => {
  try {

    console.log(`Checking at ${Date()}.`);
    // await checkGiant();
    // await checkRiteAid();
    await checkWeis();
    await checkLancaster();
    await checkMacdonalds();
    await checkPrimaryHealth();
    await checkSeeRight();
    await checkAnderson();
    await checkChambers();
    await checkCNS();
    await checkGeisinger();
    await checkBirdsboro();
    await checkIndependent();
    await checkGiantEagle();
    console.log('Done checking.');
  } catch (error) {
    console.error(error);
  }
});

app.listen(process.env.PORT);
