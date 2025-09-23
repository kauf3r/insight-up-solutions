'use server';

import { z } from 'zod';
import { sendInquiryNotification } from '@/lib/email';

// Zod validation schema for Server Action
const submitInquirySchema = z.object({
  name: z.string().min(1, 'Name is required').min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  company: z.string().optional(),
  message: z.string().min(1, 'Message is required').min(10, 'Message must be at least 10 characters'),
  subject: z.string().min(1, 'Subject is required'),
});

export interface SubmitInquiryParams {
  name: string;
  email: string;
  company?: string;
  message: string;
  subject: string;
}

export interface SubmitInquiryResult {
  success: boolean;
  message: string;
  error?: string;
}

export async function submitInquiry(data: SubmitInquiryParams): Promise<SubmitInquiryResult> {
  try {
    // Server-side validation with Zod
    const validatedData = submitInquirySchema.parse(data);

    // Send email notification (non-blocking - form success doesn't depend on email)
    let emailSuccess = false;
    try {
      const emailResult = await sendInquiryNotification(validatedData);
      emailSuccess = emailResult.success;

      if (emailResult.success) {
        console.log('Email notification sent successfully:', emailResult.messageId);
      } else {
        console.error('Email notification failed:', emailResult.error);
      }
    } catch (emailError) {
      console.error('Email service error:', emailError);
    }

    // TODO: Save to database via Repository pattern
    // TODO: Integration with CRM or external services

    console.log('Inquiry submitted:', validatedData, { emailNotified: emailSuccess });

    return {
      success: true,
      message: 'Thank you for your inquiry! We\'ll get back to you within 24 hours.',
    };
  } catch (error) {
    console.error('Error submitting inquiry:', error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Please check your form data and try again.',
        error: error.errors.map(e => e.message).join(', '),
      };
    }

    return {
      success: false,
      message: 'Sorry, there was an error submitting your inquiry. Please try again.',
      error: 'Internal server error',
    };
  }
}