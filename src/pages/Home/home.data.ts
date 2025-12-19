export const LOGOS = [
    { name: "OpenAI", logo: "/logos/openai.webp" },
    { name: "Claude", logo: "/logos/claude.png" },
    { name: "Gemini", logo: "/logos/gemini.png" },
    { name: "DeepSeek", logo: "/logos/deepseek.png" }
] as const

export const PLANS = [
    {
        name: "Free",
        price: "$0",
        note: "For trying the workspace",
        perks: ["Chat model access", "Prompt library", "Clean history + basic UI"],
        featured: false,
        cta: "Start free"
    },
    {
        name: "Pro",
        price: "$9",
        note: "For daily work and creators",
        perks: ["Video models (text + image)", "Better limits + faster workflow", "Priority UI updates"],
        featured: true,
        cta: "Go Pro"
    },
    {
        name: "Team",
        price: "$19",
        note: "For shared workflows",
        perks: ["Shared spaces", "Admin controls", "Team prompt templates", "Centralized context"],
        featured: false,
        cta: "Contact"
    }
] as const

export const FAQS = [
    { q: "Can I use video models too?", a: "Yes — switch models and choose text-to-video or image+text modes." },
    { q: "Do I need setup to start?", a: "No. Just open the chat and try it." },
    { q: "Is it okay for daily work?", a: "Yes — the UI is designed to stay calm and practical." },
    { q: "Can I cancel anytime?", a: "Yes. Plans are flexible." }
] as const
