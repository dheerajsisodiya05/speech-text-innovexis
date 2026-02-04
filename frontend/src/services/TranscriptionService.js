import axios from "axios";

const API = "http://localhost:5000/api/transcriptions";

export const uploadAudio = async (file, userId) => {
  const formData = new FormData();
  formData.append("audio", file);
  formData.append("userId", userId);

  const res = await axios.post(`${API}/upload`, formData);
  return res.data;
};

export const fetchHistory = async (userId) => {
  const res = await axios.get(`${API}?userId=${userId}`);
  return res.data.data;
};
