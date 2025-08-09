# ---- Build stage ----
FROM node:20-slim AS build
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
RUN npm install
RUN npx prisma generate

COPY . .

# Accept env vars at build time
ARG DATABASE_URL
ARG NEXT_PUBLIC_PRO_MONTHLY_URL
ARG NEXT_PUBLIC_PRO_ANNUALLY_URL
ARG NEXT_PUBLIC_BILLING_PORTAL_URL

# Export them for Next.js build validation
ENV DATABASE_URL=${DATABASE_URL}
ENV NEXT_PUBLIC_PRO_MONTHLY_URL=${NEXT_PUBLIC_PRO_MONTHLY_URL}
ENV NEXT_PUBLIC_PRO_ANNUALLY_URL=${NEXT_PUBLIC_PRO_ANNUALLY_URL}
ENV NEXT_PUBLIC_BILLING_PORTAL_URL=${NEXT_PUBLIC_BILLING_PORTAL_URL}

RUN npm run build

# ---- Production stage ----
FROM node:20-slim
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app
COPY --from=build /app ./
EXPOSE 8080

CMD ["npm", "start"]
