# Cloud-Frontend/Dockerfile

# 1) Build stage
FROM node:18-alpine AS builder
WORKDIR /app

# Copier manifestes puis installer prod+dev
COPY Cloud-Frontend/package.json Cloud-Frontend/package-lock.json ./
RUN npm ci

# Copier le code et builder Next.js
COPY Cloud-Frontend/ ./
RUN npm run build

# 2) Runtime stage
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copier les artefacts de build
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

# Installer seulement les deps prod
RUN npm ci --omit=dev

EXPOSE 3000
CMD ["npm", "run", "start"]

