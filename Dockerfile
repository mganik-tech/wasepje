# ---- Build stage ----
FROM node:20-slim AS build
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
RUN npm install
RUN npx prisma generate

COPY . .

# Build-time env vars (valid URLs for Zod validation)
ARG DATABASE_URL="postgresql://user:pass@localhost:5432/dbname"
ARG NEXT_PUBLIC_PRO_MONTHLY_URL="https://example.com/monthly"
ARG NEXT_PUBLIC_PRO_ANNUALLY_URL="https://example.com/annually"
ARG NEXT_PUBLIC_BILLING_PORTAL_URL="https://example.com/billing"

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
