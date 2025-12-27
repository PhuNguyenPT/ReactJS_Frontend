#!/bin/bash
if ! docker network ls --format '{{.Name}}' | grep -q '^frontend-network-test$'; then
    docker network create --driver bridge --attachable frontend-network-test
fi
docker compose --env-file .env.test -f docker-compose.test.yml -p frontend-test up -d --build