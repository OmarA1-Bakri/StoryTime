import { UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import "./shell.css";

const workspaceLinks = [
  {
    href: "/app/library",
    index: "01",
    title: "Story library",
    copy: "Review saved chapters and private replays.",
  },
  {
    href: "/app/pipeline",
    index: "02",
    title: "Pipeline status",
    copy: "Check story, replay, review, and quota readiness.",
  },
  {
    href: "/app/metrics",
    index: "03",
    title: "MVP metrics",
    copy: "Read completion, replay, trust, and economics signals.",
  },
  {
    href: "/app/preferences",
    index: "04",
    title: "Preferences",
    copy: "Manage family limits, controls, and beta settings.",
  },
];

export default async function AppDashboard() {
  const { userId } = await auth();
  const user = userId ? await currentUser() : null;
  const firstName = user?.firstName;

  return (
    <main className="dashboardPage">
      <header className="dashboardHeader">
        <Link className="dashboardBrand" href="/" aria-label="StoryTime home">
          <span aria-hidden="true">ST</span>
          StoryTime
        </Link>
        <div className="dashboardAccount">
          <span>Adult workspace</span>
          {userId ? <UserButton /> : null}
        </div>
      </header>

      <div className="dashboardShell">
        <section className="dashboardIntro" aria-labelledby="dashboard-title">
          <p className="dashboardEyebrow">Family story space</p>
          <h1 id="dashboard-title">
            {firstName ? `Good to see you, ${firstName}.` : "Ready for another chapter?"}
          </h1>
          <p>
            Start a protected story call, check a saved chapter, or review the controls around your
            family space.
          </p>
        </section>

        <section className="dashboardGrid" aria-label="StoryTime workspace">
          <Link className="startCall" href="/demo">
            <div className="callStatus">
              <span aria-hidden="true" />
              Protected lobby ready
            </div>
            <div className="startCallCopy">
              <p>New adventure call</p>
              <h2>Bring someone far away into tonight&apos;s story.</h2>
            </div>
            <span className="startCallAction">
              Open demo call <i aria-hidden="true">→</i>
            </span>
            <div className="callIllustration" aria-hidden="true">
              <i />
              <i />
              <span>Adult connection first</span>
            </div>
          </Link>

          <aside className="readinessPanel" aria-labelledby="readiness-title">
            <div>
              <p className="dashboardEyebrow">Today</p>
              <h2 id="readiness-title">Workspace readiness</h2>
            </div>
            <dl>
              <div>
                <dt>Environment</dt>
                <dd>
                  <span className="statusOk" />
                  Synthetic demo
                </dd>
              </div>
              <div>
                <dt>Child data</dt>
                <dd>None required</dd>
              </div>
              <div>
                <dt>Recording</dt>
                <dd>Off until consent</dd>
              </div>
            </dl>
            <Link href="/child-privacy">
              Review the safety boundary <span aria-hidden="true">↗</span>
            </Link>
          </aside>
        </section>

        <section className="workspaceLinks" aria-labelledby="workspace-title">
          <header>
            <p className="dashboardEyebrow">Workspace</p>
            <h2 id="workspace-title">Everything around the chapter</h2>
          </header>
          <div>
            {workspaceLinks.map((item) => (
              <Link href={item.href} key={item.href}>
                <span>{item.index}</span>
                <strong>{item.title}</strong>
                <p>{item.copy}</p>
                <i aria-hidden="true">→</i>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
