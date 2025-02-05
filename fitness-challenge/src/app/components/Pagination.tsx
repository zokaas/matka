import React from "react";

interface Props {
  page: number;
  setPage: (page: number) => void;
  totalItems: number;
}

const Pagination: React.FC<Props> = ({ page, setPage, totalItems }) => {
  const totalPages = Math.ceil(totalItems / 10);

  return (
    <div className="flex justify-center space-x-4">
      <button
        onClick={() => setPage(Math.max(1, page - 1))}
        disabled={page === 1}
        className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
      >
        Previous
      </button>
      <span>Page {page} of {totalPages}</span>
      <button
        onClick={() => setPage(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
