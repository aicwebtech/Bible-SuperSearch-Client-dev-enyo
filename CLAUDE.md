# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bible SuperSearch UI is a web-based Bible search engine client (version **6.2.0**) built with **Enyo.js v2.7**. The UI talks to the Bible SuperSearch API (default: `https://api.biblesupersearch.com`) and powers both a Universal Client and a WordPress Plugin.

## Build & Setup

```bash
# One-time setup
npm install -g enyo-dev
git submodule init && git submodule update
cp config-example.js config.js
```

| Command      | Output                              | Purpose                               |
|--------------|-------------------------------------|---------------------------------------|
| `./packdev`  | `builds/dev/biblesupersearch/`      | Development build (unminified)        |
| `./packprod` | `builds/prod/biblesupersearch.html` | Production build (minified)           |
| `./packship` | variant                             | Shipping/deployment build             |

Point a virtual host to `builds/prod` to view the production build.

## Testing

QUnit 2.x tests live in `index.js`. Tests are auto-skipped when QUnit is absent.

- `testOnLoad: true` in `config.js` — run tests on page load
- `testVerbose: true` — detailed console output

## Architecture

### Technology

- **Framework**: Enyo.js v2.7 (component-based, no DOM templates)
- **Language**: **ES5 only** — no arrow functions, no `const`/`let`, no destructuring, no template literals
- **Persistence**: Browser `localStorage` only (no backend session)

### Configuration System

Config merges at runtime (highest → lowest priority):

1. `config.js` (repo root) — deployment/runtime overrides via global `biblesupersearch_config_options`
2. `src/config/default.js` — all available options with defaults (source of truth)
3. `src/config/build.js` — build-time constants

When adding a config option: add it to `src/config/default.js` first with a sensible default and comment, then document it in `config-example.js`.

### Source Layout

```
src/
  app.js                    Main Application — config merge, init, state management
  config/
    default.js              All default config values
    build.js                Build-time constants
  forms/
    FormBase.js             Base class for all forms (Ajax, pagination, caching, bindings)
    Search.js, Passage.js   Standard search and passage forms
    Advanced.js             Advanced search form
    Minimal.js, Expanding.js, BrowsingBook*.js, ClassicUserFriendly*.js  Interface forms
  view/
    Interfaces.js           Registry of all interface variants
    interfaces/             One subfolder per interface skin
    FormatButtons.js, BrowsingButtons.js, Pagers.js, ErrorView.js
  components/               Reusable UI widgets (BibleSelect, SearchType, Passage, Toggle, etc.)
  data/
    models/                 Enyo Models (UserConfig, Bookmark)
    controllers/            Persistence controllers (UserConfig → localStorage)
    collections/            API response transformers (ResponseCollection)
    sources/                LocalStorage Enyo source adapters
    LocalStorageManager.js  Low-level localStorage wrapper
  i18n/
    LocaleLoader.js         Language registry with partial-match fallback
    template.js             All translatable keys with empty values (copy for new languages)
    en.js, es.js, ru.js …   46 language files
  lib/
    Validators.js, Utils.js
```

## Critical Conventions

### ES5 Requirement

All source code must be ES5-compatible. Never use: arrow functions, `const`/`let`, destructuring, template literals, `class`, spread/rest, `import`/`export`.

### CSS Class Naming

All CSS classes **must** use the `bss_` prefix (e.g., `bss_form`, `bss_passage`). This was a breaking change in v6.0.0.

### Enyo Kind Pattern

```javascript
var kind = require('enyo/kind');
var FormBase = require('./FormBase');  // or whatever parent

module.exports = kind({
    name: 'MyComponent',      // PascalCase, matches filename
    kind: FormBase,
    published: { myProp: null },
    bindings: [],
    handlers: {},
    components: [],
    create: function() {
        this.inherited(arguments);  // ALWAYS call inherited first
    },
    myPropChanged: function(was, is) { /* auto-called on property change */ }
});
```

- Component `name`: PascalCase; private methods: `_camelCase`; one component per file
- Always call `this.inherited(arguments)` in any overridden lifecycle method (`create`, `rendered`, `destroy`, etc.)

### Signals (Cross-Component Messaging)

```javascript
var Signal = require('../components/Signal');
Signal.send('onEventName', { data: value });

// Receive via handlers:
handlers: { onEventName: 'handlerMethod' }
```

Prefer Signals over direct method calls for sibling/distant component communication.

## Forms

All form components **must** extend `FormBase` — never re-implement Ajax, pagination, caching, or binding logic.

Key `FormBase` features:
- `this.submitForm()` — executes API request using `this.formData`
- `this.page` / `this.maxPage` — pagination (managed automatically)
- `this.requestPending` — boolean request state
- `autoApplyStandardBindings: true` — applies `FormBindings.js` automatically

`formData` key fields: `search`, `reference`, `bible`, `search_type`, `page`.

Override `successHandle` / `errorHandle` to customize response handling; always call `this.inherited(arguments)` first.

When adding a new form:
1. Create `src/forms/MyForm.js` extending `FormBase`
2. Register it in the relevant interface under `src/view/interfaces/`
3. If it's a new interface variant, register in `src/view/Interfaces.js`

## Internationalization (i18n)

All user-visible strings must be wrapped in `$L('string')`.

**Translation rules (strictly enforced):**
- Do **not** add user-visible keys to `en.js` or `en_US.js`
- Add new keys to `src/i18n/template.js` (empty value) and to **every** non-English locale file
- Keep key placement/order aligned across all locale files
- Only update existing translations when explicitly requested — never modify existing translation strings while adding new ones
- Use targeted file edits only; avoid bulk rewrites

**Pitfall languages — do NOT translate:** `bo` (Tibetan), `jv` (Javanese), `lue` (Luvale). When adding new keys to locale files, leave these three untranslated (do not fill in values / skip them). Do not attempt to machine-translate or hand-translate strings for these locales.

Language files use BCP 47 codes; filename must exactly match `meta.code`. When adding a new language: copy `template.js`, register in `LocaleLoader.js` (alphabetical order), and add to `languageList` in `default.js`.

## Data Layer

- **Models** (`src/data/models/`): use `enyo/Model`; attributes in `defaults`, not `published`
- **Controllers** (`src/data/controllers/`): extend `enyo/ModelController`; own load/save to localStorage
- User settings persist under key `BibleSuperSearchUserConfig` (JSON)
- All localStorage reads must be wrapped in `try/catch`; on error fall back to defaults
- Do not read/write localStorage directly in models — use sources or controllers
- `ResponseCollection.toVerses()` / `toMultiversePassages()` transform raw API JSON; no view logic inside collections

## API Integration

- Default API: `https://api.biblesupersearch.com`
- All requests go through `FormBase` (via `enyo/Ajax`)
- Maximum parallel Bibles: **8** (`app.maximumBiblesDisplayed`)
- `app.resultsList` holds transformed verse/passage arrays from `ResponseCollection`

## Interface Variants

The `interface` config key selects the active skin. All variants are registered in `src/view/Interfaces.js`. Each skin lives under `src/view/interfaces/<name>/`. Current variants include: `Expanding`, `ExpandingLargeInput`, `Minimal`, `Classic`, `BrowsingBookSelector`, and numbered sub-variants.
