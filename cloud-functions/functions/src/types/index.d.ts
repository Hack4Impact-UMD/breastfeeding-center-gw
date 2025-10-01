import { DecodedIdToken } from "firebase-admin/auth";

declare global {
  namespace Express {
    export interface Request {
      token?: DecodedIdToken;
    }
  }
}
