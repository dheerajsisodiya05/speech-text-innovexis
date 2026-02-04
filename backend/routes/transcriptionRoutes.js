const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  uploadAndTranscribe,
  getAllTranscriptions,
  getTranscriptionById,
  deleteTranscription,
} = require('../controllers/transcriptionController');

// multer config (same rules as uploadRoutes)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/webm'];
  if (allowedTypes.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Only audio files allowed'), false);
};

const upload = multer({ storage, fileFilter });

const router = express.Router();

router.post('/upload', upload.single('audio'), uploadAndTranscribe);
router.get('/', getAllTranscriptions);
router.get('/:id', getTranscriptionById);
router.delete('/:id', deleteTranscription);

module.exports = router;
