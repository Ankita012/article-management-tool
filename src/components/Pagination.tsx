import React from 'react'
import type { PaginationParams } from '../types'
import { Button } from './ui'

interface PaginationProps {
  pagination: PaginationParams
  loading: boolean
  onPageChange: (newPage: number) => void
}

const Pagination: React.FC<PaginationProps> = ({
  pagination,
  loading,
  onPageChange
}) => {
  if (pagination.totalPages <= 1) return null

  // Create array of page numbers to display
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    const halfVisible = Math.floor(maxVisiblePages / 2)
    
    let startPage = Math.max(1, pagination.page - halfVisible)
    const endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1)
    
    // Adjust startPage if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    
    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-sm text-gray-700 dark:text-gray-300">
        Showing <span className="font-medium">{((pagination.page - 1) * pagination.pageSize) + 1}</span> to{' '}
        <span className="font-medium">{Math.min(pagination.page * pagination.pageSize, pagination.totalItems)}</span> of{' '}
        <span className="font-medium">{pagination.totalItems}</span> results
      </div>
      
      <div className="flex items-center space-x-1">
        <Button
          variant="secondary"
          size="sm"
          disabled={pagination.page <= 1 || loading}
          onClick={() => onPageChange(pagination.page - 1)}
          className="rounded-lg px-3 py-2 transition-all duration-200 hover:scale-105"
        >
          Previous
        </Button>
        
        {pageNumbers.map(page => (
          <Button
            key={page}
            variant={pagination.page === page ? "primary" : "secondary"}
            size="sm"
            onClick={() => onPageChange(page)}
            className={`rounded-lg px-3 py-2 transition-all duration-200 hover:scale-105 `}
            disabled={loading}
          >
            {page}
          </Button>
        ))}
        
        <Button
          variant="secondary"
          size="sm"
          disabled={pagination.page >= pagination.totalPages || loading}
          onClick={() => onPageChange(pagination.page + 1)}
          className="rounded-lg px-3 py-2 transition-all duration-200 hover:scale-105"
        >
          Next
        </Button>
        
        {loading && (
          <div className="ml-3">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-solid border-primary-600 border-r-transparent"></div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Pagination