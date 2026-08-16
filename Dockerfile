FROM node:20-alpine AS builder

WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/server/node_modules ./server/node_modules
COPY server ./server
COPY client ./client

EXPOSE 5050
EXPOSE 5173

CMD ["node", "server/src/index.js"]
