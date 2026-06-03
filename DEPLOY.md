# Deploy qo'llanmasi (Render)

Bu loyiha 3 qismdan iborat: **PostgreSQL bazasi**, **backend** (Fastify API) va **frontend** (Next.js).
Repodagi `render.yaml` shularning hammasini avtomatik yaratadi.

> Eslatma: deploy sizning Render hisobingizga bog'lanadi. Quyidagi qadamlarni o'zingiz bajarasiz.

## 1. Tayyorgarlik
- Kod GitHub'da bo'lsin (`main` branch'ga merge qilingan bo'lsa qulay).
- https://render.com da hisob oching (GitHub bilan kirish mumkin).

## 2. Blueprint orqali yaratish
1. Render dashboard → **New +** → **Blueprint**.
2. `Lazizceek01/Toyhona_project` repozitoriyni tanlang.
3. Render `render.yaml` ni o'qiydi va quyidagilarni ko'rsatadi:
   - `toyxona-db` (PostgreSQL, free)
   - `toyxona-backend` (web service)
   - `toyxona-frontend` (web service)
4. Sizdan to'ldirish so'raladigan o'zgaruvchilar (hozircha bo'sh qoldiring yoki taxminiy yozing, keyin tuzatamiz):
   - `CORS_ORIGIN`, `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_WS_URL`
5. **Apply** bosing. Render bazani, backend va frontendni qura boshlaydi.
   - `DATABASE_URL` avtomatik ulanadi.
   - `JWT_SECRET` avtomatik generatsiya qilinadi.
   - Backend birinchi ishga tushganda migratsiya va seed (test foydalanuvchilar) avtomatik bajariladi.

## 3. URL'larni bir-biriga ulash (muhim)
Render har bir servisga manzil beradi, masalan:
- Backend: `https://toyxona-backend.onrender.com`
- Frontend: `https://toyxona-frontend.onrender.com`

(aniq manzillar dashboard'da ko'rinadi — nomlar band bo'lsa Render qo'shimcha belgi qo'shadi.)

So'ng quyidagilarni to'g'rilang:

**Backend → Environment:**
- `CORS_ORIGIN` = frontend manzili (masalan `https://toyxona-frontend.onrender.com`)

**Frontend → Environment:**
- `NEXT_PUBLIC_API_URL` = backend manzili + `/api` (masalan `https://toyxona-backend.onrender.com/api`)
- `NEXT_PUBLIC_WS_URL` = backend manzili (masalan `https://toyxona-backend.onrender.com`)

O'zgaruvchini saqlasangiz, Render servisni avtomatik qayta deploy qiladi
(frontend `NEXT_PUBLIC_*` qiymatlarni **build paytida** o'qiydi, shuning uchun qayta build bo'lishi shart).

## 4. Tekshirish
- Backend salomatligi: `https://<backend>.onrender.com/api/health` → `{"status":"ok"}` qaytishi kerak.
- Frontend: `https://<frontend>.onrender.com/login`
  - `admin@toyxona.uz` / `123456` → `/admin`
  - Yangi hisob: `/register`

## Eslatmalar
- **Free plan**: servislar bir muncha vaqt ishlatilmasa "uxlab qoladi"; birinchi so'rov sekinroq ochiladi. Free PostgreSQL muddati cheklangan (Render shartlariga qarang).
- Test foydalanuvchilar (parol `123456`): `admin@`, `manager@`, `staff@`, `client@toyxona.uz`.
- Seed har deployda qayta ishlaydi, lekin `upsert` bo'lgani uchun mavjud ma'lumotni buzmaydi.
- Redis ixtiyoriy — kerak bo'lsa `REDIS_URL` qo'shsangiz Socket.IO bir nechta instansiyada ham ishlaydi.
