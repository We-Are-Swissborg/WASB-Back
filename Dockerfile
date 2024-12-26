FROM node:22-alpine

RUN mkdir -p /home/node/wasb-back/node_modules && chown -R node:node /home/node/wasb-back
RUN npm install -g npm@latest

WORKDIR /home/node/wasb-back

COPY package*.json ./

RUN npm install

USER node
COPY --chown=node:node . .

EXPOSE 3000

CMD ["npm", "run", "dev"]