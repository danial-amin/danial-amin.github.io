FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# The Node adapter does NOT bundle its runtime dependencies — dist/server/entry.mjs
# imports piccolore, cookie, devalue, html-escaper, send, server-destroy,
# unstorage and @astrojs/internal-helpers from node_modules. An earlier version of
# this file copied only dist and asserted otherwise; the container died on
# ERR_MODULE_NOT_FOUND for piccolore. astro is a runtime dependency here, so
# --omit=dev still pulls in everything the entry needs.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/dist ./dist

EXPOSE 3000

# LOCKED_CASES_PASSPHRASE (or LOCKED_CASES_PASS_HASH) must be set in the
# environment. Without it /api/unlock returns 503 and the confidential cases are
# simply unreachable — it never falls back to a guessable default.
CMD ["node", "./dist/server/entry.mjs"]
