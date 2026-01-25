import { defineInt, defineString } from "firebase-functions/params";
import { randomUUID } from "crypto";

const rootUserEmail = defineString("ROOT_USER_EMAIL", {
  description:
    "The email for the root user with the DIRECTOR role. A root user is required to invite other users to register.",
});

const rootUserSecret = defineString("ROOT_USER_SECRET", {
  description: "The secret to verify root user registration requests",
  default: randomUUID(),
});

const inviteExpirationDays = defineInt("INVITE_EXPIRE_DAYS", {
  description:
    "The number of days until a registration invite expires from the time it's issued",
  default: 7,
});

const acuityUserId = defineString("ACUITY_USER_ID", {
  default: "",
});
const acuityAPIKey = defineString("ACUITY_API_KEY", {
  default: "",
});
const siteDomain = defineString("SITE_DOMAIN", {
  default: "breastfeeding-center-gw.web.app"
});

const emailClientSecret = defineString("EMAIL_CLIENT_SECRET");
const emailRefreshToken = defineString("EMAIL_REFRESH_TOKEN");
const emailAccessToken = defineString("EMAIL_ACCESS_TOKEN");
const emailClientId = defineString("EMAIL_CLIENT_ID");

const config = {
  rootUserEmail,
  inviteExpirationDays,
  rootUserSecret,
  acuityAPIKey,
  acuityUserId,
  siteDomain,
  emailAccessToken,
  emailClientSecret,
  emailRefreshToken,
  emailClientId
};

export { config };
