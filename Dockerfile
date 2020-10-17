FROM node:lts-alpine
EXPOSE 3000

WORKDIR /yesnaga
RUN apk update && apk upgrade && apk add --no-cache g++ make python

COPY ./package.json .
COPY ./package-lock.json .

RUN npm ci --only=production

COPY . .
CMD npm start
