export type ConnectionMode = "full" | "reduced";

export type ConnectionInput = {
  score: number;
};

export function modeForConnection(input: ConnectionInput): ConnectionMode {
  return input.score < 0.5 ? "reduced" : "full";
}
