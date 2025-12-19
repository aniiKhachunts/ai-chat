type PromptItem = { id: string; title: string; text: string }
type PromptCategory = { id: string; title: string; subtitle?: string; items: PromptItem[] }

export function Categories({
                               categories,
                               onOpenCategory,
                           }: {
    categories: PromptCategory[]
    onOpenCategory: (id: string) => void
}) {
    return (
        <section className="home-section" id="templates">
            <div className="home-section-inner home-container">
                <div className="home-section-head">
                    <div className="home-kicker">Templates</div>
                    <h2 className="home-h2">Start faster with ready prompts</h2>
                </div>

                <div className="home-categories">
                    {categories.map((c) => (
                        <div key={c.id} className="home-category">
                            <div className="home-category-top">
                                <div>
                                    <div className="home-category-title">{c.title}</div>
                                    {c.subtitle ? <div className="home-category-sub">{c.subtitle}</div> : null}
                                </div>

                                <button
                                    type="button"
                                    className="home-category-open"
                                    onClick={() => onOpenCategory(c.id)}
                                >
                                    Open
                                    <span aria-hidden="true">→</span>
                                </button>
                            </div>

                            {/*<div className="home-category-list">*/}
                            {/*    {c.items.slice(0, 2).map((p) => (*/}
                            {/*        <button*/}
                            {/*            key={p.id}*/}
                            {/*            type="button"*/}
                            {/*            className="home-category-item"*/}
                            {/*            onClick={() => onOpenCategory(c.id)}*/}
                            {/*            title="Open this category"*/}
                            {/*        >*/}
                            {/*            <span className="home-category-item-dot" />*/}
                            {/*            <span className="home-category-item-title">{p.title}</span>*/}
                            {/*        </button>*/}
                            {/*    ))}*/}
                            {/*</div>*/}
                        </div>
                    ))}
                </div>

                <div className="home-category-foot">
                    <a className="home-ghost big" href="/prompts">
                        Browse full library
                    </a>
                </div>
            </div>
        </section>
    )
}
