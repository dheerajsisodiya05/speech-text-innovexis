import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import AudioRecorder from "../components/AudioRecorder";
import TranscriptionHistory from "../components/TranscriptionHistory";

function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: { user } = {} } = await supabase.auth.getUser();
      setUser(user || null);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return (
      <div className="p-6">
        <p>You are not logged in.</p>
        <a href="/login" className="text-blue-600">Go to Login</a>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <AudioRecorder />
      <TranscriptionHistory />
    </div>
  );
}

export default Home;
