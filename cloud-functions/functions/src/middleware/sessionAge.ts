import { NextFunction, Request, Response } from "express";

export function sessionAge(maxAgeMin: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.token) return res.status(403).send();

    const sessionStartSec = req.token.auth_time;
    if (!sessionStartSec) return res.status(403).send("reauth")

    const nowSec = Date.now() / 1000;
    const dt = nowSec - sessionStartSec;
    const maxAgeSec = maxAgeMin * 60;

    if (dt <= maxAgeSec) {
      return next();
    } else {
      return res.status(403).send("reauth");
    }
  }
}
