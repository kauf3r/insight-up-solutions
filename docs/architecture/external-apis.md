# External APIs

## Stripe API
**Purpose**: To process payments for accessory purchases.

**Documentation**: https://stripe.com/docs/api

**Authentication**: Server-side secret API key.

**Key SDK Methods**: checkout.sessions.create, webhooks.

## Google Workspace Gmail API
**Purpose**: To send all transactional emails (lead notifications, order confirmations) using the organization's Google Workspace domain.

**Documentation**: https://developers.google.com/gmail/api/guides

**Authentication**: Service Account with domain-wide delegation using OAuth2 and JWT.

**Key Components**:
- **Gmail API**: Direct API access for advanced email features
- **Nodemailer**: SMTP integration for reliable email delivery
- **Service Account**: Automated authentication without user interaction

**Required OAuth Scopes**:
- `https://www.googleapis.com/auth/gmail.send` - Send emails on behalf of users
- `https://mail.google.com/` - SMTP access for Nodemailer integration

**Configuration Requirements**:
- Google Cloud Project with Gmail API enabled
- Service Account with domain-wide delegation configured
- Google Workspace Admin Console API controls configured
- Environment variables for service account credentials

**Key Integration Methods**:
- `gmail.users.messages.send()` - Direct API email sending
- `nodemailer.createTransport()` - SMTP-based email delivery with OAuth2
- `google.auth.JWT()` - Service account authentication