export function AiMarquee({
                              logos,
                          }: {
    logos: { name: string; logo: string }[]
}) {
    const items = logos.concat(logos)

    return (
        <div className="ai-marquee" aria-label="Supported AI models">
            <div className="ai-marquee-track">
                {items.map((ai, i) => (
                    <div key={`${ai.name}-${i}`} className="ai-marquee-item" title={ai.name}>
                        <img src={ai.logo} alt={ai.name} width={120} height={120} decoding="async" />
                    </div>
                ))}
            </div>
        </div>
    )
}
