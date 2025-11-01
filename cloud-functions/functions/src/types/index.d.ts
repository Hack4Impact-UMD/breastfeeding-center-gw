import { DecodedIdToken } from "firebase-admin/auth";
import { UploadedFile } from "../middleware/filesMiddleware";

declare global {
  namespace Express {
    export interface Request {
      rawBody?: Buffer;
      token?: DecodedIdToken;
      files?: {
        [fieldName: string]: UploadedFile[];
      };
    }
  }
}
