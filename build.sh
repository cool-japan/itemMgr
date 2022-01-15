#!/bin/sh

docker-compose down

docker stop $(docker ps -q)

# docker volume prune
docker volume rm itemmgr_postgres_data

docker image rm itemmgr_web

docker-compose up -d db
docker-compose up -d web

docker-compose exec web python manage.py migrate --noinput

# docker-compose down

