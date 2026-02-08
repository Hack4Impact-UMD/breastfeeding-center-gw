import { Request, Response, Router } from "express";
import { isAuthenticated } from "../middleware/authMiddleware";
import {
  syncAcuityClientFromAppt,
  syncAcuityClients,
} from "../services/sync/acuitySync";
import { DateTime } from "luxon";
import { verifyAcuityWebhook } from "../middleware/acuityWebhook";
import { logger } from "firebase-functions";
import { getAcuityApptById } from "../services/acuity";
import { db } from "../services/firebase";
import { getAllClients } from "../services/client";
import { CLIENTS_COLLECTION } from "../types/collections";
import { Client } from "../types/clientType";
import { syncSquarespaceClients } from "../services/sync/squarespaceSync";
import { syncBooqableClients } from "../services/sync/booqableSync";

const router = Router();

router.post(
  "/sync/acuity",
  [isAuthenticated],
  async (req: Request, res: Response) => {
    const startDate =
      req.body.startDate ?? DateTime.now().minus({ months: 1 }).toISO();
    const endDate = req.body.endDate ?? DateTime.now().toISO();

    const result = await syncAcuityClients(startDate, endDate);

    if (result.status === "OK") {
      return res.json(result);
    } else {
      return res.status(400).json(result);
    }
  },
);

router.post(
  "/sync/squarespace",
  [isAuthenticated],
  async (req: Request, res: Response) => {
    const startDate =
      req.body.startDate ?? DateTime.now().minus({ months: 1 }).toISO();
    const endDate = req.body.endDate ?? DateTime.now().toISO();

    const result = await syncSquarespaceClients(startDate, endDate);

    if (result.status === "OK") {
      return res.json(result);
    } else {
      return res.status(400).json(result);
    }
  },
);

router.post(
  "/sync/booqable",
  [isAuthenticated],
  async (req: Request, res: Response) => {
    const startDate =
      req.body.startDate ?? DateTime.now().minus({ months: 1 }).toISO();
    const endDate = req.body.endDate ?? DateTime.now().toISO();

    const result = await syncBooqableClients(startDate, endDate);

    if (result.status === "OK") {
      return res.json(result);
    } else {
      return res.status(400).json(result);
    }
  },
);

router.post(
  "/hooks/acuity/client",
  [verifyAcuityWebhook],
  async (req: Request, res: Response) => {
    logger.info("acuity webhook: acuity hook called with following body:")
    logger.info(req.rawBody?.toString())

    const { id, action } = req.body;

    if (!id) return res.status(400).send("Appointment id not provided");
    if (action !== "appointment.changed") {
      logger.warn("acuity web hook: called for action != appointment.changed");
    }
    logger.info(`acuity webhook: called with action: ${action}`)

    try {
      logger.info("acuity webhook: hook called with appointment ID: " + id);

      const appt = await getAcuityApptById(id);

      await syncAcuityClientFromAppt(appt);

      return res.status(200).send();
    } catch (err) {
      logger.error("acuity webhook: hook error!");
      logger.error(err);

      return res.status(400).send("Failed to sync client");
    }
  },
);

router.get("/all", [isAuthenticated], async (_: Request, res: Response) => {
  try {
    const clients = await getAllClients();
    return res.status(200).json(clients);
  } catch (e) {
    logger.error("Error fetching clients:", e);
    return res.status(500).send((e as Error).message);
  }
});

router.get(
  "/id/:client_id",
  [isAuthenticated],
  async (req: Request, res: Response) => {
    try {
      const clientId = req.params.client_id;

      const doc = await db.collection(CLIENTS_COLLECTION).doc(clientId).get();

      if (!doc.exists) {
        return res.status(404).send("Client not found");
      }

      const clientData: Client = doc.data() as Client;
      return res.status(200).json(clientData);
    } catch (e) {
      logger.error("Error fetching client:", e);
      return res.status(500).send((e as Error).message);
    }
  },
);

export default router;
