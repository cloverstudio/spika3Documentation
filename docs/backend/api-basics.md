---
sidebar_position: 0
---

# API basics

Spika has several sets of APIs divided by their purpose.

|                |                                                                        |
| -------------- | ---------------------------------------------------------------------: |
| Core API       |                              API set used for official frontend, apps. |
| Management API |           API set for the management part, mainly CRUD for all models. |
| Messaging API  | API set for sending messages to certain rooms, designed to make a BOT. |

## Core API

Core API is a RESTful API for the Spika main app. The API document is completely open so you can easily extend Spika based on your requirements. This is the main principle of how it works.

### Default API endpoint

The default API endpoint for this API set is:

```
/api/messenger
```

### Authorization

For authorization, we only use SMS verification codes. At the moment, we use Twilio – you can find the implementation under `/server/services/sms`. SMS sending works on the consumer-to-the-queue principle. To send an SMS, you can simply add a task to the queue like this: `/server/services/messenger/routes/auth.ts`

```js
const SMSPayload: SendSMSPayload = {
    telephoneNumber,
    content: verificationCodeSMS({ verificationCode, osName }),
};
```

The authorization process is divided into two parts: sending an SMS and verifying an SMS. The following APIs are involved in this process:

-   `/api/messenger/auth`
-   `/api/messenger/verify`

In the end, the /verify API returns the access token which you use to access other APIs.

Here are some things to keep in mind for the authorization process:

-   The device ID is tied to a telephone number, so you cannot send the same device ID for different telephone numbers if the /auth API returns a 403 error.
-   `/auth` API includes the device ID if the telephone number already exists in the database and the device type is browser. In this case, the frontend should override the value with the value in the response. So the browser will use the same device ID for the same telephone number.

After the `/verify` API returns the access token, the client app should save it in both persistent storage and memory. Access token should send in the request header like this:

```
accesstoken: wEw9wqqBQ4LnI5Kk
```

### Response structure

This is the basic response structure.

**Success response**

```json
{ "status": "success", "data": { "messageRecords": [] } }
```

**Error response**

```json
{ "status": "error", "message": "Verification code is invalid" }
```

Success response returns “success” for the “status” parameter, and error response returns “error”. In the success response, the main part is under the “data” parameter. All the error responses return an error HTTP status code so there you can handle errors.

### Error code

These are the error status codes we use in the response:

| Code |                                                                                                Description |
| ---- | ---------------------------------------------------------------------------------------------------------: |
| 400  |                                                        The value of the request body is logically invalid. |
| 401  | When the access token is invalid. The client app should handle this error to jump into the sign-in screen. |
| 403  |                                              When the request body doesn’t match the condition of the API. |
| 404  |                                                              When the requested information doesn’t exist. |
| 500  |                                                             All unhandled exceptions return the 500 error. |

### Call API from the client side

#### Frontend

We use [Redux Toolkit Query](https://redux-toolkit.js.org/rtk-query/overview) for the API calls. You can find an example here: `/client/apps/messenger/src/features/auth/api/auth.ts`

```js
const userApi = api.injectEndpoints({
    endpoints: (build) => ({
        signUp: build.mutation<AuthResponseType, any>({
            query: (data) => {
                return { url: "/messenger/auth", method: "POST", data };
            },
        }),
        verify: build.mutation({
            query: (data) => {
                return { url: "/messenger/auth/verify", method: "POST", data };
            },
            invalidatesTags: [{ type: "Auth", id: "me" }],
        }),
        update: build.mutation({
            query: (data) => {
                return { url: "/messenger/me", method: "PUT", data };
            },
            invalidatesTags: [{ type: "Auth", id: "me" }],
        }),
        getUser: build.query<any, void>({
            query: () => "/messenger/me",
            providesTags: [{ type: "Auth", id: "me" }],
        }),
    }),
    overrideExisting: true,
});
```

The APIs that are defined like this we use through React Hook. In some cases, it is more useful to call an API without RTK Query – in such a case we call it directly. You can find an example here: `/client/apps/messenger/src/features/chat/slice/chatSlice.ts`

```js
const response = await dynamicBaseQuery({
    url: "/messenger/messages/",
    data: { roomId, type, body: { referenceMessage, text: messageText }, reply: true },
    method: "POST",
});
```

#### iOS app

TBD

#### Android app

TBD

## Management API

The Management API is a set of APIs designed to be used in the Management console. Most of them are CRUD operations for all models. Basically, it works the same as the Core API so we won’t explain it in detail here. In contrast with the Core API, the Management API uses a simple username/password authorization that you can define in .env.

### Default API endpoint

`/api/management`

### Authorization

We use a simple username/password authorization for this API. Admin’s username and password are defined in .env like this:

```env
ADMIN_USERNAME='admin'
ADMIN_PASSWORD='password'
```

This API handles the authorization:

`/api/management/auth`

After successfully calling this API, the access token should exist in the response body. So you use the value for further communication with the API. The request header name to put the access token is `admin-accesstoken`

## Messaging API

TBD
