FROM oven/bun:alpine
WORKDIR /app
COPY package.json .
COPY bun.lockb .
RUN bun install
COPY . .
RUN bun build:dev
EXPOSE 8000
CMD ["bun", "serve"]