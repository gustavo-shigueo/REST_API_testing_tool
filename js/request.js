const request = document.querySelector('#reqForm')
const btn = document.querySelector('#send')

const getUrl = host => {
  if (host.match(/http(s)?\:\/\/.+/g)) return host
  if (host.match(/^(localhost|\d{1,3}\.\d{1,3}\.\d{1,3}|\w+\.\w+)/g)) return url = `http://${host}`
  if (host.match(/^\:\d{1,4}/g)) return `http://localhost${host}`
  if (host.match(/^\d{1,4}/g)) return `http://localhost:${host}`
  if (host.match(/^\/.+/g)) return `http://localhost:3000${host}`
  if (host.match(/^.+/g)) return `http://localhost:3000/${host}`
  return
}

const createRequest = () => {
  const host = document.querySelector('#host').value
  const url = getUrl(host)

  const method = document.querySelector('#method').value
  const headers = document.querySelector('#reqHeaders').value
  const body = document.querySelector('#reqBody').value

  const options = { method }

  if (body) options.body = JSON.stringify(JSON.parse(body.replace(/(\,\s{0,}\n?\s{0,})(\}|\])/g, '$2')))

  if (method === 'GET' || method === 'HEAD') delete options.body

  if (headers) options.headers = JSON.parse(headers.replace(/(\,\s{0,}\n?\s{0,})(\}|\])/g, '$2'))
  else options.headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }

  return { url, options }
}

const displayResponse = response => {
  const elements = ['#resStatusCode', '#resStatusText', '#resHeaders', '#resBody']
  const fields = ['status', 'statusText', 'headers', 'data']
  for (i in elements) document.querySelector(elements[i]).value = response[fields[i]]
  btn.removeAttribute('disabled')
  return
}

/*
  * Currently used for XML and HTML, other
  * Markup Languages can probably be parsed by this function,
  * but I haven't tried yet.
  * If you want to try, configure your API to send a response in
  * the desired language and add it to the formatData function (line 75)
*/
const formatML = ml => {
  ml = ml.replace(/\n*/g, '')
  let formatted = ''
  const reg = /(>)(<)(\/*)/g
  ml = ml.replace(reg, '$1\r\n$2$3')
  let pad = 0
  ml.split('\r\n').forEach(node => {
    let indent = 0
    if (node.match( /.+<\/\w[^>]*>$/ )) indent = 0
    else if (node.match( /^<\/\w/ ) && pad !== 0) pad -= 1
    else if (node.match( /^<\w([^>]*[^\/])?>.*$/ )) indent = 1

    let padding = ''
    for (let i = 0; i < pad; i++) padding += '  '
    formatted += `${padding}${node}\r\n`
    pad += indent
  })

  return formatted
}

const formatData = async (data, format) => {
  if (format.match(/(application\/json)/g)) return JSON.stringify(await data.json(), null, 2)
  if (format.match(/(application\/xml)|(text\/html)/g)) return formatML(await data.text())
  return await data.text()
}

const sendReq = async e => {
  btn.setAttribute('disabled', true)
  e.preventDefault()

  try {
    const { url, options } = createRequest()

    const res = await fetch(url, options)

    const headersObj = {}
    res.headers.forEach((v, k) => headersObj[k] = v)

    const headers = JSON.stringify(headersObj, null, 2)
    const status = res.status
    const statusText = res.statusText

    const data = status !== 204 ? await formatData(res, headersObj['content-type']) : ''

    const response = { status, statusText, data, headers }
    return displayResponse(response)
  } catch (error) {
    const message = `Your request failed!\n\n\tMake sure the host and the port are correct and your request's headers and body are complete.\n\n\tThis may also be due to the targeted server's CORS settings, open the console for more details and if that is the case, adjust your API's CORS restrictions to allow this application to send requests.\n\tThe following link may be helpful to solve problems related to CORS: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#The_HTTP_response_headers`
    displayResponse({ status: 400, statusText: 'Bad Request', data: message, headers: '{}' })
    return console.error(error)
  }
}

request.addEventListener('submit', sendReq)
