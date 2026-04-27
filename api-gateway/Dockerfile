# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# Stage 2: Production
FROM node:18-alpine

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY package*.json ./

RUN npm ci --omit=dev --legacy-peer-deps

COPY --from=builder /usr/src/app/dist ./dist

CMD ["node", "dist/main"]