install: install-deps

start:
	heroku local -f Procfile.dev

start-backend:
	npx nodemon bin/slack.js

start-frontend:
	npx webpack serve

install-deps:
	npm ci

build:
	npm run build

lint:#initializing linter
	npx eslint . --ext js,jsx

lintfix:#fixing linter
	npx eslint . --fix --ext js,jsx

publish:
	npm publish

deploy:
	git push heroku

test:
	npm test -s

.PHONY: test