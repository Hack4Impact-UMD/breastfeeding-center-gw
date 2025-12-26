import { NextFunction, Request, Response } from "express";
import { config } from "../config";
import crypto from "crypto"

export function verifyAcuityWebhook(req: Request, res: Response, next: NextFunction) {
  const key = config.acuityAPIKey.value()
  const body = req.rawBody ?? "";

  const hmac = crypto.createHmac("sha256", key);
  hmac.update(body);
  const expectedSignature = hmac.digest("base64");
  const signature = req.headers["x-acuity-signature"];

  if (expectedSignature === signature) {
    return next();
  } else {
    return res.status(403).send("Webhook signature could not be verified")
  }
}
