export type ClaimableJob = {
  id: string;
  status: "queued" | "processing" | "ready" | "failed";
  attemptCount: number;
};

export function canClaimJob(job: ClaimableJob, maxAttempts = 3): boolean {
  return job.status === "queued" && job.attemptCount < maxAttempts;
}

export function markJobClaimed(job: ClaimableJob): ClaimableJob {
  return { ...job, status: "processing", attemptCount: job.attemptCount + 1 };
}
