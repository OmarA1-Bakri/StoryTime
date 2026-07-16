import Link from "next/link";
import "./home.css";

const chapterFlow = [
  {
    number: "01",
    eyebrow: "Adults connect first",
    title: "A quiet lobby before the story begins.",
    copy: "Trusted adults join an unrecorded space, confirm who is present, and accept the chapter recording together.",
  },
  {
    number: "02",
    eyebrow: "The child takes the stage",
    title: "One idea at a time, passed like a baton.",
    copy: "The nearby adult hands over a locked child-safe screen. The family alternates short turns while StoryTime shapes their ideas into scenes.",
  },
  {
    number: "03",
    eyebrow: "A private chapter remains",
    title: "The call becomes a memory worth replaying.",
    copy: "Separate recordings and the ordered story ledger are assembled into one private chapter for the family Vault.",
  },
];

const trustPoints = [
  "Adult-controlled consent and handoff",
  "Only submitted turns go to story AI",
  "Private replay access, checked every time",
  "Clear recording state for both adults",
];

function StoryPortal() {
  return (
    <div
      className="storyPortal"
      role="img"
      aria-label="A protected family video call becoming an illustrated story chapter"
    >
      <div className="portalOrbit portalOrbitOuter" />
      <div className="portalOrbit portalOrbitInner" />
      <div className="callWindow">
        <div className="callWindowTopline">
          <span className="statusDot" />
          Protected family call
        </div>
        <div className="callParticipants">
          <div className="participant participantRemote">
            <span className="participantPortrait">G</span>
            <strong>Grandad</strong>
            <small>Remote adult</small>
          </div>
          <div className="participant participantChild">
            <span className="participantPortrait">R</span>
            <strong>Rania</strong>
            <small>Child-safe mode</small>
          </div>
        </div>
        <div className="turnRibbon">
          <span>Story baton</span>
          <strong>Grandad&apos;s turn</strong>
        </div>
      </div>
      <div className="storyLeaf storyLeafOne" />
      <div className="storyLeaf storyLeafTwo" />
      <div className="sceneCard">
        <span>Scene 04</span>
        <strong>The moon garden wakes</strong>
        <div className="sceneHorizon">
          <i />
          <i />
          <i />
        </div>
      </div>
      <p className="portalCaption">Live voices in. One family chapter out.</p>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="landing">
      <header className="siteHeader">
        <Link className="brand" href="/" aria-label="StoryTime home">
          <span className="brandSeal" aria-hidden="true">
            ST
          </span>
          <span>StoryTime</span>
        </Link>
        <nav className="siteNav" aria-label="Primary navigation">
          <a href="#how-it-works">How it works</a>
          <Link href="/child-privacy">Child privacy</Link>
          <Link className="navCta" href="/sign-in">
            Adult sign in
          </Link>
        </nav>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <div className="heroCopy">
          <p className="eyebrow">Private beta for families apart</p>
          <h1 id="hero-title">StoryTime turns family calls into replayable adventures.</h1>
          <p className="lede">
            A remote adult and child co-create a short story chapter on a protected live call, then
            keep the moment as a private family memory.
          </p>
          <div className="actions">
            <Link className="primary" href="/demo">
              Open MVP demo
            </Link>
            <a className="secondary" href="#trust-boundary">
              See the safety boundary
            </a>
          </div>
          <p className="betaNote">
            Synthetic demo only. No real child data is required to explore the experience.
          </p>
        </div>
        <StoryPortal />
      </section>

      <section className="trustBand" aria-label="StoryTime trust principles">
        <p>Built around one non-negotiable boundary</p>
        <div className="trustTicker">
          {trustPoints.map((point) => (
            <span key={point}>{point}</span>
          ))}
        </div>
      </section>

      <section className="chapterFlow" id="how-it-works" aria-labelledby="flow-title">
        <header className="sectionIntro">
          <p className="eyebrow">One chapter, end to end</p>
          <h2 id="flow-title">The relationship stays at the centre. Technology works backstage.</h2>
        </header>
        <ol className="flowList">
          {chapterFlow.map((item) => (
            <li key={item.number}>
              <span className="flowNumber">{item.number}</span>
              <div>
                <p>{item.eyebrow}</p>
                <h3>{item.title}</h3>
                <span>{item.copy}</span>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="trustBoundary" id="trust-boundary" aria-labelledby="trust-title">
        <div className="boundaryStatement">
          <p className="eyebrow">The trust boundary</p>
          <h2 id="trust-title">The lobby is unrecorded. A child never has an account.</h2>
        </div>
        <div className="boundaryDetails">
          <p>
            Recording authority begins only after both adults accept, the nearby adult confirms
            handoff, and the device enters a distinct child-safe session.
          </p>
          <Link href="/child-privacy">Read how child privacy works</Link>
        </div>
      </section>

      <section className="closingChapter" aria-labelledby="closing-title">
        <p className="eyebrow">A small ritual for big distances</p>
        <h2 id="closing-title">Make tonight&apos;s call the chapter they ask to watch again.</h2>
        <div className="actions">
          <Link className="primary" href="/demo">
            Walk through the protected call
          </Link>
          <Link className="textLink" href="/privacy">
            Privacy overview
          </Link>
        </div>
      </section>

      <footer className="siteFooter">
        <div>
          <strong>StoryTime</strong>
          <span>Private family stories, made together.</span>
        </div>
        <nav aria-label="Footer navigation">
          <Link href="/terms">Terms</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/child-privacy">Child privacy</Link>
        </nav>
      </footer>
    </main>
  );
}
