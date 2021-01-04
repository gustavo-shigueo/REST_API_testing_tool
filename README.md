# http_requests
## Test REST APIs

This is a javascript application that uses the browser's Fetch API to send HTTP requests to your API.
It accepts responses in the formats JSON, HTML and XML, other formats can be used, but the response will not be indented/formatted accordingly.
Downloading the code is not necessary, however, to use this application, you must add the following code to your API's root file:
```javascript
// The following code assumes your API uses Express
/*
  If your API does not use Express, you must find a way to configure
  your API so that CORS restrictions don't block the requests
  sent by the application
*/
const express = require('express')
const app = express()

app.use((req, res, next) => {
  res.set({
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Expose-Headers': '*'
  })
  next()
})
```
