// Mahler Reise — mock auth helpers for /app/* private area.
// Uses cookies (set server-side by Hono) + localStorage for UI state.

(function () {
  'use strict';

  const SESSION_KEY = 'mr_session_email';
  const COOKIE_NAME = 'mr_session';

  function getCookie(name) {
    const m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : null;
  }

  // Login form (POST to /api/auth/login). We post via fetch so we can show a brief
  // "sending magic link" animation before redirecting.
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = new FormData(loginForm);
      const email = String(data.get('email') || '').trim();
      if (!email) return;
      const btn = loginForm.querySelector('button[type=submit]');
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Magic link verzenden…';
      }
      // Brief delay for "magic link" feel.
      await new Promise((r) => setTimeout(r, 500));
      try {
        localStorage.setItem(SESSION_KEY, email);
      } catch (_) {}
      const res = await fetch('/api/auth/login', { method: 'POST', body: data });
      // Hono redirects to /app/dashboard; fetch follows automatically.
      if (res.redirected) {
        location.href = res.url;
      } else {
        location.href = '/app/dashboard';
      }
    });
  }

  // Logout buttons
  function bindLogout(id) {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener('click', async () => {
      try { localStorage.removeItem(SESSION_KEY); } catch (_) {}
      await fetch('/api/auth/logout', { method: 'POST' });
      location.href = '/app/login';
    });
  }
  bindLogout('logout-btn');
  bindLogout('logout-btn-page');

  // If we're on /app/* and the cookie is missing, kick back to login.
  // (Server already redirects, but this catches edge cases like back-button.)
  if (location.pathname.startsWith('/app/') && location.pathname !== '/app/login') {
    if (!getCookie(COOKIE_NAME)) {
      location.replace('/app/login');
    }
  }

  // Show "logged in as" indicator if a placeholder exists
  const indicator = document.getElementById('current-user-email');
  if (indicator) {
    const email = getCookie(COOKIE_NAME) || (() => {
      try { return localStorage.getItem(SESSION_KEY); } catch (_) { return null; }
    })();
    if (email) indicator.textContent = email;
  }
})();
