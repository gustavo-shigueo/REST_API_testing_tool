const request = document.querySelector('#reqForm')

const createRequest = () => {
  const route = document.querySelector('#route').value
  const slash = route[0] === '/' ? '' : '/'
  const url = `http://localhost:3000${slash}${route}`

  const method = document.querySelector('#method').value
  const headers = document.querySelector('#reqHeaders').value
  const body = document.querySelector('#reqBody').value

  const options = {
    method
  }

  if (body) options.body = JSON.stringify(JSON.parse(body))

  if (method === 'GET' || method === 'HEAD') delete options.body

  if (headers) options.headers = JSON.parse(headers)
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
}

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
    displayResponse(response)
  } catch (error) {
    console.error(error)
  }
}

request.addEventListener('submit', sendReq)
