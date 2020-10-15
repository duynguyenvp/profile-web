#!/bin/sh
if [ $(docker ps -f name=blue -q) ]; then
  NEW="green"
  OLD="blue"
else
  NEW="blue"
  OLD="green"
fi

echo "Pulling latest image"
docker-compose pull

echo "Stopping "$OLD" container"
docker-compose --project-name=$OLD stop

echo "Starting "$NEW" container"
docker-compose --project-name=$NEW up -d

echo "Waiting..."
sleep 5s

if [ $(docker ps -f name=black -q) ]; then
  NODENEW="red"
  NODEOLD="black"
else
  NODENEW="black"
  NODEOLD="red"
fi

echo "Stopping "$NODEOLD" container"
docker-compose --project-name=$NODEOLD -f docker-compose.node.yml stop

echo "Starting "$NODENEW" container"
docker-compose --project-name=$NODENEW -f docker-compose.node.yml up -d