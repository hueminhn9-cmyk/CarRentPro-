FROM node:22-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma

RUN npm ci

COPY src ./src

# Generate Prisma client and compile TypeScript
RUN npx prisma generate
RUN npm run build

# Remove development dependencies
RUN npm prune --production

FROM node:22-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/swagger ./swagger

EXPOSE 5000

ENV PORT=5000
ENV NODE_ENV=production

CMD ["node", "dist/app.js"]
