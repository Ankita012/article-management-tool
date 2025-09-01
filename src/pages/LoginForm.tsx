import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Button, Input } from '../components/ui'

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login(email, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md w-full space-y-8 fade-in-up">
        <div className="text-center">
          <div className="mx-auto inline-flex items-center justify-center">
            <a href="#" aria-label="ArticleOne home" className="inline-flex items-center">
              <span className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                <span className="text-black dark:text-white">Article</span>
                <span className="text-primary-500 dark:text-primary-300">One</span>
              </span>
            </a>
          </div>
          <h2 className="mt-6 text-center text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
            Sign in to your account to continue
          </p>
        </div>

        <div className="mt-8 bg-white dark:bg-gray-800 py-8 px-6 shadow-xl rounded-2xl ring-1 ring-gray-900/5 dark:ring-gray-700/50 fade-in">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Input
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="Enter your email"
                className="py-3 px-4"
                autoFocus={true}
              />
              
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="Enter your password"
                className="py-3 px-4"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                  Forgot your password?
                </a>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Demo credentials
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3">
              <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                <p className="font-medium">Editor:</p>
                <p>editor@example.com / editor123</p>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                <p className="font-medium">Viewer:</p>
                <p>viewer@example.com / viewer123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginForm