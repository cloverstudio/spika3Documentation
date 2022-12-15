---
sidebar_position: 3
---

# Reaction system design

Reaction is the feature which users can react by emoji for each message. This page explains how we implement the feature. We use MessageRecord model for this purpose. MessageRecord is used to record “delivered” and “seen” information.

## Database structure

For database we can reuse MessageRecord model because reaction is type of message record. Here how it should look like in db:

```
model MessageRecord {
  id Int @id @default(autoincrement()) @map(name: "id")
  messageId Int @map(name: "message_id")
  message Message @relation(fields: [messageId], references: [id])

  userId Int @map(name: "user_id")
  user User @relation(fields: [userId], references: [id])

  type String @map("string")
  reaction String? @map("reaction")

  createdAt  DateTime @default(now()) @map(name: "created_at")
  modifiedAt DateTime @default(now()) @map(name: "modified_at")

  @@unique([messageId, userId, type], name: "messageId_userId_type_unique_constraint")
  @@map(name: "message_record")
}
```

Type will be ‘reaction’ and in reaction string field we can insert emoji unicode.

## Create message record API

```yml
/messenger/message-records:
    post:
        tags:
            - "MessageRecord"
        summary: "Add message record"
        description: "Add message record"
        consumes:
            - "application/json"
        produces:
            - "application/json"
        parameters:
            - name: "messageId"
              in: body
              required: true
              schema:
                  type: number
            - name: "type"
              in: body
              required: true
              schema:
                  type: string
            - name: "reaction"
              in: body
              schema:
                  type: string
        responses:
            "200":
                description: "successful operation"
                schema:
                    type: "object"
                    properties:
                        status:
                            type: "string"
                            enum: [success, error]
                        data:
                            type: "object"
                            properties:
                                messageRecord:
                                    type: "object"
                                    $ref: "#/definitions/MessageRecord"
            "400":
                description: "invalid param"
```

## Delete message record API

```yml
/messenger/message-records/{id}:
    delete:
        tags:
            - "MessageRecord"
        summary: "Delete message record"
        description: "Delete message record"
        consumes:
            - "application/json"
        produces:
            - "application/json"
        parameters:
            - name: "id"
              in: path
              required: true
              type: number
        responses:
            "200":
                description: "successful operation"
                schema:
                    type: "object"
                    properties:
                        status:
                            type: "string"
                            enum: [success, error]
                        data:
                            type: "object"
                            properties:
                                messageRecord:
                                    type: "object"
                                    $ref: "#/definitions/MessageRecord"
            "400":
                description: "invalid param"
```

## Sync message records API

```yml
/messenger/message-records/sync/{lastUpdate}:
    get:
        tags:
            - "Sync"
        summary: "Get all message records updated and created since last update"
        description: "Get all message records updated and created since last update"
        produces:
            - "application/json"
        responses:
            "200":
                description: "successful operation"
                schema:
                    type: "object"
                    properties:
                        status:
                            type: "string"
                            enum: [success, error]
                        data:
                            type: "object"
                            properties:
                                messageRecords:
                                    type: "array"
                                    items:
                                        type: "object"
                                        $ref: "#/definitions/MessageRecord"
```

## Server Sent Events

### NEW_MESSAGE_RECORD

```json
{
    "type": "NEW_MESSAGE_RECORD"
    "messageRecord": {
      "id": 22,
      "messageId": 55,
      "userId": 88,
      "type": 'seen',
      "reaction": null,
      "modifiedAt": 123654486948,
      "createdAt": 225424343584,
    }
}
```

### DELETE_MESSAGE_RECORD

```json
{
  "type": "DELETE_MESSAGE_RECORD"
    "messageRecord": {
      "id": 22,
      "messageId": 55,
      "userId": 88,
      "type": 'seen',
      "reaction": null,
      "modifiedAt": 123654486948,
      "createdAt": 225424343584,
    }
}
```
