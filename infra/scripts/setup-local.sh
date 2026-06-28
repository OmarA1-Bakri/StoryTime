#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."
docker compose up -d redis livekit minio

echo "StoryTime local services are starting."
echo "LiveKit: http://localhost:7880"
echo "MinIO: http://localhost:9001"
