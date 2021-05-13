FROM node:15.12.0-alpine

WORKDIR /frontend

ENV PATH /frontend/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent

CMD ["npm", "start"]
