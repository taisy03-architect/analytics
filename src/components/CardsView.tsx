import { useState } from "react";
import type { CardStat } from "../App";

interface CardsViewProps {
  cards: CardStat[];
}

type CardFilter = "all" | "high_conv" | "low_conv";

export function CardsView({ cards }: CardsViewProps) {
  const [filter, setFilter] = useState<CardFilter>("all");
  const [minSessions, setMinSessions] = useState<number>(5);

  const normRate = (v: number | null | undefined) => {
    const n = Number(v || 0);
    if (!Number.isFinite(n)) return 0;
    return n > 1 ? n / 100 : n;
  };

  const filtered = cards
    .filter((c) => c.unique_sessions >= minSessions)
    .filter((c) => {
      const conv = normRate(c.conversion_rate);
      if (filter === "high_conv") return conv >= 0.1;
      if (filter === "low_conv") return conv < 0.1;
      return true;
    });

  return (
    <div className="sessions-container">
      <div className="sessions-header">
        <h2>Cards ({filtered.length})</h2>
        <div className="filter-controls">
          <button
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`filter-btn ${filter === "high_conv" ? "active" : ""}`}
            onClick={() => setFilter("high_conv")}
          >
            High Conversion
          </button>
          <button
            className={`filter-btn ${filter === "low_conv" ? "active" : ""}`}
            onClick={() => setFilter("low_conv")}
          >
            Low Conversion
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.75rem", color: "#666" }}>Min sessions</span>
            <input
              type="number"
              min={0}
              value={minSessions}
              onChange={(e) => setMinSessions(parseInt(e.target.value || "0", 10))}
              style={{
                width: "70px",
                padding: "0.25rem 0.5rem",
                fontSize: "0.75rem",
                borderRadius: "4px",
                border: "1px solid #ddd",
              }}
            />
          </div>
        </div>
      </div>

      <div className="sessions-table-wrapper">
        <table className="sessions-table">
          <thead>
            <tr>
              <th>Card</th>
              <th>Sessions</th>
              <th>Impressions</th>
              <th>Questions</th>
              <th>Question Rate</th>
              <th>Conversions</th>
              <th>Conversion Rate</th>
              <th>Closes</th>
              <th>Close Rate</th>
              <th>Hovers</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((card) => {
              const questionRate = normRate(card.question_rate);
              const conversionRate = normRate(card.conversion_rate);
              const closeRate = normRate(card.close_rate);

              return (
                <tr key={card.card_title}>
                  <td>
                    <div style={{ fontWeight: 500 }}>{card.card_title}</div>
                  </td>
                  <td>{card.unique_sessions}</td>
                  <td>{card.total_events}</td>
                  <td>{card.questions}</td>
                  <td>{(questionRate * 100).toFixed(1)}%</td>
                  <td>{card.conversions}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        conversionRate >= 0.1 ? "converted" : "not-converted"
                      }`}
                    >
                      {(conversionRate * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td>{card.close_events}</td>
                  <td>{(closeRate * 100).toFixed(1)}%</td>
                  <td>{card.hover_events}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}


