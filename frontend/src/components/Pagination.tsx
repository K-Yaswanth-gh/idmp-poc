import React from 'react';
import { useTranslation } from 'react-i18next';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import Button from './Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  isLoading = false,
}) => {
  const { t } = useTranslation();

  if (totalPages <= 1) {
    return null;
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex items-center justify-between border-t border-light-gray bg-white dark:bg-aws-squid-ink-dark px-4 py-3 sm:px-6">
      {/* Mobile view */}
      <div className="flex flex-1 justify-between sm:hidden">
        <Button
          variant="text"
          outline
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1 || isLoading}
          icon={<HiChevronLeft className="h-4 w-4" />}
          iconPosition="left"
        >
          {t('common.previous', 'Previous')}
        </Button>
        <Button
          variant="text"
          outline
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || isLoading}
          icon={<HiChevronRight className="h-4 w-4" />}
          iconPosition="right"
        >
          {t('common.next', 'Next')}
        </Button>
      </div>
      
      {/* Desktop view */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-aws-font-color-gray">
            {t('pagination.showing', 'Showing')}{' '}
            <span className="font-medium text-aws-squid-ink-light dark:text-aws-font-color-white-dark">{startItem}</span>{' '}
            {t('pagination.to', 'to')}{' '}
            <span className="font-medium text-aws-squid-ink-light dark:text-aws-font-color-white-dark">{endItem}</span>{' '}
            {t('pagination.of', 'of')}{' '}
            <span className="font-medium text-aws-squid-ink-light dark:text-aws-font-color-white-dark">{totalItems}</span>{' '}
            {t('pagination.results', 'results')}
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            {/* Previous button */}
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1 || isLoading}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-aws-font-color-gray ring-1 ring-inset ring-light-gray hover:bg-aws-paper-light dark:hover:bg-aws-ui-color-dark focus:z-20 focus:outline-none focus:ring-2 focus:ring-aws-sea-blue-light disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-aws-squid-ink-dark"
            >
              <span className="sr-only">{t('common.previous', 'Previous')}</span>
              <HiChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            
            {/* Page numbers */}
            {visiblePages.map((page, index) => (
              <React.Fragment key={index}>
                {page === '...' ? (
                  <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-aws-font-color-gray ring-1 ring-inset ring-light-gray bg-white dark:bg-aws-squid-ink-dark">
                    ...
                  </span>
                ) : (
                  <button
                    onClick={() => onPageChange(page as number)}
                    disabled={isLoading}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-light-gray hover:bg-aws-paper-light dark:hover:bg-aws-ui-color-dark focus:z-20 focus:outline-none focus:ring-2 focus:ring-aws-sea-blue-light disabled:cursor-not-allowed ${
                      currentPage === page
                        ? 'z-10 bg-aws-sea-blue-light text-aws-font-color-white-light'
                        : 'text-aws-squid-ink-light dark:text-aws-font-color-white-dark bg-white dark:bg-aws-squid-ink-dark'
                    }`}
                  >
                    {page}
                  </button>
                )}
              </React.Fragment>
            ))}
            
            {/* Next button */}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages || isLoading}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-aws-font-color-gray ring-1 ring-inset ring-light-gray hover:bg-aws-paper-light dark:hover:bg-aws-ui-color-dark focus:z-20 focus:outline-none focus:ring-2 focus:ring-aws-sea-blue-light disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-aws-squid-ink-dark"
            >
              <span className="sr-only">{t('common.next', 'Next')}</span>
              <HiChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;