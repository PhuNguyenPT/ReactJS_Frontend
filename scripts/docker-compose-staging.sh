#!/bin/bash
chmod +x ./scripts/docker-compose-staging.sh
docker compose -f docker-compose.staging.yml up -d --build