import { NextFunction, Request, Response } from "express";
import busboy from "busboy"
import { logger } from "firebase-functions";

const FILE_UPLOAD_SIZE_LIMIT_MB = 20;

export class UploadedFile {
  name: string;
  mimeType: string;
  encoding: string;
  buffer: Buffer;

  constructor(name: string, mimeType: string, encoding: string) {
    this.name = name;
    this.mimeType = mimeType;
    this.encoding = encoding;
    this.buffer = Buffer.alloc(0);
  }

  addChunk(chunk: Buffer) {
    this.buffer = Buffer.concat([this.buffer, chunk])
  }
}

/** NOTE: This middleware is intended for handling file uploads to routes as multipart/form-data
 *  When successful, it will populate the req.files field. The field will be a record of
 *  with keys being field names and values being a list of uploaded files for that field
 *  ```ts
 *  {
 *   [fieldName]: UploadedFile[]
 *  }
 *  ```
 */
export async function upload(req: Request, _: Response, next: NextFunction) {
  if (!req.headers["content-type"]?.includes("multipart/form-data")) {
    logger.warn("Request not multipart/from, ignoring!")
    return next();
  }

  const bb = busboy({
    headers: req.headers,
    limits: { fileSize: FILE_UPLOAD_SIZE_LIMIT_MB * 1024 * 1024 } //
  })

  const files: { [fieldName: string]: UploadedFile[] } = {}

  bb.on("file", async (fieldName, stream, fileInfo) => {
    if (!files[fieldName]) files[fieldName] = []

    const file = new UploadedFile(
      fileInfo.filename,
      fileInfo.mimeType,
      fileInfo.encoding
    )

    logger.log(`Found file ${fileInfo.filename} for field ${fieldName}.`)

    files[fieldName].push(file);

    stream.on("data", (chunk) => {
      logger.log(`Received data for file ${fileInfo.filename}...`)
      file.addChunk(chunk);
    })
  })

  bb.on("finish", () => {
    req.files = files;
    next();
  })

  bb.end(req.rawBody);
  return;
}
