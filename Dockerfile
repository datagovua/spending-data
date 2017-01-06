FROM node:4-alpine

RUN apk --update add python make g++
RUN npm install -g yarn

RUN apk --update add tini
ENTRYPOINT ["/sbin/tini", "--"]
