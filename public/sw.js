const staticCacheName="mws-restaurant-v1",imagesCacheName="mws-restaurant-images",allCaches=[staticCacheName,imagesCacheName],statics=["/manifest.json","/favicon.ico","/index.html","/restaurant.html"],images=["/img/1.webp","/img/2.webp","/img/3.webp","/img/4.webp","/img/5.webp","/img/6.webp","/img/7.webp","/img/8.webp","/img/9.webp","/img/10.webp","/img/no_restaurant_img.webp","/img/icons/icon-72x72.webp","/img/icons/icon-96x96.webp","/img/icons/icon-128x128.webp","/img/icons/icon-144x144.webp","/img/icons/icon-152x152.webp","/img/icons/icon-192x192.webp","/img/icons/icon-384x384.webp","/img/icons/icon-512x512.webp"];self.addEventListener("install",e=>{e.waitUntil(caches.open(staticCacheName).then(e=>e.addAll(statics)).then(()=>caches.open(imagesCacheName).then(e=>e.addAll(images))))}),self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(e=>Promise.all(e.filter(e=>e.startsWith("mws-restaurant")&&!allCaches.includes(e)).map(e=>caches.delete(e)))))}),self.addEventListener("fetch",e=>{"GET"===e.request.method&&e.respondWith(caches.match(e.request).then(i=>{if("only-if-cached"!==e.request.cache||"same-origin"===e.request.mode)return i||fetch(e.request)}))});