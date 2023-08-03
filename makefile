.PHONY: init pre-commit doctor generate test test-filter build-wasm dev-null

init:
	npm install

pre-commit: generate test build-wasm
	echo "TODO"

doctor:
	scripts/doctor

generate: grammar.js
	npx tree-sitter generate

test:
	npx tree-sitter test

test-filter:
	npx tree-sitter test --filter $(filter)

build-wasm: grammar.js
	npx tree-sitter build-wasm

dev-null:
	ca65 .ignore/devnull.asm -o /dev/null
