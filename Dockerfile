FROM node:20-alpine
WORKDIR /project
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "test"]