
//importScripts

const staticAssets = [
    './',
    './main.css',
    './main.js',
    './fallback.json',
    './assets/imagse/fb_image_1.jpg',
    './assets/imagse/fb_image_2.jpg',
    './assets/imagse/fb_image_3.jpg'
];


self.addEventListener('install', async event => {
    const cache = await caches.open('world-news-static');
    cache.addAll(staticAssets);
    console.log('install');

});

self.addEventListener('fetch', event => {
    console.log('fetching');
    const req = event.request;
    const url = new URL(req.url);

    if(url.origin === location.origin){
        event.respondWith(cacheFirst(req));
    }else{
        event.respondWith(networkFirst(req));
    }
    
});

async function cacheFirst(req){
    const cachedResponse = await caches.match(req);
    return cachedResponse || fetch(req);   
}

async function networkFirst(req){
    const cache = await caches.open('world-news-dynamic');

    try{
        const res = await fetch(req);
        cache.put(req, res.clone());
        return res;
    } catch(e){
        //return await cache.match(req);
        const cachedResponse = await cache.match(req);
        return cachedResponse || await caches.match('./fallback.json');
    }
}