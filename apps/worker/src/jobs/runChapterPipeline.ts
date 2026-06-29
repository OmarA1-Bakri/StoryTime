import { createReviewProvider } from "../providers/providerFactory";
import { buildStoryRun } from "./buildStoryRun";
import { completeReplayJob } from "./completeReplayJob";

export type ChapterPipelineInput = {
  sessionId: string;
  userId: string;
  profileId: string;
  noticeVersion: string;
  prompts: string[];
  trackKeys: string[];
  timelineEventCount: number;
};

export async function runChapterPipeline(input: ChapterPipelineInput) {
  const review = await createReviewProvider().check({ userId: input.userId, profileId: input.profileId, noticeVersion: input.noticeVersion });
  if (!review.accepted) {
    return { sessionId: input.sessionId, status: "blocked" as const, review };
  }

  const story = await buildStoryRun({ sessionId: input.sessionId, userId: input.userId, prompts: input.prompts });
  const replay = await completeReplayJob({ sessionId: input.sessionId, trackKeys: input.trackKeys, timelineEventCount: input.timelineEventCount });

  return { sessionId: input.sessionId, status: replay.status, review, story, replay };
}
