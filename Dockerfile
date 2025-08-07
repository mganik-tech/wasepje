# ---- Base Stage ----
FROM oven/bun:1.1.18 AS base
WORKDIR /app

# ---- Build Stage ----
FROM base AS builder

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

# Copy full source BEFORE install so postinstall scripts work
COPY . .

# Install dependencies
RUN bun install --frozen-lockfile

# Prisma + Build
RUN bunx prisma generate
RUN bun run build

# ---- Production Stage ----
FROM oven/bun:1.1.18 AS runner
WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/bun.lockb ./bun.lockb
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

CMD ["bun", "run", "start"]
