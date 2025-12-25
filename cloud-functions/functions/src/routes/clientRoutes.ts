import { Request, Response, Router } from "express";
import { isAuthenticated } from "../middleware/authMiddleware";

const router = Router();

router.post("/sync/acuity", [isAuthenticated], async (req: Request, res: Response) => {

})

router.post("/hooks/acuity/client")
