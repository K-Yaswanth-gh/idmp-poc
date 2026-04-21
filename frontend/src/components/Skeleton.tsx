import React from "react";

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div className={`animate-pulse bg-aws-paper-light rounded ${className}`}></div>
  );
};

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="overflow-hidden rounded-lg border border-light-gray bg-white shadow-md dark:bg-aws-squid-ink-dark">
      <div className="overflow-x-auto p-2">
        <table className="min-w-full divide-y divide-light-gray">
          <tbody className="divide-y divide-light-gray bg-white dark:bg-aws-squid-ink-dark">
            {Array(rows).fill(0).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {Array(columns).fill(0).map((_, colIndex) => (
                  <td key={colIndex} className="px-6 py-4">
                    <Skeleton className={`h-5 ${colIndex === 0 ? 'w-32' : 'w-24'}`} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

interface DetailSkeletonProps {
  lines?: number;
}

export const DetailSkeleton: React.FC<DetailSkeletonProps> = ({ lines = 5 }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 border border-light-gray">
      <Skeleton className="h-8 w-64 mb-6" />
      <div className="space-y-4">
        {Array(lines).fill(0).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
};

interface TreeSkeletonProps {
  nodes?: number;
}

export const TreeSkeleton: React.FC<TreeSkeletonProps> = ({ nodes = 3 }) => {
  return (
    <div className="space-y-4">
      {Array(nodes).fill(0).map((_, i) => (
        <div key={i} className="bg-white shadow-md rounded-lg p-4 border border-light-gray">
          <div className="flex items-center mb-2">
            <Skeleton className="h-5 w-5 mr-2" />
            <Skeleton className="h-5 w-48" />
          </div>
          <Skeleton className="h-4 w-full mt-2" />
          <Skeleton className="h-4 w-3/4 mt-1" />
          <div className="ml-8 mt-4">
            <div className="space-y-3">
              {Array(2).fill(0).map((_, j) => (
                <div key={j} className="bg-aws-paper-light rounded-lg p-3">
                  <Skeleton className="h-4 w-40 mb-2" />
                  <Skeleton className="h-3 w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default { Skeleton, TableSkeleton, DetailSkeleton, TreeSkeleton };
