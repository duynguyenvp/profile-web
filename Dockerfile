FROM node:12.18.1-alpine3.12 as build-deps
WORKDIR /tmp
COPY . .
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh
RUN yarn install && yarn release

FROM node:12.18.1-alpine3.12
ENV CHROME_BIN="/usr/bin/chromium-browser" \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true"
RUN set -x \
    && apk update \
    && apk upgrade \
    && apk add --no-cache \
    udev \
    ttf-freefont \
    chromium
WORKDIR /app
COPY --from=build-deps /tmp/package.json .
COPY --from=build-deps /tmp/build .
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh
RUN yarn install
EXPOSE 8080
CMD ["node", "server.js"]