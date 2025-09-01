import { describe, it, expect, vi, afterEach } from 'vitest'

async function freshArticleService() {
  vi.resetModules()
  const getItem = (window.localStorage.getItem as unknown as ReturnType<typeof vi.fn>)
  getItem.mockReturnValueOnce(null)
  const svc = await import('../../services/articleService')
  return svc
}

afterEach(() => {
  try {
    vi.useRealTimers()
  } catch {
    // ignore if not faked in a test
  }
  vi.clearAllMocks()
})

describe('articleService (unit)', () => {
  it('getArticles returns paginated, sorted defaults (createdAt desc)', async () => {
    const svc = await freshArticleService()
    const result = await svc.getArticles(1, 10, {})
    expect(result.success).toBe(true)
    expect(result.data.length).toBe(10)
 
    const a = new Date(result.data[0].createdAt).getTime()
    const b = new Date(result.data[1].createdAt).getTime()
    expect(a).toBeGreaterThanOrEqual(b)
  })

  it('filters by search and status, and sorts by title asc', async () => {
    const svc = await freshArticleService()
    const { ArticleStatus } = await import('../../types')
    const result = await svc.getArticles(1, 50, {
      search: 'React',
      status: [ArticleStatus.PUBLISHED],
      sortBy: 'title',
      sortOrder: 'asc',
    })
    expect(result.success).toBe(true)
    expect(result.data.every(a => a.status === ArticleStatus.PUBLISHED)).toBe(true)
    if (result.data.length >= 2) {
      expect(result.data[0].title.localeCompare(result.data[1].title)).toBeLessThanOrEqual(0)
    }
  })

  it('create, update, delete article flow persists through service api', async () => {
    const svc = await freshArticleService()
    const { ArticleStatus } = await import('../../types')

    // Create
    const created = await svc.createArticle({
      title: 'Brand New',
      status: ArticleStatus.DRAFT,
      author: 'Tester',
      content: 'Hello',
      summary: 'Sum',
    })
    expect(created.success).toBe(true)
    expect(created.data.id).toBeGreaterThan(0)

    // Update
    const updated = await svc.updateArticle(created.data.id, { title: 'Updated Title' })
    expect(updated.success).toBe(true)
    expect(updated.data.title).toBe('Updated Title')

    // Delete
    const deleted = await svc.deleteArticle(created.data.id)
    expect(deleted.success).toBe(true)
    expect(deleted.data).toBe(true)
  })

  it('pagination returns different slices per page', async () => {
    const svc = await freshArticleService()
    const page1 = await svc.getArticles(1, 5, {})
    const page2 = await svc.getArticles(2, 5, {})
    expect(page1.data.length).toBe(5)
    expect(page2.data.length).toBe(5)
    
    const ids1 = page1.data.map(a => a.id)
    const ids2 = page2.data.map(a => a.id)
    expect(ids1.some(id => ids2.includes(id))).toBe(false)
  })
})