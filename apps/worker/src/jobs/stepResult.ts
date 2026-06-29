export type StepResultInput = {
  id: string;
  text: string;
  caption: string;
};

export type StepResult = StepResultInput & { status: "done" };

export function buildStepResult(input: StepResultInput): StepResult {
  if (input.text.trim().length === 0) throw new Error("text is required");
  if (input.caption.trim().length === 0) throw new Error("caption is required");
  return { ...input, status: "done" };
}
