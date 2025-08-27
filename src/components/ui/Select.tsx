import React from 'react'
import { ChevronDown, AlertCircle } from 'lucide-react'
import type { SelectProps } from '../../types'

const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  placeholder,
  className = '',
  id,
  ...props
}) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`
  
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        <select
          id={selectId}
          className={`
            form-select
            appearance-none
            block w-full
            px-4 py-3 text-sm
            bg-none
            rounded-lg
            pr-10
            transition-all duration-200
            ${error
              ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500 dark:border-red-600 dark:text-red-100 ring-red-500/20 ring-2'
              : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500/20 focus:ring-2'
            }
            ${className}
          `}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${selectId}-error` : undefined}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-40 pointer-events-none transition-transform duration-200" />
        
        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <AlertCircle className="h-5 w-5 text-red-500" />
          </div>
        )}
      </div>
      
      {error && (
        <p
          id={`${selectId}-error`}
          className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center"
          role="alert"
        >
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  )
}

export default Select