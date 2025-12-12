import {useState, type KeyboardEvent, type ChangeEvent} from "react";
import type {Conversation} from "../App";
import DeleteConfirm from "./DeleteChat.tsx";

type SidebarProps = {
    conversations: Conversation[];
    selectedId?: number;
    onSelect: (id: number) => void;
    onNewChat: () => void;
    onRename: (id: number, title: string) => void;
    onDelete: (id: number) => void;
};

export function Sidebar({
                            conversations,
                            selectedId,
                            onSelect,
                            onNewChat,
                            onRename,
                            onDelete,
                        }: SidebarProps) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingValue, setEditingValue] = useState("");
    const [deleteId, setDeleteId] = useState<number | null>(null);

    function startEditing(conv: Conversation) {
        setEditingId(conv.id);
        setEditingValue(conv.title);
    }

    function cancelEditing() {
        setEditingId(null);
        setEditingValue("");
    }

    function submitEditing(id: number) {
        onRename(id, editingValue);
        setEditingId(null);
        setEditingValue("");
    }

    function handleEditKeyDown(e: KeyboardEvent<HTMLInputElement>, id: number) {
        if (e.key === "Enter") {
            e.preventDefault();
            submitEditing(id);
        }
        if (e.key === "Escape") {
            e.preventDefault();
            cancelEditing();
        }
    }

    function handleEditChange(e: ChangeEvent<HTMLInputElement>) {
        setEditingValue(e.target.value);
    }

    function handleDelete(id: number) {
        setDeleteId(id);
    }

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="sidebar-title">Chats</div>
                <button className="new-chat-button" onClick={onNewChat}>
                    <span className="icon">＋</span>
                    <span>New chat</span>
                </button>
            </div>
            <div className="sidebar-list">
                {conversations.map((conv) => {
                    const isActive = conv.id === selectedId;
                    const isEditing = conv.id === editingId;
                    return (
                        <div
                            key={conv.id}
                            className={"chat-list-item" + (isActive ? " active" : "")}
                        >
                            <button
                                className="chat-list-item-main"
                                onClick={() => onSelect(conv.id)}
                            >
                                <div className="chat-list-item-badge">
                                    {(conv.title || "?").charAt(0)}
                                </div>
                                {isEditing ? (
                                    <input
                                        className="chat-title-input"
                                        value={editingValue}
                                        onChange={handleEditChange}
                                        onBlur={() => submitEditing(conv.id)}
                                        onKeyDown={(e) => handleEditKeyDown(e, conv.id)}
                                        autoFocus
                                    />
                                ) : (
                                    <div className="chat-list-item-title">
                                        {conv.title || "Untitled chat"}
                                    </div>
                                )}
                            </button>
                            <div className="chat-list-item-actions">
                                <button
                                    className="icon-button"
                                    onClick={() => startEditing(conv)}
                                    title="Rename"
                                >
                                    ✏️
                                </button>
                                <button
                                    className="icon-button"
                                    onClick={() => handleDelete(conv.id)}
                                    title="Delete"
                                >
                                    🗑
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
            {
                deleteId !== null && (
                    <DeleteConfirm
                        open={true}
                        chatTitle={
                            conversations.find((c) => c.id === deleteId)?.title || "this chat"
                        }
                        onCancel={() => setDeleteId(null)}
                        onConfirm={() => {
                            onDelete(deleteId);
                            setDeleteId(null);
                        }}
                    />
                )
            }
        </aside>
    );
}
