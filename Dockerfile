# ==============================================================================
# DriveIT Production Multi-Stage Container Dockerfile
# Stage 1: Build Optimized Frontend Client (Vite React SPA)
# Stage 2: Production Server Runner (Node.js + Express + Prisma + Socket.io)
# ==============================================================================

# --- Stage 1: Client Build ---
FROM node:20-alpine AS client-builder
WORKDIR /app/client

# Install client dependencies
COPY client/package*.json ./
RUN npm ci

# Copy client source & compile production bundle
COPY client/ ./
RUN npm run build

# --- Stage 2: Production Server Runner ---
FROM node:20-alpine AS runner
WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV PORT=5050

# Install server dependencies
COPY server/package*.json ./server/
RUN cd server && npm ci --only=production

# Copy Prisma schema and generate client
COPY server/prisma ./server/prisma
RUN cd server && npx prisma generate

# Copy server application code
COPY server/ ./server/

# Copy compiled frontend from Stage 1 into server public directory
COPY --from=client-builder /app/client/dist ./server/public

# Expose backend port
EXPOSE 5050

# Health check probe
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5050/api/health || exit 1

# Start production server
WORKDIR /app/server
CMD ["node", "src/index.js"]
