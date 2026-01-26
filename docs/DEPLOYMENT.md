# Deployment Guide

This document covers the build, deployment, and release processes for the Internal Developer Platform.

## Table of Contents

- [Build Process](#build-process)
- [Deployment Environments](#deployment-environments)
- [Deployment Strategies](#deployment-strategies)
- [Release Process](#release-process)
- [Configuration Management](#configuration-management)
- [Monitoring and Rollback](#monitoring-and-rollback)
- [Troubleshooting](#troubleshooting)

## Build Process

### Production Build

```bash
# Run production build
npm run build

# Output structure
dist/
├── index.html              # Entry HTML
├── assets/
│   ├── index-[hash].js    # Main bundle
│   ├── index-[hash].css   # Styles
│   └── [chunk]-[hash].js  # Code-split chunks
└── favicon.svg
```

### Build Configuration

Vite configuration (`vite.config.ts`):

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@dnd-kit/core', '@dnd-kit/sortable', 'lucide-react'],
        },
      },
    },
  },
});
```

### Build Optimization

| Optimization | Implementation |
|--------------|----------------|
| Code splitting | Dynamic imports for routes |
| Tree shaking | ES modules (automatic) |
| Minification | Terser (Vite default) |
| CSS purging | Tailwind CSS (automatic) |
| Asset hashing | Content-based hashes |
| Compression | gzip/brotli (server-side) |

### Build Verification

```bash
# Preview production build locally
npm run preview

# Check bundle size
npx vite-bundle-visualizer

# Validate HTML
npx html-validate dist/index.html
```

## Deployment Environments

### Environment Matrix

| Environment | URL | Purpose | Deploy Trigger |
|-------------|-----|---------|----------------|
| **Development** | `dev.idp.company.com` | Development testing | Push to `develop` |
| **Staging** | `staging.idp.company.com` | Pre-production testing | Push to `staging` |
| **Production** | `idp.company.com` | Live environment | Tag release |

### Environment Variables

```bash
# .env.development
VITE_API_URL=https://api.dev.idp.company.com
VITE_ENVIRONMENT=development

# .env.staging
VITE_API_URL=https://api.staging.idp.company.com
VITE_ENVIRONMENT=staging

# .env.production
VITE_API_URL=https://api.idp.company.com
VITE_ENVIRONMENT=production
```

### Environment-Specific Builds

```bash
# Build for specific environment
npm run build -- --mode staging
npm run build -- --mode production
```

## Deployment Strategies

### Static Hosting (Recommended)

The IDP is a static SPA and can be deployed to any static hosting service:

#### AWS S3 + CloudFront

```yaml
# Infrastructure as Code (Terraform example)
resource "aws_s3_bucket" "idp" {
  bucket = "idp-frontend-${var.environment}"
}

resource "aws_cloudfront_distribution" "idp" {
  origin {
    domain_name = aws_s3_bucket.idp.bucket_regional_domain_name
    origin_id   = "S3-${aws_s3_bucket.idp.id}"
    
    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.idp.cloudfront_access_identity_path
    }
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${aws_s3_bucket.idp.id}"
    
    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
    
    viewer_protocol_policy = "redirect-to-https"
  }

  # SPA routing - serve index.html for all paths
  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }
}
```

#### Vercel

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

#### Netlify

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Container Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```nginx
# nginx.conf
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location /assets {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";
}
```

## Release Process

### Semantic Versioning

Follow [Semantic Versioning](https://semver.org/):

```
MAJOR.MINOR.PATCH

MAJOR: Breaking changes
MINOR: New features (backwards compatible)
PATCH: Bug fixes (backwards compatible)
```

### Release Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                      Release Process                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   1. Feature       2. Create RC      3. QA Testing              │
│   branches merge   branch from       on staging                  │
│   to develop       develop                                       │
│   ───────────────► ───────────────► ───────────────►            │
│                                                                  │
│   6. Deploy to     5. Create         4. Fix issues              │
│   production       release tag       if needed                   │
│   ◄─────────────── ◄─────────────── ◄───────────────            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Release Checklist

- [ ] All tests passing
- [ ] QA sign-off on staging
- [ ] CHANGELOG.md updated
- [ ] Version bumped in package.json
- [ ] Release notes prepared
- [ ] Stakeholders notified
- [ ] Rollback plan documented

### Creating a Release

```bash
# 1. Update version
npm version minor  # or major/patch

# 2. Push with tags
git push origin main --tags

# 3. Create GitHub release
gh release create v1.2.0 --generate-notes
```

## Configuration Management

### Feature Flags

```typescript
// src/lib/feature-flags.ts
export const features = {
  NEW_DASHBOARD: import.meta.env.VITE_FEATURE_NEW_DASHBOARD === 'true',
  BETA_ANALYTICS: import.meta.env.VITE_FEATURE_BETA_ANALYTICS === 'true',
};

// Usage in components
if (features.NEW_DASHBOARD) {
  return <NewDashboard />;
}
```

### Runtime Configuration

```typescript
// src/lib/config.ts
export const config = {
  apiUrl: import.meta.env.VITE_API_URL,
  environment: import.meta.env.VITE_ENVIRONMENT,
  sentryDsn: import.meta.env.VITE_SENTRY_DSN,
  analyticsId: import.meta.env.VITE_ANALYTICS_ID,
};
```

## Monitoring and Rollback

### Health Checks

```typescript
// Health check endpoint (if using SSR/backend)
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    version: process.env.APP_VERSION,
    timestamp: new Date().toISOString(),
  });
});
```

### Monitoring Setup

| Tool | Purpose |
|------|---------|
| **Sentry** | Error tracking |
| **DataDog** | APM and logging |
| **Google Analytics** | Usage analytics |
| **Lighthouse CI** | Performance monitoring |

### Rollback Procedure

#### Immediate Rollback (CDN)

```bash
# Point CloudFront to previous version
aws cloudfront create-invalidation \
  --distribution-id DIST_ID \
  --paths "/*"

# Or revert to previous S3 version
aws s3 sync s3://idp-backup/v1.1.0/ s3://idp-production/
```

#### Container Rollback

```bash
# Kubernetes rollback
kubectl rollout undo deployment/idp-frontend

# Or deploy specific version
kubectl set image deployment/idp-frontend \
  idp-frontend=idp-frontend:v1.1.0
```

## Troubleshooting

### Common Deployment Issues

#### Blank Page After Deploy

**Symptoms:** App loads but shows blank page

**Solutions:**
1. Check browser console for errors
2. Verify base URL configuration
3. Check SPA routing configuration
4. Clear CDN cache

#### Assets Not Loading

**Symptoms:** 404 errors for JS/CSS files

**Solutions:**
1. Verify `base` in vite.config.ts
2. Check asset paths in index.html
3. Verify S3/CDN permissions
4. Check CORS configuration

#### Environment Variables Missing

**Symptoms:** `undefined` values in app

**Solutions:**
1. Ensure `.env` files are in place
2. Verify `VITE_` prefix on variables
3. Rebuild after changing env vars
4. Check CI/CD environment configuration

### Deployment Logs

```bash
# View deployment logs (AWS)
aws logs get-log-events \
  --log-group-name /aws/codebuild/idp-deploy \
  --log-stream-name latest

# View CloudFront logs
aws s3 ls s3://idp-cf-logs/

# Kubernetes logs
kubectl logs -f deployment/idp-frontend
```

---

For development setup, see [Development](DEVELOPMENT.md).
For testing procedures, see [Testing](TESTING.md).
