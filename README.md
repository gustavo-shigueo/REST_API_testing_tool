# REST_API_testing_tool
## Test your REST APIs by sending http requests

This is a javascript application that uses the browser's Fetch API to send HTTP requests to your API.
Request data must be sent as JSON!
The responses can be in the formats JSON, HTML and XML, other formats can be used, but the response will not be indented/formatted accordingly.

The request is sent via HTTP to the provided URL. The following URL formats are accepted:
* http://host:port/route
* http://host/route
* host:port/route -> automatically converted to http://host:port/route
* host/route      -> automatically converted to http://host/route
* host            -> automatically converted to http://host
* :port/route     -> automatically converted to http://localhost:port/route
* port/route      -> automatically converted to http://localhost:port/route
* /route          -> automatically converted to http://localhost:3000/route
* route           -> automatically converted to http://localhost:3000/route

IP addresses are considered valid hosts

**Note: hosts other than localhost must contain the at least one '.' (dot) character**

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
