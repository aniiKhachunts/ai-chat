import {useEffect, useRef} from "react";
import type {Message} from "../App";

type MessageListProps = {
    messages: Message[];
};

export function MessageList({messages}: MessageListProps) {
    const endRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({behavior: "smooth", block: "end"});
    }, [messages]);

    return (
        <>
            {messages.map((msg) => {
                const isUser = msg.role === "user";

                const content =
                    msg.kind === "video" && msg.mediaUrl ? (
                        <video src={msg.mediaUrl} controls className="chat-video"/>
                    ) : (
                        msg.content
                    );

                return (
                    <div
                        key={msg.id}
                        className={
                            "message-row " +
                            (isUser ? "message-row-user" : "message-row-assistant")
                        }
                    >
                        {!isUser && <div className="message-avatar assistant">AI</div>}

                        <div className="message-content">
                            <div
                                className={
                                    "message-bubble " + (isUser ? "user" : "assistant")
                                }
                            >
                                {content}
                            </div>
                            <div className="message-meta">
                                {isUser ? "You" : "Assistant"} • {msg.createdAt}
                            </div>
                        </div>

                        {isUser && <div className="message-avatar user">You</div>}
                    </div>
                );
            })}
            <div ref={endRef}/>
        </>
    );
}
