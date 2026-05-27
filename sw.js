const CACHE_NAME = 'cache-lista-v1';

const ARQUIVOS_PARA_CACHE = [
  './',
  './index.html',
  './css/style.css',
  './js/app.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

//fase 1 - install
self.addEventListener('install', (event) => { //evento para INSTALAÇÃO do service worker
  console.log('[SW] Instalando Service Worker...'); //mensagem de log 

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => { //cria o cache com nome
      console.log('[SW] Arquivos salvos no cache!'); //mensagem
      return cache.addAll(ARQUIVOS_PARA_CACHE); //add os arquivos no cache
    })
  );

  self.skipWaiting(); //serve para ativar depois da instalação
});


//fase 2 - activate
self.addEventListener('activate', (event) => { //evento para ATIVAÇÃO do service worker
  console.log('[SW] Service Worker ativado!'); //mensagem

  event.waitUntil(
    caches.keys().then((cacheNames) => { //captura os nomes criados na fase 1
      return Promise.all(                //retorna promessa para deletar os caches anteriores
        cacheNames.map((cache) => {  //percorre os caches ativos
          if (cache !== CACHE_NAME) {  //se cache for diferente do atual
            console.log('[SW] Cache antigo removido:', cache); //mensagem de remoção
            return caches.delete(cache); //delete no cache antigo
          }
        })
      );
    })
  );

  self.clients.claim(); //vai controlar páginas sem recarregar
});

//fase 3 - fetch
self.addEventListener('fetch', (event) => { //evento para pegar as requisições 
  event.respondWith(                        //responde o que tiver no cache (prioridade) ou pega na rede
    caches.match(event.request).then((respostaDoCache) => {
      if (respostaDoCache) {                    //se tiver resposta no cache
        console.log('[SW] Servindo do cache:', event.request.url); //mensagem
        return respostaDoCache; //retorna resposta do cache 
      }

      console.log('[SW] Buscando na rede:', event.request.url); //senão pega da rede
      return fetch(event.request); //retorna resposta da rede
    })
  );
});