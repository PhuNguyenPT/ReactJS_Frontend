#!/bin/bash
# docker-build.sh - Build AMD64 with cache (no push)

set -e

IMAGE_NAME="phunpt01/react-frontend"
VERSION="v$(date +%Y%m%d)"
CACHE_DIR="/tmp/docker-cache-frontend"

echo "🏗️  Building React frontend with cache..."
mkdir -p "$CACHE_DIR"

# Build for local testing (amd64)
echo "📦 Building for local testing..."
docker buildx build \
  --platform linux/amd64 \
  -t "$IMAGE_NAME:latest" \
  -t "$IMAGE_NAME:$VERSION" \
  --cache-from type=local,src="$CACHE_DIR" \
  --cache-to type=local,dest="$CACHE_DIR",mode=max \
  --load \
  .

echo "✅ Build complete! Image ready for testing."
echo "📦 Tagged as:"
echo "   - $IMAGE_NAME:latest"
echo "   - $IMAGE_NAME:$VERSION"
echo ""
echo "🧪 To test locally: docker run --rm -p 80:80 $IMAGE_NAME:latest"
echo "🚀 To push: ./scripts/docker-push.sh"