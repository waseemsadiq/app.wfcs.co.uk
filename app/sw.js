// This is the service worker file for PWA functionality

const CACHE_NAME = "soccer-league-pwa-v1"
const urlsToCache = [
  "/",
  "/admin",
  "/admin/dashboard",
  "/search",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache)
    }),
  )
})

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return response
      if (response) {
        return response
      }

      return fetch(event.request).then((response) => {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response
        }

        // Clone the response
        const responseToCache = response.clone()

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache)
        })

        return response
      })
    }),
  )
})

self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME]

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
})

// Handle sync events for offline data
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-league-data") {
    event.waitUntil(syncLeagueData())
  }
})

async function syncLeagueData() {
  // This would sync data with a server in a real app
  // For this demo, we'll just log that sync was attempted
  console.log("Background sync attempted")
}

