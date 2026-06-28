export * from "./api";
export * from "./domain";
export * from "./events";
export * from "./providers";

export type SetupPhase = "phase-0-setup" | "phase-1-planning";

export interface SetupStatus {
  project: "StoryTime";
  phase: SetupPhase;
  implementationStarted: false;
}
