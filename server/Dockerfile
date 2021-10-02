# syntax=docker/dockerfile:1

FROM node:15-alpine3.10

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

RUN npm install -g typescript

RUN npm install -g ts-node

COPY . .

EXPOSE 8000

CMD [ "npm", "run", "dev" ]