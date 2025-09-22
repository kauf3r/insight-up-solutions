# API Specification

This project will use an integrated, type-safe API layer built with Next.js Server Actions for data mutations and Route Handlers for data queries.

## Queries (Data Fetching)
- **products.getProducts**: Fetches a list of all products.
- **products.getProductBySlug**: Fetches a single product by its slug.

## Mutations (Data Changing)
- **inquiries.submitInquiry**: Handles submissions for quote and demo forms.
- **checkout.createSession**: Creates a Stripe Checkout Session for purchases.