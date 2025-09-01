import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import Dropdown from '../../components/ui/Dropdown'

describe('Dropdown (unit)', () => {
  function DropdownHarness(props?: Partial<React.ComponentProps<typeof Dropdown>>) {
    return (
      <div>
        <button data-testid="outside-btn">Outside</button>
        <Dropdown trigger={<span>Open Menu</span>} {...props}>
          <button role="menuitem">Item 1</button>
          <button role="menuitem">Item 2</button>
        </Dropdown>
      </div>
    )
  }

  it('uncontrolled: opens on click, closes on Escape and outside click', async () => {
    render(<DropdownHarness />)
    const trigger = screen.getByText('Open Menu')
    await userEvent.click(trigger)
    expect(await screen.findByRole('menu')).toBeInTheDocument()

    // Escape closes
    await userEvent.keyboard('{Escape}')
    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    })

    // Open again and click outside
    await userEvent.click(trigger)
    expect(await screen.findByRole('menu')).toBeInTheDocument()
    await userEvent.click(screen.getByTestId('outside-btn'))
    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    })
  })

  it('controlled: toggles via onOpenChange and respects isOpen', async () => {
    const onOpenChange = vi.fn()
    const { rerender } = render(<DropdownHarness isOpen={false} onOpenChange={onOpenChange} />)
    const trigger = screen.getByText('Open Menu')
    await userEvent.click(trigger)
    expect(onOpenChange).toHaveBeenCalledWith(true)

    // Simulate parent controlling
    rerender(<DropdownHarness isOpen={true} onOpenChange={onOpenChange} />)
    expect(await screen.findByRole('menu')).toBeInTheDocument()

    await userEvent.click(trigger)
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('applies alignment classes for end alignment', async () => {
    render(<DropdownHarness align="end" />)
    const trigger = screen.getByText('Open Menu')
    await userEvent.click(trigger)
    const menu = await screen.findByRole('menu')
    expect(menu.className).toMatch(/origin-top-right|right-0/)
  })
})
