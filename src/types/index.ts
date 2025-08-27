// Article Status Constants
export const ArticleStatus = {
  PUBLISHED: 'Published',
  DRAFT: 'Draft',
} as const

export type ArticleStatus = typeof ArticleStatus[keyof typeof ArticleStatus]

// User Role Constants
export const UserRole = {
  VIEWER: 'viewer',
  EDITOR: 'editor',
} as const

export type UserRole = typeof UserRole[keyof typeof UserRole]

// Base Article Interface
export interface Article {
  id: number
  title: string
  status: ArticleStatus
  author: string
  createdAt: string
  updatedAt?: string
  content?: string
  summary?: string
}

// Article Form Data Interface
export interface ArticleFormData {
  title: string
  status: ArticleStatus
  author: string
  content: string
  summary: string
}

// Pagination Interface
export interface PaginationParams {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

// Filter Interface
export interface ArticleFilters {
  search: string
  status: ArticleStatus[]
  author?: string
  sortBy: 'title' | 'createdAt' | 'updatedAt' | 'author'
  sortOrder: 'asc' | 'desc'
}

// API Response Interfaces
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: PaginationParams
  success: boolean
  message?: string
}

// Theme Interface
export interface ThemeContextType {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

// Auth Context Interface
export interface AuthContextType {
  user: {
    id: string
    name: string
    email: string
    role: UserRole
  } | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

// Modal Props Interface
export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

// Button Props Interface
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  children: React.ReactNode
}

// Input Props Interface
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

// Select Props Interface
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: Array<{ value: string; label: string }>
  placeholder?: string
}

// Search Input Props Interface
export interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  debounceMs?: number
}

// Dropdown Props Interface
export interface DropdownProps {
  trigger: React.ReactNode
  children: React.ReactNode
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  align?: 'start' | 'end'
}
