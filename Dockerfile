# Use the official Bun image
FROM oven/bun:1 as base
WORKDIR /usr/src/app

# Stage 1: Install dependencies
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# Stage 2: Final production image
FROM base AS release
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# 1. Create the directory (if it doesn't exist in your repo)
# 2. Change ownership of the entire app directory to the 'bun' user
USER root
RUN mkdir -p public/photos && chown -R bun:bun /usr/src/app

# Express usually runs on 3000 by default
EXPOSE 3000

# Run the app
USER bun
ENTRYPOINT [ "bun", "run", "index.ts" ]