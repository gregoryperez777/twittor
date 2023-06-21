// imports 
importScripts('js/sw-utils.js');

const STATIC_CACHE = 'static-v2';
const DINAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

// Nota IMPORTANTE una mala direccion en los 
// APP_SHELL y se produciria un aborto en la instalacion
// del services worked

// Nota para seleccionar entre cache static y
// cache inmutable 

// cache static: se debe mandar aquellos archivos 
// que hemos desarrollados y recursos como imagenes

// cache inmutable: se debe mandar aquellos archivos
// que no hemos desarrollados nosotros como librerias
// o recursos externos como google fonts

// Aqui va todo lo que necesitamos para arrancar la 
// app y que puede ser modificado
const APP_SHELL = [
    '/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/spiderman.jpg',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js',
    'js/sw-utils.js'
];

// Aqui va todo lo que no se va a modificar jamas
const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
];

self.addEventListener('install', e => {

    const cacheStatic = caches.open(STATIC_CACHE).then(cache => cache.addAll(APP_SHELL));
    const cacheInmutable = caches.open(INMUTABLE_CACHE).then(cache => cache.addAll(APP_SHELL_INMUTABLE));

    e.waitUntil( Promise.all([cacheStatic, cacheInmutable]) ); 
});

self.addEventListener('activate', e => {
    const respuesta = caches.keys().then(keys => {
        keys.forEach( key => {
            if (key !== STATIC_CACHE && key.includes('static')) {
                return caches.delete(key);
            }
        });
    });

    e.waitUntil(respuesta);
});

self.addEventListener('fetch', e => {
    const respuesta = caches.match(e.request).then(res => {
        
        if (res) {
            return res;
        } else {
            console.log('url', e.request.url);
            return fetch(e.request).then(newRes => {
                
                return actualizaCacheDinamico(DINAMIC_CACHE, e.request, newRes); 

            });
        }
        

    });

    e.respondWith(respuesta);
});