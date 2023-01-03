---
sidebar_position: 3
---

# Webhooks

Here you can learn about webhooks and how to use it in Spika.

## What is webhook?

A webhook is an HTTP-based callback function that allows lightweight, event-driven communication between 2 application programming interfaces (APIs). Webhooks are used by a wide variety of web apps to receive small amounts of data from other apps, but webhooks can also be used to trigger automation workflows in GitOps environments.

To set up a webhook, the client gives a unique URL to the server API and specifies which event it wants to know about. Once the webhook is set up, the client no longer needs to poll the server; the server will automatically send the relevant payload to the client’s webhook URL when the specified event occurs.

Webhooks are often referred to as reverse APIs or push APIs, because they put the responsibility of communication on the server, rather than the client. Instead of the client sending HTTP requests—asking for data until the server responds—the server sends the client a single HTTP POST request as soon as the data is available. Despite their nicknames, webhooks are not APIs; they work together. An application must have an API to use a webhook. [0]

Spika enables you to create webhook in each room that is triggered when someone sends message in webhooks room.

## How to create webhook in Spika?

To create webhook select room where you are admin. Then select “Settings” from room sidebar. There you will be able to input your webhook url. This url will be called with POST method when someone sends new message in that room.

## How to secure your webhook?

After you create webhook, verification signature will be displayed in sidebar. Every request sent from Spika will contain that signature in header under “Verification-Signature”. Verification signature can be used to **compare incoming requests and ensure that url is called from Spika.**

## Webhook data

Webhook url will be called with POST method.

Headers

```json
{
    "Content-Type": "application/json",
    "Verification-Signature": "9JOLCJUVylQxxdhX"
}
```

Payload

```json
{
    "data": {
        "message": {
            "id": 24006,
            "fromUserId": 54,
            "totalUserCount": 3,
            "deliveredCount": 0,
            "seenCount": 0,
            "roomId": 438,
            "type": "text",
            "body": {
                "text": "test"
            },
            "createdAt": 1667548137257,
            "modifiedAt": 1667548137257,
            "localId": null,
            "deleted": false,
            "replyId": null
        },
        "fromUser": {
            "displayName": "Stjepan",
            "avatarFileId": 88
        },
        "room": {
            "name": "tstt",
            "avatarFileId": 88
        }
    },
    "headers": {
        "Content-Type": "application/json",
        "Verification-Signature": "9JOLCJUVylQxxdhX"
    }
}
```

## Useful tools for testing Webhooks

During webhook development you can use ngrok. [ngrok](https://ngrok.com/) is the fastest way to put your app on the internet.

Fastes way to create test webhook and see what data is used for calling webhook is by using [webhook.site](https://webhook.site/).

## Sources

-   [0] - [What is a webhook?](https://www.redhat.com/en/topics/automation/what-is-a-webhook)
