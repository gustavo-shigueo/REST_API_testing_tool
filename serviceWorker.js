const CACHE_NAME = 'REST_API_TESTING_TOOL'
const urlsToCache = ['index.html', 'css/style.min.css', 'js/theme.js', 'js/request.js']

const cacheResources = async () => {
  const cache = await caches.open(CACHE_NAME)
  console.log('Opened cache')
  return await cache.addAll(urlsToCache)
}

self.addEventListener('install', e => {
  e.waitUntil(cacheResources())
})

const cachedResource = async req => {
  try {
    await caches.match(req)
    return await fetch(req)
  } catch (error) {
    return caches.match('css')
  }
}

self.addEventListener('fetch', e => {
  e.respondWith(cachedResource(e.request))
})

const activateCache = async whiteList => {
  const names = await caches.keys()
  const namesResolved = await Promise.all(names)
  namesResolved.map(cacheName => {
    if (!whiteList.includes(cacheName)) return caches.delete(cacheName)
  })
}

self.addEventListener('activate', e => {
  const cacheWhiteList = []
  cacheWhiteList.push(CACHE_NAME)
  e.waitUntil(activateCache(cacheWhiteList))
})