// =====================================================================
// СТРАНИЦЫ ПРИЛОЖЕНИЯ
// =====================================================================

import { API } from './api.js';

export const Pages = {
    
    // ================================================================
    // ГЛАВНАЯ — дашборд
    // ================================================================
    async dashboard() {
        const content = document.getElementById('page-content');
        content.innerHTML = UI.loader();
        
        try {
            const stats = await API.getDashboardStats();
            
            const statusDist = stats.status_distribution || {};
            const total = Object.values(statusDist).reduce((a, b) => a + b, 0) || 1;
            
            content.innerHTML = `
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-label">Студенты</div>
                        <div class="stat-value">${stats.total_students}</div>
                    </div>
                    <div class="stat-card info">
                        <div class="stat-label">Группы</div>
                        <div class="stat-value">${stats.total_groups}</div>
                    </div>
                    <div class="stat-card warning">
                        <div class="stat-label">Преподаватели</div>
                        <div class="stat-value">${stats.total_teachers}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">Предметы</div>
                        <div class="stat-value">${stats.total_subjects}</div>
                    </div>
                    <div class="stat-card success">
                        <div class="stat-label">Занятий сегодня</div>
                        <div class="stat-value">${stats.today_lessons}</div>
                    </div>
                    <div class="stat-card ${stats.attendance_rate >= 85 ? 'success' : stats.attendance_rate >= 70 ? 'warning' : 'danger'}">
                        <div class="stat-label">Посещаемость</div>
                        <div class="stat-value">${stats.attendance_rate}<span class="stat-suffix">%</span></div>
                    </div>
                </div>
                
                <div class="dashboard-grid">
                    <div class="card chart-card">
                        <h4>Распределение статусов посещаемости</h4>
                        <div class="status-distribution">
                            <div class="status-dist-item present">
                                <div class="status-dist-label">Присутствовали</div>
                                <div class="status-dist-value">${statusDist.present || 0}</div>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width:${(statusDist.present||0)/total*100}%; background: var(--success)"></div>
                                </div>
                            </div>
                            <div class="status-dist-item absent">
                                <div class="status-dist-label">Отсутствовали</div>
                                <div class="status-dist-value">${statusDist.absent || 0}</div>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width:${(statusDist.absent||0)/total*100}%; background: var(--danger)"></div>
                                </div>
                            </div>
                            <div class="status-dist-item late">
                                <div class="status-dist-label">Опоздания</div>
                                <div class="status-dist-value">${statusDist.late || 0}</div>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width:${(statusDist.late||0)/total*100}%; background: var(--warning)"></div>
                                </div>
                            </div>
                            <div class="status-dist-item excused">
                                <div class="status-dist-label">Уваж. причина</div>
                                <div class="status-dist-value">${statusDist.excused || 0}</div>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width:${(statusDist.excused||0)/total*100}%; background: var(--info)"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card chart-card">
                        <h4>Топ групп по посещаемости</h4>
                        <div class="top-groups-list">
                            ${(stats.top_groups || []).length ? stats.top_groups.map((g, i) => `
                                <div class="top-group-item">
                                    <div class="top-group-rank">${i+1}</div>
                                    <div class="top-group-info">
                                        <div class="top-group-name">${UI.escapeHtml(g.name)}</div>
                                        <div class="top-group-rate">${g.rate || 0}%</div>
                                        <div class="progress-bar">
                                            <div class="progress-fill" style="width:${g.rate||0}%"></div>
                                        </div>
                                    </div>
                                </div>
                            `).join('') : UI.emptyState('Нет данных', 'Пока нет статистики по группам')}
                        </div>
                    </div>
                </div>
            `;
        } catch (e) {
            content.innerHTML = UI.emptyState('Ошибка загрузки', e.message);
            console.error(e);
        }
    },
    
    // ================================================================
    // РАСПИСАНИЕ
    // ================================================================
    async schedule() {
        const content = document.getElementById('page-content');
        const today = UI.todayISO();
        const weekLater = new Date();
        weekLater.setDate(weekLater.getDate() + 7);
        
        content.innerHTML = `
            <div class="filters-bar">
                <div class="form-group">
                    <label>С даты</label>
                    <input type="date" id="filter-date-from" value="${today}">
                </div>
                <div class="form-group">
                    <label>По дату</label>
                    <input type="date" id="filter-date-to" value="${weekLater.toISOString().slice(0,10)}">
                </div>
                <div class="form-group">
                    <label>Группа</label>
                    <select id="filter-group"><option value="">Все группы</option></select>
                </div>
                <button class="btn-primary" id="load-schedule-btn">Показать</button>
                ${App.hasRole('admin', 'teacher') ? 
                    `<button class="btn-secondary" id="add-schedule-btn">+ Добавить</button>` : ''}
            </div>
            <div id="schedule-list">${UI.loader()}</div>
        `;
        
        // Заполняем список групп
        try {
            const groups = await API.getGroups();
            const sel = document.getElementById('filter-group');
            groups.forEach(g => {
                sel.innerHTML += `<option value="${g.id}">${UI.escapeHtml(g.name)}</option>`;
            });
        } catch (e) {}
        
        document.getElementById('load-schedule-btn').onclick = () => this.loadSchedule();
        const addBtn = document.getElementById('add-schedule-btn');
        if (addBtn) addBtn.onclick = () => this.scheduleModal();
        
        this.loadSchedule();
    },
    
    async loadSchedule() {
        const dateFrom = document.getElementById('filter-date-from')?.value;
        const dateTo = document.getElementById('filter-date-to')?.value;
        const groupId = document.getElementById('filter-group')?.value;
        const listEl = document.getElementById('schedule-list');
        
        listEl.innerHTML = UI.loader();
        
        try {
            const filters = {};
            if (dateFrom) filters.date_from = dateFrom;
            if (dateTo) filters.date_to = dateTo;
            if (groupId) filters.group_id = groupId;
            
            const lessons = await API.getSchedule(filters);
            
            if (!lessons.length) {
                listEl.innerHTML = UI.emptyState('Нет занятий', 'В выбранный период занятий не запланировано', '▤');
                return;
            }
            
            // Группируем по датам
            const byDate = {};
            lessons.forEach(l => {
                if (!byDate[l.lesson_date]) byDate[l.lesson_date] = [];
                byDate[l.lesson_date].push(l);
            });
            
            let html = '';
            Object.keys(byDate).sort().forEach(date => {
                html += `
                    <div class="schedule-day">
                        <div class="schedule-day-header">
                            <span>${UI.formatDateLong(date)}</span>
                            <span class="day-meta">${byDate[date].length} занятий</span>
                        </div>
                `;
                
                byDate[date].sort((a,b) => a.lesson_number - b.lesson_number).forEach(l => {
                    const canMark = App.hasRole('admin', 'teacher');
                    html += `
                        <div class="lesson-row">
                            <div class="lesson-number">${l.lesson_number}</div>
                            <div>
                                <div class="lesson-info-title">${UI.escapeHtml(l.subject_name)}</div>
                                <div class="lesson-info-meta">
                                    ${UI.escapeHtml(l.group_name)} · ${UI.escapeHtml(l.teacher_name)}
                                </div>
                            </div>
                            <div class="lesson-classroom">каб. ${UI.escapeHtml(l.classroom || '—')}</div>
                            <div style="display:flex; gap:6px;">
                                ${canMark ? `
                                    <button class="btn-primary btn-sm" data-action="attendance" data-id="${l.id}">
                                        Посещаемость
                                    </button>
                                ` : ''}
                                ${App.hasRole('admin') ? `
                                    <button class="btn-secondary btn-sm" data-action="delete-schedule" data-id="${l.id}">×</button>
                                ` : ''}
                            </div>
                        </div>
                    `;
                });
                
                html += `</div>`;
            });
            
            listEl.innerHTML = html;
            
            // Привязываем события
            listEl.querySelectorAll('[data-action="attendance"]').forEach(btn => {
                btn.onclick = () => this.openAttendance(btn.dataset.id);
            });
            listEl.querySelectorAll('[data-action="delete-schedule"]').forEach(btn => {
                btn.onclick = () => this.deleteSchedule(btn.dataset.id);
            });
        } catch (e) {
            listEl.innerHTML = UI.emptyState('Ошибка', e.message);
            console.error(e);
        }
    },
    
    async scheduleModal() {
        const [groups, subjects, teachers] = await Promise.all([
            API.getGroups(), API.getSubjects(), API.getTeachers()
        ]);
        
        if (!groups.length || !subjects.length || !teachers.length) {
            UI.warning('Сначала создайте группы, предметы и зарегистрируйте преподавателей');
            return;
        }
        
        const html = `
            <form class="modal-form" id="schedule-form">
                <div class="form-group">
                    <label>Группа</label>
                    <select name="group_id" required>
                        ${groups.map(g => `<option value="${g.id}">${UI.escapeHtml(g.name)}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Предмет</label>
                    <select name="subject_id" required>
                        ${subjects.map(s => `<option value="${s.id}">${UI.escapeHtml(s.name)}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Преподаватель</label>
                    <select name="teacher_id" required>
                        ${teachers.map(t => `<option value="${t.id}">${UI.escapeHtml(t.full_name)}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Дата</label>
                    <input type="date" name="lesson_date" value="${UI.todayISO()}" required>
                </div>
                <div class="form-group">
                    <label>Номер пары (1–8)</label>
                    <input type="number" name="lesson_number" min="1" max="8" value="1" required>
                </div>
                <div class="form-group">
                    <label>Аудитория</label>
                    <input type="text" name="classroom" placeholder="например, 301">
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn-secondary" onclick="UI.closeModal()">Отмена</button>
                    <button type="submit" class="btn-primary">Сохранить</button>
                </div>
            </form>
        `;
        UI.modal('Новое занятие', html);
        
        document.getElementById('schedule-form').onsubmit = (e) => this.submitSchedule(e);
    },
    
    async submitSchedule(e) {
        e.preventDefault();
        const fd = new FormData(e.target);
        const data = Object.fromEntries(fd);
        data.lesson_number = Number(data.lesson_number);
        
        try {
            await API.createSchedule(data);
            UI.success('Занятие добавлено');
            UI.closeModal();
            this.loadSchedule();
        } catch (err) {
            UI.error(err.message);
        }
    },
    
    async deleteSchedule(id) {
        if (!await UI.confirm('Удалить занятие из расписания? Все связанные записи посещаемости также будут удалены.')) return;
        try {
            await API.deleteSchedule(id);
            UI.success('Удалено');
            this.loadSchedule();
        } catch (err) { UI.error(err.message); }
    },
    
    // ================================================================
    // ПОСЕЩАЕМОСТЬ
    // ================================================================
    async attendance() {
        const content = document.getElementById('page-content');
        content.innerHTML = `
            <div class="filters-bar">
                <div class="form-group">
                    <label>Дата</label>
                    <input type="date" id="att-date" value="${UI.todayISO()}">
                </div>
                <button class="btn-primary" id="load-att-btn">Показать занятия</button>
            </div>
            <div id="att-lessons-list">${UI.loader()}</div>
        `;
        document.getElementById('load-att-btn').onclick = () => this.loadAttendanceList();
        this.loadAttendanceList();
    },
    
    async loadAttendanceList() {
        const date = document.getElementById('att-date').value;
        const listEl = document.getElementById('att-lessons-list');
        listEl.innerHTML = UI.loader();
        
        try {
            const lessons = await API.getSchedule({ date_from: date, date_to: date });
            
            if (!lessons.length) {
                listEl.innerHTML = UI.emptyState('Нет занятий', 'На эту дату не запланировано занятий', '✓');
                return;
            }
            
            listEl.innerHTML = `
                <div class="schedule-day">
                    <div class="schedule-day-header">
                        <span>${UI.formatDateLong(date)}</span>
                        <span class="day-meta">Выберите занятие для отметки посещаемости</span>
                    </div>
                    ${lessons.map(l => `
                        <div class="lesson-row" data-id="${l.id}" style="cursor:pointer">
                            <div class="lesson-number">${l.lesson_number}</div>
                            <div>
                                <div class="lesson-info-title">${UI.escapeHtml(l.subject_name)}</div>
                                <div class="lesson-info-meta">
                                    ${UI.escapeHtml(l.group_name)} · ${UI.escapeHtml(l.teacher_name)}
                                </div>
                            </div>
                            <div class="lesson-classroom">каб. ${UI.escapeHtml(l.classroom || '—')}</div>
                            <button class="btn-primary btn-sm">Отметить →</button>
                        </div>
                    `).join('')}
                </div>
            `;
            
            listEl.querySelectorAll('.lesson-row').forEach(row => {
                row.onclick = () => this.openAttendance(row.dataset.id);
            });
        } catch (e) {
            listEl.innerHTML = UI.emptyState('Ошибка', e.message);
            console.error(e);
        }
    },
    
    async openAttendance(scheduleId) {
        const content = document.getElementById('page-content');
        document.getElementById('page-title').textContent = 'Отметка посещаемости';
        content.innerHTML = UI.loader();
        
        try {
            const data = await API.getAttendance(scheduleId);
            const { lesson, students } = data;
            
            window._attendanceState = {};
            students.forEach(s => {
                window._attendanceState[s.student_id] = s.status || 'present';
            });
            
            content.innerHTML = `
                <div class="card" style="margin-bottom: 20px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
                        <div>
                            <h3 style="font-family: var(--font-display); font-size: 24px;">
                                ${UI.escapeHtml(lesson.subject_name)}
                            </h3>
                            <div style="color: var(--text-muted); margin-top: 4px;">
                                ${UI.escapeHtml(lesson.group_name)} · 
                                ${UI.formatDateLong(lesson.lesson_date)} · 
                                Пара ${lesson.lesson_number} · 
                                каб. ${UI.escapeHtml(lesson.classroom || '—')}
                            </div>
                        </div>
                        <div style="display:flex; gap:8px;">
                            <button class="btn-secondary" id="back-to-schedule">← К расписанию</button>
                            <button class="btn-success" id="save-attendance">Сохранить</button>
                        </div>
                    </div>
                </div>
                
                ${students.length === 0 ? UI.emptyState('В группе нет студентов', 'Добавьте студентов в группу', '⚇') : `
                    <div style="display:flex; gap:8px; margin-bottom: 16px;">
                        <button class="btn-secondary btn-sm" id="mark-all-present">Все присутствуют</button>
                        <button class="btn-secondary btn-sm" id="mark-all-absent">Все отсутствуют</button>
                    </div>
                    
                    <div class="attendance-list" id="att-list">
                        ${students.map(s => this.attendanceRow(s)).join('')}
                    </div>
                `}
            `;
            
            // События
            document.getElementById('back-to-schedule').onclick = () => App.navigate('schedule');
            const saveBtn = document.getElementById('save-attendance');
            if (saveBtn) saveBtn.onclick = () => this.saveAttendance(scheduleId);
            
            const markPresent = document.getElementById('mark-all-present');
            if (markPresent) markPresent.onclick = () => this.markAll('present');
            const markAbsent = document.getElementById('mark-all-absent');
            if (markAbsent) markAbsent.onclick = () => this.markAll('absent');
            
            // Кнопки статусов
            document.querySelectorAll('#att-list .status-btn').forEach(btn => {
                btn.onclick = () => this.setStatus(btn.dataset.studentId, btn.dataset.status, btn);
            });
        } catch (e) {
            content.innerHTML = UI.emptyState('Ошибка', e.message);
            console.error(e);
        }
    },
    
    attendanceRow(s) {
        const status = (window._attendanceState && window._attendanceState[s.student_id]) || 'present';
        return `
            <div class="attendance-row" data-student-id="${s.student_id}">
                <div class="attendance-student">
                    <div class="user-avatar" style="width:36px;height:36px;font-size:13px;">
                        ${UI.avatarLetters(s.full_name)}
                    </div>
                    <div>
                        <div class="attendance-name">${UI.escapeHtml(s.full_name || '—')}</div>
                        <div class="attendance-card">№ ${UI.escapeHtml(s.student_card || '—')}</div>
                    </div>
                </div>
                <div class="status-selector">
                    <button class="status-btn present ${status==='present'?'active':''}" 
                        data-student-id="${s.student_id}" data-status="present">Присут.</button>
                    <button class="status-btn late ${status==='late'?'active':''}" 
                        data-student-id="${s.student_id}" data-status="late">Опоздал</button>
                    <button class="status-btn excused ${status==='excused'?'active':''}" 
                        data-student-id="${s.student_id}" data-status="excused">Уваж.</button>
                    <button class="status-btn absent ${status==='absent'?'active':''}" 
                        data-student-id="${s.student_id}" data-status="absent">Отсут.</button>
                </div>
                <div></div>
            </div>
        `;
    },
    
    setStatus(studentId, status, btn) {
        if (!window._attendanceState) window._attendanceState = {};
        window._attendanceState[studentId] = status;
        
        const row = btn.closest('.attendance-row');
        row.querySelectorAll('.status-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    },
    
    markAll(status) {
        document.querySelectorAll('#att-list .attendance-row').forEach(row => {
            const id = row.dataset.studentId;
            window._attendanceState[id] = status;
            row.querySelectorAll('.status-btn').forEach(b => b.classList.remove('active'));
            const btn = row.querySelector(`.status-btn.${status}`);
            if (btn) btn.classList.add('active');
        });
    },
    
    async saveAttendance(scheduleId) {
        const records = Object.entries(window._attendanceState).map(([id, status]) => ({
            student_id: id, status
        }));
        
        try {
            await API.markAttendance(scheduleId, records);
            UI.success('Посещаемость сохранена');
        } catch (e) {
            UI.error(e.message);
            console.error(e);
        }
    },
    
    // ================================================================
    // СТУДЕНТЫ
    // ================================================================
    async students() {
        const content = document.getElementById('page-content');
        content.innerHTML = UI.loader();
        
        try {
            const groups = await API.getGroups();
            window._allGroups = groups;
            
            // Список доступных курсов (из реальных групп)
            const courses = [...new Set(groups.map(g => g.course))].sort((a, b) => a - b);
            
            content.innerHTML = `
                <div class="filters-bar">
                    <div class="form-group">
                        <label>Курс</label>
                        <select id="students-filter-course">
                            <option value="">— Выберите курс —</option>
                            ${courses.map(c => `<option value="${c}">${c} курс</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Группа</label>
                        <select id="students-filter-group" disabled>
                            <option value="">— Сначала выберите курс —</option>
                        </select>
                    </div>
                    ${App.hasRole('admin') ? 
                        `<button class="btn-primary" id="add-student-btn">+ Добавить студента</button>` : ''}
                </div>
                <div id="students-result">
                    ${UI.emptyState('Выберите курс и группу', 'Студенты выбранной группы появятся здесь', '⚇')}
                </div>
            `;
            
            // При выборе курса — заполняем список групп этого курса
            document.getElementById('students-filter-course').onchange = (e) => {
                this.fillGroupsForCourse(e.target.value);
            };
            // При выборе группы — загружаем её студентов
            document.getElementById('students-filter-group').onchange = (e) => {
                this.loadGroupStudents(e.target.value);
            };
            
            const addBtn = document.getElementById('add-student-btn');
            if (addBtn) addBtn.onclick = () => this.studentModal();
        } catch (e) {
            content.innerHTML = UI.emptyState('Ошибка', e.message);
            console.error(e);
        }
    },
    
    // Заполнить выпадающий список групп для выбранного курса
    fillGroupsForCourse(course) {
        const sel = document.getElementById('students-filter-group');
        if (!course) {
            sel.innerHTML = '<option value="">— Сначала выберите курс —</option>';
            sel.disabled = true;
            return;
        }
        const groups = (window._allGroups || [])
            .filter(g => String(g.course) === String(course))
            .sort((a, b) => a.name.localeCompare(b.name));
        
        sel.innerHTML = '<option value="">— Выберите группу —</option>' +
            groups.map(g => `<option value="${g.id}">${UI.escapeHtml(g.name)} (${g.students_count})</option>`).join('');
        sel.disabled = false;
    },
    
    // Загрузить студентов выбранной группы
    async loadGroupStudents(groupId) {
        const result = document.getElementById('students-result');
        if (!groupId) {
            result.innerHTML = UI.emptyState('Выберите группу', '', '⚇');
            return;
        }
        result.innerHTML = UI.loader();
        
        try {
            const students = await API.getStudents(groupId);
            window._currentGroupStudents = students;
            
            const group = (window._allGroups || []).find(g => g.id === groupId);
            const groupName = group ? group.name : '';
            
            result.innerHTML = `
                <div class="table-container">
                    <div class="table-header">
                        <h3>Группа ${UI.escapeHtml(groupName)}</h3>
                        <span style="color:var(--text-muted);">Студентов: ${students.length}</span>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>ФИО</th>
                                <th>№ билета</th>
                                <th>Телефон</th>
                                <th>Email</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody id="students-tbody">
                            ${this.renderStudents(students)}
                        </tbody>
                    </table>
                </div>
            `;
            this.bindStudentActions();
        } catch (e) {
            result.innerHTML = UI.emptyState('Ошибка', e.message);
            console.error(e);
        }
    },
    
    bindStudentActions() {
        document.querySelectorAll('[data-action="student-report"]').forEach(btn => {
            btn.onclick = () => this.studentReport(btn.dataset.id);
        });
        document.querySelectorAll('[data-action="delete-student"]').forEach(btn => {
            btn.onclick = () => this.deleteStudent(btn.dataset.id);
        });
    },
    
    renderStudents(students) {
        if (!students.length) {
            return `<tr><td colspan="5">${UI.emptyState('В группе нет студентов', '', '⚇')}</td></tr>`;
        }
        return students.map(s => `
            <tr>
                <td>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <div class="user-avatar" style="width:32px;height:32px;font-size:12px;">
                            ${UI.avatarLetters(s.full_name)}
                        </div>
                        <strong>${UI.escapeHtml(s.full_name || '—')}</strong>
                    </div>
                </td>
                <td>${UI.escapeHtml(s.student_card || '—')}</td>
                <td>${UI.escapeHtml(s.phone || '—')}</td>
                <td>${UI.escapeHtml(s.email || '—')}</td>
                <td>
                    <div style="display:flex; gap:6px;">
                        <button class="btn-secondary btn-sm" data-action="student-report" data-id="${s.id}">Отчёт</button>
                        ${App.hasRole('admin') ? `
                            <button class="btn-danger btn-sm" data-action="delete-student" data-id="${s.id}">×</button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `).join('');
    },
    
    async studentModal() {
        // Получаем пользователей с ролью student, у которых ещё нет записи студента
        const { db } = await import('./firebase-config.js');
        const { collection, getDocs, query, where } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
        
        const usersSnap = await getDocs(query(collection(db, 'users'), where('role', '==', 'student')));
        const allStudentsSnap = await getDocs(collection(db, 'students'));
        const linkedUserIds = new Set(allStudentsSnap.docs.map(d => d.data().user_id));
        
        const availableUsers = usersSnap.docs.filter(d => !linkedUserIds.has(d.id));
        const groups = await API.getGroups();
        
        if (!availableUsers.length) {
            UI.warning('Нет зарегистрированных пользователей с ролью студента, не привязанных к группе');
            return;
        }
        if (!groups.length) {
            UI.warning('Сначала создайте хотя бы одну группу');
            return;
        }
        
        const html = `
            <form class="modal-form" id="student-form">
                <div class="form-group">
                    <label>Пользователь</label>
                    <select name="user_id" required>
                        ${availableUsers.map(u => `<option value="${u.id}">${UI.escapeHtml(u.data().full_name)} (${u.data().email})</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Группа</label>
                    <select name="group_id" required>
                        ${groups.map(g => `<option value="${g.id}">${UI.escapeHtml(g.name)}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Номер студенческого билета</label>
                    <input type="text" name="student_card" required>
                </div>
                <div class="form-group">
                    <label>Телефон</label>
                    <input type="tel" name="phone" placeholder="+7...">
                </div>
                <div class="form-group">
                    <label>Дата рождения</label>
                    <input type="date" name="birth_date">
                </div>
                <div class="form-group">
                    <label>Дата зачисления</label>
                    <input type="date" name="enrollment_date" value="${UI.todayISO()}">
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn-secondary" onclick="UI.closeModal()">Отмена</button>
                    <button type="submit" class="btn-primary">Создать</button>
                </div>
            </form>
        `;
        UI.modal('Добавить студента', html);
        
        document.getElementById('student-form').onsubmit = async (e) => {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(e.target));
            try {
                await API.createStudent(data);
                UI.success('Студент добавлен');
                UI.closeModal();
                this.students();
            } catch (err) { UI.error(err.message); }
        };
    },
    
    async deleteStudent(id) {
        if (!await UI.confirm('Удалить запись студента? Учётная запись пользователя останется.')) return;
        try {
            await API.deleteStudent(id);
            UI.success('Удалено');
            this.students();
        } catch (err) { UI.error(err.message); }
    },
    
    async studentReport(id) {
        try {
            const data = await API.getStudentReport(id);
            const { stats, history } = data;
            
            const html = `
                ${stats ? `
                    <div style="margin-bottom:20px;">
                        <h4 style="margin-bottom:12px;">${UI.escapeHtml(stats.student_name)}</h4>
                        <div class="status-distribution">
                            <div class="status-dist-item present">
                                <div class="status-dist-label">Присутствовал</div>
                                <div class="status-dist-value">${stats.present_count}</div>
                            </div>
                            <div class="status-dist-item absent">
                                <div class="status-dist-label">Пропусков</div>
                                <div class="status-dist-value">${stats.absent_count}</div>
                            </div>
                            <div class="status-dist-item late">
                                <div class="status-dist-label">Опозданий</div>
                                <div class="status-dist-value">${stats.late_count}</div>
                            </div>
                            <div class="status-dist-item excused">
                                <div class="status-dist-label">Посещаемость</div>
                                <div class="status-dist-value">${stats.attendance_percent}%</div>
                            </div>
                        </div>
                    </div>
                ` : ''}
                <h4 style="margin-bottom:8px;">История посещений</h4>
                <div style="max-height: 300px; overflow-y: auto;">
                    ${history.length ? history.map(h => `
                        <div style="display:flex; justify-content:space-between; padding:10px 0; border-bottom: 1px solid var(--border-light);">
                            <div>
                                <div style="font-weight:600;">${UI.escapeHtml(h.subject_name)}</div>
                                <div style="color:var(--text-muted); font-size:13px;">
                                    ${UI.formatDate(h.lesson_date)} · Пара ${h.lesson_number}
                                </div>
                            </div>
                            ${UI.statusBadge(h.status)}
                        </div>
                    `).join('') : '<div style="color:var(--text-muted); padding:20px; text-align:center;">История пуста</div>'}
                </div>
            `;
            UI.modal('Отчёт по студенту', html);
        } catch (e) { UI.error(e.message); }
    },
    
    // ================================================================
    // ГРУППЫ
    // ================================================================
    async groups() {
        const content = document.getElementById('page-content');
        content.innerHTML = UI.loader();
        try {
            const groups = await API.getGroups();
            window._allGroups = groups;
            
            if (!groups.length) {
                content.innerHTML = `
                    ${App.hasRole('admin') ? 
                        `<div style="margin-bottom:20px;"><button class="btn-primary" id="add-group-btn">+ Новая группа</button></div>` : ''}
                    ${UI.emptyState('Нет групп', 'Создайте группу или импортируйте студентов', '▥')}
                `;
                const addBtn = document.getElementById('add-group-btn');
                if (addBtn) addBtn.onclick = () => this.groupModal();
                return;
            }
            
            // Группируем по курсам
            const byCourse = {};
            groups.forEach(g => {
                const c = g.course || 0;
                if (!byCourse[c]) byCourse[c] = [];
                byCourse[c].push(g);
            });
            const courses = Object.keys(byCourse).sort((a, b) => a - b);
            
            let html = `
                ${App.hasRole('admin') ? 
                    `<div style="margin-bottom:20px;"><button class="btn-primary" id="add-group-btn">+ Новая группа</button></div>` : ''}
            `;
            
            courses.forEach(course => {
                const grps = byCourse[course].sort((a, b) => a.name.localeCompare(b.name));
                html += `
                    <div class="course-block">
                        <div class="course-header">
                            <span class="course-title">${course} курс</span>
                            <span class="course-meta">${grps.length} групп · ${grps.reduce((s,g)=>s+(g.students_count||0),0)} студентов</span>
                        </div>
                        <div class="groups-grid">
                            ${grps.map(g => `
                                <div class="group-card" data-action="open-group" data-id="${g.id}">
                                    <div class="group-card-head">
                                        <span class="group-card-name">${UI.escapeHtml(g.name)}</span>
                                        <span class="group-card-count">${g.students_count || 0}</span>
                                    </div>
                                    <div class="group-card-spec">${UI.escapeHtml(g.specialty || '—')}</div>
                                    ${App.hasRole('admin') ? `
                                        <button class="group-card-del" data-action="delete-group" data-id="${g.id}" title="Удалить группу">×</button>
                                    ` : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            });
            
            content.innerHTML = html;
            
            const addBtn = document.getElementById('add-group-btn');
            if (addBtn) addBtn.onclick = () => this.groupModal();
            
            // Клик по карточке группы → открыть студентов
            document.querySelectorAll('[data-action="open-group"]').forEach(card => {
                card.onclick = (e) => {
                    if (e.target.dataset.action === 'delete-group') return; // не реагируем на крестик
                    this.openGroupStudents(card.dataset.id);
                };
            });
            
            // Удаление группы
            document.querySelectorAll('[data-action="delete-group"]').forEach(btn => {
                btn.onclick = (e) => {
                    e.stopPropagation();
                    this.deleteGroup(btn.dataset.id);
                };
            });
        } catch (e) { 
            content.innerHTML = UI.emptyState('Ошибка', e.message);
            console.error(e);
        }
    },
    
    // Открыть студентов конкретной группы (из страницы Группы)
    async openGroupStudents(groupId) {
        const content = document.getElementById('page-content');
        const group = (window._allGroups || []).find(g => g.id === groupId);
        const groupName = group ? group.name : '';
        document.getElementById('page-title').textContent = 'Группа ' + groupName;
        content.innerHTML = UI.loader();
        
        try {
            const students = await API.getStudents(groupId);
            
            content.innerHTML = `
                <div style="margin-bottom:16px;">
                    <button class="btn-secondary" id="back-to-groups">← Ко всем группам</button>
                </div>
                <div class="table-container">
                    <div class="table-header">
                        <h3>Группа ${UI.escapeHtml(groupName)}</h3>
                        <span style="color:var(--text-muted);">
                            ${group ? UI.escapeHtml(group.specialty) + ' · ' : ''}Студентов: ${students.length}
                        </span>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>ФИО</th>
                                <th>№ билета</th>
                                <th>Телефон</th>
                                <th>Email</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.renderStudents(students)}
                        </tbody>
                    </table>
                </div>
            `;
            
            document.getElementById('back-to-groups').onclick = () => App.navigate('groups');
            this.bindStudentActions();
        } catch (e) {
            content.innerHTML = UI.emptyState('Ошибка', e.message);
            console.error(e);
        }
    },
    
    groupModal() {
        const html = `
            <form class="modal-form" id="group-form">
                <div class="form-group">
                    <label>Название группы</label>
                    <input type="text" name="name" required placeholder="например, 302 ПО">
                </div>
                <div class="form-group">
                    <label>Специальность</label>
                    <input type="text" name="specialty" required placeholder="например, Программное обеспечение">
                </div>
                <div class="form-group">
                    <label>Курс</label>
                    <select name="course" required>
                        <option value="1">1 курс</option>
                        <option value="2">2 курс</option>
                        <option value="3">3 курс</option>
                        <option value="4">4 курс</option>
                    </select>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn-secondary" onclick="UI.closeModal()">Отмена</button>
                    <button type="submit" class="btn-primary">Создать</button>
                </div>
            </form>
        `;
        UI.modal('Новая группа', html);
        
        document.getElementById('group-form').onsubmit = async (e) => {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(e.target));
            try {
                await API.createGroup(data);
                UI.success('Группа создана');
                UI.closeModal();
                this.groups();
            } catch (err) { UI.error(err.message); }
        };
    },
    
    async deleteGroup(id) {
        if (!await UI.confirm('Удалить группу?')) return;
        try {
            await API.deleteGroup(id);
            UI.success('Удалено');
            this.groups();
        } catch (err) { UI.error(err.message); }
    },
    
    // ================================================================
    // ПРЕПОДАВАТЕЛИ
    // ================================================================
    async teachers() {
        const content = document.getElementById('page-content');
        content.innerHTML = UI.loader();
        try {
            const teachers = await API.getTeachers();
            content.innerHTML = `
                <div class="info-note">
                    ℹ Преподаватели регистрируются через форму регистрации с выбором роли «Преподаватель»
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ФИО</th>
                                <th>Должность</th>
                                <th>Кафедра</th>
                                <th>Телефон</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${teachers.length ? teachers.map(t => `
                                <tr>
                                    <td>
                                        <div style="display:flex; align-items:center; gap:10px;">
                                            <div class="user-avatar" style="width:32px;height:32px;font-size:12px;">
                                                ${UI.avatarLetters(t.full_name)}
                                            </div>
                                            <strong>${UI.escapeHtml(t.full_name)}</strong>
                                        </div>
                                    </td>
                                    <td>${UI.escapeHtml(t.position || '—')}</td>
                                    <td>${UI.escapeHtml(t.department || '—')}</td>
                                    <td>${UI.escapeHtml(t.phone || '—')}</td>
                                    <td>${UI.escapeHtml(t.email || '—')}</td>
                                </tr>
                            `).join('') : `<tr><td colspan="5">${UI.emptyState('Нет преподавателей', 'Зарегистрируйте преподавателя через форму регистрации', '⚐')}</td></tr>`}
                        </tbody>
                    </table>
                </div>
            `;
        } catch (e) { 
            content.innerHTML = UI.emptyState('Ошибка', e.message);
            console.error(e);
        }
    },
    
    // ================================================================
    // ПРЕДМЕТЫ
    // ================================================================
    async subjects() {
        const content = document.getElementById('page-content');
        content.innerHTML = UI.loader();
        try {
            const subjects = await API.getSubjects();
            content.innerHTML = `
                ${App.hasRole('admin') ? 
                    `<div style="margin-bottom:20px;"><button class="btn-primary" id="add-subject-btn">+ Новый предмет</button></div>` : ''}
                <div class="table-container">
                    <table>
                        <thead>
                            <tr><th>Название</th><th>Код</th><th>Часов</th><th>Описание</th><th></th></tr>
                        </thead>
                        <tbody>
                            ${subjects.length ? subjects.map(s => `
                                <tr>
                                    <td><strong>${UI.escapeHtml(s.name)}</strong></td>
                                    <td><span class="badge badge-default">${UI.escapeHtml(s.code || '—')}</span></td>
                                    <td>${s.hours_total || 0}</td>
                                    <td style="color:var(--text-secondary);">${UI.escapeHtml(s.description || '')}</td>
                                    <td>
                                        ${App.hasRole('admin') ? `
                                            <button class="btn-danger btn-sm" data-action="delete-subject" data-id="${s.id}">×</button>
                                        ` : ''}
                                    </td>
                                </tr>
                            `).join('') : `<tr><td colspan="5">${UI.emptyState('Нет предметов', 'Добавьте первый предмет', '▣')}</td></tr>`}
                        </tbody>
                    </table>
                </div>
            `;
            
            const addBtn = document.getElementById('add-subject-btn');
            if (addBtn) addBtn.onclick = () => this.subjectModal();
            
            document.querySelectorAll('[data-action="delete-subject"]').forEach(btn => {
                btn.onclick = async () => {
                    if (!await UI.confirm('Удалить предмет?')) return;
                    try {
                        await API.deleteSubject(btn.dataset.id);
                        UI.success('Удалено');
                        this.subjects();
                    } catch (err) { UI.error(err.message); }
                };
            });
        } catch (e) { 
            content.innerHTML = UI.emptyState('Ошибка', e.message); 
            console.error(e);
        }
    },
    
    subjectModal() {
        const html = `
            <form class="modal-form" id="subject-form">
                <div class="form-group">
                    <label>Название</label>
                    <input type="text" name="name" required placeholder="например, Программирование на Python">
                </div>
                <div class="form-group">
                    <label>Код</label>
                    <input type="text" name="code" placeholder="например, PYT-101">
                </div>
                <div class="form-group">
                    <label>Часов всего</label>
                    <input type="number" name="hours_total" value="0" min="0">
                </div>
                <div class="form-group">
                    <label>Описание</label>
                    <textarea name="description" rows="3"></textarea>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn-secondary" onclick="UI.closeModal()">Отмена</button>
                    <button type="submit" class="btn-primary">Создать</button>
                </div>
            </form>
        `;
        UI.modal('Новый предмет', html);
        
        document.getElementById('subject-form').onsubmit = async (e) => {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(e.target));
            try {
                await API.createSubject(data);
                UI.success('Предмет создан');
                UI.closeModal();
                this.subjects();
            } catch (err) { UI.error(err.message); }
        };
    },
    
    // ================================================================
    // ОТЧЁТЫ
    // ================================================================
    async reports() {
        const content = document.getElementById('page-content');
        content.innerHTML = UI.loader();
        try {
            const groups = await API.getGroups();
            
            if (!groups.length) {
                content.innerHTML = UI.emptyState('Нет групп', 'Сначала создайте группы и добавьте студентов', '◷');
                return;
            }
            
            const monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            
            content.innerHTML = `
                <div class="filters-bar">
                    <div class="form-group">
                        <label>Группа</label>
                        <select id="rep-group">
                            ${groups.map(g => `<option value="${g.id}">${UI.escapeHtml(g.name)}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>С даты</label>
                        <input type="date" id="rep-from" value="${monthAgo.toISOString().slice(0,10)}">
                    </div>
                    <div class="form-group">
                        <label>По дату</label>
                        <input type="date" id="rep-to" value="${UI.todayISO()}">
                    </div>
                    <button class="btn-primary" id="load-rep-btn">Сформировать</button>
                    <button class="btn-secondary" id="export-rep-btn">Экспорт CSV</button>
                </div>
                <div id="report-result"></div>
            `;
            
            document.getElementById('load-rep-btn').onclick = () => this.loadReport();
            document.getElementById('export-rep-btn').onclick = () => this.exportReport();
            
            this.loadReport();
        } catch (e) {
            content.innerHTML = UI.emptyState('Ошибка', e.message);
            console.error(e);
        }
    },
    
    async loadReport() {
        const groupId = document.getElementById('rep-group').value;
        const from = document.getElementById('rep-from').value;
        const to = document.getElementById('rep-to').value;
        const el = document.getElementById('report-result');
        
        el.innerHTML = UI.loader();
        try {
            const data = await API.getGroupReport(groupId, from, to);
            
            el.innerHTML = `
                <div class="table-container">
                    <div class="table-header">
                        <h3>Отчёт по посещаемости</h3>
                        <span style="color:var(--text-muted);">${UI.formatDate(from)} — ${UI.formatDate(to)}</span>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Студент</th>
                                <th>№ билета</th>
                                <th>Всего</th>
                                <th>Присут.</th>
                                <th>Опозд.</th>
                                <th>Пропуски</th>
                                <th>% посещ.</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.length ? data.map(s => {
                                const rate = s.attendance_percent || 0;
                                const badgeClass = rate >= 85 ? 'badge-success' : 
                                                   rate >= 70 ? 'badge-warning' : 'badge-danger';
                                return `
                                    <tr>
                                        <td><strong>${UI.escapeHtml(s.student_name)}</strong></td>
                                        <td>${UI.escapeHtml(s.student_card)}</td>
                                        <td>${s.total_lessons}</td>
                                        <td>${s.present}</td>
                                        <td>${s.late_count}</td>
                                        <td>${s.absent}</td>
                                        <td><span class="badge ${badgeClass}">${rate}%</span></td>
                                    </tr>
                                `;
                            }).join('') : `<tr><td colspan="7">${UI.emptyState('Нет данных за этот период')}</td></tr>`}
                        </tbody>
                    </table>
                </div>
            `;
            window._reportData = data;
        } catch (e) {
            el.innerHTML = UI.emptyState('Ошибка', e.message);
            console.error(e);
        }
    },
    
    exportReport() {
        const data = window._reportData;
        if (!data || !data.length) { UI.warning('Нет данных для экспорта'); return; }
        
        const headers = ['Студент','№ билета','Всего','Присутствовал','Опоздал','Пропустил','% посещаемости'];
        const rows = data.map(s => [
            s.student_name, s.student_card, s.total_lessons || 0,
            s.present || 0, s.late_count || 0, s.absent || 0,
            (s.attendance_percent || 0) + '%'
        ]);
        
        const csv = '\uFEFF' + [headers, ...rows]
            .map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(','))
            .join('\n');
        
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `attendance_report_${UI.todayISO()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        UI.success('Файл скачан');
    },
    
    // ================================================================
    // ИМПОРТ СТУДЕНТОВ ИЗ EXCEL
    // ================================================================
    async import() {
        const content = document.getElementById('page-content');
        content.innerHTML = `
            <div class="info-note">
                ℹ Загрузите файл «Контингент» (.xls/.xlsx), выгруженный из НОБД.
                Система автоматически создаст группы и добавит студентов.
                Повторная загрузка не создаёт дубликатов (проверка по номеру студбилета).
            </div>
            
            <div class="card" style="margin-bottom:20px;">
                <h4 style="margin-bottom:16px;">Шаг 1. Выберите файл</h4>
                <input type="file" id="import-file" accept=".xls,.xlsx"
                    style="padding:12px; border:1.5px dashed var(--border); border-radius:var(--radius-md); width:100%; cursor:pointer; background:var(--bg-primary);">
                <div id="import-preview" style="margin-top:16px;"></div>
            </div>
            
            <div id="import-action"></div>
            <div id="import-progress"></div>
        `;
        
        document.getElementById('import-file').onchange = (e) => this.handleImportFile(e);
    },
    
    async handleImportFile(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const previewEl = document.getElementById('import-preview');
        previewEl.innerHTML = UI.loader();
        
        try {
            // Загружаем библиотеку SheetJS (для чтения .xls/.xlsx)
            if (!window.XLSX) {
                await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js');
            }
            
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data, { type: 'array' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
            
            // Первая строка — заголовки. Данные с индекса 1.
            // Индексы столбцов (как в файле НОБД):
            //  2 = ИИН, 3 = Фамилия, 4 = Имя, 5 = Отчество,
            //  6 = дата рожд., 32 = телефон, 33 = email,
            //  38 = курс, 41 = код группы, 49 = специальность
            const students = [];
            for (let i = 1; i < rows.length; i++) {
                const r = rows[i];
                if (!r || !r[3] || !r[4]) continue; // нет фамилии/имени — пропускаем
                
                const fam = String(r[3] || '').trim();
                const name = String(r[4] || '').trim();
                const otch = String(r[5] || '').trim();
                const fullName = [fam, name, otch].filter(Boolean).join(' ');
                
                const groupName = String(r[41] || '').trim().replace(/\s+/g, ' ');
                if (!groupName) continue;
                
                // Курс: берём цифру из «4 курс» или из первой цифры кода группы
                let course = parseInt(String(r[38] || '').match(/\d/)?.[0]);
                if (!course) course = parseInt(groupName.match(/\d/)?.[0]) || 1;
                
                // Дата рождения → YYYY-MM-DD
                let birth = '';
                if (r[6]) {
                    const d = new Date(r[6]);
                    if (!isNaN(d)) birth = d.toISOString().slice(0, 10);
                }
                
                students.push({
                    full_name: fullName,
                    student_card: String(r[2] || '').trim(),
                    group_name: groupName,
                    specialty: String(r[49] || '').trim(),
                    course,
                    phone: String(r[32] || '').trim(),
                    email: String(r[33] || '').trim(),
                    birth_date: birth
                });
            }
            
            window._importData = students;
            
            // Считаем уникальные группы
            const groupsSet = new Set(students.map(s => s.group_name));
            
            previewEl.innerHTML = `
                <div style="display:flex; gap:24px; flex-wrap:wrap; padding:16px; background:var(--bg-tertiary); border-radius:var(--radius-md);">
                    <div>
                        <div class="stat-label">Студентов в файле</div>
                        <div style="font-family:var(--font-display); font-size:28px; font-weight:700; color:var(--accent);">${students.length}</div>
                    </div>
                    <div>
                        <div class="stat-label">Групп</div>
                        <div style="font-family:var(--font-display); font-size:28px; font-weight:700; color:var(--accent);">${groupsSet.size}</div>
                    </div>
                </div>
                <div style="margin-top:12px; font-size:13px; color:var(--text-muted);">
                    Примеры: ${students.slice(0,3).map(s => UI.escapeHtml(s.full_name + ' (' + s.group_name + ')')).join(', ')}…
                </div>
            `;
            
            document.getElementById('import-action').innerHTML = `
                <div class="card">
                    <h4 style="margin-bottom:12px;">Шаг 2. Загрузить в базу</h4>
                    <p style="color:var(--text-secondary); margin-bottom:16px; font-size:14px;">
                        Будет создано ${groupsSet.size} групп и добавлено до ${students.length} студентов.
                        Загрузка может занять 1–3 минуты — не закрывайте вкладку.
                    </p>
                    <button class="btn-primary btn-large" id="start-import-btn">
                        Начать импорт
                    </button>
                </div>
            `;
            
            document.getElementById('start-import-btn').onclick = () => this.startImport();
            
        } catch (err) {
            previewEl.innerHTML = UI.emptyState('Ошибка чтения файла', err.message);
            console.error(err);
        }
    },
    
    loadScript(src) {
        return new Promise((resolve, reject) => {
            const s = document.createElement('script');
            s.src = src;
            s.onload = resolve;
            s.onerror = () => reject(new Error('Не удалось загрузить библиотеку чтения Excel'));
            document.head.appendChild(s);
        });
    },
    
    async startImport() {
        const students = window._importData;
        if (!students || !students.length) { UI.warning('Сначала выберите файл'); return; }
        
        const btn = document.getElementById('start-import-btn');
        btn.disabled = true;
        btn.textContent = 'Импорт идёт...';
        
        const progressEl = document.getElementById('import-progress');
        progressEl.innerHTML = `
            <div class="card" style="margin-top:20px;">
                <h4 style="margin-bottom:12px;">Прогресс</h4>
                <div class="progress-bar" style="height:14px;">
                    <div class="progress-fill" id="imp-bar" style="width:0%"></div>
                </div>
                <div id="imp-text" style="margin-top:12px; font-size:14px; color:var(--text-secondary);">
                    Подготовка...
                </div>
            </div>
        `;
        
        try {
            const result = await API.importStudents(students, (processed, total, added, skipped) => {
                const pct = Math.round(processed / total * 100);
                const bar = document.getElementById('imp-bar');
                const text = document.getElementById('imp-text');
                if (bar) bar.style.width = pct + '%';
                if (text) text.textContent = 
                    `Обработано ${processed} из ${total} · добавлено ${added}, пропущено (дубликаты) ${skipped}`;
            });
            
            document.getElementById('imp-text').innerHTML = 
                `<strong style="color:var(--success);">Готово!</strong> Добавлено студентов: ${result.added}. ` +
                `Пропущено дубликатов: ${result.skipped}.`;
            
            UI.success(`Импорт завершён: добавлено ${result.added} студентов`);
            btn.textContent = 'Импорт завершён';
            
        } catch (err) {
            document.getElementById('imp-text').innerHTML = 
                `<strong style="color:var(--danger);">Ошибка:</strong> ${UI.escapeHtml(err.message)}`;
            UI.error('Ошибка импорта: ' + err.message);
            btn.disabled = false;
            btn.textContent = 'Повторить';
            console.error(err);
        }
    },
};

window.Pages = Pages;
