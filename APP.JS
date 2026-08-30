'use strict';

// ── Shared helpers ────────────────────────────
const $ = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];

// ── Role-based redirect on login ─────────────
function handleLogin(e) {
  e.preventDefault();
  const role = $('#rol')?.value;
  const pages = {
    admin:    'pagina adinistracion.html',
    docente:  'docente.html',
    alumno:   'pagina alumnos inicio.html',
  };
  if (!role) { showToast('Selecciona tu rol', 'warn'); return; }
  window.location.href = pages[role] || 'pantalla de inicio.html';
}

// ── Toast notification ─────────────────────────
function showToast(msg, type = 'info') {
  let container = $('#toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText =
      'position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:8px;';
    document.body.appendChild(container);
  }
  const colors = { info:'#2E4B9E', success:'#27AE60', warn:'#E8A838', error:'#C0392B' };
  const toast = document.createElement('div');
  toast.style.cssText = `
    background:${colors[type]};color:#fff;padding:12px 20px;border-radius:8px;
    font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;
    box-shadow:0 4px 20px rgba(0,0,0,.18);
    animation:fadeUp .3s ease both;
    max-width:280px;
  `;
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ── Active nav link highlight ─────────────────
function setActiveNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  $$('.dash-nav .nav-links a, .pub-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && page.includes(href.replace('.html',''))) a.classList.add('active');
  });
}

// ── Sidebar active item ───────────────────────
function initSidebar() {
  $$('.sidebar-item[data-page]').forEach(item => {
    item.addEventListener('click', () => {
      $$('.sidebar-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });
}

// ── Cycle tabs (Notas docente) ────────────────
function initCycleTabs() {
  const tabs = $$('.cycle-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });
}

// ── Horario checkboxes ────────────────────────
function initHorario() {
  $$('.horario-option, .pago-option').forEach(opt => {
    const cb = opt.querySelector('input[type=checkbox], input[type=radio]');
    opt.addEventListener('click', () => {
      if (cb) cb.checked = !cb.checked;
      // visual toggle
      opt.style.borderColor = cb?.checked ? 'var(--accent)' : '';
    });
  });

  const form = $('#horario-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      showToast('¡Horario guardado exitosamente!', 'success');
    });
  }
}

// ── Notes saving ──────────────────────────────
function initNotas() {
  const btn = $('#btn-guardar-notas');
  if (btn) {
    btn.addEventListener('click', () => {
      // Compute averages for editable rows
      $$('.notas-table tbody tr').forEach(row => {
        const inputs = $$('input[type=number]', row);
        const avg = row.querySelector('.avg-cell');
        if (inputs.length && avg) {
          const vals = inputs.map(i => parseFloat(i.value) || 0);
          const mean = (vals.reduce((a,b)=>a+b,0) / vals.length).toFixed(1);
          avg.textContent = mean;
        }
      });
      showToast('Notas guardadas correctamente', 'success');
    });
  }
}

// ── Admin: approve/review matricula ──────────
function initAdmin() {
  $$('.btn-aprobar').forEach(btn => {
    btn.addEventListener('click', () => {
      const row = btn.closest('tr');
      const statusEl = row?.querySelector('.status-badge');
      if (statusEl) {
        statusEl.textContent = 'Aprobada';
        statusEl.className = 'badge badge-green status-badge';
      }
      btn.disabled = true; btn.textContent = 'Aprobado';
      showToast('Matrícula aprobada', 'success');
    });
  });

  $$('.btn-revisar').forEach(btn => {
    btn.addEventListener('click', () => {
      showToast('Matrícula enviada a revisión', 'warn');
    });
  });

  const newMatBtn = $('#btn-nueva-matricula');
  if (newMatBtn) {
    newMatBtn.addEventListener('click', () => {
      showToast('Módulo nueva matrícula próximamente', 'info');
    });
  }
}

// ── Salon virtual: seat click ─────────────────
function initSalon() {
  $$('.seat-avatar').forEach(seat => {
    seat.addEventListener('click', () => {
      const name = seat.dataset.name;
      if (name) showToast(`Alumno: ${name}`, 'info');
    });
  });

  const joinBtn = $('#btn-entrar-salon');
  if (joinBtn) {
    joinBtn.addEventListener('click', () => {
      showToast('Conectando al Salón Virtual…', 'info');
    });
  }
}

// ── Login form submit ─────────────────────────
const loginForm = $('#login-form');
if (loginForm) loginForm.addEventListener('submit', handleLogin);

// ── Register form ─────────────────────────────
const regForm = $('#register-form');
if (regForm) {
  regForm.addEventListener('submit', e => {
    e.preventDefault();
    const pwd = $('#password')?.value;
    const cpwd = $('#confirm-password')?.value;
    if (pwd !== cpwd) { showToast('Las contraseñas no coinciden', 'error'); return; }
    showToast('¡Registro exitoso! Redirigiendo…', 'success');
    setTimeout(() => window.location.href = 'index.html', 1500);
  });
}

// ── Inits ─────────────────────────────────────
setActiveNav();
initSidebar();
initCycleTabs();
initHorario();
initNotas();
initAdmin();
initSalon();