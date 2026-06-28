"use client";

import { useMemo, useState } from "react";

type Step = "gate" | "dashboard" | "alert" | "connect" | "handoff" | "setup" | "story" | "checkpoint" | "vault";

const steps: Step[] = ["gate", "dashboard", "alert", "connect", "handoff", "setup", "story", "checkpoint", "vault"];
const labels: Record<Step, string> = {
  gate: "Protected gate",
  dashboard: "Adult dashboard",
  alert: "Adventure alert",
  connect: "Adult connect",
  handoff: "Child handoff",
  setup: "Dice setup",
  story: "Story room",
  checkpoint: "Checkpoint",
  vault: "Replay vault"
};

const dice = [
  ["Character", "Space princess"],
  ["Setting", "Moon garden"],
  ["Problem", "Lost starlight"],
  ["Tone", "Silly and brave"],
  ["Visual", "Warm storybook"]
];

export function StoryTimeDemo() {
  const [stepIndex, setStepIndex] = useState(0);
  const [baton, setBaton] = useState<"Dad" | "Rania">("Dad");
  const step = steps[stepIndex];
  const progress = useMemo(() => Math.round(((stepIndex + 1) / steps.length) * 100), [stepIndex]);
  const next = () => setStepIndex((current) => Math.min(current + 1, steps.length - 1));
  const back = () => setStepIndex((current) => Math.max(current - 1, 0));

  return (
    <main className="demoShell">
      <aside className="rail">
        <p className="eyebrow">StoryTime MVP</p>
        <h1>Protected adventure call</h1>
        <div className="meter"><span style={{ width: `${progress}%` }} /></div>
        <nav>{steps.map((item, index) => <button key={item} className={item === step ? "active" : ""} onClick={() => setStepIndex(index)}>{labels[item]}</button>)}</nav>
      </aside>
      <section className="phoneFrame">
        {step === "gate" && <Panel title="Before StoryTime can record" copy="StoryTime records child and adult voice/video, stores private replay chapters, and may send transcript and image prompts to configured AI providers. Children do not get public accounts." cta="Continue to parent verification" onNext={next} />}
        {step === "dashboard" && <Panel title="Dad is waiting for Rania" copy="The child-side adult authenticates, confirms Dad is visible, then starts child-safe mode." cta="Connect with Dad" onNext={next} />}
        {step === "alert" && <Panel title="Dad wants to start a story with Rania" copy="Adventure Call Alert keeps the moment special without exposing child login or contact discovery." cta="Connect with Dad" secondary="Not now" onNext={next} />}
        {step === "connect" && <Panel title="Adult connect" copy="Both adults connect first. The child-side adult confirms the remote adult before handoff." cta="Dad is visible" onNext={next} />}
        {step === "handoff" && <Panel title="Dad is connected" copy="Recording will begin when story setup starts. Hand the phone to Rania when you are ready." cta="Start Child-Safe Mode" onNext={next} />}
        {step === "setup" && <SetupPanel onNext={next} />}
        {step === "story" && <StoryPanel baton={baton} setBaton={setBaton} onNext={next} />}
        {step === "checkpoint" && <Panel title="You’ve been adventuring for 15 minutes" copy="Adult-only checkpoint: continue, pause and save, create ending, end chapter, or replay so far." cta="Pause and save" onNext={next} />}
        {step === "vault" && <VaultPanel />}
      </section>
      <footer className="demoControls"><button onClick={back}>Back</button><button onClick={next}>Next</button></footer>
    </main>
  );
}

function Panel({ title, copy, cta, secondary, onNext }: { title: string; copy: string; cta: string; secondary?: string; onNext: () => void }) {
  return <article className="panel"><h2>{title}</h2><p>{copy}</p><button className="gold" onClick={onNext}>{cta}</button>{secondary && <button className="ghost">{secondary}</button>}</article>;
}

function SetupPanel({ onNext }: { onNext: () => void }) {
  return <article className="panel"><h2>Roll the story dice</h2><div className="diceGrid">{dice.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div><button className="gold" onClick={onNext}>Lock story seed</button></article>;
}

function StoryPanel({ baton, setBaton, onNext }: { baton: "Dad" | "Rania"; setBaton: (value: "Dad" | "Rania") => void; onNext: () => void }) {
  return <article className="storyRoom"><div className="videos"><div>Dad video</div><div>Rania video</div></div><div className="canvas"><p>The storybook is painting {baton}'s idea...</p><h2>The moon-cheese rocket starts to glow.</h2><span className="recording">● Recording</span></div><button className="baton" onClick={() => setBaton(baton === "Dad" ? "Rania" : "Dad")}>Pass baton from {baton}</button><button className="ghost" onClick={onNext}>Show adult checkpoint</button></article>;
}

function VaultPanel() {
  return <article className="panel"><h2>Story saved</h2><p>Rania and the Space Princess · 14 minutes · 8 scenes · 320 MB</p><div className="actions"><button className="gold">Watch</button><button className="ghost">Continue Story</button><button className="ghost">Delete</button></div></article>;
}
