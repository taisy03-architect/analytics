import { useState } from "react";
import type { CardStat, Cluster, ClusterDetailData } from "../App";
import { ClusterDetail } from "./ClusterDetail";
import { ClusterList } from "./ClusterList";
import { CardsView } from "./CardsView";

type EngagementTab = "clusters" | "cards";

interface EngagementViewProps {
  clusters: Cluster[];
  cards: CardStat[];
  selectedCluster: ClusterDetailData | null;
  pipelineRunning?: boolean;
  onSelectCluster: (id: number) => void;
  onBackFromCluster: () => void;
}

export function EngagementView({
  clusters,
  cards,
  selectedCluster,
  pipelineRunning,
  onSelectCluster,
  onBackFromCluster,
}: EngagementViewProps) {
  const [tab, setTab] = useState<EngagementTab>("clusters");

  return (
    <div className="engagement-view">
      <div className="engagement-subnav">
        <button
          className={tab === "clusters" ? "active" : ""}
          onClick={() => {
            setTab("clusters");
          }}
        >
          Questions
        </button>
        <button
          className={tab === "cards" ? "active" : ""}
          onClick={() => {
            setTab("cards");
          }}
        >
          Cards
        </button>
      </div>

      {tab === "clusters" && selectedCluster && (
        <div className="engagement-back-row">
          <button className="back-button" onClick={onBackFromCluster}>
            <span aria-hidden="true">←</span>
            Back to categories
          </button>
        </div>
      )}

      {tab === "clusters" ? (
        clusters.length === 0 && !pipelineRunning ? (
          <div className="empty-state">
            <p>No clusters found. Run the pipeline to generate clusters.</p>
          </div>
        ) : selectedCluster ? (
          <ClusterDetail cluster={selectedCluster} />
        ) : (
          <ClusterList clusters={clusters} onSelect={onSelectCluster} />
        )
      ) : (
        <CardsView cards={cards} />
      )}
    </div>
  );
}


