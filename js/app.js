// =====================================================================
// ГЛАВНЫЙ МОДУЛЬ ПРИЛОЖЕНИЯ
// Управление маршрутизацией, аутентификацией и состоянием
// =====================================================================

import { API } from './api.js';
import { Pages } from './pages.js';

const App = {
    currentUser: null,
    currentPage: 'dashboard',
    
    pageTitles: {
        dashboard: 'Главная',
        schedule: 'Расписание',
        attendance: 'Посещаемость',
        students: 'Студенты',
        groups: 'Группы',
        teachers: 'Преподаватели',
        subjects: 'Предметы',
        reports: 'Отчёты'
    },
    
    roleNames: {
        admin: 'Администратор',
        teacher: 'Преподаватель',
        student: 'Студент'
    },
    
    init() {
        // Текущая дата в шапке
        const dateEl = document.getElementById('current-date');
        if (dateEl) dateEl.textContent = UI.formatDateLong(UI.todayISO());
        
        // События формы входа
        document.getElementById('login-form').onsubmit = (e) => this.handleLogin(e);
        document.getElementById('register-form').onsubmit = (e) => this.handleRegister(e);
        document.getElementById('show-register').onclick = () => this.showRegister();
        document.getElementById('back-to-login').onclick = () => this.showLogin();
        
        // Слушаем изменения авторизации Firebase
        API.onAuthChange((user) => {
            if (user) {
                this.currentUser = user;
                this.showApp();
            } else {
                this.showLogin();
            }
        });
    },
    
    // ----- АУТЕНТИФИКАЦИЯ -----
    async handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errEl = document.getElementById('login-error');
        const btn = document.getElementById('login-btn');
        
        errEl.textContent = '';
        btn.disabled = true;
        btn.textContent = 'Вход...';
        
        try {
            await API.login(email, password);
            // onAuthChange сработает автоматически
        } catch (err) {
            errEl.textContent = UI.translateFirebaseError(err.code) || err.message;
            btn.disabled = false;
            btn.textContent = 'Войти';
        }
    },
    
    async handleRegister(e) {
        e.preventDefault();
        const fd = new FormData(e.target);
        const data = Object.fromEntries(fd);
        const errEl = document.getElementById('register-error');
        const btn = document.getElementById('register-btn');
        
        errEl.textContent = '';
        btn.disabled = true;
        btn.textContent = 'Регистрация...';
        
        try {
            await API.register(data.email, data.password, {
                full_name: data.full_name,
                role: data.role
            });
            UI.success('Регистрация прошла успешно');
            // onAuthChange сработает автоматически
        } catch (err) {
            errEl.textContent = UI.translateFirebaseError(err.code) || err.message;
            btn.disabled = false;
            btn.textContent = 'Зарегистрироваться';
        }
    },
    
    showLogin() {
        document.getElementById('login-screen').classList.remove('hidden');
        document.getElementById('register-screen').classList.add('hidden');
        document.getElementById('app').classList.add('hidden');
        
        // Сбрасываем формы
        document.getElementById('login-form').reset();
        document.getElementById('login-error').textContent = '';
        const btn = document.getElementById('login-btn');
        if (btn) { btn.disabled = false; btn.textContent = 'Войти'; }
    },
    
    showRegister() {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('register-screen').classList.remove('hidden');
        document.getElementById('app').classList.add('hidden');
    },
    
    showApp() {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('register-screen').classList.add('hidden');
        document.getElementById('app').classList.remove('hidden');
        
        // Информация о пользователе
        document.getElementById('user-name').textContent = this.currentUser.full_name || '—';
        document.getElementById('user-role').textContent = this.roleNames[this.currentUser.role] || this.currentUser.role;
        document.getElementById('user-avatar').textContent = UI.avatarLetters(this.currentUser.full_name);
        
        // Скрываем недоступные пункты меню
        document.querySelectorAll('.nav-item[data-role]').forEach(item => {
            const allowed = item.dataset.role.split(',');
            item.style.display = allowed.includes(this.currentUser.role) ? '' : 'none';
        });
        
        // Привязка событий навигации
        document.querySelectorAll('.nav-item').forEach(item => {
            item.onclick = (e) => {
                e.preventDefault();
                this.navigate(item.dataset.page);
            };
        });
        
        // Выход
        document.getElementById('logout-btn').onclick = () => this.logout();
        
        // Мобильное меню (гамбургер)
        this.initMobileMenu();
        
        this.navigate('dashboard');
    },
    
    // ----- МОБИЛЬНОЕ МЕНЮ -----
    initMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        const toggle = document.getElementById('menu-toggle');
        
        const open = () => {
            sidebar.classList.add('open');
            overlay.classList.add('show');
        };
        const close = () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('show');
        };
        
        if (toggle) toggle.onclick = open;
        if (overlay) overlay.onclick = close;
        
        // Сохраняем функцию закрытия, чтобы вызывать при переходе на страницу
        this._closeMobileMenu = close;
    },
    
    async logout() {
        try {
            await API.logout();
            this.currentUser = null;
            UI.success('Вы вышли из системы');
        } catch (e) {
            UI.error(e.message);
        }
    },
    
    // ----- РОУТИНГ -----
    navigate(page) {
        this.currentPage = page;
        
        // Закрываем мобильное меню при переходе
        if (this._closeMobileMenu) this._closeMobileMenu();
        
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.page === page);
        });
        
        document.getElementById('page-title').textContent = this.pageTitles[page] || page;
        
        if (Pages[page]) {
            Pages[page]();
        } else {
            document.getElementById('page-content').innerHTML = UI.emptyState('Страница не найдена', '', '?');
        }
    },
    
    // ----- ПРОВЕРКА РОЛЕЙ -----
    hasRole(...roles) {
        return this.currentUser && roles.includes(this.currentUser.role);
    }
};

window.App = App;

document.addEventListener('DOMContentLoaded', () => App.init());
