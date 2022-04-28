FROM node:latest

WORKDIR /sdc-q-and-and

ENV NODE_ENV=development

COPY package.json  /sdc-q-and-and

RUN npm install --production

RUN npm install nodemon

COPY . /sdc-q-and-and

EXPOSE 3000

CMD ["npm","run", "dev"]

# CMD ["npm","start"]