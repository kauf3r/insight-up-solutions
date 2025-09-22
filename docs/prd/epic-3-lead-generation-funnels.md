# Epic 3: Lead Generation Funnels

**Goal:** Implement and activate the core business funnels by creating fully functional "Request a Quote" and "Book a Demo" forms with email notifications.

## **Story 3.1: Reusable Inquiry Form Component**
**As a** developer, **I want** to create a single, reusable form component for user inquiries, **so that** I can maintain consistency and avoid code duplication for quote and demo requests.
**Acceptance Criteria:**
1.  A new `InquiryForm` component is created using `react-hook-form` for state management and `Zod` for validation.
2.  The form includes validated, required fields for Name, Email, and a Message. A field for Company is optional.
3.  The component accepts props for a title (e.g., "Request a Quote") and a hidden subject line for email routing.
4.  The form is built with `shadcn/ui` input components and is fully responsive.

## **Story 3.2: Quote Request Page & API Endpoint**
**As a** user browsing a high-value item, **I want** to fill out and submit a "Request a Quote" form, **so that** I can receive pricing and follow-up information.
**Acceptance Criteria:**
1.  A new page is created at a `/quote-request` route, displaying the `InquiryForm`.
2.  A Next.js Server Action or Route Handler is created to securely receive the form data.
3.  Upon successful submission, the form is cleared and a success message is displayed to the user.
4.  If submission fails, a clear error message is displayed without losing the user's input.

## **Story 3.3: Email Notification Integration**
**As a** business owner, **I want** to receive an immediate email notification when a quote request is submitted, **so that** I can provide a timely response to the new lead.
**Acceptance Criteria:**
1.  The Resend email service is integrated into the backend.
2.  The form submission action from Story 3.2 is updated to trigger a formatted email.
3.  The notification email is sent to a configurable address stored in an environment variable.
4.  The email's body contains all the data submitted by the user in a clear, readable format.

## **Story 3.4: Demo Booking Page and Funnel**
**As a** user interested in the test range, **I want** to fill out and submit a "Book a Demo" form, **so that** I can schedule a demonstration.
**Acceptance Criteria:**
1.  A new page is created at a `/book-demo` route that reuses the `InquiryForm` component with the appropriate title.
2.  The form submission is handled by the existing backend logic.
3.  Upon submission, a notification email with the subject "New Demo Request" is sent to the configured company address.
4.  The user receives a clear success confirmation on the page.