import React, { useState, useRef, useEffect } from 'react'
import type { DropdownProps } from '../../types'

const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  children,
  isOpen: controlledIsOpen,
  onOpenChange,
  align = 'start',
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen
  const setIsOpen = onOpenChange || setInternalIsOpen

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
        triggerRef.current?.focus()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, setIsOpen])

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const alignmentClasses = {
    start: 'left-0 origin-top-left',
    end: 'right-0 origin-top-right',
  }

  return (
    <div className="relative sm:inline-block text-left">
      <div>
        <div
          ref={triggerRef as any}
          role="button"
          tabIndex={0}
          onClick={toggleDropdown}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              toggleDropdown()
            }
          }}
          className="inline-flex w-full justify-center items-center h-full"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          {trigger}
        </div>
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className={`absolute z-10 mt-2 min-w-56 rounded-lg bg-white shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-700 transition-all duration-200 ease-out ${alignmentClasses[align]} ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
          role="menu"
          aria-orientation="vertical"
          tabIndex={-1}
        >
          <div className="py-1" role="none">
            {children}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dropdown