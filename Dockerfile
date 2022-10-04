FROM node:18.5.0

WORKDIR /app

COPY . .

RUN npm ci --production && npm i @nestjs/cli

RUN npm run build

ENTRYPOINT ["npm", "run", "start:prod"]