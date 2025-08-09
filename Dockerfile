# -------------------------
# Stage 1: Builder
# -------------------------
FROM oven/bun:1 AS builder
WORKDIR /app

# Copy dependency & config files first
COPY package.json bun.lockb tsconfig.json next.config.mjs ./
COPY prisma ./prisma
COPY public ./public
COPY src ./src

# Install dependencies & build
RUN bun install --frozen-lockfile
RUN bun run build

# -------------------------
# Stage 2: Runner
# -------------------------
FROM oven/bun:1 AS runner
WORKDIR /app

# Copy built app & node_modules from builder
COPY --from=builder /app ./

# Ensure Prisma Client is generated
RUN bunx prisma generate

# Run Prisma migrations before start
CMD ["sh", "-c", "bunx prisma migrate deploy && bun run start"]
