import { Request, Response, Router } from "express";
import { isAuthenticated } from "../middleware/authMiddleware";
import { getOrdersForCustomerId, getOrdersInRange } from "../services/squarespace";
import { logger } from "firebase-functions/v1";

const router = Router();

router.get("/orders", [isAuthenticated], async (req: Request, res: Response) => {
  const startDate = req.query.startDate as string;
  const endDate = req.query.endDate as string;

  if (!startDate || !endDate) {
    return res.status(400).send("start or end date missing!");
  }

  try {
    const orders = await getOrdersInRange(startDate, endDate);
    return res.status(200).json(orders);
  } catch (err) {
    logger.error(`Failed to fetch orders in range ${startDate} - ${endDate}`);
    logger.error(err);

    if (err instanceof Error) {
      return res.status(400).send(`Failed to fetch orders: ${err.message}`);
    } else {
      return res.status(400).send("Failed to fetch orders");
    }
  }
});

router.get("/orders/customer/:customerId", [], async (req: Request, res: Response) => {
  const { customerId } = req.params;

  if (!customerId) {
    return res.status(400).send("Must provide customerId");
  }

  try {
    const orders = await getOrdersForCustomerId(customerId);
    return res.status(200).json(orders);
  } catch (err) {
    logger.error(`Failed to fetch orders for customer ${customerId}`);
    logger.error(err);

    if (err instanceof Error) {
      return res.status(400).send(`Failed to fetch orders: ${err.message}`);
    } else {
      return res.status(400).send("Failed to fetch orders");
    }
  }
});

export default router;
