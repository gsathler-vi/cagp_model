// CAGP UFMG — Service Worker Oficial (PWA Offline & Anti-Lie-Fi)
const CACHE_NAME = 'cagp-pwa-v7';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/curso.html',
  '/calouros.html',
  '/pesquisa.html',
  '/percurso.html',
  '/optativas.html',
  '/acg.html',
  '/estagio.html',
  '/tcc.html',
  '/documentos.html',
  '/faq.html',
  '/mapa-do-site.html',
  '/sobre.html',
  '/gestao.html',
  '/estagio-tcc.html',
  '/manifest.webmanifest'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        PRECACHE_ASSETS.map((url) =>
          fetch(url)
            .then((res) => {
              if (res.ok) return cache.put(url, res);
            })
            .catch(() => {})
        )
      );
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Ambiente Local / Preview: Sempre direto da rede para evitar cache obsoleto durante testes
  if (url.hostname === 'localhost' || url.hostname === '127.0.0.1' || url.hostname === '0.0.0.0') {
    event.respondWith(fetch(req).catch(() => caches.match(req)));
    return;
  }

  // Navegação: Network-first com anti-Lie-Fi timeout de 2.5s
  if (req.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Anti-Lie-Fi timeout (2.5s)')), 2500)
          );
          const networkResponse = await Promise.race([fetch(req), timeoutPromise]);
          if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(req, networkResponse.clone());
            return networkResponse;
          }
        } catch (_) {
          // Fallback para cache imediato
        }
        const cached = await caches.match(req);
        if (cached) return cached;
        const dirPath = url.pathname.endsWith('/') ? url.pathname + 'index.html' : url.pathname + '/index.html';
        const dirCached = await caches.match(dirPath);
        if (dirCached) return dirCached;
        const indexCached = await caches.match('/index.html') || await caches.match('/');
        if (indexCached) return indexCached;
        return new Response('Sem conexão e sem cache disponível.', {
          status: 503,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
      })()
    );
    return;
  }

  // Documentos, assets e fontes: Cache-first com revalidação em background
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) {
        fetch(req).then((res) => {
          if (res && res.status === 200) {
            caches.open(CACHE_NAME).then((c) => c.put(req, res));
          }
        }).catch(() => {});
        return cached;
      }
      return fetch(req).then((res) => {
        if (res && res.status === 200) {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, resClone));
        }
        return res;
      });
    })
  );
});
