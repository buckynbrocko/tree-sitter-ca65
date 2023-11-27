.PHONY: init pre-commit publish doctor generate test test-update watch-tests wasm dev-null foo bar

main: src/parser.c test

init:
	npm install
	mkdir -p .ignore
	touch -c .ignore/dev-null.asm

pre-commit: src/parser.c test tree-sitter-ca65.wasm

shared-library: src/parser.c
	cd src && gcc -o ca65.so -shared parser.c -Os -fPIC -I .
	cp -v src/ca65.so ~/.config/nvim/parser/ca65.co

highlight-html: test
	npx tree-sitter highlight misc/smb-movements.s --html > misc/smb-movements.html  
	npx tree-sitter highlight misc/mega-syntax.asm --html > misc/mega-syntax.html  

highlight: test
	npx tree-sitter highlight misc/smb-movements.s	
	npx tree-sitter highlight misc/mega-syntax.asm

publish:
	scripts/publish

doctor:
	scripts/doctor

generate: src/parser.c
	make shared-library

src/parser.c: grammar.js etc/*.js
	npx tree-sitter generate

test: src/parser.c
	npx tree-sitter test $(args)

watch-tests:
	scripts/watch-tests

test-update: src/parser.c
	npx tree-sitter test --update $(args)

tree-sitter-ca65.wasm: src/parser.c
	npx tree-sitter build-wasm

.PHONY \
playground: wasm
	npx tree-sitter playground

wasm: tree-sitter-ca65.wasm


dev-null:
	ca65 .ignore/dev-null.asm -o /dev/null
