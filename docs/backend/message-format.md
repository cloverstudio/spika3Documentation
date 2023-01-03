---
sidebar_position: 4
---

# Message format

|                |                                                                       |
| -------------- | --------------------------------------------------------------------: |
| id             |             Unique id of the message, it is generated in the backend. |
| fromUserId     |                             The user id of user who sent the message. |
| totalUserCount |             The number of users of the room when the message is sent. |
| deliveredCount |                         The number of users who received the message. |
| seenCount      |                             The number of users who open the message. |
| roomId         |                                      The room id of the message sent. |
| type           |         Message type, we have “text”, “audio”, “video”,”image”,”file” |
| body           |          Here comes the message content to show based on the content. |
| createdAt      |                              Linux timestamp generated on the server. |
| modifiedAt     |                              Linux timestamp generated on the server. |
| localId        | The client side generated unique id to handle message in client side. |
| deleted        |                                      The flag used to logical delete. |
| reply          |                                     The flag used to replied message. |
| messageRecords |            Here comes information about delivered, seen and reaction. |

## Plain text message

```json
{
    "id": 9266,
    "fromUserId": 61,
    "totalUserCount": 1,
    "deliveredCount": 1,
    "seenCount": 1,
    "roomId": 369,
    "type": "text",
    "body": {
        "text": "test"
    },
    "createdAt": 1665390578258,
    "modifiedAt": 1665390578258,
    "localId": null,
    "deleted": false,
    "reply": false,
    "messageRecords": []
}
```

## File message

If message type is “image”, “video”, “audio” or “file” message structure is like this.

```json
{
    "id": 9476,
    "fromUserId": 61,
    "totalUserCount": 1,
    "deliveredCount": 1,
    "seenCount": 1,
    "roomId": 369,
    "type": "file",
    "body": {
        "fileId": 1184,
        "thumbId": 1185,
        "file": {
            "id": 1184,
            "fileName": "openapi2.json",
            "mimeType": "application/json",
            "path": "/uploads/files/50058285",
            "size": 22388
        },
        "thumb": {
            "id": 1185,
            "fileName": "openapi2.json",
            "mimeType": "application/json",
            "path": "/uploads/files/50058285",
            "size": 22388
        }
    },
    "createdAt": 1665404535428,
    "modifiedAt": 1665404535428,
    "localId": null,
    "deleted": false,
    "reply": false,
    "messageRecords": []
}
```

## Message structure for replied message

Replied message contains the original message body. The original message body is copied from the DB when it’s replied, so if the user of original message changes the message the replied message will not change. We do that to avoid over loading the server.

```json
{
    "id": 9479,
    "fromUserId": 61,
    "totalUserCount": 4,
    "deliveredCount": 4,
    "seenCount": 1,
    "roomId": 190,
    "type": "text",
    "body": {
        "text": "yes!",
        "referenceMessage": {
            "id": 9457,
            "body": {
                "text": "Can we talk?"
            },
            "type": "text",
            "reply": false,
            "roomId": 190,
            "deleted": false,
            "localId": null,
            "createdAt": 1665401397146,
            "seenCount": 3,
            "fromUserId": 66,
            "modifiedAt": 1665401397146,
            "deliveredCount": 4,
            "messageRecords": [],
            "totalUserCount": 4
        }
    },
    "createdAt": 1665405084542,
    "modifiedAt": 1665405084542,
    "localId": null,
    "deleted": false,
    "replyId": 9457,
    "messageRecords": []
}
```
