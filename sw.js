const CACHE = 'interns-v2';

// Derive base path so the SW works on both root domains and
// GitHub Pages subdirectory deployments (e.g. /repo-name/)
const BASE = self.registration.scope;

const APP_ASSETS = [
  BASE,
  BASE + 'index.html',
  BASE + 'manifest.json',
  BASE + 'icon-192.png',
  BASE + 'icon-512.png',
];

const CDN_ASSETS = [
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',
  'https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache =>
      Promise.allSettled([
        ...APP_ASSETS.map(a => cache.add(a).catch(() => {})),
        ...CDN_ASSETS.map(a => fetch(a).then(r => cache.put(a, r)).catch(() => {})),
      ])
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Supabase API — always network, return error JSON if offline
  if (url.hostname.includes('supabase.co')) {
    e.respondWith(
      fetch(e.request).catch(() =>
        new Response(JSON.stringify({ error: 'offline' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        })
      )
    );
    return;
  }

  // CDN & fonts — cache first, update in background
  if (
    url.hostname.includes('jsdelivr.net') ||
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('gstatic.com')
  ) {
    e.respondWith(
      caches.match(e.request).then(cached => {
        const network = fetch(e.request)
          .then(res => {
            caches.open(CACHE).then(c => c.put(e.request, res.clone()));
            return res;
          })
          .catch(() => cached);
        return cached || network;
      })
    );
    return;
  }

  // App shell — cache first, fallback to index.html
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request)
        .then(res => {
          caches.open(CACHE).then(c => c.put(e.request, res.clone()));
          return res;
        })
        .catch(() => caches.match(BASE + 'index.html'));
    })
  );
});
