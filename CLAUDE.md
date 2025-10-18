# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Angular 20 frontend application built with standalone components, using Angular Material for UI components and ngx-translate for internationalization (i18n). The application uses SCSS for styling and follows a core/shared architecture pattern.

## Development Commands

```bash
npm start              # Start development server on http://localhost:4200
ng serve              # Alternative to npm start
npm run build         # Build for production (outputs to dist/)
npm run watch         # Build in watch mode for development
npm test              # Run unit tests with Karma
ng generate component <name>  # Generate new component
ng generate service <name>     # Generate new service
```

## Architecture

### Folder Structure

- `src/app/core/` - Core application services and interceptors (singleton services)
  - `services/` - Core services like ApiService and AuthService
  - `interceptors/` - HTTP interceptors (currently empty)

- `src/app/shared/` - Shared components, directives, and pipes
  - `components/` - Reusable UI components (header, login-modal, logout-confirmation)

- `src/environments/` - Environment configuration files
  - Default API URL: `http://localhost:3000/api`

- `src/assets/i18n/` - Translation files (en.json, es.json)

### Key Services

**ApiService** (`src/app/core/services/api.service.ts`)
- Centralized HTTP client wrapper for all API calls
- Provides methods: get, post, put, patch, delete
- Automatically prefixes requests with environment.apiUrl

**AuthService** (`src/app/core/services/auth.service.ts`)
- Manages user authentication state using BehaviorSubject
- Stores user data in localStorage for persistence
- Provides login/logout functionality and user session management
- Observable `currentUser$` for reactive authentication state
- Login endpoint: `POST /users/login` with credentials: `{ emailOrAlias, password }`

### Application Configuration

The application uses standalone component architecture (no NgModules). Configuration is centralized in `app.config.ts`:
- HttpClient provider for API calls
- Router configuration
- Angular Material animations
- ngx-translate for i18n (default language: 'en')
- Translation files located in `./assets/i18n/*.json`

### Component Architecture

- All components use standalone: true
- Component selector prefix: `app-`
- Styling: SCSS (configured in angular.json)
- Main component: `App` in `app.ts` (root component)
- Header component includes login/logout functionality

### TypeScript Configuration

- Strict mode enabled
- Target: ES2022
- Experimental decorators enabled
- Strict template type checking enabled

## Code Style Requirements

**IMPORTANT**: All code blocks that are edited must be wrapped with MARSISCA comments:
- Before each edit: `// [branch] - MARSISCA - BEGIN [date]`
- After each edit: `// [branch] - MARSISCA - END [date]`
- Replace `[branch]` with current git branch name
- Replace `[date]` with current date

**Naming Conventions**:
- All names must be in English (folders, files, variables, entities, fields, comments)
- Use kebab-case for file names
- Use PascalCase for classes and interfaces
- Use camelCase for variables and functions

**File Restrictions**:
- Do not add comments to package.json

## Testing

- Test framework: Jasmine with Karma
- Test files use `.spec.ts` extension
- Run tests: `npm test`
- Tests are configured in `tsconfig.spec.json`

## Build Configuration

- Production build optimizations enabled
- Bundle size limits:
  - Initial: 500kB warning, 1MB error
  - Component styles: 4kB warning, 8kB error
- Output hashing enabled for production
- Source maps enabled in development mode
