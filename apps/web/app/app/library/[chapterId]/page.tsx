import "../../shell.css";

export default async function ChapterPage({ params }: { params: Promise<{ chapterId: string }> }) {
  const { chapterId } = await params;
  return <main className="appShell"><section className="appHero"><p className="eyebrow">Chapter detail</p><h1>{chapterId.replaceAll("-", " ")}</h1><p>Replay, continue the story, or review processing status.</p></section><section className="appCards"><article className="appCard"><strong>Status</strong><span>Ready · 320 MB</span></article><article className="appCard"><strong>Timeline</strong><span>8 scenes · 2 tracks · 12 events</span></article></section></main>;
}
