import React, { createContext, useContext, useState, useEffect } from 'react'
import type { AuthContextType } from '../types'
import { UserRole } from '../types'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

// Mock user data for demo purposes
const mockUsers = [
  {
    id: '1',
    name: 'Editor User',
    email: 'editor@example.com',
    role: UserRole.EDITOR,
    password: 'editor123',
  },
  {
    id: '2',
    name: 'Viewer User',
    email: 'viewer@example.com',
    role: UserRole.VIEWER,
    password: 'viewer123',
  },
]

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthContextType['user']>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('auth_user')
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
      } catch (error) {
        console.error('Error parsing stored user:', error)
        localStorage.removeItem('auth_user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<void> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))

    const foundUser = mockUsers.find(
      u => u.email === email && u.password === password
    )

    if (!foundUser) {
      throw new Error('Invalid email or password')
    }

    const authUser = {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      role: foundUser.role,
    }

    setUser(authUser)
    localStorage.setItem('auth_user', JSON.stringify(authUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('auth_user')
  }

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}