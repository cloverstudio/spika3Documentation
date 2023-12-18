---
sidebar_position: 2
---

# Deployment

Setting up for production.

## Recommended server spec for a small team

Spika is designed to work on multiple servers; for ease of maintenance, we recommend using a single server.

|           |                                     |
| --------- | ----------------------------------: |
| Processor |                    3.3 GHz, 8 cores |
| Memory    |                               16 GB |
| Storage   | 2 TB (depends on the user behavior) |

Even for small teams, we strongly recommend a daily backup of the database and user contents.

### Recommendation for internet services

Spika is designed to work as a huge messaging hub that you can use for B2C service as a part of your startup or whatever you need as a center of communication for massive users. Here is the recommended server configuration.

![img alt](/img/server.png)

### Services

Spika uses the following setting in the .env file to on/off which service you want to use for the instance.

```
USE_MNG_API=1
USE_MSG_API=1
USE_SMS=1
USE_UPLOAD=1
USE_PUSH=1
USE_CONFCALL=1
USE_SSE=1
USE_MESSAGE_RECORDS_SSE=1
USE_WEBHOOK=1
```

|                         |                                                  |
| ----------------------- | -----------------------------------------------: |
| USE_MNG_API             |                      API for management frontend |
| USE_MSG_API             |                                API for messenger |
| USE_SMS                 |                RabbitMQ consumer for sending SMS |
| USE_PUSH                | RabbitMQ consumer for sending push notifications |
| USE_CONFCALL            |                         API for conference calls |
| USE_SSE                 |                         RabbitMQ for sending SSE |
| USE_UPLOAD              |                                     Upload files |
| USE_MESSAGE_RECORDS_SSE |     RabbitMQ for sending SSE for message records |
| USE_WEBHOOK             |                                  Webhook support |

### .env

After cloning the source, you have to create a .env file to configure the backend. Most of the parameters say what they do by their name, so we are omitting the explanation for each parameter.

### pm2

We use pm2 for process management and logging. You can use the following code to start the Spika server via pm2.

```bash
pm2 start npm --name "spikadev" -- run "start:server"
```

### Logging

By default, logging the pm2 is not very useful because there is no timestamp. We recommend doing the following two things for the production env.

#### Show the timestamp in the log

```bash
pm2 restart spikadev --log-date-format "YYYY-MM-DD HH:MM Z"
```

#### Enable log rotation

Please check [pm2-logrotate](https://www.npmjs.com/package/pm2-logrotate) for details. The following settings enable the log rotation every Sunday at midnight.

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:rotateInterval '0 0 0 0 0'
```
