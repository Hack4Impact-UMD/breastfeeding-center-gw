import { Request, Response, Router } from "express";
import { isAuthenticated } from "../middleware/authMiddleware";
import { syncAcuityClientFromAppt, syncAcuityClients } from "../services/sync/acuitySync";
import { DateTime } from "luxon";
import { verifyAcuityWebhook } from "../middleware/acuityWebhook"
import { logger } from "firebase-functions";
import { getAcuityApptById } from "../services/acuity";

const router = Router();

router.post("/sync/acuity", [isAuthenticated], async (req: Request, res: Response) => {
  const startDate = req.params.startDate ?? DateTime.now().minus({ months: 1 }).toISODate()
  const endDate = req.params.endDate ?? DateTime.now()

  const result = await syncAcuityClients(startDate, endDate);

  if (result.status === "OK") {
    return res.json(result);
  } else {
    return res.status(400).json(result);
  }
})

//TODO: REMEMBER TO REGISTER THIS HOOK: https://developers.acuityscheduling.com/page/webhooks-webhooks-webhooks
router.post("/hooks/acuity/client", [verifyAcuityWebhook], async (req: Request, res: Response) => {
  const {
    id,
    action

  } = req.body;

  if (!id) res.status(400).send("Appointment id not provided");
  if (action !== "changed") return res.status(200).send();

  try {
    logger.info("Acuity hook called with appointment ID: " + id);

    const appt = await getAcuityApptById(id);

    await syncAcuityClientFromAppt(appt);

    return res.status(200).send();
  } catch (err) {
    logger.error("Acuity hook error!");
    logger.error(err);

    return res.status(400).send("Failed to sync client");
  }
})

export default router;
