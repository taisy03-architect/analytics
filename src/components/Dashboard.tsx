import type { Stats, CardStat, ReasonsResponse, PageFilter } from "../App";
import { PAGE_FILTERS } from "../App";

interface DashboardProps {
  stats: Stats;
  cards: CardStat[];
  reasons: ReasonsResponse;
  pageFilter: PageFilter;
  onChangePageFilter: (next: PageFilter) => void;
  onSeeRawData?: () => void;
}

const ICP_CARD_TITLES = [
  "Founders & Executives",
  "Customer Success Teams",
  "Marketing Leaders",
  "Sales Leaders & Teams",
];

export function Dashboard({
  stats,
  cards,
  reasons,
  pageFilter,
  onChangePageFilter,
  onSeeRawData,
}: DashboardProps) {
  const formatDiff = (value: number, suffix: string = "") => {
    if (!Number.isFinite(value) || value === 0) return `0${suffix}`;
    const sign = value > 0 ? "+" : "−";
    return `${sign}${Math.abs(value).toFixed(1)}${suffix}`;
  };

  const icpCards = cards.filter((c) => ICP_CARD_TITLES.includes(c.card_title));
  const icpSummary = icpCards.map((card) => {
    const interactionEvents =
      (card.questions || 0) + (card.follow_ups || 0) + (card.hover_events || 0);
    const interactionRate =
      card.unique_sessions > 0 ? (interactionEvents / card.unique_sessions) * 100 : 0;
    const conversionRate =
      card.unique_sessions > 0 ? (card.conversions / card.unique_sessions) * 100 : 0;
    return {
      name: card.card_title,
      sessions: card.unique_sessions,
      conversions: card.conversions,
      interactionRate,
      conversionRate,
    };
  });

  const maxSessions =
    icpSummary.length > 0 ? Math.max(...icpSummary.map((i) => i.sessions)) || 1 : 1;

  return (
    <div className="dashboard">
      <div className="dashboard-actions">
        {onSeeRawData && (
          <button className="raw-data-btn" onClick={onSeeRawData}>
            See Raw Data
          </button>
        )}
        <div className="filter-item">
          <span className="filter-label">Page</span>
          <select
            className="filter-select"
            value={pageFilter}
            onChange={(e) => onChangePageFilter(e.target.value as PageFilter)}
          >
            {PAGE_FILTERS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="stats-cards">
        <div className="stat-card">
          <h3>Total Sessions</h3>
          <div className="value">{stats.total}</div>
        </div>
        <div className="stat-card">
          <h3>Conversion Rate</h3>
          <div className="value positive">{stats.conversionRate.toFixed(1)}%</div>
        </div>
        <div className="stat-card">
          <h3>Top Drop-off Location</h3>
          <div className="value">Pricing / FAQs</div>
        </div>
        <div className="stat-card">
          <h3>Avg Time on Page</h3>
          <div className="value">2m 47s</div>
        </div>
      </div>

      <div className="topic-section reasons-section">
        <h2>Why People Convert vs Don’t</h2>
        <div className="reasons-grid">
          <div className="reasons-panel">
            <div className="reasons-panel-header">
              <h3>Why converted (top 5)</h3>
              <span className="reasons-panel-hint">confidence</span>
            </div>
            <div className="reasons-list">
              {(reasons.converted.length
                ? reasons.converted
                : Array(5).fill({ reason: "Loading…", confidence: 0 })
              )
                .slice(0, 5)
                .map((r, idx) => (
                  <div key={`${r.reason}-${idx}`} className="reason-row">
                    <div className="reason-label">
                      <span className="reason-rank">{idx + 1}</span>
                      <span className="reason-text">{r.reason}</span>
                    </div>
                    <div className="reason-bar">
                      <div className="reason-bar-bg">
                        <div
                          className="reason-bar-fill reason-bar-fill--green"
                          style={{ width: `${Math.max(4, r.confidence)}%` }}
                        />
                      </div>
                      <span className="reason-score">
                        {r.confidence ? Math.round(r.confidence) : 0}%
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="reasons-panel">
            <div className="reasons-panel-header">
              <h3>Why not converted (top 5)</h3>
              <span className="reasons-panel-hint">confidence</span>
            </div>
            <div className="reasons-list">
              {(reasons.notConverted.length
                ? reasons.notConverted
                : Array(5).fill({ reason: "Loading…", confidence: 0 })
              )
                .slice(0, 5)
                .map((r, idx) => (
                  <div key={`${r.reason}-${idx}`} className="reason-row">
                    <div className="reason-label">
                      <span className="reason-rank">{idx + 1}</span>
                      <span className="reason-text">{r.reason}</span>
                    </div>
                    <div className="reason-bar">
                      <div className="reason-bar-bg">
                        <div
                          className="reason-bar-fill reason-bar-fill--red"
                          style={{ width: `${Math.max(4, r.confidence)}%` }}
                        />
                      </div>
                      <span className="reason-score">
                        {r.confidence ? Math.round(r.confidence) : 0}%
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {icpSummary.length > 0 && (
        <div className="topic-section icp-demo-section">
          <h2>Engagement by ICP</h2>
          <div className="icp-demo-grid">
            {icpSummary.map((item) => {
              const width =
                maxSessions > 0 ? Math.max(6, (item.sessions / maxSessions) * 100) : 0;
              return (
                <div key={item.name} className="icp-demo-item">
                  <div className="icp-demo-header">
                    <span className="icp-demo-name">{item.name}</span>
                    <div className="icp-demo-metrics">
                      <span className="icp-demo-conversion">
                        {item.conversionRate.toFixed(1)}% conversion
                      </span>
                      <span className="icp-demo-meta">
                        {item.sessions} sessions · {item.conversions} demos
                      </span>
                    </div>
                  </div>
                  <div className="icp-demo-bar-row">
                    <div className="icp-demo-bar-bg">
                      <div
                        className="icp-demo-bar-fill"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {stats.convertedAvg && stats.notConvertedAvg && (
        <div className="comparison-section">
          <div className="comparison-header">
            <div>
              <h2>Converted vs Not Converted</h2>
              <p className="comparison-subtitle">
                Average engagement and funnel behavior for converted vs non-converted
                sessions.
              </p>
            </div>
          </div>

          <div className="comparison-table-wrapper">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Converted</th>
                  <th>Not Converted</th>
                  <th>Diff</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <span className="metric-label-cell">Avg Events</span>
                    <span className="metric-chip-cell">Engagement</span>
                  </td>
                  <td>{stats.convertedAvg.avgEvents.toFixed(1)}</td>
                  <td>{stats.notConvertedAvg.avgEvents.toFixed(1)}</td>
                  <td>
                    <span className="diff-badge">
                      {formatDiff(
                        stats.convertedAvg.avgEvents - stats.notConvertedAvg.avgEvents
                      )}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className="metric-label-cell">Avg Questions</span>
                    <span className="metric-chip-cell">Intent</span>
                  </td>
                  <td>{(stats.convertedAvg.avgQuestions || 0).toFixed(1)}</td>
                  <td>{(stats.notConvertedAvg.avgQuestions || 0).toFixed(1)}</td>
                  <td>
                    <span className="diff-badge">
                      {formatDiff(
                        (stats.convertedAvg.avgQuestions || 0) -
                          (stats.notConvertedAvg.avgQuestions || 0)
                      )}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className="metric-label-cell">Follow-up Click Rate</span>
                    <span className="metric-chip-cell">Depth</span>
                  </td>
                  <td>
                    {((stats.convertedAvg.avgFollowUpClickRate || 0) * 100).toFixed(1)}%
                  </td>
                  <td>
                    {((stats.notConvertedAvg.avgFollowUpClickRate || 0) * 100).toFixed(1)}%
                  </td>
                  <td>
                    <span className="diff-badge">
                      {formatDiff(
                        (stats.convertedAvg.avgFollowUpClickRate -
                          stats.notConvertedAvg.avgFollowUpClickRate) *
                          100,
                        "%"
                      )}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className="metric-label-cell">Avg Cards Viewed</span>
                    <span className="metric-chip-cell">Exploration</span>
                  </td>
                  <td>{stats.convertedAvg.avgCardsViewed.toFixed(1)}</td>
                  <td>{stats.notConvertedAvg.avgCardsViewed.toFixed(1)}</td>
                  <td>
                    <span className="diff-badge">
                      {formatDiff(
                        stats.convertedAvg.avgCardsViewed -
                          stats.notConvertedAvg.avgCardsViewed
                      )}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className="metric-label-cell">Avg Engagement Score</span>
                    <span className="metric-chip-cell">Composite</span>
                  </td>
                  <td>{stats.convertedAvg.avgEngagementScore.toFixed(1)}</td>
                  <td>{stats.notConvertedAvg.avgEngagementScore.toFixed(1)}</td>
                  <td>
                    <span className="diff-badge">
                      {formatDiff(
                        stats.convertedAvg.avgEngagementScore -
                          stats.notConvertedAvg.avgEngagementScore
                      )}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className="metric-label-cell">% Calendly Opened</span>
                    <span className="metric-chip-cell">Bottom of Funnel</span>
                  </td>
                  <td>{stats.convertedAvg.pctCalendlyOpened.toFixed(1)}%</td>
                  <td>{stats.notConvertedAvg.pctCalendlyOpened.toFixed(1)}%</td>
                  <td>
                    <span className="diff-badge">
                      {formatDiff(
                        stats.convertedAvg.pctCalendlyOpened -
                          stats.notConvertedAvg.pctCalendlyOpened,
                        "%"
                      )}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}


