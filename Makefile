seeds:
	docker compose -f docker-compose.seeds.yaml up
	docker compose restart devbox

up:
	docker compose pull --quiet
	docker compose build
	docker compose up -d

up-test:
	docker compose -f docker-compose.tests.yaml pull --quiet
	docker compose -f docker-compose.tests.yaml build
	docker compose -f docker-compose.tests.yaml up -d