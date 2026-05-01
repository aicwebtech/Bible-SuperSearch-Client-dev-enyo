---
applyTo: "src/forms/**/*.js"
description: "Form component conventions for Bible SuperSearch UI. Use when creating or modifying search forms, passage forms, or any form extending FormBase."
---

# Form Component Conventions

## All Forms Must Extend `FormBase`

Every form component in `src/forms/` must extend `FormBase`. Never re-implement Ajax, pagination,
caching, or binding logic that `FormBase` already provides.

```javascript
var kind    = require('enyo/kind');
var FormBase = require('./FormBase');

module.exports = kind({
    name: 'MySearchForm',
    kind: FormBase,
    // ...
});
```

## `FormBase` Capabilities (Do Not Re-Implement)

| Feature | How to use it |
|---------|--------------|
| Ajax request to API | Call `this.submitForm()` |
| Pagination | Set `this.page`; FormBase tracks `this.maxPage` |
| Result caching | Automatic via `this.cacheHash` |
| Standard bindings | Set `autoApplyStandardBindings: true` (default) |
| Request state | `this.requestPending` (boolean) |

## `formData` Object

All form field values must be stored in `this.formData` before calling `submitForm()`. This plain
object is serialized directly as the API query parameters.

```javascript
// Set fields
this.set('formData.search', userInput);
this.set('formData.bible', selectedBibles);
this.set('formData.reference', referenceString);
this.set('formData.search_type', searchType);

// Then submit
this.submitForm();
```

Key `formData` fields:

| Field | Type | Purpose |
|-------|------|---------|
| `search` | string | Search query |
| `reference` | string | Bible reference (e.g. `"John 3:16"`) |
| `bible` | string or array | Bible module(s) to search |
| `search_type` | string | `'and'`, `'or'`, `'phrase'`, `'proximity'`, etc. |
| `page` | number | Current page (managed by FormBase) |

## Standard Bindings

`FormBase` applies `FormBindings` automatically (via `src/forms/FormBindings.js`) when
`autoApplyStandardBindings: true`. Only add custom bindings that are not already in
`FormBindings`.

```javascript
bindings: [
    // Add ONLY bindings not covered by FormBindings
    { from: 'app.myNewProp', to: '.$.myWidget.value' },
],
```

## Signal-Based Form Communication

Forms communicate with other parts of the UI via Signals, not direct method calls.

```javascript
var Signal = require('../components/Signal');

// Trigger a form clear across the whole app:
Signal.send('onClearForm');

// Indicate a new search has started:
Signal.send('onSearchStart', { query: this.formData.search });
```

Forms also **listen** for signals via `handlers`:

```javascript
handlers: {
    onCacheChange:   'handleCacheChange',
    onHashRunForm:   'handleHashRunForm',
    onAppLoaded:     'handleAppLoaded',
    onClearForm:     'handleClearForm',
},
```

## Sub-Forms

When a form instance is **not** the primary form on the interface, set `subForm: true`.
If the form contains multiple form instances, set `containsSubforms: true`.

```javascript
kind({
    name: 'SecondaryPassageForm',
    kind: FormBase,
    subForm: true,            // not the primary form
    defaultForm: false,
    // ...
});
```

## Reference Field and Search Field

FormBase tracks which field names map to the reference and search inputs. Override if your
form uses non-standard field names:

```javascript
referenceField: 'reference',   // default
searchField:    'search',      // default
```

## Success and Error Handling

FormBase routes Ajax responses through `successHandle` and `errorHandle`. Override these
to customize response handling; always call `this.inherited(arguments)` first.

```javascript
successHandle: function(sender, response) {
    this.inherited(arguments);
    // additional handling
},

errorHandle: function(sender, error) {
    this.inherited(arguments);
    // additional handling
},
```

## Form Naming

Form `name` must be PascalCase and match the filename:

```
src/forms/MyForm.js  →  name: 'MyForm'
```

## Adding a New Form

1. Create `src/forms/MyForm.js` extending `FormBase`.
2. Register the form in the relevant interface component under `src/view/interfaces/`.
3. If the interface needs a new interface variant, register it in `src/view/Interfaces.js`.
4. Wrap all user-visible strings in `$L()`.
