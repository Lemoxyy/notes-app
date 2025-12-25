import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function CreateGroup() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function createGroup() {
    if (!name || !password) return alert("Fill all fields");

    // Check if group name already exists
    const { data: existingGroup, error: checkError } = await supabase
      .from("groups")
      .select("*")
      .eq("name", name)
      .single();

    if (checkError && checkError.code !== "PGRST116")
      return alert(checkError.message);
    if (existingGroup) return alert("Group name already exists!");

    // Insert new group
    const { data, error } = await supabase
      .from("groups")
      .insert([{ name, password }])
      .select(); // returns an array

    if (error) return alert(error.message);

    alert("Group created successfully!");
    navigate(`/group/${data[0].id}`); // use first element
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
      <div className="bg-zinc-900 p-6 rounded-xl w-80 space-y-4">
        <h2 className="text-xl font-bold">Create Group</h2>

        <input
          className="w-full p-2 bg-zinc-800 rounded"
          placeholder="Group Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-2 bg-zinc-800 rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={createGroup}
          className="w-full bg-blue-600 py-2 rounded hover:bg-blue-700"
        >
          Create
        </button>
      </div>
    </div>
  );
}
