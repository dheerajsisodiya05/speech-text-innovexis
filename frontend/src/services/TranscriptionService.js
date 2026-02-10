import axios from "axios";

const API = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api/transcriptions`
  : "http://localhost:5000/api/transcriptions";

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
```

---

## 🔧 Add Environment Variable on Vercel

1. Go to your **Vercel dashboard**
2. Click on your **frontend project**
3. Go to **Settings** → **Environment Variables**
4. Add this:
```
Name:  VITE_API_URL
Value: https://speech-text-innovexis.onrender.com