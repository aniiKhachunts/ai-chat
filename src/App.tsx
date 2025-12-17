import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import ChatApp from "./pages/ChatApp/ChatApp";
import Prompts from "./pages/Prompts/Prompts.tsx";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<ChatApp />} />
            <Route path="/prompts" element={<Prompts />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
