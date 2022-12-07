lint-frontend:
	make -C frontend lint

lintfix-frontend:
	make -C frontend lintfix

install:
	npm ci

start-frontend:
	make -C frontend start

start-backend:
	npx start-server

deploy:
	git push heroku main

start:
	make start-backend & make start-frontend