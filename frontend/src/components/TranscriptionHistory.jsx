import { useEffect, useState } from "react";
import { fetchHistory } from "../services//TranscriptionService";
import { supabase } from "../services/SupabaseClient";

function TranscriptionHistory() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setData([]);
          return;
        }

        const history = await fetchHistory(user.id);
        setData(history || []);
      } catch (err) {
        console.error("Failed to load history:", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <div>Loading....</div>;

  return (
    <div className="bg-white p-6 rounded shadow space-y-4">
      {data.length === 0 ? (
        <div>No transcriptions found.</div>
      ) : (
        data.map((item) => (
          <div key={item._id} className="border p-3 rounded">
            <p>{item.text}</p>
            <small>{new Date(item.createdAt).toLocaleString()}</small>
          </div>
        ))
      )}
    </div>
  );
}

export default TranscriptionHistory;
