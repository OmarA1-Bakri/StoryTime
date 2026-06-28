import Link from "next/link";

const cards = [
  "Adult-controlled consent and handoff",
  "Live story call with baton turns",
  "AI scenes as stage crew, not the star",
  "Private replay vault for family memories"
];

export default function HomePage() {
  return (
    <main className="landing">
      <section className="hero">
        <p className="eyebrow">Private beta MVP</p>
        <h1>StoryTime turns family calls into replayable adventures.</h1>
        <p className="lede">
          A remote adult and child co-create a short story chapter on a protected live call,
          then save the moment as a private family memory.
        </p>
        <div className="actions">
          <Link className="primary" href="/demo">Open MVP demo</Link>
          <Link className="secondary" href="/child-privacy">Child privacy</Link>
        </div>
      </section>
      <section className="grid">
        {cards.map((card) => <article key={card}>{card}</article>)}
      </section>
    </main>
  );
}
