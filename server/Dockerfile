FROM node:15-alpine3.10

RUN npm --version

ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

RUN npm install -g typescript

RUN npm install -g ts-node


# RUN npm install --production

COPY . /app

# For development
# CMD [ "ts-node-dev --respawn --pretty --transpile-only src/index.ts"]
# For production
CMD [ "ts-node", "./src/index.ts" ]