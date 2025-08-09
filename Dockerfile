# Use official Node.js LTS image
FROM node:20-slim AS builder

# Install dependencies for Prisma (OpenSSL, etc.)
RUN apt-get update -y && apt-get install -y openssl

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Generate Prisma Client
RUN npx prisma generate

# Copy application source
COPY . .

# Build TypeScript
RUN npm run build

# Run Prisma migrations at build time (optional)
# If you want to run them at container startup instead, remove this line
RUN npx prisma migrate deploy

# -------- Runtime Stage --------
FROM node:20-slim AS runner

# Install OpenSSL in runtime image
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy built files from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY package*.json ./

# Environment
ENV NODE_ENV=production
ENV PORT=8080

# Expose the port Cloud Run expects
EXPOSE 8080

# Start app
CMD ["node", "dist/index.js"]
