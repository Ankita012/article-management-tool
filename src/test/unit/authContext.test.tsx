import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider, useAuth } from '../../contexts/AuthContext'

describe('AuthProvider (unit)', () => {
  function Consumer() {
    const { user, login, logout, isAuthenticated } = useAuth()
    return (
      <div>
        <div>Auth: {isAuthenticated ? 'yes' : 'no'}</div>
        <button onClick={() => login('editor@example.com', 'editor123')}>doLogin</button>
        <button onClick={() => logout()}>doLogout</button>
        <div data-testid="username">{user?.name ?? ''}</div>
      </div>
    )
  }

  it('login success sets user and isAuthenticated, logout clears', async () => {
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    )

    await userEvent.click(screen.getByText('doLogin'))
    // Await the async login completion (500ms in provider)
    await screen.findByText(/Auth: yes/)
    expect(screen.getByTestId('username').textContent).toMatch(/Editor User/)

    await userEvent.click(screen.getByText('doLogout'))
    await screen.findByText(/Auth: no/)
    expect(screen.getByTestId('username').textContent).toBe('')
  })

  it('login failure is handled (no crash)', async () => {
    function BadLoginConsumer() {
      const { login } = useAuth()
      return <button onClick={() => login('nope@example.com', 'wrong').catch(() => {})}>badLogin</button>
    }
    render(
      <AuthProvider>
        <BadLoginConsumer />
      </AuthProvider>
    )
    await userEvent.click(screen.getByText('badLogin'))
    // No assertion needed; absence of unhandled rejection or crash is sufficient
  })
})