require("dotenv").config({ path: ".env.local" });
const crypto = require("crypto");

const key = process.env.ACUITY_API_KEY || "your_api_key_here";
const apptId = process.env.ACUITY_TEST_APPT_ID ?? "1566508740";
const body = `id=${apptId}&action=changed`;

const signature = crypto
  .createHmac("sha256", key)
  .update(body)
  .digest("base64");

console.log("Using appt id: " + apptId);
console.log("To change, set the ACUITY_TEST_APPT_ID env variable.");
console.log();

console.log("Signature:", signature);
console.log("\nCurl command:");
console.log(
  `curl -X POST http://localhost:5001/breastfeeding-center-gw/us-east4/api/clients/hooks/acuity/client -H "Content-Type: application/x-www-form-urlencoded" -H "x-acuity-signature: ${signature}" -d "${body}"`,
);
