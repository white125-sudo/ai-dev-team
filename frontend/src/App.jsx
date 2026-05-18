import { useState } from "react";
import ReactMarkdown from "react-markdown";
import "./App.css";

const AGENTS = [
  {
    key: "business_analyst",
    label: "Business Analyst",
    icon: "📋",
    badge: "bg-blue-500/20 text-blue-300 border-blue-500/40",
  },
  {
    key: "architect",
    label: "Software Architect",
    icon: "🏗️",
    badge: "bg-purple-500/20 text-purple-300 border-purple-500/40",
  },
  {
    key: "developer",
    label: "Senior Developer",
    icon: "💻",
    badge: "bg-green-500/20 text-green-300 border-green-500/40",
  },
  {
    key: "qa_engineer",
    label: "QA Engineer",
    icon: "🧪",
    badge: "bg-orange-500/20 text-orange-300 border-orange-500/40",
  },
];

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const EXAMPLES = [
  "Build a task management app with user authentication and team collaboration",
  "Create a REST API for an e-commerce platform with product catalog and cart",
  "Design a real-time chat application with rooms and message history",
];

const STEP_LABELS = [
  "Analyzing requirements...",
  "Designing architecture...",
  "Writing code...",
  "Creating test cases...",
];

export default function App() {
  const [requirement, setRequirement] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("business_analyst");
  const [currentStep, setCurrentStep] = useState(0);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!requirement.trim()) return;

    setLoading(true);
    setResults(null);
    setError("");
    setCurrentStep(0);

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < STEP_LABELS.length - 1) return prev + 1;
        return prev;
      });
    }, 18000);

    try {
      const res = await fetch(`${API_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requirement }),
      });

      clearInterval(stepInterval);

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Something went wrong.");
      }

      const data = await res.json();
      setResults(data);
      setActiveTab("business_analyst");
    } catch (err) {
      clearInterval(stepInterval);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0f13] text-slate-200">
      {/* Header */}
      <header className="border-b border-slate-800 bg-[#0f0f13]/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-sm font-bold text-white">
              AI
            </div>
            <span className="font-semibold text-white">AI Dev Team</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
              Beta
            </span>
          </div>
          <a
            href="https://github.com/white125-sudo/ai-dev-team"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            GitHub →
          </a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Your AI{" "}
            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              Software Team
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Describe your project. Four AI agents — BA, Architect, Developer,
            and QA — collaborate to produce a complete technical blueprint.
          </p>

          {/* Agent badges */}
          <div className="flex justify-center gap-3 mt-6 flex-wrap">
            {AGENTS.map((a) => (
              <span
                key={a.key}
                className={`text-xs px-3 py-1 rounded-full border font-medium ${a.badge}`}
              >
                {a.icon} {a.label}
              </span>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="rounded-xl border border-slate-700 bg-slate-900 focus-within:border-violet-500 transition-colors">
            <textarea
              className="w-full bg-transparent p-4 resize-none text-slate-100 placeholder-slate-500 outline-none text-base"
              rows={4}
              placeholder="Describe your project or feature requirement..."
              value={requirement}
              onChange={(e) => setRequirement(e.target.value)}
              disabled={loading}
            />
            <div className="px-4 pb-3 flex items-center justify-between border-t border-slate-800 pt-3">
              <div className="flex gap-2 overflow-x-auto">
                {EXAMPLES.map((p, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setRequirement(p)}
                    disabled={loading}
                    className="whitespace-nowrap text-xs px-2 py-1 rounded-md bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-colors border border-slate-700"
                  >
                    {p.slice(0, 30)}…
                  </button>
                ))}
              </div>
              <button
                type="submit"
                disabled={loading || !requirement.trim()}
                className="shrink-0 ml-3 px-5 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
              >
                {loading ? "Processing…" : "Generate →"}
              </button>
            </div>
          </div>
        </form>

        {/* Loading */}
        {loading && (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center mb-8">
            <div className="flex justify-center gap-8 mb-6">
              {AGENTS.map((agent, i) => (
                <div key={agent.key} className="flex flex-col items-center gap-2">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-xl border-2 transition-all duration-700 ${
                      i <= currentStep
                        ? "border-violet-400 bg-violet-500/20 scale-110"
                        : "border-slate-700 bg-slate-800 opacity-40"
                    }`}
                  >
                    {agent.icon}
                  </div>
                  <span className="text-xs text-slate-500">
                    {agent.label.split(" ")[0]}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-slate-300 font-medium">{STEP_LABELS[currentStep]}</p>
            <p className="text-slate-500 text-sm mt-1">
              This takes 30–90 seconds
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-500/40 bg-red-950/20 p-4 mb-8 text-red-300 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Results */}
        {results && (
          <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
            <div className="flex border-b border-slate-800 overflow-x-auto">
              {AGENTS.map((agent) => (
                <button
                  key={agent.key}
                  onClick={() => setActiveTab(agent.key)}
                  className={`flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                    activeTab === agent.key
                      ? "border-violet-500 text-white bg-slate-800/50"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <span>{agent.icon}</span>
                  {agent.label}
                </button>
              ))}
            </div>

            {AGENTS.map(
              (agent) =>
                activeTab === agent.key && (
                  <div key={agent.key} className="p-6 overflow-auto">
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border mb-5 ${agent.badge}`}
                    >
                      {agent.icon} {agent.label}
                    </div>
                    <div className="prose prose-invert prose-sm max-w-none prose-pre:bg-[#0f0f13] prose-pre:border prose-pre:border-slate-700 prose-code:text-violet-300 prose-headings:text-slate-100">
                      <ReactMarkdown>{results[agent.key]}</ReactMarkdown>
                    </div>
                  </div>
                )
            )}
          </div>
        )}
      </main>

      <footer className="text-center py-8 text-slate-600 text-xs border-t border-slate-800 mt-10">
        Built with CrewAI · Gemini · React · FastAPI
      </footer>
    </div>
  );
}
