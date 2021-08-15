FROM node:10-alpine
WORKDIR /app/
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json .
RUN npm install
RUN npm install -g @angular/cli@10.2.0
COPY . .
