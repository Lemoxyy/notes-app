import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col justify-center items-center gap-6">
      <h1 className="text-4xl font-bold">OpenNotes</h1>

      <div className="flex gap-4">
        <Link
          to="/create"
          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700"
        >
          Create Group
        </Link>

        <Link
          to="/join"
          className="px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700"
        >
          Join Group
        </Link>
      </div>
    </div>
  );
}
