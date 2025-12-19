import { Link } from "react-router-dom"

export function FinalCta() {
    return (
        <section className="home-final">
            <div className="home-final-inner home-container">

                <div className="home-final-cta">
                    <Link className="home-cta-mega" to="/chat">
                        <span className="home-cta-mega-bg" aria-hidden="true" />
                        <span className="home-cta-mega-shine" aria-hidden="true" />
                        <span className="home-cta-mega-text">Open Chat</span>
                        <span className="home-cta-mega-icon" aria-hidden="true">→</span>
                    </Link>

                    <a className="home-ghost big" href="/prompts">
                        Explore prompts
                    </a>
                </div>
            </div>

            <footer className="home-footer home-container">
                <span>© {new Date().getFullYear()} AI Chat</span>
                <div className="home-footer-links">
                    <a href="/prompts">Prompts</a>
                    <a href="#pricing">Pricing</a>
                    <a href="#top">Top</a>
                </div>
            </footer>
        </section>
    )
}
