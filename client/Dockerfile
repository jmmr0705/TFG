FROM node:16-alpine

RUN mkdir -p /app
WORKDIR /app

COPY package.json package-lock.json /app/
RUN npm install

COPY . /app

CMD ["npm", "start"]
