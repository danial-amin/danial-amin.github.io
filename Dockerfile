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

# The Astro Node adapter bundles its own dependencies into dist/server, so the
# runtime image needs nothing from node_modules. Previously this installed deps
# to run `serve dist`; the site now runs a real server because /api/unlock has
# to check the passphrase somewhere the client cannot see.
COPY --from=build /app/dist ./dist

EXPOSE 3000

# LOCKED_CASES_PASSPHRASE (or LOCKED_CASES_PASS_HASH) must be set in the
# environment. Without it /api/unlock returns 503 and the confidential cases
# are simply unreachable — it never falls back to a guessable default.
CMD ["node", "./dist/server/entry.mjs"]
