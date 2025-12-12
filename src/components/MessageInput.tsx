import { useState } from "react";
import type { ModelType } from "../App";

type Props = {
    onSend: (value: string) => void;
    disabled?: boolean;
    selectedModel: ModelType;
};

function MessageInput({ onSend, disabled, selectedModel }: Props) {
    const [value, setValue] = useState("");

    function handleSend() {
        if (!value.trim() || disabled) return;
        onSend(value);
        setValue("");
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }

    const placeholder =
        selectedModel === "chat"
            ? "Send a message..."
            : "Describe the video you want to generate...";

    return (
        <div className="message-input">
      <textarea
          className="message-input-textarea"
          rows={3}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
      />
            <button
                type="button"
                className="send-button"
                onClick={handleSend}
                disabled={disabled || !value.trim()}
            >
                Send
            </button>
        </div>
    );
}

export default MessageInput;
