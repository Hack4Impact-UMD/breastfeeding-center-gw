import { defineInt, defineString } from "firebase-functions/params";

const rootUserEmail = defineString("ROOT_USER_EMAIL", {
  description: "The email for the root user with the DIRECTOR role. A root user is required to invite other users to register."
})

const inviteExpirationDays = defineInt("INVITE_EXPIRE_DAYS", {
  description: "The number of days until a registration invite expires from the time it's issued",
  default: 7
})

const config = {
  rootUserEmail,
  inviteExpirationDays
}

export {
  config
}

