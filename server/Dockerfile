FROM node:15-alpine3.10

# ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

RUN npm install -g typescript

RUN npm install -g ts-node

COPY . .

# CMD [ "ts-node", "./src/index.ts" ]
# For production
# CMD [ "npm", "start" ]

CMD [ "npm", "run", "dev" ]