FROM node:alpine
WORKDIR /app
RUN npm i npx
COPY ./tsconfig.json .
COPY ./tsconfig.test.json .
COPY ./package.json .
RUN npm install
COPY ./src/ ./src
RUN npx tsc
CMD [ "node", "./dist/app.js" ]
