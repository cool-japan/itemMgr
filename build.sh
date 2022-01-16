#!/bin/sh

# If .env file does not exist, just copy .env_sample to .env
# You can reqrite .env in this folder as you wish (for the Django API's Docker Container)
[ ! -f ./.env ] && { cp ./.env.sample ./.env ; }

## Use this line if you use global ip address (not localhost)
# sed -i 's/127.0.0.1:8000/(Global IP Addr or Public IPv4 DNS)/' ./ui/variables.js
##  Use this line if you want to test only in local environment
# sed -i 's/127.0.0.1:8000/localhost:8000/' ./ui/variables.js
## Don't forget to run docker service (daemon)
# sudo service docker start

docker-compose down

docker stop $(docker ps -q)

# docker volume prune
docker volume rm itemmgr_postgres_data
docker image rm itemmgr_web
docker image rm itemmgr_nginx

docker-compose build web
docker-compose --env-file ./.env build nginx

docker-compose up -d db
docker-compose up -d web

#### data and schema migration for the new database engine (pgsql->sqlite3 etc.)
docker-compose exec web python3 manage.py migrate --noinput

docker-compose down

# docker-compose up -d

