# Fork Summary

This fork adds configurable quicklinks grid columns, metro tile opacity controls, and improved settings import/export error handling.

## Changes Overview

### Quicklinks Grid Columns
**Files:** `QuickLinks.jsx`, `QuickLinksOptions.jsx`, `quicklinks.scss`

- Added dropdown to configure number of columns (2-8) for quicklinks grid
- "Auto" option preserves original flex-wrap behavior for backwards compatibility
- Uses CSS flexbox with `max-width` constraint to enforce column count while keeping last row centered
- Fixed-size metro tiles (160×100px) ensure consistent grid alignment

### Metro Tile Opacity
**Files:** `QuickLinks.jsx`, `QuickLinksOptions.jsx`, `quicklinks.scss`

- Added slider (0-100%) to control metro tile background transparency
- Opacity affects background only, not icons or text
- Blur effect scales proportionally with opacity for true see-through appearance
- Applied via inline styles to prevent CSS animation conflicts

### Settings Import/Export
**Files:** `import.js`, `export.js`

- **Export:** Excludes transient cache keys (`currentWeather`, `currentQuote`) that caused import errors
- **Import:** Added comprehensive error handling with per-key try/catch, size logging for large values, and detailed console output for debugging

### Translations
**Files:** `en_GB.json`, `en_US.json`

Added translation keys for new features:
- `columns`, `columns_subtitle`, `columns_auto`
- `metro_opacity`, `metro_opacity_subtitle`

### Default Settings
**File:** `default_settings.json`

Added defaults for new settings:
- `quicklinksColumns: "auto"`
- `quicklinksMetroOpacity: 100`