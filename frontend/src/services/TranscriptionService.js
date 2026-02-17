import axios from "axios";

const API = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/transcriptions`
  : "http://localhost:5000/api/transcriptions";

export const uploadAudio = async (file, userId) => {
  const formData = new FormData();
  formData.append("audio", file);      // must match upload.single("audio")
  formData.append("userId", userId);

  const res = await axios.post(
    `${API}/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};

export const fetchHistory = async (userId) => {
  const res = await axios.get(`${API}?userId=${userId}`);
  return res.data.data || [];
};
