#!/bin/bash
# docker-build-galaxy-dual.sh - Build two tags (latest and date-version) locally with cache (no push)
set -e

IMAGE_NAME="phunpt01/react-frontend"
LATEST_TAG="galaxyfreedom.com-latest"
DATE_TAG="galaxyfreedom.com-v$(date +%Y%m%d)"
# Absolute path to your specific Dockerfile
DOCKERFILE="/home/phunpt/ReactJS_Frontend/Dockerfile-galaxyfreedom.com"
# Using a separate cache directory to prevent layer conflicts with the main build
CACHE_DIR="/tmp/docker-cache-frontend-galaxy"

echo "🏗️  Building React frontend with two tags:"
echo "    - $LATEST_TAG (latest)"
echo "    - $DATE_TAG (versioned)"

mkdir -p "$CACHE_DIR"

# Build for local testing (amd64) using specific Dockerfile
# The build output is tagged with BOTH the latest and the date-version tag.
docker buildx build \
  --platform linux/amd64 \
  -f "$DOCKERFILE" \
  -t "$IMAGE_NAME:$LATEST_TAG" \
  -t "$IMAGE_NAME:$DATE_TAG" \
  --cache-from type=local,src="$CACHE_DIR" \
  --cache-to type=local,dest="$CACHE_DIR",mode=max \
  --load \
  .

echo "✅ Build complete! Image ready for testing."
echo "📦 Tagged as:"
echo " - $IMAGE_NAME:$LATEST_TAG"
echo " - $IMAGE_NAME:$DATE_TAG"
echo ""
echo "🧪 To test locally (using the latest tag): docker run --rm -p 80:80 $IMAGE_NAME:$LATEST_TAG"