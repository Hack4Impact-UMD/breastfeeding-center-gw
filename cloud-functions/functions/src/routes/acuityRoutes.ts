import { Response, Router, Request } from "express";
import {
  getAllAcuityApptsInRange,
  getAllAcuityAppointmentsForClient,
} from "../services/acuity";
import { AcuityAppointment } from "../types/acuityType";
import { isAuthenticated } from "../middleware/authMiddleware";
import { logger } from "firebase-functions";

const router = Router();

router.get(
  "/appointments",
  [isAuthenticated],
  async (req: Request, res: Response) => {
    try {
      const startDate = req.query.startDate as string;
      const endDate = req.query.endDate as string;
      const classCategory = req.query.classCategory ? (req.query.classCategory as string).toLowerCase() : undefined;

      if (!startDate || !endDate) {
        return res
          .status(400)
          .json({ error: "startDate and endDate are required" });
      }


      let appts: AcuityAppointment[] = [];
      if (
        classCategory &&
        classCategory.trim().length !== 0 &&
        classCategory !== "all classes"
      ) {
        appts = (await getAllAcuityApptsInRange(startDate, endDate)).filter(
          (appt) => appt.classCategory?.toLowerCase() === classCategory,
        );
      } else {
        appts = await getAllAcuityApptsInRange(startDate, endDate);
      }

      return res.status(200).json(appts);
    } catch (e) {
      logger.error("Error fetching appointments:", e);
      return res.status(500).send({
        error: "Failed to fetch acuity appointments"
      });
    }
  },
);

router.get(
  "/appointments/client",
  [isAuthenticated],
  async (req: Request, res: Response) => {
    const email = req.query.email as string;

    if (!email) {
      return res.status(400).json({ error: "email is required" });
    }

    const appointments = await getAllAcuityAppointmentsForClient(email);
    return res.status(200).send(appointments);
  },
);

export default router;
