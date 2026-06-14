// Amelia Restaurant Inventory — Service Worker (app shell cache)
const CACHE_NAME = 'amelia-inventory-v2';
const ASSETS = ['./','./index.html','./manifest.json','./icon.png','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];

self.addEventListener('install', function(event) {
  event.waitUntil(caches.open(CACHE_NAME).then(function(cache){ return cache.addAll(ASSETS); }));
  self.skipWaiting();
});
self.addEventListener('activate', function(event) {
  event.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){return k!==CACHE_NAME;}).map(function(k){return caches.delete(k);}));
  }));
  self.clients.claim();
});
self.addEventListener('fetch', function(event) {
  if (new URL(event.request.url).origin !== self.location.origin) return; // never intercept the Apps Script app
  event.respondWith(caches.match(event.request).then(function(r){ return r || fetch(event.request); }));
});
