import type { NextFunction, Request, Response } from "express";

const allowedOrigins = require("../config/allowedOrigins");

const credentials = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", "true");
  }
  next();
};

export = credentials;
