#!/bin/bash
docker compose \
  --env-file .env.staging \
  -f docker-compose.staging.galaxyfreedom.com.yml \
  -p frontend-staging-galaxyfreedom \
  up -d --build