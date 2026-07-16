"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Step =
  | "gate"
  | "dashboard"
  | "alert"
  | "connect"
  | "handoff"
  | "setup"
  | "story"
  | "checkpoint"
  | "vault";

const steps: Step[] = [
  "gate",
  "dashboard",
  "alert",
  "connect",
  "handoff",
  "setup",
  "story",
  "checkpoint",
  "vault",
];

const labels: Record<Step, string> = {
  gate: "Protected gate",
  dashboard: "Adult dashboard",
  alert: "Adventure alert",
  connect: "Adult connect",
  handoff: "Child handoff",
  setup: "Dice setup",
  story: "Story room",
  checkpoint: "Checkpoint",
  vault: "Replay vault",
};

const dice = [
  ["Character", "Space princess"],
  ["Setting", "Moon garden"],
  ["Problem", "Lost starlight"],
  ["Tone", "Silly and brave"],
  ["Visual", "Warm storybook"],
];

export function StoryTimeDemo() {
  const [stepIndex, setStepIndex] = useState(0);
  const [baton, setBaton] = useState<"Dad" | "Rania">("Dad");
  const step = steps[stepIndex];
  const progress = useMemo(() => Math.round(((stepIndex + 1) / steps.length) * 100), [stepIndex]);
  const next = () => setStepIndex((current) => Math.min(current + 1, steps.length - 1));
  const back = () => setStepIndex((current) => Math.max(current - 1, 0));

  return (
    <main className="demoPage">
      <header className="demoHeader">
        <Link className="demoBrand" href="/" aria-label="StoryTime home">
          <span aria-hidden="true">ST</span>
          StoryTime
        </Link>
        <div className="demoHeaderMeta">
          <span>Synthetic walkthrough</span>
          <Link href="/child-privacy">Child privacy</Link>
        </div>
      </header>

      <div className="demoShell">
        <aside className="demoRail">
          <p className="eyebrow">Protected adventure call</p>
          <h1>Follow the trust boundary, step by step.</h1>
          <p className="railIntro">
            This staged walkthrough uses fictional family data and makes each adult control visible
            before a child enters the story.
          </p>

          <div
            className="demoMeter"
            role="progressbar"
            aria-label="Demo progress"
            aria-valuemin={1}
            aria-valuemax={steps.length}
            aria-valuenow={stepIndex + 1}
          >
            <span style={{ width: `${progress}%` }} />
          </div>
          <p className="progressLabel">
            <strong>{String(stepIndex + 1).padStart(2, "0")}</strong>
            <span>of {String(steps.length).padStart(2, "0")}</span>
          </p>

          <nav className="stepNav" aria-label="Walkthrough steps">
            {steps.map((item, index) => (
              <button
                key={item}
                type="button"
                className={item === step ? "active" : ""}
                aria-current={item === step ? "step" : undefined}
                onClick={() => setStepIndex(index)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                {labels[item]}
              </button>
            ))}
          </nav>

          <p className="railNote">
            <span aria-hidden="true" />
            No real recording or provider request occurs in this demo.
          </p>
        </aside>

        <section className="deviceStage" aria-label={`${labels[step]} preview`}>
          <div className="deviceFrame">
            <div className="deviceChrome" aria-hidden="true">
              <span>9:41</span>
              <i />
              <span>Protected</span>
            </div>
            <div className="deviceScreen" key={step} aria-live="polite">
              {step === "gate" && (
                <Panel
                  kicker="Adult control · 01"
                  title="Before StoryTime can record"
                  copy="StoryTime records child and adult voice/video, stores private replay chapters, and may send transcript and image prompts to configured AI providers. Children do not get public accounts."
                  cta="Continue to parent verification"
                  onNext={next}
                />
              )}
              {step === "dashboard" && (
                <Panel
                  kicker="Nearby adult · 02"
                  title="Dad is waiting for Rania"
                  copy="The child-side adult authenticates, confirms Dad is visible, then starts child-safe mode."
                  cta="Connect with Dad"
                  onNext={next}
                />
              )}
              {step === "alert" && (
                <Panel
                  kicker="Invitation · 03"
                  title="Dad wants to start a story with Rania"
                  copy="Adventure Call Alert keeps the moment special without exposing child login or contact discovery."
                  cta="Connect with Dad"
                  secondary="Not now"
                  onNext={next}
                />
              )}
              {step === "connect" && (
                <Panel
                  kicker="Unrecorded lobby · 04"
                  title="Adults connect first"
                  copy="Both adults meet in an unrecorded lobby. The child-side adult confirms the remote adult before handoff."
                  cta="Dad is visible"
                  onNext={next}
                />
              )}
              {step === "handoff" && (
                <Panel
                  kicker="Handoff · 05"
                  title="Dad is connected"
                  copy="Recording begins only when story setup starts. Hand the phone to Rania when you are ready."
                  cta="Start child-safe mode"
                  onNext={next}
                />
              )}
              {step === "setup" && <SetupPanel onNext={next} />}
              {step === "story" && <StoryPanel baton={baton} setBaton={setBaton} onNext={next} />}
              {step === "checkpoint" && (
                <Panel
                  kicker="Adult-only checkpoint · 08"
                  title="You’ve been adventuring for 15 minutes"
                  copy="Continue, pause and save, create an ending, end the chapter, or replay the story so far."
                  cta="Pause and save"
                  onNext={next}
                />
              )}
              {step === "vault" && <VaultPanel />}
            </div>
          </div>

          <footer className="demoControls" aria-label="Demo controls">
            <button type="button" onClick={back} disabled={stepIndex === 0}>
              <span aria-hidden="true">←</span> Back
            </button>
            <span>{labels[step]}</span>
            <button type="button" onClick={next} disabled={stepIndex === steps.length - 1}>
              Next <span aria-hidden="true">→</span>
            </button>
          </footer>
        </section>
      </div>
    </main>
  );
}

function Panel({
  kicker,
  title,
  copy,
  cta,
  secondary,
  onNext,
}: {
  kicker: string;
  title: string;
  copy: string;
  cta: string;
  secondary?: string;
  onNext: () => void;
}) {
  return (
    <article className="demoPanel">
      <div className="panelMark" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <p className="panelKicker">{kicker}</p>
      <h2>{title}</h2>
      <p className="panelCopy">{copy}</p>
      <div className="panelActions">
        <button type="button" className="demoPrimary" onClick={onNext}>
          {cta}
        </button>
        {secondary && (
          <button type="button" className="demoSecondary">
            {secondary}
          </button>
        )}
      </div>
      <p className="assurance">
        <span aria-hidden="true" /> Adult-controlled action
      </p>
    </article>
  );
}

function SetupPanel({ onNext }: { onNext: () => void }) {
  return (
    <article className="demoPanel setupPanel">
      <p className="panelKicker">Child-safe mode · 06</p>
      <h2>Roll the story dice</h2>
      <p className="panelCopy">Five choices give this chapter its own curious little world.</p>
      <div className="diceGrid">
        {dice.map(([label, value], index) => (
          <div key={label}>
            <span>
              {String(index + 1).padStart(2, "0")} · {label}
            </span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
      <button type="button" className="demoPrimary" onClick={onNext}>
        Lock story seed
      </button>
    </article>
  );
}

function StoryPanel({
  baton,
  setBaton,
  onNext,
}: {
  baton: "Dad" | "Rania";
  setBaton: (value: "Dad" | "Rania") => void;
  onNext: () => void;
}) {
  const nextSpeaker = baton === "Dad" ? "Rania" : "Dad";

  return (
    <article className="storyRoom">
      <header className="storyRoomHeader">
        <div>
          <p className="panelKicker">Live chapter · 07</p>
          <strong>The moon garden</strong>
        </div>
        <span className="recording">
          <i /> Recording
        </span>
      </header>
      <div className="videos" aria-label="Call participants">
        <div>
          <span>D</span>
          <strong>Dad</strong>
          <small>Remote adult</small>
        </div>
        <div>
          <span>R</span>
          <strong>Rania</strong>
          <small>Child-safe mode</small>
        </div>
      </div>
      <div className="storyCanvas">
        <div className="canvasMoon" aria-hidden="true" />
        <div className="canvasLandscape" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <p>Scene 04 · shaping {baton}&apos;s idea</p>
        <h2>The moon-cheese rocket starts to glow.</h2>
      </div>
      <div className="storyActions">
        <button type="button" className="batonButton" onClick={() => setBaton(nextSpeaker)}>
          Pass the story baton <span aria-hidden="true">→</span>
          <small>{nextSpeaker}&apos;s turn next</small>
        </button>
        <button type="button" className="demoSecondary" onClick={onNext}>
          Adult checkpoint
        </button>
      </div>
    </article>
  );
}

function VaultPanel() {
  return (
    <article className="demoPanel vaultPanel">
      <p className="panelKicker">Private replay vault · 09</p>
      <h2>Story saved</h2>
      <div className="chapterCover" aria-hidden="true">
        <span>Chapter 01</span>
        <strong>The lost starlight</strong>
        <div>
          <i />
          <i />
          <i />
        </div>
      </div>
      <div className="chapterDetails">
        <strong>Rania and the Space Princess</strong>
        <span>14 minutes · 8 scenes · Private family replay</span>
      </div>
      <div className="panelActions">
        <button type="button" className="demoPrimary">
          Watch chapter
        </button>
        <button type="button" className="demoSecondary">
          Continue story
        </button>
        <button type="button" className="textButton">
          Delete
        </button>
      </div>
    </article>
  );
}
