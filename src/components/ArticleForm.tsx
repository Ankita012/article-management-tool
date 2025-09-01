import React, { useEffect, useRef } from 'react'
import { ArticleStatus } from '../types'
import type { Article } from '../types'
import { Button } from './ui'

interface ArticleFormProps {
  articleForm: {
    title: string
    status: ArticleStatus
    author: string
    content: string
    summary: string
  }
  formErrors: Record<string, string>
  isSubmitting: boolean
  editingArticle: Article | null
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  onSubmit: (e: React.FormEvent) => void;
  onValidation?: (isValid: boolean, errors: Record<string, string>) => void;
}

interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  error?: string;
  placeholder: string;
  type?: 'text' | 'textarea' | 'select';
  rows?: number;
  options?: { value: string; label: string }[];
  className?: string;
  inputRef?: React.Ref<HTMLInputElement | HTMLTextAreaElement>; // Add inputRef to props
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  type = 'text',
  rows = 3,
  options = [],
  className = '',
  inputRef
}) => {
  const baseInputClasses = "w-full rounded-lg border shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 py-3 px-4 transition-all duration-200";
  const errorBorderClass = error ? 'border-red-500' : 'border-gray-300';
  const inputClasses = `${baseInputClasses} ${errorBorderClass}`;

  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      
      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          rows={rows}
          className={inputClasses}
          placeholder={placeholder}
          ref={inputRef as React.Ref<HTMLTextAreaElement>} // Apply ref specifically to textarea
        />
      ) : type === 'select' ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className={inputClasses}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type="text"
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className={inputClasses}
          placeholder={placeholder}
          ref={inputRef as React.Ref<HTMLInputElement>} // Apply ref specifically to input
        />
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  )
}

const ArticleForm: React.FC<ArticleFormProps> = ({
  articleForm,
  formErrors,
  isSubmitting,
  editingArticle,
  onFormChange,
  onSubmit,
  onValidation
}) => {
  const statusOptions = [
    { value: ArticleStatus.DRAFT, label: 'Draft' },
    { value: ArticleStatus.PUBLISHED, label: 'Published' }
  ];

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!articleForm.title.trim()) {
      errors.title = 'Title is required';
    }

    if (!articleForm.content.trim()) {
      errors.content = 'Content is required';
    }

    const isValid = Object.keys(errors).length === 0;
    if (onValidation) {
      onValidation(isValid, errors);
    }
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(e);
    }
  };

  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [editingArticle]); // Refocus when editingArticle changes (modal opens/switches)

  return (
    <form onSubmit={handleSubmit} aria-label="article form">
      <div className="space-y-4">
        <FormField
          label="Title"
          name="title"
          value={articleForm.title}
          onChange={onFormChange}
          error={formErrors.title}
          placeholder="Enter article title"
          inputRef={titleInputRef} // Pass the ref to the FormField
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Author
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={articleForm.author}
              readOnly
              className="w-full rounded-lg border border-gray-300 bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 py-3 px-4 cursor-not-allowed"
              placeholder="Author name"
            />
          </div>

          <FormField
            label="Status"
            name="status"
            value={articleForm.status}
            onChange={onFormChange}
            placeholder=""
            type="select"
            options={statusOptions}
          />
        </div>
        
        <FormField
          label="Summary"
          name="summary"
          value={articleForm.summary}
          onChange={onFormChange}
          error={formErrors.summary}
          placeholder="Enter article summary"
          type="textarea"
          rows={3}
        />
        
        <FormField
          label="Content"
          name="content"
          value={articleForm.content}
          onChange={onFormChange}
          error={formErrors.content}
          placeholder="Enter article content"
          type="textarea"
          rows={6}
        />
      </div>
      
      <div className="mt-6 text-right space-x-3">
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          className="py-3 rounded-xl"
        >
          {editingArticle ? 'Update Article' : 'Create Article'}
        </Button>
      </div>
    </form>
  )
}

export default ArticleForm