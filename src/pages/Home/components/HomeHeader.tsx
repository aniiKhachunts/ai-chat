import { Link } from "react-router-dom"

export function HomeHeader() {
    return (
        <header className="home-header">
            <div className="home-header-inner home-container">
                <a className="home-brand" href="#top">
                    <span className="home-logo" />
                    <span className="home-brand-text">AI Chat</span>
                </a>

                <nav className="home-nav">
                    <a className="home-nav-link" href="/prompts">Prompts</a>
                    <a className="home-nav-link" href="#pricing">Pricing</a>
                    <a className="home-nav-link" href="#faq">Questions</a>
                </nav>

                <div className="home-actions">
                    <Link className="home-primary" to="/chat">Start</Link>
                </div>
            </div>
        </header>
    )
}
