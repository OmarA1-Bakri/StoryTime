import Link from "next/link";
import "../shell.css";

const chapters = [
  { id: "space-princess", title: "The Space Princess Chapter", meta: "14 minutes · 8 scenes" },
  { id: "moon-garden", title: "Moon Garden Rescue", meta: "Paused" }
];

export default function LibraryPage() {
  return <main className="appShell"><section className="appHero"><p className="eyebrow">Library</p><h1>Saved chapters</h1><p>Review StoryTime chapters and processing status.</p></section><section className="appCards">{chapters.map((chapter) => <Link className="appCard" href={`/app/library/${chapter.id}`} key={chapter.id}><strong>{chapter.title}</strong><span>{chapter.meta}</span></Link>)}</section></main>;
}
