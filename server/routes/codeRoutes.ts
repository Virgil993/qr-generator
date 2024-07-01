import { Router } from "express";
import { checkActiveSession } from "../middleware/checkActiveSession.js";
import {
  createCode,
  deleteCode,
  getAllCodes,
  getCode,
  updateCode,
} from "../services/codeService.js";

const router = Router();

router.get("/", checkActiveSession, getAllCodes);
router.post("/", checkActiveSession, createCode);
router.get("/:id", checkActiveSession, getCode);
router.put("/:id", checkActiveSession, updateCode);
router.delete("/:id", checkActiveSession, deleteCode);

export default router;
