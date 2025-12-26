import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import authRouter from "./routes/authRoutes";
import userRouter from "./routes/userRoutes";
import janeRouter from "./routes/janeRoutes";
import inviteRouter from "./routes/inviteRoutes";
import acuityRouter from "./routes/acuityRoutes";
import clientRouter from "./routes/clientRoutes"

const app = express();

//TODO: Enforce stricter cors rules when this is deployed, currently all origins are allowed
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRouter);
app.use("/jane", janeRouter);
app.use("/users", userRouter);
app.use("/invites", inviteRouter);
app.use("/acuity", acuityRouter);
app.use("/clients", clientRouter);

app.get("/", (_, res) => {
  res.status(200).json({
    status: "OK",
  });
});

export default app;
