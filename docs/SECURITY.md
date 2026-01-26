# Security Guidelines

This document outlines security best practices and guidelines for the Internal Developer Platform.

## Table of Contents

- [Security Principles](#security-principles)
- [Authentication & Authorization](#authentication--authorization)
- [Data Protection](#data-protection)
- [Frontend Security](#frontend-security)
- [Dependency Security](#dependency-security)
- [Security Headers](#security-headers)
- [Incident Response](#incident-response)
- [Security Checklist](#security-checklist)

## Security Principles

### Defense in Depth

Multiple layers of security controls:

```
┌─────────────────────────────────────────────────────────────┐
│                    Network Layer                             │
│  (WAF, DDoS protection, TLS)                                │
├─────────────────────────────────────────────────────────────┤
│                    Application Layer                         │
│  (Authentication, Authorization, Input validation)          │
├─────────────────────────────────────────────────────────────┤
│                    Data Layer                                │
│  (Encryption at rest, Access controls)                      │
└─────────────────────────────────────────────────────────────┘
```

### Principle of Least Privilege

- Request only necessary permissions
- Scope access tokens appropriately
- Limit API exposure to required endpoints

### Security by Default

- Secure defaults in configuration
- Opt-in for less secure options
- Fail securely

## Authentication & Authorization

### Token Handling

```typescript
// ❌ Bad: Storing tokens in localStorage
localStorage.setItem('token', accessToken);

// ✅ Good: Store tokens in memory or httpOnly cookies
// Tokens should be managed by authentication service
```

### Session Management

```typescript
// Session timeout handling
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

function checkSessionTimeout() {
  const lastActivity = getLastActivityTime();
  if (Date.now() - lastActivity > SESSION_TIMEOUT) {
    logout();
    redirectToLogin();
  }
}

// Activity tracking
window.addEventListener('click', updateLastActivity);
window.addEventListener('keypress', updateLastActivity);
```

### Role-Based Access Control (RBAC)

```typescript
// Define permissions
type Permission = 
  | 'deployments:read'
  | 'deployments:write'
  | 'deployments:approve'
  | 'applications:create'
  | 'applications:delete';

// Role definitions
const ROLES: Record<string, Permission[]> = {
  developer: ['deployments:read', 'applications:create'],
  'tech-lead': ['deployments:read', 'deployments:write', 'deployments:approve'],
  admin: ['deployments:read', 'deployments:write', 'deployments:approve', 'applications:delete'],
};

// Permission check
function hasPermission(userRole: string, permission: Permission): boolean {
  return ROLES[userRole]?.includes(permission) ?? false;
}

// Component protection
function ProtectedAction({ permission, children }: Props) {
  const { user } = useUserStore();
  
  if (!hasPermission(user.role, permission)) {
    return null;
  }
  
  return children;
}
```

## Data Protection

### Sensitive Data Handling

```typescript
// ❌ Bad: Logging sensitive data
console.log('User data:', { email, password, ssn });

// ✅ Good: Sanitize logs
console.log('User data:', { email, password: '[REDACTED]' });

// ❌ Bad: Exposing sensitive data in URL
navigate(`/users?ssn=${ssn}`);

// ✅ Good: Use POST or secure state
navigate('/users', { state: { userId } });
```

### Data Masking

```typescript
// Mask sensitive display data
function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  return `${local.slice(0, 2)}***@${domain}`;
}

function maskPhoneNumber(phone: string): string {
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
}
```

### Secure Data Transmission

- Always use HTTPS
- Encrypt sensitive API payloads when needed
- Validate TLS certificates

## Frontend Security

### Cross-Site Scripting (XSS) Prevention

```typescript
// ❌ Bad: Using dangerouslySetInnerHTML without sanitization
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ Good: Sanitize HTML content
import DOMPurify from 'dompurify';

<div dangerouslySetInnerHTML={{ 
  __html: DOMPurify.sanitize(userInput) 
}} />

// ✅ Better: Avoid dangerouslySetInnerHTML when possible
<div>{userInput}</div>  // React auto-escapes
```

### URL Handling

```typescript
// ❌ Bad: Unvalidated redirect
window.location.href = userProvidedUrl;

// ✅ Good: Validate URLs
function safeRedirect(url: string) {
  const allowedOrigins = [
    'https://idp.company.com',
    'https://api.company.com',
  ];
  
  try {
    const parsedUrl = new URL(url);
    if (allowedOrigins.includes(parsedUrl.origin)) {
      window.location.href = url;
    } else {
      console.error('Invalid redirect URL');
    }
  } catch {
    console.error('Invalid URL format');
  }
}
```

### Input Validation

```typescript
// Client-side validation (UX, not security)
const schema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  url: z.string().url().optional(),
});

// Always validate on server side as well!
```

### Content Security Policy (CSP)

```html
<!-- Strict CSP header -->
<meta http-equiv="Content-Security-Policy" 
      content="
        default-src 'self';
        script-src 'self' 'unsafe-inline';
        style-src 'self' 'unsafe-inline';
        img-src 'self' data: https:;
        connect-src 'self' https://api.company.com;
        frame-ancestors 'none';
      ">
```

## Dependency Security

### Dependency Auditing

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Force fix (use with caution)
npm audit fix --force
```

### Automated Security Scanning

```yaml
# .github/workflows/security.yml
name: Security Scan

on:
  push:
  schedule:
    - cron: '0 0 * * *'  # Daily

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: npm audit
        run: npm audit --audit-level=high
      
      - name: Snyk scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

### Dependency Best Practices

- Pin dependency versions in package-lock.json
- Review dependency updates before merging
- Use Dependabot or Renovate for automated updates
- Prefer well-maintained, popular packages

## Security Headers

### Recommended Headers

```nginx
# nginx configuration
add_header X-Frame-Options "DENY";
add_header X-Content-Type-Options "nosniff";
add_header X-XSS-Protection "1; mode=block";
add_header Referrer-Policy "strict-origin-when-cross-origin";
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()";
add_header Content-Security-Policy "default-src 'self'; ...";
```

### Header Explanations

| Header | Purpose |
|--------|---------|
| `X-Frame-Options` | Prevents clickjacking |
| `X-Content-Type-Options` | Prevents MIME sniffing |
| `X-XSS-Protection` | XSS filter (legacy browsers) |
| `Referrer-Policy` | Controls referer header |
| `Permissions-Policy` | Restricts browser features |
| `Content-Security-Policy` | XSS/injection protection |

## Incident Response

### Severity Levels

| Level | Description | Response Time |
|-------|-------------|---------------|
| **Critical** | Active breach, data exposure | Immediate |
| **High** | Vulnerability being exploited | < 4 hours |
| **Medium** | Vulnerability discovered | < 24 hours |
| **Low** | Minor security improvement | Next sprint |

### Response Procedure

1. **Identify** - Confirm and assess the incident
2. **Contain** - Limit the impact
3. **Eradicate** - Remove the threat
4. **Recover** - Restore normal operations
5. **Learn** - Post-mortem and improvements

### Reporting Security Issues

- **Internal:** Report to #security Slack channel
- **External:** security@company.com
- **Bug Bounty:** bounty.company.com (if applicable)

## Security Checklist

### Code Review Security Checklist

- [ ] No sensitive data in logs
- [ ] No hardcoded credentials
- [ ] Input validation present
- [ ] Output encoding/escaping
- [ ] Proper error handling (no stack traces exposed)
- [ ] Authentication checks in place
- [ ] Authorization checks in place
- [ ] No SQL injection vulnerabilities
- [ ] No XSS vulnerabilities
- [ ] Secure randomness used where needed

### Pre-Deployment Security Checklist

- [ ] Dependencies audited (`npm audit`)
- [ ] Security headers configured
- [ ] HTTPS enforced
- [ ] Error pages don't leak information
- [ ] Logging configured (no sensitive data)
- [ ] Rate limiting configured
- [ ] CORS properly configured

### Periodic Security Tasks

| Task | Frequency |
|------|-----------|
| Dependency audit | Weekly |
| Security scanning | Daily (automated) |
| Penetration testing | Quarterly |
| Security training | Annually |
| Access review | Quarterly |

---

For deployment procedures, see [Deployment](DEPLOYMENT.md).
