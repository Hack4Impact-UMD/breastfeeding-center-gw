/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

exports.helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

exports.getBeginningOfRentalPayments = onCall(
  { region: "us-east4", cors: true },
  async ({ auth }) => {
    try {
      const payments = await fetchBCGWData();

      const filtered = payments.filter((payment) =>
        payment?.Description?.toLowerCase()?.includes("beginning of rental")
      );

      const result = filtered.map((payment) => ({
        name: `${payment.CustomerFirstName} ${payment.CustomerLastName}`,
        paymentDate: payment.PaymentDate,
        amount: payment.Amount,
        description: payment.Description,
        customerId: payment.CustomerId,
      }));

      return result;
    } catch (err) {
      console.error("Error:", err);
      throw new HttpsError(
        "internal",
        "Failed to fetch Beginning of Rental payments."
      );
    }
  }
);
