import { Router } from "express";
import {
  createCode,
  deleteCode,
  getAllCodes,
  getCode,
  updateCode,
} from "../services/codeService.mjs";

const router = Router();

router.get("/", getAllCodes);
router.post("/", createCode);
router.get("/:id", getCode);
router.put("/:id", updateCode);
router.delete("/:id", deleteCode);

export default router;
