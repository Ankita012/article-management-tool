import React, { useState } from 'react'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import type { InputProps } from '../../types'

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
  const [showPassword, setShowPassword] = useState(false)

  // Destructure `type` out so spreading the remaining props doesn't overwrite
  // the computed `type` attribute we set to toggle show/hide password.
  const { type, ...rest } = props
  const isPassword = type === 'password'

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          type={isPassword ? (showPassword ? 'text' : 'password') : type}
          className={`
            form-input
            ${error
              ? 'border-red-300 text-red-900 placeholder-red-30 focus:border-red-500 focus:ring-red-500 dark:border-red-600 dark:text-red-100 ring-red-500/20 ring-2'
              : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500/20 focus:ring-2'
            }
            ${isPassword ? 'pr-10' : ''}
            py-3 px-4
            transition-all duration-200
            ${className}
          `}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          {...rest}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(s => !s)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
        
        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <AlertCircle className="h-5 w-5 text-red-500" />
          </div>
        )}
      </div>
      
      {error && (
        <p
          id={`${inputId}-error`}
          className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center"
          role="alert"
        >
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p
          id={`${inputId}-helper`}
          className="mt-2 text-sm text-gray-500 dark:text-gray-400"
        >
          {helperText}
        </p>
      )}
    </div>
  )
}

export default Input