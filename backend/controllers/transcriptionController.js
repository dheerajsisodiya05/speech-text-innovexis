const fs = require("fs");
const Transcription = require("../models/Transcription");
const { transcribeAudio } = require("../services/speechService");
const asyncHandler = require("../utils/asyncHandler");

/**
 * @desc   Upload audio, transcribe it, save to DB
 * @route  POST /api/transcriptions/upload
 * @access Public
 */
const uploadAndTranscribe = asyncHandler(async (req, res) => {
  console.log('[Controller] uploadAndTranscribe called');
  console.log('[Controller] Request file:', req.file);
  
  if (!req.file) {
    console.log('[Controller] No file in request - returning 400');
    res.status(400);
    throw new Error("No audio file uploaded");
  }

  console.log('[Controller] File received:', req.file.filename, req.file.mimetype);
  console.log('[Controller] File path:', req.file.path);

  // Convert speech to text
  console.log('[Controller] Calling transcribeAudio...');
  const transcriptionText = await transcribeAudio(req.file.path);
  console.log('[Controller] Transcription complete, text length:', transcriptionText.length);

  // Save transcription in MongoDB (include user if provided)
  const savedTranscription = await Transcription.create({
    userId: req.body.userId || null,
    filename: req.file.filename,
    text: transcriptionText,
    mimetype: req.file.mimetype,
  });

  // Cleanup uploaded file from server
  fs.unlink(req.file.path, (err) => {
    if (err) console.error("Failed to delete uploaded file:", err);
  });

  res.status(201).json({
    success: true,
    message: "Transcription successful",
    transcription: savedTranscription.text,
    id: savedTranscription._id,
    createdAt: savedTranscription.createdAt,
  });
});

/**
 * @desc   Get all transcriptions (paginated)
 * @route  GET /api/transcriptions
 * @access Public
 */
const getAllTranscriptions = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.userId) filter.userId = req.query.userId;

  const total = await Transcription.countDocuments(filter);

  const transcriptions = await Transcription.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    page,
    pages: Math.ceil(total / limit),
    total,
    data: transcriptions,
  });
});

/**
 * @desc   Get single transcription by ID
 * @route  GET /api/transcriptions/:id
 * @access Public
 */
const getTranscriptionById = asyncHandler(async (req, res) => {
  const transcription = await Transcription.findById(req.params.id);

  if (!transcription) {
    res.status(404);
    throw new Error("Transcription not found");
  }

  res.status(200).json({
    success: true,
    data: transcription,
  });
});

/**
 * @desc   Delete transcription
 * @route  DELETE /api/transcriptions/:id
 * @access Public
 */
const deleteTranscription = asyncHandler(async (req, res) => {
  const transcription = await Transcription.findById(req.params.id);

  if (!transcription) {
    res.status(404);
    throw new Error("Transcription not found");
  }

  await transcription.deleteOne();

  res.status(200).json({
    success: true,
    message: "Transcription deleted successfully",
  });
});

module.exports = {
  uploadAndTranscribe,
  getAllTranscriptions,
  getTranscriptionById,
  deleteTranscription,
};
