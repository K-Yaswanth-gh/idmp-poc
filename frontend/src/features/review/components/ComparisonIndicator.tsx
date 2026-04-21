import React from "react";
import { useTranslation } from "react-i18next";
import { HiDocumentDuplicate, HiChevronDoubleRight } from "react-icons/hi";

interface ComparisonIndicatorProps {
  isReady: boolean;
}

export const ComparisonIndicator: React.FC<ComparisonIndicatorProps> = ({
  isReady,
}) => {
  const { t } = useTranslation();
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div
        className={`flex h-16 w-16 items-center justify-center rounded-full ${
          isReady
            ? "bg-aws-sea-blue-light text-aws-font-color-white-light"
            : "bg-light-gray text-aws-font-color-gray"
        }`}>
        <HiDocumentDuplicate className="h-8 w-8" />
      </div>

      <div className="mt-4 text-center">
        <p
          className={`font-medium ${isReady ? "text-aws-squid-ink-light" : "text-aws-font-color-gray"}`}>
          {isReady
            ? t("review.comparisonReady")
            : t("review.selectFilesAndChecklist")}
        </p>
        <p className="mt-1 text-sm text-aws-font-color-gray">
          {isReady
            ? t("review.canRunComparison")
            : t("review.selectBothToCompare")}
        </p>
      </div>

      <div className="mt-6">
        <div className="flex items-center">
          <div className="h-0.5 w-16 bg-aws-sea-blue-light"></div>
          <HiChevronDoubleRight className="mx-2 h-6 w-6 text-aws-sea-blue-light" />
          <div className="h-0.5 w-16 bg-aws-sea-blue-light"></div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonIndicator;
