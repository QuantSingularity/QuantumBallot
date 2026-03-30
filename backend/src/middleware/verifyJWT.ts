import type { NextFunction, Request, Response } from "express";

const jwt = require("jsonwebtoken");

interface AuthRequest extends Request {
  user?: string;
  roles?: string[];
}

const verifyJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (
    !authHeader ||
    typeof authHeader !== "string" ||
    !authHeader.startsWith("Bearer ")
  ) {
    return res.sendStatus(401);
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err: any, decoded: any) => {
      if (err) return res.sendStatus(403); // Invalid token
      req.user = decoded.username;
      req.roles = decoded.roles;
      next();
    },
  );
};

export = verifyJWT;
