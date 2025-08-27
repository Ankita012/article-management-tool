import type { Article, ArticleFormData, ArticleFilters, PaginationParams, PaginatedResponse, ApiResponse } from '../types'
import { ArticleStatus } from '../types'

// Local storage key
const STORAGE_KEY = 'article_manager_storage'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const generateDefaultArticles = (count: number): Article[] => {
  const authors = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown', 'Charlie Wilson', 'Eva Davis']
  const titles = [
    'Getting Started with React Hooks',
    'Advanced TypeScript Patterns',
    'Building Scalable Web Applications',
    'The Future of Frontend Development',
    'Performance Optimization Tips',
    'Modern CSS Techniques',
    'State Management Best Practices',
    'Testing Strategies for React',
    'Accessibility in Web Development',
    'API Design Principles',
    'Database Optimization Techniques',
    'Microservices Architecture',
    'Cloud Computing Fundamentals',
    'DevOps Best Practices',
    'Security in Modern Applications',
  ]

  const now = Date.now()

  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    title: titles[index % titles.length] + (index >= titles.length ? ` ${Math.floor(index / titles.length) + 1}` : ''),
    status: index % 4 === 0 ? ArticleStatus.DRAFT : ArticleStatus.PUBLISHED,
    author: authors[index % authors.length],
    createdAt: new Date(now - index * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(now - Math.max(0, index - 2) * 24 * 60 * 60 * 1000).toISOString(),
    content: `This is the content for ${titles[index % titles.length]}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    summary: `A brief summary of ${titles[index % titles.length]}.`,
  }))
}

// Storage helpers (guard for SSR)
const isLocalStorageAvailable = (): boolean => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'

const loadFromStorage = (): Article[] | null => {
  if (!isLocalStorageAvailable()) return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Article[]
    return parsed
  } catch (e) {
    console.warn('Failed to load articles from localStorage', e)
    return null
  }
}

const saveToStorage = (articles: Article[]) => {
  if (!isLocalStorageAvailable()) return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(articles))
  } catch (e) {
    console.warn('Failed to save articles to localStorage', e)
  }
}

// Initialize articles from storage or defaults
let mockArticles: Article[] = loadFromStorage() || generateDefaultArticles(50)
let nextId = mockArticles.reduce((max, a) => Math.max(max, a.id), 0) + 1

// Filter and sort articles
const filterAndSortArticles = (articles: Article[], filters: ArticleFilters): Article[] => {
  let filtered = [...articles]

  // Search filter
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase()
    filtered = filtered.filter(
      article =>
        article.title.toLowerCase().includes(searchTerm) ||
        article.author.toLowerCase().includes(searchTerm) ||
        (article.content || '').toLowerCase().includes(searchTerm)
    )
  }

  // Status filter
  if (filters.status && filters.status.length > 0) {
    filtered = filtered.filter(article => filters.status.includes(article.status))
  }

  // Author filter
  if (filters.author) {
    filtered = filtered.filter(article => 
      article.author.toLowerCase().includes(filters.author!.toLowerCase())
    )
  }

  filtered.sort((a, b) => {
    let comparison = 0
    switch (filters.sortBy) {
      case 'title':
        comparison = a.title.localeCompare(b.title)
        break
      case 'author':
        comparison = a.author.localeCompare(b.author)
        break
      case 'createdAt':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        break
      case 'updatedAt':
        comparison = new Date(a.updatedAt || a.createdAt).getTime() - new Date(b.updatedAt || b.createdAt).getTime()
        break
      default:
        comparison = 0
    }
    return filters.sortOrder === 'desc' ? -comparison : comparison
  })

  return filtered
}

// Get paginated articles
export const getArticles = async (
  page: number = 1,
  pageSize: number = 10,
  filters: Partial<ArticleFilters> = {}
): Promise<PaginatedResponse<Article>> => {
  await delay(200) // fixed delay

  const defaultFilters: ArticleFilters = {
    search: '',
    status: [],
    author: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    ...filters,
  }

  const filtered = filterAndSortArticles(mockArticles, defaultFilters)
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedArticles = filtered.slice(startIndex, endIndex)

  const pagination: PaginationParams = {
    page,
    pageSize,
    totalItems: filtered.length,
    totalPages: Math.ceil(filtered.length / pageSize),
  }

  return {
    data: paginatedArticles,
    pagination,
    success: true,
  }
}

// Create new article
export const createArticle = async (articleData: ArticleFormData): Promise<ApiResponse<Article>> => {
  await delay(180)

  const newArticle: Article = {
    id: nextId++,
    ...articleData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // add to top
  mockArticles = [newArticle, ...mockArticles]
  saveToStorage(mockArticles)

  return {
    data: newArticle,
    success: true,
    message: 'Article created successfully!',
  }
}

// Update existing article
export const updateArticle = async (id: number, articleData: Partial<ArticleFormData>): Promise<ApiResponse<Article>> => {
  await delay(160)

  const articleIndex = mockArticles.findIndex(a => a.id === id)
  if (articleIndex === -1) {
    throw new Error('Article not found')
  }

  const updatedArticle: Article = {
    ...mockArticles[articleIndex],
    ...articleData,
    updatedAt: new Date().toISOString(),
  }

  mockArticles[articleIndex] = updatedArticle
  saveToStorage(mockArticles)

  return {
    data: updatedArticle,
    success: true,
    message: 'Article updated successfully!',
  }
}

// Delete article
export const deleteArticle = async (id: number): Promise<ApiResponse<boolean>> => {
  await delay(140)

  const articleIndex = mockArticles.findIndex(a => a.id === id)
  if (articleIndex === -1) {
    throw new Error('Article not found.')
  }

  mockArticles.splice(articleIndex, 1)
  saveToStorage(mockArticles)

  return {
    data: true,
    success: true,
    message: 'Article deleted successfully!',
  }
}
