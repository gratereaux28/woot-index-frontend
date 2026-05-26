###################
# BUILD FOR PRODUCTION
###################
FROM node:25 AS build
WORKDIR /usr/src/app

# Copy dependency manifests first to improve Docker layer caching.
COPY --chown=node:node package.json package-lock.json ./

# Install exact dependency versions from the lockfile.
RUN npm ci

# Copy the application source.
COPY --chown=node:node . .

# Build the deployable Modern.js output.
RUN npx modern deploy

###################
# PRODUCTION
###################
FROM node:25-alpine AS runner
WORKDIR /usr/src/app

# Set the runtime timezone to America/Santo_Domingo.
RUN apk add --no-cache tzdata
ENV TZ=America/Santo_Domingo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Copy only the production output from the build stage.
COPY --chown=node:node --from=build /usr/src/app/.output .output

# Run as a non-root user.
USER node

CMD ["node", ".output/index"]
