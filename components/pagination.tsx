"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages is less than max pages to show
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      // Calculate start and end of page range
      let start = Math.max(2, currentPage - 1)
      let end = Math.min(totalPages - 1, currentPage + 1)

      // Adjust start and end to always show 3 pages in the middle
      if (start === 2) end = Math.min(totalPages - 1, start + 2)
      if (end === totalPages - 1) start = Math.max(2, end - 2)

      // Add ellipsis if needed
      if (start > 2) pages.push("ellipsis1")

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      // Add ellipsis if needed
      if (end < totalPages - 1) pages.push("ellipsis2")

      // Always show last page
      pages.push(totalPages)
    }

    return pages
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="flex items-center justify-center space-x-2 py-8"
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`icon-button ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-secondary"}`}
      >
        <ChevronLeft className="h-5 w-5" />
        <span className="sr-only">Previous page</span>
      </motion.button>

      {getPageNumbers().map((page, index) =>
        typeof page === "string" ? (
          <span key={page} className="px-2 text-muted-foreground">
            &hellip;
          </span>
        ) : (
          <motion.button
            key={page}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 rounded-md flex items-center justify-center transition-colors ${
              currentPage === page ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
            }`}
          >
            {page}
          </motion.button>
        ),
      )}

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`icon-button ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-secondary"}`}
      >
        <ChevronRight className="h-5 w-5" />
        <span className="sr-only">Next page</span>
      </motion.button>
    </motion.div>
  )
}
