# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a full-stack TypeScript application using npm workspaces:

- `frontend/` - React + Vite + TypeScript frontend application
- `backend/` - Express + TypeScript backend API server

## Development Commands

### Start Development Environment
```bash
npm run dev
```
This starts both frontend (port 3000) and backend (port 3001) concurrently.

### Individual Services
```bash
npm run dev:frontend  # Start only frontend (port 3000)
npm run dev:backend   # Start only backend (port 3001)
```

### Building
```bash
npm run build         # Build both frontend and backend
```

### Testing and Linting
```bash
npm run test         # Run tests in all workspaces
npm run lint         # Run ESLint in all workspaces
npm run typecheck    # Run TypeScript type checking in all workspaces
```

## Architecture

### Frontend (React + Vite)
- Uses Vite for fast development and building
- TypeScript with strict configuration
- Proxy configuration routes `/api/*` requests to backend
- ESLint configured for React and TypeScript

### Backend (Express + TypeScript)
- Express.js API server
- CORS enabled for frontend communication
- Uses `tsx` for development with watch mode
- Compiles to `dist/` directory for production

### API Communication
- Frontend makes requests to `/api/*` endpoints
- Vite proxy forwards these to `http://localhost:3001`
- Backend serves API routes under `/api` prefix

## Testing Setup

### Backend Tests (Jest)
- **Location**: `backend/src/__tests__/`
- **Framework**: Jest with ts-jest
- **Tests**: Unit tests for API endpoints + integration tests
- **Coverage**: Health/hello endpoints, CORS, JSON middleware, error handling
- **Run**: `npm run test --workspace=backend`

### Frontend Tests (Vitest)
- **Location**: `frontend/src/__tests__/`
- **Framework**: Vitest + React Testing Library
- **Tests**: Component rendering, API integration, user interactions
- **Mocking**: fetch API mocked with vi.mocked()
- **Run**: `npm run test --workspace=frontend`

### Test Status
- All 17 tests passing (8 backend + 9 frontend)
- TypeScript compilation verified for both workspaces
- ESLint configured (simplified config to avoid dependency conflicts)

## Features Implemented

### Request Logging
- **Location**: `backend/src/app.ts` - `requestLogger` middleware
- **Logs**: Timestamp, method, URL, User-Agent, response status, response size
- **Format**: `[timestamp] METHOD /path - User-Agent` + `[timestamp] METHOD /path - status - size`

### Git Configuration
- **`.gitignore`**: Properly excludes `node_modules/`, `dist/`, env files, IDE files
- **Commit strategy**: Commit `package.json` + `package-lock.json`, exclude `node_modules/`
- **Installation**: Others run `npm install` to recreate dependencies

## MCP Integration (Puppeteer)

### Setup Completed
- **Primary server**: `puppeteer` (official MCP server)
- **Backup server**: `puppeteer-modern` (community alternative)
- **Status**: Configured, requires Claude Code restart to activate

### Capabilities After Restart
- Screenshot capture of running app (http://localhost:3000)
- UI/UX analysis and iterative improvements
- Element interaction and testing
- Visual verification of code changes

### Workflow
1. Ensure `npm run dev` is running (frontend on :3000, backend on :3001)
2. Take screenshots to analyze current UI
3. Make code improvements based on visual feedback
4. Take verification screenshots
5. Iterate until UI meets requirements

## Key Files
- `package.json` - Root workspace configuration
- `frontend/vite.config.ts` - Frontend build and proxy configuration
- `backend/src/index.ts` - Backend server entry point
- `backend/src/app.ts` - Express app with logging middleware
- `frontend/src/App.tsx` - Frontend application entry point
- `.gitignore` - Excludes node_modules and build artifacts