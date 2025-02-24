import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AddNote from "../components/AddNote";

function Home() {
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotes = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get("http://localhost:8080/api/notes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotes(res.data);
      } catch (err) {
        console.error("Error fetching notes:", err);
      }
    };

    fetchNotes();
  }, [navigate]);

  const handleNoteAdded = (newNote) => {
    setNotes([newNote, ...notes]); // Update UI immediately
  };

  return (
    <div className="p-4">
      <AddNote onNoteAdded={handleNoteAdded} />
      <h1 className="text-2xl font-bold mt-4">Your Notes</h1>
      <div className="note-container">
        {notes.map((note) => (
          <div key={note._id} className="note-card">
            <h3>{note.title}</h3>
            <p>{note.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
