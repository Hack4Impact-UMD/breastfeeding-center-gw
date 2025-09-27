import express from "express";
import bodyParser from "body-parser";
import cors from "cors"

const app = express();

//TODO: Stricter cors rules when this is deployed, currently all origins are allowed
app.use(cors())
app.use(bodyParser.json());

app.get("/", (_, res) => {
  res.status(200).json({
    status: "OK"
  })
})

export default app;

