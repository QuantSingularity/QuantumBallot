import type { NextFunction, Request, Response } from "express";

const jwt = require("jsonwebtoken");

interface AuthRequest extends Request {
  user?: any;
  roles?: string[];
}

const verifyJWTWeb = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader || typeof authHeader !== "string") {
    return res.sendStatus(401);
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err: any, decoded: any) => {
      if (err) return res.sendStatus(403);
      req.user = decoded;
      req.roles = decoded.roles;
      next();
    },
  );
};

export = verifyJWTWeb;
