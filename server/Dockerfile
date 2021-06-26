FROM node:14-alpine

LABEL maintainer="reachout@krishansaini.com"

WORKDIR /app

COPY ./package*.json ./

RUN npm i

EXPOSE 80

COPY . /app

CMD npm start
