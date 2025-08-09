# ---- Base build stage ----
FROM node:20-slim AS build

# Install system deps (for Prisma + OpenSSL)
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

# Copy only package files & prisma schema first (better cache)
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies (no package-lock.json, so npm install)
RUN npm install

# Generate Prisma Client
RUN npx prisma generate

# Copy the rest of the application
COPY . .

# Build TypeScript
RUN npm run build

# ---- Production stage ----
FROM node:20-slim AS production

# Install system deps for runtime
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy node_modules, prisma client, and build output from build stage
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/dist ./dist
COPY package*.json ./

# Run Prisma migrations at container startup
CMD npx prisma migrate deploy && node dist/index.js
