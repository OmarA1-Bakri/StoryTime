export type PlanGate = {
  active: boolean;
  remainingUnits: number;
  usedBytes: number;
  limitBytes: number;
};

export function hasRemainingUnit(input: PlanGate): boolean {
  return input.active && input.remainingUnits > 0;
}

export function hasByteCapacity(input: PlanGate, additionalBytes: number): boolean {
  return input.active && input.usedBytes + additionalBytes <= input.limitBytes;
}
