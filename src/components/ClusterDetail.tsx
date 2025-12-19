import type { ClusterDetailData } from "../App";

interface ClusterDetailProps {
  cluster: ClusterDetailData;
}

export function ClusterDetail({ cluster }: ClusterDetailProps) {
  const category = cluster.label || cluster.pain_point_summary || `Category ${cluster.id}`;

  return (
    <div className="cluster-detail">
      <div className="cluster-detail-header">
        <div>
          <div className="cluster-title-row">
            <h2>{category}</h2>
            {cluster.relevance_score !== null && (
              <span
                className="relevance-badge large"
                style={{
                  backgroundColor: `hsl(${(1 - cluster.relevance_score) * 120}, 70%, 45%)`,
                }}
              >
                {(cluster.relevance_score * 100).toFixed(0)}% relevance
              </span>
            )}
          </div>
          <span className="cluster-count">{cluster.questions.length} questions</span>
        </div>
      </div>

      {cluster.pain_point_summary && (
        <div className="pain-point-box">
          <h4>Pain Point</h4>
          <p>{cluster.pain_point_summary}</p>
        </div>
      )}

      <div className="questions-list">
        {cluster.questions.map((q) => (
          <div key={q.id} className="question-item">
            <span className="question-text">{q.question}</span>
            {q.card_title && <span className="question-card">{q.card_title}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}


