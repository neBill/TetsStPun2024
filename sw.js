const staticCacheName = 's-app-v1';

const assets = [
  '/',
  '/index.html',
  '/assets/js/ui.js',
  '/assets/js/app.js',
  // '/assets/js/ot.js',
  // '/assets/js/data.js',
  '/assets/js/settings.js',
  // '/assets/js/otmaxim.js',
  // '/assets/js/micro5.js',
  // '/assets/js/micro6.js',
  '/assets/js/gid_b.js',
  '/assets/js/gid_s.js',
  '/assets/js/gid_e.js',
  '/assets/js/pir_b.js',
  '/assets/js/pir_s.js',
  '/assets/js/pir_e.js',
  '/assets/js/per_b.js',
  '/assets/js/per_s.js',
  '/assets/js/per_e.js',  
  '/assets/images/logo-192x192.png',
  '/assets/images/logo-512x512.png',
  '/assets/images/maskable_icon.png', 
  '/favicon.png',
  '/sw.js',
  '/assets/css/main.css',  
  '/assets/css/theme.css', 
  'https://fonts.googleapis.com/css?family=Lato:300,400,700',
];

// install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log('caching shell assets');
      cache.addAll(assets);
    })
  );

  
});
// activate event
/*self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== staticCacheName)
        .map(key => caches.delete(key))
      );
    })
  );
});*/


// fetch event
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cacheRes => {
      return cacheRes || fetch(event.request);
    })
  );
});

// self.addEventListener('activate',  event => {
//   const cacheNames = caches.keys();  
//   Promise.all(
//     cacheNames
//       .filter(name => name !== staticCacheName)
//       .map(name => caches.delete(name)));
// });

self.addEventListener('activate',  event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== staticCacheName)
          .map(name => caches.delete(name))
      );
    })
  );
});





