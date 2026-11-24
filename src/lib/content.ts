export const NAV_LINKS = [
  { href: "#services", label: "Services" },
  { href: "#process", label: "Process" },
  { href: "#difference", label: "Why us" },
  { href: "#savings", label: "Savings" },
  { href: "#industries", label: "Industries" },
  { href: "#faq", label: "FAQ" },
];

export const SECTION_DOTS = [
  { id: "hero", label: "Intro" },
  { id: "manifesto", label: "Belief" },
  { id: "services", label: "Services" },
  { id: "process", label: "Process" },
  { id: "difference", label: "Why us" },
  { id: "savings", label: "Savings" },
  { id: "industries", label: "Industries" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
];

export const MARQUEE_ROWS: { items: string[]; reverse?: boolean }[] = [
  {
    items: [
      "Software Engineers",
      "Nurses & Allied Health",
      "Sales Executives",
      "Customer Support",
      "Data Analysts",
      "Finance & Accounting",
    ],
  },
  {
    reverse: true,
    items: [
      "Warehouse & Logistics",
      "Product Managers",
      "Technicians",
      "HR Generalists",
      "Marketing Leads",
      "Operations",
    ],
  },
];

export const STATS = [
  { value: 48, suffix: "hrs", label: "to first qualified shortlist" },
  { value: 92, suffix: "%", label: "offer acceptance rate" },
  { value: 40, suffix: "%", label: "lower cost per hire" },
  { value: 25, suffix: "+", label: "industries served" },
];

export const SERVICES = [
  {
    n: "01",
    icon: "layers",
    title: "Full-cycle RPO",
    text: "We become your talent team: planning, sourcing, screening, interviews, offers and onboarding, all under your brand.",
    tags: ["Dedicated pod", "Your ATS", "Weekly reviews"],
    cta: "Explore",
    hot: true,
  },
  {
    n: "02",
    icon: "users",
    title: "Project & volume hiring",
    text: "Opening a site, launching a product or ramping for peak season? We staff up fast and wind down cleanly.",
    tags: ["Seasonal", "New sites", "Campus"],
    cta: "Plan a project",
  },
  {
    n: "03",
    icon: "search",
    title: "On-demand recruiters",
    text: "Embed senior recruiters into your team for as long as you need, without permanent headcount.",
    tags: ["Flexible", "Specialist", "Fast start"],
    cta: "Add capacity",
  },
  {
    n: "04",
    icon: "award",
    title: "Executive search",
    text: "Confidential, research-led searches for leadership roles, backed by structured assessment.",
    tags: ["Confidential", "Mapping", "Assessment"],
    cta: "Start a search",
  },
  {
    n: "05",
    icon: "mega",
    title: "Employer branding",
    text: "Career pages, outreach and candidate communication that make exceptional people want to say yes.",
    tags: ["Career site", "Outreach", "Experience"],
    cta: "Shape your brand",
  },
  {
    n: "06",
    icon: "chart",
    title: "Talent analytics",
    text: "Time-to-fill, source quality, funnel drop-off and cost per hire in one clear dashboard.",
    chart: [36, 52, 44, 68, 60, 90],
    cta: "See a sample",
  },
];

export const STEPS = [
  {
    title: "Discover",
    short: "Understand your needs",
    text: "We start by learning how your business works: roles, culture, hiring managers and the outcomes you care about. Then we build a hiring plan with clear timelines and targets.",
    points: [
      "Intake call with every hiring manager",
      "Role scorecards and ideal candidate profiles",
      "Workforce plan with milestones",
    ],
    time: "Typically 2–3 days",
    effort: "Your effort: one kickoff call",
  },
  {
    title: "Source",
    short: "Find the right people",
    text: "We go beyond job boards. Our recruiters tap talent pools, referrals, communities and direct outreach to reach people who aren't even looking yet.",
    points: [
      "Multi-channel sourcing and targeted outreach",
      "Always-on talent pools for repeat roles",
      "Job ads written to attract, not just inform",
    ],
    time: "Starts day 3",
    effort: "Your effort: none",
  },
  {
    title: "Screen",
    short: "Separate signal from noise",
    text: "Every candidate goes through the same structured screening: skills, motivation, expectations and fit. You only meet people worth your time.",
    points: [
      "Structured phone and video screens",
      "Skills assessments where they add value",
      "Written candidate summaries",
    ],
    time: "Rolling, within 48 hrs",
    effort: "Your effort: none",
  },
  {
    title: "Interview",
    short: "Shortlist and coordinate",
    text: "We deliver a concise shortlist and handle all the scheduling. Feedback flows straight back to us so the next round gets sharper.",
    points: [
      "Calendar coordination for every panel",
      "Interview guides for your managers",
      "Candidates kept warm and informed",
    ],
    time: "Shortlist in ~48 hrs",
    effort: "Your effort: interviews and feedback",
  },
  {
    title: "Offer",
    short: "Close with confidence",
    text: "We manage compensation conversations, references, background checks and counter-offers, so great candidates don't slip away at the last step.",
    points: [
      "Market-informed offer guidance",
      "Reference and background verification",
      "Counter-offer handling",
    ],
    time: "Typically 3–5 days",
    effort: "Your effort: approve the offer",
  },
  {
    title: "Onboard",
    short: "Set them up to win",
    text: "Hiring doesn't end at \"yes\". We keep new joiners engaged before day one and check in through the first 90 days. Then we loop back to step one for your next role.",
    points: [
      "Pre-boarding and day-one readiness",
      "30 / 60 / 90-day check-ins",
      "Retention insights fed back into sourcing",
    ],
    time: "First 90 days",
    effort: "∞ Loops back to step 1",
  },
];

export const COMPARE = {
  inhouse: [
    ["Recruiters stretched thin", "Juggling dozens of roles at once."],
    ["Slow to ramp up", "Hiring spikes mean months of lead time."],
    ["Uneven candidate experience", "Silence and delays cost you great people."],
    ["Fixed overhead", "Salaries and tools whether you hire or not."],
  ],
  infiniti: [
    ["A dedicated team, focused on you", "Specialist recruiters who learn your business."],
    ["Scale in days, not months", "Flex capacity up or down as needs change."],
    ["A consistent, branded experience", "Every candidate informed at every step."],
    ["Pay for the hiring you need", "Predictable, variable cost that tracks demand."],
  ],
};

export const INDUSTRIES = [
  { icon: "cpu", title: "Technology", text: "Engineering, product, data, security" },
  { icon: "heart", title: "Healthcare", text: "Clinical, allied health, administration" },
  { icon: "bank", title: "Banking & Finance", text: "Risk, compliance, operations, sales" },
  { icon: "cart", title: "Retail & E-commerce", text: "Stores, merchandising, growth" },
  { icon: "factory", title: "Manufacturing", text: "Plant, quality, engineering, supply" },
  { icon: "truck", title: "Logistics", text: "Warehousing, fleet, planning" },
  { icon: "phone2", title: "BPO & Support", text: "Voice, chat, quality, team leads" },
  { icon: "users", title: "Professional Services", text: "Consulting, legal, HR, marketing" },
];

export const FAQ = [
  {
    q: "What is recruitment process outsourcing (RPO)?",
    a: "RPO means handing some or all of your recruitment function to a specialist partner. infiniti acts as an extension of your HR team, managing sourcing, screening, interviews and onboarding using your brand and tools.",
  },
  {
    q: "How is this different from a staffing agency?",
    a: "Agencies typically charge a fee per placement and work on your roles alongside many other clients. With RPO, a dedicated team is embedded in your process, aligned to your goals and accountable for results across your whole hiring plan.",
  },
  {
    q: "How quickly can you start?",
    a: "Most engagements kick off within a week of the intake call. For urgent roles, we can begin sourcing the same week while the wider plan is finalised.",
  },
  {
    q: "Can we outsource only part of our hiring?",
    a: "Yes. You can choose full-cycle RPO, project-based hiring, on-demand recruiters, or specific stages such as sourcing and screening, and change the model as your needs evolve.",
  },
  {
    q: "Will candidates know they're talking to infiniti?",
    a: "That's up to you. Our recruiters can represent your company directly, using your brand, email domains and tone of voice, so candidates experience one consistent team.",
  },
];
