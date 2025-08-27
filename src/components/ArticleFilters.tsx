import React, { useState } from 'react';
import { Filter, Plus, Search } from 'lucide-react';
import { ArrowDownUp } from 'lucide-react';
import { ArticleStatus } from '../types';
import type { ArticleFilters as ArticleFiltersType } from '../types';
import { SearchInput, Dropdown, Button } from './ui';

interface ArticleFiltersProps {
  filters: ArticleFiltersType
  canEdit: boolean
  onSearchChange: (search: string) => void
  onStatusFilter: (status: ArticleStatus[]) => void
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void
  onAddArticle: () => void
}

const ArticleFilters: React.FC<ArticleFiltersProps> = ({ 
  filters, 
  canEdit,
  onSearchChange, 
  onStatusFilter, 
  onSortChange,
  onAddArticle
}) => {
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  const handleStatusSelect = (value: string) => {
    onStatusFilter(value ? [value as ArticleStatus] : []);
    setIsStatusDropdownOpen(false); // Close dropdown after selection
  };

  const handleSortSelect = (sortBy: string, sortOrder: 'asc' | 'desc') => {
    onSortChange(sortBy, sortOrder);
    setIsSortDropdownOpen(false); // Close dropdown after selection
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex flex-col sm:flex-row gap-4 flex-1">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-40" />
            </div>
            <SearchInput
              value={filters.search}
              onChange={onSearchChange}
              placeholder="Search articles..."
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="w-full sm:w-48" data-testid="status-filter-wrapper">
          <Dropdown
            isOpen={isStatusDropdownOpen}
            onOpenChange={setIsStatusDropdownOpen}
            trigger={
              <Button variant="secondary" size="md" className="rounded-lg py-3 font-medium w-full sm:w-40" title='Filter by status'>
                <Filter className="h-4 w-4 mr-2 " />
                {filters.status.length === 1 ? filters.status[0] : 'Filter by status'}
              </Button>
            }
          >
            <div className="py-1">
              {[{ value: '', label: 'All Status' },
                { value: ArticleStatus.PUBLISHED, label: 'Published' },
                { value: ArticleStatus.DRAFT, label: 'Draft' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleStatusSelect(option.value)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-100 w-full text-left dark:text-gray-300 dark:hover:bg-primary-900/30 focus:outline-none focus:bg-primary-10 dark:focus:bg-primary-900/30"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </Dropdown>
        </div>

        <Dropdown
          isOpen={isSortDropdownOpen}
          onOpenChange={setIsSortDropdownOpen}
          trigger={
            <Button variant="secondary" size="md" className="rounded-lg py-3 font-medium w-full sm:w-36" title='Sort articles'>
              <ArrowDownUp className="h-4 w-4 mr-2" />
              Sort
            </Button>
          }
        >
          <div className="py-1">
            <button
              onClick={() => handleSortSelect('createdAt', 'desc')}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-100 w-full text-left dark:text-gray-300 dark:hover:bg-primary-900/30 focus:outline-none focus:bg-primary-10 dark:focus:bg-primary-900/30"
            >
              Newest First
            </button>
            <button
              onClick={() => handleSortSelect('createdAt', 'asc')}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-100 w-full text-left dark:text-gray-300 dark:hover:bg-primary-900/30 focus:outline-none focus:bg-primary-10 dark:focus:bg-primary-900/30"
            >
              Oldest First
            </button>
            <button
              onClick={() => handleSortSelect('title', 'asc')}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-100 w-full text-left dark:text-gray-300 dark:hover:bg-primary-900/30 focus:outline-none focus:bg-primary-10 dark:focus:bg-primary-900/30"
            >
              Title A-Z
            </button>
            <button
              onClick={() => handleSortSelect('author', 'asc')}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-100 w-full text-left dark:text-gray-300 dark:hover:bg-primary-900/30 focus:outline-none focus:bg-primary-10 dark:focus:bg-primary-900/30"
            >
              Author A-Z
            </button>
          </div>
        </Dropdown>
      </div>

      {/* Add Article Button */}
      {canEdit && (
        <Button variant="primary" size="md" onClick={onAddArticle} className="rounded-lg px-4 py-3 font-bold" title='Add new article'>
          <Plus className="h-4 w-4 mr-2" />
          Add Article
        </Button>
      )}
    </div>
  )
}

export default ArticleFilters