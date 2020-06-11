FROM node:current-alpine as build-deps
WORKDIR /tmp
COPY . .
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh
RUN npm install && npm audit fix && npm run publish

FROM node:current-alpine
WORKDIR /app
RUN apk update && apk upgrade && \
    apk add --no-cache bash ca-certificates \
                            fonts-liberation \
                            gconf-service \
                            libappindicator1 \
                            libasound2 \
                            libatk-bridge2.0-0 \
                            libatk1.0-0 \
                            libc6 \
                            libcairo2 \
                            libcups2 \
                            libdbus-1-3 \
                            libexpat1 \
                            libfontconfig1 \
                            libgbm1 \
                            libgcc1 \
                            libgconf-2-4 \
                            libgdk-pixbuf2.0-0 \
                            libglib2.0-0 \
                            libgtk-3-0 \
                            libnspr4 \
                            libnss3 \
                            libpango-1.0-0 \
                            libpangocairo-1.0-0 \
                            libstdc++6 \
                            libx11-6 \
                            libx11-xcb1 \
                            libxcb1 \
                            libxcomposite1 \
                            libxcursor1 \
                            libxdamage1 \
                            libxext6 \
                            libxfixes3 \
                            libxi6 \
                            libxrandr2 \
                            libxrender1 \
                            libxss1 \
                            libxtst6 \
                            lsb-release \
                            wget \
                            xdg-utils
COPY --from=build-deps /tmp/package.json .
COPY --from=build-deps /tmp/node_modules/ ./node_modules/
COPY --from=build-deps /tmp/Published/Client .
EXPOSE 80
CMD ["node", "server.js"]