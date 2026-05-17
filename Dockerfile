FROM node:18-alpine
WORKDIR /usr/src/app
COPY server/package*.json ./
RUN npm install
COPY server ./server
COPY client ./client
EXPOSE 5000
CMD ["node", "server/server.js"]