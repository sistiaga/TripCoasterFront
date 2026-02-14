# Landing Page Migration Plan: v0 (Next.js) → TripCoasterFront (Angular)

## 1. Overview

**Objective**: Migrate the landing page from the Next.js v0 project into the Angular 20 app, adapting Tailwind CSS styles to the existing SCSS architecture with Angular Material.

**Source**: `C:\Users\Factory\Documents\TripCoaster v0` (Next.js + Tailwind + Radix UI)
**Target**: `C:\Users\Factory\Documents\TripCoaster\TripCoasterFront` (Angular 20 + SCSS + Angular Material)

**Current state of the Angular app**: No public landing page exists. The default route (`/`) redirects to `/general` (authenticated area).

---

## 2. Sections to Migrate

From the v0 landing page, these are the sections (in order):

| # | Section | v0 Component | Priority | Notes |
|---|---------|-------------|----------|-------|
| 1 | Navbar (landing) | `navbar.tsx` | High | New navbar for public pages (different from app header) |
| 2 | Hero | `hero.tsx` | High | Background image + CTA + stats |
| 3 | Features | `features.tsx` | High | 6 feature cards in grid |
| 4 | World Map | `world-map.tsx` | Low | Uses react-simple-maps (needs alternative library) |
| 5 | Gallery | `gallery.tsx` | Medium | Masonry grid with 4 travel photos |
| 6 | How It Works | `how-it-works.tsx` | High | 4-step process |
| 7 | Testimonials | `testimonials.tsx` | Medium | 3 testimonial cards |
| 8 | CTA | `cta.tsx` | High | Call-to-action before footer |
| 9 | Footer | `footer.tsx` | **Required** | Must match v0 exactly. Global for the entire app |
| 10 | Legal Notice | `aviso-legal/page.tsx` | **Required** | Must match v0 exactly. Separate route |

---

## 3. Architecture Decisions

### 3.1 Routing Changes

**Current routing:**
```
/ → redirect to /general
/general, /calendar, /trip/:id, /maps, /settings
```

**Proposed routing:**
```
/                → LandingPageComponent (public)
/legal-notice    → LegalNoticeComponent (public)
/general         → GeneralComponent (authenticated)
/calendar        → CalendarComponent (authenticated)
/trip/:id        → TripDetailComponent (authenticated)
/maps            → MapsComponent (authenticated)
/settings        → SettingsComponent (authenticated)
```

### 3.2 Layout Strategy

Create two layouts:

1. **PublicLayout**: Landing navbar + `<router-outlet>` + Footer
   - Used for `/` and `/legal-notice`
   - Navbar: logo + nav links + login/register buttons
   - Footer: v0 footer (global)

2. **AppLayout**: Existing header + `<router-outlet>` + Footer
   - Used for all authenticated routes (`/general`, `/calendar`, etc.)
   - Existing header component (orange bar)
   - Same footer as public layout

### 3.3 Component Organization

```
src/app/
├── layouts/
│   ├── public-layout/          # Navbar + router-outlet + footer
│   └── app-layout/             # Existing header + router-outlet + footer
├── pages/
│   ├── landing/                # Landing page (new)
│   │   ├── landing.component.ts
│   │   ├── landing.component.html
│   │   └── landing.component.scss
│   ├── legal-notice/           # Legal notice page (new)
│   │   ├── legal-notice.component.ts
│   │   ├── legal-notice.component.html
│   │   └── legal-notice.component.scss
│   └── ... (existing pages)
├── shared/components/
│   ├── footer/                 # Footer component (new, global)
│   ├── landing-navbar/         # Public navbar (new)
│   └── ... (existing components)
```

### 3.4 Styling Approach

- **NO Tailwind**. All v0 Tailwind utility classes will be translated to SCSS using the existing architecture.
- Use `vars.$primary-color`, `vars.$secondary-color`, etc. from `_variables.scss`.
- Use `mixins.respond-to()`, `mixins.flex-center`, `mixins.hover-lift`, etc.
- Add any new variables needed (e.g., landing-specific spacing, hero overlay) to `_variables.scss`.
- Component-specific styles go in each component's `.scss` file.
- Global landing styles (if any) go in a new `src/styles/components/_landing.scss`.

### 3.5 Icon Strategy

v0 uses Lucide React icons. Options for Angular:

- **Angular Material Icons** (recommended): Already in the project. Map Lucide icons to Material equivalents.
- Fallback: Use SVG icons directly where Material doesn't have an equivalent.

### 3.6 Image Assets

Images needed (must be sourced/provided):
- `hero-travel.jpg` — Hero background
- `travel-1.jpg` through `travel-4.jpg` — Gallery photos
- Logo SVG — Adapt from v0's `logo.tsx` or use existing

**Location**: `public/assets/images/landing/`

### 3.7 Internationalization

All landing text must be added to the i18n files:
- `public/assets/i18n/en.json` — English translations
- `public/assets/i18n/es.json` — Spanish translations (source text from v0 is in Spanish)

Use `translate` pipe in templates: `{{ 'LANDING.HERO.TITLE' | translate }}`

---

## 4. Implementation Steps

### Phase 1: Infrastructure (Estimated: 3 tasks)

**1.1 Create layouts**
- Create `PublicLayoutComponent` (navbar + router-outlet + footer)
- Create `AppLayoutComponent` (header + router-outlet + footer)
- Both are standalone components

**1.2 Create footer component**
- `src/app/shared/components/footer/`
- Migrate content from v0 `footer.tsx`
- 4-column grid: Brand, Product, Company, Legal
- Bottom bar: copyright + social links
- Responsive: 4 cols desktop → 2 cols tablet → 1 col mobile
- Use `routerLink` for `/legal-notice`
- Add i18n keys

**1.3 Update routing**
- Modify `app.routes.ts` to use child routes with layouts
- Public routes under `PublicLayoutComponent`
- Authenticated routes under `AppLayoutComponent`
- Remove the existing `/ → /general` redirect
- Add redirect logic: if user is logged in and hits `/`, redirect to `/general`

### Phase 2: Landing Page Sections (Estimated: 7 tasks)

**2.1 Landing navbar**
- `src/app/shared/components/landing-navbar/`
- Fixed/sticky navbar with transparency + backdrop blur
- Logo + nav links (Features, Testimonials anchors)
- Login + Register buttons (open existing login modal / navigate to register)
- Mobile hamburger menu
- Scroll-aware: change background opacity on scroll

**2.2 Hero section**
- Background image with dark overlay
- Badge: "Your personal map of memories"
- Main heading: "Every journey tells a story" (serif font)
- Subtitle paragraph
- 2 CTA buttons: "Start your diary" (primary), "See how it works" (outline)
- Stats row: 3 columns (50K+ travelers, 195 countries, 1M+ memories)

**2.3 Features section**
- Section heading + subtitle
- 6 feature cards in responsive grid (1/2/3 columns)
- Each card: Material icon, title, description
- Hover effect: border color change + shadow lift

**2.4 Gallery section**
- Heading: "Memories worth keeping"
- Masonry-style grid with 4 photos
- Hover effects: zoom + overlay + location label
- Responsive: 1 col mobile → 3 col desktop with span variations

**2.5 How It Works section**
- Heading: "Start documenting in 4 steps"
- 4 step cards with icons, step numbers, titles, descriptions
- Horizontal connector lines on desktop
- Responsive: horizontal desktop → vertical mobile

**2.6 Testimonials section**
- Heading: "What our travelers say"
- 3 testimonial cards in grid
- Each: 5-star rating, quote, avatar with initials, name, role

**2.7 CTA section**
- Full-width orange background
- Compass icon
- Heading + subtitle
- CTA button (secondary/white)
- "No credit card" disclaimer text

### Phase 3: Legal Notice Page (Estimated: 1 task)

**3.1 Legal Notice page**
- `src/app/pages/legal-notice/`
- Header with logo + "Back to home" link
- 3 numbered sections:
  1. Identifying Data (owner, website, contact)
  2. Intellectual Property & Content Use
  3. Liability Disclaimer
- Back navigation link at bottom
- Mini footer with copyright
- Same styling approach: SCSS variables, serif headings, card containers

### Phase 4: Integration & Polish (Estimated: 3 tasks)

**4.1 Header/footer integration with authenticated pages**
- Add footer to the existing app layout (currently only has header)
- Ensure footer appears on all pages (public and authenticated)
- Adjust spacing/padding so content doesn't overlap with footer

**4.2 Auth-aware navigation**
- Landing navbar: show "Login" / "Start free" for unauthenticated users
- Landing navbar: show "Go to my trips" for authenticated users
- Redirect from `/` to `/general` if already logged in (optional, could keep landing visible)

**4.3 Responsive testing & style refinement**
- Test all breakpoints (mobile, tablet, desktop)
- Ensure Material components and landing styles coexist correctly
- Verify dark/light theme consistency (if dark mode is planned)
- Check scroll behavior for anchor links (#features, #testimonials)

---

## 5. World Map Section (Deferred)

The v0 world map uses `react-simple-maps`, which is React-only. Options:

- **Option A**: Use the existing `world-map` shared component already in the app (Leaflet-based)
- **Option B**: Use a vanilla JS library like `jvectormap` or `d3-geo`
- **Option C**: Skip for now, implement later

**Recommendation**: Defer to a separate task. The existing app already has a map component (`shared/components/world-map/`) that could potentially be adapted for the landing page showcase.

---

## 6. Files to Create/Modify

### New Files
| File | Purpose |
|------|---------|
| `src/app/layouts/public-layout/public-layout.component.ts/html/scss` | Public page layout |
| `src/app/layouts/app-layout/app-layout.component.ts/html/scss` | Authenticated page layout |
| `src/app/shared/components/footer/footer.component.ts/html/scss` | Global footer |
| `src/app/shared/components/landing-navbar/landing-navbar.component.ts/html/scss` | Landing page navbar |
| `src/app/pages/landing/landing.component.ts/html/scss` | Landing page |
| `src/app/pages/legal-notice/legal-notice.component.ts/html/scss` | Legal notice page |
| `public/assets/images/landing/*` | Landing page images |

### Modified Files
| File | Change |
|------|--------|
| `src/app/app.routes.ts` | Add layouts, landing route, legal-notice route |
| `src/app/app.html` | May need adjustment for layout-based routing |
| `public/assets/i18n/en.json` | Add landing page translations |
| `public/assets/i18n/es.json` | Add landing page translations |
| `src/styles/themes/_variables.scss` | Add landing-specific variables if needed |
| `src/styles.scss` | Import new global landing styles if needed |

---

## 7. Key Mapping: Tailwind → SCSS

| v0 (Tailwind) | Angular App (SCSS) |
|---------------|-------------------|
| `bg-primary` | `background-color: vars.$primary-color` |
| `text-primary` | `color: vars.$primary-color` |
| `bg-foreground` | `background-color: vars.$secondary-color` |
| `bg-card` | `background-color: vars.$accent-light` |
| `bg-accent` | `background-color: vars.$accent-dark` |
| `rounded-lg` | `border-radius: vars.$radius-lg` |
| `shadow-md` | `box-shadow: vars.$shadow-md` |
| `p-4` / `p-6` / `p-8` | `padding: vars.$spacing-md/lg/xl` |
| `gap-4` / `gap-6` | `gap: vars.$spacing-md/lg` |
| `font-serif` | `font-family: vars.$font-heading` |
| `md:grid-cols-2` | `@include mixins.respond-to(tablet) { grid-template-columns: repeat(2, 1fr) }` |
| `lg:grid-cols-3` | `@include mixins.respond-to(desktop) { grid-template-columns: repeat(3, 1fr) }` |
| `hover:shadow-lg` | `@include mixins.hover-lift` or custom `&:hover` |
| `backdrop-blur-md` | `backdrop-filter: blur(12px)` |

---

## 8. Content to Replicate Exactly (from v0)

### Footer Content
- Brand: Logo + "TripCoaster" + tagline
- Product links: Features, Pricing, Mobile App, Integrations
- Company links: About Us, Blog, Press, Contact
- Legal links: Legal Notice (`/legal-notice`), Privacy, Cookies
- Copyright: "© 2026 TripCoaster.com - All rights reserved..."
- Social: Instagram, Twitter, YouTube

### Legal Notice Content
- Section 1: Identifying Data (Owner: Carlos Martinez, Website: TripCoaster.com)
- Section 2: Intellectual Property & Content Use (attribution rules, commercial reproduction restrictions)
- Section 3: Liability Disclaimer

---

## 9. Execution Order Summary

```
Phase 1: Infrastructure
  1.1 Create layouts (public + app)
  1.2 Create footer component
  1.3 Update routing

Phase 2: Landing Page
  2.1 Landing navbar
  2.2 Hero section
  2.3 Features section
  2.4 Gallery section
  2.5 How It Works section
  2.6 Testimonials section
  2.7 CTA section

Phase 3: Legal Notice
  3.1 Legal Notice page

Phase 4: Integration
  4.1 Footer on all pages
  4.2 Auth-aware navigation
  4.3 Responsive testing
```

Total: ~14 tasks across 4 phases.
