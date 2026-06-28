export type LocalJob = { id: string; status: "queued" | "processing" | "ready" };

export function nextQueuedJob(jobs: LocalJob[]): LocalJob | undefined {
  return jobs.find((job) => job.status === "queued");
}
