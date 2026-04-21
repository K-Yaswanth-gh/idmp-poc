import React from 'react';
import { useTranslation } from 'react-i18next';
import { ReviewJob } from '../types';

interface ReviewJobItemProps {
  job: ReviewJob;
  onClick?: (job: ReviewJob) => void;
}

export const ReviewJobItem: React.FC<ReviewJobItemProps> = ({ job, onClick }) => {
  const { t, i18n } = useTranslation();

  // ステータスに応じたバッジの色を設定
  const getStatusBadgeClass = (status: ReviewJob['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // 日付のフォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(i18n.language, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div 
      className="bg-white dark:bg-aws-squid-ink-dark p-4 rounded-md shadow-sm border border-gray-200 hover:border-aws-sea-blue-light cursor-pointer transition-colors"
      onClick={() => onClick && onClick(job)}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-medium text-aws-squid-ink-light dark:text-aws-font-color-white-dark">{job.name}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(job.status)}`}>
          {t(`status.${job.status}`)}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-sm text-aws-font-color-gray">
        <div>
          <p className="mb-1">
            <span className="font-medium">{t('review.documents')}:</span> {job.documentName}
          </p>
          <p>
            <span className="font-medium">{t('review.checklist')}:</span> {job.checklistName}
          </p>
        </div>
        <div className="text-right">
          <p className="mb-1">
            <span className="font-medium">{t('review.createdAt')}:</span> {formatDate(job.createdAt)}
          </p>
          <p>
            <span className="font-medium">{t('review.updatedAt', 'Updated At')}:</span> {formatDate(job.updatedAt)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReviewJobItem;
