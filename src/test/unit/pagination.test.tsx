import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Pagination from '../../components/Pagination'
import type { PaginationParams } from '../../types'

describe('Pagination (unit)', () => {
  function makeParams(page: number, totalPages = 3): PaginationParams {
    return { page, pageSize: 10, totalItems: 30, totalPages }
  }

  it('disables Previous at first page and Next at last page, calls onPageChange', async () => {
    const onPageChange = vi.fn()
    const { rerender } = render(
      <Pagination pagination={makeParams(1)} loading={false} onPageChange={onPageChange} />
    )

    const prev = screen.getByRole('button', { name: /previous/i })
    const next = screen.getByRole('button', { name: /next/i })
    expect(prev).toBeDisabled()
    expect(next).not.toBeDisabled()

    await userEvent.click(next)
    expect(onPageChange).toHaveBeenCalledWith(2)

    // Last page
    rerender(<Pagination pagination={makeParams(3)} loading={false} onPageChange={onPageChange} />)
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled()
  })

  it('disables page interactions during loading', async () => {
    const onPageChange = vi.fn()
    render(<Pagination pagination={makeParams(2)} loading={true} onPageChange={onPageChange} />)
    expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled()
  })
})