# Epic 1: Foundation & Site Scaffolding

**Goal:** Establish the complete project foundation, including the monorepo setup, core dependencies, database connection, styling theme, and a basic, deployable homepage to validate the CI/CD pipeline.

## **Story 1.1: Project Initialization & Repository Setup**
**As a** developer, **I want** to initialize a new Next.js 14 project within a Monorepo structure, **so that** I have a clean, version-controlled foundation for development.
**Acceptance Criteria:**
1.  A new monorepo is created using npm workspaces.
2.  A new Next.js 14 application is scaffolded within an `apps/web` directory.
3.  TypeScript, ESLint, and Prettier are configured for code quality and consistency.
4.  The project is initialized as a Git repository and can be pushed to a remote provider.

## **Story 1.2: Core Dependencies & Styling Foundation**
**As a** developer, **I want** to install and configure Tailwind CSS and shadcn/ui, **so that** I have the foundational styling and component system available for all future UI work.
**Acceptance Criteria:**
1.  Tailwind CSS is successfully integrated into the Next.js application.
2.  `shadcn/ui` is initialized, and its CLI is configured correctly.
3.  A basic `Button` component imported from `shadcn/ui` renders correctly on a page to verify the setup.
4.  The global CSS file is configured with the base Tailwind directives.

## **Story 1.3: Database Setup & Prisma Integration**
**As a** developer, **I want** to set up the Prisma ORM and connect it to a local SQLite database, **so that** the application has a functional data layer for local development.
**Acceptance Criteria:**
1.  Prisma is added as a project dependency.
2.  The Prisma schema is initialized with a placeholder model to confirm connectivity.
3.  Prisma Client is generated successfully.
4.  A server component can successfully query the local SQLite database via Prisma Client without errors.

## **Story 1.4: Basic Homepage Layout & Components**
**As a** user, **I want** to see a basic homepage with a header, main content area, and footer, **so that** the fundamental layout of the site is established.
**Acceptance Criteria:**
1.  A reusable `Header` component is created that displays the company name "Insight Up Solutions".
2.  A reusable `Footer` component is created with placeholder copyright text.
3.  The main homepage (`/`) uses the `Header` and `Footer` components to structure the page.
4.  The main content area of the homepage displays a simple "Welcome" message.

## **Story 1.5: Vercel Deployment & CI/CD Pipeline**
**As a** developer, **I want** to configure and deploy the application to Vercel, **so that** I have a live preview URL and a validated continuous deployment pipeline.
**Acceptance Criteria:**
1.  The project is successfully linked to a new project on Vercel.
2.  A push to the `main` branch automatically triggers a successful production deployment.
3.  The deployed homepage from Story 1.4 is publicly accessible and renders correctly at its Vercel URL.