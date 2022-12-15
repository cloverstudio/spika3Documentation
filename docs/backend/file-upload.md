---
sidebar_position: 2
---

# File upload

The Spika backend uses a custom file upload mechanism to have better control over the uploading process than it would by using a standard multi-part file upload. The file upload roughly looks like this:

-   The file is divided into chunks on the client side.
-   The chunks are uploaded to the server as a normal POST request with the JSON body.
-   Each chunk has its position in the entire file so that the client can send chunks in parallel.
-   The server returns the list of chunks that are saved successfully so that the client can re-send the chunk that is missing.
-   When all chunks are uploaded, an API is called to concatenate chunks and generate the original file.

## Creating chunks

The client divides a file into chunks. Chunks have no specific size – the Spika client divides files into 54 KB per chunk.

## Sending chunks

The client calls the `/upload/files` API and sends all chunks via this API. The request parameters look like this:

|          |                                                                                                            |
| -------- | ---------------------------------------------------------------------------------------------------------: |
| chunk    |                                                                                      Base64 encoded chunk. |
| offset   |                                                       The position of the chunk in a whole chunk sequence. |
| clientId | The ID is generated on the client side to distinguish between other upload processes from the same client. |

## Verifying chunks (finishing the upload)

|            |                                                                                                                                                                 |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| total      |                                                                                                                                      The total number of chunks |
| size       |                                                                                                                                              Original file size |
| mimeType   |                                                                                                                                                  File mime type |
| fileName   |                                                                                                                                                       File name |
| clientId   |                                                                                                                               Client ID, same as the API above. |
| fileHash   |                                                                       Hash of the file content. The server returns a 400 error code if the hash is not matched. |
| type       |                                                                                          The model to which the file belongs. For example, “message”, “avatar”. |
| relationId | The unique ID of the model to which the file belongs. For example, a message ID if the file is for a message. The user ID if the file uses an avatar of a user. |
