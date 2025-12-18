FROM node:22.17.0 AS builder

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

# Copy source code
COPY . .

# Build Next.js
RUN npm run build

# Stage produksi
FROM node:22.17.0 AS runner

WORKDIR /usr/src/app

# Salin hanya kebutuhan runtime
COPY package.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/next.config.mjs ./next.config.mjs

EXPOSE 3000

CMD ["npm", "run", "start"]
