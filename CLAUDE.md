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

## Key Files
- `package.json` - Root workspace configuration
- `frontend/vite.config.ts` - Frontend build and proxy configuration
- `backend/src/index.ts` - Backend server entry point
- `frontend/src/App.tsx` - Frontend application entry point