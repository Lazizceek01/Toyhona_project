FROM node:20-alpine AS base
WORKDIR /app

COPY package.json package-lock.json* ./
COPY apps/frontend/package.json apps/frontend/package.json
COPY packages/shared/package.json packages/shared/package.json
RUN npm install

COPY . .
RUN npm run build --workspace @toyxona/frontend

EXPOSE 3000
CMD ["npm", "run", "start", "--workspace", "@toyxona/frontend"]
