import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function JoinGroup() {
  const [groupName, setGroupName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function joinGroup() {
    if (!groupName || !password) return alert("Fill all fields");

    // Search for group by name
    const { data, error } = await supabase
      .from("groups")
      .select("*")
      .eq("name", groupName)
      .single();

    if (error || !data) return alert("Group not found");

    // Check password
    if (data.password !== password) return alert("Wrong password");

    alert(`Joined group: ${data.name}`);
    navigate(`/group/${data.id}`);
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex justify-center items-center">
      <div className="bg-zinc-900 p-6 rounded-xl w-80 space-y-4">
        <h2 className="text-xl font-bold">Join Group</h2>

        <input
          className="w-full p-2 bg-zinc-800 rounded"
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-2 bg-zinc-800 rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={joinGroup}
          className="w-full bg-blue-600 py-2 rounded hover:bg-blue-700"
        >
          Join
        </button>
      </div>
    </div>
  );
}
