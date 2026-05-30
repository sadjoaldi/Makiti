# Makiti

Marketplace de petites annonces pour la Guinée. Achetez et vendez facilement : véhicules, immobilier, électronique, mode et plus encore.

## Stack technique

**Backend**

- NestJS (Node.js)
- PostgreSQL + Prisma 7
- JWT + bcrypt pour l'authentification
- OTP par SMS (Africa's Talking)
- Cloudinary pour le stockage des images

**Frontend**

- Next.js 16 (App Router)
- TanStack Query (server state) + Zustand (UI state)
- Tailwind CSS v4 + shadcn/ui
- Mobile-first, responsive desktop

**Infrastructure**

- Monorepo pnpm
- Docker + Docker Compose
- CI GitHub Actions (lint + build)

## Prérequis

- Node.js 20+
- pnpm 9+
- Docker & Docker Compose

## Installation

```bash
# Cloner le repo
git clone <repo-url>
cd Makiti

# Installer les dépendances (monorepo)
pnpm install
```

## Variables d'environnement

Copier les fichiers d'exemple et les remplir :

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

**Backend** (`backend/.env`)

- `DATABASE_URL` — connexion PostgreSQL
- `JWT_SECRET` — secret pour les tokens JWT
- `JWT_EXPIRES_IN` — durée de validité (ex: `7d`)
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `AT_API_KEY`, `AT_USERNAME` — Africa's Talking (SMS)
- `ADMIN_EMAIL`, `ADMIN_PHONE`, `ADMIN_PASSWORD` — compte admin du seed

**Frontend** (`frontend/.env.local`)

- `NEXT_PUBLIC_API_URL` — URL de l'API (ex: `http://localhost:3001/api/v1`)
- `NEXT_PUBLIC_SITE_URL` — URL du site (pour le SEO)

## Développement

Le projet utilise 3 terminaux en développement :

```bash
# Terminal 1 — Base de données (PostgreSQL via Docker)
pnpm dev:db

# Terminal 2 — Backend
pnpm dev:backend

# Terminal 3 — Frontend
pnpm dev:frontend
```

Préparer la base de données (première fois) :

```bash
pnpm dlx prisma migrate dev   # applique les migrations
pnpm seed                     # catégories + compte admin
```

### Accès

- Frontend : http://localhost:3000
- Backend API : http://localhost:3001/api/v1
- Swagger (dev) : http://localhost:3001/api/docs

### Test sur mobile (réseau local)

```bash
cd frontend
pnpm dev --hostname 0.0.0.0 --port 3000
```

Puis accéder via l'IP locale de la machine (ex: `http://192.168.1.44:3000`). Adapter `NEXT_PUBLIC_API_URL` dans `.env.local` vers la même IP.

## Structure du monorepo

Makiti/
├── backend/ # API NestJS
│ ├── prisma/ # schéma, migrations, seed
│ └── src/ # modules (auth, listings, admin, etc.)
├── frontend/ # App Next.js
│ └── src/
│ ├── app/ # pages (App Router)
│ ├── components/
│ ├── features/ # hooks et composants par domaine
│ ├── services/ # appels API
│ └── store/ # state Zustand
├── docker/ # config nginx
└── docker-compose.\*.yml

## Workflow Git

- Développement sur la branche `develop`
- Merge sur `main` quand stable
- La CI (lint + build) se déclenche sur `main` et `develop`

Messages de commit conventionnels : `feat`, `fix`, `chore`, `refactor`, `ci`.

## Sécurité

Voir [SECURITY.md](./SECURITY.md) pour les vulnérabilités connues et les bonnes pratiques en place.

## Déploiement

> Section à compléter une fois l'infrastructure de production en place.

## Licence

Projet privé — tous droits réservés.

### Staging (local, via Docker)

```bash
pnpm staging        # build + lance la stack staging complète
pnpm staging:down   # arrête la stack staging
```
