import React from 'react'
import { ArticleStatus } from '../types'
import type { Article } from '../types'

interface ArticleDetailsProps {
  article: Article
}

interface InfoFieldProps {
  label: string
  children: React.ReactNode
}

const InfoField: React.FC<InfoFieldProps> = ({ label, children }) => (
  <div>
    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</h3>
    {children}
  </div>
)

interface ContentSectionProps {
  title: string
  children: React.ReactNode
  className?: string
}

const ContentSection: React.FC<ContentSectionProps> = ({ title, children, className = "" }) => (
  <div className={`py-2 ${className}`}>
    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{title}</h3>
    {children}
  </div>
)

const ArticleDetails: React.FC<ArticleDetailsProps> = ({ article }) => {
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
      hour12: true
    })

  // Status badge styling - same as ArticleRow
  const getStatusBadgeClass = (status: ArticleStatus) => {
    const baseClass = "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all duration-200"
    return status === ArticleStatus.PUBLISHED
      ? `${baseClass} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400`
      : `${baseClass} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300`
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 py-3 border-b border-gray-200 dark:border-gray-700">
        <InfoField label="Author">
          <p className="text-gray-900 dark:text-gray-100 font-medium">{article.author}</p>
        </InfoField>
        
        <InfoField label="Status">
          <span className={getStatusBadgeClass(article.status)}>
            {article.status}
          </span>
        </InfoField>
        
        <InfoField label="Created">
          <p className="text-gray-900 dark:text-gray-100 font-medium text-sm">
            {formatDate(article.createdAt)}
          </p>
        </InfoField>
        
        {article.updatedAt && article.updatedAt !== article.createdAt && (
          <InfoField label="Updated">
            <p className="text-gray-900 dark:text-gray-100 font-medium text-sm">
              {formatDate(article.updatedAt)}
            </p>
          </InfoField>
        )}
      </div>
      
      {article.summary && (
        <ContentSection title="Summary">
          <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg text-base">
            {article.summary}
          </p>
        </ContentSection>
      )}
      
      <ContentSection title="Content">
        <div className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg prose prose-gray max-w-none dark:prose-invert">
          <div className="whitespace-pre-wrap text-base leading-relaxed">{article.content}</div>
        </div>
      </ContentSection>
    </div>
  )
}

export default ArticleDetails