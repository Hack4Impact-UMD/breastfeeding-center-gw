import { Response, Request, Router } from "express";
import { getAcuityAppointments, getBabyInfo, getClientAppointments } from "../services/acuity";
import { logger } from "firebase-functions";
import { isAuthenticated } from "../middleware/authMiddleware";

const router = Router();

router.get("/appointments", [isAuthenticated], async (req: Request, res: Response) => {
  try {
    const max = req.query.max ? parseInt(req.query.max as string) : undefined;
    const appointments = await getAcuityAppointments(max);
    res.json(appointments);
  } catch (error) {
    logger.error("Failed to get Acuity appointments", error);
    res.status(500).json({ error: "Failed to get Acuity appointments" });
  }
});

router.get("/babyinfo", [isAuthenticated], async (req: Request, res: Response) => {
  try {
    const max = req.query.max ? parseInt(req.query.max as string) : undefined;
    const babyInfo = await getBabyInfo(max);
    res.json(babyInfo);
  } catch (error) {
    logger.error("Failed to get baby info", error);
    res.status(500).json({ error: "Failed to get baby info" });
  }
});

router.get("/clientappointments", [isAuthenticated], async (req: Request, res: Response) => {
  try {
    const max = req.query.max ? parseInt(req.query.max as string) : undefined;
    const clientAppointments = await getClientAppointments(max);
    res.json(clientAppointments);
  } catch (error) {
    logger.error("Failed to get client appointments", error);
    res.status(500).json({ error: "Failed to get client appointments" });
  }
});


export default router;
