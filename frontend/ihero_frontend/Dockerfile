# pull official base image
FROM node:14.17-alpine

# set working directory
WORKDIR /usr/src/app

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json .
COPY package-lock.json .
RUN npm install
RUN npm install react-scripts@4.0.3 -g --silent

# start app
CMD ["npm", "start"]