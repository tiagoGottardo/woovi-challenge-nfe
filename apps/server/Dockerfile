FROM node:20-slim

RUN apt-get update && apt-get install -y openssl

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install

COPY . .

RUN pnpm build

CMD ["pnpm", "start"]
