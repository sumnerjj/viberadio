import { render, screen, waitFor } from '@testing-library/react'
import App from '../App'

// Mock fetch
global.fetch = vi.fn()

describe('App Component', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('renders the app title', () => {
    const mockFetch = vi.mocked(fetch)
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Backend is running!' }),
    } as Response)

    render(<App />)

    expect(screen.getByText('Radio App')).toBeInTheDocument()
    expect(screen.getByText('Frontend is running!')).toBeInTheDocument()
  })

  it('displays loading state initially', () => {
    const mockFetch = vi.mocked(fetch)
    mockFetch.mockImplementationOnce(() => new Promise(() => {})) // Never resolves

    render(<App />)

    expect(screen.getByText(/Loading\.\.\./)).toBeInTheDocument()
  })

  it('displays backend status when API call succeeds', async () => {
    const mockFetch = vi.mocked(fetch)
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Backend is running!' }),
    } as Response)

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Backend status: Backend is running!')).toBeInTheDocument()
    })
  })

  it('calls the health API endpoint', () => {
    const mockFetch = vi.mocked(fetch)
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Backend is running!' }),
    } as Response)

    render(<App />)

    expect(mockFetch).toHaveBeenCalledWith('/api/health')
  })

  it('handles API errors gracefully', async () => {
    const mockFetch = vi.mocked(fetch)
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(<App />)

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch from backend:', expect.any(Error))
    })

    consoleSpy.mockRestore()
  })
})