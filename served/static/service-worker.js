importScripts('https://www.gstatic.com/firebasejs/9.15.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.15.0/firebase-messaging-compat.js');

self.addEventListener('install', function (event) {
  self.skipWaiting()
})

self.addEventListener('activate', function (event) {
  console.log('[sw] activate')
  event.waitUntil(clients.claim());
})

//const cacheInclude = /\.png|\.PNG|\.svg|\.SVG|\.jpg|\.JPG|\.jpeg|\.JPEG|\.css|\.woff2/

//const templateReg = /\/([a-zA-Z-_]+)_/

self.caches.delete('cache')

self.addEventListener('fetch', async function (event) {
  //console.log('[SW] fetch event : ', event.request.url)
  return;
})

self.skipWaiting()