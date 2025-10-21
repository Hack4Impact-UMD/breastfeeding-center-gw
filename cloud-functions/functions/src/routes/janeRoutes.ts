import { Request, Router, Response } from "express";
import { logger } from "firebase-functions";
import { Client, Baby } from "../types/clientTypes";
import { JaneAppt } from "../types/janeType";
import { db } from "../services/firebase";
import { isAuthenticated } from "../middleware/authMiddleware";
import { DateTime } from "luxon";

const router = Router();

router.get(
  "/appointments",
  [isAuthenticated],
  async (req: Request, res: Response) => {
    try {
      const startDate = req.query.startDate as string;
      const endDate = req.query.endDate as string;

      // Get all appointments from the Appointments collection
      const snapshot = await db.collection("Appointments").get();
      
      // Convert documents to JaneAppt objects
      const appointments: JaneAppt[] = snapshot.docs.map((doc) => ({
        ...doc.data(),
      })) as JaneAppt[];

      // Filter appointments by date range if provided
      let filteredAppointments = appointments;
      
      if (startDate || endDate) {
        filteredAppointments = appointments.filter((appt) => {
          const apptStartDate = DateTime.fromISO(appt.startAt);
          
          if (startDate && endDate) {
            const start = DateTime.fromISO(startDate);
            const end = DateTime.fromISO(endDate);
            return apptStartDate >= start && apptStartDate <= end;
          } else if (startDate) {
            const start = DateTime.fromISO(startDate);
            return apptStartDate >= start;
          } else if (endDate) {
            const end = DateTime.fromISO(endDate);
            return apptStartDate <= end;
          }
          
          return true;
        });
      }

      return res.status(200).json(filteredAppointments);
    } catch (e) {
      logger.error("Error fetching appointments:", e);
      return res.status(500).send((e as Error).message);
    }
  },
);

router.get(
  "/client/:patient_id",
  [isAuthenticated],
  async (req: Request, res: Response) => {
    try {
      const patientId = req.params.patient_id;
      
      // Get client document by patient_id
      const doc = await db.collection("Clients").doc(patientId).get();
      
      if (!doc.exists) {
        return res.status(404).send("Client not found");
      }
      
      const clientData = doc.data() as Client;
      return res.status(200).json(clientData);
    } catch (e) {
      logger.error("Error fetching client:", e);
      return res.status(500).send((e as Error).message);
    }
  },
);

export default router;
