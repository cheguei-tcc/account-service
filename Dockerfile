FROM node:alpine

WORKDIR /app

COPY . .

RUN npm ci --production && npm i @nestjs/cli

RUN npm run build

EXPOSE 8080

ENTRYPOINT ["npm", "run", "start:prod"]