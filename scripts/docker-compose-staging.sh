#!/bin/bash
if ! docker network ls --format '{{.Name}}' | grep -q '^frontend-network-staging$'; then
    docker network create --driver bridge --attachable frontend-network-staging
fi
docker compose --env-file .env.staging -f docker-compose.staging.yml -p frontend-staging up -d --build