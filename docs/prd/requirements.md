# Requirements

## Functional Requirements
1.  **FR1:** The system shall display a responsive, multi-page website including a homepage, solution/industry pages, and detailed product pages.
2.  **FR2:** Product pages for the Trinity Pro, ILX-LR1, and Qube 640 must display technical specifications, image galleries, and links to downloadable resources.
3.  **FR3:** The system shall provide a "Request a Quote" form that captures user contact information and inquiry details.
4.  **FR4:** The system shall provide a "Book a Demo" form that captures user contact information and scheduling preferences for the test range.
5.  **FR5:** Upon successful submission of a Quote or Demo form, the system shall send an email notification to a designated company address.
6.  **FR6:** The system shall provide a shopping cart and a Stripe-powered checkout process for a limited catalog of accessory items.

## Non-Functional Requirements
1.  **NFR1:** The website must achieve a Google Lighthouse performance score of 90 or higher.
2.  **NFR2:** The website must comply with Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards.
3.  **NFR3:** The system must be built using the specified technology stack, including Next.js 14, TypeScript, Tailwind CSS, Prisma, and PostgreSQL.
4.  **NFR4:** The Stripe integration must be secure, processing payments without storing sensitive cardholder data on our systems.
5.  **NFR5:** The entire application must be deployable and operable on the Vercel platform.