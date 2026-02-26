import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import authRouter from "./routes/authRoutes";
import userRouter from "./routes/userRoutes";
import janeRouter from "./routes/janeRoutes";
import inviteRouter from "./routes/inviteRoutes";
import acuityRouter from "./routes/acuityRoutes";
import clientRouter from "./routes/clientRoutes";
import squarespaceRouter from "./routes/squarespaceRoutes";
import booqableRouter from "./routes/booqableRoutes";
import { config } from "./config";

const app = express();

app.use((req, res, next) => {
  const allowedOrigins =
    process.env.FUNCTIONS_EMULATOR === "true"
      ? ["http://localhost:5173"]
      : [`https://${config.siteDomain.value()}`];

  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Root-Secret"],
  })(req, res, next);
});
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRouter);
app.use("/jane", janeRouter);
app.use("/users", userRouter);
app.use("/invites", inviteRouter);
app.use("/acuity", acuityRouter);
app.use("/clients", clientRouter);
app.use("/squarespace", squarespaceRouter);
app.use("/booqable", booqableRouter);

app.get("/", (_, res) => {
  res.status(200).json({
    status: "OK",
  });
});

export default app;
