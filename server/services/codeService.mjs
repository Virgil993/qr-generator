import { CodeModel } from "../models/code.mjs";
import validator from "validator";

export const getAllCodes = async (_req, res) => {
  const codes = await CodeModel.findAll().catch((err) => {
    console.error(err);
    return null;
  });
  if (!codes) {
    res.status(500).json({ error: "Failed to get codes" });
    return;
  }
  res.json(codes);
};

export const createCode = async (req, res) => {
  const { title, url } = req.body;

  if (!title || !url) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const isValidUrl = validator.isURL(url, {
    require_protocol: true,
    protocols: ["http", "https"],
  });

  if (!isValidUrl) {
    res.status(400).json({ error: "the code text is not a valid URL" });
    return;
  }

  const code = await CodeModel.create({
    title,
    url,
  }).catch((err) => {
    console.error(err);
    return null;
  });
  if (!code) {
    res.status(500).json({ error: "Failed to create code" });
    return;
  }
  res.json(code);
};

export const getCode = async (req, res) => {
  const { id } = req.params;
  const code = await CodeModel.findOne({
    where: { id: id },
  }).catch((err) => {
    console.error(err);
    return null;
  });
  if (!code) {
    res.status(404).json({ error: "Code not found" });
    return;
  }
  res.json(code);
};

export const updateCode = async (req, res) => {
  const { id } = req.params;
  const { title, url } = req.body;

  if (!title || !url) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }
  const code = await CodeModel.findOne({
    where: { id: id },
  }).catch((err) => {
    console.error(err);
    return null;
  });
  if (!code) {
    res.status(404).json({ error: "Code not found" });
    return;
  }
  code.set({ title, url });
  await code.save().catch((err) => {
    console.error(err);
    res.status(500).json({ error: "Failed to update code" });
    return;
  });
  res.json(code);
};

export const deleteCode = async (req, res) => {
  const { id } = req.params;
  const code = await CodeModel.findOne({
    where: { id: id },
  }).catch((err) => {
    console.error(err);
    return null;
  });
  if (!code) {
    res.status(404).json({ error: "Code not found" });
    return;
  }
  await code.destroy().catch((err) => {
    console.error(err);
    res.status(500).json({ error: "Failed to delete code" });
    return;
  });
  res.json({ success: true });
};
