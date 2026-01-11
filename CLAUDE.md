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

## Brand & Style Guide

### Brand Identity

- **Application Name**: TripCoaster
- **Logo**: Main logo and application name should display "TripCoaster"

### Color Palette

Use these exact HEX color codes throughout the application:

- **Primary Color** (Orange): `#FF7F00`
- **Secondary Color** (Black): `#2C2C2C`
- **Accent Color 1** (Light Gray): `#F1E9E4`
- **Accent Color 2** (Blue): `#081F5C`

### Typography

- **Primary Font**: Montserrat Italic (for headings and emphasis)
- **Secondary Font**: Montserrat (for body text)
- **Font Source**: Google Fonts (via CDN)
- **Fallback Stack**: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`

### SCSS Architecture (Updated 2026-01-08)

**CRITICAL**: The project uses a modular SCSS architecture. Follow these rules strictly:

#### Styles Folder Structure

```
src/styles/
├── base/           - Typography, layout, resets
├── themes/         - Variables, Material theme, global overrides
├── components/     - Reusable component styles (forms, dialogs, buttons, cards)
├── utilities/      - Mixins, helpers, animations
└── vendor/         - Third-party library fixes
```

#### Rules for Component Styles

1. **NEVER use `::ng-deep`** - All Material overrides go in `src/styles/themes/_material-overrides.scss`
2. **ALWAYS import variables and mixins**:
   ```scss
   @use '../../../../styles/themes/variables' as vars;
   @use '../../../../styles/utilities/mixins' as mixins;
   ```
3. **ALWAYS use SCSS variables** instead of hardcoded values:
   - Colors: `vars.$primary-color`, `vars.$secondary-color`, etc.
   - Spacing: `vars.$spacing-sm`, `vars.$spacing-md`, `vars.$spacing-lg`
   - Border radius: `vars.$radius-sm`, `vars.$radius-md`, `vars.$radius-lg`
   - Shadows: `vars.$shadow-sm`, `vars.$shadow-md`, `vars.$shadow-lg`
4. **Use mixins for common patterns**:
   - `@include mixins.flex-center;`
   - `@include mixins.respond-to(mobile);`
   - `@include mixins.hover-lift;`
5. **Use utility classes in templates** when appropriate:
   - `.full-width`, `.d-flex`, `.align-center`, `.gap-2`, etc.

#### Reference Component

See `src/app/shared/components/trip-form-modal/trip-form-modal.scss` as the reference implementation.

#### Complete Documentation

- Architecture guide: `/docs/Cambio de estilos.md`
- Implementation details: `/docs/implementacion-fase-1.md`
- Quick reference: `/src/styles/README.md`
