FROM node:14-alpine

WORKDIR /app

COPY ./app/package*.json .
COPY ./app/tsconfig.json .
COPY ./app/public .
COPY ./app/src .
RUN npm install

EXPOSE 3000
CMD ["npm", "start"]
