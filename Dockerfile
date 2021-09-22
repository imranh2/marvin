#What image should our image be based off of?
FROM node:10

RUN mkdir -p /opt/nodeapp/node_modules && chown -R node:node /opt/nodeapp

WORKDIR /opt/nodeapp

COPY package.json ./
COPY npm-shrinkwrap.json ./

USER node

RUN npm ci --only=production

COPY --chown=node:node . .

#Chnage this if you want a different file to be run first instead
CMD [ "node", "index.js" ]
