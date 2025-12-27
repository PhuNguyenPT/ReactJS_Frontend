#!/bin/bash
if ! docker network ls --format '{{.Name}}' | grep -q '^frontend-network-prod$'; then
    docker network create --driver bridge --attachable frontend-network-prod
fi
docker compose --env-file .env.production -f docker-compose.prod.yml -p frontend-prod up -d --build    