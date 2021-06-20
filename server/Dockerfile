FROM node:14-alpine as builder

LABEL maintainer="reachout@krishansaini.com"

COPY ./package*.json ./

RUN npm ci

FROM node:14-alpine

EXPOSE 80

WORKDIR /app

COPY --from=builder node_modules node_modules
COPY . /app

RUN npm -g install kill-port

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

CMD /wait && npm start
