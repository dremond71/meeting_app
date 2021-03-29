FROM node:12.18-alpine
WORKDIR /usr/src/app
COPY ["package.json","package-lock.json","./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 3001
CMD ["node", "server.js"]