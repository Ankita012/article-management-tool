import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock IntersectionObserver
(globalThis as any).IntersectionObserver = class IntersectionObserver {
  constructor() {}
  
  observe() {
    return null
  }
  
  disconnect() {
    return null
  }
  
  unobserve() {
    return null
  }
}

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock HTMLFormElement.prototype.requestSubmit for JSDOM
if (!HTMLFormElement.prototype.requestSubmit) {
  HTMLFormElement.prototype.requestSubmit = function(submitter?: HTMLElement) {
    if (submitter && (submitter as any).form !== this) {
      throw new DOMException("Form does not contain submitter", "InvalidStateError")
    }
    
    const submitEvent = new Event('submit', { bubbles: true, cancelable: true })
    this.dispatchEvent(submitEvent)
  }
}