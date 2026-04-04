#!/usr/bin/env bash
# QuantumBallot Docker Setup Script
# Creates required directories and secret files for local development

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "==> Creating data directories..."
mkdir -p "${SCRIPT_DIR}/data/postgres"
mkdir -p "${SCRIPT_DIR}/data/redis"
mkdir -p "${SCRIPT_DIR}/data/prometheus"
mkdir -p "${SCRIPT_DIR}/data/grafana"

echo "==> Creating secrets directory..."
mkdir -p "${SCRIPT_DIR}/secrets"
chmod 700 "${SCRIPT_DIR}/secrets"

generate_secret() {
  local file="$1"
  local length="${2:-32}"
  if [ ! -f "${file}" ]; then
    openssl rand -base64 "${length}" | tr -d '\n' > "${file}"
    chmod 600 "${file}"
    echo "    Created: ${file}"
  else
    echo "    Exists:  ${file} (skipped)"
  fi
}

echo "==> Generating secrets..."
generate_secret "${SCRIPT_DIR}/secrets/postgres_password.txt" 32
generate_secret "${SCRIPT_DIR}/secrets/redis_password.txt" 32
generate_secret "${SCRIPT_DIR}/secrets/jwt_secret.txt" 64

if [ ! -f "${SCRIPT_DIR}/.env" ]; then
  cp "${SCRIPT_DIR}/.env.example" "${SCRIPT_DIR}/.env"
  echo "==> Created .env from .env.example — review and update before use."
fi

echo ""
echo "Setup complete. Run the following to start:"
echo "  cd ${SCRIPT_DIR} && docker compose up -d"
