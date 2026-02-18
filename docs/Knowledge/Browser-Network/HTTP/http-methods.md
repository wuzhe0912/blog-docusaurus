---
id: http-methods
title: 📄 HTTP Methods
slug: /http-methods
---

## 1. What is the RESTful API ?

A RESTful API follows a standardized design style that facilitates communication between different systems on the network. To adhere to REST principles, an API should be predictable and easy to understand. As a frontend developer, the focus is primarily on three aspects:

- **URL Path**: Identifies the scope of the client's request, for example:
  - `/products`: Likely returns a product list
  - `/products/abc`: Provides details for the product with ID "abc"
- **HTTP Methods**: Define the specific action to perform:
  - `GET`: Used to retrieve data
  - `POST`: Used to create new data
  - `PUT`: Used to update existing data
  - `DELETE`: Used to delete data
- **Status Codes**: Provide a quick indication of whether the request was successful and, if not, where the problem might be. Common status codes include:
  - `200`: Success
  - `404`: Requested resource not found
  - `500`: Server error

## 2. If GET can also carry data in a request, why should we use POST?

> Since GET can also send requests with data, why do we still need to use POST?

This is mainly based on four considerations:

1. **Security**: Since GET data is appended to the URL, sensitive data is easily exposed. POST places data in the request body, which is relatively more secure.
2. **Data Size Limit**: With GET, browsers and servers impose URL length limits (although it varies slightly between browsers, it generally falls around 2048 bytes), which restricts the amount of data. POST nominally has no limit, but in practice, middleware is typically configured to limit data size to prevent malicious attacks flooding with large payloads. For example, Express's `body-parser`.
3. **Semantic Clarity**: Ensures developers can clearly understand the purpose of the request. GET is typically used for retrieving data, while POST is more suitable for creating or updating data.
4. **Immutability**: In the HTTP protocol, the GET method is designed to be "safe" — no matter how many requests are sent, there's no concern about modifying data on the server.

## 3. What does the PUT method do in HTTP?

> What is the purpose of the PUT method?

It primarily serves two purposes:

1. Update an existing resource (e.g., modifying user information)
2. Create a new resource if it doesn't exist

### Example

```js
const axios = require('axios');

async function updateUser(userId, newName) {
  const url = `https://api.example.com/users/${userId}`; // API URL
  const data = {
    name: newName,
  };

  try {
    const response = await axios.put(url, data); // Execute PUT request
    console.log('User updated:', response.data); // Output updated user info
  } catch (error) {
    console.log('Error updating user:', error); // Output error info
  }
}

updateUser(1, 'Pitt Wu');
```
