# syntax=docker/dockerfile:1

FROM node:15-alpine3.10

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]


RUN yarn add typescript

RUN yarn add ts-node

COPY . .

EXPOSE 3000

CMD [ "yarn", "dev" ]