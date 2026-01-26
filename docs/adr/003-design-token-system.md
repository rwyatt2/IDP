# ADR-003: Design Token System

## Status

Accepted

## Date

2024-01-20

## Context

The IDP needs a consistent visual design across all features and extensions. We need to:

- Ensure visual consistency
- Support theming (dark/light modes)
- Enable easy design updates
- Meet accessibility requirements (WCAG 2.1 AA)
- Support white-labeling for potential enterprise use

### Options Considered

1. **CSS Custom Properties (Design Tokens)** - Native CSS variables
2. **CSS-in-JS (Styled Components/Emotion)** - Runtime styling
3. **Tailwind Arbitrary Values** - Hardcoded values in classes
4. **SCSS Variables** - Compiled variables
5. **External Design Token Tools** - Style Dictionary, Theo

## Decision

We will use a **CSS Custom Properties (Design Tokens)** based system, integrated with **Tailwind CSS**.

### Architecture

```
Design Tokens (CSS Variables)
         │
         ▼
   Tailwind Config
         │
         ▼
  Utility Classes
         │
         ▼
    Components
```

### Implementation

```css
/* src/styles/design-tokens.css */
:root {
  /* Semantic color tokens */
  --color-text-primary: #e6eaf0;
  --color-surface: #10141a;
  --color-accent-primary: #5558d4;
  
  /* Spacing scale */
  --space-4: 1rem;
  
  /* Typography */
  --text-base: 1rem;
}
```

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'text-primary': 'var(--color-text-primary)',
        'surface': 'var(--color-surface)',
        'accent': 'var(--color-accent-primary)',
      }
    }
  }
}
```

### Token Naming Convention

```
--{category}-{property}-{variant}

Examples:
--color-text-primary
--color-surface-raised
--space-4
--radius-lg
--shadow-md
```

## Consequences

### Positive

- **Single source of truth** for all design values
- **Runtime theming** without rebuild
- **Easy maintenance** - change once, apply everywhere
- **Accessibility** - contrast ratios defined centrally
- **Tailwind integration** - familiar developer experience
- **Performance** - CSS variables are fast

### Negative

- Extra layer of indirection
- Need to maintain both tokens and Tailwind config
- Learning curve for semantic token names
- Some Tailwind features may not work (arbitrary values discouraged)

### Mitigations

- Comprehensive documentation (see DESIGN-SYSTEM.md)
- Linting rules to enforce token usage
- Token naming guidelines
- Design system reference site

## Token Categories

| Category | Prefix | Example |
|----------|--------|---------|
| Colors | `--color-` | `--color-text-primary` |
| Spacing | `--space-` | `--space-4` |
| Typography | `--text-`, `--font-` | `--text-lg` |
| Borders | `--radius-` | `--radius-lg` |
| Shadows | `--shadow-` | `--shadow-md` |
| Transitions | `--duration-` | `--duration-fast` |

## References

- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Design Tokens W3C Draft](https://design-tokens.github.io/community-group/format/)
- [Tailwind CSS Configuration](https://tailwindcss.com/docs/configuration)
