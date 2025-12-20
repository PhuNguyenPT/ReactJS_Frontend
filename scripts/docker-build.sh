#!/bin/bash
# docker-build.sh - Build AMD64 locally with cache (no push)

set -e

IMAGE_NAME="phunpt01/react-frontend"
CACHE_DIR="/tmp/docker-cache-frontend"

echo "🏗️  Building React frontend for local testing..."
mkdir -p "$CACHE_DIR"

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

# Build for local testing (amd64) and tag as 'latest'
docker buildx build \
  --platform linux/amd64 \
  -t "$IMAGE_NAME:latest" \
  --cache-from type=local,src="$CACHE_DIR" \
  --cache-to type=local,dest="$CACHE_DIR",mode=max \
  --load \
  .

echo "✅ Build complete! Image ready for testing."
echo "📦 Tagged as:"
echo "   - $IMAGE_NAME:latest"
echo ""
echo "🧪 To test locally: docker run --rm -p 80:80 $IMAGE_NAME:latest"