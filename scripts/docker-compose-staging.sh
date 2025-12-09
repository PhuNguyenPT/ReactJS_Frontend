#!/bin/bash
chmod +x ./scripts/docker-compose-staging.sh
docker compose --env-file .env.staging -f docker-compose.staging.yml -p frontend-staging up -d --build