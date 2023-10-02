.PHONY: init pre-commit publish doctor generate test test-update wasm dev-null foo bar

main: src/parser.c test

init:
	npm install
	mkdir -p .ignore
	touch -c .ignore/dev-null.asm

pre-commit: src/parser.c test tree-sitter-ca65.wasm

publish:
	scripts/publish

doctor:
	scripts/doctor

generate: src/parser.c

src/parser.c: grammar.js src/custom/*
	npx tree-sitter generate

test: src/parser.c
	npx tree-sitter test $(args)

test-update: src/parser.c
	npx tree-sitter test --update $(args)

tree-sitter-ca65.wasm: src/parser.c
	npx tree-sitter build-wasm

wasm: tree-sitter-ca65.wasm


dev-null:
	ca65 .ignore/dev-null.asm -o /dev/null
