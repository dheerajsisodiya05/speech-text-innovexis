const asyncHandler = require("../utils/asyncHandler");

const uploadAndTranscribe = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No audio file uploaded");
  }

  const text = await transcribeAudio(req.file.path);

  const saved = await Transcription.create({
    filename: req.file.filename,
    text,
    mimetype: req.file.mimetype,
  });

  res.status(201).json({
    success: true,
    transcription: saved.text,
  });
});
