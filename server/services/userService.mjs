import bcrypt from "bcryptjs";
import { UserModel } from "../models/user.mjs";
import { ActiveSessionModel } from "../models/activeSession.mjs";
import Jwt from "jsonwebtoken";
import { isPasswordValid } from "../utils/validation.mjs";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  if (
    !email.toString().match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)
  ) {
    res.status(400).json({ error: "Invalid email" });
    return;
  }

  try {
    isPasswordValid(password);
  } catch (error) {
    res.status(400).json({ error: error.message });
    return;
  }

  const userExists = await UserModel.findOne({ where: { email } }).catch(
    (err) => {
      console.error(err);
      return null;
    }
  );

  if (userExists) {
    res.status(409).json({ error: "User already exists" });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10).catch((err) => {
    console.error(err);
    return null;
  });
  if (!hashedPassword) {
    res.status(500).json({ error: "Failed to hash password" });
    return;
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
    res.status(500).json({ error: "Failed to create user" });
    return;
  }
  user.password = undefined;
  res.json(user);
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  if (
    !email.toString().match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)
  ) {
    res.status(400).json({ error: "Invalid email" });
    return;
  }

  const user = await UserModel.findOne({ where: { email } }).catch((err) => {
    console.error(err);
    return null;
  });
  if (!user) {
    res.status(403).json({ error: "Email or password incorect" });
    return;
  }
  const isPasswordValid = await bcrypt
    .compare(password, user.password)
    .catch((err) => {
      console.error(err);
      return false;
    });
  if (!isPasswordValid) {
    res.status(403).json({ error: "Email or password incorect" });
    return;
  }

  const token = Jwt.sign(user.toJSON(), "secret", {
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
    res.status(500).json({ error: "Failed to create session" });
    return;
  }
  user.password = undefined;
  res.json({
    user: user.toJSON(),
    token: resSession.token,
  });
};

export const logout = async (req, res) => {
  req.session.destroy();
  const token = req.headers.authorization;
  // Delete active session
  const resSession = await ActiveSessionModel.destroy({
    where: { token },
  }).catch((err) => {
    console.error(err);
    return null;
  });
  if (!resSession) {
    res.status(500).json({ error: "Failed to logout" });
    return;
  }
  res.json({ message: "Logged out" });
};

export const checkToken = async (req, res) => {
  if (req.session.userId) {
    const user = await UserModel.findByPk(req.session.userId).catch((err) => {
      console.error(err);
      return null;
    });
    if (user) {
      user.password = undefined;
      res.json(user);
      return;
    }
  }
  res.status(401).json({ error: "Unauthorized" });
};
