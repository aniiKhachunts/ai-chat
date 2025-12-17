export type PromptItem = {
    id: string
    title: string
    text: string
}

export type PromptCategory = {
    category: string
    items: PromptItem[]
}

export const PROMPTS = [
    {
        id: "marketing",
        title: "Marketing",
        subtitle: "Content, growth, positioning",
        items: [
            {
                id: "marketing-content-plan",
                title: "Monthly content plan",
                text: `You are a senior marketing strategist with 10+ years of experience.

Create a detailed content plan for one month for a brand in the following niche:
- Niche:
- Target audience:
- Platform (Instagram, TikTok, X, LinkedIn):
- Goal (leads, awareness, sales):

Requirements:
- 20–30 posts
- Content mix: educational, entertaining, promotional, personal
- Suggested hooks for each post
- Content formats (reels, carousels, posts)
- CTA suggestions

Present the result as a clear table.`
            },
            {
                id: "marketing-uvp",
                title: "Unique value proposition",
                text: `Act as a brand strategist.

Help me formulate a strong unique value proposition.

Input:
- Product or service:
- Target audience:
- Main competitors:
- Key strengths:

Output:
- One clear UVP sentence
- Short tagline
- 3 supporting value points
- One version in simple language`
            }
        ]
    },

    {
        id: "sales",
        title: "Sales",
        subtitle: "Scripts, offers, objections",
        items: [
            {
                id: "sales-cold-message",
                title: "Cold outreach message",
                text: `You are a B2B sales expert.

Write a short cold outreach message for:
- Product:
- Audience:
- Platform (email / LinkedIn / DM):

Rules:
- Friendly, non-pushy tone
- Under 120 words
- Clear value in first 2 lines
- Soft CTA at the end`
            },
            {
                id: "sales-objections",
                title: "Handle objections",
                text: `Act as a senior sales manager.

List the top 5 objections for this offer:
- Offer:
- Price range:
- Audience:

For each objection:
- Why it appears
- Best response
- One short reply example`
            }
        ]
    },

    {
        id: "founders",
        title: "Founders",
        subtitle: "Strategy, vision, planning",
        items: [
            {
                id: "founder-business-plan",
                title: "Lean business plan",
                text: `You are a startup advisor.

Create a lean business plan based on:
- Idea:
- Target market:
- Revenue model:
- Stage (idea / MVP / growth):

Include:
- Problem
- Solution
- Market
- Monetization
- Risks
- First 90-day action plan`
            },
            {
                id: "founder-market-analysis",
                title: "Market analysis",
                text: `Act as a market analyst.

Analyze this market:
- Industry:
- Geography:
- Target customer:

Provide:
- Market size
- Key trends
- Main competitors
- Opportunities
- Risks`
            }
        ]
    },

    {
        id: "managers",
        title: "Managers",
        subtitle: "Processes, reports, planning",
        items: [
            {
                id: "manager-weekly-report",
                title: "Weekly report",
                text: `You are an operations manager.

Create a clear weekly report template that includes:
- Goals
- Completed tasks
- Blockers
- Metrics
- Priorities for next week

Make it easy to copy and reuse.`
            },
            {
                id: "manager-meeting-summary",
                title: "Meeting summary",
                text: `Summarize this meeting in a professional format.

Input:
- Notes or transcript:

Output:
- Key decisions
- Action items
- Owners
- Deadlines`
            }
        ]
    },

    {
        id: "hr",
        title: "HR & Recruiting",
        subtitle: "Hiring, interviews, onboarding",
        items: [
            {
                id: "hr-job-description",
                title: "Job description",
                text: `You are an HR partner.

Write a clear job description for:
- Role:
- Level:
- Tech stack or skills:
- Team size:

Include:
- Responsibilities
- Requirements
- Nice-to-haves
- Benefits`
            },
            {
                id: "hr-interview-questions",
                title: "Interview questions",
                text: `Create structured interview questions for:
- Role:
- Seniority level:

Include:
- Technical questions
- Behavioral questions
- Red flags to watch for`
            }
        ]
    },

    {
        id: "analytics",
        title: "Analytics",
        subtitle: "Data, insights, decisions",
        items: [
            {
                id: "analytics-insights",
                title: "Extract insights from data",
                text: `Act as a data analyst.

Based on this data:
- Dataset description:
- Metrics:

Provide:
- Key insights
- Patterns
- Anomalies
- Recommendations`
            },
            {
                id: "analytics-dashboard",
                title: "Dashboard structure",
                text: `Design a dashboard structure for:
- Business type:
- Main KPI goals:

List:
- Core metrics
- Charts
- Update frequency`
            }
        ]
    },

    {
        id: "creators",
        title: "Creators",
        subtitle: "Ideas, scripts, storytelling",
        items: [
            {
                id: "creator-video-ideas",
                title: "Video ideas",
                text: `You are a content creator coach.

Generate 15 short-form video ideas for:
- Niche:
- Platform:
- Audience level:

For each idea:
- Hook
- Topic
- Format`
            },
            {
                id: "creator-script",
                title: "Short video script",
                text: `Write a 30–45 second script for a short video.

Topic:
Audience:
Tone (educational / emotional / bold):

Include:
- Hook
- Main message
- CTA`
            }
        ]
    },

    {
        id: "developers",
        title: "Developers",
        subtitle: "Code, architecture, reviews",
        items: [
            {
                id: "dev-code-review",
                title: "Code review",
                text: `You are a senior software engineer.

Review the following code:
- Language:
- Code:

Provide:
- Issues
- Improvements
- Best practices
- Cleaner version if needed`
            },
            {
                id: "dev-system-design",
                title: "System design",
                text: `Design a system for this product:
- Description:
- Users scale:
- Key features:

Include:
- Architecture
- Tech stack
- Risks`
            }
        ]
    }
]
