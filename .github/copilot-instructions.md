# Mue - Copilot Instructions

Mue is a browser new tab extension built with React 19, Vite 7, and Bun. It supports Chrome, Firefox, and Edge as a browser extension, plus a web demo.

## Architecture Overview

### Core Structure
- **Entry**: [src/index.jsx](src/index.jsx) initializes i18n, Sentry, and renders `<App />`
- **App**: [src/App.jsx](src/App.jsx) manages top-level state (background, widgets, toasts)
- **Global State**: Uses `localStorage` extensively for settings; no Redux/Context for main state
- **Event System**: Custom `EventBus` class in [src/utils/eventbus.js](src/utils/eventbus.js) for cross-component communication via `EventBus.emit('refresh', 'widgets')`

### Feature-Based Organization (`src/features/`)
Each feature is self-contained with its own structure:
```
features/{feature}/
├── {Feature}.jsx       # Main component
├── index.jsx           # Public exports
├── api/                # Data fetching logic
├── hooks/              # Custom hooks (e.g., useBackgroundState)
├── components/         # Sub-components
├── options/            # Settings panel components
└── scss/               # Feature-specific styles
```

Key features: `background`, `greeting`, `marketplace`, `navbar`, `quicklinks`, `quote`, `search`, `time`, `weather`, `welcome`

### Component Library (`src/components/`)
- **Elements**: Reusable UI (`Button`, `Tooltip`, `MainModal`, `ShareModal`)
- **Form/Settings**: Form controls for settings panels
- **Layout**: Layout wrappers like `WidgetsLayout`

## Development Commands

```bash
bun install          # Install dependencies (uses bun, not npm/yarn)
bun run dev          # Start Vite dev server with hot reload
bun run dev:host     # Dev server accessible on network
bun run build        # Production build → dist/ + browser zips in build/
bun run lint         # ESLint + Stylelint
bun run lint:fix     # Auto-fix lint issues
bun run pretty       # Prettier formatting
bun run translations # Update translation files from scripts/
```

## Key Patterns

### Settings & localStorage
Settings are stored directly in `localStorage`. Access pattern:
```javascript
// Reading
localStorage.getItem('theme')           // Returns string or null
JSON.parse(localStorage.getItem('order')) // For arrays/objects

// Writing triggers refresh via EventBus
localStorage.setItem('theme', 'dark');
EventBus.emit('refresh', 'other');      // Reload settings
```

Settings utilities in [src/utils/settings/](src/utils/settings/) handle load/export/import.

### Path Aliases (vite.config.mjs)
Use these aliases instead of relative paths:
```javascript
import variables from 'config/variables';
import EventBus from 'utils/eventbus';
import { Button } from 'components/Elements';
import Clock from 'features/time/Clock';
```

### Internationalization
- Translations: [src/i18n/locales/](src/i18n/locales/) (JSON files per locale)
- Access: `variables.getMessage('modals.welcome.buttons.next')`
- Add new languages in [src/lib/translations.js](src/lib/translations.js) and [src/i18n/languages.json](src/i18n/languages.json)

### Background System
Background loading uses a prefetch queue system in [src/features/background/api/backgroundLoader.js](src/features/background/api/backgroundLoader.js):
- Supports: API images, custom uploads, colors, gradients, videos, photo packs
- Caches next 3 images in `localStorage.imageQueue` for instant switching
- Hooks pattern: `useBackgroundState`, `useBackgroundLoader`, `useBackgroundRenderer`

### Widget System
Widgets are rendered based on `localStorage.order` array in [src/features/misc/views/Widgets.jsx](src/features/misc/views/Widgets.jsx):
```javascript
const widgets = { time: <Clock />, greeting: <Greeting />, ... };
order.map((element) => widgets[element])
```

### Modal System
Main modal in [src/components/Elements/MainModal/Main.jsx](src/components/Elements/MainModal/Main.jsx) uses:
- Lazy loading for tabs (Settings, Library, Discover)
- Deep linking via URL hash (`#settings`, `#discover/all`)
- Tab constants in `constants/tabConfig.js`

## Build Output

Production build creates:
- `dist/` - Web assets
- `build/chrome/` + `build/chrome-{version}.zip` - Chrome extension
- `build/firefox/` + `build/firefox-{version}.zip` - Firefox extension

Manifest files in [manifest/](manifest/) - separate for Chrome (`chrome.json`) and Firefox (`firefox.json`).

## Conventions

- **React 19**: Use hooks, no class components. PropTypes optional (disabled in ESLint).
- **SCSS**: Feature-scoped styles in `features/{name}/scss/`. Global variables in [src/scss/_variables.scss](src/scss/_variables.scss).
- **Icons**: Use `react-icons` (primarily `MdXxx` from Material Design).
- **Lazy Loading**: Heavy components (Weather, Settings tabs) use `React.lazy()`.
- **No console.log**: Use `console.warn` or `console.error` only (ESLint enforced).
