#!/bin/sh
while ! docker info > /dev/null 2>&1; do
    echo "Waiting for Docker daemon to be ready..."
    sleep 3
done
echo "Docker daemon is ready!"
exec node index.js
