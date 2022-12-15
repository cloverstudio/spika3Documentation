---
sidebar_position: 0
---

# Intro

We designed Spika3 for every average developer to be able to modify it easily. We use only industry-standard libraries and frameworks, and aim for the code to be as simple as possible.

## System requirements

### Server

**Minimum hardware requirements**

We use a demo server on AWS’s T2 medium instance for about 50 people in our company.

|           |                                       |
| --------- | ------------------------------------: |
| Processor |                      3.3 GHz, 2 cores |
| Memory    |                                  4 GB |
| Storage   | 128 GB (depends on the user behavior) |

The storage capacity is only used for the operating system, to run the Spika server, and for the frontend. You need to adjust the storage based on the way you use it.

### Operating system

For testing, we use Ubuntu 20.04 and 22.04.

**Services**

|              |     |
| ------------ | --: |
| MySQL server | 8.0 |
| RabbitMQ     | 3.9 |
| Redis server | 7.0 |

## Frontend

We support almost all modern browsers. We use the latest version of Chrome for manual testing.

|         |      |
| ------- | ---: |
| Chrome  |  105 |
| Safari  | 15.6 |
| Edge    |  104 |
| Firefox |  104 |

## Android app

We support all Android versions from API 24 (Nougat) to API 31 (Snow Cone)

| Version    | Codename        | SDK/API level | Version Code |
| ---------- | --------------- | ------------- | ------------ |
| Android 7  | Nougat          | 24, 25        | N, N_MR1     |
| Android 8  | Oreo            | 26, 27        | O, O_MR1     |
| Android 9  | Pie             | 28            | P            |
| Android 10 | Quince Tart     | 29            | Q            |
| Android 11 | Red Velvet Cake | 30            | R            |
| Android 12 | Snow Cone       | 31            | S            |

## iOS app

TBD

## Libraries and frameworks

### Backend

|                  |        |
| ---------------- | -----: |
| Express.js       | 4.18.0 |
| Prisma.io        | 3.13.0 |
| Mediasoup server | 3.9.13 |

### Frontend

|               |       |
| ------------- | ----: |
| React.js      |  17.0 |
| Redux.js      | 7.1.8 |
| Redux Toolkit | 1.6.1 |
| Material UI   | 5.6.4 |

### Android app

|                         |         |
| ----------------------- | ------: |
| Crashlytics             |  30.0.0 |
| Retrofit                |   2.9.0 |
| Android Lifecycle       |   2.4.1 |
| Kotlin Coroutines       |   1.5.2 |
| Hilt                    |  2.38.1 |
| Room Database           |   2.4.2 |
| Navigational Components |   2.4.2 |
| Glide                   |  4.11.0 |
| Timber Log              |   5.0.1 |
| SMS Verification API    |  20.2.0 |
| Lib Phone Number        | 8.12.41 |
| Vanniktech Google Emoji |  0.15.0 |

### iOS app

TBD
