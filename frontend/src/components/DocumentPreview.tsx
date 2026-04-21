import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { usePresignedDownloadUrl } from "../hooks/usePresignedDownloadUrl";
import Spinner from "./Spinner";
import { HiExternalLink } from "react-icons/hi";

interface DocumentPreviewProps {
  s3Key: string;
  filename: string;
  pageNumber?: number;
}

export default function DocumentPreview({
  s3Key,
  filename,
  pageNumber,
}: DocumentPreviewProps) {
  const { t } = useTranslation();
  const [url, setUrl] = useState<string | null>(null);
  const { getPresignedUrl, getPdfPageUrl, isLoading, error } =
    usePresignedDownloadUrl();

  useEffect(() => {
    const fetchUrl = async () => {
      try {
        if (pageNumber) {
          const pdfUrl = await getPdfPageUrl(s3Key, pageNumber);
          setUrl(pdfUrl);
        } else {
          const presignedUrl = await getPresignedUrl(s3Key);
          setUrl(presignedUrl);
        }
      } catch (err) {
        console.error("Failed to get presigned URL", err);
      }
    };

    fetchUrl();
  }, [s3Key, pageNumber]);

  if (isLoading) {
    return <Spinner size="sm" />;
  }

  if (error) {
    return (
      <div className="text-red-500">{t("common.documentUrlError")}</div>
    );
  }

  if (!url) {
    return null;
  }

  return (
    <div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center text-aws-sea-blue hover:underline"
      >
        <span>{filename}</span>
        {pageNumber && <span className="ml-1">{t("common.pageNumber", { page: pageNumber })}</span>}
        <HiExternalLink className="ml-1 h-4 w-4" />
      </a>
    </div>
  );
}
