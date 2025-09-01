import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Dashboard from '../pages/Dashboard'
import { ThemeProvider } from '../contexts/ThemeContext'
import { AuthProvider } from '../contexts/AuthContext'
import { ToastProvider } from '../contexts/ToastContext'
import * as articleService from '../services/articleService'
import { ArticleStatus, UserRole } from '../types'
import { vi, afterEach, beforeEach } from 'vitest'


vi.mock('../services/articleService')
vi.mock('../contexts/AuthContext', async () => {
  const actual = await vi.importActual('../contexts/AuthContext')
  return {
    ...actual,
    useAuth: () => ({
      user: { id: '1', name: 'Test Editor', email: 'editor@test.com', role: UserRole.EDITOR },
      login: vi.fn(),
      logout: vi.fn(),
      isAuthenticated: true
    }),
    AuthProvider: ({ children }: { children: React.ReactNode }) => children
  }
})

const mockArticles = [
  {
    id: 1, title: 'First Article', status: ArticleStatus.PUBLISHED, author: 'John Doe',
    createdAt: '2024-01-01T00:00:00Z', content: 'First article content', summary: 'First summary'
  },
  {
    id: 2, title: 'Second Article', status: ArticleStatus.DRAFT, author: 'Jane Smith',
    createdAt: '2024-01-02T00:00:00Z', content: 'Second article content', summary: 'Second summary'
  },
  // Add more if needed...
]

function renderDashboard() {
  return render(
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <Dashboard />
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

beforeEach(() => {
  vi.mocked(articleService.getArticles).mockResolvedValue({
    data: mockArticles,
    pagination: { page: 1, pageSize: 10, totalItems: 2, totalPages: 1 }, // Default to pageSize 10
    success: true,
  });
})

afterEach(() => {
  vi.clearAllMocks()
})

describe('Dashboard (Integration)', () => {
  it('loads and shows list of articles', async () => {
    renderDashboard()
    expect(await screen.findByText('First Article')).toBeInTheDocument()
    expect(screen.getByText('Second Article')).toBeInTheDocument()
  })

  it('filters articles by search', async () => {
    renderDashboard()
    const user = userEvent.setup()
    await screen.findByText('First Article')
    const searchInput = screen.getByPlaceholderText(/search articles/i)
    await user.type(searchInput, 'First')
    await waitFor(() => {
      expect(articleService.getArticles).toHaveBeenCalledWith(
        1,
        10,
        expect.objectContaining({ search: 'First' })
      )
    })
  })

  it('filters articles by status', async () => {
    renderDashboard()
    const user = userEvent.setup()
    await screen.findByText('First Article')
   
    const statusDropTrigger = within(screen.getByTestId('status-filter-wrapper')).getByTitle('Filter by status');
    await user.click(statusDropTrigger);

    const publishedOption = screen.getByRole('button', { name: ArticleStatus.PUBLISHED });
    await user.click(publishedOption);
    await waitFor(() => {
      expect(articleService.getArticles).toHaveBeenCalledWith(
        1,
        10,
        expect.objectContaining({ status: [ArticleStatus.PUBLISHED] })
      )
    })
  })

  it('sorts articles by title', async () => {
    renderDashboard()
    const user = userEvent.setup()
    await screen.findByText('First Article')
    const sortMenu = screen.getByText(/sort/i)
    await user.click(sortMenu)
    const sortOption = screen.getByText('Title A-Z')
    await user.click(sortOption)
    await waitFor(() => {
      expect(articleService.getArticles).toHaveBeenCalledWith(
        1,
        10,
        expect.objectContaining({ sortBy: 'title' })
      )
    })
  })

  it('shows modal and creates a new article', async () => {
    vi.mocked(articleService.createArticle).mockResolvedValue({
      data: { ...mockArticles[0], id: 99, title: 'Created!' },
      success: true
    });
    renderDashboard()
    const user = userEvent.setup()
    await screen.findByText('First Article')
    const addBtn = screen.getByText(/add article/i)
    await user.click(addBtn)
    expect(screen.getByText(/add new article/i)).toBeInTheDocument()
    await user.type(screen.getByLabelText(/title/i), 'Valid')
    await user.type(screen.getByLabelText(/author/i), 'Valid')
    await user.type(screen.getByLabelText(/content/i), 'Valid')
    await user.type(screen.getByLabelText(/summary/i), 'Valid')
    await user.click(screen.getByRole('button', { name: /create article/i }))
    await waitFor(() => {
      expect(articleService.createArticle).toHaveBeenCalled()
    })
  })

  it('opens and displays article view modal', async () => {
    renderDashboard()
    const user = userEvent.setup()
    await screen.findByText('First Article')
    const articleRow = screen.getAllByRole('row').find(row => within(row).queryByText('First Article'))
    if (!articleRow) throw new Error('Article row not found');
    const viewBtn = within(articleRow).getByLabelText(/view article/i)
    await user.click(viewBtn)
    expect(await screen.findByRole('heading', { name: 'First Article' })).toBeInTheDocument()
    expect(screen.getByText('First summary')).toBeInTheDocument()
  })

  it('handles API error gracefully', async () => {
    vi.mocked(articleService.getArticles).mockRejectedValue(new Error('API is down'));
    renderDashboard();
    expect(await screen.findByText(/API is down/i)).toBeInTheDocument();
  });

  it('changes page when pagination is used', async () => {
    // Setup mock for this specific test case to simulate pagination
    vi.mocked(articleService.getArticles).mockResolvedValue({
      data: mockArticles,
      pagination: { page: 1, pageSize: 10, totalItems: 20, totalPages: 2 },
      success: true,
    });

    renderDashboard();
    await screen.findByText('First Article'); // Wait for initial articles to load

    // Mock the next page's data
    vi.mocked(articleService.getArticles).mockResolvedValueOnce({
      data: [{ id: 11, title: 'Eleventh Article', status: ArticleStatus.PUBLISHED, author: 'Another Author', createdAt: '2024-01-11T00:00:00Z', content: 'Eleventh content', summary: 'Eleventh summary' }],
      pagination: { page: 2, pageSize: 10, totalItems: 20, totalPages: 2 },
      success: true,
    });

    vi.mocked(articleService.getArticles).mockClear(); // Clear initial render call

    const nextButton = screen.getByRole('button', { name: /next/i });
    await userEvent.click(nextButton);
    expect(await screen.findByText('Eleventh Article')).toBeInTheDocument();

    expect(vi.mocked(articleService.getArticles)).toHaveBeenCalledTimes(1);
    expect(vi.mocked(articleService.getArticles)).toHaveBeenCalledWith(2, 10, expect.any(Object));
  });
})
it('shows a success toast after creating an article', async () => {
  vi.mocked(articleService.createArticle).mockResolvedValue({
    data: { ...mockArticles[0], id: 99, title: 'Created!' },
    success: true
  });

  renderDashboard();
  const user = userEvent.setup();
  await screen.findByText('First Article');

  // Open create modal
  const addBtn = screen.getByText(/add article/i);
  await user.click(addBtn);

  // Fill and submit
  await user.type(screen.getByLabelText(/title/i), 'Valid');
  await user.type(screen.getByLabelText(/author/i), 'Valid');
  await user.type(screen.getByLabelText(/content/i), 'Valid');
  await user.type(screen.getByLabelText(/summary/i), 'Valid');
  await user.click(screen.getByRole('button', { name: /create article/i }));

  // Toast should appear (rendered via portal as role="status")
  expect(await screen.findByText(/Article successfully created/i)).toBeInTheDocument();
});

it('shows a red toast after deleting an article', async () => {
  vi.mocked(articleService.deleteArticle).mockResolvedValue({
    data: true,
    success: true
  });

  renderDashboard();
  const user = userEvent.setup();
  await screen.findByText('First Article');

  // Click delete icon on the row for "First Article"
  const row = screen.getAllByRole('row').find(r => within(r).queryByText('First Article'));
  if (!row) throw new Error('Row for "First Article" not found');
  const deleteBtn = within(row).getByLabelText(/delete article/i);
  await user.click(deleteBtn);

  // Confirm in modal
  const confirmDelete = screen.getByRole('button', { name: /^delete$/i });
  await user.click(confirmDelete);

  // Expect destructive toast
  expect(await screen.findByText(/Article deleted successfully/i)).toBeInTheDocument();
});