import { Router } from "express";
import { checkActiveSession } from "../middleware/checkActiveSession.mjs";
import { getTrackingData, trackCode } from "../services/trackService.mjs";

const router = Router();

router.get("/:codeId", trackCode);
router.get("/data/:codeId", checkActiveSession, getTrackingData);

export default router;
