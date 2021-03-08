FROM node:15-alpine3.10

ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install -g typescript

RUN npm install -g ts-node


RUN npm install --production

COPY . .

CMD [ "ts-node", "index.ts" ]