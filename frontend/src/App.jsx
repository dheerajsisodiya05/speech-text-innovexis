import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./services/supabaseClient";

import Home from "./pages/Home";
import History from "./pages/History";
import Login from "./pages/Login";

function App() {
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <>
      <nav className="p-4 bg-white shadow flex gap-4">
        {session && (
          <>
            <Link to="/">Home</Link>
            <Link to="/history">History</Link>
            <button onClick={handleLogout} className="text-red-600">
              Logout
            </button>
          </>
        )}

        {!session && <Link to="/login">Login</Link>}
      </nav>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={session ? <Home /> : <Login />} />
        <Route
          path="/history"
          element={session ? <History /> : <Login />}
        />
      </Routes>
    </>
  );
}

export default App;
