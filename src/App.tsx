import { useMemo, useRef, useState } from "react";
import "./App.css";
import Chat from "./components/Chat";
import { Sidebar } from "./components/Sidebar";

export type ModelType = "chat" | "veo" | "runway" | "kling" | "pika";
export type VideoInputMode = "text" | "image";
export type MessageKind = "text" | "video";

export type Message = {
    id: number;
    role: "user" | "assistant";
    content: string;
    createdAt: string;
    kind: MessageKind;
    mediaUrl?: string;
};

export type Conversation = {
    id: number;
    title: string;
    messages: Message[];
};

function App() {
    const initialConversationId = 1;

    const [conversations, setConversations] = useState<Conversation[]>(() => {
        const now = new Date().toLocaleTimeString();
        return [
            {
                id: initialConversationId,
                title: "New chat",
                messages: [
                    {
                        id: 1,
                        role: "assistant",
                        content:
                            "Hi! Choose a model and start typing. Switch to a video model to generate clips.",
                        createdAt: now,
                        kind: "text"
                    }
                ]
            }
        ];
    });

    const [selectedConversationId, setSelectedConversationId] =
        useState<number | null>(initialConversationId);

    const [selectedModel, setSelectedModel] = useState<ModelType>("chat");
    const [videoInputMode, setVideoInputMode] = useState<VideoInputMode>("text");
    const [videoImageBase64, setVideoImageBase64] = useState<string | null>(null);

    const messageIdRef = useRef(2);

    const selectedConversation = useMemo(
        () => conversations.find((c) => c.id === selectedConversationId) ?? null,
        [conversations, selectedConversationId]
    );

    function handleSelectConversation(id: number) {
        setSelectedConversationId(id);
    }

    function handleNewChat() {
        const now = new Date().toLocaleTimeString();
        const id = Date.now();
        const conv: Conversation = {
            id,
            title: "New chat",
            messages: [
                {
                    id: id + 1,
                    role: "assistant",
                    content: "New chat started. Pick a model and send a message.",
                    createdAt: now,
                    kind: "text"
                }
            ]
        };
        setConversations((prev) => [...prev, conv]);
        setSelectedConversationId(id);
    }

    function handleDeleteConversation(id: number) {
        const remaining = conversations.filter((c) => c.id !== id);
        setConversations(remaining);
        if (selectedConversationId === id) {
            setSelectedConversationId(remaining[0]?.id ?? null);
        }
    }

    function handleRenameConversation(id: number, title: string) {
        const trimmed = title.trim() || "Untitled chat";
        setConversations((prev) =>
            prev.map((c) => (c.id === id ? { ...c, title: trimmed } : c))
        );
    }

    function ensureConversationId(): number | null {
        if (selectedConversation) return selectedConversation.id;
        if (conversations.length) return conversations[0].id;
        return null;
    }

    async function handleSend(text: string) {
        const trimmed = text.trim();
        if (!trimmed) return;

        const targetId = ensureConversationId();
        if (!targetId) return;

        const now = new Date().toLocaleTimeString();
        const newMessageId = messageIdRef.current++;

        const userMessage: Message = {
            id: newMessageId,
            role: "user",
            content: trimmed,
            createdAt: now,
            kind: "text"
        };

        setConversations((prev) =>
            prev.map((conv) =>
                conv.id === targetId
                    ? {
                        ...conv,
                        title:
                            conv.title === "New chat"
                                ? trimmed.slice(0, 40) || conv.title
                                : conv.title,
                        messages: [...conv.messages, userMessage]
                    }
                    : conv
            )
        );

        if (selectedModel === "veo") {
            await sendVeo(trimmed, targetId);
            return;
        }

        if (selectedModel === "runway") {
            await sendRunway(trimmed, targetId);
            return;
        }

        if (selectedModel === "kling") {
            await sendKling(trimmed, targetId);
            return;
        }

        if (selectedModel === "pika") {
            await sendPika(trimmed, targetId);
            return;
        }

        await sendChat(trimmed, targetId);
    }

    async function sendChat(prompt: string, targetId: number) {
        try {
            const res = await fetch("http://localhost:4000/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: [
                        { role: "system", content: "You are a helpful assistant." },
                        { role: "user", content: prompt }
                    ]
                })
            });

            const data = await res.json();

            if (!res.ok) {
                const errorText =
                    data && data.error
                        ? typeof data.error === "string"
                            ? data.error
                            : JSON.stringify(data.error)
                        : "Error from chat API.";
                addAssistantMessage(targetId, errorText, "text");
                return;
            }

            const reply =
                data && typeof data.reply === "string"
                    ? data.reply
                    : "";

            addAssistantMessage(targetId, reply, "text");
        } catch {
            addAssistantMessage(targetId, "Network error while calling chat API.", "text");
        }
    }

    async function sendVeo(prompt: string, targetId: number) {
        try {
            const res = await fetch("http://localhost:4000/api/veo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt,
                    mode: videoInputMode,
                    imageBase64: videoInputMode === "image" ? videoImageBase64 : null
                })
            });

            const data = await res.json();

            if (!res.ok) {
                const errorText =
                    data && data.error ? String(data.error) : "Error generating video with Veo.";
                addAssistantMessage(targetId, errorText, "text");
                return;
            }

            const videoPath = data.videoPath;

            if (!videoPath) {
                const msg = data.message || "Video is not ready yet. Try again later.";
                addAssistantMessage(targetId, msg, "text");
                return;
            }

            const fullUrl = `http://localhost:4000${videoPath}`;
            addAssistantMessage(targetId, "Here is your Veo video.", "video", fullUrl);
        } catch {
            addAssistantMessage(targetId, "Network error while calling Veo API.", "text");
        }
    }

    async function sendRunway(prompt: string, targetId: number) {
        try {
            const res = await fetch("http://localhost:4000/api/runway", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt,
                    mode: videoInputMode,
                    imageBase64: videoInputMode === "image" ? videoImageBase64 : null
                })
            });

            const data = await res.json();

            if (!res.ok) {
                const errorText =
                    data && data.details
                        ? String(data.details)
                        : data && data.error
                            ? String(data.error)
                            : "Error generating video with Runway.";
                addAssistantMessage(targetId, errorText, "text");
                return;
            }

            const videoUrl =
                typeof data.videoUrl === "string"
                    ? data.videoUrl
                    : data &&
                    data.task &&
                    Array.isArray(data.task.output) &&
                    data.task.output[0]
                        ? typeof data.task.output[0] === "string"
                            ? data.task.output[0]
                            : data.task.output[0].uri || data.task.output[0].url
                        : "";

            if (!videoUrl) {
                addAssistantMessage(
                    targetId,
                    "The Runway task completed but no URL was returned.",
                    "text"
                );
                return;
            }

            addAssistantMessage(targetId, "Here is your Runway video.", "video", videoUrl);
        } catch {
            addAssistantMessage(targetId, "Network error while calling Runway API.", "text");
        }
    }

    async function sendKling(prompt: string, targetId: number) {
        try {
            const res = await fetch("http://localhost:4000/api/kling", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt,
                    mode: videoInputMode,
                    imageBase64: videoInputMode === "image" ? videoImageBase64 : null
                })
            });

            const data = await res.json();

            if (!res.ok) {
                const errorText =
                    data && data.details
                        ? String(data.details)
                        : data && data.error
                            ? String(data.error)
                            : "Error generating video with Kling.";
                addAssistantMessage(targetId, errorText, "text");
                return;
            }

            const videoUrl =
                data && data.video && typeof data.video.url === "string"
                    ? data.video.url
                    : typeof data.videoUrl === "string"
                        ? data.videoUrl
                        : "";

            if (!videoUrl) {
                addAssistantMessage(
                    targetId,
                    "The Kling task completed but no URL was returned yet.",
                    "text"
                );
                return;
            }

            addAssistantMessage(targetId, "Here is your Kling video.", "video", videoUrl);
        } catch {
            addAssistantMessage(targetId, "Network error while calling Kling API.", "text");
        }
    }

    async function sendPika(prompt: string, targetId: number) {
        try {
            const res = await fetch("http://localhost:4000/api/pika", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt,
                    mode: videoInputMode,
                    imageBase64: videoInputMode === "image" ? videoImageBase64 : null
                })
            });

            const data = await res.json();

            if (!res.ok) {
                const errorText =
                    data && data.error
                        ? String(data.error)
                        : "Error generating video with Pika.";
                addAssistantMessage(targetId, errorText, "text");
                return;
            }

            const videoUrl =
                typeof data.videoUrl === "string"
                    ? data.videoUrl
                    : data &&
                    data.output &&
                    Array.isArray(data.output) &&
                    data.output[0] &&
                    typeof data.output[0] === "string"
                        ? data.output[0]
                        : "";

            if (!videoUrl) {
                addAssistantMessage(
                    targetId,
                    "The Pika task completed but no URL was returned.",
                    "text"
                );
                return;
            }

            addAssistantMessage(targetId, "Here is your Pika video.", "video", videoUrl);
        } catch {
            addAssistantMessage(targetId, "Network error while calling Pika API.", "text");
        }
    }

    function addAssistantMessage(
        targetId: number,
        content: string,
        kind: MessageKind,
        mediaUrl?: string
    ) {
        const newMessageId = messageIdRef.current++;
        const message: Message = {
            id: newMessageId,
            role: "assistant",
            content,
            createdAt: new Date().toLocaleTimeString(),
            kind,
            mediaUrl
        };

        setConversations((prev) =>
            prev.map((conv) =>
                conv.id === targetId
                    ? { ...conv, messages: [...conv.messages, message] }
                    : conv
            )
        );
    }

    function handleModelChange(model: ModelType) {
        setSelectedModel(model);
        setVideoInputMode("text");
        setVideoImageBase64(null);
    }

    function handleVideoModeChange(mode: VideoInputMode) {
        setVideoInputMode(mode);
        if (mode === "text") {
            setVideoImageBase64(null);
        }
    }

    function handleVideoImageChange(base64: string | null) {
        setVideoImageBase64(base64);
    }

    return (
        <div className="app-shell">
            <Sidebar
                conversations={conversations}
                selectedId={selectedConversationId ?? undefined}
                onSelect={handleSelectConversation}
                onNewChat={handleNewChat}
                onRename={handleRenameConversation}
                onDelete={handleDeleteConversation}
            />
            <Chat
                conversation={selectedConversation}
                onSend={handleSend}
                selectedModel={selectedModel}
                onModelChange={handleModelChange}
                videoInputMode={videoInputMode}
                onVideoModeChange={handleVideoModeChange}
                onVideoImageChange={handleVideoImageChange}
                videoImageBase64={videoImageBase64}
            />
        </div>
    );
}

export default App;
