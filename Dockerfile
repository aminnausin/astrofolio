# Step 1: Build Astro site
FROM node:24-alpine AS builder
WORKDIR /app

# Install deps (cache layer)
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG DOMAIN
ARG PLAUSIBLE_DOMAIN
ARG RESUME_URL

RUN export BUILT_AT=$(date -u +"%Y-%m-%dT%H:%M:%SZ") \
    && echo "PUBLIC_LAST_MODIFIED=$BUILT_AT" \
    && echo "PUBLIC_LAST_MODIFIED=$BUILT_AT" >> .env \
    && echo "PUBLIC_DOMAIN=$DOMAIN" >> .env && \
    && echo "PUBLIC_PLAUSIBLE_DOMAIN=$PLAUSIBLE_DOMAIN" >> .env && \
    && echo "PUBLIC_RESUME_URL=$RESUME_URL" >> .env

RUN npm run build

# Step 2: Serve with nginx
FROM nginx:alpine-slim
COPY --from=builder /app/dist /usr/share/nginx/html
COPY /docker/etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf
