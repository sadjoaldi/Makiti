# ─── Builder ──────────────────────────────────────────────
FROM node:20-alpine AS builder
RUN npm install -g pnpm
WORKDIR /app

# Copie les manifests du monorepo (depuis la racine)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/

# Installe uniquement les deps du backend
RUN pnpm install --frozen-lockfile --filter backend

# Copie le code du backend
COPY backend ./backend

# Build
WORKDIR /app/backend
RUN pnpm dlx prisma generate
RUN pnpm build

# ─── Runner ───────────────────────────────────────────────
FROM node:20-alpine AS runner
RUN npm install -g pnpm
WORKDIR /app

ENV NODE_ENV=production

# Manifests pour install prod
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
RUN pnpm install --prod --frozen-lockfile --filter backend

# Artefacts du build
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/node_modules/.prisma ./backend/node_modules/.prisma
COPY --from=builder /app/backend/prisma ./backend/prisma

# Utilisateur non-root
RUN addgroup -g 1001 nodejs && adduser -u 1001 -G nodejs -S nestjs
USER nestjs

WORKDIR /app/backend
EXPOSE 3001

# Migrations + démarrage
CMD ["sh", "-c", "pnpm dlx prisma migrate deploy && node dist/src/main"]