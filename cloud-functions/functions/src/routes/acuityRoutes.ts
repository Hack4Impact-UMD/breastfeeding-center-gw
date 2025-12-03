import { Response, Router, Request } from "express";
import {
  getAllAcuityApptsInRange,
  getAllAcuityAppointmentsForClient,
} from "../services/acuity";
import { AcuityAppointment } from "../types/acuityType";
import { isAuthenticated } from "../middleware/authMiddleware";

const router = Router();

router.get(
  "/appointments",
  [isAuthenticated],
  async (req: Request, res: Response) => {
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ error: "startDate and endDate are required" });
    }

    const classCategory = req.query.classCategory as string;

    let appts: AcuityAppointment[] = [];
    if (classCategory && classCategory.trim().length !== 0) {
      appts = (await getAllAcuityApptsInRange(startDate, endDate)).filter(
        (appt) => appt.classCategory === classCategory,
      );
    } else {
      appts = await getAllAcuityApptsInRange(startDate, endDate);
    }

    return res.status(200).send(appts);
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
