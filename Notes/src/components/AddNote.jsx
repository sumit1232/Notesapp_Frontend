import { useState } from "react";
import axios from "axios";

function AddNote({ onNoteAdded }) {
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Unauthorized. Please login.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8080/api/notes", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      onNoteAdded(res.data); // Update the UI
      setFormData({ title: "", content: "" }); // Clear form
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Error adding note");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="note-form">
      <h2>Add a Note</h2>
      {error && <p className="error">{error}</p>}
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleChange}
        required
      />
      <textarea
        name="content"
        placeholder="Content"
        value={formData.content}
        onChange={handleChange}
        required
      />
      <button type="submit">Add Note</button>
    </form>
  );
}

export default AddNote;
