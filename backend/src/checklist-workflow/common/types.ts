/**
 * チェックリストワークフロー共通の型定義
 */

export interface ProcessDocumentResult {
  documentId: string;
  pageCount: number;
  pages: { pageNumber: number }[];
}

export interface ExtractTextResult {
  documentId: string;
  pageNumber: number;
}

export interface ParsedChecklistItem {
  id: string;
  name: string;
  description: string;
  parent_id: string | null;
}

export interface ProcessWithLLMResult {
  documentId: string;
  pageNumber: number;
}

export interface CombinePageResult {
  documentId: string;
  pageNumber: number;
}

export interface AggregatePageResult {
  documentId: string;
}
