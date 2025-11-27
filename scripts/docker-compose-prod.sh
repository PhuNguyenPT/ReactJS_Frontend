#!/bin/bash
chmod +x ./scripts/docker-compose-prod.sh
docker compose -f docker-compose.prod.yml -p frontend-prod up -d --build    