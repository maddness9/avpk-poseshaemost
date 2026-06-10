// =====================================================================
// UI-КОМПОНЕНТЫ — тосты, модалки, форматирование
// =====================================================================

const UI = {
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
    
    emptyState(title, subtitle = '', icon = '◯') {
        return `
            <div class="empty-state">
                <div class="empty-state-icon">${icon}</div>
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
