export type SetupPhase = "phase-0-setup" | "phase-1-planning";

export interface SetupStatus {
  project: "StoriTime";
  phase: SetupPhase;
  implementationStarted: false;
}
