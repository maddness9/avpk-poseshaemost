// =====================================================================
// UI-КОМПОНЕНТЫ — тосты, модалки, форматирование
// =====================================================================

// =====================================================================
// НАБОР SVG-ИКОНОК (line-style, наследуют currentColor)
// =====================================================================
const ICON_PATHS = {
    grid:     '<rect x="3" y="3" width="7" height="7" rx="1.6"/><rect x="14" y="3" width="7" height="7" rx="1.6"/><rect x="3" y="14" width="7" height="7" rx="1.6"/><rect x="14" y="14" width="7" height="7" rx="1.6"/>',
    calendar: '<rect x="3" y="4.5" width="18" height="16" rx="2.5"/><path d="M3 9.5h18"/><path d="M8 2.5v4M16 2.5v4"/>',
    check:    '<circle cx="12" cy="12" r="9"/><path d="M8.4 12.3l2.4 2.4 4.8-5.2"/>',
    journal:  '<rect x="4" y="3" width="16" height="18" rx="2.2"/><path d="M9 3v18M4 9h16M4 15h5"/>',
    users:    '<path d="M16 19v-1.4a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4V19"/><circle cx="9" cy="7" r="3.3"/><path d="M22 19v-1.4a4 4 0 0 0-3-3.86"/><path d="M16 4.13a3.3 3.3 0 0 1 0 6.4"/>',
    layers:   '<path d="M12 3l9 4.8-9 4.8-9-4.8 9-4.8z"/><path d="M3 12.5l9 4.8 9-4.8"/>',
    teacher:  '<circle cx="9.5" cy="7" r="3.4"/><path d="M2.8 20v-1a5 5 0 0 1 5-5h2.4a5 5 0 0 1 3.6 1.5"/><path d="M15.5 16.5l2 2 4-4.2"/>',
    subjects: '<path d="M6 3.5h12a1 1 0 0 1 1 1V21l-7-3.9-7 3.9V4.5a1 1 0 0 1 1-1z"/>',
    download: '<path d="M12 3v12"/><path d="M7.5 10.5L12 15l4.5-4.5"/><path d="M4 20h16"/>',
    chart:    '<path d="M3 21h18"/><rect x="5" y="11" width="3.4" height="7" rx="1"/><rect x="10.3" y="5.5" width="3.4" height="12.5" rx="1"/><rect x="15.6" y="13.5" width="3.4" height="4.5" rx="1"/>',
    logout:   '<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/><path d="M10 16.5l4.5-4.5L10 7.5"/><path d="M14.5 12H3.5"/>',
    search:   '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
    bell:     '<path d="M18 8.5a6 6 0 0 0-12 0c0 6.5-2.8 8.5-2.8 8.5h17.6S18 15 18 8.5"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
    clock:    '<circle cx="12" cy="12" r="9"/><path d="M12 7.2v5l3.4 2"/>',
    plus:     '<path d="M12 5v14M5 12h14"/>',
    trash:    '<path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6.5 7l1 12.5a1 1 0 0 0 1 .95h7a1 1 0 0 0 1-.95L18 7"/>',
    back:     '<path d="M19 12H5M11 18l-6-6 6-6"/>',
    save:     '<path d="M5 12.5l4.4 4.4L19 7.2"/>',
    pin:      '<path d="M12 21s-7-5.4-7-11a7 7 0 0 1 14 0c0 5.6-7 11-7 11z"/><circle cx="12" cy="10" r="2.6"/>',
    mail:     '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.6 6.6L12 13l8.4-6.4"/>',
    phone:    '<path d="M5 4h3.4l1.6 5-2 1.3a13 13 0 0 0 5.6 5.6l1.3-2 5 1.6V20a1.8 1.8 0 0 1-2 1.8A16 16 0 0 1 3.2 6 1.8 1.8 0 0 1 5 4z"/>',
    info:     '<circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 7.8h.01"/>',
    user:     '<circle cx="12" cy="8" r="4"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/>',
    percent:  '<path d="M19 5L5 19"/><circle cx="7.5" cy="7.5" r="2.4"/><circle cx="16.5" cy="16.5" r="2.4"/>',
    inbox:    '<path d="M3 13l3-8h12l3 8"/><path d="M3 13v5a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-5"/><path d="M3 13h5l1.5 2.5h5L16 13h5"/>',
    chevron:  '<path d="M9 6l6 6-6 6"/>',
    sparkle:  '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z"/>',
    cap:      '<path d="M12 4L2 9l10 5 10-5-10-5z"/><path d="M5 11.4V16c0 1.5 3.1 3 7 3s7-1.5 7-3v-4.6"/><path d="M22 9v5.4"/>',
};

const UI = {
    // Иконки ==========================================================
    icon(name, cls = '') {
        const p = ICON_PATHS[name] || ICON_PATHS.inbox;
        return `<svg class="ico ${cls}" viewBox="0 0 24 24" aria-hidden="true">${p}</svg>`;
    },

    brandMark(cls = '') {
        return `<svg class="brand-mark ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICON_PATHS.cap}</svg>`;
    },

    // Тосты ===========================================================
    toast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    },
    
    success(msg) { this.toast(msg, 'success'); },
    error(msg) { this.toast(msg, 'error'); },
    warning(msg) { this.toast(msg, 'warning'); },
    
    // Модальные окна ==================================================
    modal(title, html) {
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-body').innerHTML = html;
        document.getElementById('modal').classList.remove('hidden');
    },
    
    closeModal() {
        document.getElementById('modal').classList.add('hidden');
    },
    
    confirm(message) {
        return new Promise(resolve => {
            const html = `
                <p style="margin-bottom: 20px; color: var(--text-secondary);">
                    ${message}
                </p>
                <div class="modal-actions">
                    <button class="btn-secondary" id="confirm-no">Отмена</button>
                    <button class="btn-danger" id="confirm-yes">Подтвердить</button>
                </div>
            `;
            this.modal('Подтверждение', html);
            
            document.getElementById('confirm-yes').onclick = () => {
                this.closeModal();
                resolve(true);
            };
            document.getElementById('confirm-no').onclick = () => {
                this.closeModal();
                resolve(false);
            };
        });
    },
    
    // Бейджи статусов посещаемости ====================================
    statusBadge(status) {
        const map = {
            present: ['badge-success', 'присутствовал'],
            absent: ['badge-danger', 'отсутствовал'],
            late: ['badge-warning', 'опоздал'],
            excused: ['badge-info', 'уваж. причина'],
        };
        const [cls, txt] = map[status] || ['badge-default', '—'];
        return `<span class="badge ${cls}">${txt}</span>`;
    },
    
    roleBadge(role) {
        const map = {
            admin: ['badge-danger', 'Администратор'],
            teacher: ['badge-info', 'Преподаватель'],
            student: ['badge-default', 'Студент'],
        };
        const [cls, txt] = map[role] || ['badge-default', role];
        return `<span class="badge ${cls}">${txt}</span>`;
    },
    
    // Загрузка ========================================================
    loader() {
        return '<div class="loader-container"><div class="loader"></div></div>';
    },
    
    emptyState(title, subtitle = '', icon = 'inbox') {
        const iconName = ICON_PATHS[icon] ? icon : 'inbox';
        return `
            <div class="empty-state">
                <div class="empty-state-icon">${this.icon(iconName)}</div>
                <div class="empty-state-title">${title}</div>
                <div>${subtitle}</div>
            </div>
        `;
    },
    
    // Форматирование ==================================================
    formatDate(dateStr) {
        if (!dateStr) return '—';
        const d = new Date(dateStr);
        return d.toLocaleDateString('ru-RU', { 
            day: '2-digit', month: '2-digit', year: 'numeric' 
        });
    },
    
    formatDateLong(dateStr) {
        if (!dateStr) return '—';
        const d = new Date(dateStr);
        const months = ['января','февраля','марта','апреля','мая','июня',
                        'июля','августа','сентября','октября','ноября','декабря'];
        const days = ['воскресенье','понедельник','вторник','среда',
                      'четверг','пятница','суббота'];
        return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    },
    
    todayISO() {
        return new Date().toISOString().slice(0, 10);
    },
    
    // Аватар по имени =================================================
    avatarLetters(name) {
        if (!name) return '?';
        const parts = name.trim().split(/\s+/);
        return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
    },
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    },
    
    // Перевод ошибок Firebase на русский =============================
    translateFirebaseError(code) {
        const map = {
            'auth/email-already-in-use': 'Пользователь с таким email уже зарегистрирован',
            'auth/invalid-email': 'Некорректный формат email',
            'auth/weak-password': 'Слишком слабый пароль (минимум 6 символов)',
            'auth/user-not-found': 'Пользователь не найден',
            'auth/wrong-password': 'Неверный пароль',
            'auth/invalid-credential': 'Неверный email или пароль',
            'auth/too-many-requests': 'Слишком много попыток. Попробуйте позже',
            'auth/network-request-failed': 'Ошибка сети. Проверьте подключение к интернету',
            'permission-denied': 'Недостаточно прав для выполнения операции'
        };
        return map[code] || null;
    }
};

window.UI = UI;

// Закрытие модалки по клику на оверлей
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        UI.closeModal();
    }
});

// Закрытие модалки по Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') UI.closeModal();
});
