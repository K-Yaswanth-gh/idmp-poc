import { REVIEW_JOB_STATUS } from "../../api/features/review/domain/model/review";
import { makePrismaReviewJobRepository } from "../../api/features/review/domain/repository";

export const reviewErrorHandler = async (event: any) => {
  const reviewJobRepository = await makePrismaReviewJobRepository();

  try {
    // エラー詳細を取得
    const errorDetail = event.error
      ? typeof event.error === "string"
        ? event.error
        : JSON.stringify(event.error)
      : "Unknown error occurred";

    await reviewJobRepository.updateJobStatus({
      reviewJobId: event.reviewJobId,
      status: REVIEW_JOB_STATUS.FAILED,
      errorDetail,
    });
    console.log(`Review job status updated to FAILED: ${event.reviewJobId}`);
    console.log(`Error detail: ${errorDetail}`);
  } catch (error) {
    console.error("Failed to handle error:", error);
  }
};
