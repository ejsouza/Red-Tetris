FROM node:15-alpine3.10

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

COPY . /app

CMD ["npm",  "start"]