const CACHE_NAME = "v1_cache_electrico",
  urlsToCache = ["./", "./style.css", "./script.js","./assets/main_image.jpg", "./assets/medidor.png", "./assets/medidor_64.png", "./assets/main_image.jpg", "./assets/politicas.html","./assets/Terminos.html"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache).then(() => self.skipWaiting());
      })
      .catch((err) => console.log("fallo el registro", err))
  );
});

self.addEventListener("activate", (e) => {
  const cacheWhitelist = [CACHE_NAME];

  e.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        });
      })

      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => {
      if (res) {
        return res;
      }

      return fetch(e.request);
    })
  );
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./script.js")
    .then((reg) => console.log("Registro de sw exitoso", reg))
    .then((err) => console.warn("error al tratar de registrar el sw", err));
}
