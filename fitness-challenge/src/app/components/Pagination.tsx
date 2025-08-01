import React from "react";
import { useTheme } from "@/app/hooks/useTheme";

interface Props {
  page: number;
  setPage: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

const Pagination: React.FC<Props> = ({
  page,
  setPage,
  totalItems,
  itemsPerPage,
}) => {
  const { t } = useTheme();
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Don't render pagination if there's only one page
  if (totalPages <= 1) return null;

  const handlePrevious = () => setPage(Math.max(1, page - 1));
  const handleNext = () => setPage(Math.min(totalPages, page + 1));

  return (
    <nav
      aria-label="Pagination"
      className="flex justify-center items-center mt-6"
    >
      <div className="flex items-center space-x-2">
        <button
          onClick={handlePrevious}
          disabled={page === 1}
          aria-label="Go to previous page"
          className="px-4 py-2 rounded text-gray-600 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span aria-hidden="true">&larr;</span>
          <span className="ml-2">{t.pagination.previous}</span>
        </button>

        <div className="px-4 font-medium">
          {page}{t.pagination.of}{totalPages}
        </div>

        <button
          onClick={handleNext}
          disabled={page >= totalPages}
          aria-label="Go to next page"
          className="px-4 py-2 rounded text-gray-600 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span>{t.pagination.next}</span>
          <span aria-hidden="true" className="ml-2">
            &rarr;
          </span>
        </button>
      </div>
    </nav>
  );
};

export default Pagination;