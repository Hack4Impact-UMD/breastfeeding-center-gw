import { Response, Router, Request } from "express";
// import { isAuthenticated } from "../middleware/authMiddleware";
import { getAllAcuityApptsInRange } from "../services/acuity";
import { AcuityAppointment } from "../types/acuityType";

const router = Router();

router.get("/appointments", async (req: Request, res: Response) => {
  const startDate = req.query.startDate as string;
  const endDate = req.query.endDate as string;
  const classCategory = req.query.classCategory as string;

  let appts: AcuityAppointment[] = []
  if (classCategory && classCategory.trim().length !== 0) {
    appts = (await getAllAcuityApptsInRange(startDate, endDate)).filter(appt => appt.classCategory === classCategory);
  } else {
    appts = (await getAllAcuityApptsInRange(startDate, endDate));
  }

  return res.status(200).send(appts)
})

export default router;
