# syntax=docker/dockerfile:1

# Stage 1: Build cluster bundle
FROM node:26.10.0-alpine3.24 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci
COPY . .
RUN npm run build:cluster

# Stage 2: Serve via NGINX
FROM nginx:1.31.6-alpine3.24-slim

LABEL org.opencontainers.image.title="telark-ui" \
      org.opencontainers.image.licenses="proprietary" \
      org.opencontainers.image.source="https://github.com/telark/dashboard-ui"

RUN rm -f /etc/nginx/conf.d/default.conf \
    && chown -R nginx:nginx \
        /var/cache/nginx \
        /var/log/nginx \
        /etc/nginx \
    && touch /tmp/nginx.pid \
    && chown nginx:nginx /tmp/nginx.pid

COPY --chown=nginx:nginx \
    --from=builder /app/dist /usr/share/nginx/html

COPY --chown=nginx:nginx \
    nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO- http://localhost:8080/healthz || exit 1

USER nginx

CMD ["nginx", "-g", "daemon off;"]