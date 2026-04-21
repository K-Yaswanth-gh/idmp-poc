import { CHECK_LIST_STATUS } from "../../api/features/checklist/domain/model/checklist";
import { makePrismaCheckRepository } from "../../api/features/checklist/domain/repository";

export const checklistErrorHandler = async (event: any) => {
  const checkRepository = await makePrismaCheckRepository();

  try {
    // documentIdが存在する場合のみステータス更新
    if (event.documentId) {
      // エラー詳細を取得
      const errorDetail = event.error
        ? typeof event.error === "string"
          ? event.error
          : JSON.stringify(event.error)
        : "Unknown error occurred";

      await checkRepository.updateDocumentStatus({
        documentId: event.documentId,
        status: CHECK_LIST_STATUS.FAILED,
        errorDetail,
      });
      console.log(`Document status updated to FAILED: ${event.documentId}`);
      console.log(`Error detail: ${errorDetail}`);
    } else {
      console.warn("No documentId provided in error event");
    }
  } catch (error) {
    console.error("Failed to handle error:", error);
  }
};
