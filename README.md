# To'yxona Full Platform

To'liq web platforma:
- `apps/frontend`: Next.js client/admin/staff panel
- `apps/backend`: Fastify API + JWT/RBAC + Socket.IO realtime
- `packages/shared`: umumiy `zod` schema va websocket event contractlar

## Texnologiyalar
- Frontend: Next.js App Router, Tailwind CSS
- Backend: Fastify, Prisma, Socket.IO, Redis adapter
- Database: Remote PostgreSQL (`DATABASE_URL`)

## Tez start
1. `.env.example` dan nusxa olib `.env` yarating va remote PostgreSQL URL kiriting.
2. PowerShell ishlatsangiz:
   - `npm.cmd install`
3. Prisma client:
   - `npm.cmd run prisma:generate --workspace @toyxona/backend`
4. Migration (jadvallarni yaratadi):
   - `npm.cmd run prisma:migrate --workspace @toyxona/backend`
5. Boshlang'ich foydalanuvchilar (seed):
   - `npm.cmd run db:seed --workspace @toyxona/backend`
6. Ishga tushirish:
   - Frontend: `npm.cmd run dev:frontend`
   - Backend: `npm.cmd run dev:backend`

## Autentifikatsiya
- Parollar `bcryptjs` bilan hash qilinadi va foydalanuvchilar PostgreSQL bazasida saqlanadi.
- `POST /api/auth/register` — yangi `client` hisob yaratadi (`email`, `password`, `fullName`, ixtiyoriy `phone`).
- `POST /api/auth/login` — `email` va `password` bilan kirish; rol bazadagi hisobga qarab qaytariladi.
- Seed orqali yaratiladigan test hisoblari (default parol: `123456`):
  - `admin@toyxona.uz` — super_admin
  - `manager@toyxona.uz` — manager
  - `staff@toyxona.uz` — staff
  - `client@toyxona.uz` — client

## Asosiy URL'lar
- Frontend: `http://localhost:3000`
- Backend API health: `http://localhost:4000/api/health`
- Login: `http://localhost:3000/login`
- Panellar: `/booking`, `/admin`, `/staff`

## Realtime eventlar
- `booking:created`
- `booking:status`
- `dashboard:stats`
- `hall:availability`
- `chat:message`
- `notify:push`

## CI va deploy
- GitHub Actions: `.github/workflows/ci.yml`
- Docker: `apps/frontend/Dockerfile`, `apps/backend/Dockerfile`
- Lokal orchestration: `docker-compose.yml`
