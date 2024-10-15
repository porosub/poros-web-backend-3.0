FROM node:lts-alpine3.19 AS base

FROM base as deps
WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install --omit=dev

FROM base as runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
adduser --system --uid 1001 expressjs

COPY --from=deps /app/node_modules ./node_modules
COPY . .

USER expressjs

EXPOSE 3000
ENV APP_PORT=3000

CMD ["app.js"]
