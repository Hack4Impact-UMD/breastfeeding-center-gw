import { Router } from "express";

const router = Router();
const multer = require("multer");
const storage = multer.memoryStorage(); // the files are small enough that we can store them in memory
const upload = multer({ storage: storage });

// note: while this says /upload, the router is mounted on /jane, so the real route is /jane/upload.
// when the fronted makes a post request to /jane/upload on the api, this function will handle it.
router.post("/upload", upload.array("csvFiles", 2), async (req, res) => {
  // req.files will contain the 2 uploaded files, first the appointments, second the clients
  // the frontend should ensure that they will always be in this order
  // const apptsCsvString = req.files[0].buffer.toString();
  // const clientsCsvString = req.files[1].buffer.toString();
  //   console.log(req.files);

  // verify the files, otherwise send an error response with a relevant mesage and return early like:
  // return res.status(400).send("The uploaded files have missing headers");

  // do the rest of the process as described in the pseudo code
  // most of the actual work will be done in calls to helper functions
  // ...

  // if successful, return a success response
  return res.status(200).send();
});

export default router;
