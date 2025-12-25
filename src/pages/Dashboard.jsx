import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // for URL params
import { supabase } from "../lib/supabase"; // your Supabase client

export default function Dashboard() {
  const { id: groupId } = useParams(); // get group UUID from URL
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [teacher, setTeacher] = useState("");
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState(null);

  // Fetch notes for this group
  async function fetchNotes() {
    if (!groupId) return;

    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("group_id", groupId)
      .order("created_at", { ascending: false });

    if (error) return alert(error.message);
    setNotes(data || []);
  }

  useEffect(() => {
    fetchNotes();
  }, [groupId]);

  // Upload file and insert note
  async function uploadNote() {
    if (!groupId) return alert("Invalid group ID");
    if (!file || !title || !teacher || !subject)
      return alert("Please fill all fields and select a file");

    try {
      // Unique file path
      const filePath = `${Date.now()}-${file.name}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("notes") // your storage bucket name
        .upload(filePath, file);

      if (uploadError) return alert(uploadError.message);

      // Get public URL
      const { data: publicData } = supabase.storage
        .from("notes")
        .getPublicUrl(filePath);

      // Insert note into database
      const { error: insertError } = await supabase.from("notes").insert([
        {
          group_id: groupId,
          title,
          teacher,
          subject,
          file_url: publicData.publicUrl,
          file_name: file.name, // original file name
          date: new Date(),
        },
      ]);

      if (insertError) return alert(insertError.message);

      // Reset form
      setTitle("");
      setTeacher("");
      setSubject("");
      setFile(null);

      // Refresh notes
      fetchNotes();
      alert("Note uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("Something went wrong while uploading note.");
    }
  }

  return (
    <div className="min-h-screen p-6 bg-zinc-950 text-white">
      <h1 className="text-2xl font-bold mb-4">Group Dashboard</h1>

      {/* Upload Form */}
      <div className="bg-zinc-900 p-4 rounded-xl grid md:grid-cols-4 gap-3 mb-6">
        <input
          placeholder="Title"
          className="p-2 bg-zinc-800 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          placeholder="Teacher"
          className="p-2 bg-zinc-800 rounded"
          value={teacher}
          onChange={(e) => setTeacher(e.target.value)}
        />
        <input
          placeholder="Subject"
          className="p-2 bg-zinc-800 rounded"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />

        <button
          onClick={uploadNote}
          className="col-span-full bg-blue-600 py-2 rounded hover:bg-blue-700"
        >
          Upload Note
        </button>
      </div>

      {/* List of Notes */}
      <div className="grid md:grid-cols-3 gap-4">
        {notes.length === 0 && <p>No notes uploaded yet.</p>}
        {notes.map((note) => (
          <div key={note.id} className="bg-zinc-900 p-4 rounded-xl">
            <h3 className="font-bold">{note.title}</h3>
            <p className="text-sm text-zinc-400">{note.teacher}</p>
            <p className="text-sm text-zinc-500">{note.subject}</p>
            <p className="text-sm text-zinc-300">File: {note.file_name}</p>
            <a
              href={note.file_url}
              target="_blank"
              className="inline-block mt-2 text-blue-400 underline"
            >
              Open File
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
