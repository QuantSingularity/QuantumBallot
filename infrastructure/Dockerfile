# syntax=docker/dockerfile:1
# QuantumBallot — root Dockerfile
# Delegates to service-specific Dockerfiles under infrastructure/docker/
# Usage:
#   docker build --target backend  -f Dockerfile .
#   docker build --target frontend -f Dockerfile .

# ── Backend ──────────────────────────────────────────────────────────────────
FROM infrastructure/docker/backend.Dockerfile AS backend

# ── Frontend ─────────────────────────────────────────────────────────────────
FROM infrastructure/docker/frontend-web.Dockerfile AS frontend
