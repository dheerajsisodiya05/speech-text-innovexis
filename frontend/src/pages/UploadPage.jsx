import TranscriptionHistory from "../components/TranscriptionHistory";

function HistoryPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Transcription History
      </h1>

      <TranscriptionHistory />
    </div>
  );
}

export default HistoryPage;
