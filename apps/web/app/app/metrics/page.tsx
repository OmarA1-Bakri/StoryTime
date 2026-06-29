const metrics = [
  { label: "Chapter completion", value: "Ready", detail: "Demo chapter completes with two turns and a ready replay." },
  { label: "Replay readiness", value: "Ready", detail: "Replay pipeline returns a final output key when tracks and timeline events exist." },
  { label: "Trust controls", value: "Ready", detail: "Review checks, deletion request surfaces, and readiness gates are exposed in demo mode." },
  { label: "Economics", value: "$0.42", detail: "Demo chapter cost model includes transcription, story, image, and storage inputs." }
];

export default function MetricsPage() {
  return (
    <main className="app-shell">
      <section className="app-panel">
        <p className="eyebrow">MVP metrics</p>
        <h1>Success dashboard</h1>
        <p className="lead">Track the core signals that prove a completed private chapter is safe, replayable, and measurable.</p>
        <div className="feature-grid">
          {metrics.map((metric) => (
            <article className="feature-card" key={metric.label}>
              <span>{metric.value}</span>
              <h2>{metric.label}</h2>
              <p>{metric.detail}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
