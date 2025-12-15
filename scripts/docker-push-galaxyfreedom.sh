#!/bin/bash
# docker-push-galaxy.sh - Build and push Galaxy tags (Multi-arch)
set -e

# --- Configuration ---
IMAGE_NAME="phunpt01/react-frontend"
LATEST_TAG="galaxyfreedom.com-latest"
DATE_TAG="galaxyfreedom.com-v$(date +%Y%m%d)"
# Absolute path to your specific Dockerfile
DOCKERFILE="/home/phunpt/ReactJS_Frontend/Dockerfile-galaxyfreedom.com"
# Using the specific galaxy cache directory
CACHE_DIR="/tmp/docker-cache-frontend-galaxy" 
PLATFORMS="linux/arm64,linux/amd64"
# --- End Configuration ---

echo "🚀 Starting multi-arch build and push for Galaxy Freedom:"
echo "   - $IMAGE_NAME:$LATEST_TAG"
echo "   - $IMAGE_NAME:$DATE_TAG"
echo ""

echo "🔧 Ensuring multi-arch builder is active..."
# Enable Docker buildx (multi-platform builds)
if ! docker buildx ls | grep -q "multiarch-builder"; then
    docker buildx create --use --name multiarch-builder
else
    docker buildx use multiarch-builder
fi

echo "📦 Building and pushing for $PLATFORMS..."

# Build for both ARM64 and AMD64, then push
# Note: We use -f to specify the custom Dockerfile
docker buildx build \
  --platform "$PLATFORMS" \
  -f "$DOCKERFILE" \
  -t "$IMAGE_NAME:$LATEST_TAG" \
  -t "$IMAGE_NAME:$DATE_TAG" \
  --cache-from type=local,src="$CACHE_DIR" \
  --push \
  --cache-to type=inline \
  .

echo "✅ Push complete!"
echo "📦 Images pushed to Docker Hub:"
echo "   - $IMAGE_NAME:$LATEST_TAG"
echo "   - $IMAGE_NAME:$DATE_TAG"