# Bible SuperSearch UI — Agent Guidelines

## Project Overview

Bible SuperSearch UI is a web-based Bible search engine client built with **Enyo.js v2.7**. The UI
communicates with the Bible SuperSearch API (default: `https://api.biblesupersearch.com`) to search
and look up Bible passages. The same codebase powers a standalone Universal Client and a WordPress
Plugin integration.

Current version: **6.2.0**

## Technology Stack

- **Framework**: Enyo.js v2.7 (component-based, no DOM templates)
- **Language**: JavaScript (ES5-compatible — no arrow functions, no `const`/`let`, no destructuring)
- **Build tool**: `enyo-dev` (`enyo pack`)
- **Tests**: QUnit 2.x (auto-disabled when not present)
- **Persistence**: Browser `localStorage` (no backend session)

> All source code must be **ES5-compatible**. Do not use ES6+ syntax.

## Source Layout

```
src/
  app.js                    Main Application — config merge, init, state management
  config/
    default.js              All default config values (source of truth for options)
    build.js                Build-time overrides
    system.js               System-level settings
  forms/
    FormBase.js             Base class for all search/lookup forms (Ajax, pagination, binding)
    Search.js, Passage.js   Standard search and passage-lookup forms
    Advanced.js             Advanced search with extra operators
    Minimal.js              Minimal interface form
    ClassicUserFriendly*.js Classic interface variants
    Expanding.js            Expanding interface form
    BrowsingBook*.js        Book browsing forms
  view/
    Interfaces.js           Registry of all 15+ interface variants
    FormatButtons.js        Format-mode button bar
    BrowsingButtons.js      Navigation/browsing button bar
    Pagers.js               Pagination controls
    ErrorView.js            Error display
    interfaces/             One subfolder per interface skin
  components/               Reusable UI widgets (BibleSelect, SearchType, Passage, Toggle, etc.)
  data/
    models/                 Enyo Models (UserConfig, Bookmark)
    controllers/            Persistence controllers (UserConfig → localStorage)
    collections/            API response transformers (ResponseCollection)
    sources/                LocalStorage Enyo sources
    LocalStorageManager.js  Low-level localStorage wrapper
  i18n/
    LocaleLoader.js         Language registry + partial-match fallback
    en.js, es.js, ru.js … 46 language files
  lib/
    Validators.js           Input validation helpers
    Utils.js                General utility functions
```

## Build Commands

| Command     | Output                              | Purpose                                         |
|-------------|-------------------------------------|-------------------------------------------------|
| `./packdev`  | `builds/dev/biblesupersearch/`      | Development build (unminified)                  |
| `./packprod` | `builds/prod/biblesupersearch.html` | Production build (minified, no inline CSS/JS)   |
| `./packship` | variant                             | Shipping/deployment build                       |

**First-time setup:**

```bash
npm install -g enyo-dev
git submodule init && git submodule update
cp config-example.js config.js
# Edit config.js as needed, then:
./packdev
```

## Configuration System

Config is merged from three sources at runtime (highest → lowest priority):

1. **`config.js`** (or `config.json`) in the repo root — runtime/deployment overrides.  
   The global object is named `biblesupersearch_config_options`.
2. **`src/config/default.js`** — all available options with their defaults.
3. **`src/config/build.js`** — build-time constants (version strings, etc.).

When adding a new config option, add it to `src/config/default.js` first with a sensible default
and a comment, then document it in `config-example.js`.

## Critical Conventions

### CSS Class Naming

All CSS classes **must** use the `bss_` prefix (e.g., `bss_form`, `bss_passage`, `bss_bible_select`).

> This was a **breaking change in v6.0.0**. Never add unprefixed classes to new or modified
> components. The only exceptions are classes that already carry an external vendor prefix.

### Component and Method Naming

- Component `name` property: `PascalCase` (e.g., `name: 'BibleSelect'`)
- Published properties: `camelCase`
- Private/internal methods: `_camelCase` (leading underscore, e.g., `_updateDefaults()`)
- One component definition per file; filename matches the component name

### Enyo Kind Definition Pattern

```javascript
var kind = require('enyo/kind');
var ParentKind = require('enyo/Component');  // or whatever parent

module.exports = kind({
    name: 'MyComponent',
    kind: ParentKind,
    published: {
        myProp: null,
    },
    bindings: [],
    handlers: {},
    components: [],
    create: function() {
        this.inherited(arguments);  // ALWAYS call inherited in create()
        // initialization here
    },
    myPropChanged: function(was, is) {
        // auto-called by Enyo when published property changes
    }
});
```

See `.github/instructions/enyo-components.instructions.md` for full Enyo pattern reference.

### Signals (Inter-Component Messaging)

Use `Signal.send('onEventName', payload)` to broadcast. Components listen via `handlers`:
`{ onEventName: 'handlerMethod' }`.

Signal is imported as:

```javascript
var Signal = require('../components/Signal');
// or for top-level:
var Signal = require('enyo/Signals');
Signal = (enyo && enyo.Signals) ? enyo.Signals : Signal;
```

### Forms

All form components **must** extend `FormBase`. Do not duplicate Ajax or pagination logic.  
See `.github/instructions/forms.instructions.md`.

### Data / Persistence

- User settings persist to `localStorage` under the key `BibleSuperSearchUserConfig` (JSON).
- Models use Enyo `Model`; controllers use `enyo/ModelController`.
- See `.github/instructions/data-layer.instructions.md`.

### Internationalization

All user-visible strings must be wrapped with `this.app.t()` (or a variant thereof) so they can be translated.  
See `.github/instructions/i18n.instructions.md`.

## API Integration

- Default API: `https://api.biblesupersearch.com`
- All requests go through `FormBase` (via `enyo/Ajax`).
- Maximum parallel Bibles displayed: **8** (`app.maximumBiblesDisplayed`).
- `ResponseCollection` in `src/data/collections/` transforms raw API JSON into verse/passage arrays.

## Testing

QUnit tests live in `index.js`. Tests are skipped automatically if QUnit is not present.  
Set `testOnLoad: true` in `config.js` to run tests on page load.  
Set `testVerbose: true` for detailed console output.

## Interface Variants

The `interface` config key selects the active skin. Available values are registered in
`src/view/Interfaces.js`. Current variants include:
`twentytwenty`, `expanding`, `minimal`, `classic`, `browsing` (and numbered sub-variants).  
Each interface lives under `src/view/interfaces/<name>/`.
