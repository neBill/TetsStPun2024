//const staticCacheName = 's-app-v1';

const assets = [
  '/',
  '/index.html',
  '/assets/js/ui.js',
  '/assets/js/app.js',
  '/assets/js/ot.js', 
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

const CACHE_NAME = 'cache1';
self.addEventListener('install', async event => {
    console.log('install',event);
    // Открываем кеш и получаем объект кеша
    // объекты кеша могут хранить ресурсы
    const cache = await caches.open(CACHE_NAME);
    // Ждем добавления
    await cache.addAll(assets);
    await self.skipWaiting();
});

// Удаляем старый кеш при активации
self.addEventListener('activate', async event => {
    // Получаем все ключи кеша
    const keys = await caches.keys();
    keys.forEach(key => {
        // Если имя кеша отличается от текущего имени
        // удаляем кеш
        if(key !== CACHE_NAME){
            caches.delete(key)
        }
    })
    await self.clients.claim();
});


// Определяем, успешен ли запрос ресурса
// Успех -> Ответ на успешный результат
// не удалось -> прочитать кешированный контент
self.addEventListener('fetch', event => {
   const req = event.request
   // отвечаем браузеру
   event.respondWith(networkFirst(req))
});

// Сначала сеть
async function networkFirst(req){
    try{
        // Сначала получаем самые свежие ресурсы из сети
        // Запрос может завершиться неудачно, попробуйте
        // Если есть сеть, запрос успешен, используем запрошенные данные
        const fresh = await fetch(req)
        return fresh
    }catch(e){
        // Когда сети нет, запрос не выполняется и используются кешированные данные
        const cache = await caches.open(CACHE_NAME)
        // Сопоставить результат, соответствующий req в кеше
        const cached = await cache.match(req)
        return cached
    }

}



