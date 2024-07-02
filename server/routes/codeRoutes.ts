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

router.post(
  "/",
  checkActiveSession,
  async (req: AuthenticatedRequest, res: any) => {
    const userId = req.session!.userId;
    const { title, url } = req.body;

    if (!title || !url) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const isValidUrl = validator.isURL(url, {
      require_protocol: true,
      protocols: ["http", "https"],
    });

    if (!isValidUrl) {
      return res
        .status(400)
        .json({ error: "the code text is not a valid URL" });
    }

    const code = await CodeModel.create({
      title,
      url,
      ownerId: userId,
    }).catch((err) => {
      console.error(err);
      return null;
    });
    if (!code) {
      return res.status(500).json({ error: "Failed to create code" });
    }
    res.json(code);
  }
);

router.get(
  "/:id",
  checkActiveSession,
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.session!.userId;
    const { id } = req.params;
    const code = await CodeModel.findOne({
      where: { id, ownerId: userId },
    }).catch((err) => {
      console.error(err);
      return null;
    });
    if (!code) {
      return res.status(404).json({ error: "Code not found" });
    }
    res.json(code);
  }
);

router.put(
  "/:id",
  checkActiveSession,
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.session!.userId;
    const { id } = req.params;
    const { title, url } = req.body;

    if (!title || !url) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const code = await CodeModel.findOne({
      where: { id, ownerId: userId },
    }).catch((err) => {
      console.error(err);
      return null;
    });
    if (!code) {
      return res.status(404).json({ error: "Code not found" });
    }
    code.set({ title, url });
    await code.save().catch((err) => {
      console.error(err);
      return res.status(500).json({ error: "Failed to update code" });
    });
    res.json(code);
  }
);

router.delete(
  "/:id",
  checkActiveSession,
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.session!.userId;
    const { id } = req.params;
    const code = await CodeModel.findOne({
      where: { id, ownerId: userId },
    }).catch((err) => {
      console.error(err);
      return null;
    });
    if (!code) {
      return res.status(404).json({ error: "Code not found" });
    }
    await code.destroy().catch((err) => {
      console.error(err);
      return res.status(500).json({ error: "Failed to delete code" });
    });
    res.json({ success: true });
  }
);

export default router;
