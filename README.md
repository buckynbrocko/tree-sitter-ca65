# tree-sitter-ca65
A [tree-sitter](https://tree-sitter.github.io/) grammar for the ca65 assembler of the [cc65](https://github.com/cc65/cc65) development package.

# Features

## Implemented

- standard common instructions & syntax
- additional mode instructions:
    - `65816`
    - `6502`
    - `4510`
    - `sweet16`
- `.FEATURE` features:
    - `@` in identifiers
    - `$` in identifiers
    - leading `.` in identifiers
    - square brackets for indirect addressing
    - C-style comments
    - labels without colons
    - string escapes
    - underlines within numbers

## Missing

- `$` is `PC`
- assignment to `PC`

## Not Planned

- identifiers overloading instruction names
- missing char terminator `.feature`
- loose char terminator `.feature`
- loose string terminator `.feature`



# Development

## Prerequisites

- [Node.js](https://nodejs.org/)
- [make](https://www.gnu.org/software/make/)
- [Emscripten](https://emscripten.org/)

## Quick Start

```shell
make init
```

## Pre-Commit

```shell
make pre-commit
```
