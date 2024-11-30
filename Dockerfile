# Build stage
FROM node:19-alpine

WORKDIR /yesnaga
RUN apk update && apk upgrade && apk add --no-cache g++ make python3

COPY ./package.json .
COPY ./package-lock.json .

ENV NODE_ENV=production
RUN npm ci


# Run stage
FROM node:19-alpine

WORKDIR /yesnaga

COPY --from=0 /yesnaga .
COPY . .

EXPOSE 3000
CMD npm start
