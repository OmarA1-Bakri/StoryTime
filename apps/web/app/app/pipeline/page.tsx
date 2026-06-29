const pipelineStages = [
  { name: "Story session", status: "Ready", detail: "Mock chapter flow creates story turns and scene prompts." },
  { name: "Replay output", status: "Ready", detail: "Worker pipeline prepares the final replay output key." },
  { name: "Review check", status: "Ready", detail: "Mock review provider approves demo checks before replay generation." },
  { name: "Quota gate", status: "Ready", detail: "Plan gate helpers protect credits and storage capacity." }
];

export default function PipelinePage() {
  return (
    <main className="app-shell">
      <section className="app-panel">
        <p className="eyebrow">MVP pipeline</p>
        <h1>Story and replay readiness</h1>
        <p className="lead">A compact view of the systems that must pass before a chapter is saved to the family vault.</p>
        <div className="feature-grid">
          {pipelineStages.map((stage) => (
            <article className="feature-card" key={stage.name}>
              <span>{stage.status}</span>
              <h2>{stage.name}</h2>
              <p>{stage.detail}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
