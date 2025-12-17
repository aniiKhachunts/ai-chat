import "./home.css";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {PROMPTS} from "../../data/prompts.ts";

export default function Home() {
    const navigate = useNavigate();
    const [prompt, setPrompt] = useState("");

    function handleSubmit() {
        if (!prompt.trim()) return;

        navigate("/chat", {
            state: {
                initialPrompt: prompt.trim(),
            },
        });
    }

    const templates = [
        {
            title: "Explain code",
            desc: "Understand a snippet quickly, with edge cases.",
            prompt: "Explain this code step-by-step. Then list potential bugs, edge cases, and improvements:\n\n[PASTE CODE HERE]"
        },
        {
            title: "Write a reply",
            desc: "Clear, confident message for work or clients.",
            prompt: "Rewrite this message to be short, confident, and friendly. Keep the meaning:\n\n[PASTE MESSAGE HERE]"
        },
        {
            title: "Plan a feature",
            desc: "Break work into steps with files and tasks.",
            prompt: "Help me plan this feature. Provide a step-by-step implementation plan, file-by-file, with acceptance criteria:\n\n[DESCRIBE FEATURE HERE]"
        },
        {
            title: "Landing section copy",
            desc: "Hero + bullets + CTA, calm SaaS tone.",
            prompt: "Write landing page copy for a calm, premium SaaS. Give: headline, subheadline, 3 bullets, and 2 CTA options. Product:\n\n[PRODUCT INFO HERE]"
        },
        {
            title: "Bug triage",
            desc: "Find root cause and propose a safe fix.",
            prompt: "Act as a senior dev. Ask for only the necessary info, then propose the most likely root cause and a safe fix. Bug:\n\n[BUG DESCRIPTION HERE]"
        },
        {
            title: "Video prompt",
            desc: "Structured prompt for a short clip.",
            prompt: "Create a detailed prompt for a 6–10s video. Include camera, lighting, style, motion, and constraints. Idea:\n\n[IDEA HERE]"
        }
    ];


    return (
        <div className="home">
            <header className="home-header">
                <div className="home-header-inner home-container">
                    <a className="home-brand" href="#top">
                        <span className="home-logo"/>
                        <span className="home-brand-text">AI Chat</span>
                    </a>

                    <nav className="home-nav">
                        <a className="home-nav-link" href="#multichat">Multichat</a>
                        <a className="home-nav-link" href="#memory">Memory</a>
                        <a className="home-nav-link" href="#pricing">Pricing</a>
                        <a className="home-nav-link" href="#faq">Questions</a>
                    </nav>

                    <div className="home-actions">
                        <a className="home-primary" href="/chat">Start</a>
                    </div>
                </div>
            </header>

            <main id="top">
                <section className="home-hero">
                    <div className="home-container">

                        <div className="home-hero-left">

                            <h1 className="home-h1">
                                Everything you need for chatting and video prompts — in one workspace
                            </h1>

                            <p className="home-lead">
                                A single workspace for working with neural networks: <br/>
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
                                    if (e.key === "Enter") handleSubmit();
                                }}
                            />
                            <button
                                className="home-hero-submit"
                                onClick={handleSubmit}
                            >
                                →
                            </button>
                        </div>

                        <div className="home-hero-hint">
                            Try: “Explain this code”, “Generate a video idea”, “Help me plan a project”
                        </div>

                        <div className="ai-marquee" aria-label="Supported AI models">
                            <div className="ai-marquee-track">
                                {[
                                    { name: "OpenAI", logo: "/logos/openai.webp" },
                                    { name: "Claude", logo: "/logos/claude.png" },
                                    { name: "Gemini", logo: "/logos/gemini.png" },
                                    { name: "DeepSeek", logo: "/logos/deepseek.png" },
                                ].concat([
                                    { name: "OpenAI", logo: "/logos/openai.webp" },
                                    { name: "Claude", logo: "/logos/claude.png" },
                                    { name: "Gemini", logo: "/logos/gemini.png" },
                                    { name: "DeepSeek", logo: "/logos/deepseek.png" },
                                ]).map((ai, i) => (
                                    <div key={`${ai.name}-${i}`} className="ai-marquee-item" title={ai.name}>
                                        <img src={ai.logo} alt={ai.name} loading="lazy" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="home-categories">
                    <div className="home-container">
                        <h2 className="home-categories-title">
                            Pick a category, open ready templates
                        </h2>
                        <p className="home-categories-sub">
                            Choose a category and explore detailed prompts inside.
                        </p>

                        <div className="home-categories-grid">
                            {PROMPTS.map((c) => (
                                <button
                                    key={c.id}
                                    className="home-category-card"
                                    onClick={() => navigate(`/prompts#${c.id}`)}
                                    type="button"
                                >
                                    <div className="home-category-top">
                                        <div className="home-category-name">{c.title}</div>
                                        <div className="home-category-arrow">↗</div>
                                    </div>
                                    <div className="home-category-desc">{c.subtitle}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                <Section
                    id="multichat"
                    kicker="Multichat"
                    title="Compare outputs without tab chaos"
                    items={[
                        {title: "Side-by-side thinking", text: "Ask once and compare multiple answers instantly."},
                        {title: "Faster decisions", text: "Pick the best response with more confidence."},
                        {title: "Cleaner workflow", text: "One workspace instead of 10 tabs."},
                    ]}
                />

                <Split
                    id="memory"
                    kicker="Memory"
                    title="Keep context, stay consistent"
                    leftTitle="Remember your preferences"
                    leftText="Save tone, formatting rules, and project details so you don’t repeat yourself."
                    rightTitle="Stay in control"
                    rightText="Update or remove what you saved anytime."
                />

                <Pricing/>
                <Faq/>

                <section className="home-final">
                    <div className="home-final-inner home-container">
                        <h3 className="home-h3">Ready to start?</h3>
                        <p className="home-final-text">
                            Open the chat and try the workflow — text or video models, in one place.
                        </p>
                        <div className="home-final-cta">
                            <a className="home-primary big" href="/chat">Open chat</a>
                            <a className="home-ghost big" href="#pricing">View pricing</a>
                        </div>
                    </div>

                    <footer className="home-footer">
                        <span>© {new Date().getFullYear()} AI Chat</span>
                        <div className="home-footer-links">
                            <a href="#faq">FAQ</a>
                            <a href="#pricing">Pricing</a>
                            <a href="#top">Top</a>
                        </div>
                    </footer>
                </section>
            </main>
        </div>
    );
}

function Section({
                     id,
                     kicker,
                     title,
                     items,
                 }: {
    id: string;
    kicker: string;
    title: string;
    items: { title: string; text: string }[];
}) {
    return (
        <section id={id} className="home-section">
            <div className="home-section-inner home-container">
                <div className="home-section-head">
                    <div className="home-kicker">{kicker}</div>
                    <h2 className="home-h2">{title}</h2>
                </div>

                <div className="home-cards">
                    {items.map((i) => (
                        <div key={i.title} className="home-card">
                            <div className="home-card-title">{i.title}</div>
                            <div className="home-card-text">{i.text}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function Split({
                   id,
                   kicker,
                   title,
                   leftTitle,
                   leftText,
                   rightTitle,
                   rightText,
               }: {
    id: string;
    kicker: string;
    title: string;
    leftTitle: string;
    leftText: string;
    rightTitle: string;
    rightText: string;
}) {
    return (
        <section id={id} className="home-section">
            <div className="home-section-inner">
                <div className="home-section-head">
                    <div className="home-kicker">{kicker}</div>
                    <h2 className="home-h2">{title}</h2>
                </div>

                <div className="home-split">
                    <div className="home-panel">
                        <div className="home-panel-title">{leftTitle}</div>
                        <div className="home-panel-text">{leftText}</div>
                        <div className="home-sample">
                            Prefer TypeScript. Keep UI monotone. Use cold blue accent.
                        </div>
                    </div>

                    <div className="home-panel">
                        <div className="home-panel-title">{rightTitle}</div>
                        <div className="home-panel-text">{rightText}</div>
                        <div className="home-tags">
                            {["Pinned", "Editable", "Per-chat", "Fast"].map((t) => (
                                <span key={t} className="home-tag">{t}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function Pricing() {
    const plans = [
        {
            name: "Free",
            price: "$0",
            perks: ["Basic chat", "Try the UI", "Limited history"],
            featured: false,
            cta: "Start free"
        },
        {
            name: "Pro",
            price: "$9",
            perks: ["Multichat", "Video models", "Better limits"],
            featured: true,
            cta: "Get Pro"
        },
        {
            name: "Team",
            price: "$19",
            perks: ["Shared spaces", "Admin controls", "Team templates"],
            featured: false,
            cta: "Contact"
        },
    ];

    return (
        <section id="pricing" className="home-section">
            <div className="home-section-inner">
                <div className="home-section-head">
                    <div className="home-kicker">Pricing</div>
                    <h2 className="home-h2">Choose your plan</h2>
                </div>

                <div className="home-pricing">
                    {plans.map((p) => (
                        <div key={p.name} className={p.featured ? "home-plan featured" : "home-plan"}>
                            <div className="home-plan-top">
                                <div className="home-plan-name">{p.name}</div>
                                <div className="home-plan-price">{p.price}<span>/mo</span></div>
                            </div>

                            <ul className="home-plan-list">
                                {p.perks.map((x) => (
                                    <li key={x}><span className="home-dot"/>{x}</li>
                                ))}
                            </ul>

                            <a className={p.featured ? "home-primary big full" : "home-ghost big full"} href="/chat">
                                {p.cta}
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function Faq() {
    const faqs = [
        {q: "Can I use video models too?", a: "Yes — switch models and choose text-to-video or image+text modes."},
        {q: "Do I need setup to start?", a: "No. Just open the chat and try it."},
        {q: "Is it okay for daily work?", a: "Yes — the UI is designed to stay calm and practical."},
        {q: "Can I cancel anytime?", a: "Yes. Plans are flexible."},
    ];

    return (
        <section id="faq" className="home-section">
            <div className="home-section-inner">
                <div className="home-section-head">
                    <div className="home-kicker">Questions</div>
                    <h2 className="home-h2">FAQ</h2>
                </div>

                <div className="home-faq">
                    {faqs.map((f) => (
                        <details key={f.q} className="home-faq-item">
                            <summary>{f.q}</summary>
                            <div className="home-faq-body">{f.a}</div>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
}
