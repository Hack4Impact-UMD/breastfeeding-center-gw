import { Request, Response, Router } from "express";
import { isAuthenticated } from "../middleware/authMiddleware";
import { syncAcuityClients } from "../services/sync/acuitySync";
import { DateTime } from "luxon";

const router = Router();

router.post("/sync/acuity", [isAuthenticated], async (req: Request, res: Response) => {
  const startDate = req.params.startDate ?? DateTime.now().minus({ months: 1 }).toISODate()
  const endDate = req.params.endDate ?? DateTime.now()

  const result = await syncAcuityClients(startDate, endDate);

  if (result.status === "OK") {
    return res.json(result);
  } else {
    return res.status(400).json(result)
  }
})

router.post("/hooks/acuity/client")
