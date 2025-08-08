#!/bin/bash

# Simple script to update Docker container
echo "Pulling latest image..."
sudo docker pull phunpt01/nodejs:frontend-latest

echo "Stopping and removing container..."
sudo docker-compose stop frontend
sudo docker-compose rm -f frontend

echo "Starting container with new image..."
sudo docker-compose up -d frontend
sudo docker image prune -f

echo "Done! Container updated successfully."

# Show status
sudo docker-compose ps frontend