# TripCoaster - Plan de Migración Arquitectónica

**Created:** 2026-02-07
**Status:** In Progress
**Repos:** TripCoasterFront (Angular) + TripCoasterBack (Express + TypeScript)
**Contract:** OpenAPI 3.0.3 (`src/api/openapi-bundled.yaml`)

---

## Context

The project migrated from a manual `ApiService` wrapper to an OpenAPI-generated client (`ng-openapi-gen`). All services now use the generated functions, but there are type mismatches, duplicated models, no auth interceptor, and inconsistencies in the OpenAPI spec that need to be resolved.

---

## Phase 0: OpenAPI Spec Fixes (Backend repo)

> **Goal:** Make the spec the single source of truth with consistent, strict types.

### Task 0.1: Add `required` to all response schemas
- [ ] All response wrappers (`*Response`, `*ListResponse`) must declare `required: [success, message, data]`
- [ ] This eliminates `as unknown as` casts in the frontend services
- [ ] Affected schemas: `DiariesListResponse`, `DiaryResponse`, `TripResponse`, `LocationResponse`, `CountriesListResponse`, `SportsListResponse`, `WeatherTypesListResponse`, `AccommodationTypesListResponse`, `TransportationTypesListResponse`, `PoisListResponse`, `SportEventsListResponse`, `UsersListResponse`, `PhotosListResponse`, `PhotoUploadResponse`, `ValidatePhotosResponse`

### Task 0.2: Replace inline schemas with named `$ref`
- [ ] `GET /trips/{id}/locations` uses inline `{ success?, data? }` without `message` - replace with `$ref: TripLocationsResponse`
- [ ] Audit all paths for other inline response schemas
- [ ] Every 200/201 response must reference a named schema

### Task 0.3: Add `securitySchemes` to the spec
- [ ] Add `bearerAuth` under `components/securitySchemes`
- [ ] Set global `security: [{ bearerAuth: [] }]`
- [ ] Override with `security: []` on public endpoints (`/users/login`, `POST /users`)

```yaml
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
security:
  - bearerAuth: []
```

### Task 0.4: Unify date field naming
- [ ] Decide: `day` (date only) vs `dateTime` (with time) - the spec uses `day`, the local model uses `dateTime`
- [ ] If backend DB column is `day`, keep `day` in spec and update frontend local model
- [ ] Document the convention: date-only fields use `date` or `day`, timestamp fields use `*At` suffix

### Task 0.5: Fix `BaseEntity` required fields
- [ ] `id`, `createdAt`, `updatedAt` should be `required` in `BaseEntity` schema (they always come from DB)
- [ ] This makes generated types non-optional, matching reality

### Task 0.6: Regenerate and validate
- [ ] Run `npm run api:bundle` to regenerate bundled spec
- [ ] Run `npm run api:generate` in frontend to regenerate client
- [ ] Verify no `as unknown as` casts are needed

**Completion criteria:** `ng build` passes with zero `as unknown as` casts in services.

---

## Phase 1: Auth Interceptor (Frontend repo)

> **Goal:** Centralize authentication token injection. Remove manual token handling.

### Task 1.1: Create HTTP auth interceptor
- [ ] Create `src/app/core/interceptors/auth.interceptor.ts`
- [ ] Read token from `localStorage('currentUser').token`
- [ ] Clone request with `Authorization: Bearer {token}` header
- [ ] Handle 401 responses (logout user, redirect to login)

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const userStr = localStorage.getItem('currentUser');
  if (userStr) {
    try {
      const token = JSON.parse(userStr).token;
      if (token) {
        req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
      }
    } catch (e) { /* ignore parse errors */ }
  }
  return next(req);
};
```

### Task 1.2: Register interceptor in `app.config.ts`
- [ ] Change `provideHttpClient()` to `provideHttpClient(withInterceptors([authInterceptor]))`
- [ ] Import `withInterceptors` from `@angular/common/http`

### Task 1.3: Remove manual token handling from `PhotoUploadService`
- [ ] Remove `getAuthToken()` private method
- [ ] Remove manual `xhr.setRequestHeader('Authorization', ...)` calls
- [ ] The interceptor won't cover raw XHR - evaluate if XHR upload methods should migrate to `HttpClient` with `reportProgress: true` and `observe: 'events'`

### Task 1.4: Migrate `AuthService` to use `ApiConfiguration`
- [ ] Replace `environment.apiUrl` with `ApiConfiguration.rootUrl`
- [ ] Optionally use the generated `loginUser` function from `api/fn/users/login-user`

**Completion criteria:** No service manually handles auth tokens. Interceptor covers all `HttpClient` requests.

---

## Phase 2: Eliminate Duplicate Models (Frontend repo)

> **Goal:** Use OpenAPI-generated models as the single source of truth. Keep `core/models/` only for frontend-exclusive types.

### Task 2.1: Audit model overlap

Current state:

| Local model (`core/models/`) | Generated model (`api/models/`) | Action |
|---|---|---|
| `trip.model.ts` (Trip, TripPhoto, etc.) | `trip.ts`, `photo.ts`, `trip-response.ts` | Replace with generated |
| `diary.model.ts` (Diary, DiariesResponse) | `diary.ts`, `diaries-list-response.ts` | Replace with generated |
| `location.model.ts` (Location, etc.) | `location.ts`, `location-response.ts` | Replace with generated |
| `country.model.ts` (Country) | `country.ts`, `countries-list-response.ts` | Replace with generated |
| `weather.model.ts` (Weather) | `weather-type.ts` | Replace with generated |
| `sport.model.ts` (Sport) | `sport.ts` | Replace with generated |
| `accommodation.model.ts` | `accommodation-type.ts` | Replace with generated |
| `transportation-type.model.ts` | `transportation-type.ts` | Replace with generated |
| `diary-type.model.ts` | `diary-type.ts` | Replace with generated |
| `poi.model.ts` | `poi.ts`, `poi-type.ts` | Replace with generated |
| `photo.model.ts` (PhotoWithPreview, ExifData) | No equivalent | **Keep** (frontend-only) |
| `validation-result.model.ts` | `validate-photos-response.ts` (partial) | Evaluate |
| `manual-location.model.ts` | No equivalent | **Keep** (frontend-only) |
| `diary-weather.model.ts` | No equivalent | Evaluate |

### Task 2.2: Replace imports in services
- [ ] For each service, change `import { X } from '../models/x.model'` to `import { X } from '../../api/models/x'`
- [ ] Remove the `as any` casts on request bodies (types should now match)
- [ ] Remove `as unknown as` casts on response bodies (after Phase 0)

### Task 2.3: Replace imports in components
- [ ] Search all components that import from `core/models/`
- [ ] Update to use `api/models/` equivalents
- [ ] Handle any property name differences (e.g., `dateTime` -> `day`)

### Task 2.4: Delete redundant model files
- [ ] Delete `core/models/` files that are fully replaced by generated models
- [ ] Keep only frontend-exclusive types: `photo.model.ts` (ExifData, PhotoWithPreview), `manual-location.model.ts`
- [ ] Move remaining frontend-only models to `core/models/frontend/` or rename for clarity

### Task 2.5: Update `core/models/` barrel exports (if any)
- [ ] Check if there's an `index.ts` barrel file in `core/models/`
- [ ] Update or remove

**Completion criteria:** `core/models/` contains only types that don't exist in the OpenAPI spec. All API entity types come from `api/models/`.

---

## Phase 3: Service Layer Cleanup (Frontend repo)

> **Goal:** Evaluate whether wrapper services add value or are just boilerplate.

### Task 3.1: Classify services by value-add

| Service | Has business logic? | Recommendation |
|---|---|---|
| `trip.service.ts` | Yes (getTripDurationInDays, isUpcomingTrip, formatTripDateRange) | **Keep** - wraps API + adds logic |
| `photo-upload.service.ts` | Yes (XHR progress, error parsing) | **Keep** - custom upload behavior |
| `location.service.ts` | Partially (createLocation transforms data) | **Keep** - data transformation |
| `country.service.ts` | No - pure pass-through | **Evaluate** - could be eliminated |
| `diary.service.ts` | No - pure pass-through | **Evaluate** - could be eliminated |
| `diary-type.service.ts` | No - pure pass-through | **Evaluate** - could be eliminated |
| `weather.service.ts` | Minimal (uploadIcon) | **Evaluate** |
| `sport.service.ts` | No - pure pass-through | **Evaluate** |
| `accommodation.service.ts` | No - pure pass-through | **Evaluate** |
| `transportation-type.service.ts` | No - pure pass-through | **Evaluate** |
| `poi.service.ts` | No - pure pass-through | **Evaluate** |
| `auth.service.ts` | Yes (state management, localStorage) | **Keep** |

### Task 3.2: Decision - keep or remove pass-through services
- [ ] Decide: use generated functions directly in components, or keep services as thin wrappers?
- [ ] If keeping wrappers: simplify to remove `map(r => r.body as X)` boilerplate
- [ ] If removing: update all component imports to use generated functions directly

### Task 3.3: Add `api:generate` npm script (if not present)
- [ ] Verify `package.json` has: `"api:generate": "ng-openapi-gen"` and `"api:bundle"` and `"api:build"`

**Completion criteria:** Each service either adds meaningful business logic or is removed in favor of direct function calls.

---

## Phase 4: Developer & AI Workflow (Both repos)

> **Goal:** Establish conventions so Claude Code (and human devs) can work across repos without introducing drift.

### Task 4.1: Update `CLAUDE.md` in backend repo
- [ ] Add OpenAPI-first workflow rules
- [ ] Document that spec changes must come before implementation
- [ ] Add naming conventions for new endpoints

### Task 4.2: Update `CLAUDE.md` in frontend repo
- [ ] Add rule: never create manual models for API entities
- [ ] Add rule: never use `as unknown as` - fix the spec instead
- [ ] Add rule: run `npm run api:generate` after spec changes
- [ ] Document which models belong in `core/models/` (frontend-only types)

### Task 4.3: Create cross-repo conventions doc
- [ ] Create `docs/api-conventions.md` in both repos with:
  - Response envelope format: `{ success, message, data }`
  - Error format: `{ success: false, message, error: { code, details } }`
  - Date field naming: `day` (date), `*At` (timestamp)
  - Auth: Bearer token in header
  - Naming: camelCase fields, PascalCase schemas, kebab-case paths

### Task 4.4: Add spec validation to CI (optional)
- [ ] Add `npm run api:validate` script using `@redocly/cli lint`
- [ ] Consider adding to pre-commit hook

**Completion criteria:** Both repos have clear instructions for AI and human developers to follow.

---

## Execution Order

```
Phase 0 (Backend) ──> Phase 1 (Frontend) ──> Phase 2 (Frontend) ──> Phase 3 (Frontend)
                                                                          │
Phase 4 (Both) ─── can run in parallel with any phase ────────────────────┘
```

- **Phase 0 must be first** - fixing the spec unblocks Phases 2 and 3
- **Phase 1 is independent** - can run before or after Phase 0
- **Phase 2 depends on Phase 0** - need correct generated types before replacing local models
- **Phase 3 depends on Phase 2** - need to know which types are used before removing services
- **Phase 4 can run anytime** - documentation tasks

---

## Progress Log

| Date | Phase | Task | Status | Notes |
|------|-------|------|--------|-------|
| 2026-02-07 | Pre | Migrate all services from ApiService to generated functions | Done | All services migrated |
| 2026-02-07 | Pre | Delete unused `ApiService` | Done | No references remain |
| 2026-02-07 | Pre | Fix `as unknown as` in diary.service.ts and location.service.ts | Done | Temporary fix, Phase 0 will remove need |
| | | | | |
