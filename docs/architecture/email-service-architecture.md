# Email Service Architecture

## 1. Introduction

This document outlines the email service architecture for Insight Up Solutions, detailing the migration from Resend to Google Workspace (Gmail API) integration. The architecture emphasizes provider abstraction, security, and maintainability while supporting the existing Next.js Server Actions pattern.

**Primary Goals:**
- Seamless integration with Google Workspace domain
- Maintain existing email functionality without breaking changes
- Provider abstraction for future flexibility
- Enterprise-grade security and monitoring
- Cost optimization through native Google Workspace integration

---

## 2. High Level Architecture

### Architecture Overview

```mermaid
graph TD
    User[User Submits Form] --> SA[Server Action]
    SA --> ES[Email Service Layer]

    subgraph "Email Service Abstraction"
        ES --> EI[EmailProvider Interface]
        EI --> GWP[GoogleWorkspaceProvider]
        EI --> MP[MockProvider - Testing]
        EI --> RP[ResendProvider - Fallback]
    end

    subgraph "Google Workspace Integration"
        GWP --> NM[Nodemailer + OAuth2]
        GWP --> GA[Gmail API Direct]
        NM --> GM[Gmail SMTP]
        GA --> GML[Gmail API]
    end

    subgraph "Authentication Layer"
        SA2[Service Account] --> JWT[JWT Generation]
        OAuth[OAuth2 Flow] --> AT[Access Token]
        JWT --> GCP[Google Cloud Platform]
        AT --> GCP
    end

    ES --> LOG[Logging & Monitoring]
    ES --> QUEUE[Email Queue - Future]

    style GWP fill:#4285f4
    style ES fill:#34a853
    style SA fill:#ea4335
```

### Technical Summary

The email service architecture implements a **provider pattern** that abstracts email delivery behind a clean interface. This allows for seamless provider switching, comprehensive testing, and future scalability. The primary implementation uses **Google Workspace** with **Nodemailer + OAuth2** for transactional emails, with a fallback path to **Gmail API** for advanced features.

The architecture integrates directly with the existing **Next.js Server Actions**, maintaining the current developer experience while upgrading the underlying email infrastructure to enterprise-grade Google Workspace integration.

---

## 3. Provider Architecture

### EmailProvider Interface

```typescript
interface EmailProvider {
  sendEmail(params: EmailParams): Promise<EmailResult>;
  validateConfiguration(): Promise<boolean>;
  getProviderName(): string;
}

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  html: string;
  replyTo?: string;
  attachments?: EmailAttachment[];
}

interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  provider: string;
}
```

### Provider Implementations

#### 1. GoogleWorkspaceProvider (Primary)

**Implementation Strategy**: Nodemailer with OAuth2
- **Authentication**: Service Account with Domain-Wide Delegation
- **SMTP**: gmail.com with OAuth2 credentials
- **Benefits**: Mature, reliable, extensive documentation
- **Use Case**: All transactional emails

```typescript
class GoogleWorkspaceProvider implements EmailProvider {
  private transporter: nodemailer.Transporter;

  async initialize() {
    // OAuth2 setup with service account
    // JWT token generation
    // Nodemailer transporter configuration
  }
}
```

#### 2. GmailAPIProvider (Advanced)

**Implementation Strategy**: Direct Gmail API integration
- **Authentication**: Service Account with Gmail API scopes
- **Protocol**: REST API calls to Gmail endpoints
- **Benefits**: Full Gmail feature access, native integration
- **Use Case**: Future advanced features (threading, labels, etc.)

#### 3. MockProvider (Testing)

**Implementation Strategy**: In-memory mock for testing
- **Purpose**: Unit and integration testing
- **Features**: Configurable success/failure scenarios
- **Benefits**: Fast, reliable, no external dependencies

---

## 4. Authentication Architecture

### Service Account Authentication (Recommended)

**Setup Requirements:**
1. Google Cloud Project with Gmail API enabled
2. Service Account with domain-wide delegation
3. OAuth scopes configured in Google Workspace Admin Console
4. Service Account JSON key securely stored

**Required OAuth Scopes:**
- `https://www.googleapis.com/auth/gmail.send`
- `https://mail.google.com/` (for SMTP access)

**Authentication Flow:**
```typescript
// JWT-based authentication for service accounts
const jwtClient = new google.auth.JWT(
  serviceAccountEmail,
  null,
  privateKey,
  ['https://www.googleapis.com/auth/gmail.send'],
  impersonateUser // The domain user to send emails as
);
```

### Environment Configuration

```bash
# Google Workspace Configuration
GOOGLE_SERVICE_ACCOUNT_EMAIL=service@project.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_KEY=-----BEGIN PRIVATE KEY-----...
GOOGLE_WORKSPACE_USER_EMAIL=noreply@insight-up-solutions.com
GOOGLE_CLIENT_ID=123456789.apps.googleusercontent.com

# Application Configuration
NOTIFICATION_EMAIL=business@insight-up-solutions.com
EMAIL_PROVIDER=google-workspace # google-workspace | resend | mock
```

---

## 5. Security Architecture

### Security Principles

1. **Principle of Least Privilege**: Service accounts have minimal required permissions
2. **Secure Credential Storage**: Private keys stored as environment variables, never in code
3. **Domain Restriction**: Service account limited to specific Google Workspace domain
4. **Audit Logging**: All email operations logged for security monitoring
5. **Rate Limiting**: Implement Google API rate limit compliance

### Security Measures

**Credential Management:**
- Service account private keys stored in secure environment variables
- Automatic key rotation support (future enhancement)
- No credentials in client-side code or version control

**Access Control:**
- Domain-wide delegation scoped to email sending only
- Service account cannot access user data beyond email sending
- Restricted to specific Google Workspace domain

**Monitoring:**
- Failed authentication attempts logged
- Unusual sending patterns detected
- Integration with existing application monitoring

---

## 6. Migration Strategy

### Phase 1: Provider Abstraction (Week 1)

**Objective**: Implement provider pattern with current Resend as default

**Tasks:**
1. Create EmailProvider interface and service layer
2. Implement ResendProvider wrapper around existing code
3. Update Server Actions to use new service layer
4. Maintain 100% backward compatibility
5. Deploy and validate no regressions

**Benefits**: Zero risk, prepares for migration

### Phase 2: Google Workspace Implementation (Week 2)

**Objective**: Implement and test Google Workspace provider

**Tasks:**
1. Implement GoogleWorkspaceProvider with Nodemailer
2. Set up Google Cloud Project and service account
3. Configure Google Workspace domain delegation
4. Comprehensive testing in staging environment
5. Feature flag for gradual rollout

**Benefits**: New provider ready, parallel testing

### Phase 3: Production Migration (Week 3)

**Objective**: Switch to Google Workspace in production

**Tasks:**
1. Deploy with feature flag enabled for small percentage
2. Monitor email delivery rates and errors
3. Gradually increase percentage to 100%
4. Remove Resend provider after 30-day validation period
5. Clean up deprecated dependencies

**Benefits**: Risk-free rollout with rollback capability

### Rollback Strategy

**Immediate Rollback**: Feature flag can instantly switch back to Resend
**Data Consistency**: Email logs preserved across providers
**Monitoring**: Automated alerting on delivery failure rate increases

---

## 7. Performance & Monitoring

### Performance Considerations

**Email Delivery:**
- Target: < 2 seconds for email sending
- Timeout: 30 seconds with automatic retry
- Queue: Future implementation for high-volume scenarios

**Rate Limiting:**
- Gmail API: 1 billion requests per day
- SMTP: 2000 emails per day per user
- Implementation: Respect Google's rate limits

**Error Handling:**
- Automatic retry for transient failures
- Graceful degradation (email failure doesn't block form submission)
- Detailed error logging for debugging

### Monitoring & Observability

**Key Metrics:**
- Email delivery success rate (target: >99.9%)
- Average email sending latency
- Authentication failure rate
- API quota usage

**Alerting:**
- Email delivery failure rate > 1%
- Authentication failures > 5% in 10 minutes
- API quota approaching limits (>80%)

**Logging:**
```typescript
// Structured logging for email operations
{
  timestamp: "2024-01-15T10:30:00Z",
  operation: "send_email",
  provider: "google-workspace",
  success: true,
  messageId: "abc123",
  recipient: "user@example.com",
  subject: "New Quote Request",
  latency: "1.2s"
}
```

---

## 8. Cost Analysis

### Google Workspace vs Resend

**Resend Costs:**
- $20/month for 100k emails
- Additional charges for higher volumes
- Third-party service dependency

**Google Workspace Costs:**
- Included in existing Google Workspace subscription
- Gmail API free up to quota limits
- No additional charges for standard usage

**Estimated Savings:**
- Monthly: $20+ saved on Resend subscription
- Annual: $240+ in direct cost savings
- Additional: Reduced vendor management overhead

### Implementation Costs

**Development Time:**
- Architecture & Implementation: 2-3 weeks
- Testing & Validation: 1 week
- Documentation & Training: 0.5 weeks

**Operational Costs:**
- Google Cloud Project: Free tier sufficient
- Monitoring Integration: Existing infrastructure
- Maintenance: Reduced due to native integration

---

## 9. Testing Strategy

### Unit Testing

**Email Service Layer:**
```typescript
describe('EmailService', () => {
  it('should route to correct provider based on configuration');
  it('should handle provider failures gracefully');
  it('should validate email parameters');
  it('should log all email operations');
});
```

**Google Workspace Provider:**
```typescript
describe('GoogleWorkspaceProvider', () => {
  it('should authenticate with service account');
  it('should send emails via Nodemailer');
  it('should handle authentication failures');
  it('should respect rate limits');
});
```

### Integration Testing

**End-to-End Email Flow:**
- Form submission triggers email
- Email delivered to recipient
- Error scenarios handled gracefully
- Monitoring data captured correctly

**Provider Switching:**
- Feature flag controls provider selection
- Seamless switching between providers
- Rollback scenarios validated

### Load Testing

**Volume Testing:**
- 1000 emails/hour sustained rate
- Peak load handling (holiday traffic)
- Rate limit compliance verification

---

## 10. Future Enhancements

### Short Term (3-6 months)

**Email Templates:**
- Rich HTML template system
- Dynamic content personalization
- A/B testing capabilities

**Enhanced Monitoring:**
- Real-time delivery dashboards
- Advanced analytics and reporting
- Integration with business intelligence tools

### Medium Term (6-12 months)

**Email Queue System:**
- Asynchronous email processing
- Priority queue for urgent emails
- Batch processing for newsletters

**Advanced Gmail Features:**
- Email threading and conversation tracking
- Custom labels and organization
- Advanced search and filtering

### Long Term (12+ months)

**Multi-Provider Strategy:**
- Primary + backup provider configuration
- Geographic provider selection
- Load balancing across providers

**Email Marketing Integration:**
- Newsletter and campaign management
- Subscriber management
- Analytics and tracking

---

## 11. Implementation Checklist

### Google Cloud Setup
- [ ] Create Google Cloud Project
- [ ] Enable Gmail API
- [ ] Create Service Account
- [ ] Generate and download service account key
- [ ] Configure domain-wide delegation

### Google Workspace Configuration
- [ ] Access Google Workspace Admin Console
- [ ] Configure API Controls
- [ ] Add domain-wide delegation for service account
- [ ] Set required OAuth scopes
- [ ] Test service account permissions

### Code Implementation
- [ ] Create EmailProvider interface
- [ ] Implement GoogleWorkspaceProvider
- [ ] Update email service layer
- [ ] Add comprehensive tests
- [ ] Update environment configuration

### Deployment & Validation
- [ ] Deploy to staging environment
- [ ] Validate email delivery
- [ ] Test error scenarios
- [ ] Configure monitoring and alerting
- [ ] Create rollback procedure

### Production Migration
- [ ] Feature flag implementation
- [ ] Gradual rollout strategy
- [ ] Monitor key metrics
- [ ] Validate business requirements
- [ ] Complete migration and cleanup

---

*This architecture document serves as the definitive guide for implementing Google Workspace email integration. All implementation decisions should reference and align with the patterns and principles outlined here.*