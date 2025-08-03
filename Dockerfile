# ---- Base Stage ----
# Use the official Bun image as the base
FROM oven/bun:1.1.18 as base

# Add ARG instructions for your secrets
ARG NEXT_PUBLIC_UMAMI_WEBSITE_ID
ARG DATABASE_URL
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG CLERK_SECRET_KEY
ARG NEXT_PUBLIC_PRO_MONTHLY_URL
ARG NEXT_PUBLIC_PRO_ANNUALLY_URL
ARG NEXT_PUBLIC_BILLING_PORTAL_URL
ARG STRIPE_SECRET_KEY
ARG STRIPE_WEBHOOK_SECRET
# Set the working directory inside the container
WORKDIR /app

# ---- Dependencies Stage ----
# Use a new stage to install dependencies
FROM base as dependencies

# Copy package.json and bun.lockb to the container
COPY package.json bun.lockb ./

# Install dependencies using Bun
RUN bun install --frozen-lockfile

# ---- Build Stage ----
# Use a new stage to build the application
FROM base as builder

# Copy all the necessary files from the base
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

# Set the environment variables for the build
ENV NEXT_PUBLIC_UMAMI_WEBSITE_ID
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV CLERK_SECRET_KEY=$CLERK_SECRET_KEY
ENV DATABASE_URL=$DATABASE_URL
ENV NEXT_PUBLIC_PRO_MONTHLY_URL=$NEXT_PUBLIC_PRO_MONTHLY_URL
ENV NEXT_PUBLIC_PRO_ANNUALLY_URL=$NEXT_PUBLIC_PRO_ANNUALLY_URL
ENV NEXT_PUBLIC_BILLING_PORTAL_URL=$NEXT_PUBLIC_BILLING_PORTAL_URL
ENV STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY
ENV STRIPE_WEBHOOK_SECRET=$STRIPE_WEBHOOK_SECRET

# Build the Next.js application
RUN bun run build

# Run Prisma migration command to apply the schema to the database
# `prisma migrate deploy` is used for production environments.
# It ensures the database schema is up to date based on the migration files.
RUN bun run prisma migrate deploy

# ---- Production Stage ----
# Use a smaller base image for the final production container
FROM oven/bun:1.1.18

# Set the working directory
WORKDIR /app

# Copy only the necessary files from the builder stage
# This keeps the final image size minimal
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/bun.lockb ./bun.lockb
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

# The port Next.js uses by default
EXPOSE 3000

# Set environment variables for runtime
# These will be provided securely by Cloud Run
ENV NEXT_PUBLIC_UMAMI_WEBSITE_ID
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV CLERK_SECRET_KEY=$CLERK_SECRET_KEY
ENV DATABASE_URL=$DATABASE_URL
ENV NEXT_PUBLIC_PRO_MONTHLY_URL=$NEXT_PUBLIC_PRO_MONTHLY_URL
ENV NEXT_PUBLIC_PRO_ANNUALLY_URL=$NEXT_PUBLIC_PRO_ANNUALLY_URL
ENV NEXT_PUBLIC_BILLING_PORTAL_URL=$NEXT_PUBLIC_BILLING_PORTAL_URL
ENV STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY
ENV STRIPE_WEBHOOK_SECRET=$STRIPE_WEBHOOK_SECRET

# Start the Next.js application in production mode
CMD ["bun", "run", "start"]
