#!/bin/bash
docker compose \
  --env-file .env.production \
  -f docker-compose.prod.galaxyfreedom.com.yml \
  -p frontend-prod-galaxyfreedom \
  up -d --build