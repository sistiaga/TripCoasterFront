📐 Arquitectura de Angular Material para TripCoaster
🔍 1. Análisis de la Situación Actual
Fortalezas detectadas:
✅ Ya tienes un theme Material configurado en styles.scss

✅ Variables de marca bien definidas ($primary-color, $secondary-color, etc.)

✅ El formulario trip-form-modal es un excelente ejemplo de diseño moderno

✅ Tipografía Montserrat configurada correctamente

Problemas críticos detectados:
❌ Uso excesivo de ::ng-deep (trip-form-modal.scss líneas 75-247)

❌ Estilos globales infiltrados en componentes (líneas 89-247 del modal)

❌ Hardcoded colors repetidos (#FF7F00, #2C2C2C, etc.)

❌ Falta de mixins/utilities reutilizables

❌ CSS duplicado entre componentes (.error-message, .full-width, etc.)

❌ Falta de separación entre theme y estilos funcionales

🏗️ 2. Nueva Arquitectura de Carpetas
Propongo esta estructura para /src/styles/:


src/
├── styles/
│   ├── _index.scss                    # Barrel file principal
│   ├── base/
│   │   ├── _reset.scss                # Resets y normalize
│   │   ├── _typography.scss           # Estilos tipográficos base
│   │   └── _layout.scss               # Container, grid, flex utils
│   ├── themes/
│   │   ├── _material-theme.scss       # Theme de Material (colores)
│   │   ├── _material-overrides.scss   # Overrides GLOBALES de Material
│   │   └── _variables.scss            # Variables SCSS reutilizables
│   ├── components/
│   │   ├── _buttons.scss              # Estilos comunes de botones
│   │   ├── _forms.scss                # Estilos comunes de formularios
│   │   ├── _cards.scss                # Cards reutilizables
│   │   └── _dialogs.scss              # Estilos comunes de dialogs
│   └── utilities/
│       ├── _mixins.scss               # Mixins reutilizables
│       ├── _helpers.scss              # Clases utility (.full-width, etc.)
│       └── _animations.scss           # Keyframes y transitions
└── styles.scss                        # Entry point
📁 3. Implementación Práctica - Archivos Concretos
3.1. /src/styles/themes/_variables.scss
Este archivo reemplaza variables hardcoded:


// master - MARSISCA - BEGIN 2026-01-08
// =============================================================================
// TripCoaster Design Tokens
// =============================================================================

// Brand Colors
$primary-color: #FF7F00;
$primary-hover: #E67300;
$primary-light: #FFDB99;
$primary-lighter: #FFEDCC;

$secondary-color: #2C2C2C;
$secondary-light: #757575;

$accent-light: #F1E9E4;
$accent-dark: #081F5C;

// Semantic Colors
$background-color: #FFFFFF;
$surface-color: #F9F9F9;
$border-color: #E0E0E0;
$border-color-hover: $primary-color;

$text-primary: $secondary-color;
$text-secondary: $secondary-light;
$text-on-primary: #FFFFFF;

// Status Colors
$success-color: #4CAF50;
$error-color: #F44336;
$error-bg: #FFEBEE;
$warning-color: $primary-color;
$info-color: $accent-dark;

// Spacing Scale (sistema 8pt)
$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-md: 16px;
$spacing-lg: 24px;
$spacing-xl: 32px;
$spacing-xxl: 48px;

// Border Radius
$radius-sm: 4px;
$radius-md: 8px;
$radius-lg: 12px;
$radius-xl: 20px;
$radius-full: 50%;

// Shadows
$shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
$shadow-md: 0 4px 12px rgba(0, 0, 0, 0.15);
$shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.15);
$shadow-focus: 0 0 0 3px rgba($primary-color, 0.2);

// Transitions
$transition-fast: 0.15s ease;
$transition-base: 0.3s ease;
$transition-slow: 0.5s ease;

// Z-index scale
$z-dropdown: 1000;
$z-sticky: 1020;
$z-fixed: 1030;
$z-modal-backdrop: 1040;
$z-modal: 1050;
$z-popover: 1060;
$z-tooltip: 1070;

// Breakpoints
$breakpoint-mobile: 576px;
$breakpoint-tablet: 768px;
$breakpoint-desktop: 1024px;
$breakpoint-large: 1440px;

// Typography
$font-family-base: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
$font-size-base: 16px;
$line-height-base: 1.5;

// master - MARSISCA - END 2026-01-08
3.2. /src/styles/utilities/_mixins.scss
Mixins críticos para evitar repetición:


// master - MARSISCA - BEGIN 2026-01-08
@use '../themes/variables' as vars;

// Mixin: Flex center
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

// Mixin: Flex between
@mixin flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

// Mixin: Truncate text
@mixin truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// Mixin: Card style
@mixin card($padding: vars.$spacing-lg) {
  background: white;
  border-radius: vars.$radius-lg;
  box-shadow: vars.$shadow-sm;
  padding: $padding;
}

// Mixin: Focus ring (for accessibility)
@mixin focus-ring($color: vars.$primary-color) {
  outline: none;
  box-shadow: 0 0 0 3px rgba($color, 0.2);
}

// Mixin: Hover lift effect
@mixin hover-lift {
  transition: transform vars.$transition-base, box-shadow vars.$transition-base;

  &:hover {
    transform: translateY(-2px);
    box-shadow: vars.$shadow-md;
  }
}

// Mixin: Button reset
@mixin button-reset {
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;
}

// Mixin: Responsive breakpoint
@mixin respond-to($breakpoint) {
  @if $breakpoint == mobile {
    @media (max-width: vars.$breakpoint-mobile) { @content; }
  } @else if $breakpoint == tablet {
    @media (min-width: vars.$breakpoint-tablet) { @content; }
  } @else if $breakpoint == desktop {
    @media (min-width: vars.$breakpoint-desktop) { @content; }
  } @else if $breakpoint == large {
    @media (min-width: vars.$breakpoint-large) { @content; }
  }
}

// Mixin: Absolute cover
@mixin absolute-cover {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

// Mixin: Visually hidden (for accessibility)
@mixin visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

// master - MARSISCA - END 2026-01-08
3.3. /src/styles/themes/_material-overrides.scss
CRÍTICO: Este archivo contiene SOLO overrides globales válidos de Material. Reemplaza el ::ng-deep actual:


// master - MARSISCA - BEGIN 2026-01-08
@use './variables' as vars;

// =============================================================================
// Global Material Component Overrides
// IMPORTANTE: Solo overrides que afecten a TODOS los componentes de la app
// =============================================================================

// -----------------------------------------------------------------------------
// Mat Dialog - Global styles
// -----------------------------------------------------------------------------
.mat-mdc-dialog-container {
  border-radius: vars.$radius-lg !important;
  overflow: hidden !important;

  .mdc-dialog__surface {
    border-radius: vars.$radius-lg !important;
    box-shadow: vars.$shadow-lg !important;
  }
}

// Mat Dialog Title - Color brand
.mat-mdc-dialog-title,
h2[mat-dialog-title] {
  color: vars.$primary-color !important;
  font-weight: 600;
}

// Mat Dialog Actions - Spacing
.mat-mdc-dialog-actions {
  padding: vars.$spacing-lg !important;
  gap: vars.$spacing-sm;
  border-top: 1px solid vars.$border-color;
}

// -----------------------------------------------------------------------------
// Mat Form Field - Global appearance
// -----------------------------------------------------------------------------

// Force all form fields to use outline appearance with consistent styling
.mat-mdc-form-field {
  width: 100%;

  // Label always floated above
  .mat-mdc-floating-label {
    font-weight: 500;
    color: vars.$text-secondary;
  }

  // Focus state - orange label
  &.mat-focused .mat-mdc-floating-label {
    color: vars.$primary-color !important;
  }

  // Input background
  .mat-mdc-text-field-wrapper {
    background-color: vars.$surface-color;
    border-radius: vars.$radius-md;
  }

  // Input borders
  .mdc-notched-outline {
    .mdc-notched-outline__leading,
    .mdc-notched-outline__notch,
    .mdc-notched-outline__trailing {
      border-color: vars.$border-color;
      border-width: 1px;
    }

    .mdc-notched-outline__leading {
      border-radius: vars.$radius-md 0 0 vars.$radius-md;
    }

    .mdc-notched-outline__trailing {
      border-radius: 0 vars.$radius-md vars.$radius-md 0;
    }
  }

  // Focus border
  &.mat-focused .mdc-notched-outline {
    .mdc-notched-outline__leading,
    .mdc-notched-outline__notch,
    .mdc-notched-outline__trailing {
      border-color: vars.$primary-color !important;
      border-width: 2px !important;
    }
  }

  // Input text
  .mat-mdc-input-element,
  input.mat-mdc-input-element,
  textarea.mat-mdc-input-element {
    color: vars.$text-primary;
    padding: 12px;
  }
}

// -----------------------------------------------------------------------------
// Mat Select - Dropdown styling
// -----------------------------------------------------------------------------
.mat-mdc-select-arrow svg {
  color: rgba(vars.$primary-color, 0.7);
  fill: rgba(vars.$primary-color, 0.7);
}

.mat-mdc-select-panel {
  background-color: white !important;
  border-radius: vars.$radius-md !important;
}

// -----------------------------------------------------------------------------
// Mat Autocomplete - Panel styling
// -----------------------------------------------------------------------------
.mat-mdc-autocomplete-panel {
  background-color: white !important;
  border-radius: vars.$radius-md !important;
}

// -----------------------------------------------------------------------------
// Mat Datepicker - Calendar styling
// -----------------------------------------------------------------------------
.mat-datepicker-content {
  background-color: white !important;
  box-shadow: vars.$shadow-md !important;
  border-radius: vars.$radius-md !important;
}

.mat-datepicker-toggle button {
  color: rgba(vars.$primary-color, 0.7);
}

// -----------------------------------------------------------------------------
// Mat Button - Brand styling
// -----------------------------------------------------------------------------

// Outlined button (Cancel, secondary actions)
.mat-mdc-button:not(.mat-mdc-raised-button):not(.mat-mdc-fab):not(.mat-mdc-mini-fab) {
  color: vars.$primary-color;
  border: 1px solid vars.$primary-color;
  border-radius: vars.$radius-md;
  padding: 10px 24px;
  font-weight: 500;

  &:hover:not([disabled]) {
    background-color: rgba(vars.$primary-color, 0.1);
  }
}

// Raised button (Primary actions)
.mat-mdc-raised-button {
  color: vars.$text-on-primary !important;
  background-color: vars.$primary-color !important;
  border-radius: vars.$radius-md !important;
  padding: 10px 24px !important;
  font-weight: 500 !important;
  box-shadow: vars.$shadow-sm;

  &:hover:not([disabled]) {
    background-color: vars.$primary-hover !important;
    box-shadow: vars.$shadow-md !important;
  }

  &[disabled] {
    opacity: 0.5;
    background-color: vars.$primary-color !important;
  }
}

// Icon button
.mat-mdc-icon-button {
  color: rgba(vars.$primary-color, 0.7);

  &:hover {
    background-color: rgba(vars.$primary-color, 0.1);
  }
}

// FAB button
.mat-mdc-fab,
.mat-mdc-mini-fab {
  &.mat-primary {
    background-color: vars.$primary-color;
    color: white;

    &:hover {
      background-color: vars.$primary-hover;
    }
  }
}

// master - MARSISCA - END 2026-01-08
3.4. /src/styles/components/_forms.scss
Estilos reutilizables específicos de formularios:


// master - MARSISCA - BEGIN 2026-01-08
@use '../themes/variables' as vars;
@use '../utilities/mixins' as mixins;

// =============================================================================
// Form Components - Reusable styles
// =============================================================================

// Full width form field (utility class)
.form-field-full-width {
  width: 100%;
}

// Form grid layouts
.form-row {
  display: flex;
  gap: vars.$spacing-md;
  width: 100%;

  > * {
    flex: 1;
  }

  @include mixins.respond-to(mobile) {
    flex-direction: column;
    gap: 0;
  }
}

.form-grid {
  display: grid;
  gap: vars.$spacing-lg;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

// Error message styling (reusable class)
.form-error-message {
  color: vars.$error-color;
  background-color: vars.$error-bg;
  padding: vars.$spacing-sm vars.$spacing-md;
  border-radius: vars.$radius-sm;
  font-size: 0.9rem;
  margin-top: vars.$spacing-sm;
  display: flex;
  align-items: center;
  gap: vars.$spacing-sm;

  mat-icon {
    font-size: 20px;
    width: 20px;
    height: 20px;
  }
}

// Field with icon inside (select, autocomplete)
.form-field-with-icon {
  .mat-mdc-form-field-icon-suffix {
    mat-icon {
      color: rgba(vars.$primary-color, 0.7);
    }
  }
}

// Option with icon (for mat-select, mat-autocomplete)
.option-with-icon {
  display: flex;
  align-items: center;
  gap: vars.$spacing-md;

  .option-icon {
    width: 24px;
    height: 24px;
    object-fit: contain;
  }

  .country-flag {
    width: 20px;
    height: 14px;
    object-fit: cover;
    border-radius: 2px;
    box-shadow: vars.$shadow-sm;
  }
}

// Custom rating field (usado en trip-form)
.form-rating-field {
  .rating-label {
    display: block;
    font-size: vars.$font-size-base;
    color: vars.$text-secondary;
    margin-bottom: vars.$spacing-sm;
    font-weight: 500;
  }

  .rating-error {
    color: vars.$error-color;
    font-size: 0.75rem;
    margin-top: vars.$spacing-xs;
  }
}

// master - MARSISCA - END 2026-01-08
3.5. /src/styles/components/_dialogs.scss
Estilos comunes para todos los diálogos:


// master - MARSISCA - BEGIN 2026-01-08
@use '../themes/variables' as vars;

// =============================================================================
// Dialog Components - Reusable styles
// =============================================================================

// Base dialog styling (mixin para aplicar en componentes)
@mixin dialog-base {
  h2[mat-dialog-title] {
    margin: 0;
    padding: vars.$spacing-lg;
    flex-shrink: 0;
    color: vars.$primary-color;
  }

  mat-dialog-content {
    padding: vars.$spacing-lg;
    overflow-y: auto;
    overflow-x: hidden;
    max-height: calc(90vh - 180px);
  }

  mat-dialog-actions {
    padding: vars.$spacing-lg;
    margin: 0;
    flex-shrink: 0;
    border-top: 1px solid vars.$border-color;
  }
}

// Form dialog (con formularios dentro)
.dialog-form {
  min-width: 400px;
  max-width: 600px;

  @media (max-width: vars.$breakpoint-mobile) {
    min-width: 300px;
    max-width: 100vw;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: vars.$spacing-lg;
  }
}

// Confirmation dialog (pequeño)
.dialog-confirm {
  min-width: 300px;
  max-width: 400px;

  .confirm-content {
    padding: vars.$spacing-lg 0;
    text-align: center;

    mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: vars.$spacing-md;
    }
  }
}

// master - MARSISCA - END 2026-01-08
3.6. /src/styles/utilities/_helpers.scss
Classes utility CSS (evita repetir clases):


// master - MARSISCA - BEGIN 2026-01-08
@use '../themes/variables' as vars;

// =============================================================================
// Utility Classes
// =============================================================================

// Width utilities
.full-width { width: 100% !important; }
.auto-width { width: auto !important; }

// Spacing utilities
.mt-0 { margin-top: 0 !important; }
.mt-1 { margin-top: vars.$spacing-sm !important; }
.mt-2 { margin-top: vars.$spacing-md !important; }
.mt-3 { margin-top: vars.$spacing-lg !important; }

.mb-0 { margin-bottom: 0 !important; }
.mb-1 { margin-bottom: vars.$spacing-sm !important; }
.mb-2 { margin-bottom: vars.$spacing-md !important; }
.mb-3 { margin-bottom: vars.$spacing-lg !important; }

.p-0 { padding: 0 !important; }
.p-1 { padding: vars.$spacing-sm !important; }
.p-2 { padding: vars.$spacing-md !important; }
.p-3 { padding: vars.$spacing-lg !important; }

// Flex utilities
.d-flex { display: flex !important; }
.flex-column { flex-direction: column !important; }
.flex-row { flex-direction: row !important; }
.align-center { align-items: center !important; }
.justify-center { justify-content: center !important; }
.justify-between { justify-content: space-between !important; }
.gap-1 { gap: vars.$spacing-sm !important; }
.gap-2 { gap: vars.$spacing-md !important; }
.gap-3 { gap: vars.$spacing-lg !important; }

// Text utilities
.text-center { text-align: center !important; }
.text-left { text-align: left !important; }
.text-right { text-align: right !important; }
.text-primary { color: vars.$primary-color !important; }
.text-secondary { color: vars.$text-secondary !important; }
.text-error { color: vars.$error-color !important; }

// Display utilities
.d-none { display: none !important; }
.d-block { display: block !important; }
.d-inline-block { display: inline-block !important; }

// master - MARSISCA - END 2026-01-08
3.7. /src/styles.scss - Archivo principal reorganizado

// master - MARSISCA - BEGIN 2026-01-08
@use '@angular/material' as mat;

// =============================================================================
// 1. Variables y Theme de Material
// =============================================================================
@use './styles/themes/variables' as vars;
@use './styles/themes/material-theme' as theme;

// Apply Material theme
html {
  @include mat.theme(theme.$tripcoaster-theme);
}

// =============================================================================
// 2. Base Styles (reset, typography, layout)
// =============================================================================
@use './styles/base/typography';
@use './styles/base/layout';

// =============================================================================
// 3. Material Global Overrides
// =============================================================================
@use './styles/themes/material-overrides';

// =============================================================================
// 4. Reusable Component Styles
// =============================================================================
@use './styles/components/forms';
@use './styles/components/dialogs';
@use './styles/components/buttons';
@use './styles/components/cards';

// =============================================================================
// 5. Utilities (mixins, helpers, animations)
// =============================================================================
@use './styles/utilities/helpers';
@use './styles/utilities/animations';

// =============================================================================
// 6. Third-party Library Fixes (Leaflet, etc.)
// =============================================================================
@use './styles/vendor/leaflet';

// master - MARSISCA - END 2026-01-08
🔧 4. Migración del Formulario trip-form-modal
Antes (con ::ng-deep):

// ❌ ANTI-PATTERN
::ng-deep .trip-form-modal {
  .mat-mdc-form-field-has-label .mat-mdc-floating-label {
    transform: translateY(-1.34375em) scale(1) !important;
    // ... más estilos globales
  }
}
Después (limpio y mantenible):
trip-form-modal.scss:


// master - MARSISCA - BEGIN 2026-01-08
@use '../../../../styles/themes/variables' as vars;
@use '../../../../styles/utilities/mixins' as mixins;
@use '../../../../styles/components/dialogs' as dialogs;

.trip-form-modal {
  // Apply base dialog styles
  @include dialogs.dialog-base;

  // Component-specific styles ONLY
  .form-content {
    display: flex;
    flex-direction: column;
    gap: vars.$spacing-lg;

    form {
      display: flex;
      flex-direction: column;
      gap: vars.$spacing-lg;
    }
  }

  .date-fields {
    display: flex;
    gap: vars.$spacing-md;
    width: 100%;

    mat-form-field {
      flex: 1;
    }

    @include mixins.respond-to(mobile) {
      flex-direction: column;
      gap: 0;
    }
  }

  // Rating field (custom component)
  .rating-field {
    @extend .form-rating-field; // From forms.scss
  }

  // Error message
  .error-message {
    @extend .form-error-message; // From forms.scss
  }

  mat-spinner {
    display: inline-block;
  }
}

// master - MARSISCA - END 2026-01-08
trip-form-modal.html (changes):


<!-- Before -->
<mat-form-field appearance="outline" class="full-width">

<!-- After -->
<mat-form-field appearance="outline" class="form-field-full-width">
📋 5. Patrones de Formularios Estandarizados
Patrón 1: Formulario básico (create/edit)
HTML Template:


<!-- master - MARSISCA - BEGIN 2026-01-08 -->
<div class="dialog-form">
  <h2 mat-dialog-title>{{ mode === 'create' ? 'Add Item' : 'Edit Item' }}</h2>

  <mat-dialog-content>
    <form [formGroup]="itemForm">
      <!-- Text input -->
      <mat-form-field appearance="outline" class="form-field-full-width">
        <mat-label>Name</mat-label>
        <input matInput formControlName="name" placeholder="Enter name">
        @if (itemForm.get('name')?.invalid && itemForm.get('name')?.touched) {
          <mat-error>{{ getNameError() }}</mat-error>
        }
      </mat-form-field>

      <!-- Textarea -->
      <mat-form-field appearance="outline" class="form-field-full-width">
        <mat-label>Description</mat-label>
        <textarea matInput formControlName="description" rows="3"></textarea>
      </mat-form-field>

      <!-- Date range -->
      <div class="form-row">
        <mat-form-field appearance="outline">
          <mat-label>Start Date</mat-label>
          <input matInput [matDatepicker]="startPicker" formControlName="startDate">
          <mat-datepicker-toggle matIconSuffix [for]="startPicker"></mat-datepicker-toggle>
          <mat-datepicker #startPicker></mat-datepicker>
          @if (itemForm.get('startDate')?.invalid && itemForm.get('startDate')?.touched) {
            <mat-error>Required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>End Date</mat-label>
          <input matInput [matDatepicker]="endPicker" formControlName="endDate">
          <mat-datepicker-toggle matIconSuffix [for]="endPicker"></mat-datepicker-toggle>
          <mat-datepicker #endPicker></mat-datepicker>
        </mat-form-field>
      </div>

      <!-- Select with icons -->
      <mat-form-field appearance="outline" class="form-field-full-width form-field-with-icon">
        <mat-label>Category</mat-label>
        <mat-select formControlName="categoryId">
          <mat-option [value]="null">None</mat-option>
          @for (category of categories; track category.id) {
            <mat-option [value]="category.id">
              <div class="option-with-icon">
                @if (category.icon) {
                  <img [src]="category.icon" class="option-icon" [alt]="category.name">
                }
                <span>{{ category.name }}</span>
              </div>
            </mat-option>
          }
        </mat-select>
      </mat-form-field>
    </form>

    @if (errorMessage) {
      <div class="form-error-message">
        <mat-icon>error</mat-icon>
        {{ errorMessage }}
      </div>
    }
  </mat-dialog-content>

  <mat-dialog-actions align="end">
    <button mat-button type="button" (click)="onCancel()" [disabled]="isLoading">
      Cancel
    </button>
    <button mat-raised-button color="primary" (click)="onSubmit()" 
            [disabled]="isLoading || itemForm.invalid">
      @if (isLoading) {
        <mat-spinner diameter="20"></mat-spinner>
      } @else {
        {{ mode === 'create' ? 'Create' : 'Update' }}
      }
    </button>
  </mat-dialog-actions>
</div>
<!-- master - MARSISCA - END 2026-01-08 -->
Component SCSS:


// master - MARSISCA - BEGIN 2026-01-08
@use '../../../../styles/components/dialogs' as dialogs;

.dialog-form {
  @include dialogs.dialog-base;
  
  // Component-specific overrides ONLY if needed
  // Do NOT repeat common styles
}
// master - MARSISCA - END 2026-01-08
Patrón 2: Diálogo de confirmación
HTML Template:


<!-- master - MARSISCA - BEGIN 2026-01-08 -->
<div class="dialog-confirm">
  <h2 mat-dialog-title>Confirm Action</h2>

  <mat-dialog-content>
    <div class="confirm-content">
      <mat-icon color="warn">warning</mat-icon>
      <p>Are you sure you want to delete this item?</p>
    </div>
  </mat-dialog-content>

  <mat-dialog-actions align="end">
    <button mat-button (click)="onCancel()">Cancel</button>
    <button mat-raised-button color="warn" (click)="onConfirm()">Delete</button>
  </mat-dialog-actions>
</div>
<!-- master - MARSISCA - END 2026-01-08 -->
Patrón 3: Validación de errores (Component TS)

// master - MARSISCA - BEGIN 2026-01-08
getNameError(): string {
  const control = this.itemForm.get('name');
  if (control?.hasError('required')) {
    return 'Name is required';
  }
  if (control?.hasError('maxlength')) {
    const maxLength = control.errors?.['maxlength'].requiredLength;
    return `Name must be less than ${maxLength} characters`;
  }
  if (control?.hasError('minlength')) {
    const minLength = control.errors?.['minlength'].requiredLength;
    return `Name must be at least ${minLength} characters`;
  }
  return '';
}
// master - MARSISCA - END 2026-01-08
🎨 6. Reglas de Oro para Estilos de Componentes
✅ DO (Hacer):
Usa variables SCSS en lugar de hardcoded colors:


// ✅ CORRECTO
color: vars.$primary-color;

// ❌ INCORRECTO
color: #FF7F00;
Usa mixins para patrones comunes:


// ✅ CORRECTO
@include mixins.flex-center;

// ❌ INCORRECTO
display: flex;
align-items: center;
justify-content: center;
Usa clases utility para casos simples:


<!-- ✅ CORRECTO -->
<div class="d-flex align-center gap-2">

<!-- ❌ INCORRECTO: crear CSS custom para esto -->
<div class="my-custom-flex-container">
Mantén ViewEncapsulation por defecto (no uses ::ng-deep):


// ✅ CORRECTO - Encapsulation por defecto
@Component({
  selector: 'app-my-component',
  templateUrl: './my-component.html',
  styleUrl: './my-component.scss'
})
Usa @extend para heredar estilos comunes:


// ✅ CORRECTO
.my-error {
  @extend .form-error-message;
  // Solo añade diferencias específicas aquí
}
❌ DON'T (No hacer):
NO uses ::ng-deep excepto en casos MUY justificados:


// ❌ NUNCA hagas esto
::ng-deep .mat-mdc-form-field { ... }

// ✅ Usa clases globales en material-overrides.scss
NO repitas CSS entre componentes:


// ❌ INCORRECTO: repetir en cada componente
.error-message {
  color: #f44336;
  background: #ffebee;
  // ...
}

// ✅ CORRECTO: usar clase global
@extend .form-error-message;
NO uses !important a menos que sea absolutamente necesario:


// ❌ Evitar
color: red !important;

// ✅ Usa especificidad correcta
.my-component .error-text {
  color: vars.$error-color;
}
NO crees estilos "por si acaso":


// ❌ YAGNI violation
.error-message-large { ... } // Nadie lo usa
.error-message-with-icon { ... } // Nunca se implementó
NO anides más de 3 niveles:


// ❌ INCORRECTO
.parent {
  .child {
    .grandchild {
      .great-grandchild { // Demasiado anidamiento
        color: red;
      }
    }
  }
}

// ✅ CORRECTO: usa BEM o clases directas
.parent__great-grandchild {
  color: vars.$error-color;
}
🛠️ 7. Checklist de Migración Componente por Componente
Para cada componente existente:

 Leer el componente y extraer CSS repetido
 Mover estilos globales a material-overrides.scss o helpers
 Reemplazar hardcoded colors con variables
 Reemplazar patrones comunes con mixins
 Eliminar ::ng-deep (mover a overrides globales)
 Usar clases utility donde aplique (.full-width, .d-flex, etc.)
 Verificar responsive design con mixins respond-to
 Comprobar accesibilidad (focus states, contrast)
 Probar que el componente funciona igual visualmente
🎯 8. Ejemplos de Componentes Bien Estructurados
Componente: Tarjeta de Viaje
trip-card.component.html:


<!-- master - MARSISCA - BEGIN 2026-01-08 -->
<mat-card class="trip-card" (click)="onCardClick()">
  <mat-card-header>
    <mat-card-title>{{ trip.name }}</mat-card-title>
    <mat-card-subtitle>
      {{ trip.startDate | date:'dd/MM/yyyy' }} - {{ trip.endDate | date:'dd/MM/yyyy' }}
    </mat-card-subtitle>
  </mat-card-header>

  @if (trip.mainPhotoUrl) {
    <img mat-card-image [src]="trip.mainPhotoUrl" [alt]="trip.name">
  }

  <mat-card-content>
    <p class="trip-description">{{ trip.description || 'No description' }}</p>
    
    <div class="trip-meta">
      @if (trip.country) {
        <div class="meta-item">
          <mat-icon>place</mat-icon>
          <span>{{ trip.country.name }}</span>
        </div>
      }
      
      @if (trip.rating) {
        <div class="meta-item">
          <app-star-rating [rating]="trip.rating" [readonly]="true"></app-star-rating>
        </div>
      }
    </div>
  </mat-card-content>

  <mat-card-actions align="end">
    <button mat-button (click)="onEdit($event)">
      <mat-icon>edit</mat-icon>
      Edit
    </button>
    <button mat-button color="warn" (click)="onDelete($event)">
      <mat-icon>delete</mat-icon>
      Delete
    </button>
  </mat-card-actions>
</mat-card>
<!-- master - MARSISCA - END 2026-01-08 -->
trip-card.component.scss:


// master - MARSISCA - BEGIN 2026-01-08
@use '../../../../styles/themes/variables' as vars;
@use '../../../../styles/utilities/mixins' as mixins;

.trip-card {
  @include mixins.hover-lift;
  cursor: pointer;
  border-radius: vars.$radius-lg;
  overflow: hidden;

  mat-card-header {
    background: linear-gradient(135deg, vars.$primary-color, vars.$primary-hover);
    color: white;
    padding: vars.$spacing-md;

    mat-card-title {
      color: white;
      font-weight: 600;
    }

    mat-card-subtitle {
      color: rgba(255, 255, 255, 0.9);
    }
  }

  img[mat-card-image] {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }

  mat-card-content {
    padding: vars.$spacing-md;

    .trip-description {
      @include mixins.truncate;
      color: vars.$text-secondary;
      margin-bottom: vars.$spacing-md;
    }

    .trip-meta {
      display: flex;
      gap: vars.$spacing-md;
      flex-wrap: wrap;

      .meta-item {
        @include mixins.flex-center;
        gap: vars.$spacing-xs;
        color: vars.$text-secondary;
        font-size: 0.875rem;

        mat-icon {
          font-size: 18px;
          width: 18px;
          height: 18px;
        }
      }
    }
  }

  mat-card-actions {
    border-top: 1px solid vars.$border-color;
    padding: vars.$spacing-sm vars.$spacing-md;

    button {
      mat-icon {
        margin-right: vars.$spacing-xs;
      }
    }
  }
}
// master - MARSISCA - END 2026-01-08
🚀 9. Plan de Implementación (Roadmap)
Fase 1: Preparación (1-2 días)
Crear estructura de carpetas /src/styles/
Crear archivo de variables _variables.scss
Crear mixins básicos _mixins.scss
Crear _material-overrides.scss con overrides globales
Fase 2: Migración Core (2-3 días)
Refactorizar styles.scss con nueva estructura
Extraer estilos comunes a _forms.scss, _dialogs.scss, etc.
Eliminar ::ng-deep del formulario trip-form-modal (piloto)
Crear clases utility en _helpers.scss
Fase 3: Migración Componentes (1 semana)
Migrar componentes shared (header, login-modal, etc.)
Migrar páginas (trip-detail, general, maps, settings)
Migrar formularios restantes (accommodation, country, sport, etc.)
Revisar y eliminar CSS duplicado
Fase 4: Optimización (2-3 días)
Auditoría de CSS unused con herramientas (PurgeCSS)
Optimizar bundle size
Documentar patrones en README
Testing visual de regresión
📚 10. Recursos y Documentación
Comandos útiles:

# Analizar bundle size
npm run build -- --stats-json
npx webpack-bundle-analyzer dist/stats.json

# Linting SCSS
npm install --save-dev stylelint stylelint-config-standard-scss
npx stylelint "src/**/*.scss"
VSCode Extensions recomendadas:
SCSS IntelliSense
SCSS Formatter
Angular Language Service
Material Icon Theme
Referencias Material Design:
Angular Material Theming
Material Design 3
Angular Material Components
✅ Conclusión
Esta arquitectura te proporciona:

✅ Mantenibilidad: Estilos centralizados y reutilizables

✅ Escalabilidad: Fácil añadir nuevos componentes sin repetir CSS

✅ Consistencia: Variables y mixins aseguran diseño uniforme

✅ Performance: Menos CSS duplicado = bundle más pequeño

✅ Accesibilidad: Focus states y contraste correctos

✅ Temas: Preparado para dark mode u otros temas

El anti-pattern de ::ng-deep queda eliminado completamente, y tus estilos estarán organizados como una aplicación enterprise real.
