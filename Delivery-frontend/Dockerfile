FROM node:18-alpine

WORKDIR /app

COPY package.json .

RUN npm install

RUN npm i -g serve

COPY . .

# Sensitive data should be passed securely at runtime
#RUN echo "VITE_GOOGLE_MAPS_API_KEY=$VITE_GOOGLE_MAPS_API_KEY" > .env

RUN npm run build

EXPOSE 3000

CMD ["serve", "-s", "dist"]