import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import QuoteRequestPage from './page';
import { submitInquiry } from '@/app/_actions/submit-inquiry';
import { InquiryFormData } from '@/components/common/InquiryForm';

// Mock the Server Action
vi.mock('@/app/_actions/submit-inquiry', () => ({
  submitInquiry: vi.fn(),
}));

// Mock InquiryForm component
vi.mock('@/components/common/InquiryForm', () => ({
  default: ({ title, subject, onSubmit, isLoading }: {
    title: string;
    subject: string;
    onSubmit: (data: InquiryFormData) => void;
    isLoading: boolean;
  }) => (
    <div data-testid="inquiry-form">
      <h2>{title}</h2>
      <p>Subject: {subject}</p>
      <button
        onClick={() => onSubmit({
          name: 'Test User',
          email: 'test@example.com',
          company: 'Test Company',
          message: 'Test message for quote request',
          subject: subject
        })}
        disabled={isLoading}
        data-testid="submit-button"
      >
        {isLoading ? 'Loading...' : 'Submit'}
      </button>
    </div>
  ),
}));

describe('QuoteRequestPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the quote request page with correct title and subject', () => {
    render(<QuoteRequestPage />);

    expect(screen.getByText('Request a Quote')).toBeInTheDocument();
    expect(screen.getByText('Subject: Quote Request')).toBeInTheDocument();
    expect(screen.getByTestId('inquiry-form')).toBeInTheDocument();
  });

  it('shows success message after successful form submission', async () => {
    const mockSubmitInquiry = vi.mocked(submitInquiry);
    mockSubmitInquiry.mockResolvedValue({
      success: true,
      message: 'Thank you for your inquiry! We\'ll get back to you within 24 hours.',
    });

    render(<QuoteRequestPage />);

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Thank you for your inquiry! We\'ll get back to you within 24 hours.')).toBeInTheDocument();
    });

    expect(mockSubmitInquiry).toHaveBeenCalledWith({
      name: 'Test User',
      email: 'test@example.com',
      company: 'Test Company',
      message: 'Test message for quote request',
      subject: 'Quote Request',
    });
  });

  it('shows error message when form submission fails', async () => {
    const mockSubmitInquiry = vi.mocked(submitInquiry);
    mockSubmitInquiry.mockResolvedValue({
      success: false,
      message: 'Submission failed',
      error: 'Server error occurred',
    });

    render(<QuoteRequestPage />);

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Server error occurred')).toBeInTheDocument();
    });
  });

  it('shows loading state during form submission', async () => {
    const mockSubmitInquiry = vi.mocked(submitInquiry);
    mockSubmitInquiry.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({
      success: true,
      message: 'Success',
    }), 100)));

    render(<QuoteRequestPage />);

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    // Check loading state
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();

    // Wait for completion
    await waitFor(() => {
      expect(screen.getByText('Success')).toBeInTheDocument();
    });
  });

  it('handles unexpected errors gracefully', async () => {
    const mockSubmitInquiry = vi.mocked(submitInquiry);
    mockSubmitInquiry.mockRejectedValue(new Error('Network error'));

    render(<QuoteRequestPage />);

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('An unexpected error occurred. Please try again.')).toBeInTheDocument();
    });
  });

  it('clears messages when a new submission starts', async () => {
    const mockSubmitInquiry = vi.mocked(submitInquiry);

    // First submission - success
    mockSubmitInquiry.mockResolvedValueOnce({
      success: true,
      message: 'Success message',
    });

    render(<QuoteRequestPage />);

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Success message')).toBeInTheDocument();
    });

    // Second submission - error
    mockSubmitInquiry.mockResolvedValueOnce({
      success: false,
      message: 'Error message',
      error: 'Error occurred',
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Error occurred')).toBeInTheDocument();
      expect(screen.queryByText('Success message')).not.toBeInTheDocument();
    });
  });
});