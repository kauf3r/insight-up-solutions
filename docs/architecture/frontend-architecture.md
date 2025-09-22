# Frontend Architecture

## Component Architecture
**Organization**: Components will be organized into /ui (from shadcn), /common (reusable), and /features (specific) directories.

**Template**: All components will follow a standard TypeScript template using React.forwardRef.

## State Management Architecture
**Server State**: Handled by TanStack Query (React Query) for caching and data synchronization.

**Global Client State**: Handled by Zustand for shared state like the shopping cart.

**Local State**: Handled by React's useState hook.

## Routing Architecture
**System**: We will use the Next.js 14 App Router, with routes defined by the file system structure within /app.

**Protection**: Future protected routes will be secured using NextAuth.js Middleware.

## Frontend Services Layer
**Pattern**: Communication with the backend will be via Server Actions (for mutations) and fetch calls to Route Handlers (for queries), wrapped in TanStack Query hooks.