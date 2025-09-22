# Components

## Component List
- **UI / Frontend**: Handles all user interface rendering and client-side state.
- **API Layer**: Serves as the secure, type-safe boundary between client and server.
- **Data Access Layer**: Manages all communication with the database via Prisma.
- **Authentication Service**: Handles all user sign-in and session management via NextAuth.js.
- **External Service Integrations**: Encapsulates all communication with third-party APIs (Stripe, Resend).

## Component Diagram

```mermaid
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
        H[Resend API]
    end

    A --"Calls (HTTPS)"--> B;
    B --"Uses"--> C;
    B --"Uses"--> D;
    B --"Uses"--> E;
    C --"Reads/Writes"--> D;
    D --"Queries"--> F;
    E --"Calls (HTTPS)"--> G;
    E --"Calls (HTTPS)"--> H;
```