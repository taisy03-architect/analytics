import { useState } from "react";
import { SessionList } from "./components/SessionList";
import { Dashboard } from "./components/Dashboard";
import { InsightsView } from "./components/InsightsView";
import { ComponentAnalysisSection } from "./components/ComponentAnalysisSection";
import { EngagementView } from "./components/EngagementView";
import { ExperimentsView } from "./components/ExperimentsView";
import {
  snapshotCards,
  snapshotClusters,
  snapshotClusterDetails,
  snapshotInsights,
  snapshotReasons,
  snapshotSessions,
  snapshotStats,
} from "./dataSnapshot";

export interface Cluster {
  id: number;
  label: string | null;
  pain_point_summary: string | null;
  relevance_score: number | null;
  count: number;
  sampleQuestions: string[];
  created_at: string;
}

export interface ClusterDetailData extends Cluster {
  questions: Question[];
}

export interface Question {
  id: number;
  question: string;
  event_type: string;
  card_title: string | null;
  distance?: number;
}

export interface Session {
  id: string;
  total_events: number;
  total_questions: number;
  cards_viewed: string[];
  questions_asked: string[];
  follow_ups_clicked: number;
  calendly_opened: boolean;
  demo_booked: boolean;
  discount_activated: boolean;
  created_at: string;
  engagement_score?: number | null;
  converted?: boolean | null;
  follow_up_click_rate?: number | null;
  avg_events_per_minute?: number | null;
  most_viewed_card?: string | null;
  question_topics?: string[] | null;
}

export interface Stats {
  total: number;
  converted: number;
  notConverted: number;
  conversionRate: number;
  convertedAvg: FeatureAverages | null;
  notConvertedAvg: FeatureAverages | null;
  byTopic: Record<string, { total: number; converted: number; rate: number }>;
}

export interface FeatureAverages {
  avgEvents: number;
  avgQuestions: number;
  avgFollowUpClickRate: number;
  avgCardsViewed: number;
  avgEngagementScore: number;
  pctCalendlyOpened: number;
}

export interface Insight {
  id: number;
  insightType: string;
  title: string;
  description: string;
  supportingData: Record<string, unknown>;
}

export interface CardStat {
  card_title: string;
  total_events: number;
  unique_sessions: number;
  open_events: number;
  close_events: number;
  hover_events: number;
  questions: number;
  follow_ups: number;
  conversions: number;
  question_rate: number | null;
  conversion_rate: number | null;
  close_rate: number | null;
  updated_at: string;
}

export interface ReasonItem {
  reason: string;
  confidence: number; // 0-100
}

export interface ReasonsResponse {
  converted: ReasonItem[];
  notConverted: ReasonItem[];
}

type View =
  | "dashboard"
  | "components"
  | "sessions"
  | "engagement"
  | "experiments"
  | "insights";

export type PageFilter = "All Pages" | "Homepage" | "Pricing" | "Use Cases" | "Docs";

export const PAGE_FILTERS: PageFilter[] = [
  "All Pages",
  "Homepage",
  "Pricing",
  "Use Cases",
  "Docs",
];

function App() {
  const [clusters] = useState<Cluster[]>(snapshotClusters);
  const [sessions] = useState<Session[]>(snapshotSessions);
  const [stats] = useState<Stats | null>(snapshotStats);
  const [insights] = useState<Insight[]>(snapshotInsights);
  const [cards] = useState<CardStat[]>(snapshotCards);
  const [reasons] = useState<ReasonsResponse>(snapshotReasons);
  const [selectedCluster, setSelectedCluster] = useState<ClusterDetailData | null>(null);
  const [view, setView] = useState<View>("dashboard");
  const [pageFilter, setPageFilter] = useState<PageFilter>("All Pages");

  const fetchClusterDetail = (id: number) => {
    const detail = snapshotClusterDetails[id];
    if (detail) {
      setSelectedCluster(detail);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Session Analysis Dashboard (Snapshot)</h1>
        <div className="header-actions">
          <div className="view-toggle">
            <button
              className={view === "dashboard" ? "active" : ""}
              onClick={() => {
                setView("dashboard");
                setSelectedCluster(null);
              }}
            >
              Dashboard
            </button>
            <button
              className={view === "components" ? "active" : ""}
              onClick={() => {
                setView("components");
                setSelectedCluster(null);
              }}
            >
              Component Analytics
            </button>
            <button
              className={view === "engagement" ? "active" : ""}
              onClick={() => {
                setView("engagement");
                setSelectedCluster(null);
              }}
            >
              Engagement
            </button>
            <button
              className={view === "insights" ? "active" : ""}
              onClick={() => {
                setView("insights");
                setSelectedCluster(null);
              }}
            >
              Insights
            </button>
            <button
              className={view === "experiments" ? "active" : ""}
              onClick={() => {
                setView("experiments");
                setSelectedCluster(null);
              }}
            >
              Experiments
            </button>
          </div>
        </div>
      </header>

      {view === "dashboard" && stats && (
        <Dashboard
          stats={stats}
          cards={cards}
          reasons={reasons}
          pageFilter={pageFilter}
          onChangePageFilter={setPageFilter}
          onSeeRawData={() => {
            setView("sessions");
            setSelectedCluster(null);
          }}
        />
      )}

      {view === "components" && (
        <ComponentAnalysisSection pageFilter={pageFilter} onChangePageFilter={setPageFilter} />
      )}

      {view === "engagement" && (
        <EngagementView
          clusters={clusters}
          cards={cards}
          selectedCluster={selectedCluster}
          onSelectCluster={fetchClusterDetail}
          onBackFromCluster={() => setSelectedCluster(null)}
        />
      )}

      {view === "sessions" && <SessionList sessions={sessions} />}

      {view === "experiments" && <ExperimentsView />}

      {view === "insights" && (
        <InsightsView
          insights={insights}
          onGoToExperiments={() => {
            setView("experiments");
            setSelectedCluster(null);
          }}
        />
      )}
    </div>
  );
}

export default App;


