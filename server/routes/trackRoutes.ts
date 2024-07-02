import { Router } from "express";
import { CodeModel } from "../models/code";
import { TrackModel } from "../models/track";

const router = Router();

router.get("/:codeId", async (req, res) => {
  const { codeId } = req.params;
  const code = await CodeModel.findOne({ where: { id: codeId } }).catch(
    (err) => {
      console.error(err);
      return null;
    }
  );

  if (!code) {
    res.status(404).json({ error: "Code not found" });
    return;
  }
  const tracking = await TrackModel.create({
    codeId: codeId,
    date: new Date(),
  }).catch((err) => {
    console.error(err);
    return null;
  });
  if (!tracking) {
    res.status(500).json({ error: "Failed to track code" });
    return;
  }
  res.status(303).header("Location", code.url).json(tracking);
});

export default router;
