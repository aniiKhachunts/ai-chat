import {useState} from "react";
import type {ModelType} from "../App";

type Props = {
    onSend: (value: string) => void;
    disabled?: boolean;
    selectedModel: ModelType;
};

function MessageInput({onSend, disabled, selectedModel}: Props) {
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
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg"
                     className="icon">
                    <path
                        d="M8.99992 16V6.41407L5.70696 9.70704C5.31643 10.0976 4.68342 10.0976 4.29289 9.70704C3.90237 9.31652 3.90237 8.6835 4.29289 8.29298L9.29289 3.29298L9.36907 3.22462C9.76184 2.90427 10.3408 2.92686 10.707 3.29298L15.707 8.29298L15.7753 8.36915C16.0957 8.76192 16.0731 9.34092 15.707 9.70704C15.3408 10.0732 14.7618 10.0958 14.3691 9.7754L14.2929 9.70704L10.9999 6.41407V16C10.9999 16.5523 10.5522 17 9.99992 17C9.44764 17 8.99992 16.5523 8.99992 16Z"></path>
                </svg>
            </button>
        </div>
    );
}

export default MessageInput;
