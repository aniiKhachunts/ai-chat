import { useState } from "react"

export function Hero({ onSubmit }: { onSubmit: (value: string) => void }) {
    const [prompt, setPrompt] = useState("")

    function submit() {
        const v = prompt.trim()
        if (!v) return
        onSubmit(v)
    }

    return (
        <section className="home-hero" id="top">
            <div className="home-container">
                <div className="home-hero-left">
                    <h1 className="home-h1">
                        Everything you need for chatting and video prompts — in one workspace
                    </h1>

                    <p className="home-lead">
                        A single workspace for working with neural networks:
                        <br />
                        ChatGPT, Gemini, Claude, DeepSeek
                    </p>
                </div>

                <div className="home-hero-input-wrap">
                    <input
                        className="home-hero-input"
                        placeholder="Ask anything..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") submit()
                        }}
                    />
                    <button className="home-hero-submit" onClick={submit} type="button">→</button>
                </div>

                <div className="home-hero-hint">
                    Try: “Explain this code”, “Generate a video idea”, “Help me plan a project”
                </div>
            </div>
        </section>
    )
}
