# Build stage
FROM node:lts-alpine

WORKDIR /yesnaga
RUN apk update && apk upgrade && apk add --no-cache g++ make python

COPY ./package.json .
COPY ./package-lock.json .

RUN npm ci --only=production


# Run stage
FROM node:lts-alpine

WORKDIR /yesnaga

COPY --from=0 /yesnaga .
COPY . .

EXPOSE 3000
CMD npm start
