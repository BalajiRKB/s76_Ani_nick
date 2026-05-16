# ── Stage 1: install dependencies ────────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app

# Copy only package file first (better layer caching)
COPY package.json ./
# Use npm install (not npm ci) because server has no package-lock.json committed
RUN npm install --omit=dev

# ── Stage 2: production image ─────────────────────────────────────────────────
FROM node:20-alpine
WORKDIR /app

# Non-root user for security
RUN addgroup -S aninick && adduser -S aninick -G aninick

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Remove dev/test files from final image
RUN rm -rf tests

USER aninick

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
  CMD wget -qO- http://localhost:5000/api/nicknames || exit 1

CMD ["node", "server.js"]
