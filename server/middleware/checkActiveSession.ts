import { NextFunction, Request, Response } from "express";
import { ActiveSessionModel } from "../models/activeSession";
import Jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  session?: {
    userId: string;
  };
}

export const checkActiveSession = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    Jwt.verify(token, process.env.JWT_SECRET || "secret");
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: "Unauthorized" });
  }

  const activeSession = await ActiveSessionModel.findOne({
    where: { token },
  }).catch((err) => {
    console.error(err);
    return null;
  });
  if (!activeSession) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  req.session = { userId: activeSession.userId };
  next();
};
