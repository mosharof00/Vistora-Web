#!/usr/bin/env bash
# Dev server without Cursor's local HTTP proxy (it breaks Supabase Auth fetch).
set -euo pipefail
cd "$(dirname "$0")/.."
unset HTTP_PROXY HTTPS_PROXY http_proxy https_proxy ALL_PROXY all_proxy
export NO_PROXY="${NO_PROXY:-127.0.0.1,::1,localhost,.supabase.co}"
export WATCHPACK_POLLING="${WATCHPACK_POLLING:-true}"
export CHOKIDAR_USEPOLLING="${CHOKIDAR_USEPOLLING:-true}"
exec npm run dev -- -H 127.0.0.1 -p "${PORT:-3000}"
