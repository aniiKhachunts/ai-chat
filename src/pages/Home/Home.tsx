import "./home.css"
import { useNavigate } from "react-router-dom"
import { PROMPTS } from "../../data/prompts"
import { LOGOS, PLANS, FAQS } from "./home.data"
import { HomeHeader } from "./components/HomeHeader"
import { Hero } from "./components/Hero"
import { AiMarquee } from "./components/AiMarquee"
import { Categories } from "./components/Categories"
import { Pricing } from "./components/Pricing"
import { Faq } from "./components/Faq"
import { FinalCta } from "./components/FinalCta"

export default function Home() {
    const navigate = useNavigate()

    return (
        <div className="home">
            <HomeHeader />

            <main>
                <Hero onSubmit={(v) => navigate("/chat", { state: { initialPrompt: v } })} />

                <div className="home-container">
                    <AiMarquee logos={[...LOGOS]} />
                </div>

                <Categories
                    categories={PROMPTS}
                    onOpenCategory={(id) => navigate(`/prompts#${id}`)}
                />

                <Pricing plans={[...PLANS]} />
                <Faq faqs={[...FAQS]} />
                <FinalCta />
            </main>
        </div>
    )
}
