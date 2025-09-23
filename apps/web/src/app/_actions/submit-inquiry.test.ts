import { describe, it, expect, vi, beforeEach } from 'vitest';
import { submitInquiry, SubmitInquiryParams } from './submit-inquiry';

// Mock console methods to avoid noise in tests
beforeEach(() => {
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('submitInquiry Server Action', () => {
  const validInquiryData: SubmitInquiryParams = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    company: 'Test Company',
    message: 'This is a test message for quote request with sufficient length.',
    subject: 'Quote Request',
  };

  it('successfully processes valid inquiry data', async () => {
    const result = await submitInquiry(validInquiryData);

    expect(result.success).toBe(true);
    expect(result.message).toBe('Thank you for your inquiry! We\'ll get back to you within 24 hours.');
    expect(result.error).toBeUndefined();
  });

  it('validates required fields - name', async () => {
    const invalidData = { ...validInquiryData, name: '' };

    const result = await submitInquiry(invalidData);

    expect(result.success).toBe(false);
    expect(result.message).toBe('Please check your form data and try again.');
    expect(result.error).toContain('Name is required');
  });

  it('validates name minimum length', async () => {
    const invalidData = { ...validInquiryData, name: 'A' };

    const result = await submitInquiry(invalidData);

    expect(result.success).toBe(false);
    expect(result.message).toBe('Please check your form data and try again.');
    expect(result.error).toContain('Name must be at least 2 characters');
  });

  it('validates required fields - email', async () => {
    const invalidData = { ...validInquiryData, email: '' };

    const result = await submitInquiry(invalidData);

    expect(result.success).toBe(false);
    expect(result.message).toBe('Please check your form data and try again.');
    expect(result.error).toContain('Email is required');
  });

  it('validates email format', async () => {
    const invalidData = { ...validInquiryData, email: 'invalid-email' };

    const result = await submitInquiry(invalidData);

    expect(result.success).toBe(false);
    expect(result.message).toBe('Please check your form data and try again.');
    expect(result.error).toContain('Invalid email');
  });

  it('validates required fields - message', async () => {
    const invalidData = { ...validInquiryData, message: '' };

    const result = await submitInquiry(invalidData);

    expect(result.success).toBe(false);
    expect(result.message).toBe('Please check your form data and try again.');
    expect(result.error).toContain('Message is required');
  });

  it('validates message minimum length', async () => {
    const invalidData = { ...validInquiryData, message: 'Short' };

    const result = await submitInquiry(invalidData);

    expect(result.success).toBe(false);
    expect(result.message).toBe('Please check your form data and try again.');
    expect(result.error).toContain('Message must be at least 10 characters');
  });

  it('validates required fields - subject', async () => {
    const invalidData = { ...validInquiryData, subject: '' };

    const result = await submitInquiry(invalidData);

    expect(result.success).toBe(false);
    expect(result.message).toBe('Please check your form data and try again.');
    expect(result.error).toContain('Subject is required');
  });

  it('handles optional company field correctly', async () => {
    const dataWithoutCompany = { ...validInquiryData, company: undefined };

    const result = await submitInquiry(dataWithoutCompany);

    expect(result.success).toBe(true);
    expect(result.message).toBe('Thank you for your inquiry! We\'ll get back to you within 24 hours.');
  });

  it('handles empty company field correctly', async () => {
    const dataWithEmptyCompany = { ...validInquiryData, company: '' };

    const result = await submitInquiry(dataWithEmptyCompany);

    expect(result.success).toBe(true);
    expect(result.message).toBe('Thank you for your inquiry! We\'ll get back to you within 24 hours.');
  });

  it('handles multiple validation errors', async () => {
    const invalidData = {
      name: '',
      email: 'invalid-email',
      message: 'Short',
      subject: '',
    };

    const result = await submitInquiry(invalidData);

    expect(result.success).toBe(false);
    expect(result.message).toBe('Please check your form data and try again.');
    expect(result.error).toContain('Name is required');
    expect(result.error).toContain('Invalid email');
    expect(result.error).toContain('Message must be at least 10 characters');
    expect(result.error).toContain('Subject is required');
  });

  it('logs successful submissions', async () => {
    const consoleSpy = vi.spyOn(console, 'log');

    await submitInquiry(validInquiryData);

    expect(consoleSpy).toHaveBeenCalledWith('Inquiry submitted:', expect.objectContaining({
      name: validInquiryData.name,
      email: validInquiryData.email,
      message: validInquiryData.message,
      subject: validInquiryData.subject,
    }));
  });

  it('logs errors for validation failures', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error');
    const invalidData = { ...validInquiryData, email: 'invalid' };

    await submitInquiry(invalidData);

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error submitting inquiry:', expect.any(Error));
  });

  it('simulates async operation delay', async () => {
    const startTime = Date.now();

    await submitInquiry(validInquiryData);

    const endTime = Date.now();
    const duration = endTime - startTime;

    // Should take at least 500ms due to simulated delay
    expect(duration).toBeGreaterThanOrEqual(450); // Allow some tolerance
  });
});