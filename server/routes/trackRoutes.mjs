import { Router } from "express";
import { checkActiveSession } from "../middleware/checkActiveSession.mjs";
import { getTrackingData, trackCode } from "../services/trackService.mjs";

const router = Router();

router.post("/:codeId", trackCode);
router.get("/:codeId", checkActiveSession, getTrackingData);

export default router;
