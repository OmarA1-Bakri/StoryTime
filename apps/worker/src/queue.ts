export type QueueJob<TPayload> = {
  id: string;
  type: string;
  attemptCount: number;
  payload: TPayload;
};

export interface JobQueue<TPayload> {
  claimNext(): Promise<QueueJob<TPayload> | null>;
  markReady(id: string): Promise<void>;
  markFailed(id: string, error: string): Promise<void>;
}

export class InMemoryJobQueue<TPayload> implements JobQueue<TPayload> {
  private readonly jobs: QueueJob<TPayload>[];

  constructor(jobs: QueueJob<TPayload>[] = []) {
    this.jobs = [...jobs];
  }

  async claimNext(): Promise<QueueJob<TPayload> | null> {
    return this.jobs.shift() ?? null;
  }

  async markReady(_id: string): Promise<void> {}
  async markFailed(_id: string, _error: string): Promise<void> {}
}
