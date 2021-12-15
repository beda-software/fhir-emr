#!/bin/sh
pipenv run watchmedo shell-command --patterns="*.yaml;*.html" --command='kill -HUP `cat gunicorn.pid`' --ignore-directories --wait --drop --recursive . &
pipenv run gunicorn main:create_app --worker-class aiohttp.worker.GunicornWebWorker -b 0.0.0.0:8081 --reload --pid gunicorn.pid
