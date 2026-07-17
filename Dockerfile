FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV PORT=3009
EXPOSE 3009
CMD ["node", "index.js"]