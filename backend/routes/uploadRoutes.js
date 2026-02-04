const express = require("express");
const multer = require("multer");
const path = require("path");
const { transcribeAudio } = require("../services/speechService");

const router = express.Router();

// multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "audio/mpeg",
    "audio/wav",
    "audio/mp3",
    "audio/webm",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only audio files allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

// FINAL ROUTE
router.post("/upload", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No audio file uploaded" });
    }

    const transcriptionText = await transcribeAudio(req.file.path);

    res.status(200).json({
      message: "Transcription successful",
      transcription: transcriptionText,
    });
  } catch (error) {
  console.error("Deepgram error:", error);

  res.status(500).json({
    message: "Error while transcribing audio",
    error: error.message || error,
  });
}
});

module.exports = router;
