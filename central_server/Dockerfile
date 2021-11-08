FROM node

WORKDIR /central-server

COPY package*.json ./

RUN yarn

COPY . .

EXPOSE 3000

CMD [ "yarn", "start" ]
