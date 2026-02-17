const fs = require("fs");
const axios = require("axios");

const transcribeAudio = async (filePath) => {
  if (!process.env.DEEPGRAM_API_KEY) {
    throw new Error("Deepgram API key missing");
  }

  try {
    const response = await axios.post(
      "https://api.deepgram.com/v1/listen",
      fs.createReadStream(filePath),
      {
        headers: {
          Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
          "Content-Type": "application/octet-stream",
        },
        params: {
          punctuate: true,
          language: "en",
          model: "nova-2",
        },
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
        timeout: 120000, // 2 minutes
      }
    );

    return (
      response.data?.results?.channels?.[0]?.alternatives?.[0]?.transcript || ""
    );
  } catch (error) {
    console.error("Deepgram Error:", error.response?.data || error.message);
    throw error;
  }
};

module.exports = { transcribeAudio };
