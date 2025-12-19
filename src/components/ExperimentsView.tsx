import { useEffect, useState } from "react";
import {
  ChevronDown,
  Filter,
  Share2,
  Plus,
  FlaskConical,
  Monitor,
  Layout,
  Edit3,
  X,
  Trash2,
} from "lucide-react";

type ExperimentStatus = "running" | "completed" | "suggested";

interface Experiment {
  id: string;
  name: string;
  status: ExperimentStatus;
  metric: string;
  lift?: number;
  confidence?: number;
  startDate?: string;
  endDate?: string;
  description?: string;
  targetId?: string;
  durationDays?: number;
  controlSplitPct?: number;
}

const INITIAL_ACTIVE: Experiment[] = [
  {
    id: "exp-1",
    name: "Pricing Tier Reordering",
    status: "running",
    metric: "Conversion Rate",
    lift: 12,
    confidence: 85,
    startDate: "2023-10-24",
  },
];

const SUGGESTED: Experiment[] = [
  {
    id: "sug-1",
    name: "Simplify Hero on Mobile",
    status: "suggested",
    metric: "Bounce Rate",
    description:
      "High bounce rate detected on mobile devices. Reducing hero copy length may improve retention.",
  },
  {
    id: "sug-2",
    name: "Sticky CTA",
    status: "suggested",
    metric: "Add to Cart Rate",
    description: "Users scroll long pages. A sticky CTA could reduce friction.",
  },
];

const PAST: Experiment[] = [
  {
    id: "past-1",
    name: "Home Page CTA Color",
    status: "completed",
    metric: "CTR",
    lift: 5,
    confidence: 92,
    endDate: "2023-10-20",
  },
  {
    id: "past-2",
    name: "Remove Navigation Links",
    status: "completed",
    metric: "Conversion",
    lift: -11.4,
    confidence: 99,
    endDate: "2023-10-10",
  },
];

const TARGETS = [
  { id: "pricing", name: "Pricing Page", type: "Conversion" },
  { id: "landing", name: "Landing Page", type: "Acquisition" },
  { id: "features", name: "Features Grid", type: "Engagement" },
  { id: "signup", name: "Sign Up Flow", type: "Onboarding" },
];

export function ExperimentsView() {
  const [view, setView] = useState<"dashboard" | "wizard">("dashboard");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [active, setActive] = useState<Experiment[]>(() => {
    try {
      const raw = localStorage.getItem("awt_experiments_active");
      const parsed = raw ? JSON.parse(raw) : null;
      return Array.isArray(parsed) ? parsed : INITIAL_ACTIVE;
    } catch {
      return INITIAL_ACTIVE;
    }
  });

  const [step, setStep] = useState(1);
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  const [name, setName] = useState("Pricing Optimization V2");
  const [hypothesis, setHypothesis] = useState("");
  const [duration, setDuration] = useState("14");
  const [controlSplitPct, setControlSplitPct] = useState(60);

  useEffect(() => {
    try {
      localStorage.setItem("awt_experiments_active", JSON.stringify(active));
    } catch {
      // ignore
    }
  }, [active]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("awt_experiment_autorun");
      if (!raw) return;
      const payload = JSON.parse(raw);
      localStorage.removeItem("awt_experiment_autorun");

      const expName = String(payload?.name || "Untitled Experiment").trim();
      const newExp: Experiment = {
        id: `exp-${Date.now()}`,
        name: expName || "Untitled Experiment",
        status: "running",
        metric: "Conversion Rate",
        lift: 0,
        confidence: 0,
        startDate: new Date().toISOString().split("T")[0],
        description: String(payload?.hypothesis || "").trim() || undefined,
        targetId: String(payload?.targetId || "").trim() || undefined,
        controlSplitPct: typeof payload?.controlSplitPct === "number" ? payload.controlSplitPct : 60,
      };

      setActive((prev) => [newExp, ...prev]);
      setView("dashboard");
    } catch (e) {
      console.error("Failed to auto-run experiment:", e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetWizard = () => {
    setStep(1);
    setSelectedTarget(null);
    setName("Pricing Optimization V2");
    setHypothesis("");
    setDuration("14");
    setControlSplitPct(60);
  };

  const handleRun = () => {
    const newExp: Experiment = {
      id: `exp-${Date.now()}`,
      name: name || "Untitled Experiment",
      status: "running",
      metric: "Conversion",
      lift: 0,
      confidence: 0,
      startDate: new Date().toISOString().split("T")[0],
      description: hypothesis.trim() || undefined,
      targetId: selectedTarget || undefined,
      durationDays: Number(duration) || undefined,
      controlSplitPct,
    };
    setActive([newExp, ...active]);
    resetWizard();
    setView("dashboard");
  };

  const deleteExperiment = (id: string) => {
    const ok = window.confirm("Delete this experiment? This can’t be undone.");
    if (!ok) return;
    setActive((prev) => prev.filter((e) => e.id !== id));
    setExpandedId((cur) => (cur === id ? null : cur));
  };

  if (view === "dashboard") {
    return (
      <div className="experiments">
        <div className="experiments-toolbar">
          <div className="experiments-path">
            <div className="experiments-title">
              <FlaskConical size={16} />
              <span>Experiments</span>
            </div>
            <span className="path-badge">Live</span>
          </div>
          <div className="experiments-actions">
            <button className="ghost-btn">
              Last 7 Days <ChevronDown size={14} />
            </button>
            <button className="icon-btn" title="Filter">
              <Filter size={15} />
            </button>
            <button className="icon-btn" title="Share">
              <Share2 size={15} />
            </button>
            <button className="primary-action-btn" onClick={() => setView("wizard")}>
              <Plus size={14} />
              New Experiment
            </button>
          </div>
        </div>

        <div className="experiments-section">
          <div className="experiments-section-title">
            <span className="dot running" />
            Current running experiments
          </div>
          <div className="experiments-grid">
            {active.map((exp) => (
              <div key={exp.id} className="experiment-card">
                <div className="experiment-card-top">
                  <div>
                    <div className="pill">Running</div>
                    <h3>{exp.name}</h3>
                    <p>Goal: improve {exp.metric}</p>
                  </div>
                  <div className="lift">
                    <span className={exp.lift && exp.lift >= 0 ? "pos" : "neg"}>
                      {exp.lift && exp.lift > 0 ? "+" : ""}
                      {exp.lift ?? 0}%
                    </span>
                    <small>Current lift</small>
                  </div>
                </div>
                <div className="experiment-card-meta">
                  <span>Confidence: {exp.confidence ?? 0}%</span>
                  <span>Started: {exp.startDate || "—"}</span>
                  <button
                    className="secondary-action-btn experiment-details-btn"
                    onClick={() => setExpandedId((cur) => (cur === exp.id ? null : exp.id))}
                  >
                    {expandedId === exp.id ? "Hide details" : "See details"}
                  </button>
                  <button
                    className="icon-btn icon-btn-square icon-btn-danger"
                    title="Delete"
                    aria-label="Delete experiment"
                    onClick={() => deleteExperiment(exp.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {expandedId === exp.id && (
                  <div className="experiment-details">
                    <div className="experiment-details-row">
                      <span className="k">Target</span>
                      <span className="v">
                        {TARGETS.find((t) => t.id === exp.targetId)?.name ||
                          exp.targetId ||
                          "—"}
                      </span>
                    </div>
                    <div className="experiment-details-row">
                      <span className="k">Split</span>
                      <span className="v">
                        {typeof exp.controlSplitPct === "number"
                          ? `${exp.controlSplitPct}% control / ${
                              100 - exp.controlSplitPct
                            }% variant`
                          : "—"}
                      </span>
                    </div>
                    <div className="experiment-details-row">
                      <span className="k">Duration</span>
                      <span className="v">
                        {exp.durationDays ? `${exp.durationDays} days` : "—"}
                      </span>
                    </div>
                    <div className="experiment-details-row">
                      <span className="k">Hypothesis</span>
                      <span className="v">{exp.description || "—"}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {active.length === 0 && (
              <div className="experiment-empty">No experiments running.</div>
            )}
          </div>
        </div>

        <div className="experiments-section">
          <div className="experiments-section-title">
            <span className="dot suggested" />
            AI suggestions
          </div>
          <div className="experiments-grid">
            {SUGGESTED.map((sug) => (
              <div key={sug.id} className="experiment-card suggestion">
                <h4>{sug.name}</h4>
                <p>{sug.description}</p>
                <div className="experiment-card-meta">
                  <span>Metric: {sug.metric}</span>
                </div>
                <button
                  className="secondary-action-btn"
                  onClick={() => setView("wizard")}
                >
                  Setup experiment
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="experiments-section">
          <div className="experiments-section-title">
            <span className="dot neutral" />
            History
          </div>
          <div className="experiments-list">
            {PAST.map((past) => (
              <div key={past.id} className="experiment-list-row">
                <div>
                  <div className="row-title">{past.name}</div>
                  <div className="row-sub">Ended {past.endDate}</div>
                </div>
                <div className="row-lift">
                  <span className={past.lift && past.lift >= 0 ? "pos" : "neg"}>
                    {past.lift && past.lift > 0 ? "+" : ""}
                    {past.lift ?? 0}%
                  </span>
                  <small>Confidence {past.confidence ?? 0}%</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="experiments wizard">
      <div className="experiments-header">
        <div>
          <h2>New Experiment</h2>
          <p>Select a target, define a hypothesis, and configure the split.</p>
        </div>
        <button
          className="icon-btn icon-btn-square"
          title="Close"
          aria-label="Close"
          onClick={() => {
            resetWizard();
            setView("dashboard");
          }}
        >
          <X size={16} />
        </button>
      </div>

      <div className="wizard-steps">
        <div className={`wizard-step ${step >= 1 ? "active" : ""}`}>
          <span>1</span> Target
        </div>
        <div className="wizard-line" />
        <div className={`wizard-step ${step >= 2 ? "active" : ""}`}>
          <span>2</span> Hypothesis
        </div>
        <div className="wizard-line" />
        <div className={`wizard-step ${step >= 3 ? "active" : ""}`}>
          <span>3</span> Configuration
        </div>
      </div>

      {step === 1 && (
        <div className="wizard-panel">
          <h3>Select a page to test</h3>
          <div className="targets-grid">
            {TARGETS.map((t) => (
              <div
                key={t.id}
                className={`target-card ${selectedTarget === t.id ? "active" : ""}`}
                onClick={() => setSelectedTarget(t.id)}
              >
                <div className="target-name">{t.name}</div>
                <div className="target-meta">{t.type}</div>
              </div>
            ))}
          </div>
          <div className="wizard-actions">
            <div />
            <button
              className="primary-action-btn"
              disabled={!selectedTarget}
              onClick={() => setStep(2)}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="wizard-panel">
          <h3>Name & hypothesis</h3>
          <label className="input-label">Experiment name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
            placeholder="Landing page headline test"
          />
          <label className="input-label">Hypothesis</label>
          <textarea
            value={hypothesis}
            onChange={(e) => setHypothesis(e.target.value)}
            className="textarea hypothesis-textarea"
            placeholder="By changing the CTA copy, we expect..."
          />
          <div className="wizard-actions">
            <button className="secondary-action-btn" onClick={() => setStep(1)}>
              Back
            </button>
            <button
              className="primary-action-btn"
              disabled={!hypothesis}
              onClick={() => setStep(3)}
            >
              Configure split
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="wizard-panel">
          <h3>Configuration</h3>

          <div className="split-visual">
            <div className="split-tree">
              <div className="split-node">
                <div className="split-source">
                  <span className="source-dot" />
                  <div className="source-label">
                    <div className="source-title">
                      <Monitor size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />
                      Incoming Traffic
                    </div>
                    <div className="source-sub">100% visitors</div>
                  </div>
                </div>
              </div>
              <div className="split-tree-branch">
                <div className="tree-line vertical" />
                <div className="tree-line horizontal" />
              </div>
              <div className="split-rail">
                <div className="rail-track">
                  <input
                    className="rail-input"
                    type="range"
                    min={10}
                    max={90}
                    step={5}
                    value={controlSplitPct}
                    onChange={(e) => setControlSplitPct(Number(e.target.value))}
                    aria-label="Traffic split (control percent)"
                  />
                  <div className="rail-fill" style={{ width: `${controlSplitPct}%` }} />
                  <div className="rail-handle" style={{ left: `${controlSplitPct}%` }}>
                    <div className="rail-dot" />
                  </div>
                </div>
                <div className="rail-labels">
                  <div className="rail-label left">
                    Old page (Control) · {controlSplitPct}%
                  </div>
                  <div className="rail-label right">
                    New page (Variant) · {100 - controlSplitPct}%
                  </div>
                </div>
              </div>
            </div>

            <div className="split-variants">
              <div
                className="variant-card control"
                style={{ flex: `${controlSplitPct} 1 0%` }}
              >
                <div className="variant-pill">Control</div>
                <div className="variant-title">
                  <Layout size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />
                  Original Page
                </div>
                <div className="variant-meta">{controlSplitPct}% Traffic</div>
              </div>
              <div
                className="variant-card variant"
                style={{ flex: `${100 - controlSplitPct} 1 0%` }}
              >
                <div className="variant-pill variant">Variant B</div>
                <div className="variant-title">
                  <Layout size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />
                  Modified Layout
                </div>
                <div className="variant-meta">{100 - controlSplitPct}% Traffic</div>
                <button className="ghost-btn small">
                  <Edit3 size={13} />
                  Edit Content
                </button>
              </div>
            </div>
          </div>

          <div className="config-grid">
            <div>
              <label className="input-label">Duration (days)</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="input"
              >
                <option value="7">7</option>
                <option value="14">14</option>
                <option value="30">30</option>
              </select>
            </div>
            <div />
          </div>

          <div className="wizard-actions">
            <button className="secondary-action-btn" onClick={() => setStep(2)}>
              Back
            </button>
            <button className="primary-action-btn run-experiment-btn" onClick={handleRun}>
              Run experiment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


