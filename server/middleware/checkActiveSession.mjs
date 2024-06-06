import { ActiveSessionModel } from "../models/activeSession.mjs";

export const checkActiveSession = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const activeSession = await ActiveSessionModel.findOne({
    where: { token },
  }).catch((err) => {
    console.error(err);
    return null;
  });
  if (!activeSession) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
};
