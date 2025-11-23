import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import authRouter from "./routes/authRoutes";
import userRouter from "./routes/userRoutes";
import janeRouter from "./routes/janeRoutes";
import inviteRouter from "./routes/inviteRoutes";
import acuityRouter from "./routes/acuityRoutes";

const app = express();

//TODO: Enforce stricter cors rules when this is deployed, currently all origins are allowed
app.use(cors());
app.use(bodyParser.json());

app.use("/auth", authRouter);
app.use("/jane", janeRouter);
app.use("/users", userRouter);
app.use("/invites", inviteRouter);
app.use("/acuity", acuityRouter);

app.get("/", (_, res) => {
  res.status(200).json({
    status: "OK",
  });
});

export default app;
