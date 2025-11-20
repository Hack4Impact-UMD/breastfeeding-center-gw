import { Response, Router, Request } from "express";
import { isAuthenticated } from "../middleware/authMiddleware";
import { getAllAcuityApptsInRange } from "../services/acuity";

const router = Router();

router.get("/appointments", [isAuthenticated], async (req: Request, res: Response) => {
  const startDate = req.query.startDate as string;
  const endDate = req.query.endDate as string;
  const classCategory = req.query.classCategory as string;

  const appts = (await getAllAcuityApptsInRange(startDate, endDate)).filter(appt => appt.classCategory === classCategory);

  return res.status(200).send(appts)
})

export default router;
