# syntax=docker/dockerfile:1

# Stage 1: build cluster bundle
FROM node:24-alpine3.23 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci
COPY . .
RUN npm run build:cluster

# Stage 2: serve via nginx
FROM nginx:1.30-alpine3.23

LABEL org.opencontainers.image.title="telark-ui" \
      org.opencontainers.image.licenses="proprietary" \
      org.opencontainers.image.source="https://github.com/telark/dashboard-ui"

RUN chown -R nginx:nginx /var/cache/nginx

COPY --chown=nginx:nginx --from=builder /app/dist /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:8080/healthz || exit 1

USER nginx

CMD ["nginx", "-g", "daemon off;"]