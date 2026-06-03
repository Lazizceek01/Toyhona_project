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
4. Migration:
   - `npm.cmd run prisma:migrate --workspace @toyxona/backend`
5. Ishga tushirish:
   - Frontend: `npm.cmd run dev:frontend`
   - Backend: `npm.cmd run dev:backend`

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
