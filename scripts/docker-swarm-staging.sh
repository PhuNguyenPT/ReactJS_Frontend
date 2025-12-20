#!/bin/bash

if ! docker network ls --format '{{.Name}}' | grep -q '^frontend-swarm-network-staging$'; then
    docker network create --driver overlay --attachable frontend-swarm-network-staging
fi
set -a
source .env.staging
set +a

docker stack deploy -c docker-compose.swarm.staging.yml frontend-swarm-staging --detach=false