import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

// Mock fetch for integration tests
global.fetch = vi.fn()

describe('Frontend Integration Tests', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('renders complete app flow', async () => {
    const mockFetch = vi.mocked(fetch)
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Backend is running!' }),
    } as Response)

    render(<App />)

    // Check initial render
    expect(screen.getByText('Radio App')).toBeInTheDocument()
    expect(screen.getByText('Frontend is running!')).toBeInTheDocument()
    expect(screen.getByText(/Loading\.\.\./)).toBeInTheDocument()

    // Wait for API call to complete
    await waitFor(() => {
      expect(screen.getByText('Backend status: Backend is running!')).toBeInTheDocument()
    })

    // Verify loading state is gone
    expect(screen.queryByText(/Loading\.\.\./)).not.toBeInTheDocument()
  })

  it('handles network failures gracefully', async () => {
    const mockFetch = vi.mocked(fetch)
    mockFetch.mockRejectedValueOnce(new Error('Failed to fetch'))

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(<App />)

    // Should still render the main content
    expect(screen.getByText('Radio App')).toBeInTheDocument()
    expect(screen.getByText('Frontend is running!')).toBeInTheDocument()

    // Wait for error handling
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled()
    })

    consoleSpy.mockRestore()
  })

  it('handles different API responses', async () => {
    const mockFetch = vi.mocked(fetch)
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Custom backend message' }),
    } as Response)

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Backend status: Custom backend message')).toBeInTheDocument()
    })
  })

  it('maintains component state during user interactions', async () => {
    const user = userEvent.setup()
    const mockFetch = vi.mocked(fetch)
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Backend is running!' }),
    } as Response)

    render(<App />)

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Backend status: Backend is running!')).toBeInTheDocument()
    })

    // Test that the app maintains its state (no user interactions in this simple app yet,
    // but this test demonstrates the pattern for when we add more interactivity)
    const heading = screen.getByText('Radio App')
    expect(heading).toBeInTheDocument()

    // Simulate some user interaction (clicking the heading)
    await user.click(heading)

    // App should still be in the same state
    expect(screen.getByText('Radio App')).toBeInTheDocument()
    expect(screen.getByText('Backend status: Backend is running!')).toBeInTheDocument()
  })
})