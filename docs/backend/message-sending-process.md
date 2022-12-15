---
sidebar_position: 1
---

# The message-sending process

The process of how the message data travels in Spika roughly looks like this:

-   The sender sends the message.
-   The message is saved to the message table.
-   The message is copied to message_device for each device. We have this prepared for the E2E encryption.
-   SSE is sent to each device.
-   The push notification is sent to each device through the queue.
-   When each device successfully saves to the local DB, call the /messenger/messages/delivered API.
-   When the user opens the chat, the client calls the /messenger/messages/seen API.
-   When /messenger/messages/delivered or /messenger/messages/seen API is called, the backend sends the SSE to notify the client through the queue.
-   When the client receives the SSE of delivered or seen, the UI is changed based on the information.

![img alt](/img/messagning.png)
