FROM python:3.10
RUN mkdir /app
WORKDIR /app

RUN pip install pipenv safety

COPY Pipfile .
COPY Pipfile.lock .
RUN pipenv install
RUN pipenv check
COPY . .

CMD ["pipenv", "run", "gunicorn", "main:create_app", "--worker-class", "aiohttp.worker.GunicornWebWorker", "-b", "0.0.0.0:8081"]
EXPOSE 8081
