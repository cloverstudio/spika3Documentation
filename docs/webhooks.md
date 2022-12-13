---
sidebar_position: 3
---

# Webhooks

You can start developing using docker or you can set up manually.

## Using docker

There is a sample docker-compose.yml in the repo so reusing the sample is the easiest way to set up the local dev environment. Here you can find the file. This tutorial uses the [sample file](https://github.com/cloverstudio/Spika3/blob/master/docker-compose.yml.sample) (this tutorial is for **Ubuntu 20.04 or 22.04** ).

Set up the required software and Node.js

```bash
$ sudo apt-get install curl build-essential python3 pip
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
$ source ~/.bashrc
$ nvm install v14.0.0
$ nvm use v14.0.0
```

Clone the repo and prepare libraries

```bash
$ git clone https://github.com/cloverstudio/Spika3.git
$ cd Spika3
$ npm install
$ cp .env-sample .env
```

Then you have to install the docker. Please check it out here, and install the docker and docker-compose.
https://docs.docker.com/engine/install/ubuntu/

Set up the docker-compose.yml and start containers.

```bash
mv docker-compose.yml.sample docker-compose.yml

#change if you need..
nano docker-compose.yml

#update .env to use the docker-compose config
nano .env
```

Build the frontend and start the server.

```bash
$ npx prisma db push

# Build web clients
$ npm run build:management
$ npm run build:messenger

# Start server
$ npm run start:server
```

## Manually

Set up the required software and Node.js

```bash
$ sudo apt-get install curl build-essential python3 pip
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
$ source ~/.bashrc
$ nvm install v14.0.0
$ nvm use v14.0.0
```

Set up MySQL, RabbitMQ, Redis

[Click here](https://www.digitalocean.com/community/tutorials/how-to-install-mysql-on-ubuntu-20-04) for instructions for installing MySQL in Ubuntu 20.04. <br/>
[Click here](https://www.rabbitmq.com/install-debian.html) for instructions for installing RabbitMQ in Ubuntu 20.04.

Install the Redis server

```bash
$ sudo apt install redis-server
```

Clone the repo and prepare libraries

```bash
$ git clone https://github.com/cloverstudio/Spika3.git
$ cd Spika3
$ npm install
$ cp .env-sample .env
```

Build the frontend and start the server.

```bash
$ npx prisma db push

# Build web clients
$ npm run build:management
$ npm run build:messenger

# Start server
$ npm run start:server
```
