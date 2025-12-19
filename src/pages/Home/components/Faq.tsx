type FaqItem = { q: string; a: string }

export function Faq({ faqs }: { faqs: FaqItem[] }) {
    return (
        <section id="faq" className="home-section">
            <div className="home-section-inner home-container">
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
    )
}
