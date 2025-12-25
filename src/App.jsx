import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreateGroup from "./pages/CreateGroup";
import JoinGroup from "./pages/JoinGroup";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateGroup />} />
        <Route path="/join" element={<JoinGroup />} />
        <Route path="/group/:id" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
