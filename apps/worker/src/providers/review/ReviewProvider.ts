export type ReviewProviderInput = {
  userId: string;
  profileId: string;
  noticeVersion: string;
};

export type ReviewProviderResult = {
  accepted: boolean;
  checkedAt: number;
};

export interface ReviewProvider {
  check(input: ReviewProviderInput): Promise<ReviewProviderResult>;
}

export class MockReviewProvider implements ReviewProvider {
  async check(_input: ReviewProviderInput): Promise<ReviewProviderResult> {
    return { accepted: true, checkedAt: Date.now() };
  }
}
