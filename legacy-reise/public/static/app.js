// Mahler Reise — minimal client-side JS.
// Mobile menu toggle + smooth UX touches. Edge-runtime independent.

(function () {
  'use strict';

  // Mobile menu
  const toggle = document.getElementById('mobile-menu-toggle');
  const menu = document.getElementById('mobile-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const isOpen = !menu.classList.contains('hidden');
      menu.classList.toggle('hidden');
      const icon = toggle.querySelector('i');
      if (icon) icon.className = isOpen ? 'fas fa-bars' : 'fas fa-times';
    });
  }

  // Newsletter / contact form: show toast on ?newsletter=ok or ?signup=ok
  const params = new URLSearchParams(location.search);
  if (params.has('newsletter') || params.has('signup')) {
    showToast(
      params.has('newsletter')
        ? 'Bedankt — je bent ingeschreven.'
        : 'Bedankt voor je voorinschrijving.'
    );
    // Clean URL
    history.replaceState(null, '', location.pathname);
  }

  function showToast(msg) {
    const el = document.createElement('div');
    el.textContent = msg;
    el.style.cssText =
      'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);' +
      'background:#2C5F4D;color:#FAF7F0;padding:12px 20px;border-radius:8px;' +
      'box-shadow:0 8px 24px rgba(0,0,0,.18);z-index:9999;font-family:"Crimson Text",serif;';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 4000);
  }
})();
