import { Request, Response, Router } from "express";
// import { isAuthenticated } from "../middleware/authMiddleware";
import { getOrdersInRange } from "../services/squarespace";

const router = Router();

router.get("/orders", [], async (req: Request, res: Response) => {
  const startDate = req.query.startDate as string;
  const endDate = req.query.endDate as string;

  if (!startDate || !endDate) {
    return res.status(400).send("start or end date missing!");
  }

  return res.json(await getOrdersInRange(startDate, endDate));
});

export default router;
