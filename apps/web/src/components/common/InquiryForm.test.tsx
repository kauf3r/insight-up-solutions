import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';

import InquiryForm, { type InquiryFormProps } from './InquiryForm';

describe('InquiryForm', () => {
  const defaultProps: InquiryFormProps = {
    title: 'Test Form',
    subject: 'Test Subject',
    onSubmit: vi.fn(),
    isLoading: false,
  };

  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  const renderInquiryForm = (props: Partial<InquiryFormProps> = {}) => {
    return render(
      <InquiryForm {...defaultProps} onSubmit={mockOnSubmit} {...props} />
    );
  };

  describe('Component Rendering', () => {
    it('renders with correct title', () => {
      renderInquiryForm({ title: 'Request a Quote' });

      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Request a Quote');
      expect(screen.getByText("Fill out the form below and we'll get back to you soon.")).toBeInTheDocument();
    });

    it('renders all form fields', () => {
      renderInquiryForm();

      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/company/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
    });

    it('shows required field indicators', () => {
      renderInquiryForm();

      const nameLabel = screen.getByLabelText(/name/i);
      const emailLabel = screen.getByLabelText(/email/i);
      const messageLabel = screen.getByLabelText(/message/i);

      expect(nameLabel.closest('div')).toHaveTextContent('*');
      expect(emailLabel.closest('div')).toHaveTextContent('*');
      expect(messageLabel.closest('div')).toHaveTextContent('*');
    });

    it('renders with custom className', () => {
      const { container } = renderInquiryForm({ className: 'custom-class' });

      expect(container.querySelector('form')).toHaveClass('custom-class');
    });
  });

  describe('Form Validation', () => {
    it('validates required name field', async () => {
      const user = userEvent.setup();
      renderInquiryForm();

      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Name is required')).toBeInTheDocument();
      });
    });

    it('validates name field minimum length', async () => {
      const user = userEvent.setup();
      renderInquiryForm();

      const nameInput = screen.getByLabelText(/name/i);
      await user.type(nameInput, 'A');

      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Name must be at least 2 characters')).toBeInTheDocument();
      });
    });

    it('validates required email field', async () => {
      const user = userEvent.setup();
      renderInquiryForm();

      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument();
      });
    });

    it('validates email format', async () => {
      const user = userEvent.setup();
      renderInquiryForm();

      const emailInput = screen.getByLabelText(/email/i);
      // Use clear to avoid type="email" native validation
      await user.clear(emailInput);
      await user.type(emailInput, 'invalid-email-format');

      // Fill other required fields to isolate email validation
      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/message/i), 'Test message content');

      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Invalid email')).toBeInTheDocument();
      });
    });

    it('validates required message field', async () => {
      const user = userEvent.setup();
      renderInquiryForm();

      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Message is required')).toBeInTheDocument();
      });
    });

    it('validates message field minimum length', async () => {
      const user = userEvent.setup();
      renderInquiryForm();

      const messageInput = screen.getByLabelText(/message/i);
      await user.type(messageInput, 'Short');

      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Message must be at least 10 characters')).toBeInTheDocument();
      });
    });

    it('allows optional company field to be empty', async () => {
      const user = userEvent.setup();
      renderInquiryForm();

      // Fill required fields
      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/message/i), 'This is a test message with enough characters');

      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          name: 'John Doe',
          email: 'john@example.com',
          company: '',
          message: 'This is a test message with enough characters',
          subject: 'Test Subject',
        });
      });
    });
  });

  describe('Form Submission', () => {
    it('submits form with valid data including company', async () => {
      const user = userEvent.setup();
      renderInquiryForm();

      const formData = {
        name: 'Jane Smith',
        email: 'jane@company.com',
        company: 'Test Company',
        message: 'This is a detailed message about our requirements',
      };

      await user.type(screen.getByLabelText(/name/i), formData.name);
      await user.type(screen.getByLabelText(/email/i), formData.email);
      await user.type(screen.getByLabelText(/company/i), formData.company);
      await user.type(screen.getByLabelText(/message/i), formData.message);

      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          ...formData,
          subject: 'Test Subject',
        });
      });
    });

    it('includes hidden subject field in submission', async () => {
      const user = userEvent.setup();
      renderInquiryForm({ subject: 'Custom Subject Line' });

      // Fill required fields
      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/message/i), 'Test message content');

      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            subject: 'Custom Subject Line',
          })
        );
      });
    });

    it('resets form after successful submission', async () => {
      const user = userEvent.setup();
      renderInquiryForm();

      const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement;
      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
      const messageInput = screen.getByLabelText(/message/i) as HTMLTextAreaElement;

      // Fill form
      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(messageInput, 'Test message content');

      // Submit form
      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(nameInput.value).toBe('');
        expect(emailInput.value).toBe('');
        expect(messageInput.value).toBe('');
      });
    });
  });

  describe('Loading State', () => {
    it('shows loading state when isLoading is true', () => {
      renderInquiryForm({ isLoading: true });

      const submitButton = screen.getByRole('button');
      expect(submitButton).toBeDisabled();
      expect(screen.getByText('Sending...')).toBeInTheDocument();
      expect(submitButton.querySelector('.animate-spin')).toBeInTheDocument();
    });

    it('disables all form fields when loading', () => {
      renderInquiryForm({ isLoading: true });

      expect(screen.getByLabelText(/name/i)).toBeDisabled();
      expect(screen.getByLabelText(/email/i)).toBeDisabled();
      expect(screen.getByLabelText(/company/i)).toBeDisabled();
      expect(screen.getByLabelText(/message/i)).toBeDisabled();
    });

    it('shows normal state when isLoading is false', () => {
      renderInquiryForm({ isLoading: false });

      const submitButton = screen.getByRole('button', { name: /send message/i });
      expect(submitButton).not.toBeDisabled();
      expect(screen.queryByText('Sending...')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper form labels and associations', () => {
      renderInquiryForm();

      expect(screen.getByLabelText(/name/i)).toHaveAttribute('id', 'name');
      expect(screen.getByLabelText(/email/i)).toHaveAttribute('id', 'email');
      expect(screen.getByLabelText(/company/i)).toHaveAttribute('id', 'company');
      expect(screen.getByLabelText(/message/i)).toHaveAttribute('id', 'message');
    });

    it('shows error messages with proper ARIA attributes', async () => {
      const user = userEvent.setup();
      renderInquiryForm();

      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      await waitFor(() => {
        const errorMessage = screen.getByText('Name is required');
        expect(errorMessage).toHaveAttribute('role', 'alert');
      });
    });

    it('applies error styling to invalid fields', async () => {
      const user = userEvent.setup();
      renderInquiryForm();

      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      await waitFor(() => {
        const nameInput = screen.getByLabelText(/name/i);
        expect(nameInput).toHaveClass('border-red-500');
      });
    });
  });

  describe('Responsive Design', () => {
    it('applies responsive classes correctly', () => {
      const { container } = renderInquiryForm();

      expect(container.querySelector('form')).toHaveClass('space-y-6');
      expect(screen.getByRole('button', { name: /send message/i })).toHaveClass('w-full');
    });
  });

  describe('Prop Customization', () => {
    it('renders custom title', () => {
      renderInquiryForm({ title: 'Get a Demo' });

      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Get a Demo');
    });

    it('handles different subject values', async () => {
      const user = userEvent.setup();
      renderInquiryForm({ subject: 'Demo Request' });

      // Fill and submit form
      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/message/i), 'Demo request message');

      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            subject: 'Demo Request',
          })
        );
      });
    });
  });
});