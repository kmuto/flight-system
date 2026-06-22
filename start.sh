#!/bin/bash
set -e

if [ -z "${MACKEREL_APIKEY}" ]; then
  echo "Error: MACKEREL_APIKEY is not set." >&2
  exit 1
fi

# Rancher+macOSではLinux VMの時計がホストとずれやすい
# ブラウザ(macOS時計)のスパンとコンテナのスパンの整合性を取るため、
# VM時計をホスト時計に合わせてから起動する
echo "Syncing VM clock to host..."
HOST_TIME=$(python3 -c 'import time; print(int(time.time()))')
docker run --rm --privileged alpine date -s "@${HOST_TIME}"
echo "Done (host time: ${HOST_TIME})."

docker compose up "$@"
