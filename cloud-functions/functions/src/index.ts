import dotenv from "dotenv";
dotenv.config();

import { onRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
admin.initializeApp();

import app from "./app";
import { config } from "./config";
import { logger, onInit } from "firebase-functions";
import { onSchedule } from "firebase-functions/scheduler";
import { syncBooqableClients } from "./services/sync/booqableSync";
import { DateTime } from "luxon";
import { syncSquarespaceClients } from "./services/sync/squarespaceSync";

onInit(() => {
  logger.info("====CONFIG DETAILS BELOW====");
  logger.info(`INIT: USING ROOT USER EMAIL: ${config.rootUserEmail.value()}`);
  // logger.info(`INIT: USING ROOT USER SECRET: ${config.rootUserSecret.value()}`);
  logger.info("====CONFIG DETAILS END====");
});

exports.api = onRequest(
  { region: "us-east4", timeoutSeconds: 120, memory: "512MiB" },
  app,
);

exports.booqableSync = onSchedule('every 6 hours', async () => {
  logger.info("Running scheduled Booqable sync...");
  const start = DateTime.now().minus({ week: 1 });
  const end = DateTime.now();

  const result = await syncBooqableClients(start.toISO(), end.toISO());

  if (result.status === "OK") {
    logger.info(`Booqable sync successful: ${result.stats.newClients} new clients, ${result.stats.updatedClients} updated clients!`);
  } else {
    logger.error("Booqable sync failed: " + result.message);
  }
})

exports.squarespaceSync = onSchedule('every 6 hours', async () => {
  logger.info("Running scheduled Squarespace sync...");
  const start = DateTime.now().minus({ week: 1 });
  const end = DateTime.now();

  const result = await syncSquarespaceClients(start.toISO(), end.toISO());

  if (result.status === "OK") {
    logger.info(`Squarespace sync successful: ${result.stats.newClients} new clients, ${result.stats.updatedClients} updated clients!`);
  } else {
    logger.error("Squarespace sync failed: " + result.message);
  }
})
