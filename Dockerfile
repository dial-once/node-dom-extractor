FROM dialonce/nodejs:latest

RUN apk add --no-cache make && \
  mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json package.json

RUN npm i --production

COPY . .

EXPOSE 3000

CMD ["make", "run"]
