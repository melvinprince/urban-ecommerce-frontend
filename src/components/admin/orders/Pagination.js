"use client";

export default function Pagination({ pagination, onPageChange }) {
  const { currentPage, totalPages } = pagination;

  if (totalPages <= 1) return null;

  const handleClick = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center mt-6 space-x-2">
      <button
        onClick={() => handleClick(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 border rounded ${
          currentPage === 1 ? "bg-gray-200" : "hover:bg-gray-100"
        }`}
      >
        Prev
      </button>

      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => handleClick(page)}
          className={`px-3 py-1 border rounded ${
            currentPage === page ? "bg-sgr text-white" : "hover:bg-gray-100"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => handleClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 border rounded ${
          currentPage === totalPages ? "bg-gray-200" : "hover:bg-gray-100"
        }`}
      >
        Next
      </button>
    </div>
  );
}
