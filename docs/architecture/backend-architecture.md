# Backend Architecture

## Service Architecture
**Paradigm**: A serverless approach using Next.js, with backend logic co-located with the frontend.

**Organization**: Logic will be organized into API Route Handlers (/app/api/) and Server Actions (/app/_actions/).

## Database Architecture
**Schema**: The definitive schema is in Section 9.

**Access Pattern**: All database operations will be encapsulated within Repository modules to separate concerns.

## Authentication and Authorization
**Flow**: A passwordless "Magic Link" sign-in flow will be implemented using NextAuth.js and Resend.

**Authorization**: Handled via NextAuth.js Middleware.