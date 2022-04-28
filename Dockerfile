FROM node:latest

WORKDIR /sdc-q-and-and

COPY package.json  /sdc-q-and-and

RUN npm install

RUN npm install nodemon

COPY . /sdc-q-and-and

EXPOSE 3000

# ENV MONGODB_URL="mongodb://192.168.1.251/test4"

CMD ["npm","start"]