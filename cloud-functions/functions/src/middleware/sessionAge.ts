import { NextFunction, Request, Response } from "express";

export function sessionAge(maxAgeSec: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.token) return res.status(403).send();
    const sessionStartSec = req.token.auth_time;
    const nowSec = Date.now() / 1000;
    const dt = nowSec - sessionStartSec;

    if (dt <= maxAgeSec) {
      return next();
    } else {
      return res.status(403).send("reauth");
    }
  }
}
