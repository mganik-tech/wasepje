FROM oven/bun:1 AS builder
WORKDIR /app

# Set dummy values so env validation passes at build time
ENV DATABASE_URL="file:./dev.db"
ENV NEXT_PUBLIC_PRO_MONTHLY_URL="https://example.com/monthly"
ENV NEXT_PUBLIC_PRO_ANNUALLY_URL="https://example.com/annually"
ENV NEXT_PUBLIC_BILLING_PORTAL_URL="https://example.com/billing"

COPY package.json bun.lockb tsconfig.json next.config.mjs ./
COPY prisma ./prisma
COPY public ./public
COPY src ./src

RUN bun install --frozen-lockfile
RUN bun run build

FROM oven/bun:1 AS runner
WORKDIR /app

COPY --from=builder /app ./
RUN bunx prisma generate

CMD ["sh", "-c", "bunx prisma migrate deploy && bun run start"]
