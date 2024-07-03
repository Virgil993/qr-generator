import { Request, Response, Router } from "express";
import {
  AuthenticatedRequest,
  checkActiveSession,
} from "../middleware/checkActiveSession";
import bcrypt from "bcryptjs";
import { UserModel } from "../models/user";
import { ActiveSessionModel } from "../models/activeSession";
import Jwt from "jsonwebtoken";
import validator from "validator";

const router = Router();

router.post("/register", async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (
    !email.toString().match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)
  ) {
    return res.status(400).json({ error: "Invalid email" });
  }

  try {
    validator.isStrongPassword(password);
  } catch (error: any) {
    return res
      .status(400)
      .json({ error: error.message ?? "Password is not strong enough" });
  }

  const userExists = await UserModel.findOne({ where: { email } }).catch(
    (err) => {
      console.error(err);
      return null;
    }
  );

  if (userExists) {
    return res.status(409).json({ error: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10).catch((err) => {
    console.error(err);
    return null;
  });
  if (!hashedPassword) {
    return res.status(500).json({ error: "Failed to hash password" });
  }
  const user = await UserModel.create({
    name,
    email,
    password: hashedPassword,
  }).catch((err) => {
    console.error(err);
    return null;
  });

  if (!user) {
    return res.status(500).json({ error: "Failed to create user" });
  }
  user.password = "";
  res.json(user);
});

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(401).json({ error: "Email or password incorect" });
  }

  if (
    !email.toString().match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)
  ) {
    return res.status(401).json({ error: "Email or password incorect" });
  }

  const user = await UserModel.findOne({ where: { email } }).catch((err) => {
    console.error(err);
    return null;
  });
  if (!user) {
    return res.status(401).json({ error: "Email or password incorect" });
  }
  const isPasswordValid = await bcrypt
    .compare(password, user.password)
    .catch((err) => {
      console.error(err);
      return false;
    });
  if (!isPasswordValid) {
    return res.status(401).json({ error: "Email or password incorect" });
  }

  const token = Jwt.sign(user.toJSON(), process.env.JWT_SECRET || "secret", {
    expiresIn: 86400, // 1 week
  });

  const resSession = await ActiveSessionModel.create({
    token: token,
    userId: user.id,
  }).catch((err) => {
    console.error(err);
    return null;
  });
  if (!resSession) {
    return res.status(500).json({ error: "Failed to create session" });
  }
  user.password = "";
  res.json({
    user: user.toJSON(),
    token: resSession.token,
  });
});

router.post(
  "/logout",
  checkActiveSession,
  async (req: AuthenticatedRequest, res: Response) => {
    const token = req.headers.authorization;
    // Delete active session
    await ActiveSessionModel.destroy({
      where: { token },
    }).catch((err) => {
      console.error(err);
      return null;
    });
    res.json({ message: "Logged out" });
  }
);

router.get(
  "/check-token",
  checkActiveSession,
  async (req: AuthenticatedRequest, res: Response) => {
    if (req.session?.userId) {
      const user = await UserModel.findByPk(req.session.userId).catch((err) => {
        console.error(err);
        return null;
      });
      if (user) {
        user.password = "";
        res.json(user);
        return;
      }
    }
    return res.status(401).json({ error: "Unauthorized" });
  }
);

export default router;
