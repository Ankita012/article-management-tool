import React from 'react'
import { Eye, Edit, Trash2 } from 'lucide-react'
import { ArticleStatus } from '../types'
import type { Article } from '../types'

interface ArticleRowProps {
  article: Article
  canEdit: boolean
  onView: (article: Article) => void
  onEdit: (article: Article) => void
  onDelete: (id: number) => void
  showStatus?: boolean
}

interface ActionIconProps {
  icon: React.ComponentType<{ className?: string }>
  onClick: () => void
  ariaLabel: string
  className?: string
  title?: string
}

const ActionIcon: React.FC<ActionIconProps> = ({ icon: Icon, onClick, ariaLabel, className = "", title = "" }) => (
  <button
    onClick={onClick}
    aria-label={ariaLabel}
    title={title || ariaLabel}
    className={`p-2 transition-all duration-200 hover:scale-105 ${className}`}
  >
    <Icon className="h-4 w-4" />
  </button>
)

const ArticleRow: React.FC<ArticleRowProps> = ({
  article,
  canEdit,
  onView,
  onEdit,
  onDelete,
  showStatus = true
}) => {
  // Common class names
  const cellBaseClass = "px-6 py-4 align-top"
  const textSecondaryClass = "text-sm text-gray-600 dark:text-gray-400"
  
  // Status badge styling
  const getStatusBadgeClass = (status: ArticleStatus) => {
    const baseClass = "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all duration-200"
    return status === ArticleStatus.PUBLISHED
      ? `${baseClass} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400`
      : `${baseClass} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300`
  }
  
  // Date formatting functions
  const formatDate = (dateString: string) => 
    new Date(dateString).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
  
  const formatTime = (dateString: string) => 
    new Date(dateString).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })

  return (
    <tr
      key={article.id}
      className="hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all duration-200 ease-in-out transform hover:-translate-y-0.5"
    >
      <td className={`${cellBaseClass} w-1/3`}>
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{article.title}</p>
          </div>
        </div>
      </td>
      
      {showStatus && (
        <td className={cellBaseClass}>
          <span className={getStatusBadgeClass(article.status)}>
            {article.status}
          </span>
        </td>
      )}
      
      <td className={`${cellBaseClass} ${textSecondaryClass} whitespace-nowrap`}>
        {article.author}
      </td>
      
      <td className={`${cellBaseClass} ${textSecondaryClass} whitespace-nowrap`}>
        <div className="flex flex-col">
          <span>{formatDate(article.createdAt)}</span>
          <span className="text-xs text-gray-500 dark:text-gray-500">
            {formatTime(article.createdAt)}
          </span>
        </div>
        {article.updatedAt && article.updatedAt !== article.createdAt && (
          <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            Updated {formatDate(article.updatedAt)}
          </div>
        )}
      </td>
      
      <td className={`${cellBaseClass} text-right`}>
        <div className="inline-flex items-center space-x-2">
          <ActionIcon
            icon={Eye}
            onClick={() => onView(article)}
            ariaLabel="View article"
            className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            title="View article"
          />
          {canEdit && (
            <>
              <ActionIcon
                icon={Edit}
                onClick={() => onEdit(article)}
                ariaLabel="Edit article"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                title="Edit article"
              />
              <ActionIcon
                icon={Trash2}
                onClick={() => onDelete(article.id)}
                ariaLabel="Delete article"
                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
                title='Delete article'
              />
            </>
          )}
        </div>
      </td>
    </tr>
  )
}

export default ArticleRow