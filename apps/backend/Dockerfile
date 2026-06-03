FROM node:20-alpine AS base
WORKDIR /app

COPY package.json package-lock.json* ./
COPY apps/backend/package.json apps/backend/package.json
COPY packages/shared/package.json packages/shared/package.json
RUN npm install

COPY . .
RUN npm run build --workspace @toyxona/backend

EXPOSE 4000
CMD ["npm", "run", "start", "--workspace", "@toyxona/backend"]
