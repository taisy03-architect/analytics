import { useEffect, useMemo, useState } from "react";
import type { Insight } from "../App";

interface InsightsViewProps {
  insights: Insight[];
  onGoToExperiments?: () => void;
}

export function InsightsView({ insights, onGoToExperiments }: InsightsViewProps) {
  const initial = useMemo(() => {
    return insights.map((i: any) => ({
      id: i.id,
      insightType: i.insightType ?? i.insight_type ?? "unknown",
      title: i.title,
      description: i.description,
      supportingData: i.supportingData ?? i.supporting_data ?? {},
    })) as Array<{
      id: number;
      insightType: string;
      title: string;
      description: string;
      supportingData: Record<string, any>;
    }>;
  }, [insights]);

  const [localInsights, setLocalInsights] = useState(initial);
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [savingId, setSavingId] = useState<number | null>(null);
  const [tab, setTab] = useState<"recommendations" | "insights">(
    initial.some(
      (i) =>
        i.insightType === "recommendation" &&
        (i.supportingData as any)?.workflow === "cluster_recommendations" &&
        (i.supportingData as any)?.feedback?.status !== "rejected"
    )
      ? "recommendations"
      : "insights"
  );
  const [recCategory, setRecCategory] = useState<
    "all" | "Component changes" | "Tone changes" | "Add more information"
  >("all");
  const [recIdx, setRecIdx] = useState(0);
  const [recAnimDir, setRecAnimDir] = useState<"left" | "right">("left");
  const [recAnimKey, setRecAnimKey] = useState(0);

  useEffect(() => {
    setLocalInsights((prev) => {
      const prevById = new Map(prev.map((p) => [p.id, p]));
      return initial.map((i) => {
        const existing = prevById.get(i.id);
        const existingFeedback = existing?.supportingData?.feedback;
        const incomingFeedback = i.supportingData?.feedback;
        return existingFeedback && !incomingFeedback
          ? { ...i, supportingData: { ...(i.supportingData || {}), feedback: existingFeedback } }
          : i;
      });
    });
  }, [initial]);

  if (localInsights.length === 0) {
    return (
      <div className="empty-state">
        <p>No insights yet. Run the analysis pipeline to generate insights.</p>
      </div>
    );
  }

  const recommendations = localInsights.filter((i) => {
    if (i.insightType !== "recommendation") return false;
    if ((i.supportingData as any)?.workflow !== "cluster_recommendations") return false;
    if ((i.supportingData as any)?.feedback?.status === "rejected") return false;
    return true;
  });

  const otherInsights = localInsights.filter((i) => i.insightType !== "recommendation");

  const grouped = {
    "Component changes": recommendations.filter(
      (r) => r.supportingData?.category === "Component changes"
    ),
    "Tone changes": recommendations.filter((r) => r.supportingData?.category === "Tone changes"),
    "Add more information": recommendations.filter(
      (r) => r.supportingData?.category === "Add more information"
    ),
    Other: recommendations.filter(
      (r) =>
        r.supportingData?.category !== "Component changes" &&
        r.supportingData?.category !== "Tone changes" &&
        r.supportingData?.category !== "Add more information"
    ),
  };

  const visibleRecommendations =
    recCategory === "all"
      ? recommendations
      : grouped[recCategory as "Component changes" | "Tone changes" | "Add more information"];

  useEffect(() => {
    setRecIdx(0);
    setRejectingId(null);
    setRejectReason("");
  }, [recCategory]);

  useEffect(() => {
    setRecIdx((i) => {
      const len = (visibleRecommendations as any[])?.length || 0;
      if (len <= 0) return 0;
      return Math.min(i, len - 1);
    });
  }, [visibleRecommendations.length]);

  const goRec = (delta: -1 | 1) => {
    const len = (visibleRecommendations as any[])?.length || 0;
    if (len <= 1) return;
    setRecAnimDir(delta === 1 ? "left" : "right");
    setRecAnimKey((k) => k + 1);
    setRecIdx((i) => (i + delta + len) % len);
    setRejectingId(null);
    setRejectReason("");
  };

  const setFeedbackLocal = (id: number, status: "implemented" | "rejected", reason?: string) => {
    setLocalInsights((prev) =>
      prev.map((x) =>
        x.id === id
          ? {
              ...x,
              supportingData: {
                ...(x.supportingData || {}),
                feedback: {
                  status,
                  reason: reason || null,
                  at: new Date().toISOString(),
                },
              },
            }
          : x
      )
    );
  };

  const sendFeedback = async (
    id: number,
    status: "implemented" | "rejected",
    reason?: string
  ) => {
    // Static snapshot: just update local state, no network call.
    setSavingId(id);
    try {
      setFeedbackLocal(id, status, reason);
      if (status === "rejected") {
        setRejectingId(null);
        setRejectReason("");
      }
    } finally {
      setSavingId(null);
    }
  };

  const testRunExperiment = (rec: any) => {
    try {
      const payload = {
        name: `Test: ${String(rec.title || "Recommendation").trim()}`.slice(0, 80),
        hypothesis: String(rec.description || "").trim(),
        targetId: "pricing",
        sourceInsightId: rec.id,
      };
      localStorage.setItem("awt_experiment_autorun", JSON.stringify(payload));
    } catch (e) {
      console.error("Failed to store experiment draft:", e);
    }

    onGoToExperiments?.();
  };

  return (
    <div className="insights-view">
      <div className="insights-subnav">
        <button
          className={tab === "recommendations" ? "active" : ""}
          onClick={() => setTab("recommendations")}
        >
          Recommendations
        </button>
        <button
          className={tab === "insights" ? "active" : ""}
          onClick={() => setTab("insights")}
        >
          Insights
        </button>
      </div>

      {tab === "recommendations" && recommendations.length > 0 && (
        <div className="insight-card">
          <div className="insight-header">
            <h3>&nbsp;</h3>
          </div>

          <div className="recs-category-toggle">
            <button
              className={recCategory === "all" ? "active" : ""}
              onClick={() => setRecCategory("all")}
            >
              All
            </button>
            <button
              className={recCategory === "Component changes" ? "active component" : "component"}
              onClick={() => setRecCategory("Component changes")}
            >
              Component changes
            </button>
            <button
              className={recCategory === "Tone changes" ? "active tone" : "tone"}
              onClick={() => setRecCategory("Tone changes")}
            >
              Tone changes
            </button>
            <button
              className={
                recCategory === "Add more information" ? "active info" : "info"
              }
              onClick={() => setRecCategory("Add more information")}
            >
              Add more information
            </button>
          </div>

          <div className="recs">
            {(visibleRecommendations as any[])?.length > 0 ? (
              <div className="rec-carousel">
                <div className="rec-carousel-top">
                  <div className="rec-carousel-count">
                    {Math.min(recIdx + 1, (visibleRecommendations as any[]).length)} /{" "}
                    {(visibleRecommendations as any[]).length}
                  </div>
                  <div className="rec-carousel-nav">
                    <button
                      className="secondary-action-btn rec-carousel-btn"
                      onClick={() => goRec(-1)}
                      disabled={(visibleRecommendations as any[]).length <= 1}
                      aria-label="Previous recommendation"
                    >
                      ←
                    </button>
                    <button
                      className="secondary-action-btn rec-carousel-btn"
                      onClick={() => goRec(1)}
                      disabled={(visibleRecommendations as any[]).length <= 1}
                      aria-label="Next recommendation"
                    >
                      →
                    </button>
                  </div>
                </div>

                {(() => {
                  const r = (visibleRecommendations as any[])[recIdx];
                  if (!r) return null;
                  const cat = r.supportingData?.category || "Other";
                  const catClass =
                    cat === "Component changes"
                      ? "component"
                      : cat === "Tone changes"
                      ? "tone"
                      : cat === "Add more information"
                      ? "info"
                      : "other";
                  const fb = r.supportingData?.feedback;
                  return (
                    <div
                      key={`${r.id}-${recAnimKey}`}
                      className={`rec-carousel-slide enter-${recAnimDir}`}
                    >
                      <div className={`rec-card rec-card--${catClass}`}>
                        <div className="rec-card-top">
                          <div className="rec-title">
                            <span className={`rec-cat-pill ${catClass}`}>{cat}</span>
                            {r.title}
                          </div>
                          <div className="rec-meta">
                            <span className="rec-confidence">
                              {Math.round(
                                Number(r.supportingData?.confidence ?? 0)
                              )}
                              % confidence
                            </span>
                            {fb?.status && (
                              <span
                                className={`rec-status ${
                                  fb.status === "implemented" ? "ok" : "bad"
                                }`}
                              >
                                {fb.status}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="rec-desc">{r.description}</div>

                        {Array.isArray(r.supportingData?.actions) &&
                          r.supportingData.actions.length > 0 && (
                            <div className="rec-actions">
                              {r.supportingData.actions
                                .slice(0, 3)
                                .map((a: any, idx: number) => (
                                  <div key={`${r.id}-a-${idx}`} className="rec-action">
                                    <span className="rec-action-type">{a.type}</span>
                                    <span className="rec-action-detail">{a.detail}</span>
                                  </div>
                                ))}
                            </div>
                          )}

                        {rejectingId === r.id && (
                          <div className="rec-reject">
                            <label className="rec-reject-label">Why are you rejecting this?</label>
                            <textarea
                              className="textarea"
                              value={rejectReason}
                              onChange={(e) => setRejectReason(e.target.value)}
                              placeholder="e.g. Not feasible / wrong assumption / already tested..."
                            />
                            <div className="rec-reject-actions">
                              <button
                                className="secondary-action-btn"
                                onClick={() => {
                                  setRejectingId(null);
                                  setRejectReason("");
                                }}
                                disabled={savingId === r.id}
                              >
                                Cancel
                              </button>
                              <button
                                className="secondary-action-btn rec-btn-reject"
                                onClick={() =>
                                  sendFeedback(r.id, "rejected", rejectReason)
                                }
                                disabled={
                                  savingId === r.id || rejectReason.trim().length < 2
                                }
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        )}

                        <div className="rec-buttons">
                          <button
                            className="primary-action-btn rec-btn-implement"
                            onClick={() => sendFeedback(r.id, "implemented")}
                            disabled={savingId === r.id}
                          >
                            {cat === "Add more information" ? "+ Add" : "Implement"}
                          </button>
                          {cat !== "Add more information" && (
                            <button
                              className="secondary-action-btn rec-btn-test"
                              onClick={() => testRunExperiment(r)}
                              disabled={savingId === r.id}
                            >
                              Test run experiment
                            </button>
                          )}
                          {rejectingId !== r.id && (
                            <button
                              className="secondary-action-btn rec-btn-reject"
                              onClick={() => setRejectingId(r.id)}
                              disabled={savingId === r.id}
                            >
                              Reject
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div className="empty-state" style={{ padding: "1rem" }}>
                <p>No recommendations in this category.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "insights" &&
        otherInsights.map((insight) => (
          <div key={insight.id} className="insight-card">
            <div className="insight-header">
              <span className="insight-type">{insight.insightType}</span>
              <h3>{insight.title}</h3>
            </div>
            <p className="insight-description">{insight.description}</p>
          </div>
        ))}
    </div>
  );
}


