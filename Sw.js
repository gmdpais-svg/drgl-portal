/* Roy's Portal — keeps the GitHub page available offline (the portal itself is stored by index.html). */
var SHELL = 'roys-portal-shell-v1';
self.addEventListener('install', function (e) { e.waitUntil(caches.open(SHELL).then(function (c) { return c.addAll(['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png']).catch(function () {}); }).then(function () { return self.skipWaiting(); })); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function (e) {
  var r = e.request; if (r.method !== 'GET') return;
  var u = new URL(r.url); if (u.origin !== self.location.origin) return;   // Apps Script calls go straight to the network
  e.respondWith(fetch(r).then(function (res) { if (res && res.ok) { var cp = res.clone(); caches.open(SHELL).then(function (c) { c.put(r, cp); }); } return res; })
    .catch(function () { return caches.match(r, { ignoreSearch: true }).then(function (m) { return m || caches.match('./index.html'); }); }));
});
