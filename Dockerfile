# ---- Base Stage ----
FROM oven/bun:1.1.18 AS base
WORKDIR /app

# ---- Build Stage ----
FROM base AS builder

# Set ARG and ENV
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

# Copy project files
COPY bun.lockb package.json ./
RUN bun install --frozen-lockfile

COPY . .

# Prisma and build steps
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

# Runtime ENV (injected by Cloud Run)
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

CMD ["bun", "run", "start"]
