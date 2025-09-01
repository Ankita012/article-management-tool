import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider, useTheme } from '../../contexts/ThemeContext'

describe('ThemeProvider (unit)', () => {
  function Consumer() {
    const { theme, toggleTheme } = useTheme()
    return (
      <div>
        <div>Theme: {theme}</div>
        <button onClick={toggleTheme}>toggle</button>
      </div>
    )
  }

  it('respects saved theme on init and toggles/persists class', async () => {
    // saved theme = dark
    ;(window.localStorage.getItem as unknown as ReturnType<typeof vi.fn>).mockReturnValueOnce('dark')

    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>
    )

    // After initialization effect runs, html should have class 'dark' when theme is dark
    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })
    expect(screen.getByText(/Theme: dark/)).toBeInTheDocument()

    // Toggle to light
    await userEvent.click(screen.getByText('toggle'))
    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(false)
    })
    expect(screen.getByText(/Theme: light/)).toBeInTheDocument()
    expect(window.localStorage.setItem).toHaveBeenCalled()
  })
})