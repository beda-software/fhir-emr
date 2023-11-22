build-seeds:
	docker compose -f docker-compose.seeds.yaml up
seeds:
	docker compose -f docker-compose.seeds.yaml up
	docker compose up -d --force-recreate --no-deps devbox

up:
	docker compose pull --quiet
	docker compose build
	docker compose up -d

stop:
	docker compose stop

down:
	docker compose down

up-video:
	docker compose -f compose.yaml -f compose.video.yaml pull --quiet
	docker compose build
	docker compose -f compose.yaml -f compose.video.yaml up -d

kaitenzushi:
	docker pull bedasoftware/kaitenzushi:latest
	docker run -d --name fhir-emr-kaitenzushi \
		-v $$(pwd)/resources:/app/resources \
		bedasoftware/kaitenzushi:latest \
		-i resources/tests/TestScript \
		-o resources/tests/TestScript \
		-d https://github.com/beda-software/beda-emr-core
	@CONTAINER_EXIT_CODE=$$(docker wait fhir-emr-kaitenzushi); \
	docker rm fhir-emr-kaitenzushi; \
	exit $$CONTAINER_EXIT_CODE

testscript:
	@if [ -f ".env" ]; then \
		export `cat .env | xargs`; \
	fi
	docker compose -f docker-compose.testscript.yaml pull --quiet
	docker compose -f docker-compose.testscript.yaml up --exit-code-from testscript testscript

test:
	@if [ -f ".env" ]; then \
		export `cat .env | xargs`; \
	fi
	docker compose -f docker-compose.tests.yaml pull --quiet
	docker compose -f docker-compose.tests.yaml up -d
	yarn test