# Project Roadmap

## Docket

- expand tree-sitter tests
- add labels to all tree-sitter tests
- add `How To Use` doc
- implement/Decry TODO Features
- publish to npm (?)

## Features

### Implemented

- standard common instructions & syntax
- additional mode instructions:
    - `65816`
    - `6502`
    - `4510`
    - `sweet16`
- `.FEATURE` features:
    - `@` in identifiers
    - `$` in identifiers
    - `$` is `PC`
    - `*` is `PC`
    - assignment to `PC`
    - leading `.` in identifiers
    - square brackets for indirect addressing
    - C-style `//` comments
    - labels without colons
    - string escapes
    - underlines within numbers

### TODO

- implement arbitrary solution for colonless-label/macro invocation ambiguity 

### Not Planned

- the following `.FEATURE` features:
    - identifiers overloading instruction names (seriously just don't)
