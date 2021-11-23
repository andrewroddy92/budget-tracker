const CASHENAME = 'site-cache-v1';
const DATACACHENAME = 'data-cache-v1';
const assets = [
    '/',
    '/index.js',
    '/manifest.json',
    '/db.js',
    '/styles.css',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    'https://cdn.jsdelivr.net/npm/chart.js@2.8.0'
];

self.addEventListener('install', evt => {
    evt.waitUntil(
        caches.open(CASHENAME).then(cache => {
            console.log('caching shell assets');
            return cache.addAll(assets);
        })
    );   
});

self.addEventListener('fetch', evt => {
    if (evt.request.url.includes("/api/")) {
        evt.respondWith(
        caches.open(DATACACHENAME).then(cache => {
            return fetch(evt.request)
            .then(res => {
                if (res.status === 200) {
                    cache.put(evt.request.url, res.clone());
                }
                
                return res;
            })
            .catch(err => {
                return cache.match(evt.request);
            });
        }).catch(err => console.log(err))
    ); return;
}
    evt.respondWith(
        fetch(evt.request).catch(function() {
            return caches.match(evt.request).then(function(res) {
                if(res) {
                    return res;
                } else if (evt.request.headers.get("accept").includes("text/html")) {
                    return caches.match("/");
                }
            })
        })
    )
});