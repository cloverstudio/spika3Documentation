---
sidebar_position: 4
---

# Messaging API

Here you can learn about API-s and API keys and how to use it in Spika.

## Overview

An API is like a portal through which information and functionality can be shared between two software services. The word “interface” is key to understanding an API’s purpose. Just like a web browser is an interface for a human end user to receive, send, and update information on a web server, an API is an interface that provides software programs with the same functionality. [0]

API key is a code used to identify and authenticate an application or user. API keys are available through platforms, such as a messaging application. They also act as a unique identifier and provide a secret token for authentication purposes.

Spika enables you to create API key and use it to send message from your code.

## How to create API key in Spika?

To create API key select room where you are admin. Then select “Settings” from room sidebar. There you will be able to input displayName. Display name will be used as a sender name. After you create, API key and url will be displayed in sidebar.

## How to use API key to send message?

To send message using API key you will have to have:

- API key (example: RN7CEKxHSkCmKiTQ)
- POST url (example: https://dev3.spika.chat/api/messaging/messages)

To get required data – go to previous step.

POST url expects these two fields in header:

```
accesstoken: iehD4dsdbvAddyup
Content-Type: application/json
```

POST url expects these fields in body:

- roomId – number id of the room that you want to post message to
- type – string – only “text” is supported for now
- body – JSON string – if type is “text” this field should be { text: “my message” }

## POST message API response

Success response (code: 200):

```json
{
  "status": "success",
  "data": {
    "message": {
      "id": 5,
      "roomId": 5,
      "fromUserId": 2,
      "totalUserCount": 5,
      "deliveredCount": 0,
      "seenCount": 0,
      "type": "text",
      "body": {
        "text": "Hello"
      },
      "modifiedAt": 1667553066416,
      "createdAt": 1667553066416,
      "localId": 5,
      "deleted": false
    }
  }
}
```

Error response (code: 400):

```json
{
  "status": "error",
  "message": "Error message"
}
```

## Sources

- [0] - [What is an API?](https://www.mparticle.com/blog/apis-vs-webhooks/)
