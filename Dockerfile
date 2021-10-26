FROM node:14.18.1-alpine3.13

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 21
CMD [ "npm", "run", "start"]