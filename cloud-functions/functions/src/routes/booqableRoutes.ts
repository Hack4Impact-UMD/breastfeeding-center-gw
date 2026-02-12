import { Request, Response, Router } from "express";
import { isAuthenticated } from "../middleware/authMiddleware";
import {
  getBooqableRentalsInRange,
  getBooqableRentalsForCustomer,
  getStripeCustomerByEmail,
} from "../services/stripe";
import { DateTime } from "luxon";
import { logger } from "firebase-functions/v1";

const router = Router();

router.get(
  "/rentals",
  [isAuthenticated],
  async (req: Request, res: Response) => {
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;

    if (!startDate || !endDate) {
      return res.status(400).send("start or end date missing!");
    }

    try {
      const rentals = await getBooqableRentalsInRange(
        DateTime.fromISO(startDate),
        DateTime.fromISO(endDate),
      );
      return res.status(200).json(rentals);
    } catch (err) {
      logger.error(
        `Failed to fetch booqable rentals in range ${startDate} - ${endDate}`,
      );
      logger.error(err);

      if (err instanceof Error) {
        return res.status(400).send(`Failed to fetch rentals: ${err.message}`);
      } else {
        return res.status(400).send("Failed to fetch rentals");
      }
    }
  },
);

router.get(
  "/rentals/customer",
  [isAuthenticated],
  async (req: Request, res: Response) => {
    const email = req.query.email as string | undefined;
    const stripeId = req.query.stripeId as string | undefined;

    if (!email && !stripeId) {
      return res.status(400).send("Must provide email or stripeId");
    }

    try {
      let customerId: string;

      if (stripeId) {
        customerId = stripeId;
      } else {
        try {
          const customer = await getStripeCustomerByEmail(email!);
          customerId = customer.id;
        } catch {
          return res.status(200).json([]);
        }
      }

      const rentals = await getBooqableRentalsForCustomer(customerId);
      return res.status(200).json(rentals);
    } catch (err) {
      logger.error(
        `Failed to fetch booqable rentals for customer (email=${email}, stripeId=${stripeId})`,
      );
      logger.error(err);

      if (err instanceof Error) {
        return res.status(400).send(`Failed to fetch rentals: ${err.message}`);
      } else {
        return res.status(400).send("Failed to fetch rentals");
      }
    }
  },
);

export default router;
