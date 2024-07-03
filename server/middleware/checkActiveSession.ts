import { NextFunction, Request, Response } from "express";
import { ActiveSessionModel } from "../models/activeSession";
import Jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  session?: {
    userId: string;
  };
}

// TODO 3: Implement the checkActiveSession middleware
export const checkActiveSession = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {};
