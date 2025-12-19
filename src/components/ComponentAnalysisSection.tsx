import React from "react";
import type { PageFilter } from "../App";
import { PAGE_FILTERS } from "../App";

type ComponentStatus = "performing" | "neutral" | "warning";

type ComponentMock = {
  id: string;
  name: string;
  type: string;
  metrics: { dwell: string; clicks: string; dropoff: string };
  status: ComponentStatus;
  preview: React.ReactNode;
};

const COMPONENTS_BY_PAGE: Record<Exclude<PageFilter, "All Pages">, ComponentMock[]> = {
  Homepage: [
    {
      id: "hero",
      name: "Hero Header V2",
      type: "Header",
      metrics: { dwell: "12s", clicks: "4.2%", dropoff: "5%" },
      status: "performing",
      preview: (
        <div className="comp-preview">
          <div className="comp-preview-line strong" />
          <div className="comp-preview-line" />
          <div className="comp-preview-actions">
            <div className="comp-preview-pill strong" />
            <div className="comp-preview-pill outline" />
          </div>
        </div>
      ),
    },
    {
      id: "logos",
      name: "Trusted By Logos",
      type: "Social Proof",
      metrics: { dwell: "2s", clicks: "0.1%", dropoff: "2%" },
      status: "neutral",
      preview: (
        <div className="comp-preview">
          <div className="comp-preview-dots">
            <div className="dot" />
            <div className="dot" />
            <div className="dot" />
            <div className="dot" />
          </div>
        </div>
      ),
    },
    {
      id: "features",
      name: "Feature Grid",
      type: "Content",
      metrics: { dwell: "45s", clicks: "12%", dropoff: "15%" },
      status: "performing",
      preview: (
        <div className="comp-preview grid">
          <div className="cell" />
          <div className="cell" />
          <div className="cell" />
          <div className="cell" />
        </div>
      ),
    },
    {
      id: "pricing",
      name: "Pricing Teaser",
      type: "Conversion",
      metrics: { dwell: "24s", clicks: "2.9%", dropoff: "45%" },
      status: "warning",
      preview: (
        <div className="comp-preview pricing">
          <div className="plan small" />
          <div className="plan large" />
          <div className="plan small" />
        </div>
      ),
    },
    {
      id: "faq",
      name: "FAQ Accordion",
      type: "Support",
      metrics: { dwell: "25s", clicks: "3.5%", dropoff: "8%" },
      status: "neutral",
      preview: (
        <div className="comp-preview faq">
          <div className="faq-line" />
          <div className="faq-line" />
          <div className="faq-line" />
        </div>
      ),
    },
  ],
  Pricing: [
    {
      id: "pricing-hero",
      name: "Pricing Header",
      type: "Header",
      metrics: { dwell: "9s", clicks: "3.1%", dropoff: "7%" },
      status: "neutral",
      preview: (
        <div className="comp-preview">
          <div className="comp-preview-line strong" />
          <div className="comp-preview-actions">
            <div className="comp-preview-pill strong" />
          </div>
        </div>
      ),
    },
    {
      id: "plan-compare",
      name: "Plan Comparison",
      type: "Conversion",
      metrics: { dwell: "1m 10s", clicks: "6.8%", dropoff: "38%" },
      status: "warning",
      preview: (
        <div className="comp-preview pricing">
          <div className="plan small" />
          <div className="plan large" />
          <div className="plan small" />
        </div>
      ),
    },
    {
      id: "roi",
      name: "ROI / Value Calculator",
      type: "Interactive",
      metrics: { dwell: "32s", clicks: "9.4%", dropoff: "12%" },
      status: "performing",
      preview: (
        <div className="comp-preview grid">
          <div className="cell" />
          <div className="cell" />
          <div className="cell" />
          <div className="cell" />
        </div>
      ),
    },
    {
      id: "proof",
      name: "Proof Strip (Logos + Quotes)",
      type: "Social Proof",
      metrics: { dwell: "6s", clicks: "0.8%", dropoff: "5%" },
      status: "neutral",
      preview: (
        <div className="comp-preview">
          <div className="comp-preview-dots">
            <div className="dot" />
            <div className="dot" />
            <div className="dot" />
            <div className="dot" />
          </div>
        </div>
      ),
    },
    {
      id: "pricing-faq",
      name: "Pricing FAQ",
      type: "Support",
      metrics: { dwell: "18s", clicks: "2.2%", dropoff: "9%" },
      status: "neutral",
      preview: (
        <div className="comp-preview faq">
          <div className="faq-line" />
          <div className="faq-line" />
          <div className="faq-line" />
        </div>
      ),
    },
  ],
  "Use Cases": [
    {
      id: "uc-hero",
      name: "Use Case Hero",
      type: "Header",
      metrics: { dwell: "11s", clicks: "4.9%", dropoff: "6%" },
      status: "performing",
      preview: (
        <div className="comp-preview">
          <div className="comp-preview-line strong" />
          <div className="comp-preview-line" />
          <div className="comp-preview-actions">
            <div className="comp-preview-pill strong" />
          </div>
        </div>
      ),
    },
    {
      id: "segment-tabs",
      name: "ICP Segment Switcher",
      type: "Navigation",
      metrics: { dwell: "8s", clicks: "14%", dropoff: "4%" },
      status: "performing",
      preview: (
        <div className="comp-preview">
          <div className="comp-preview-actions">
            <div className="comp-preview-pill strong" />
            <div className="comp-preview-pill outline" />
            <div className="comp-preview-pill outline" />
          </div>
        </div>
      ),
    },
    {
      id: "case-grid",
      name: "Case Study Grid",
      type: "Content",
      metrics: { dwell: "52s", clicks: "7.7%", dropoff: "16%" },
      status: "performing",
      preview: (
        <div className="comp-preview grid">
          <div className="cell" />
          <div className="cell" />
          <div className="cell" />
          <div className="cell" />
        </div>
      ),
    },
    {
      id: "outcomes",
      name: "Outcome Highlights",
      type: "Content",
      metrics: { dwell: "19s", clicks: "1.1%", dropoff: "10%" },
      status: "neutral",
      preview: (
        <div className="comp-preview">
          <div className="comp-preview-line strong" />
          <div className="comp-preview-line" />
          <div className="comp-preview-line" />
        </div>
      ),
    },
    {
      id: "uc-cta",
      name: "Bottom CTA Banner",
      type: "Conversion",
      metrics: { dwell: "7s", clicks: "5.4%", dropoff: "8%" },
      status: "performing",
      preview: (
        <div className="comp-preview">
          <div className="comp-preview-actions">
            <div className="comp-preview-pill strong" />
          </div>
        </div>
      ),
    },
  ],
  Docs: [
    {
      id: "docs-topbar",
      name: "Docs Top Bar",
      type: "Navigation",
      metrics: { dwell: "5s", clicks: "18%", dropoff: "3%" },
      status: "performing",
      preview: (
        <div className="comp-preview">
          <div className="comp-preview-actions">
            <div className="comp-preview-pill outline" />
            <div className="comp-preview-pill outline" />
            <div className="comp-preview-pill outline" />
          </div>
        </div>
      ),
    },
    {
      id: "docs-search",
      name: "Docs Search",
      type: "Interactive",
      metrics: { dwell: "14s", clicks: "9.8%", dropoff: "6%" },
      status: "performing",
      preview: (
        <div className="comp-preview">
          <div className="comp-preview-line strong" />
          <div className="comp-preview-line" />
        </div>
      ),
    },
    {
      id: "code-samples",
      name: "Code Samples",
      type: "Content",
      metrics: { dwell: "1m 40s", clicks: "2.6%", dropoff: "14%" },
      status: "performing",
      preview: (
        <div className="comp-preview grid">
          <div className="cell" />
          <div className="cell" />
          <div className="cell" />
          <div className="cell" />
        </div>
      ),
    },
    {
      id: "api-ref",
      name: "API Reference Nav",
      type: "Navigation",
      metrics: { dwell: "28s", clicks: "6.2%", dropoff: "11%" },
      status: "neutral",
      preview: (
        <div className="comp-preview">
          <div className="comp-preview-line" />
          <div className="comp-preview-line" />
          <div className="comp-preview-line" />
        </div>
      ),
    },
    {
      id: "docs-cta",
      name: "Request Help CTA",
      type: "Conversion",
      metrics: { dwell: "6s", clicks: "1.4%", dropoff: "22%" },
      status: "warning",
      preview: (
        <div className="comp-preview">
          <div className="comp-preview-actions">
            <div className="comp-preview-pill strong" />
            <div className="comp-preview-pill outline" />
          </div>
        </div>
      ),
    },
  ],
};

const StatusDot: React.FC<{ status: ComponentStatus }> = ({ status }) => {
  const cls =
    status === "performing"
      ? "status-dot performing"
      : status === "warning"
      ? "status-dot warning"
      : "status-dot neutral";
  return <span className={cls} />;
};

const StatusBadge: React.FC<{ status: ComponentStatus }> = ({ status }) => {
  if (status === "warning") return <span className="comp-badge warning">Friction</span>;
  if (status === "performing") return <span className="comp-badge performing">Strong</span>;
  return <span className="comp-badge neutral">Neutral</span>;
};

export const ComponentAnalysisSection: React.FC<{
  pageFilter: PageFilter;
  onChangePageFilter: (next: PageFilter) => void;
}> = ({ pageFilter, onChangePageFilter }) => {
  const effectivePage: Exclude<PageFilter, "All Pages"> =
    pageFilter === "All Pages" ? "Homepage" : pageFilter;
  const pageSelectValue: Exclude<PageFilter, "All Pages"> = effectivePage;
  const components = COMPONENTS_BY_PAGE[effectivePage] || COMPONENTS_BY_PAGE.Homepage;

  return (
    <section className="comp-section">
      <div className="comp-section-title">
        <h2>Component Analytics</h2>
        <p>Mock view of how the page’s components perform and where users drop off.</p>
      </div>

      <div className="comp-panel">
        <div className="comp-panel-header">
          <div className="comp-panel-chip">
            <span className="chip-dot" />
            <span>Component Analysis</span>
          </div>
          <div className="comp-panel-subhead">
            <span className="comp-filter">
              <span className="filter-label">Page</span>
              <select
                className="filter-select"
                value={pageSelectValue}
                onChange={(e) =>
                  onChangePageFilter(e.target.value as Exclude<PageFilter, "All Pages">)
                }
              >
                {PAGE_FILTERS.filter((p) => p !== "All Pages").map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </span>
            <span className="comp-subhead-sep">·</span>
            <span>Dwell · Clicks · Drop-off</span>
          </div>
        </div>

        <div className="comp-list">
          {components.map((comp) => (
            <div key={comp.id} className="comp-row">
              <div className="comp-thumb">{comp.preview}</div>

              <div className="comp-main">
                <div className="comp-top">
                  <div className="comp-meta">
                    <div className="comp-name">
                      <span className="name-text">{comp.name}</span>
                      <StatusDot status={comp.status} />
                    </div>
                    <div className="comp-type">{comp.type}</div>
                  </div>
                  <StatusBadge status={comp.status} />
                </div>

                <div className="comp-metrics">
                  <div className="metric">
                    <div className="k">Dwell</div>
                    <div className="v">{comp.metrics.dwell}</div>
                  </div>
                  <div className="metric">
                    <div className="k">Clicks</div>
                    <div className="v">{comp.metrics.clicks}</div>
                  </div>
                  <div className="metric">
                    <div className="k">Drop-off</div>
                    <div className={`v ${comp.status === "warning" ? "dropoff-warn" : ""}`}>
                      {comp.metrics.dropoff}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


