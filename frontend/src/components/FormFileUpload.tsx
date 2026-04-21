import React from "react";
import { FileUploader } from "./FileUploader";

interface FormFileUploadProps {
  label: string;
  files: File[];
  onFilesChange: (files: File[]) => void;
  required?: boolean;
  error?: string;
  isUploading?: boolean;
  multiple?: boolean;
  className?: string;
  uploadedDocuments?: Array<{ documentId: string; filename: string }>;
  onDeleteFile?: (index: number) => void;
  acceptedFileTypes?: Record<string, string[]>;
}

/**
 * フォームファイルアップロードコンポーネント
 * ラベル付きのファイルアップローダーを表示する共通コンポーネント
 */
export const FormFileUpload: React.FC<FormFileUploadProps> = ({
  label,
  files,
  onFilesChange,
  required = false,
  error,
  isUploading = false,
  multiple = false,
  className = "",
  uploadedDocuments = [],
  onDeleteFile,
  acceptedFileTypes,
}) => {
  return (
    <div className={`mb-6 ${className}`}>
      <label className="block text-aws-squid-ink-light dark:text-aws-font-color-white-dark font-medium mb-2">
        {label} {required && <span className="text-red">*</span>}
      </label>
      <FileUploader
        files={files}
        onFilesChange={onFilesChange}
        isUploading={isUploading}
        multiple={multiple}
        uploadedDocuments={uploadedDocuments}
        onDeleteFile={onDeleteFile}
        acceptedFileTypes={acceptedFileTypes}
      />
      {error && <p className="mt-1 text-red text-sm">{error}</p>}
    </div>
  );
};

export default FormFileUpload;
