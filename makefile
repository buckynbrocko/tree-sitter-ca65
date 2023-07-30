.PHONY: init pre-commit troubleshoot generate-grammar test-grammar build-wasm

init:
	npm install

pre-commit:
	echo "TODO"

troubleshoot:
	echo "TODO"

generate-grammar:
	npx tree-sitter generate

test-grammar:
	npx tree-sitter test

build-wasm:
	npx tree-sitter build-wasm
