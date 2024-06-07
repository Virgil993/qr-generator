import { CodeModel } from "../models/code.mjs";
import { TrackingModel } from "../models/tracking.mjs";

export const trackCode = async (req, res) => {
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
  const tracking = await TrackingModel.create({
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
  res.status(303).header("Location", code.codeText).json(tracking);
};

export const getTrackingData = async (req, res) => {
  const { codeId } = req.params;
  const trackingData = await TrackingModel.findAll({
    where: { codeId },
  }).catch((err) => {
    console.error(err);
    return null;
  });
  if (!trackingData) {
    res.status(500).json({ error: "Failed to get tracking data" });
    return;
  }
  res.json(trackingData);
};
