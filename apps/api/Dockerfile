FROM node:20-bookworm-slim

WORKDIR /app

RUN apt-get update -y && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json* ./
COPY scripts ./scripts
RUN npm install

COPY . .
# Vendored client has debian-openssl-3.0.x engine (Windows+debian). Never run prisma CLI here —
# it fork-bombs under Docker Desktop on this project.
RUN FORCE_PRISMA_RESTORE=1 node scripts/restore-prisma-client.cjs

EXPOSE 3001

CMD ["node", "scripts/start-render.js"]
