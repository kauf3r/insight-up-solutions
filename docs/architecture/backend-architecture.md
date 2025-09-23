# Backend Architecture

## Service Architecture
**Paradigm**: A serverless approach using Next.js, with backend logic co-located with the frontend.

**Organization**: Logic will be organized into API Route Handlers (/app/api/) and Server Actions (/app/_actions/).

## Database Architecture
**Schema**: The definitive schema is in Section 9.

**Access Pattern**: All database operations will be encapsulated within Repository modules to separate concerns.

## Email Service Architecture
**Paradigm**: Provider abstraction pattern with Google Workspace as the primary email service.

**Organization**: Email logic organized into a service layer (`/app/lib/email/`) with provider implementations for Google Workspace, testing mocks, and future provider options.

**Integration**: Seamless integration with existing Server Actions through a clean EmailProvider interface, maintaining backward compatibility while enabling enterprise-grade email capabilities.

## Authentication and Authorization
**Flow**: A passwordless "Magic Link" sign-in flow will be implemented using NextAuth.js and Google Workspace Gmail API.

**Authorization**: Handled via NextAuth.js Middleware.

**Email Authentication**: Service account authentication with domain-wide delegation for automated email sending without user interaction.