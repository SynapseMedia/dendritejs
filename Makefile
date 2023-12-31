# Include env file
ifneq (,$(wildcard ./.env))
    include .env
    export
endif

.DEFAULT_GOAL := all

.PHONY: bootstrap ## setup dev environment
bootstrap: install
	npx husky install
	npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'

.PHONY: test ## run tests
test:
	npx vitest -c vitest.config.ts

.PHONY: testcov ## run test coverage
testcov:
	npx vitest run --coverage
	
.PHONY: build ## compile typescript to /build
build:
	npx tsc -p tsconfig.json
	npx tsc-alias -p tsconfig.json

.PHONY: clean ## clean installation and dist files
clean:
	rm -rf coverage
	rm -rf dist
	rm -rf node_modules
	rm -rf package-lock.json

.PHONY: install ## install dependencies
install: 
	npm cache clean -f
	npm install -g husky
	npm install

.PHONY: dev ## run script
dev: 
	npx vite-node -c vitest.config.ts src/index.ts

.PHONY: format ## auto-format js source files
format:
	npx ts-standard --fix

.PHONY: lint ## lint standard js
lint: 
	npx ts-standard

.PHONE: release ## generate a new release version
release:
	npx standard-version

.PHONE: publish
publish: release ## publish a version
	git push --follow-tags origin main && npm publish

rebuild: clean deps
all: test lint

.PHONY: help  ## display this message
help:
	@grep -E \
		'^.PHONY: .*?## .*$$' $(MAKEFILE_LIST) | \
		sort | \
		awk 'BEGIN {FS = ".PHONY: |## "}; {printf "\033[36m%-19s\033[0m %s\n", $$2, $$3}'