import { Router } from "express";
import {
  checkToken,
  login,
  logout,
  register,
} from "../services/userService.js";
import { checkActiveSession } from "../middleware/checkActiveSession.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", checkActiveSession, logout);
router.get("/check-token", checkActiveSession, checkToken);

export default router;
