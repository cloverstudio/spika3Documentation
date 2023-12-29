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
        object: "Object of the action" // also can be an array of strings,
        type: "subtype of the system message"
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
        object: "Group name",
        type: "created_group"
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
        object: "Clover Studio",
        type: "user_left_group"
    }
}
```

### UPDATED GROUP

When user updates name AND avatar of the group, this message is sent.

```js
{
    type: "system",
    body: {
        text: "Group updated",
        subject: "John Doe",
        object: "Group name",
        type: "updated_group"
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
        object: "Group name",
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
        object: "Group name",
        type: "updated_group_avatar"
    }
}
```

### UPDATED GROUP ADMINS

When user adds AND removes admins from the group in **one api call**, this message is sent.

```js
{
    type: "system",
    body: {
        text: "Group admins updated",
        subject: "John Doe",
        object: ["John Doe", "Jane Doe"],
        type: "updated_group_admins"
    }
}
```

### UPDATED GROUP MEMBERS

When user adds AND removes members from the group in **one api call**, this message is sent.

```js
{
    type: "system",
    body: {
        text: "Group members updated",
        subject: "John Doe",
        object: ["John Doe", "Jane Doe"],
        type: "updated_group_members"
    }
}
```

### ADDED GROUP MEMBERS

```js
{
    type: "system",
    body: {
        text: "Group members added",
        subject: "John Doe",
        object: ["John Doe", "Jane Doe"],
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
        object: ["John Doe", "Jane Doe"],
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
        object: ["John Doe", "Jane Doe"],
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
        object: ["John Doe", "Jane Doe"],
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
        object: "Note title",
        type: "created_note"
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
        object: "Note title",
        type: "deleted_note"
    }
}
```
