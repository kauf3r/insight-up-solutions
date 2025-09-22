# External APIs

## Stripe API
**Purpose**: To process payments for accessory purchases.

**Documentation**: https://stripe.com/docs/api

**Authentication**: Server-side secret API key.

**Key SDK Methods**: checkout.sessions.create, webhooks.

## Resend API
**Purpose**: To send all transactional emails (lead notifications, order confirmations).

**Documentation**: https://resend.com/docs/api-reference/introduction

**Authentication**: Server-side secret API key.

**Key SDK Methods**: resend.emails.send.