FROM node:18.12 

WORKDIR /app
COPY package.json package.json
COPY package-lock.json package-lock.json
COPY tsconfig.json tsconfig.json

RUN npm install

COPY src/ src/

CMD ls ; npm run build ; npm start
