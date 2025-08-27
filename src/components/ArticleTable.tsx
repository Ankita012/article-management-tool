import React from 'react'
import type { Article } from '../types'
import ArticleRow from './ArticleRow'

interface ArticleTableProps {
  articles: Article[]
  loading: boolean
  error: string | null
  canEdit: boolean
  pageSize: number
  onView: (article: Article) => void
  onEdit: (article: Article) => void
  onDelete: (id: number) => void
}

const ArticleTable: React.FC<ArticleTableProps> = ({
  articles,
  loading,
  error,
  canEdit,
  pageSize,
  onView,
  onEdit,
  onDelete
}) => {

  // Common base class for all table headers
  const baseHeaderClass = "px-6 py-4 text-xs font-semibold text-primary-700 dark:text-primary-300 uppercase tracking-wider"
  const headerClass = `${baseHeaderClass} text-left`
  const headerClassRight = `${baseHeaderClass} text-right`

 return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-primary-50 dark:bg-primary-900/20">
            <tr>
              <th className={headerClass}>Title</th>
              <th className={headerClass}>Status</th>
              <th className={headerClass}>Author</th>
              <th className={headerClass}>Date</th>
              <th className={headerClassRight}>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              // Show skeleton loaders when loading
              [...Array(pageSize)].map((_, i) => (
                <tr key={i} className="animate-pulse hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-6 py-4 align-top w-1/3">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 align-top">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
                  </td>
                  <td className="px-6 py-4 align-top">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                  </td>
                  <td className="px-6 py-4 align-top">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 mt-1"></div>
                  </td>
                  <td className="px-6 py-4 align-top text-right">
                    <div className="flex justify-end space-x-2">
                      <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                      {canEdit && (
                        <>
                          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : error ? (
              // Show error message in a single row
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                    <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">Error loading articles</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{error}</p>
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => window.location.reload()}
                      className="btn-primary inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Try Again
                    </button>
                  </div>
                </td>
              </tr>
            ) : articles.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                    <svg className="h-6 w-6 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No articles found</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {canEdit ? 'Get started by creating your first article.' : 'There are no articles available at the moment.'}
                  </p>
                  {canEdit && (
                    <div className="mt-6">
                      <button
                        type="button"
                        onClick={() => {
                          console.log('Add article clicked');
                        }}
                        className="btn-primary inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        New Article
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              articles.map((article) => (
                <ArticleRow
                  key={article.id}
                  article={article}
                  canEdit={canEdit}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ArticleTable