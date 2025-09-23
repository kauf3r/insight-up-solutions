# Insight Up Solutions

A comprehensive platform for professional insights and analytics built with Next.js 14, TypeScript, and modern web technologies.

## Package Manager

**This project uses npm exclusively.**

### Why npm?
- Better compatibility with workspace configurations
- Simpler dependency resolution for CI/CD
- More stable path handling across different environments

### Installation
```bash
npm install
```

### Development
```bash
# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Lint code
npm run lint
```

## Project Structure

This is a monorepo with the following workspaces:
- `apps/web` - Main Next.js application
- `packages/db` - Database package with Prisma setup

## CI/CD Pipeline

The project is configured for automatic deployment to Vercel with continuous integration testing.
