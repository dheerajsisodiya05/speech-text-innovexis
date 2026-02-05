const fs = require("fs");
const path = require("path");
const axios = require("axios");

const transcribeAudio = async (filePath) => {
  const audioBuffer = fs.readFileSync(filePath);
  const ext = path.extname(filePath);

  let mimetype = "audio/wav";
  if (ext === ".mp3") mimetype = "audio/mpeg";
  if (ext === ".webm") mimetype = "audio/webm";

  const response = await axios.post(
    "https://api.deepgram.com/v1/listen",
    audioBuffer,
    {
      headers: {
        Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
        "Content-Type": mimetype,
      },
      params: {
        punctuate: true,
        language: "en",
        model: "nova-2",
      },
    }
  );

  // STABLE RESPONSE PATH
  return (
    response.data.results.channels[0].alternatives[0].transcript || ""
  );
};

module.exports = { transcribeAudio };
