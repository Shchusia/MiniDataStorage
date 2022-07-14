FROM node:16


RUN apt -y update
RUN apt install xsel


ADD package.json /package.json

ENV NODE_PATH=/node_modules
ENV PATH=$PATH:/node_modules/.bin

RUN npm install -g npm@8.13.2

# RUN npm install dotenv
RUN yarn install

WORKDIR mini_data_storage
ADD . .
RUN python ./setup_env.py

RUN npm run build

RUN npm install -g serve

EXPOSE 3000

CMD  serve -s build

