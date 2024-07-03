import { Router } from "express";
import { checkActiveSession } from "../middleware/checkActiveSession";
import { Response } from "express";
import { CodeModel } from "../models/code";
import validator from "validator";
import { AuthenticatedRequest } from "../middleware/checkActiveSession";

const router = Router();

router.get(
  "/",
  checkActiveSession,
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.session!.userId;
    const codes = await CodeModel.findAll({ where: { ownerId: userId } }).catch(
      (err) => {
        console.error(err);
        return null;
      }
    );
    if (!codes) {
      return res.status(500).json({ error: "Failed to get codes" });
    }
    res.json(codes);
  }
);

// TODO 4: Implement the CREATE code route
router.post(
  "/",
  checkActiveSession,
  async (req: AuthenticatedRequest, res: any) => {}
);

// TODO 5: Implement the GET code by id route
router.get(
  "/:id",
  checkActiveSession,
  async (req: AuthenticatedRequest, res: Response) => {}
);

// TODO 6: Implement the UPDATE code by id route
router.put(
  "/:id",
  checkActiveSession,
  async (req: AuthenticatedRequest, res: Response) => {}
);

// TODO 7: Implement the DELETE code by id route
router.delete(
  "/:id",
  checkActiveSession,
  async (req: AuthenticatedRequest, res: Response) => {}
);

export default router;
