import type { Cluster } from "../App";

interface ClusterListProps {
  clusters: Cluster[];
  onSelect: (id: number) => void;
}

export function ClusterList({ clusters, onSelect }: ClusterListProps) {
  return (
    <div>
      <div style={{ marginBottom: "1rem" }}>
        <h2 style={{ fontSize: "1.25rem", color: "#020617", letterSpacing: "-0.02em" }}>
          What are people asking?
        </h2>
        <p style={{ color: "#6b7280", fontSize: "0.85rem", marginTop: "0.25rem" }}>
          Browse categories—click one to see all questions in that bucket.
        </p>
      </div>

      <div className="clusters-grid">
        {clusters.map((cluster) => {
          const category = cluster.label || cluster.pain_point_summary || `Category ${cluster.id}`;

          return (
            <div
              key={cluster.id}
              className="cluster-card"
              onClick={() => onSelect(cluster.id)}
            >
              <div className="cluster-header">
                <span className="cluster-title">{category}</span>
                <div className="cluster-meta">
                  {cluster.relevance_score !== null && (
                    <span
                      className="relevance-badge"
                      style={{
                        backgroundColor: `hsl(${(1 - cluster.relevance_score) * 120}, 70%, 45%)`,
                      }}
                    >
                      {(cluster.relevance_score * 100).toFixed(0)}% confidence
                    </span>
                  )}
                  <span className="cluster-count">{cluster.count} questions</span>
                </div>
              </div>
              {cluster.pain_point_summary && (
                <div className="pain-point-summary">
                  {cluster.pain_point_summary}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}


