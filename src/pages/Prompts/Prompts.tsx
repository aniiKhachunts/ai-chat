import {useEffect, useMemo, useState} from "react"
import {useLocation, useNavigate} from "react-router-dom"
import {PROMPTS} from "../../data/prompts"
import "./prompts.css"
import "../Home/Home.css"

type PromptItem = {
    id: string
    title: string
    text: string
}

type PromptCategory = {
    id: string
    title: string
    subtitle?: string
    items: PromptItem[]
}

export default function Prompts() {
    const location = useLocation()
    const categories = PROMPTS as unknown as PromptCategory[]
    const [openPromptId, setOpenPromptId] = useState<string | null>(null)

    const firstCategoryId = useMemo(() => categories[0]?.id ?? null, [categories])

    useEffect(() => {
        const idFromHash = location.hash?.replace("#", "") || null
        const target = idFromHash || firstCategoryId
        if (!target) return
        requestAnimationFrame(() => {
            document.getElementById(target)?.scrollIntoView({behavior: "smooth", block: "start"})
        })
    }, [location.hash, firstCategoryId])

    return (
        <main className="prompts">
            <header className="home-header">
                <div className="home-header-inner home-container">
                    <a className="home-brand" href="/">
                        <span className="home-logo" />
                        <span className="home-brand-text">AI Chat</span>
                    </a>

                    <div className="home-actions">
                        <a className="home-ghost" href="/">Back</a>
                        <a className="home-primary" href="/chat">Start</a>
                    </div>
                </div>
            </header>


            <div className="prompts-container">
                <h1 className="prompts-title">Prompt Library</h1>

                <div className="prompts-sections">
                    {categories.map((c) => (
                        <section key={c.id} id={c.id} className="category">
                            <div className="category-title-row">
                                <h2 className="category-title">{c.title}</h2>
                            </div>

                            <div className="category-list">
                                {c.items.slice(0, 2).map((p) => (
                                    <PromptRow
                                        key={p.id}
                                        prompt={p}
                                        open={openPromptId === p.id}
                                        onToggle={() => setOpenPromptId(openPromptId === p.id ? null : p.id)}
                                    />
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </div>
        </main>
    )
}

function PromptRow({
                       prompt,
                       open,
                       onToggle
                   }: {
    prompt: { id: string; title: string; text: string }
    open: boolean
    onToggle: () => void
}) {
    const navigate = useNavigate()
    const [copied, setCopied] = useState(false)

    function handleUse() {
        navigate("/chat", {state: {initialPrompt: prompt.text}})
    }

    async function handleCopy(e: React.MouseEvent) {
        e.stopPropagation()
        await navigator.clipboard.writeText(prompt.text)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 900)
    }

    return (
        <div className={`prompt ${open ? "open" : ""}`} data-open={open ? "1" : "0"}>
            <button type="button" className="prompt-head" onClick={onToggle}>
                <span className="prompt-title">{prompt.title}</span>
                <span className="prompt-plus">{open ? "–" : "+"}</span>
            </button>

            <div className={`prompt-body ${open ? "open" : ""}`}>
                <div className="prompt-body-top">
                    <button
                        type="button"
                        className={`prompt-copy ${copied ? "copied" : ""}`}
                        onClick={handleCopy}
                        aria-label="Copy prompt"
                        title={copied ? "Copied" : "Copy"}
                    >
                        {copied ? <CheckIcon/> : <CopyIcon/>}
                    </button>
                </div>

                <div className="prompt-text">{String(prompt.text)}</div>

                <div className="prompt-actions">
                    <button type="button" className="btn-primary" onClick={handleUse}>
                        Use in chat
                    </button>
                </div>
            </div>
        </div>
    )
}

function CopyIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
                d="M9 9h10v10H9V9Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
            />
            <path
                d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
            />
        </svg>
    )
}

function CheckIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
                d="m20 7-11 11-5-5"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}
