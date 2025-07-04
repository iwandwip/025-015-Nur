# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack monorepo starter template designed for modern web applications. It combines a React frontend with a Node.js backend, shared TypeScript utilities, and includes optional firmware development capabilities for IoT projects.

## Architecture

### Frontend (Web Application)
- **Framework**: React + TypeScript + Vite
- **UI Library**: Shadcn/ui components with Radix UI primitives
- **Styling**: TailwindCSS v4 with utility classes
- **Build Tool**: Vite with ESLint for code quality
- **Location**: `frontend/` package

### Backend (API Server)
- **Framework**: Node.js + Express + TypeScript
- **Database**: Prisma ORM + SQLite (configurable)
- **Authentication**: JWT with bcrypt password hashing
- **Validation**: Zod schemas for type-safe validation
- **Location**: `backend/` package

### Shared Package
- **Purpose**: Common types, utilities, and validation schemas
- **Types**: Authentication, API responses, user management
- **Utils**: Validation helpers, constants, string utilities
- **Location**: `shared/` package

### Optional: Firmware (IoT Development)
- **Platform**: ESP32/ESP8266 microcontrollers using Arduino framework
- **Build System**: PlatformIO with multiple project configurations
- **Location**: `firmware/` directory (not part of PNPM workspace)

## Common Development Commands

### Monorepo Commands (Root)
```bash
# Install all dependencies
pnpm install

# Start all packages in development
pnpm dev

# Start specific packages
pnpm dev:fe        # Frontend only
pnpm dev:be        # Backend only

# Build all packages
pnpm build

# Build shared package only
pnpm build:shared

# Clean all build outputs
pnpm clean

# Setup project (install + build shared + setup database)
pnpm setup
```

### Frontend Development
```bash
# Navigate to frontend
cd frontend

# Start development server
pnpm dev

# Build for production
pnpm build

# Run linting
pnpm lint

# Preview production build
pnpm preview
```

### Backend Development
```bash
# Navigate to backend
cd backend

# Start development server
pnpm dev

# Database commands
pnpm db:generate    # Generate Prisma client
pnpm db:push       # Push schema to database
pnpm db:migrate    # Create migrations
pnpm db:studio     # Open Prisma Studio GUI
pnpm db:reset      # Reset database
pnpm setup         # Generate client + push schema
```

### Shared Package Development
```bash
# Navigate to shared
cd shared

# Build TypeScript
pnpm build

# Watch mode for development
pnpm dev
```

## Project Structure

### Monorepo Layout
```
/
├── frontend/          # React + Vite application
├── backend/           # Node.js + Express API
├── shared/            # Shared TypeScript utilities
├── firmware/          # Optional: ESP32/Arduino projects
├── package.json       # Root workspace configuration
└── pnpm-workspace.yaml # PNPM workspace definition
```

### Backend Structure
```
backend/
├── src/
│   ├── index.ts       # Express server entry point
│   ├── routes/        # API route handlers
│   ├── controllers/   # Business logic
│   ├── middleware/    # Auth, validation, etc.
│   └── utils/         # Backend utilities
├── prisma/
│   └── schema.prisma  # Database schema
├── .env              # Environment variables
└── tsconfig.json     # TypeScript configuration
```

### Shared Package Structure
```
shared/
├── src/
│   ├── types/         # TypeScript type definitions
│   │   ├── auth.ts    # Authentication types
│   │   └── api.ts     # API response types
│   └── utils/         # Utility functions
│       ├── validation.ts  # Validation helpers
│       └── constants.ts   # App constants
└── dist/             # Built TypeScript output
```

## Development Notes

### Database Schema
- **User Management**: Basic user system with roles (ADMIN, USER)
- **Content Management**: Post system for blog/CMS functionality
- **Extensible**: Easy to add new models for your specific use case

### Authentication System
- JWT-based authentication with refresh tokens
- Bcrypt password hashing
- Role-based access control ready
- Zod validation for all auth endpoints

### Type Safety
- Shared types between frontend and backend
- Zod schemas for runtime validation
- TypeScript strict mode enabled
- Auto-generated Prisma types

### Development Workflow
1. Make changes to shared package types/utils
2. Build shared package: `pnpm build:shared`
3. Backend and frontend automatically get updated types
4. Develop features with full type safety

### Environment Variables
- Development defaults provided in `.env`
- Production values should be set in deployment
- Database URL, JWT secrets, CORS settings configurable

## Extending the Starter

This starter is designed to be:
- **Flexible**: Add new packages to the monorepo as needed
- **Scalable**: Database schema and types are easily extensible
- **Modern**: Uses latest tooling and best practices
- **Type-Safe**: Full TypeScript coverage with runtime validation

Common extensions:
- Add file upload capabilities
- Integrate with external APIs
- Add real-time features with Socket.io
- Implement email functionality
- Add testing frameworks
- Deploy with Docker