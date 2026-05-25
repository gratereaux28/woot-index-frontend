###################
# BUILD FOR PRODUCTION
###################
FROM node:25 AS build
WORKDIR /usr/src/app

# Copiar archivos necesarios para la instalación de dependencias
COPY --chown=node:node package.json package-lock.json ./

# Instalar dependencias con versiones exactas del lockfile
RUN npm ci

# Copiar el resto del código fuente, incluyendo el directorio src
COPY --chown=node:node . .

# Construir la aplicación
RUN npx modern deploy

###################
# PRODUCTION
###################
FROM node:25-alpine AS runner
WORKDIR /usr/src/app

# Ajusta la zona horaria del servidor a America/Santo_Domingo
RUN apk add --no-cache tzdata
ENV TZ=America/Santo_Domingo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Copiar solo los archivos necesarios desde la etapa de construcción
COPY --chown=node:node --from=build /usr/src/app/.output .output

# Especificar un usuario no root para ejecutar la aplicación
USER node

CMD ["node", ".output/index"]