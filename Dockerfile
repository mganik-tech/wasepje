# ---- 1. Builder Stage ----
FROM oven/bun:1.1 AS builder

WORKDIR /app

# Copy dependency and config files first (for better caching)
COPY package.json bun.lockb bunfig.toml tsconfig.json next.config.mjs ./
COPY prisma ./prisma
COPY public ./public
COPY src ./src

# Install dependencies and build
RUN bun install --frozen-lockfile
RUN bun run build

# ---- 2. Runtime Stage ----
FROM oven/bun:1.1-slim AS runner

WORKDIR /app

# Copy build output and minimal runtime deps
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/bun.lockb ./bun.lockb
COPY --from=builder /app/bunfig.toml ./bunfig.toml
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/prisma ./prisma

# Set runtime environment
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Run Prisma migrations before starting Next.js
CMD bunx prisma migrate deploy && bun start
