#!/bin/bash
# docker-push.sh - Build and push multi-arch (AMD64, ARM64)

set -e

# --- Configuration ---
IMAGE_NAME="phunpt01/react-frontend"
VERSION="v$(date +%Y%m%d)"
CACHE_DIR="/tmp/docker-cache-frontend" # Define the cache directory
PLATFORMS="linux/arm64,linux/amd64"
# --- End Configuration ---

echo "🚀 Starting multi-arch build and push for:"
echo "   - $IMAGE_NAME:latest"
echo "   - $IMAGE_NAME:$VERSION"
echo ""

echo "🔧 Ensuring multi-arch builder is active..."
# Check if mybuilder exists and is usable
BUILDER_EXISTS=false
if docker buildx inspect mybuilder >/dev/null 2>&1; then
    BUILDER_EXISTS=true
fi

if [ "$BUILDER_EXISTS" = false ]; then
    echo "📦 Creating buildx builder..."
    docker buildx create --name mybuilder --driver docker-container --use --bootstrap
else
    echo "📦 Using existing buildx builder..."
    docker buildx use mybuilder
fi

echo "📦 Building and pushing for linux/arm64 and linux/amd64..."
# Build for both ARM64 and AMD64, then push
# It now uses the local cache (CACHE_DIR) AND writes cache inline.
docker buildx build \
  --platform "$PLATFORMS" \
  -t "$IMAGE_NAME:latest" \
  -t "$IMAGE_NAME:$VERSION" \
  --cache-from type=local,src="$CACHE_DIR" \
  --push \
  --cache-to type=inline \
  .

echo "✅ Push complete!"
echo "📦 Images pushed to Docker Hub:"
echo "   - $IMAGE_NAME:latest"
echo "   - $IMAGE_NAME:$VERSION"