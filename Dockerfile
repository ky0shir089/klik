FROM node:22.17.0 AS builder
WORKDIR /usr/src/app

# Terima argumen dari GitHub Action
ARG NEXT_PUBLIC_BASE_URL
ARG API_URL
ARG KLIK_API_TOKEN

# Set sebagai Environment Variable agar terbaca saat 'npm run build'
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
ENV API_URL=$API_URL
ENV KLIK_API_TOKEN=$KLIK_API_TOKEN

COPY package.json ./
RUN npm install
COPY . .

RUN npm run build

# --- Stage runner tetap sama ---
FROM node:22.17.0 AS runner
WORKDIR /usr/src/app

COPY package.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/next.config.ts ./next.config.ts

EXPOSE 3000

CMD ["npm", "run", "start"]
