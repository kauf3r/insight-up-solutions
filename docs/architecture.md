Of course. Here is the final and most detailed document, the complete Fullstack Architecture Document. You can save this as docs/architecture.md in your project folder.

Markdown

# Fullstack Architecture Document: Insight Up Solutions

### 1. Introduction

To accelerate development and ensure we start with best practices, this architecture will be based on the well-regarded **"T3 Stack"** starter template. This provides a pre-configured, type-safe environment and a solid, community-vetted foundation that saves significant setup time.

---

### 2. High Level Architecture

#### Technical Summary
This project will be a full-stack, type-safe web application built using the T3 Stack. It leverages Next.js for both frontend rendering and backend API logic, deployed monolithically on the Vercel platform. The architecture is serverless-first, using Prisma for database access, NextAuth for authentication, and Tailwind CSS for styling. This integrated approach within a monorepo ensures a cohesive, maintainable, and highly performant system.

#### Platform and Infrastructure Choice
* **Platform:** Vercel
* **Key Services:** Next.js Hosting, Serverless Functions, Global Edge Network (CDN).
* **Rationale:** Vercel is the creator of Next.js and provides a seamless, zero-configuration deployment experience that is highly optimized for this specific stack.

#### Repository Structure
* **Structure:** Monorepo
* **Rationale:** This is the default and recommended structure for the T3 Stack, enabling seamless, end-to-end type-sharing between the frontend components and the backend database schemas.

#### High Level Architecture Diagram
```mermaid
graph TD
    User --> Vercel[Vercel Edge Network];
    Vercel --> NextApp[Next.js Application];
    
    subgraph NextApp
        direction LR
        UI[UI Components]
        ServerActions[Server Actions & API Routes]
    end

    ServerActions --> NextAuth[NextAuth.js];
    ServerActions --> Prisma[Prisma ORM];
    ServerActions --> EmailService[Email Service Layer];
    Prisma --> DB[(PostgreSQL Database)];
    EmailService --> Gmail[Google Workspace Gmail API];

    style DB fill:#d3e8f6
    style Gmail fill:#4285f4
Architectural Patterns
Full-stack Framework: Using Next.js as a single, integrated framework for both client-side UI and server-side logic.

End-to-End Type Safety: Leveraging TypeScript, Zod, and Prisma to ensure data types are consistent and validated from the database all the way to the UI components.

Serverless-First: Utilizing Vercel's serverless functions for API routes and Server Actions, ensuring automatic scaling and reduced operational overhead.

Component-Based UI: Employing React to build the user interface as a collection of declarative, reusable components.

3. Tech Stack
This table lists the specific technologies and versions that MUST be used for this project.

Category	Technology	Version	Purpose & Rationale
Framework	Next.js	14.x	Integrated React framework for UI, server logic, and APIs.
Language	TypeScript	5.x	Ensures end-to-end type safety across the entire application.
Styling	Tailwind CSS	3.x	A utility-first CSS framework for rapid and consistent UI development.
UI Components	shadcn/ui	latest	Composable, accessible, and customizable components built on Radix UI.
ORM	Prisma	5.x	Next-generation ORM for type-safe database access and migrations.
Database	PostgreSQL	latest	Robust, scalable, and reliable SQL database (hosted via Neon).
Authentication	NextAuth.js (Auth.js)	5.x	Full-featured authentication solution optimized for Next.js.
Payments	Stripe SDK	latest	Secure payment processing for the e-commerce functionality.
Email Service	Google Workspace Gmail API	latest	Enterprise email integration using domain-managed Google Workspace with provider abstraction.
Email Transport	Nodemailer	latest	Reliable SMTP transport layer with OAuth2 authentication for Google Workspace.
Google APIs	googleapis	latest	Official Google API client library for service account authentication and Gmail API access.
Unit Testing	Vitest	latest	A fast and modern testing framework for unit and component tests.
E2E Testing	Playwright	latest	For robust, end-to-end testing of user flows across browsers.
Deployment	Vercel	N/A	The hosting platform, providing seamless deployment and infrastructure.

EXPORT TO SHEETS
4. Data Models
Product
Purpose: Represents any sellable or quotable item in the catalog.

TypeScript Interface

TypeScript

enum ProductType {
  UAV,
  PAYLOAD,
  ACCESSORY,
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  type: ProductType;
  specifications: Record<string, any>;
  imageUrl: string;
  quoteOnly: boolean;
}
User
Purpose: Represents an authenticated user of the application, managed by NextAuth.js.

TypeScript Interface

TypeScript

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  emailVerified?: Date | null;
  image?: string | null;
}
Order
Purpose: Represents a completed purchase transaction for accessory items.

TypeScript Interface

TypeScript

enum OrderStatus {
  PENDING,
  COMPLETED,
  FAILED,
}

interface Order {
  id: string;
  amount: number;
  status: OrderStatus;
  stripePaymentIntentId: string;
  userId: string;
}
OrderItem
Purpose: Represents a single line item within an Order.

TypeScript Interface

TypeScript

interface OrderItem {
  id: string;
  quantity: number;
  orderId: string;
  productId: string;
}
5. API Specification
This project will use an integrated, type-safe API layer built with Next.js Server Actions for data mutations and Route Handlers for data queries.

Queries (Data Fetching)
products.getProducts: Fetches a list of all products.

products.getProductBySlug: Fetches a single product by its slug.

Mutations (Data Changing)
inquiries.submitInquiry: Handles submissions for quote and demo forms.

checkout.createSession: Creates a Stripe Checkout Session for purchases.

6. Components
Component List
UI / Frontend: Handles all user interface rendering and client-side state.

API Layer: Serves as the secure, type-safe boundary between client and server.

Data Access Layer: Manages all communication with the database via Prisma.

Authentication Service: Handles all user sign-in and session management via NextAuth.js.

External Service Integrations: Encapsulates all communication with third-party APIs (Stripe, Resend).

Component Diagram
Code snippet

graph TD
    subgraph "User's Browser"
        A[UI / Frontend]
    end

    subgraph "Vercel Platform"
        B[API Layer]
        C[Authentication Service]
        D[Data Access Layer]
        E[External Service Integrations]
        F[(Database - PostgreSQL)]
    end

    subgraph "Third Parties"
        G[Stripe API]
        H[Google Workspace Gmail API]
    end

    A --"Calls (HTTPS)"--> B;
    B --"Uses"--> C;
    B --"Uses"--> D;
    B --"Uses"--> E;
    C --"Reads/Writes"--> D;
    D --"Queries"--> F;
    E --"Calls (HTTPS)"--> G;
    E --"Calls (HTTPS)"--> H;
7. External APIs
Stripe API
Purpose: To process payments for accessory purchases.

Documentation: https://stripe.com/docs/api

Authentication: Server-side secret API key.

Key SDK Methods: checkout.sessions.create, webhooks.

Resend API
Purpose: To send all transactional emails (lead notifications, order confirmations).

Documentation: https://resend.com/docs/api-reference/introduction

Authentication: Server-side secret API key.

Key SDK Methods: resend.emails.send.

8. Core Workflows
Quote Request Submission
Code snippet

sequenceDiagram
    participant User
    participant Frontend
    participant API Layer (Server Action)
    participant Resend API

    User->>+Frontend: Fills and submits quote form
    Frontend->>+API Layer (Server Action): calls inquiries.submitInquiry(formData)
    API Layer (Server Action)->>API Layer (Server Action): Validates input data
    API Layer (Server Action)->>+Resend API: Sends formatted email
    Resend API-->>-API Layer (Server Action): Confirms email sent
    API Layer (Server Action)-->>-Frontend: Returns { success: true }
    Frontend->>-User: Displays "Thank You" message
Accessory Purchase & Order Fulfillment
Code snippet

sequenceDiagram
    participant User
    participant Frontend
    participant API Layer (Server Action)
    participant Stripe API
    participant Webhook Handler

    User->>Frontend: Adds item to cart & clicks "Checkout"
    Frontend->>+API Layer (Server Action): calls checkout.createSession(cartItems)
    API Layer (Server Action)->>+Stripe API: Creates Checkout Session
    Stripe API-->>-API Layer (Server Action): Returns checkoutUrl
    API Layer (Server Action)-->>-Frontend: Returns { checkoutUrl }
    Frontend->>User: Redirects to Stripe Checkout Page

    User->>+Stripe API: Enters payment information
    Stripe API-->>-User: Confirms payment & redirects back to site
    User->>Frontend: Lands on /success page

    alt Asynchronous Webhook
        Stripe API->>+Webhook Handler: Sends 'checkout.session.completed' event
        Webhook Handler->>Webhook Handler: Verifies event and saves order to DB
        Webhook Handler->>-Webhook Handler: Triggers confirmation email via Resend
    end
9. Database Schema
This schema will be located in prisma/schema.prisma.

Code snippet

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum ProductType {
  UAV
  PAYLOAD
  ACCESSORY
}

model Product {
  id              String      @id @default(cuid())
  name            String
  slug            String      @unique
  description     String
  price           Float
  type            ProductType
  specifications  Json
  imageUrl        String
  quoteOnly       Boolean     @default(false)
  orderItems      OrderItem[]
}

model Order {
  id                    String      @id @default(cuid())
  amount                Float
  status                String      @default("PENDING")
  stripePaymentIntentId String      @unique
  userId                String
  user                  User        @relation(fields: [userId], references: [id])
  items                 OrderItem[]
  @@index([userId])
}

model OrderItem {
  id          String    @id @default(cuid())
  quantity    Int
  orderId     String
  order       Order     @relation(fields: [orderId], references: [id])
  productId   String
  product     Product   @relation(fields: [productId], references: [id])
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
  orders        Order[]
}

// ... Standard NextAuth.js models (Account, Session, VerificationToken)
10. Frontend Architecture
Component Architecture
Organization: Components will be organized into /ui (from shadcn), /common (reusable), and /features (specific) directories.

Template: All components will follow a standard TypeScript template using React.forwardRef.

State Management Architecture
Server State: Handled by TanStack Query (React Query) for caching and data synchronization.

Global Client State: Handled by Zustand for shared state like the shopping cart.

Local State: Handled by React's useState hook.

Routing Architecture
System: We will use the Next.js 14 App Router, with routes defined by the file system structure within /app.

Protection: Future protected routes will be secured using NextAuth.js Middleware.

Frontend Services Layer
Pattern: Communication with the backend will be via Server Actions (for mutations) and fetch calls to Route Handlers (for queries), wrapped in TanStack Query hooks.

11. Backend Architecture
Service Architecture
Paradigm: A serverless approach using Next.js, with backend logic co-located with the frontend.

Organization: Logic will be organized into API Route Handlers (/app/api/) and Server Actions (/app/_actions/).

Database Architecture
Schema: The definitive schema is in Section 9.

Access Pattern: All database operations will be encapsulated within Repository modules to separate concerns.

Authentication and Authorization
Flow: A passwordless "Magic Link" sign-in flow will be implemented using NextAuth.js and Resend.

Authorization: Handled via NextAuth.js Middleware.

12. Unified Project Structure
Plaintext

/insight-up-solutions
├── /apps
│   └── /web/
│       ├── /src/
│       │   ├── /app/
│       │   ├── /_actions/
│       │   ├── /components/
│       │   ├── /repositories/
│       │   └── ...
│       └── next.config.js
├── /packages/
│   └── /db/
│       └── /prisma/
│           └── schema.prisma
└── package.json
13. Development Workflow
Setup: pnpm install, cp .env.example .env, pnpm --filter db run migrate:dev

Commands: pnpm dev, pnpm test, pnpm --filter db run studio

14. Deployment Architecture
Platform: Vercel

CI/CD: Handled by Vercel's built-in Git integration, with automatic Preview Deployments for Pull Requests and Production Deployments on merge to main.

15. Security and Performance
Security: Input validation with Zod, secure session management with NextAuth.js, and configuration of security headers.

Performance: Goal of Lighthouse score 90+, achieved through Next.js/Vercel optimizations and client-side caching with TanStack Query.

16. Testing Strategy
Pyramid: A mix of Unit (Vitest), Integration, and End-to-End (Playwright) tests.

Organization: Tests will be co-located with the code they test or in a dedicated /e2e directory.

17. Coding Standards
Key Rules: Type Safety First, Use the Repository Pattern, Centralized Environment Variables, Server-Side Validation.

Naming: Consistent conventions for components, hooks, API routes, and database models.

18. Error Handling Strategy
Pattern: A unified strategy with standardized JSON error formats, React Error Boundaries on the frontend, and centralized error handlers on the backend.

19. Monitoring and Observability
Stack: Vercel Analytics for traffic and performance, Vercel Logs for backend function monitoring. A dedicated service like Sentry is recommended for production error tracking.