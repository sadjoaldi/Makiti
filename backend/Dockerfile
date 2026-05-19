FROM node:20-alpine

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .

RUN pnpm dlx prisma generate

EXPOSE 3001

CMD ["pnpm", "start:dev"]