FROM node:20-slim

RUN apt-get update && apt-get install -y openssl

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install
RUN pnpm add typescript

COPY . .

RUN pnpm build

CMD ["pnpm", "start"]
