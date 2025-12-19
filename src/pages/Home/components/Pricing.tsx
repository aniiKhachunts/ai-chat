import { Link } from "react-router-dom"

type Plan = {
    name: string
    price: string
    note?: string
    perks: string[]
    featured: boolean
    cta: string
}

export function Pricing({ plans }: { plans: Plan[] }) {
    return (
        <section id="pricing" className="home-section">
            <div className="home-section-inner home-container">
                <div className="home-section-head">
                    <div className="home-kicker">Pricing</div>
                    <h2 className="home-h2">Choose your plan</h2>
                </div>

                <div className="home-pricing">
                    {plans.map((p) => (
                        <div key={p.name} className={p.featured ? "home-plan featured" : "home-plan"}>
                            <div className="home-plan-top">
                                <div>
                                    <div className="home-plan-name">{p.name}</div>
                                    {p.note ? <div className="home-plan-note">{p.note}</div> : null}
                                </div>

                                <div className="home-plan-price">
                                    {p.price}
                                    <span>/mo</span>
                                </div>
                            </div>

                            <ul className="home-plan-list">
                                {p.perks.map((x) => (
                                    <li key={x}>
                                        <span className="home-dot" />
                                        {x}
                                    </li>
                                ))}
                            </ul>

                            <div className="home-plan-cta">
                                <Link
                                    className={p.featured ? "home-primary big full" : "home-ghost big full"}
                                    to="/chat"
                                >
                                    {p.cta}
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
