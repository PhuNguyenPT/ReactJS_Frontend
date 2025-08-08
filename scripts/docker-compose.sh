#!/bin/bash
chmod +x ./scripts/docker-compose.sh
docker compose -f docker-compose.dev.yml up -d --build

# For production, you can use the following command:
# docker compose -f docker-compose.yml up -d --build    