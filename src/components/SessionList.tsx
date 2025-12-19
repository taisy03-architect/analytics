import { useState } from "react";
import type { Session } from "../App";

interface SessionListProps {
  sessions: Session[];
}

type FilterType = "all" | "converted" | "not_converted";

export function SessionList({ sessions }: SessionListProps) {
  const [filter, setFilter] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<keyof Session>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const filteredSessions = sessions.filter((session) => {
    if (filter === "converted") return session.converted === true;
    if (filter === "not_converted") return session.converted === false;
    return true;
  });

  const sortedSessions = [...filteredSessions].sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];

    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;

    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    }

    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortOrder === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }

    return 0;
  });

  const handleSort = (column: keyof Session) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  const getSortIcon = (column: keyof Session) => {
    if (sortBy !== column) return "↕️";
    return sortOrder === "asc" ? "↑" : "↓";
  };

  return (
    <div className="sessions-container">
      <div className="sessions-header">
        <h2>Sessions ({filteredSessions.length})</h2>
        <div className="filter-controls">
          <button
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`filter-btn ${filter === "converted" ? "active" : ""}`}
            onClick={() => setFilter("converted")}
          >
            Converted
          </button>
          <button
            className={`filter-btn ${filter === "not_converted" ? "active" : ""}`}
            onClick={() => setFilter("not_converted")}
          >
            Not Converted
          </button>
        </div>
      </div>

      <div className="sessions-table-wrapper">
        <table className="sessions-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("id")} className="sortable">
                Session ID {getSortIcon("id")}
              </th>
              <th onClick={() => handleSort("converted")} className="sortable">
                Status {getSortIcon("converted")}
              </th>
              <th onClick={() => handleSort("total_events")} className="sortable">
                Events {getSortIcon("total_events")}
              </th>
              <th onClick={() => handleSort("total_questions")} className="sortable">
                Questions {getSortIcon("total_questions")}
              </th>
              <th onClick={() => handleSort("follow_ups_clicked")} className="sortable">
                Follow-ups {getSortIcon("follow_ups_clicked")}
              </th>
              <th onClick={() => handleSort("cards_viewed")} className="sortable">
                Cards {getSortIcon("cards_viewed")}
              </th>
              <th onClick={() => handleSort("engagement_score")} className="sortable">
                Engagement {getSortIcon("engagement_score")}
              </th>
              <th onClick={() => handleSort("follow_up_click_rate")} className="sortable">
                Follow-up Rate {getSortIcon("follow_up_click_rate")}
              </th>
              <th>Actions</th>
              <th onClick={() => handleSort("created_at")} className="sortable">
                Date {getSortIcon("created_at")}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedSessions.map((session) => (
              <tr
                key={session.id}
                className={session.converted ? "converted-row" : "not-converted-row"}
              >
                <td className="session-id-cell">
                  <code>{session.id.slice(0, 12)}...</code>
                </td>
                <td>
                  <span
                    className={`status-badge ${
                      session.converted ? "converted" : "not-converted"
                    }`}
                  >
                    {session.converted ? "✓ Converted" : "✗ Not Converted"}
                  </span>
                </td>
                <td>{session.total_events || 0}</td>
                <td>{session.total_questions || 0}</td>
                <td>{session.follow_ups_clicked || 0}</td>
                <td>{session.cards_viewed?.length || 0}</td>
                <td>
                  {session.engagement_score !== null && session.engagement_score !== undefined
                    ? session.engagement_score
                    : "-"}
                </td>
                <td>
                  {session.follow_up_click_rate !== null &&
                  session.follow_up_click_rate !== undefined
                    ? `${(session.follow_up_click_rate * 100).toFixed(1)}%`
                    : "-"}
                </td>
                <td>
                  <div className="action-badges">
                    {session.calendly_opened && (
                      <span className="mini-badge calendly">Calendly</span>
                    )}
                    {session.demo_booked && (
                      <span className="mini-badge demo">Demo</span>
                    )}
                    {session.discount_activated && (
                      <span className="mini-badge discount">Discount</span>
                    )}
                  </div>
                </td>
                <td className="date-cell">
                  {session.created_at ? new Date(session.created_at).toLocaleDateString() : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


