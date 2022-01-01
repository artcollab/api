FROM node:17.3.0-bullseye
RUN mkdir /api
COPY * /api
COPY .* /api
WORKDIR /api
RUN npm install --quiet
CMD npm start