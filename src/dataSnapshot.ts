import type {
  CardStat,
  Cluster,
  ClusterDetailData,
  FeatureAverages,
  Insight,
  ReasonsResponse,
  Session,
  Stats,
} from "./App";

const now = new Date().toISOString();

export const snapshotStats: Stats = {
  total: 134,
  converted: 31,
  notConverted: 103,
  conversionRate: 23.1,
  convertedAvg: {
    avgEvents: 42.3,
    avgQuestions: 2.1,
    avgFollowUpClickRate: 0.12,
    avgCardsViewed: 6.4,
    avgEngagementScore: 78.2,
    pctCalendlyOpened: 38.7,
  } as FeatureAverages,
  notConvertedAvg: {
    avgEvents: 18.8,
    avgQuestions: 0.7,
    avgFollowUpClickRate: 0.02,
    avgCardsViewed: 2.6,
    avgEngagementScore: 41.9,
    pctCalendlyOpened: 6.8,
  } as FeatureAverages,
  byTopic: {
    pricing: { total: 44, converted: 15, rate: 34.1 },
    integrations: { total: 29, converted: 6, rate: 20.7 },
    security: { total: 18, converted: 4, rate: 22.2 },
    onboarding: { total: 22, converted: 3, rate: 13.6 },
  },
};

export const snapshotCards: CardStat[] = [
  {
    card_title: "Customer Success Teams",
    total_events: 240,
    unique_sessions: 29,
    open_events: 29,
    close_events: 10,
    hover_events: 29,
    questions: 0,
    follow_ups: 0,
    conversions: 9,
    question_rate: 0,
    conversion_rate: 31.0,
    close_rate: 34.5,
    updated_at: now,
  },
  {
    card_title: "Sales Leaders & Teams",
    total_events: 265,
    unique_sessions: 34,
    open_events: 34,
    close_events: 12,
    hover_events: 34,
    questions: 0,
    follow_ups: 0,
    conversions: 8,
    question_rate: 0,
    conversion_rate: 23.5,
    close_rate: 35.2,
    updated_at: now,
  },
  {
    card_title: "Founders & Executives",
    total_events: 240,
    unique_sessions: 32,
    open_events: 32,
    close_events: 11,
    hover_events: 32,
    questions: 0,
    follow_ups: 0,
    conversions: 7,
    question_rate: 0,
    conversion_rate: 21.9,
    close_rate: 34.4,
    updated_at: now,
  },
  {
    card_title: "Marketing Leaders",
    total_events: 255,
    unique_sessions: 39,
    open_events: 39,
    close_events: 18,
    hover_events: 39,
    questions: 0,
    follow_ups: 0,
    conversions: 6,
    question_rate: 0,
    conversion_rate: 15.4,
    close_rate: 46.1,
    updated_at: now,
  },
  {
    card_title: "Developers & Integrations",
    total_events: 210,
    unique_sessions: 27,
    open_events: 27,
    close_events: 9,
    hover_events: 24,
    questions: 3,
    follow_ups: 2,
    conversions: 5,
    question_rate: 1.2,
    conversion_rate: 18.5,
    close_rate: 33.3,
    updated_at: now,
  },
  {
    card_title: "Security & Compliance",
    total_events: 180,
    unique_sessions: 22,
    open_events: 22,
    close_events: 8,
    hover_events: 20,
    questions: 4,
    follow_ups: 1,
    conversions: 4,
    question_rate: 1.8,
    conversion_rate: 18.2,
    close_rate: 36.4,
    updated_at: now,
  },
  {
    card_title: "Pricing & Plans",
    total_events: 260,
    unique_sessions: 31,
    open_events: 31,
    close_events: 12,
    hover_events: 28,
    questions: 5,
    follow_ups: 2,
    conversions: 7,
    question_rate: 1.9,
    conversion_rate: 22.6,
    close_rate: 38.7,
    updated_at: now,
  },
  {
    card_title: "Onboarding Experience",
    total_events: 195,
    unique_sessions: 25,
    open_events: 25,
    close_events: 7,
    hover_events: 21,
    questions: 2,
    follow_ups: 1,
    conversions: 4,
    question_rate: 1.0,
    conversion_rate: 16.0,
    close_rate: 28.0,
    updated_at: now,
  },
];

export const snapshotReasons: ReasonsResponse = {
  converted: [
    { reason: "Clear trial framing reduces perceived commitment risk.", confidence: 66 },
    { reason: "Pricing flexibility / tiers address affordability concerns.", confidence: 62 },
    { reason: "Concrete examples make value immediately obvious.", confidence: 58 },
    { reason: "Strong social proof creates trust early.", confidence: 44 },
    { reason: "Simple CTA language increases follow-through.", confidence: 38 },
  ],
  notConverted: [
    { reason: "Confusion about what the product actually does.", confidence: 69 },
    { reason: "Pricing ambiguity leads to hesitation.", confidence: 62 },
    { reason: "Not enough proof of differentiation vs alternatives.", confidence: 46 },
    { reason: "Too much copy / cognitive load on first scroll.", confidence: 39 },
    { reason: "Missing answers for common objections.", confidence: 33 },
  ],
};

export const snapshotClusters: Cluster[] = [
  {
    id: 1,
    label: "Pricing flexibility inquiries",
    pain_point_summary:
      "Visitors are concerned pricing is a barrier and want discounts or flexible options.",
    relevance_score: 0.9,
    count: 23,
    sampleQuestions: ["Do you have discounts?", "Can I pay monthly?", "Is there a free trial?"],
    created_at: now,
  },
  {
    id: 2,
    label: "Product clarity & differentiation",
    pain_point_summary: "Visitors want a simpler explanation of what you do and why you're different.",
    relevance_score: 0.82,
    count: 17,
    sampleQuestions: ["How is this different?", "What does this replace?", "Who is it for?"],
    created_at: now,
  },
  {
    id: 3,
    label: "Security / compliance",
    pain_point_summary:
      "Visitors need reassurance on security posture and data handling before converting.",
    relevance_score: 0.74,
    count: 11,
    sampleQuestions: ["Do you support SOC2?", "Where is data stored?", "SSO available?"],
    created_at: now,
  },
  {
    id: 4,
    label: "Implementation & onboarding",
    pain_point_summary:
      "Visitors ask how hard it is to deploy and how long it takes to see value.",
    relevance_score: 0.68,
    count: 9,
    sampleQuestions: ["How long to onboard?", "Do you have docs?", "Do you integrate with X?"],
    created_at: now,
  },
];

const cluster1Questions = Array.from({ length: 23 }).map((_, idx) => ({
  id: 1000 + idx,
  question:
    idx % 3 === 0
      ? "Do you offer discounts for annual plans?"
      : idx % 3 === 1
      ? "Is there a free trial or pilot?"
      : "Can I pay monthly / flexible terms?",
  event_type: "question_submitted",
  card_title: "Pricing",
}));

const genericClusterQuestions = (id: number): ClusterDetailData => ({
  id,
  label: `Category ${id}`,
  pain_point_summary: "Mock cluster detail (no backend)",
  relevance_score: 0.65,
  count: 5,
  sampleQuestions: [],
  created_at: now,
  questions: Array.from({ length: 5 }).map((_, idx) => ({
    id: 2000 + idx,
    question: "Mock question",
    event_type: "question_submitted",
    card_title: null,
  })),
});

export const snapshotClusterDetails: Record<number, ClusterDetailData> = {
  1: {
    id: 1,
    label: "Pricing flexibility inquiries",
    pain_point_summary:
      "Visitors are concerned pricing is a barrier and want discounts or flexible options.",
    relevance_score: 0.9,
    count: 23,
    sampleQuestions: [],
    created_at: now,
    questions: cluster1Questions,
  },
  2: genericClusterQuestions(2),
  3: genericClusterQuestions(3),
  4: genericClusterQuestions(4),
};

export const snapshotInsights: Insight[] = [
  {
    id: 101,
    insightType: "recommendation",
    title: "Simplify Explanation Language",
    description:
      "Shorten the hero copy and replace jargon with one concrete outcome + one proof point.",
    supportingData: {
      workflow: "cluster_recommendations",
      category: "Tone changes",
      confidence: 72,
      actions: [
        { type: "Rewrite", detail: "Replace abstract claims with one concrete outcome." },
        { type: "Reduce", detail: "Cut hero copy to ~2 short lines + one CTA." },
      ],
    },
  },
  {
    id: 102,
    insightType: "recommendation",
    title: "Add Pricing Clarity",
    description:
      "Add a simple 'starting at' price + an annual discount note near the first pricing mention.",
    supportingData: {
      workflow: "cluster_recommendations",
      category: "Add more information",
      confidence: 64,
      actions: [{ type: "Add", detail: "Add a small pricing clarity callout." }],
    },
  },
  {
    id: 103,
    insightType: "recommendation",
    title: "Modernize the Social Proof Component",
    description:
      "Swap the logo wall for 2–3 short, specific one-liners and a compact star-rating badge to reduce visual noise and increase trust.",
    supportingData: {
      workflow: "cluster_recommendations",
      category: "Component changes",
      confidence: 69,
      actions: [
        { type: "Replace", detail: "Replace the logo grid with 2–3 concise proof bullets." },
        { type: "Add", detail: "Add a small 4.7★ rating pill near the primary CTA." },
      ],
    },
  },
  {
    id: 104,
    insightType: "recommendation",
    title: "Clarify Next Steps in the CTA Rail",
    description:
      "Add a 2-step hint below the primary CTA so users know what happens after clicking (time-to-value + what to expect).",
    supportingData: {
      workflow: "cluster_recommendations",
      category: "Add more information",
      confidence: 61,
      actions: [
        { type: "Add", detail: "Add 'Book in 2 clicks · 15 min' microcopy under the CTA." },
        { type: "Add", detail: "Mention what’s covered: demo, pricing, and security FAQs." },
      ],
    },
  },
  {
    id: 105,
    insightType: "recommendation",
    title: "Tighten FAQ Tone",
    description:
      "Rewrite top FAQ entries into short, declarative answers with one metric or example each to speed scanning.",
    supportingData: {
      workflow: "cluster_recommendations",
      category: "Tone changes",
      confidence: 58,
      actions: [
        { type: "Rewrite", detail: "Lead with the answer, then one metric or example." },
        { type: "Reduce", detail: "Keep each FAQ answer to ~2 sentences max." },
      ],
    },
  },
  {
    id: 201,
    insightType: "pattern",
    title: "High intent sessions ask fewer questions but click follow-ups",
    description:
      "Converted sessions show fewer questions yet higher follow-up clicks, suggesting clearer CTA paths outperform deep Q&A.",
    supportingData: {},
  },
];

export const snapshotSessions: Session[] = [
  {
    id: "sess_mock_1",
    total_events: 52,
    total_questions: 1,
    cards_viewed: ["Pricing", "Founders & Executives"],
    questions_asked: ["Is there a trial?"],
    follow_ups_clicked: 1,
    calendly_opened: true,
    demo_booked: true,
    discount_activated: false,
    created_at: now,
    converted: true,
  },
  {
    id: "sess_mock_2",
    total_events: 14,
    total_questions: 0,
    cards_viewed: ["Pricing"],
    questions_asked: [],
    follow_ups_clicked: 0,
    calendly_opened: false,
    demo_booked: false,
    discount_activated: false,
    created_at: now,
    converted: false,
  },
];


