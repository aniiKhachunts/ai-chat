import type { ModelType, VideoInputMode, Conversation } from "../App";
import { MessageList } from "./MessageList";
import MessageInput from "./MessageInput";

type ChatProps = {
    conversation: Conversation | null;
    onSend: (value: string) => void;
    selectedModel: ModelType;
    onModelChange: (m: ModelType) => void;
    videoInputMode: VideoInputMode;
    onVideoModeChange: (m: VideoInputMode) => void;
    onVideoImageChange: (base64: string | null) => void;
    videoImageBase64: string | null;
};

function Chat({
                  conversation,
                  onSend,
                  selectedModel,
                  onModelChange,
                  videoInputMode,
                  onVideoModeChange,
                  onVideoImageChange,
                  videoImageBase64
              }: ChatProps) {
    const isVideoModel =
        selectedModel === "veo" ||
        selectedModel === "runway" ||
        selectedModel === "kling" ||
        selectedModel === "pika";

    function handleFileChange(file: File | null) {
        if (!file) {
            onVideoImageChange(null);
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result;
            if (typeof result === "string") onVideoImageChange(result);
        };
        reader.readAsDataURL(file);
    }

    const title = conversation ? conversation.title : "No chat selected";

    const hintText =
        selectedModel === "chat"
            ? "Text chat model (OpenAI)"
            : selectedModel === "veo"
                ? videoInputMode === "text"
                    ? "Veo 3.1 text-to-video"
                    : "Veo 3.1 image+text to video"
                : selectedModel === "runway"
                    ? videoInputMode === "text"
                        ? "Runway Gen-4 text-to-video"
                        : "Runway Gen-4 image+text to video"
                    : selectedModel === "kling"
                        ? videoInputMode === "text"
                            ? "Kling text-to-video"
                            : "Kling image-to-video"
                        : videoInputMode === "text"
                            ? "Pika 2.2 text-to-video"
                            : "Pika 2.2 image-to-video";

    return (
        <section className="chat-area">
            <header className="chat-header">
                <div className="chat-title">
                    <div className="chat-title-badge" />
                    <div>
                        <div className="chat-title-text">{title}</div>
                    </div>
                </div>
            </header>

            <div className="messages-wrapper">
                <div className="messages-inner">
                    {conversation && <MessageList messages={conversation.messages} />}
                </div>
            </div>

            <div className="chat-input-bar">
                <div className="chat-input-inner">
                    <div className="chat-input-top-row">
                        <span className="chat-input-top-label">Model</span>
                        <select
                            className="model-selector"
                            value={selectedModel}
                            onChange={(e) => onModelChange(e.target.value as ModelType)}
                        >
                            <option value="chat">Chat (OpenAI)</option>
                            <option value="veo">Veo 3.1 (Video)</option>
                            <option value="runway">Runway Gen-4 (Video)</option>
                            <option value="kling">Kling (Video)</option>
                            <option value="pika">Pika 2.2 (Video)</option>
                        </select>
                    </div>

                    {isVideoModel && (
                        <div className="video-controls">
                            <div className="video-mode-toggle">
                                <button
                                    type="button"
                                    className={
                                        videoInputMode === "text"
                                            ? "video-mode-button active"
                                            : "video-mode-button"
                                    }
                                    onClick={() => onVideoModeChange("text")}
                                >
                                    Text → Video
                                </button>
                                <button
                                    type="button"
                                    className={
                                        videoInputMode === "image"
                                            ? "video-mode-button active"
                                            : "video-mode-button"
                                    }
                                    onClick={() => onVideoModeChange("image")}
                                >
                                    Image + Text → Video
                                </button>
                            </div>

                            {videoInputMode === "image" && (
                                <div className="video-image-upload">
                                    <label className="upload-label">
                                        <span>Attach image</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) =>
                                                handleFileChange(
                                                    e.target.files ? e.target.files[0] : null
                                                )
                                            }
                                        />
                                    </label>

                                    {videoImageBase64 && (
                                        <div className="image-preview">
                                            <img src={videoImageBase64} alt="Preview" />
                                            <button
                                                type="button"
                                                className="clear-image-button"
                                                onClick={() => onVideoImageChange(null)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    <MessageInput
                        onSend={onSend}
                        disabled={!conversation}
                        selectedModel={selectedModel}
                    />

                    <div className="chat-input-hint">Using: {hintText}</div>
                </div>
            </div>
        </section>
    );
}

export default Chat;
