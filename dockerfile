#Linux con una version de node funcional
FROM node:21-alpine3.19

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# RUN npx prisma generate

EXPOSE 3004