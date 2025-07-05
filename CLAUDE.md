# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Overview

This is a full-stack project with three main components:

1. **Frontend** (`frontend/`): React + TypeScript + Vite application with Tailwind CSS and Radix UI components
2. **Backend** (`backend/`): Express.js API server with TypeScript, Prisma ORM, and SQLite database
3. **Shared** (`shared/`): Common TypeScript types, utilities, and validation schemas using Zod
4. **Firmware** (`firmware/`): Optional Arduino/ESP32 projects for IoT development using PlatformIO

## Development Commands

### Workspace Management
```bash
# Install dependencies for all packages
pnpm install

# Build all packages
pnpm -r build
```

### Frontend Development
```bash
cd frontend
pnpm dev          # Start development server on port 5173
pnpm build        # Build for production (includes TypeScript compilation)
pnpm lint         # Run ESLint
pnpm preview      # Preview production build
```

### Backend Development
```bash
cd backend
pnpm dev          # Start development server with nodemon
pnpm build        # Compile TypeScript to dist/
pnpm start        # Run production build
pnpm setup        # Generate Prisma client and push schema to database
```

### Database Management (Backend)
```bash
cd backend
pnpm db:generate  # Generate Prisma client
pnpm db:push      # Push schema changes to database
pnpm db:migrate   # Create and run migrations
pnpm db:studio    # Open Prisma Studio
pnpm db:reset     # Reset database
pnpm db:seed      # Seed database
```

### Shared Package
```bash
cd shared
pnpm build        # Compile TypeScript types and utilities
pnpm dev          # Watch mode for development
pnpm clean        # Remove dist/ directory
```

### Firmware Development (Optional)
```bash
# Build firmware projects using PlatformIO
pio run -d firmware/NurFirmwareR0/
pio run -d firmware/IRRemoteTest/IRrecvDemo/
# Upload to device
pio run -t upload -d firmware/NurFirmwareR0/
```

## Key Technologies

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Radix UI, Lucide icons
- **Backend**: Express.js, TypeScript, Prisma ORM, SQLite, JWT auth, bcrypt, Socket.IO, WebSockets
- **Shared**: TypeScript, Zod validation
- **Firmware**: Arduino framework, ESP32/ESP8266, PlatformIO, IR remote libraries, sensors (AHT10)

## Database Schema

The backend uses Prisma with SQLite and includes:
- **User model**: Authentication with email/password, roles (ADMIN/USER)
- **Post model**: Basic content management with user relationships

## Project Structure Notes

- Uses pnpm workspace with packages: frontend, backend, shared
- Firmware directory is excluded from Node.js workspace
- Frontend uses path aliases (`@/components`)
- Backend includes basic health check and CORS configuration
- Shared package exports types, utilities, and Zod schemas
- Firmware includes IoT examples for AC control, IR remote handling, and sensor monitoring

## Development Setup

1. Install dependencies: `pnpm install`
2. Set up backend database: `cd backend && pnpm setup`
3. Start development servers:
   - Frontend: `cd frontend && pnpm dev`
   - Backend: `cd backend && pnpm dev`

The frontend development server runs on port 5173, backend on port 3001.