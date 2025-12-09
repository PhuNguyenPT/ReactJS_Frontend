#!/bin/bash
chmod +x ./scripts/docker-compose-prod.sh
docker compose --env-file .env.production -f docker-compose.prod.yml -p frontend-prod up -d --build    