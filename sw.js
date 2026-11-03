// =========================================
// CV MANAGER — PROGRESSIVE WEB APP
// =========================================

const CACHE_NAME = "cv-manager-v1";

// Activate the new service worker immediately.
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

// Take control of open pages.
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Keep admin data and Supabase requests network-only.
// No recruiter information or CV links are cached.
self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Only handle requests to this website.
  if (url.origin !== self.location.origin) return;

  event.respondWith(fetch(request));
});
