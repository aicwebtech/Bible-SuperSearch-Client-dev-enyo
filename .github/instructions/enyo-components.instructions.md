---
applyTo: "src/**/*.js"
description: "Enyo.js v2.7 component patterns for Bible SuperSearch UI. Use when creating or modifying any Enyo kind, component, or view."
---

# Enyo.js v2.7 Component Patterns

## Kind Definition

Every component is defined with `kind()`. Always `module.exports` the result.

```javascript
var kind = require('enyo/kind');
var Component = require('enyo/Component');  // or UiComponent, Control, etc.

module.exports = kind({
    name: 'MyComponent',     // Required. PascalCase. Must match filename.
    kind: Component,         // Required (unless extending enyo/kind directly).
    // ... properties, methods
});
```

## Published Properties

`published` creates observable properties with getter/setter pairs and automatic observer callbacks.

```javascript
published: {
    value: null,       // this.getValue() / this.setValue(x)
    label: '',
    active: false,
},

// Auto-called by Enyo when property changes:
valueChanged: function(was, is) {
    // respond to change; 'was' is previous value, 'is' is new value
},
```

## `create()` — Initialization

Always call `this.inherited(arguments)` first. This is how Enyo chains initialization up the
prototype hierarchy.

```javascript
create: function() {
    this.inherited(arguments);  // REQUIRED — do not omit
    // put initialization logic after inherited()
    this.set('label', 'Default Label');
},
```

## `rendered()` — Post-render DOM Access

Only access DOM nodes inside `rendered()` or later (not in `create()`).

```javascript
rendered: function() {
    this.inherited(arguments);
    // DOM is available here
    var el = this.$.myChild.hasNode();
},
```

## Components Array (Child Components)

Declare static children in the `components` array. Children are accessible via `this.$.<name>`.

```javascript
components: [
    { name: 'header', kind: 'enyo.Control', tag: 'h2', content: 'Title' },
    { name: 'submitBtn', kind: require('enyo/Button'), content: 'Submit',
      ontap: 'handleSubmit' },
],

handleSubmit: function(sender, event) {
    // sender === this.$.submitBtn
},
```

## Bindings

Bindings create automatic data flow between properties. Prefer bindings over manual observers
where the relationship is a direct property mirror.

```javascript
bindings: [
    // One-way (default): source → target
    { from: 'app.locale', to: '.$.label.content' },

    // Two-way: bidirectional sync
    { from: '.value', to: '.$.input.value', oneWay: false },

    // With transform function
    { from: '.active', to: '.$.btn.classes', transform: function(val) {
        return val ? 'bss_active' : '';
    }},
],
```

## Observers

Use observers to watch one or more properties and react to changes. Prefer `<prop>Changed()`
for single published properties; use `observers` for watching multiple paths at once.

```javascript
observers: [
    { method: 'onDataChange', path: ['value', 'active'] }
],

onDataChange: function(previous, current, property) {
    // called when either 'value' or 'active' changes
},
```

## Event Handlers

`handlers` maps Enyo event names (bubbled DOM events or custom component events) to method names.

```javascript
handlers: {
    ontap:       'handleTap',
    onkeyup:     'handleKeyUp',
    onMyCustom:  'handleCustom',  // custom events from child components
},

handleTap: function(sender, event) {
    // sender = source component, event = event object
    return true; // return true to stop event bubbling
},
```

## Signals (Cross-Tree Messaging)

Signals allow decoupled communication between components that don't share a direct parent-child
relationship.

**Sending a signal** (from anywhere):

```javascript
var Signal = require('../components/Signal');
// or at app level: var Signal = require('enyo/Signals');

Signal.send('onMySignal', { data: value });
```

**Receiving a signal** (in any component, via `handlers`):

```javascript
handlers: {
    onMySignal: 'handleMySignal',
},

handleMySignal: function(sender, event) {
    var data = event.data;
},
```

> Prefer `handlers` + Signal over direct method calls for communication between sibling or
> distant components.

## Dynamic Components

Create components at runtime with `createComponent()` or `createComponents()`.
Call `render()` on the new component if it is a UI component.

```javascript
var newItem = this.createComponent({
    kind: require('./MyItem'),
    value: 42,
    owner: this
});
newItem.render();
```

Destroy dynamically created components with `component.destroy()` to prevent memory leaks.

## Inheritance / Super Calls

Use `this.inherited(arguments)` to call the parent implementation of any overridden method.

```javascript
destroy: function() {
    // cleanup before destroying
    this.inherited(arguments);
},
```

## Naming Conventions

| Item | Convention | Example |
|------|-----------|---------|
| Kind `name` | PascalCase | `'BibleSelect'` |
| File name | Matches `name` | `BibleSelect.js` |
| Published properties | camelCase | `selectedBible` |
| Private methods | `_camelCase` | `_updateList()` |
| CSS classes on components | `bss_` prefix | `classes: 'bss_bible_select'` |

## CSS Classes

All classes added to components **must** use the `bss_` prefix.

```javascript
kind({
    name: 'MyWidget',
    classes: 'bss_widget',          // correct
    // classes: 'my_widget',        // WRONG — missing bss_ prefix
})
```

## One Component Per File

Each file should export exactly one `kind()` definition. Use `require()` to compose multiple
components together.

## Ajax Requests

For API calls within forms, use `FormBase`'s built-in Ajax support rather than creating raw
`enyo/Ajax` instances. Only use `enyo/Ajax` directly when the call is outside a form context.

```javascript
var Ajax = require('enyo/Ajax');

var ajax = new Ajax({ url: this.app.configs.apiUrl + '/endpoint' });
ajax.response(this, 'handleResponse');
ajax.error(this, 'handleError');
ajax.go({ param: value });

handleResponse: function(sender, response) { /* ... */ },
handleError: function(sender, err) { /* ... */ },
```
