import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AddNote from "../components/AddNote";

function Home() {
  const [notes, setNotes] = useState([]);
  const [removingId, setRemovingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", content: "" });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotes = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/notes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotes(res.data);
      } catch (err) {
        console.error("Error fetching notes:", err);
      }
    };

    fetchNotes();
  }, [navigate]);

  // Handle Delete
  const handleDelete = async (id) => {
    setRemovingId(id); // Start animation
    setTimeout(async () => {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/notes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
      } catch (err) {
        console.error("Error deleting note:", err);
      }
    }, 300); // Wait for animation to finish
  };

  // Handle Edit Start
  const handleEditStart = (note) => {
    setEditingId(note._id);
    setEditForm({ title: note.title, content: note.content });
  };

  // Handle Edit Submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await axios.put(
        `http://localhost:5000/api/notes/${editingId}`,
        editForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note._id === editingId ? { ...res.data, edited: true } : note
        )
      );
      setEditingId(null);
      setEditForm({ title: "", content: "" });
    } catch (err) {
      console.error("Error updating note:", err);
    }
  };

  return (
    <div className="p-4">
      <AddNote onNoteAdded={(newNote) => setNotes([newNote, ...notes])} />
      <h1 className="text-2xl font-bold mt-4">Your Notes</h1>
      <div className="note-container">
        {notes.map((note) => (
          <div
            key={note._id}
            className={`note-card ${removingId === note._id ? "removing" : ""} ${
              note.edited ? "edited" : ""
            }`}
          >
            {editingId === note._id ? (
              <form onSubmit={handleEditSubmit}>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                />
                <textarea
                  value={editForm.content}
                  onChange={(e) =>
                    setEditForm({ ...editForm, content: e.target.value })
                  }
                />
                <button type="submit">Save</button>
              </form>
            ) : (
              <>
                <h3>{note.title}</h3>
                <p>{note.content}</p>
                <button onClick={() => handleEditStart(note)}>Edit</button>
                <button onClick={() => handleDelete(note._id)}>Delete</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
