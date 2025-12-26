import { NextFunction, Request, Response } from "express";
import { config } from "../config";
import crypto from "crypto"

export function verifyAcuityWebhook(req: Request, res: Response, next: NextFunction) {
  const key = config.acuityAPIKey.value()

  if (!key) return res.status(403).send("Acuity API key not found");

  const body = req.rawBody ?? Buffer.from("");

  const expectedSignature = crypto.createHmac("sha256", key)
    .update(body)
    .digest("base64");

  const signature = req.headers["x-acuity-signature"];

  if (!signature) return res.status(403).send("Webhook not signed");
  if (Array.isArray(signature)) return res.status(403).send("Multiple signatures found");

  if (crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(signature))) {
    return next();
  } else {
    return res.status(403).send("Webhook signature could not be verified")
  }
}
