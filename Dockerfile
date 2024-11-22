FROM oven/bun:alpine
WORKDIR /app
RUN bun add -g pm2
COPY package.json .
COPY bun.lockb .
RUN bun install
COPY . .
RUN bun build:dev
EXPOSE ${PORT}
CMD ["bun", "serve"]