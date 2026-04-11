#!/usr/bin/env bash
# QuantumBallot web-frontend build helper
# Run this if `npm run build` hits an out-of-memory error

export NODE_OPTIONS="--max-old-space-size=4096"
npx vite build
