/* =====================================================================
   АВПК — Автоматизированная система учёта посещаемости
   Файл стилей style.css
   ===================================================================== */

:root {
    /* Цвета — академическая палитра АВПК */
    --bg-primary: #faf8f3;
    --bg-secondary: #ffffff;
    --bg-tertiary: #f4f1ea;
    --bg-dark: #14213d;
    --bg-darker: #0d1a30;
    --bg-card: #ffffff;
    
    --text-primary: #14213d;
    --text-secondary: #5a5f73;
    --text-muted: #8a8f9f;
    --text-on-dark: #ffffff;
    
    --accent: #1e4d9f;
    --accent-dark: #163b7d;
    --accent-light: #e8efff;
    --accent-gold: #d4a017;
    
    --success: #16a34a;
    --success-light: #dcfce7;
    --warning: #f59e0b;
    --warning-light: #fef3c7;
    --danger: #dc2626;
    --danger-light: #fee2e2;
    --info: #0891b2;
    --info-light: #cffafe;
    
    --border: #e5e1d6;
    --border-light: #f0ebe0;
    
    --shadow-sm: 0 1px 2px rgba(20, 25, 50, 0.04);
    --shadow-md: 0 2px 8px rgba(20, 25, 50, 0.06);
    --shadow-lg: 0 8px 24px rgba(20, 25, 50, 0.08);
    --shadow-xl: 0 16px 48px rgba(20, 25, 50, 0.12);
    
    --font-display: 'Fraunces', Georgia, serif;
    --font-body: 'Manrope', -apple-system, sans-serif;
    
    --radius-sm: 6px;
    --radius-md: 10px;
    --radius-lg: 16px;
    --radius-xl: 24px;
    
    --transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Сброс ================================================== */
*, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

html, body {
    height: 100%;
    font-family: var(--font-body);
    font-size: 15px;
    line-height: 1.5;
    color: var(--text-primary);
    background: var(--bg-primary);
    -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4 {
    font-family: var(--font-display);
    font-weight: 600;
    letter-spacing: -0.02em;
    color: var(--text-primary);
}

a { color: inherit; text-decoration: none; }
button { font-family: inherit; cursor: pointer; border: none; background: none; }
input, select, textarea { font-family: inherit; font-size: inherit; }

.hidden { display: none !important; }

/* =====================================================================
   ЭКРАН ВХОДА / РЕГИСТРАЦИИ — двухколоночный
   ===================================================================== */
.login-screen {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    position: relative;
    overflow: hidden;
}

.login-bg-pattern {
    position: absolute;
    inset: 0;
    background-image: 
        radial-gradient(circle at 20% 30%, rgba(30, 77, 159, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 80% 70%, rgba(212, 160, 23, 0.1) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
}

/* Левая сторона — брендинг АВПК */
.login-side {
    background: linear-gradient(135deg, #14213d 0%, #1e4d9f 100%);
    color: white;
    padding: 60px 50px;
    display: flex;
    align-items: center;
    position: relative;
    overflow: hidden;
}

.login-side::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: 
        linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none;
}

.login-side::after {
    content: '';
    position: absolute;
    top: -100px;
    right: -100px;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(212, 160, 23, 0.15) 0%, transparent 70%);
    border-radius: 50%;
}

.login-side-content {
    position: relative;
    z-index: 1;
    max-width: 480px;
}

.college-emblem {
    margin-bottom: 32px;
    display: inline-flex;
    padding: 12px;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 50%;
    border: 2px solid rgba(212, 160, 23, 0.4);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
}

.college-logo-img {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    display: block;
    object-fit: contain;
}

.sidebar-logo-img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: contain;
    background: rgba(255, 255, 255, 0.95);
    padding: 2px;
    flex-shrink: 0;
}

.college-name {
    font-family: var(--font-display);
    font-size: 42px;
    font-weight: 700;
    line-height: 1.15;
    letter-spacing: -0.02em;
    margin-bottom: 20px;
    color: white;
}

.college-name span {
    color: var(--accent-gold);
    font-style: italic;
    font-weight: 600;
}

.college-tagline {
    font-size: 18px;
    color: rgba(255,255,255,0.85);
    line-height: 1.5;
    margin-bottom: 40px;
    font-weight: 500;
}

.college-features {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.feature-item {
    color: rgba(255,255,255,0.9);
    font-size: 15px;
    display: flex;
    align-items: center;
    gap: 12px;
}

.feature-bullet {
    color: var(--accent-gold);
    font-size: 16px;
}

/* Правая сторона — форма */
.login-form-side {
    background: var(--bg-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
    position: relative;
    z-index: 1;
}

.login-form-side-full {
    grid-column: 1 / -1;
    background: linear-gradient(135deg, #14213d 0%, #1e4d9f 100%);
}

.login-card {
    background: var(--bg-card);
    border-radius: var(--radius-xl);
    padding: 48px 40px;
    width: 100%;
    max-width: 440px;
    box-shadow: var(--shadow-xl);
    position: relative;
    animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.login-card-wide { max-width: 520px; }

@keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

.login-title {
    font-size: 30px;
    font-weight: 700;
    margin-bottom: 6px;
    color: var(--text-primary);
}

.login-subtitle {
    color: var(--text-secondary);
    margin-bottom: 32px;
    font-size: 14px;
}

.login-form {
    display: flex;
    flex-direction: column;
    gap: 18px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.form-group label {
    font-size: 12px;
    font-weight: 700;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.form-group input,
.form-group select,
.form-group textarea {
    padding: 12px 16px;
    border: 1.5px solid var(--border);
    border-radius: var(--radius-md);
    background: var(--bg-primary);
    color: var(--text-primary);
    transition: var(--transition);
    outline: none;
    font-size: 14px;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    border-color: var(--accent);
    background: var(--bg-card);
    box-shadow: 0 0 0 4px var(--accent-light);
}

.error-message {
    color: var(--danger);
    font-size: 13px;
    min-height: 18px;
    font-weight: 500;
}

.login-separator {
    text-align: center;
    margin: 24px 0;
    color: var(--text-muted);
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    position: relative;
}

.login-separator::before,
.login-separator::after {
    content: '';
    position: absolute;
    top: 50%;
    width: calc(50% - 30px);
    height: 1px;
    background: var(--border);
}
.login-separator::before { left: 0; }
.login-separator::after { right: 0; }

.login-footer {
    margin-top: 32px;
    text-align: center;
    color: var(--text-muted);
}

.back-btn {
    position: absolute;
    top: 20px;
    left: 20px;
    color: var(--text-secondary);
    font-size: 13px;
    padding: 6px 10px;
    border-radius: var(--radius-sm);
    transition: var(--transition);
}

.back-btn:hover {
    background: var(--bg-tertiary);
}

/* =====================================================================
   КНОПКИ
   ===================================================================== */
.btn-primary, .btn-secondary, .btn-danger, .btn-ghost, .btn-success {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 20px;
    border-radius: var(--radius-md);
    font-weight: 600;
    font-size: 14px;
    transition: var(--transition);
    cursor: pointer;
    border: none;
    white-space: nowrap;
}

.btn-primary {
    background: var(--accent);
    color: white;
}
.btn-primary:hover { background: var(--accent-dark); transform: translateY(-1px); box-shadow: var(--shadow-md); }
.btn-primary:disabled { background: var(--text-muted); cursor: not-allowed; transform: none; }

.btn-secondary {
    background: var(--bg-tertiary);
    color: var(--text-primary);
    border: 1px solid var(--border);
}
.btn-secondary:hover { background: var(--border-light); }

.btn-danger {
    background: var(--danger);
    color: white;
}
.btn-danger:hover { background: #b91c1c; }

.btn-success {
    background: var(--success);
    color: white;
}
.btn-success:hover { background: #15803d; }

.btn-ghost {
    background: transparent;
    color: rgba(255,255,255,0.7);
    border: 1px solid rgba(255,255,255,0.15);
}
.btn-ghost:hover { background: rgba(255,255,255,0.06); color: var(--text-on-dark); }

.btn-large { padding: 14px 24px; font-size: 15px; }
.btn-sm { padding: 6px 12px; font-size: 13px; }
.btn-block { width: 100%; }

/* =====================================================================
   ОСНОВНОЙ ЛЕЙАУТ
   ===================================================================== */
.app {
    display: grid;
    grid-template-columns: 260px 1fr;
    min-height: 100vh;
}

/* Боковое меню ============================================ */
.sidebar {
    background: var(--bg-dark);
    color: var(--text-on-dark);
    padding: 24px 16px;
    display: flex;
    flex-direction: column;
    position: sticky;
    top: 0;
    height: 100vh;
}

.sidebar-brand {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0 12px 24px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
    margin-bottom: 24px;
    color: var(--accent-gold);
}

.brand-title {
    font-family: var(--font-display);
    font-size: 22px;
    font-weight: 800;
    color: var(--text-on-dark);
    letter-spacing: -0.02em;
    line-height: 1;
}

.brand-sub {
    font-size: 11px;
    color: rgba(255,255,255,0.5);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-top: 2px;
}

.sidebar-nav {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
}

.nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 11px 14px;
    border-radius: var(--radius-md);
    color: rgba(255,255,255,0.7);
    font-size: 14px;
    font-weight: 500;
    transition: var(--transition);
    cursor: pointer;
}

.nav-item:hover {
    background: rgba(255,255,255,0.06);
    color: var(--text-on-dark);
}

.nav-item.active {
    background: var(--accent);
    color: white;
    box-shadow: 0 4px 12px rgba(30, 77, 159, 0.4);
}

.nav-icon {
    font-size: 18px;
    width: 20px;
    text-align: center;
}

.sidebar-footer {
    padding-top: 16px;
    border-top: 1px solid rgba(255,255,255,0.08);
}

.user-info {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    margin-bottom: 8px;
}

.user-avatar {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--accent) 0%, var(--accent-gold) 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 14px;
    flex-shrink: 0;
}

.user-name {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-on-dark);
    line-height: 1.3;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 160px;
}

.user-role {
    font-size: 11px;
    color: rgba(255,255,255,0.5);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-top: 2px;
}

#logout-btn { width: 100%; padding: 10px; }

/* Основная область ======================================== */
.main-content {
    background: var(--bg-primary);
    padding: 32px 40px;
    overflow-x: hidden;
}

.main-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 32px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--border);
}

.main-header h2 {
    font-size: 32px;
    font-weight: 600;
    color: var(--text-primary);
}

.header-meta {
    color: var(--text-muted);
    font-size: 13px;
    font-weight: 500;
    margin-top: 4px;
}

/* =====================================================================
   КАРТОЧКИ И ВИДЖЕТЫ
   ===================================================================== */
.card {
    background: var(--bg-card);
    border-radius: var(--radius-lg);
    padding: 24px;
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border-light);
}

.info-note {
    padding: 12px 16px;
    background: var(--accent-light);
    color: var(--accent-dark);
    border-radius: var(--radius-md);
    font-size: 13px;
    margin-bottom: 20px;
    border-left: 3px solid var(--accent);
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 16px;
    margin-bottom: 32px;
}

.stat-card {
    background: var(--bg-card);
    border-radius: var(--radius-lg);
    padding: 24px;
    border: 1px solid var(--border-light);
    transition: var(--transition);
    position: relative;
    overflow: hidden;
}

.stat-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}

.stat-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: var(--accent);
}

.stat-card.success::before { background: var(--success); }
.stat-card.warning::before { background: var(--warning); }
.stat-card.danger::before { background: var(--danger); }
.stat-card.info::before { background: var(--info); }

.stat-label {
    font-size: 12px;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 600;
    margin-bottom: 8px;
}

.stat-value {
    font-family: var(--font-display);
    font-size: 36px;
    font-weight: 700;
    color: var(--text-primary);
    line-height: 1;
}

.stat-suffix {
    font-size: 16px;
    color: var(--text-muted);
    font-family: var(--font-body);
    font-weight: 500;
    margin-left: 4px;
}

/* =====================================================================
   ТАБЛИЦЫ
   ===================================================================== */
.table-container {
    background: var(--bg-card);
    border-radius: var(--radius-lg);
    border: 1px solid var(--border-light);
    overflow: hidden;
    box-shadow: var(--shadow-sm);
}

.table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid var(--border-light);
}

.table-header h3 {
    font-size: 18px;
    font-weight: 600;
}

table {
    width: 100%;
    border-collapse: collapse;
}

table thead {
    background: var(--bg-tertiary);
}

table th {
    text-align: left;
    padding: 12px 24px;
    font-size: 12px;
    font-weight: 700;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 1px solid var(--border);
}

table td {
    padding: 14px 24px;
    border-bottom: 1px solid var(--border-light);
    font-size: 14px;
}

table tbody tr {
    transition: background 0.15s;
}

table tbody tr:hover {
    background: var(--bg-tertiary);
}

table tbody tr:last-child td {
    border-bottom: none;
}

/* Бейджи статусов ======================================== */
.badge {
    display: inline-block;
    padding: 4px 10px;
    border-radius: var(--radius-sm);
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.03em;
}

.badge-success { background: var(--success-light); color: var(--success); }
.badge-warning { background: var(--warning-light); color: var(--warning); }
.badge-danger  { background: var(--danger-light); color: var(--danger); }
.badge-info    { background: var(--info-light); color: var(--info); }
.badge-default { background: var(--bg-tertiary); color: var(--text-secondary); }

/* =====================================================================
   ПОСЕЩАЕМОСТЬ
   ===================================================================== */
.attendance-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.attendance-row {
    display: grid;
    grid-template-columns: 1fr auto auto;
    align-items: center;
    gap: 16px;
    padding: 14px 20px;
    background: var(--bg-card);
    border: 1px solid var(--border-light);
    border-radius: var(--radius-md);
    transition: var(--transition);
}

.attendance-row:hover {
    border-color: var(--border);
    box-shadow: var(--shadow-sm);
}

.attendance-student {
    display: flex;
    align-items: center;
    gap: 12px;
}

.attendance-name {
    font-weight: 600;
    color: var(--text-primary);
}

.attendance-card {
    color: var(--text-muted);
    font-size: 13px;
}

.status-selector {
    display: flex;
    gap: 4px;
    background: var(--bg-tertiary);
    padding: 4px;
    border-radius: var(--radius-md);
}

.status-btn {
    padding: 6px 14px;
    border-radius: var(--radius-sm);
    font-size: 13px;
    font-weight: 600;
    transition: var(--transition);
    color: var(--text-secondary);
    background: transparent;
    cursor: pointer;
    border: none;
}

.status-btn:hover { color: var(--text-primary); }

.status-btn.active.present { background: var(--success); color: white; }
.status-btn.active.absent  { background: var(--danger); color: white; }
.status-btn.active.late    { background: var(--warning); color: white; }
.status-btn.active.excused { background: var(--info); color: white; }

/* =====================================================================
   ФИЛЬТРЫ
   ===================================================================== */
.filters-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: end;
    margin-bottom: 24px;
    padding: 20px;
    background: var(--bg-card);
    border: 1px solid var(--border-light);
    border-radius: var(--radius-lg);
}

.filters-bar .form-group {
    flex: 1;
    min-width: 180px;
}

.filters-bar input, 
.filters-bar select { 
    padding: 10px 14px; 
    font-size: 14px;
}

/* =====================================================================
   МОДАЛЬНОЕ ОКНО
   ===================================================================== */
.modal {
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.modal-overlay {
    position: absolute;
    inset: 0;
    background: rgba(20, 33, 61, 0.5);
    backdrop-filter: blur(4px);
    animation: fadeIn 0.2s ease-out;
}

.modal-content {
    position: relative;
    background: var(--bg-card);
    border-radius: var(--radius-lg);
    width: 100%;
    max-width: 540px;
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: var(--shadow-xl);
    animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    border-bottom: 1px solid var(--border-light);
}

.modal-header h3 { font-size: 20px; }

.modal-close {
    width: 32px;
    height: 32px;
    border-radius: var(--radius-sm);
    color: var(--text-muted);
    font-size: 24px;
    line-height: 1;
    transition: var(--transition);
}

.modal-close:hover {
    background: var(--bg-tertiary);
    color: var(--text-primary);
}

.modal-body {
    padding: 24px;
    overflow-y: auto;
}

.modal-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding-top: 8px;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

/* =====================================================================
   ТОСТЫ
   ===================================================================== */
.toast-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 2000;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.toast {
    background: var(--bg-card);
    padding: 14px 20px;
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    border-left: 4px solid var(--accent);
    min-width: 280px;
    animation: toastIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    font-weight: 500;
    font-size: 14px;
}

.toast.success { border-left-color: var(--success); }
.toast.error { border-left-color: var(--danger); }
.toast.warning { border-left-color: var(--warning); }

@keyframes toastIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

/* =====================================================================
   ДАШБОРД
   ===================================================================== */
.dashboard-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 24px;
    margin-top: 24px;
}

.chart-card { padding: 24px; }
.chart-card h4 { font-size: 16px; margin-bottom: 16px; }

.progress-bar {
    height: 8px;
    background: var(--bg-tertiary);
    border-radius: 4px;
    overflow: hidden;
    margin-top: 6px;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--accent), var(--success));
    border-radius: 4px;
    transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.top-groups-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.top-group-item {
    display: flex;
    align-items: center;
    gap: 12px;
}

.top-group-rank {
    font-family: var(--font-display);
    font-size: 24px;
    font-weight: 700;
    color: var(--accent);
    width: 32px;
}

.top-group-info { flex: 1; }
.top-group-name { font-weight: 600; margin-bottom: 4px; }
.top-group-rate { font-size: 13px; color: var(--text-muted); }

.status-distribution {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-top: 16px;
}

.status-dist-item {
    padding: 14px 16px;
    background: var(--bg-tertiary);
    border-radius: var(--radius-md);
    border-left: 3px solid;
}

.status-dist-item.present { border-color: var(--success); }
.status-dist-item.absent  { border-color: var(--danger); }
.status-dist-item.late    { border-color: var(--warning); }
.status-dist-item.excused { border-color: var(--info); }

.status-dist-label {
    font-size: 12px;
    color: var(--text-secondary);
    margin-bottom: 4px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 600;
}

.status-dist-value {
    font-family: var(--font-display);
    font-size: 24px;
    font-weight: 700;
}

/* =====================================================================
   РАСПИСАНИЕ
   ===================================================================== */
.schedule-day {
    background: var(--bg-card);
    border-radius: var(--radius-lg);
    border: 1px solid var(--border-light);
    overflow: hidden;
    margin-bottom: 16px;
}

.schedule-day-header {
    padding: 16px 24px;
    background: var(--bg-tertiary);
    font-weight: 700;
    font-family: var(--font-display);
    font-size: 18px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.schedule-day-header .day-meta {
    font-family: var(--font-body);
    font-weight: 500;
    color: var(--text-muted);
    font-size: 14px;
}

.lesson-row {
    display: grid;
    grid-template-columns: 60px 1fr auto auto;
    align-items: center;
    gap: 16px;
    padding: 14px 24px;
    border-bottom: 1px solid var(--border-light);
    transition: var(--transition);
}

.lesson-row:hover { background: var(--bg-tertiary); }
.lesson-row:last-child { border-bottom: none; }

.lesson-number {
    font-family: var(--font-display);
    font-size: 24px;
    font-weight: 700;
    color: var(--accent);
}

.lesson-info-title { font-weight: 600; margin-bottom: 4px; }
.lesson-info-meta { font-size: 13px; color: var(--text-muted); }

.lesson-classroom {
    padding: 4px 10px;
    background: var(--accent-light);
    color: var(--accent);
    font-weight: 600;
    font-size: 13px;
    border-radius: var(--radius-sm);
}

/* =====================================================================
   ПУСТЫЕ СОСТОЯНИЯ И ЗАГРУЗКА
   ===================================================================== */
.empty-state {
    text-align: center;
    padding: 60px 20px;
    color: var(--text-muted);
}

.empty-state-icon {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.5;
}

.empty-state-title {
    font-family: var(--font-display);
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 8px;
    color: var(--text-secondary);
}

.loader {
    display: inline-block;
    width: 24px;
    height: 24px;
    border: 3px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.loader-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 60px;
}

/* =====================================================================
   МОБИЛЬНОЕ МЕНЮ — гамбургер и оверлей
   ===================================================================== */
.header-left {
    display: flex;
    align-items: center;
    gap: 14px;
}

.menu-toggle {
    display: none;
    flex-direction: column;
    justify-content: center;
    gap: 5px;
    width: 42px;
    height: 42px;
    border-radius: var(--radius-md);
    background: var(--bg-card);
    border: 1px solid var(--border);
    padding: 0 10px;
    flex-shrink: 0;
    transition: var(--transition);
}

.menu-toggle:hover { background: var(--bg-tertiary); }

.menu-toggle span {
    display: block;
    height: 2.5px;
    width: 100%;
    background: var(--text-primary);
    border-radius: 2px;
    transition: var(--transition);
}

.sidebar-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(20, 33, 61, 0.5);
    backdrop-filter: blur(2px);
    z-index: 998;
    animation: fadeIn 0.2s ease-out;
}

.sidebar-overlay.show { display: block; }

/* =====================================================================
   АДАПТИВНОСТЬ
   ===================================================================== */
/* --- Планшеты (до 1024px) --- */
@media (max-width: 1024px) {
    .login-screen { grid-template-columns: 1fr; }
    .login-side { display: none; }
    .app { grid-template-columns: 200px 1fr; }
    .main-content { padding: 24px 20px; }
    .dashboard-grid { grid-template-columns: 1fr; }
    .sidebar { padding: 20px 12px; }
    .nav-item { padding: 10px 12px; font-size: 13px; }
    .main-header h2 { font-size: 26px; }
}

/* --- Мобильные и малые планшеты (до 768px) --- */
@media (max-width: 768px) {
    /* Меню превращается в выезжающую панель */
    .app { grid-template-columns: 1fr; }
    .sidebar {
        position: fixed;
        top: 0;
        left: -100%;
        z-index: 999;
        width: 260px;
        height: 100vh;
        transition: left 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        box-shadow: var(--shadow-xl);
    }
    .sidebar.open { left: 0; }

    /* Показываем кнопку-гамбургер */
    .menu-toggle { display: flex; }

    .main-content { padding: 16px; }
    .main-header {
        margin-bottom: 20px;
        padding-bottom: 16px;
    }
    .main-header h2 { font-size: 22px; }
    .header-meta { font-size: 12px; }

    /* Статистика — в одну колонку шире */
    .stats-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
    }
    .stat-card { padding: 16px; }
    .stat-value { font-size: 28px; }

    .status-distribution { grid-template-columns: 1fr; }

    /* Фильтры — вертикально */
    .filters-bar {
        flex-direction: column;
        align-items: stretch;
        padding: 16px;
    }
    .filters-bar .form-group { min-width: 0; width: 100%; }
    .filters-bar button { width: 100%; }

    /* Таблицы — горизонтальная прокрутка вместо вылезания за экран */
    .table-container { overflow-x: auto; }
    table { min-width: 560px; }
    table th, table td { padding: 10px 14px; font-size: 13px; }

    /* Расписание */
    .lesson-row {
        grid-template-columns: 44px 1fr;
        gap: 8px 12px;
    }
    .lesson-row > *:nth-child(3),
    .lesson-row > *:nth-child(4) {
        grid-column: 2;
        justify-self: start;
    }
    .schedule-day-header { padding: 14px 16px; font-size: 16px; }
    .lesson-number { font-size: 20px; }

    /* Посещаемость — карточки в столбик */
    .attendance-row {
        grid-template-columns: 1fr;
        gap: 12px;
    }
    .status-selector {
        width: 100%;
        justify-content: space-between;
    }
    .status-btn { flex: 1; padding: 8px 6px; font-size: 12px; }

    /* Модалки на всю ширину */
    .modal { padding: 12px; }
    .modal-content { max-width: 100%; }

    /* Регистрация */
    .login-card { padding: 32px 24px; }
    .login-card-wide { max-width: 100%; }

    /* Тосты не вылезают за край */
    .toast-container {
        top: 12px;
        right: 12px;
        left: 12px;
    }
    .toast { min-width: 0; width: 100%; }
}

/* --- Маленькие телефоны (до 480px) --- */
@media (max-width: 480px) {
    .stats-grid { grid-template-columns: 1fr; }
    .main-header h2 { font-size: 20px; }
    .login-card { padding: 24px 18px; }
    .login-title { font-size: 24px; }
    .stat-value { font-size: 32px; }
    .btn-primary, .btn-secondary, .btn-danger, .btn-success {
        padding: 10px 16px;
    }
    .table-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }
}
