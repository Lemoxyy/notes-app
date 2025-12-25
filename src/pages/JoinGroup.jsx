import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function JoinGroup() {
  const [groupId, setGroupId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function joinGroup() {
    const { data, error } = await supabase
      .from("groups")
      .select("*")
      .eq("id", groupId)
      .single();

    if (error || !data) return alert("Group not found");

    if (data.password !== password) {
      return alert("Wrong password");
    }

    navigate(`/group/${groupId}`);
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex justify-center items-center">
      <div className="bg-zinc-900 p-6 rounded-xl w-80 space-y-4">
        <h2 className="text-xl font-bold">Join Group</h2>

        <input
          className="w-full p-2 bg-zinc-800 rounded"
          placeholder="Group ID"
          onChange={(e) => setGroupId(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-2 bg-zinc-800 rounded"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={joinGroup} className="w-full bg-blue-600 py-2 rounded">
          Join
        </button>
      </div>
    </div>
  );
}
