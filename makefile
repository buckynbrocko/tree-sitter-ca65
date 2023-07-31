.PHONY: init pre-commit troubleshoot generate test build-wasm

init:
	npm install

pre-commit:
	echo "TODO"

troubleshoot:
	echo "TODO"

generate:
	npx tree-sitter generate

test:
	npx tree-sitter test

build-wasm:
	npx tree-sitter build-wasm
