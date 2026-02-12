import { useRef, useState } from "react";
import { uploadAudio } from "../services/TranscriptionService";
import { supabase } from "../services/supabaseDClient";

function AudioRecorder() {
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const fileInputRef = useRef(null);

  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const resetUI = () => {
    setText("");
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const sendFile = async (file) => {
    try {
      setLoading(true);
      setError("");
      setText("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      const res = await uploadAudio(file, user.id);
      setText(res.transcription || "No speech detected");
    } catch {
      setError("Failed to transcribe audio");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) sendFile(file);
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    recorderRef.current = new MediaRecorder(stream);
    chunksRef.current = [];

    recorderRef.current.ondataavailable = (e) => {
      chunksRef.current.push(e.data);
    };

    recorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    recorderRef.current.stop();
    setRecording(false);

    recorderRef.current.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const file = new File([blob], "recording.webm", {
        type: "audio/webm",
      });
      sendFile(file);
    };
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-6 space-y-6">
      <h2 className="text-2xl font-semibold text-center">
        Upload or Record Audio
      </h2>

      {/* Upload */}
      <div className="border-2 border-dashed rounded-lg p-4 text-center">
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleUpload}
          className="hidden"
          id="audioUpload"
        />
        <label
          htmlFor="audioUpload"
          className="cursor-pointer text-blue-600 font-medium"
        >
          Click to upload audio file
        </label>
      </div>

      {/* Recording */}
      <div className="flex justify-center gap-4">
        {!recording ? (
          <button
            onClick={startRecording}
            disabled={loading}
            className="bg-green-600 text-white px-6 py-2 rounded-lg"
          >
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="bg-red-600 text-white px-6 py-2 rounded-lg"
          >
            Stop Recording
          </button>
        )}
      </div>

      {loading && (
        <p className="text-center text-blue-600 animate-pulse">
          Transcribing…
        </p>
      )}

      {error && <p className="text-center text-red-600">{error}</p>}

      {text && (
        <div className="bg-gray-50 border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Transcription</h3>
          <p className="whitespace-pre-wrap">{text}</p>

          <button
            onClick={resetUI}
            className="mt-4 text-sm text-blue-600 underline"
          >
            Upload / Record another audio
          </button>
        </div>
      )}
    </div>
  );
}

export default AudioRecorder;
