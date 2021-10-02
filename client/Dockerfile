# syntax=docker/dockerfile:1

FROM node:15-alpine3.10

WORKDIR /app

RUN apk --no-cache add curl

COPY ["package.json", "yarn.lock", "./"]

RUN yarn add typescript

RUN yarn add ts-node

RUN yarn && yarn cache clean

COPY . .

EXPOSE 3000

CMD [ "yarn", "dev" ]