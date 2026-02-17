const fs = require("fs");
const Transcription = require("../models/Transcription");
const { transcribeAudio } = require("../services/speechService");

const uploadAndTranscribe = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No audio file uploaded" });
    }

    const transcriptionText = await transcribeAudio(req.file.path);

    const savedTranscription = await Transcription.create({
      userId: req.body.userId || null,
      filename: req.file.filename,
      text: transcriptionText,
      mimetype: req.file.mimetype,
    });

    fs.unlink(req.file.path, () => {});

    res.status(201).json({
      success: true,
      transcription: savedTranscription.text,
      id: savedTranscription._id,
      createdAt: savedTranscription.createdAt,
    });

  } catch (error) {
    console.error("Controller Error:", error);
    res.status(500).json({
      message: "Error while transcribing",
      error: error.message,
    });
  }
};

const getAllTranscriptions = async (req, res) => {
  const data = await Transcription.find({ userId: req.query.userId })
    .sort({ createdAt: -1 });

  res.json(data);
};

const getTranscriptionById = async (req, res) => {
  const data = await Transcription.findById(req.params.id);
  res.json(data);
};

const deleteTranscription = async (req, res) => {
  await Transcription.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted successfully" });
};

module.exports = {
  uploadAndTranscribe,
  getAllTranscriptions,
  getTranscriptionById,
  deleteTranscription,
};
  