import React from 'react'
import { Sun, Moon, LogOut } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'
import { UserRole } from '../types'

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <a href="#" aria-label="BidOne home" className="inline-flex items-center">
              <span className="text-2xl font-extrabold tracking-tight">
                <span className="text-black dark:text-white">Bid</span>
                <span className="text-primary-500 dark:text-primary-300">One</span>
              </span>
            </a>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
              {user?.role === UserRole.EDITOR ? 'Editor' : 'Viewer'}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300 hidden md:inline">
              Welcome, {user?.name}
            </span>
            
            <div
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              className="cursor-pointer p-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 transition-colors"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  toggleTheme()
                }
              }}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </div>

            <div
              onClick={logout}
              aria-label="Sign out"
              className="cursor-pointer p-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 transition-colors"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  logout()
                }
              }}
              title="Sign out"
            >
              <LogOut className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header