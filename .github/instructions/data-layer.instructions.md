---
applyTo: "src/data/**/*.js"
description: "Data layer conventions for Bible SuperSearch UI — models, controllers, collections, and localStorage persistence."
---

# Data Layer Conventions

## Layer Overview

```
src/data/
  models/         Enyo Model definitions (data shape + validation)
  controllers/    Persistence controllers (load/save to localStorage)
  collections/    API response transformers
  sources/        Enyo LocalStorage source adapters
  LocalStorageManager.js   Low-level localStorage key management
```

## Models (`src/data/models/`)

Models use `enyo/Model`. Define attributes as plain properties; use `defaults` for initial values.

```javascript
var kind  = require('enyo/kind');
var Model = require('enyo/Model');

module.exports = kind({
    name: 'MyModel',
    kind: Model,
    // Attributes are plain properties — no 'published' on Models
    defaults: {
        locale:          'en',
        text_size:       3,
        font:            'default',
        render_style:    'paragraph',
        bibles_selected: [],
    },
});
```

**`UserConfig` model properties** (reference for user-settings features):

| Property | Type | Purpose |
|----------|------|---------|
| `locale` | string | Selected UI language code |
| `text_size` | number | Text size preference (1–5) |
| `font` | string | Font family preference |
| `render_style` | string | `'paragraph'` or `'verse'` |
| `bibles_selected` | array | User's saved Bible selections |

## Controllers (`src/data/controllers/`)

Controllers extend `enyo/ModelController` and own load/save lifecycle against localStorage.

```javascript
var kind       = require('enyo/kind');
var Controller = require('enyo/ModelController');
var Model      = require('../models/MyModel');

module.exports = kind({
    name: 'MyController',
    kind: Controller,
    lsUrl: 'MyLocalStorageKey',   // localStorage key (string)

    load: function() {
        var raw = localStorage.getItem(this.lsUrl) || null;

        if (raw) {
            try {
                var data = JSON.parse(raw);
                this.model.set(data);
            } catch(e) {
                console.log('error loading data', e);
                this.clear();
            }
        }
    },

    save: function() {
        var data = this.model.raw();
        localStorage.setItem(this.lsUrl, JSON.stringify(data));
    },

    clear: function() {
        this.set('model', new Model());
    },
});
```

### localStorage Key Convention

| Controller | localStorage key |
|------------|-----------------|
| `UserConfig` | `BibleSuperSearchUserConfig` |
| `Bookmark` | *(see BookmarkController)* |

Always use `JSON.parse` / `JSON.stringify` for localStorage values. Wrap `JSON.parse` in a
`try/catch` — malformed data must not crash the app.

## Collections (`src/data/collections/`)

Collections are not standard Enyo Collections. They are plain kind-based transformation
utilities that convert raw API JSON into structured arrays consumable by the view layer.

### `ResponseCollection`

Transforms the API's raw response into verse and passage arrays used by `app.resultsList`.

Key methods:

| Method | Output |
|--------|--------|
| `toVerses(response)` | Flat array of verse objects |
| `toMultiversePassages(response)` | Array of passage objects (multi-verse groups) |

Usage in `FormBase`:

```javascript
var ResponseCollection = require('../data/collections/ResponseCollection');
// ...
var results = ResponseCollection.toVerses(apiResponse);
this.app.set('resultsList', results);
```

Do not add view-layer logic (DOM manipulation, CSS classes) inside collections. Collections
must only transform data shapes.

## Sources (`src/data/sources/`)

Sources are Enyo `Source` adapters that back `Model.fetch()` / `Model.commit()` with
localStorage. They are wired to models via the `source` property and use
`LocalStorageManager` internally.

Do not read/write localStorage directly in models — use sources or controllers.

## `LocalStorageManager`

Low-level utility for namespaced localStorage access. Use when you need raw key/value access
outside of a controller:

```javascript
var StorageManager = require('./LocalStorageManager');

StorageManager.set('myKey', value);
var val = StorageManager.get('myKey');
StorageManager.remove('myKey');
```

## Error Handling Pattern

All localStorage reads must be wrapped in `try/catch`. On error, fall back to a clean/default
state — never propagate a parse error to the UI.

```javascript
try {
    var data = JSON.parse(localStorage.getItem(this.lsUrl));
    this.model.set(data);
} catch(e) {
    console.log('error loading ' + this.lsUrl, e);
    this.clear();
}
```

## Adding a New Persisted Setting

1. Add the property with a default to `src/data/models/UserConfig.js`.
2. If the property should be excluded from save (e.g., session-only), handle it in
   `UserConfigController.save()` before calling `JSON.stringify`.
3. Add the config option to `src/config/default.js` if it maps to a deployment config key.
4. Wrap any user-facing label for the setting in `$L()`.
