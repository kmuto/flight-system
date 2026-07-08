#!/bin/bash
set -e

if [ -z "${MACKEREL_APIKEY}" ]; then
  echo "Error: MACKEREL_APIKEY is not set." >&2
  exit 1
fi

echo "Add delay to backend..."
docker compose exec -it backend tc qdisc add dev eth0 root netem delay 600ms 100ms

docker compose up "$@"
