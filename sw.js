/* ==========================================================================
   CAGP UFMG — Service Worker Oficial (PWA Offline & Cache Engine v2)
   Estratégia: Network-First para HTML/CSS/JS (Atualização Imediata no GitHub Pages)
   + Cache-First para os 8 PDFs Normativos Oficiais e Ícones (100% Offline FAFICH)
   ========================================================================== */

const CACHE_NAME = 'cagp-pwa-v6';
const PDF_CACHE_NAME = 'cagp-pdfs-oficiais-v1';

const CORE_ASSETS = [
  './',
  'index.html',
  'curso.html',
  'pesquisa.html',
  'calouros.html',
  'percurso.html',
  'optativas.html',
  'acg.html',
  'estagio.html',
  'tcc.html',
  'estagio-tcc.html',
  'documentos.html',
  'faq.html',
  'sobre.html',
  'gestao.html',
  'mapa-do-site.html',
  'styles.css',
  'manifest.webmanifest',
  'imagens/pwa/pwa-192x192.png',
  'imagens/pwa/pwa-512x512.png',
  'imagens/pwa/apple-touch-icon.png',
  'logos/cagp/10_simbolo_transparente_positivo.svg',
  'site_libs/bootstrap/bootstrap-icons.css',
  'site_libs/bootstrap/bootstrap.min.js',
  'site_libs/quarto-html/quarto.js',
  'site_libs/quarto-nav/quarto-nav.js',
  'site_libs/clipboard/clipboard.min.js'
];

const OFFICIAL_PDFS = [
  'documentos/ppc-gestao-publica-ufmg.pdf',
  'documentos/regulamento-gestao-publica-ufmg.pdf',
  'documentos/ementario-gestao-publica-ufmg.pdf',
  'documentos/percurso-bacharelado-nucleo-geral.pdf',
  'documentos/percurso-bacharelado-nucleo-complementar.pdf',
  'documentos/percurso-bacharelado-nucleo-avancado.pdf',
  'documentos/termo-aceite-orientador-tcc.pdf',
  'documentos/regimento-interno-cagp-ufmg.pdf',
  'documentos/requerimento-atividade-integralizadora-credito-v20229.pdf'
];

// 1. Instalação: Pré-cache tolerante do App Shell com Promise.allSettled e ativação imediata
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await Promise.allSettled(
        CORE_ASSETS.map(async (url) => {
          try {
            const response = await fetch(url);
            if (response.ok) {
              await cache.put(url, response);
            }
          } catch (e) {}
        })
      );
      await self.skipWaiting();
    })()
  );
});

// 2. Ativação: Limpeza de caches obsoletos e notificação via Dynamic Island Toast
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      let updatedFromPrevious = false;

      await Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME && name !== PDF_CACHE_NAME) {
            if (name.startsWith('cagp-pwa-')) {
              updatedFromPrevious = true;
            }
            return caches.delete(name);
          }
          return Promise.resolve();
        })
      );

      await self.clients.claim();

      if (updatedFromPrevious) {
        const allClients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
        allClients.forEach((client) => {
          client.postMessage({
            type: 'CAGP_SW_UPDATED',
            version: CACHE_NAME
          });
        });
      }
    })()
  );
});

// Suporte a comandos diretos do cliente (ex.: forçar atualização, pré-cache de PDFs ou disparar notificação nativa)
self.addEventListener('message', (event) => {
  if (!event.data) return;
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  } else if (event.data.type === 'CACHE_OFFICIAL_PDFS') {
    event.waitUntil(
      (async () => {
        const cache = await caches.open(PDF_CACHE_NAME);
        await Promise.allSettled(
          OFFICIAL_PDFS.map(async (url) => {
            try {
              const response = await fetch(url);
              if (response.ok) {
                await cache.put(url, response);
              }
            } catch (e) {}
          })
        );
      })()
    );
  } else if (event.data.type === 'SHOW_NOTIFICATION') {
    const title = event.data.title || 'CAGP • Gestão Pública UFMG';
    const options = Object.assign({
      icon: 'imagens/pwa/pwa-192x192.png',
      badge: 'imagens/pwa/pwa-192x192.png',
      vibrate: [120, 60, 120],
      data: { url: event.data.url || 'index.html' }
    }, event.data.options || {});
    if (self.registration && self.registration.showNotification) {
      event.waitUntil(self.registration.showNotification(title, options));
    }
  }
});

// Clique em Notificação Nativa: Foca aba aberta do Super App ou navega até a rota-alvo
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) ? event.notification.data.url : 'index.html';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          client.focus();
          client.postMessage({ type: 'CAGP_NOTIFICATION_CLICK', url: targetUrl });
          return;
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});

// 3. Interceptação Inteligente de Requisições
self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Ignorar origens externas
  if (url.origin !== self.location.origin) {
    return;
  }

  // A. PDFs Normativos Oficiais: Stale-While-Revalidate (Cofre Offline + Atualização Silenciosa)
  if (url.pathname.endsWith('.pdf') || url.pathname.includes('/documentos/')) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(PDF_CACHE_NAME);
        const cachedPdf = await cache.match(request);

        const fetchUpdate = (async () => {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 1500);
            const netRes = await fetch(request, { signal: controller.signal });
            clearTimeout(timeoutId);
            if (netRes && netRes.status === 200) {
              await cache.put(request, netRes.clone());
            }
            return netRes;
          } catch (e) {
            return null;
          }
        })();

        if (cachedPdf) {
          event.waitUntil(fetchUpdate);
          return cachedPdf;
        }

        const netRes = await fetchUpdate;
        if (netRes) return netRes;

        return new Response('PDF oficial não disponível offline. Conecte-se à internet para sincronizar.', {
          status: 503,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
      })()
    );
    return;
  }

  // B. Páginas HTML, CSS e JS: Network-First com AbortController (1500ms timeout)
  const acceptHeader = request.headers.get('accept') || '';
  const isHtmlOrCode =
    request.mode === 'navigate' ||
    acceptHeader.includes('text/html') ||
    url.pathname.endsWith('.html') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.webmanifest');

  if (isHtmlOrCode) {
    event.respondWith(
      (async () => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1500);
        try {
          const networkResponse = await fetch(request, { signal: controller.signal });
          clearTimeout(timeoutId);
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        } catch (err) {
          clearTimeout(timeoutId);
          const cachedResponse = await caches.match(request);
          if (cachedResponse) return cachedResponse;
          if (request.mode === 'navigate' || acceptHeader.includes('text/html')) {
            return caches.match('index.html');
          }
          return new Response('Conteúdo temporariamente offline', {
            status: 503,
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
          });
        }
      })()
    );
    return;
  }

  // C. Imagens, Ícones e Vetores SVG: Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
