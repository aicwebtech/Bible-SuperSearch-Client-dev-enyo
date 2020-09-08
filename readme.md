# Bible SuperSearch UI Development Code

[Bible SuperSearch](http://biblesupersearch.com) is a web-based Bible search engine with webservice API.

This repository contains the raw development code for the 
Bible SuperSearch UI, written using the [Enyo](http://enyojs.com) JavaScript framework.

Requirements: Node, npm

Must install the Enyo dev tools:

```
npm install -g enyo-dev
```

__This repository uses submodules.__
After cloning, you __must__ run:

```
git submodule init
git submodule update
```

## Configuration
Rename config-example.js to config.js
Edit as desired

## Generating Production Code
Run ./packprod to generate packed, production code
Point a virtual host to builds/prod to view and test
