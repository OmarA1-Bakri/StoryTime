import Link from "next/link";
import "./shell.css";

const actions = [
  { href: "/demo", title: "Start demo call", copy: "Run the protected adventure-call flow." },
  { href: "/app/library", title: "Story library", copy: "Review saved chapters." },
  { href: "/app/pipeline", title: "Pipeline status", copy: "Check story, replay, review, and quota readiness." },
  { href: "/app/metrics", title: "MVP metrics", copy: "Review completion, replay, trust, and economics signals." },
  { href: "/app/preferences", title: "Preferences", copy: "Review limits, controls, and beta settings." }
];

export default function AppDashboard() {
  return <main className="appShell"><section className="appHero"><p className="eyebrow">Dashboard</p><h1>Family story space</h1><p>Start a protected story call, check chapter status, or manage preferences.</p></section><section className="appCards">{actions.map((action) => <Link className="appCard" href={action.href} key={action.href}><strong>{action.title}</strong><span>{action.copy}</span></Link>)}</section></main>;
}
