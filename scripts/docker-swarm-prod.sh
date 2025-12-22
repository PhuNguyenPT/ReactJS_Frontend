#!/bin/bash

if ! docker network ls --format '{{.Name}}' | grep -q '^frontend-swarm-network-prod$'; then
    docker network create --driver overlay --attachable frontend-swarm-network-prod
fi
set -a
source .env.production
set +a

docker stack deploy -c docker-compose.swarm.prod.yml frontend-swarm-prod --detach=false