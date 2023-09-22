.PHONY: init pre-commit publish doctor generate test test-filter wasm dev-null

main: src/parser.c test

init:
	npm install
	mkdir -p .ignore
	touch -c .ignore/dev-null.asm

pre-commit: generate test build-wasm

publish:
	scripts/publish

doctor:
	scripts/doctor

generate: grammar.js
	npx tree-sitter generate

# src/parser.c: grammar.js
#	make generate

# test: src/parser.c
test:
	npx tree-sitter test

test-filter:
	npx tree-sitter test --filter $(filter)

tree-sitter-ca65.wasm: grammar.js
	npx tree-sitter build-wasm

wasm: tree-sitter-ca65.wasm

dev-null:
	ca65 .ignore/dev-null.asm -o /dev/null
