FROM node:14.18.1-alpine3.13

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4000-5000:4000-5000
EXPOSE 21:21

CMD [ "npm", "run", "start"]