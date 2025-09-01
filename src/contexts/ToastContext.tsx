import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'

type ToastType = 'success' | 'error' | 'info'

interface ToastItem {
  id: string
  message: string
  type: ToastType
  duration: number
}

interface ToastContextValue {
  show: (message: string, options?: Partial<Omit<ToastItem, 'id' | 'message' | 'type'>>) => void
  success: (message: string, duration?: number) => void
  error: (message: string, duration?: number) => void
  info: (message: string, duration?: number) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return ctx
}

function classNamesFor(type: ToastType): string {
  switch (type) {
    case 'success':
      return 'bg-green-600 text-white dark:bg-green-500'
    case 'error':
      return 'bg-red-600 text-white dark:bg-red-500'
    case 'info':
    default:
      return 'bg-gray-900 text-white dark:bg-gray-700'
  }
}

const ToastContainer: React.FC<{
  toasts: ToastItem[]
  onDismiss: (id: string) => void
}> = ({ toasts, onDismiss }) => {
  return createPortal(
    <div className="fixed top-4 right-4 z-50 space-y-3 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          aria-live="polite"
          className={[
            'pointer-events-auto rounded-lg shadow-lg ring-1 ring-black/5 px-4 py-3 w-80 animate-fade-in-down',
            classNamesFor(t.type),
          ].join(' ')}
        >
          <div className="flex items-start">
            <div className="flex-1">{t.message}</div>
            <button
              aria-label="Close notification"
              className="ml-3 inline-flex items-center justify-center rounded-md/none text-white/80 hover:text-white focus:outline-none"
              onClick={() => onDismiss(t.id)}
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>,
    document.body
  )
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const push = useCallback((message: string, type: ToastType, duration = 3000) => {
    const id = `${Date.now()}_${Math.random().toString(36).slice(2)}`
    setToasts((prev) => [...prev, { id, message, type, duration }])
    window.setTimeout(() => remove(id), duration)
  }, [remove])

  const value = useMemo<ToastContextValue>(
    () => ({
      show: (message, options) => {
        const duration = options?.duration ?? 3000
        push(message, 'info', duration)
      },
      success: (message, duration) => push(message, 'success', duration ?? 3000),
      error: (message, duration) => push(message, 'error', duration ?? 4000),
      info: (message, duration) => push(message, 'info', duration ?? 3000),
    }),
    [push]
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={remove} />
    </ToastContext.Provider>
  )
}