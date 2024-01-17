---
sidebar_position: 6
---

# System messages

Spika uses the system messages to communicate important events with all group members. All system messages have `type`=`system`.

They all share this body format (other message fields are not displayed for simplicity):

```js
{
    type: "system",
    body: {
        text: "Suggested text for the system message",
        subject: "Who did the action",
        subjectId: User ID of the performed user
        object: "Object of the action" // also can be an array of strings,
        type: "subtype of the system message",
        objectIds: [ ID of object the action was performed ]
    }
}
```

## Types of system messages and their body format

### CREATED GROUP

```js
{
    type: "system",
    body: {
        text: "Group created",
        subject: "John Doe",
        subjectId: User ID
        object: "Group name",
        type: "created_group"
        objectIds: [ Room ID ]
    }
}
```

### USER LEFT GROUP

```js
{
    type: "system",
    body: {
        text: "User left group",
        subject: "Stjepan",
        subjectId: User ID
        object: "Clover Studio",
        type: "user_left_group",
        objectIds: [ Room ID ]
    }
}
```

### UPDATED GROUP NAME

```js
{
    type: "system",
    body: {
        text: "Group name updated",
        subject: "John Doe",
        subjectId: User ID,
        object: "Group name",
        objectIds: [ Room ID ]
        type: "updated_group_name"
    }
}
```

### UPDATED GROUP AVATAR

```js
{
    type: "system",
    body: {
        text: "Group avatar updated",
        subject: "John Doe",
        subjectId: User ID,
        object: "Group name",
        objectIds: [ Room ID ]
        type: "updated_group_avatar"
    }
}

### ADDED GROUP MEMBERS

```js
{
    type: "system",
    body: {
        text: "Group members added",
        subject: "John Doe",
        subjectId: User ID,
        object: ["John Doe", "Jane Doe"],
        objectIds: [ User IDs],
        type: "added_group_members"
    }
}
```

### REMOVED GROUP MEMBERS

```js
{
    type: "system",
    body: {
        text: "Group members removed",
        subject: "John Doe",
        subjectId: User ID,
        object: ["John Doe", "Jane Doe"],
        objectIds: [ User IDs],
        type: "removed_group_members"
    }
}
```

### ADDED GROUP ADMINS

```js
{
    type: "system",
    body: {
        text: "Group admins added",
        subject: "John Doe",
        subjectId: User ID,
        object: ["John Doe", "Jane Doe"],
        objectIds: [ User IDs],
        type: "added_group_admins"
    }
}
```

### REMOVED GROUP ADMINS

```js
{
    type: "system",
    body: {
        text: "Group admins removed",
        subject: "John Doe",
        subjectId: User ID,
        object: ["John Doe", "Jane Doe"],
        objectIds: [ User IDs],
        type: "removed_group_admins"
    }
}
```

### CREATED NOTE

```js
{
    type: "system",
    body: {
        text: "Note created",
        subject: "John Doe",
        subjectId: User ID,
        object: "Note title",
        type: "created_note",
        objectIds: [ User IDs],
    }
}
```

### UPDATED NOTE

```js
{
    type: "system",
    body: {
        text: "Note updated",
        subject: "John Doe",
        subjectId: User ID,
        object: "Note title",
        type: "updated_note"
    }
}
```

### DELETED NOTE

```js
{
    type: "system",
    body: {
        text: "Note deleted",
        subject: "John Doe",
        subjectId: User ID,
        object: "Note title",
        type: "deleted_note"
    }
}
```
