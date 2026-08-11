#!/bin/bash
# SessionStart hook for Claude Code on the web (remote sessions).
# Prepares a full local dev environment mirroring the Railway template:
# PostgreSQL + Redis (system services stand in for the Railway plugins),
# installs backend/storefront dependencies, creates .env files and
# initializes (migrates + seeds) the database on first run.
set -euo pipefail

# Only run in remote (Claude Code on the web) sessions.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

REPO="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "$0")/../.." && pwd)}"
DB_URL="postgres://postgres:postgres@localhost:5432/medusa"

log() { echo "[session-start] $*"; }

# --- PostgreSQL -------------------------------------------------------------
if command -v pg_lsclusters >/dev/null 2>&1; then
  if pg_lsclusters | grep -q "down"; then
    pg_ctlcluster 16 main start || log "WARN: could not start postgres cluster"
  fi
  if pg_lsclusters | grep -q "online"; then
    su postgres -c "psql -c \"ALTER USER postgres PASSWORD 'postgres';\"" >/dev/null
    if ! su postgres -c "psql -tAc \"SELECT 1 FROM pg_database WHERE datname='medusa'\"" | grep -q 1; then
      su postgres -c "createdb medusa"
      log "created database 'medusa'"
    fi
  fi
else
  log "WARN: postgres not found - backend needs DATABASE_URL pointed elsewhere"
fi

# --- Redis ------------------------------------------------------------------
if command -v redis-server >/dev/null 2>&1; then
  # --save '' disables RDB snapshots so no dump.rdb lands in the repo
  redis-cli ping >/dev/null 2>&1 || (cd /tmp && redis-server --daemonize yes --port 6379 --save '')
else
  log "WARN: redis not found - backend will fall back to simulated redis"
fi

# --- Env files --------------------------------------------------------------
if [ ! -f "$REPO/backend/.env" ]; then
  # Base on the template, but enable redis and strip the inline comment from
  # DATABASE_URL (dotenv would otherwise keep trailing text in the value).
  sed -e 's|^# REDIS_URL=redis://localhost:6379.*|REDIS_URL=redis://localhost:6379|' \
      -e "s|^DATABASE_URL=.*|DATABASE_URL=$DB_URL|" \
      "$REPO/backend/.env.template" > "$REPO/backend/.env"
  log "created backend/.env"
fi

if [ ! -f "$REPO/storefront/.env.local" ]; then
  cp "$REPO/storefront/.env.local.template" "$REPO/storefront/.env.local"
  log "created storefront/.env.local"
fi

# --- Dependencies -----------------------------------------------------------
if ! command -v pnpm >/dev/null 2>&1; then
  npm install -g pnpm@10 >/dev/null 2>&1 || corepack enable
fi

log "installing backend dependencies..."
(cd "$REPO/backend" && pnpm install --reporter=append-only 2>&1 | tail -2)

log "installing storefront dependencies..."
(cd "$REPO/storefront" && pnpm install --reporter=append-only 2>&1 | tail -2)

# --- Database init (migrate + seed + admin user) ----------------------------
# Only on first run: skip if the seeded publishable api key already exists.
if command -v psql >/dev/null 2>&1 && pg_lsclusters 2>/dev/null | grep -q "online"; then
  if ! PGPASSWORD=postgres psql -h localhost -U postgres -d medusa -tAc \
      "SELECT 1 FROM information_schema.tables WHERE table_name='api_key'" 2>/dev/null | grep -q 1; then
    log "initializing database (migrations + seed), this takes a few minutes..."
    (cd "$REPO/backend" && pnpm ib 2>&1 | tail -3) || log "WARN: pnpm ib failed - run it manually"
  else
    log "database already initialized"
  fi
fi

# next.config.js requires NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY at config-load
# time (next lint / next build). The dev launcher fetches it from the backend
# at runtime; for bare next commands, expose the seeded key through the
# session environment (not the user's .env.local).
if [ -n "${CLAUDE_ENV_FILE:-}" ]; then
  PUB_KEY=$(PGPASSWORD=postgres psql -h localhost -U postgres -d medusa -tAc \
    "SELECT token FROM api_key WHERE type='publishable' AND revoked_at IS NULL LIMIT 1" 2>/dev/null || true)
  if [ -n "${PUB_KEY:-}" ]; then
    echo "export NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=$PUB_KEY" >> "$CLAUDE_ENV_FILE"
  fi
fi

log "done. Start dev servers with: (backend) pnpm dev -> :9000, (storefront) pnpm dev -> :8000"
