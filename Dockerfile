FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN apk add --no-cache git \
    && yarn install \
    && yarn cache clean

COPY . .
RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]