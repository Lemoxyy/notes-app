import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Dashboard() {
  const { id } = useParams();
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [teacher, setTeacher] = useState("");
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState(null);

  async function fetchNotes() {
    const { data } = await supabase
      .from("notes")
      .select("*")
      .eq("group_id", id)
      .order("created_at", { ascending: false });

    setNotes(data || []);
  }

  useEffect(() => {
    fetchNotes();
  }, []);

  async function uploadNote() {
    if (!file) return alert("Select a file");

    const filePath = `${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("notes")
      .upload(filePath, file);

    if (uploadError) return alert(uploadError.message);

    const { data } = supabase.storage.from("notes").getPublicUrl(filePath);

    await supabase.from("notes").insert([
      {
        group_id: id,
        title,
        teacher,
        subject,
        file_url: data.publicUrl,
        date: new Date(),
      },
    ]);

    setTitle("");
    setTeacher("");
    setSubject("");
    setFile(null);

    fetchNotes();
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Group Dashboard</h1>

      <div className="bg-zinc-900 p-4 rounded-xl grid md:grid-cols-4 gap-3 mb-6">
        <input
          placeholder="Title"
          className="p-2 bg-zinc-800 rounded"
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          placeholder="Teacher"
          className="p-2 bg-zinc-800 rounded"
          onChange={(e) => setTeacher(e.target.value)}
        />
        <input
          placeholder="Subject"
          className="p-2 bg-zinc-800 rounded"
          onChange={(e) => setSubject(e.target.value)}
        />
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />

        <button
          onClick={uploadNote}
          className="col-span-full bg-blue-600 py-2 rounded hover:bg-blue-700"
        >
          Upload
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {notes.map((n) => (
          <div key={n.id} className="bg-zinc-900 p-4 rounded-xl">
            <h3 className="font-bold">{n.title}</h3>
            <p className="text-sm text-zinc-400">{n.teacher}</p>
            <p className="text-sm text-zinc-500">{n.subject}</p>

            <a
              href={n.file_url}
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
