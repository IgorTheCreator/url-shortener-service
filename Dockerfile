FROM node:latest

WORKDIR /usr/src/app/

COPY package.json .
COPY package-lock.json .

RUN npm ci

COPY . .

RUN npx prisma generate
RUN npm run build

CMD [ "node", "dist/main.js" ]
