import { Resend } from 'resend';

export interface InquiryNotificationData {
  name: string;
  email: string;
  company?: string;
  message: string;
  subject: string;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export async function sendInquiryNotification(data: InquiryNotificationData): Promise<EmailResult> {
  try {
    // Validate required environment variables
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY environment variable is not set');
    }

    if (!process.env.NOTIFICATION_EMAIL) {
      throw new Error('NOTIFICATION_EMAIL environment variable is not set');
    }

    // Create formatted email content
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #0066cc; padding-bottom: 10px;">
          New Quote Request Received
        </h2>

        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #0066cc; margin-top: 0;">Contact Information</h3>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
          ${data.company ? `<p><strong>Company:</strong> ${data.company}</p>` : ''}
          <p><strong>Subject:</strong> ${data.subject}</p>
        </div>

        <div style="background-color: #fff; padding: 20px; border: 1px solid #dee2e6; border-radius: 8px;">
          <h3 style="color: #0066cc; margin-top: 0;">Message</h3>
          <p style="white-space: pre-wrap; line-height: 1.6;">${data.message}</p>
        </div>

        <div style="margin-top: 20px; padding: 15px; background-color: #e7f3ff; border-radius: 8px;">
          <p style="margin: 0; font-size: 14px; color: #666;">
            This email was automatically generated from a quote request submitted on your website.
            Please respond directly to the customer at: <a href="mailto:${data.email}">${data.email}</a>
          </p>
        </div>
      </div>
    `;

    // Initialize Resend client
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Send email via Resend
    const result = await resend.emails.send({
      from: 'noreply@insight-up-solutions.com', // You'll need to configure this domain in Resend
      to: process.env.NOTIFICATION_EMAIL,
      subject: `New Quote Request: ${data.subject}`,
      html: emailHtml,
      replyTo: data.email, // Allow direct reply to customer
    });

    return {
      success: true,
      messageId: result.data?.id,
    };
  } catch (error) {
    console.error('Failed to send inquiry notification:', error);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}