export const generatePaginationNumbers = (
  currentPage: number,
  totalPages: number
) => {
  // If there are less than 7 pages, return an array of all pages
  // show all pages without ...
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // if the current page is between the first 3 pages
  // show the first 3 pages and add ... and the last 2 pages
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // if the current page is between the last 3 pages
  // show the first 2 pages and add ... and the last 3 pages
  if (currentPage > totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // if the current page is on other place in the middle
  // show the first page and add ... current page and the other pages
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};
