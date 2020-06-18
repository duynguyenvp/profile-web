FROM node:current-alpine as build-deps
WORKDIR /tmp
COPY . .
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh
RUN npm install && npm audit fix && npm run publish

FROM node:current-alpine
RUN set -x \
    && apk update \
    && apk upgrade \
    && apk add --no-cache \
    udev \
    ttf-freefont
WORKDIR /app
COPY --from=build-deps /tmp/package.json .
COPY --from=build-deps /tmp/node_modules/ ./node_modules/
COPY --from=build-deps /tmp/Published/Client .
EXPOSE 8080
CMD ["node", "server.js"]