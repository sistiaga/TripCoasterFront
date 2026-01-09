# TripCoaster Styles Architecture

Esta carpeta contiene la arquitectura modular de estilos para la aplicación TripCoaster.

## 📁 Estructura

```
styles/
├── base/                   # Estilos base y reset
├── themes/                 # Theme y variables
├── components/             # Estilos reutilizables de componentes
├── utilities/              # Mixins, helpers, animations
└── vendor/                 # Fixes para librerías externas
```

## 🎨 Uso Rápido

### Importar en un componente:

```scss
@use '../../../../styles/themes/variables' as vars;
@use '../../../../styles/utilities/mixins' as mixins;

.my-component {
  color: vars.$primary-color;
  padding: vars.$spacing-lg;

  @include mixins.flex-center;
  @include mixins.respond-to(mobile) {
    // Mobile styles
  }
}
```

### Clases utility en HTML:

```html
<div class="d-flex align-center gap-2 full-width">
  <button class="text-primary">Button</button>
</div>
```

## 📚 Documentación Completa

Ver [/docs/Cambio de estilos.md](/docs/Cambio%20de%20estilos.md) para la guía completa.

## 🚫 Reglas

- ❌ NO usar `::ng-deep`
- ❌ NO hardcodear colores
- ✅ USAR variables SCSS
- ✅ USAR mixins para patrones comunes
- ✅ SEGUIR el patrón del componente `trip-form-modal`
