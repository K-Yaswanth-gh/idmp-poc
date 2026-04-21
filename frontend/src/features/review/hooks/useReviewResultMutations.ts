import { useApiClient } from "../../../hooks/useApiClient";
import { mutate } from "swr";
import type {
  OverrideReviewResultRequest,
  OverrideReviewResultResponse,
} from "../types";
import { getReviewResultItemsKey } from "./useReviewResultQueries";

/**
 * 審査結果を更新するカスタムフック
 */
export function useUpdateReviewResult(jobId: string) {
  const { mutateAsync, status, error } = useApiClient().useMutation<
    OverrideReviewResultResponse,
    OverrideReviewResultRequest
  >("put", `/review-jobs/${jobId}/results`);

  const updateReviewResult = async (
    resultId: string,
    body: OverrideReviewResultRequest
  ) => {
    const res = await mutateAsync(
      body,
      `/review-jobs/${jobId}/results/${resultId}`
    );
    // キャッシュ更新
    mutate(getReviewResultItemsKey(jobId));
    mutate(
      (key) =>
        typeof key === "string" &&
        key.startsWith(`/review-jobs/${jobId}/results`)
    );
    return res;
  };

  return { updateReviewResult, status, error };
}
