#!/bin/bash

# Check if the network exists
if ! docker network ls | grep -q "modelink-network"; then
  echo "🌐 Creating docker network 'modelink-network'..."
  docker network create modelink-network
else
  echo "✅ Docker network 'modelink-network' already exists."
fi

# Boot the containers using the dev compose file
echo "🚀 Starting Frontend Docker Compose (Local/Dev)..."
MAX_RETRIES=3
RETRY_COUNT=0
SUCCESS=false

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
  if docker compose -f docker-compose.dev.yml up -d --build; then
    SUCCESS=true
    break
  else
    echo "⚠️ Docker Compose failed. Retrying in 10 seconds... ($((RETRY_COUNT + 1))/$MAX_RETRIES)"
    RETRY_COUNT=$((RETRY_COUNT + 1))
    sleep 10
  fi
done

if [ "$SUCCESS" = false ]; then
  echo "❌ Docker Compose failed after $MAX_RETRIES attempts. Stopping deployment."
  exit 1
fi
echo "✅ Frontend Local/Dev Deployment running!"

# ─────────────────────────────────────────────────────────────────────
# Run Bundle Analyzer locally to visualize JS/CSS chunks before any
# major architecture changes
# ─────────────────────────────────────────────────────────────────────
# echo ""
# echo "📊 Running Next.js Bundle Analyzer..."
# npm run analyze
