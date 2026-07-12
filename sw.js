const CACHE_NAME = "typing-gaming-v4";
const ASSETS = [
  "./",
  "./index.html",
  "./css/style.css",
  "./js/app.js",
  "./js/utils.js",
  "./js/theme.js",
  "./js/timer.js",
  "./js/typing.js",
  "./js/history.js",
  "./js/chart.js",
  "./js/certificate.js",
  "./js/profile.js",
  "./js/lessons.js",
  "./js/games.js",
  "./manifest.json",
  "./assets/logo.svg"
];

// Install Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Caching files...");
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate Service Worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[Service Worker] Removing old cache:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Assets
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        // Cache dynamic fetches (like CDNs if they load successfully)
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          (event.request.url.startsWith("http") || event.request.url.includes("cdn"))
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Fallback or ignore
      });
    })
  );
});
