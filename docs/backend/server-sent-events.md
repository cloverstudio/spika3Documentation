---
sidebar_position: 5
---

# Server-sent events

Spika uses the [Server-sent event](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events) to realize the server-to-client communication. We decided to not use WebSocket because of stability and maintainability. Spika backend sends JSON packets to the client in each event so the client can react to these events in real time like when a user sends a message to a room. Here is a type of SSE we use in Spika:

## Messages

### NEW_MESSAGE

```js
{
    type: "NEW_MESSAGE"
    message: {
      id: 22,
      roomId: 58,
      fromUserId: 88,
      totalUserCount: 4,
      deliveredCount: 2,
      seenCount: 1,
      type: 'text',
      body: {
          text: "lala"
      },
      createdAt: 1235468845,
      modifiedAt: 1235468845,
      localId: "uuid-dsauhs5dsad1a5sd1as",
      deleted: false,
    }
}
```

### UPDATE_MESSAGE

```js
{
    type: "UPDATE_MESSAGE"
    message: {
      id: 22,
      roomId: 58,
      fromUserId: 88,
      totalUserCount: 4,
      deliveredCount: 2,
      seenCount: 1,
      type: 'text',
      body: {
          text: "lala"
      },
      createdAt: 1235468845,
      modifiedAt: 1235468845,
      localId: "uuid-dsauhs5dsad1a5sd1as",
      deleted: false,
    }
}
```

### DELETE_MESSAGE

```js
{
    type: "DELETE_MESSAGE"
    message: {
      id: 22,
      roomId: 58,
      fromUserId: 88,
      totalUserCount: 4,
      deliveredCount: 2,
      seenCount: 1,
      type: 'text',
      body: {
          text: "lala"
      },
      createdAt: 1235468845,
      modifiedAt: 1235468845,
      localId: "uuid-dsauhs5dsad1a5sd1as",
      deleted: true,
    }
}
```

## Message records

### NEW_MESSAGE_RECORD

```js
{
    type: "NEW_MESSAGE_RECORD"
    messageRecord: {
      id: 22,
      messageId: 55,
      userId: 88,
      type: 'seen',
      reaction: null,
      modifiedAt: 123654486948,
      createdAt: 225424343584,
    }
}
```

### DELETE_MESSAGE_RECORD

```js
{
    type: "DELETE_MESSAGE_RECORD"
    messageRecord: {
      id: 22,
      messageId: 55,
      userId: 88,
      type: 'seen',
      reaction: null,
      modifiedAt: 123654486948,
      createdAt: 225424343584,
    }
}
```

## Rooms

### NEW_ROOM

```js
{
    type: "NEW_ROOM"
    room: {
      id: 55,
      name: null,
      users: [
        {
          userId: 55,
          isAdmin: true,
          user: {
            id: 55,
            emailAddress: "johny25@gmail.com",
            telephoneNumber: "+385978774088",
            telephoneNumberHashed: "54f3d56s4f3sd4fds",
            displayName: "johnny",
            avatarFileId: 55,
            createdAt: 565416416641,
            modifiedAt: 565416416641,
          }
        },
        {
          userId: 58,
          isAdmin: false,
          user: {
            id: 58,
            emailAddress: "marky25@gmail.com",
            telephoneNumber: "+385978774098",
            telephoneNumberHashed: "54f3d56s4f3sd4fds",
            displayName: "mark",
            avatarFileId: 55,
            createdAt: 565416416641,
            modifiedAt: 565416416641,
          }
        }
      ],
      avatarFileId: 55,
      type: "private",
      createdAt: 1234566228,
      modifiedAt: 1234566228,
      deleted: false,
    }
}
```

### UPDATE_ROOM

```js
{
    type: "UPDATE_ROOM"
    room: {
      id: 55,
      name: null,
      users: [
        {
          userId: 55,
          isAdmin: true,
          user: {
            id: 55,
            emailAddress: "johny25@gmail.com",
            telephoneNumber: "+385978774088",
            telephoneNumberHashed: "54f3d56s4f3sd4fds",
            displayName: "johnny",
            avatarFileId: 55,
            createdAt: 565416416641,
            modifiedAt: 565416416641,
          }
        },
        {
          userId: 58,
          isAdmin: false,
          user: {
            id: 58,
            emailAddress: "marky25@gmail.com",
            telephoneNumber: "+385978774098",
            telephoneNumberHashed: "54f3d56s4f3sd4fds",
            displayName: "mark",
            avatarFileId: 55,
            createdAt: 565416416641,
            modifiedAt: 565416416641,
          }
        }
      ],
      avatarFileId: 55,
      type: "private",
      createdAt: 1234566228,
      modifiedAt: 1234566228,
      deleted: false,
    }
}
```

### DELETE_ROOM

```js
{
    type: "DELETE_ROOM"
    room: {
      id: 55,
      name: null,
      users: [
        {
          userId: 55,
          isAdmin: true,
          user: {
            id: 55,
            emailAddress: "johny25@gmail.com",
            telephoneNumber: "+385978774088",
            telephoneNumberHashed: "54f3d56s4f3sd4fds",
            displayName: "johnny",
            avatarFileId: 55,
            createdAt: 565416416641,
            modifiedAt: 565416416641,
          }
        },
        {
          userId: 58,
          isAdmin: false,
          user: {
            id: 58,
            emailAddress: "marky25@gmail.com",
            telephoneNumber: "+385978774098",
            telephoneNumberHashed: "54f3d56s4f3sd4fds",
            displayName: "mark",
            avatarFileId: 55,
            createdAt: 565416416641,
            modifiedAt: 565416416641,
          }
        }
      ],
      avatarFileId: 55,
      type: "private",
      createdAt: 1234566228,
      modifiedAt: 1234566228,
      deleted: true,
    }
}
```

### SEEN_ROOM

This event is sent when user calls seen room api, it is sent to all other users devices so they can update their unread count.

```js
{
    type: "SEEN_ROOM",
    roomId: 55
}
```

## Users

### USER_UPDATE

```js
{
    type: "USER_UPDATE"
    user: {
        id: 55,
        emailAddress: "johny25@gmail.com",
        telephoneNumber: "+385978774088",
        telephoneNumberHashed: "54f3d56s4f3sd4fds",
        displayName: "johnny",
        avatarFileId: 55,
        createdAt: 565416416641,
        modifiedAt: 565416416641,
    }
}
```
