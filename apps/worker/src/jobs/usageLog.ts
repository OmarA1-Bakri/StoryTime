export type UsageLogEntry = {
  userId: string;
  type: string;
  quantity: number;
  provider?: string;
};

export function createUsageLogEntry(input: UsageLogEntry): UsageLogEntry {
  if (input.quantity < 0) throw new Error("quantity must not be negative");
  return input;
}
