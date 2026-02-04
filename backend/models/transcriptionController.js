import Transcription from "../models/Transcription.js";

export const upload = async (req, res) => {
  const { userId } = req.body;
  const text = "Dummy transcription"; // from speech API

  const saved = await Transcription.create({ userId, text });
  res.json({ transcription: saved.text });
};

export const history = async (req, res) => {
  const data = await Transcription.find({ userId: req.query.userId });
  res.json({ data });
};
