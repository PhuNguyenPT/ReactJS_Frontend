#!/bin/bash

# Enable Docker buildx (multi-platform builds)
docker buildx create --use --name multiarch-builder 2>/dev/null || docker buildx use multiarch-builder

# Build for both ARM64 and AMD64, then push
docker buildx build \
  --platform linux/arm64,linux/amd64 \
  -t phunpt01/react-frontend:latest \
  --push \
  .