import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock Resend before importing the module under test
vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: {
      send: vi.fn(),
    },
  })),
}));

import { sendInquiryNotification, type InquiryNotificationData } from './email';
import { Resend } from 'resend';

// Get the mock instance
const MockedResend = vi.mocked(Resend);
const mockResendSend = vi.fn();

describe('Email Service', () => {
  const mockInquiryData: InquiryNotificationData = {
    name: 'John Doe',
    email: 'john@example.com',
    company: 'Test Company',
    message: 'This is a test inquiry message',
    subject: 'Test Quote Request',
  };

  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = {
      ...originalEnv,
      RESEND_API_KEY: 'test-api-key',
      NOTIFICATION_EMAIL: 'business@example.com',
    };

    // Setup mock implementation for each test
    MockedResend.mockImplementation(() => ({
      emails: {
        send: mockResendSend,
      },
    }) as InstanceType<typeof Resend>);
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('sendInquiryNotification', () => {
    it('should send email successfully with complete data', async () => {
      mockResendSend.mockResolvedValue({
        data: { id: 'email-123' },
      });

      const result = await sendInquiryNotification(mockInquiryData);

      expect(result.success).toBe(true);
      expect(result.messageId).toBe('email-123');
      expect(result.error).toBeUndefined();

      expect(mockResendSend).toHaveBeenCalledWith({
        from: 'noreply@insight-up-solutions.com',
        to: 'business@example.com',
        subject: 'New Quote Request: Test Quote Request',
        html: expect.stringContaining('John Doe'),
        replyTo: 'john@example.com',
      });
    });

    it('should send email successfully without company field', async () => {
      const dataWithoutCompany = { ...mockInquiryData };
      delete dataWithoutCompany.company;

      mockResendSend.mockResolvedValue({
        data: { id: 'email-456' },
      });

      const result = await sendInquiryNotification(dataWithoutCompany);

      expect(result.success).toBe(true);

      const emailCall = mockResendSend.mock.calls[0][0];
      expect(emailCall.html).toContain('John Doe');
      expect(emailCall.html).not.toContain('<strong>Company:</strong>');
    });

    it('should format email content correctly', async () => {
      mockResendSend.mockResolvedValue({
        data: { id: 'email-789' },
      });

      await sendInquiryNotification(mockInquiryData);

      const emailCall = mockResendSend.mock.calls[0][0];
      const htmlContent = emailCall.html;

      expect(htmlContent).toContain('New Quote Request Received');
      expect(htmlContent).toContain('John Doe');
      expect(htmlContent).toContain('john@example.com');
      expect(htmlContent).toContain('Test Company');
      expect(htmlContent).toContain('Test Quote Request');
      expect(htmlContent).toContain('This is a test inquiry message');
    });

    it('should handle Resend API errors gracefully', async () => {
      mockResendSend.mockRejectedValue(new Error('API quota exceeded'));

      const result = await sendInquiryNotification(mockInquiryData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('API quota exceeded');
      expect(result.messageId).toBeUndefined();
    });

    it('should fail when RESEND_API_KEY is missing', async () => {
      delete process.env.RESEND_API_KEY;

      const result = await sendInquiryNotification(mockInquiryData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('RESEND_API_KEY environment variable is not set');
      expect(mockResendSend).not.toHaveBeenCalled();
    });

    it('should fail when NOTIFICATION_EMAIL is missing', async () => {
      delete process.env.NOTIFICATION_EMAIL;

      const result = await sendInquiryNotification(mockInquiryData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('NOTIFICATION_EMAIL environment variable is not set');
      expect(mockResendSend).not.toHaveBeenCalled();
    });

    it('should handle special characters in email content', async () => {
      const specialData: InquiryNotificationData = {
        name: 'François <script>alert("test")</script>',
        email: 'francois@example.com',
        company: 'Côte & Associates',
        message: 'Need quote for "premium" product & delivery\nMultiple lines\n\nWith breaks',
        subject: 'Special chars: <>&"\'',
      };

      mockResendSend.mockResolvedValue({
        data: { id: 'email-special' },
      });

      const result = await sendInquiryNotification(specialData);

      expect(result.success).toBe(true);

      const emailCall = mockResendSend.mock.calls[0][0];
      expect(emailCall.html).toContain('François <script>alert("test")</script>');
      expect(emailCall.html).toContain('Côte & Associates');
    });

    it('should set correct email headers and reply-to', async () => {
      mockResendSend.mockResolvedValue({
        data: { id: 'email-headers' },
      });

      await sendInquiryNotification(mockInquiryData);

      expect(mockResendSend).toHaveBeenCalledWith({
        from: 'noreply@insight-up-solutions.com',
        to: 'business@example.com',
        subject: 'New Quote Request: Test Quote Request',
        html: expect.any(String),
        replyTo: 'john@example.com',
      });
    });
  });
});