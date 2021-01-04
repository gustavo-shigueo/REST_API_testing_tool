# http_requests
## Test REST APIs

This is a javascript application that uses the browser's Fetch API to send HTTP requests to your API
Downloading the code is not necessary, however, to use this application, you must add the following code to your API's root file:
```javascript
// The following code assumes your API uses Express
const express = require('express')
const app = express()

app.use((req, res, next) => {
  res.set({
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Expose-Headers": "*",
  })
})
```
