import dotenv from "dotenv";
dotenv.config();

import { onRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
admin.initializeApp();

import app from "./app";
import { config } from "./config";
import { logger, onInit } from "firebase-functions";

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
