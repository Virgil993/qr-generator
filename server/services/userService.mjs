import bcrypt from "bcryptjs";
import { UserModel } from "../models/user.mjs";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ error: "Missing required fields" });
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

  const user = await UserModel.findOne({ where: { email } }).catch((err) => {
    console.error(err);
    return null;
  });
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const isPasswordValid = await bcrypt
    .compare(password, user.password)
    .catch((err) => {
      console.error(err);
      return false;
    });
  if (!isPasswordValid) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  user.password = undefined;
  req.session.userId = user.id;
  res.json(user);
};

export const logout = async (req, res) => {
  req.session.destroy();
  res.json({ message: "Logged out" });
};
