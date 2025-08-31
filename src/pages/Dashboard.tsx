import React, { useState, useEffect, useCallback } from 'react'
import { Grid, List, BarChart3 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { UserRole, ArticleStatus } from '../types'
import type { Article, ArticleFilters as ArticleFiltersType, PaginationParams } from '../types'
import { getArticles, createArticle, updateArticle, deleteArticle } from '../services/articleService'
import { Button, Modal } from '../components/ui'
import ArticleFilters from '../components/ArticleFilters'
import ArticleTable from '../components/ArticleTable'
import ArticleDetails from '../components/ArticleDetails'
import ArticleForm from '../components/ArticleForm'
import StatsCard from '../components/StatsCard'
import Pagination from '../components/Pagination'
import Header from '../components/Header'

const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  })
  
  // Modal and form state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [articleForm, setArticleForm] = useState({
    title: '',
    status: ArticleStatus.DRAFT as ArticleStatus,
    author: user?.name || '',
    content: '',
    summary: '',
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [successMessage, setSuccessMessage] = useState('');
  
  // Confirmation modal state
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {})
  const [confirmMessage, setConfirmMessage] = useState('')

  // View article modal state
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [viewingArticle, setViewingArticle] = useState<Article | null>(null)

  const [filters, setFilters] = useState<ArticleFiltersType>({
    search: '',
    status: [],
    author: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
 })

  // Fetch articles
  const fetchArticles = useCallback(async () => {
    setLoading(true);
    setError(null);
    const minimumDisplayTime = new Promise(resolve => setTimeout(resolve, 300)); // 300ms minimum

    try {
      const [response] = await Promise.all([
        getArticles(pagination.page, pagination.pageSize, filters),
        minimumDisplayTime
      ]);
      console.log('Fetched articles:', response);
      setArticles(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch articles');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.pageSize, filters]);

  useEffect(() => {
    fetchArticles()
  }, [fetchArticles])

  const handleSearchChange = (search: string) => {
    setFilters((prev: ArticleFiltersType) => ({ ...prev, search }))
    setPagination(prev => ({ ...prev, page: 1 })) // Reset to first page
  }

  const handleStatusFilter = (status: ArticleStatus[]) => {
    setFilters((prev: ArticleFiltersType) => ({ ...prev, status }))
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const sortKeys = ['title', 'createdAt', 'updatedAt', 'author'] as const
  type SortKey = typeof sortKeys[number]

  const handleSortChange = (sortBy: string, sortOrder: 'asc' | 'desc') => {
    if ((sortKeys as readonly string[]).includes(sortBy)) {
      setFilters((prev: ArticleFiltersType) => ({ ...prev, sortBy: sortBy as SortKey, sortOrder }))
    }
  }
  
  // Form/modal helpers (restored)
  const resetForm = () => {
    setArticleForm({
      title: '',
      status: ArticleStatus.DRAFT,
      author: user?.name || '',
      content: '',
      summary: '',
    })
    setFormErrors({})
    setEditingArticle(null)
  }

  const openAddModal = () => {
    resetForm()
    setIsModalOpen(true)
  }

  const openEditModal = (article: Article) => {
    setArticleForm({
      title: article.title,
      status: article.status,
      author: article.author,
      content: article.content || '',
      summary: article.summary || '',
    })
    setEditingArticle(article)
    setIsModalOpen(true)
  }

  const closeModals = () => {
    setIsModalOpen(false)
    resetForm()
  }

  const openConfirmModal = (message: string, action: () => void) => {
    setConfirmMessage(message)
    setConfirmAction(() => action)
    setIsConfirmOpen(true)
  }

  const closeConfirmModal = () => {
    setIsConfirmOpen(false)
    setConfirmMessage('')
    setConfirmAction(() => {})
  }

  // View article modal functions
  const openViewModal = (article: Article) => {
    setViewingArticle(article)
    setIsViewModalOpen(true)
  }

  const closeViewModal = () => {
    setIsViewModalOpen(false)
    setViewingArticle(null)
  }

  const handleConfirmAction = () => {
    confirmAction()
    closeConfirmModal()
  }
  
  // Form handling functions
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setArticleForm(prev => ({ ...prev, [name]: value }))
  }
  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormErrors({})

    try {
      if (editingArticle) {
        const response = await updateArticle(editingArticle.id, articleForm)
        setArticles(prev => prev.map(article => (article.id === editingArticle.id ? response.data : article)))
      } else {
        const response = await createArticle(articleForm)
        setArticles(prev => [response.data, ...prev])
      }

      closeModals()
      setSuccessMessage(`Article successfully ${editingArticle ? 'updated' : 'created'}!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save article')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const handleDeleteArticle = async (id: number) => {
    openConfirmModal(
      'Are you sure you want to delete this article? This action cannot be undone.',
      async () => {
        try {
          await deleteArticle(id)
          setArticles(prev => prev.filter(article => article.id !== id))
          if (articles.length === 1 && pagination.page > 1) {
            setPagination(prev => ({ ...prev, page: prev.page - 1 }))
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to delete article')
        }
      }
    )
  }

  const canEdit = user?.role === UserRole.EDITOR

  // Calculate stats
  const stats = [
    { title: 'Total Articles', value: articles.length, icon: BarChart3, iconColor: 'text-primary-600 dark:text-primary-400', iconBgColor: 'bg-primary-100 dark:bg-primary-900/30' },
    { title: 'Published', value: articles.filter(a => a.status === ArticleStatus.PUBLISHED).length, icon: Grid, iconColor: 'text-green-600 dark:text-green-400', iconBgColor: 'bg-green-100 dark:bg-green-900/30' },
    { title: 'Drafts', value: articles.filter(a => a.status === ArticleStatus.DRAFT).length, icon: List, iconColor: 'text-yellow-600 dark:text-yellow-400', iconBgColor: 'bg-yellow-100 dark:bg-yellow-900/30' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {successMessage && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-md shadow-md" role="alert">
            <p className="font-bold">Success</p>
            <p>{successMessage}</p>
          </div>
        )}
     
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {stats.map(stat => (
            <StatsCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              iconColor={stat.iconColor}
              iconBgColor={stat.iconBgColor}
            />
          ))}
        </div>

        {/* Controls Bar */}
        <div className="card p-6 mb-6">
          <ArticleFilters
            filters={filters}
            canEdit={canEdit}
            onSearchChange={handleSearchChange}
            onStatusFilter={handleStatusFilter}
            onSortChange={handleSortChange}
            onAddArticle={openAddModal}
          />
        </div>

        {/* Articles List (table-like modern view) */}
        <div className="card p-6">
          <ArticleTable
            articles={articles}
            loading={loading}
            error={error}
            canEdit={canEdit}
            pageSize={pagination.pageSize}
            onView={openViewModal}
            onEdit={openEditModal}
            onDelete={handleDeleteArticle}
          />
        </div>

        {/* Pagination */}
        <div className="mt-6">
          <Pagination
            pagination={pagination}
            loading={loading}
            onPageChange={(newPage) => setPagination(prev => ({ ...prev, page: newPage }))}
          />
        </div>
      </main>
      
      {/* Article Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModals}
        title={editingArticle ? 'Edit Article' : 'Add New Article'}
        size="lg"
      >
        <ArticleForm
          articleForm={articleForm}
          formErrors={formErrors}
          isSubmitting={isSubmitting}
          editingArticle={editingArticle}
          onFormChange={handleFormChange}
          onSubmit={handleSaveArticle}
          onValidation={(isValid, errors) => {
            if (!isValid) {
              setFormErrors(errors);
            } else {
              setFormErrors({});
            }
          }}
        />
      </Modal>
      
      {/* Confirmation Modal */}
      <Modal
        isOpen={isConfirmOpen}
        onClose={closeConfirmModal}
        title="Confirm Action"
        size="sm"
      >
        <div className="space-y-6">
          <p className="text-gray-700 dark:text-gray-300">
            {confirmMessage}
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={closeConfirmModal}
              className="py-2 px-4 rounded-lg"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmAction}
              className="py-2 px-4 rounded-lg"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* View Article Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={closeViewModal}
        title={viewingArticle?.title || 'Article Details'}
        size="lg"
      >
        {viewingArticle && <ArticleDetails article={viewingArticle} />}
      </Modal>
    </div>
  )
}

export default Dashboard