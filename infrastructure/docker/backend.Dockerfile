# syntax=docker/dockerfile:1
# Dockerfile for QuantumBallot Backend API
# Implements financial-grade security best practices and compliance requirements

FROM node:20.11.1-alpine3.19 AS builder

ARG BUILD_DATE
ARG VCS_REF
ARG VERSION

LABEL maintainer="QuantumBallot Security Team" \
      org.opencontainers.image.title="QuantumBallot Backend API" \
      org.opencontainers.image.description="Secure backend API for QuantumBallot election platform" \
      org.opencontainers.image.version="${VERSION}" \
      org.opencontainers.image.created="${BUILD_DATE}" \
      org.opencontainers.image.revision="${VCS_REF}" \
      org.opencontainers.image.vendor="QuantumBallot" \
      security.scan.required="true" \
      compliance.level="financial-grade"

RUN apk update && \
    apk upgrade && \
    apk add --no-cache \
        dumb-init \
        ca-certificates \
        tzdata && \
    rm -rf /var/cache/apk/* && \
    addgroup -g 1001 -S nodegroup && \
    adduser -S -D -H -u 1001 -s /sbin/nologin -G nodegroup nodeuser

ENV NODE_ENV=production \
    NODE_PORT=3000 \
    SERVER_PORT=3002 \
    DIR=/usr/app \
    NPM_CONFIG_CACHE=/tmp/.npm \
    NPM_CONFIG_UPDATE_NOTIFIER=false \
    NPM_CONFIG_FUND=false \
    NPM_CONFIG_AUDIT_LEVEL=moderate \
    HELMET_ENABLED=true \
    RATE_LIMIT_ENABLED=true \
    LOG_LEVEL=info \
    LOG_FORMAT=json \
    HEALTH_CHECK_ENABLED=true

WORKDIR ${DIR}
RUN chown -R nodeuser:nodegroup ${DIR}

COPY --chown=nodeuser:nodegroup package*.json ./

USER nodeuser

RUN npm ci --no-optional --no-audit --no-fund && \
    npm cache clean --force

COPY --chown=nodeuser:nodegroup . .

RUN npm run lint && \
    npm run security-audit && \
    npm run build && \
    npm prune --omit=dev && \
    rm -rf src/ tests/ *.ts tsconfig.json .eslintrc.js

FROM node:20.11.1-alpine3.19

ARG BUILD_DATE
ARG VCS_REF
ARG VERSION

LABEL maintainer="QuantumBallot Security Team" \
      org.opencontainers.image.title="QuantumBallot Backend API" \
      org.opencontainers.image.description="Secure backend API for QuantumBallot election platform" \
      org.opencontainers.image.version="${VERSION}" \
      org.opencontainers.image.created="${BUILD_DATE}" \
      org.opencontainers.image.revision="${VCS_REF}" \
      security.scan.required="true" \
      compliance.level="financial-grade"

RUN apk update && \
    apk upgrade && \
    apk add --no-cache \
        dumb-init \
        ca-certificates \
        tzdata \
        curl && \
    rm -rf /var/cache/apk/* && \
    addgroup -g 1001 -S nodegroup && \
    adduser -S -D -H -u 1001 -s /sbin/nologin -G nodegroup nodeuser && \
    rm -rf /usr/share/man/* \
           /usr/share/doc/* \
           /var/cache/apk/* \
           /tmp/* \
           /var/tmp/*

ENV NODE_ENV=production \
    NODE_PORT=3000 \
    SERVER_PORT=3002 \
    DIR=/usr/app \
    NODE_OPTIONS="--max-old-space-size=512 --no-warnings" \
    NODE_DISABLE_COLORS=1 \
    NPM_CONFIG_UPDATE_NOTIFIER=false \
    NPM_CONFIG_FUND=false

WORKDIR ${DIR}
RUN chown -R nodeuser:nodegroup ${DIR} && \
    chmod 750 ${DIR}

USER nodeuser

COPY --from=builder --chown=nodeuser:nodegroup ${DIR}/build ./build
COPY --from=builder --chown=nodeuser:nodegroup ${DIR}/package*.json ./
COPY --from=builder --chown=nodeuser:nodegroup ${DIR}/node_modules ./node_modules

RUN printf '%s\n' \
    "const http = require('http');" \
    "const options = { host: 'localhost', port: process.env.NODE_PORT || 3000, path: '/health', timeout: 2000, method: 'GET' };" \
    "const request = http.request(options, (res) => {" \
    "  if (res.statusCode === 200) { process.exit(0); } else { process.exit(1); }" \
    "});" \
    "request.on('error', () => process.exit(1));" \
    "request.on('timeout', () => { request.destroy(); process.exit(1); });" \
    "request.end();" \
    > /usr/app/healthcheck.js

RUN chmod 644 package*.json && \
    find build -type f -exec chmod 644 {} \; && \
    find build -type d -exec chmod 755 {} \; && \
    chmod 755 healthcheck.js && \
    chmod -R a-w ${DIR}/node_modules

EXPOSE ${NODE_PORT}

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD node /usr/app/healthcheck.js

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "--max-old-space-size=512", "--no-warnings", "build/network.js"]
