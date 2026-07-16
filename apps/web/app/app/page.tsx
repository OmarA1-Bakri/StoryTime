import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import "./shell.css";

const actions = [
  { href: "/demo", title: "Start demo call", copy: "Run the protected adventure-call flow." },
  { href: "/app/library", title: "Story library", copy: "Review saved chapters." },
  { href: "/app/pipeline", title: "Pipeline status", copy: "Check story, replay, review, and quota readiness." },
  { href: "/app/metrics", title: "MVP metrics", copy: "Review completion, replay, trust, and economics signals." },
  { href: "/app/preferences", title: "Preferences", copy: "Review limits, controls, and beta settings." }
];

export default async function AppDashboard() {
  const { userId } = await auth();
  const user = userId ? await currentUser() : null;
  return <main className="appShell"><section className="appHero"><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><p className="eyebrow">Adult dashboard</p>{userId ? <UserButton /> : null}</div><h1>{user?.firstName ? `Welcome, ${user.firstName}` : "Family story space"}</h1><p>Start a protected story call, check chapter status, or manage preferences.</p></section><section className="appCards">{actions.map((action) => <Link className="appCard" href={action.href} key={action.href}><strong>{action.title}</strong><span>{action.copy}</span></Link>)}</section></main>;
}
