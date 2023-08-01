.PHONY: init pre-commit doctor generate test test-filter build-wasm

init:
	npm install

pre-commit:
	echo "TODO"

doctor:
	scripts/doctor

generate:
	npx tree-sitter generate

test:
	npx tree-sitter test

test-filter:
	npx tree-sitter test --filter $(filter)

build-wasm:
	npx tree-sitter build-wasm
