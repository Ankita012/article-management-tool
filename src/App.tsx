import React from 'react'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import LoginForm from './pages/LoginForm'
import Dashboard from './pages/Dashboard'
import { ToastProvider } from './contexts/ToastContext'

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <div className="fade-in"><LoginForm /></div>
  }

  return <div className="fade-in"><Dashboard /></div>
}

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
