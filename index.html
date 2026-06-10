// =====================================================================
// API — работа с Firebase Firestore и Authentication
// =====================================================================

import { auth, db } from './firebase-config.js';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
    collection, doc, getDoc, getDocs, setDoc, addDoc, updateDoc,
    deleteDoc, query, where, orderBy, limit, Timestamp, writeBatch
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


// =====================================================================
// АУТЕНТИФИКАЦИЯ
// =====================================================================
export const API = {
    
    // Текущий пользователь (с дополнительными данными из Firestore)
    currentUser: null,
    
    // ---------- АВТОРИЗАЦИЯ ----------
    
    async login(email, password) {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        const profile = await this.getUserProfile(cred.user.uid);
        this.currentUser = { uid: cred.user.uid, email: cred.user.email, ...profile };
        return this.currentUser;
    },
    
    async register(email, password, profileData) {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        const userId = cred.user.uid;
        
        // Сохраняем профиль в Firestore
        const userDoc = {
            uid: userId,
            email,
            full_name: profileData.full_name,
            role: profileData.role || 'student',
            is_active: true,
            created_at: Timestamp.now()
        };
        await setDoc(doc(db, 'users', userId), userDoc);
        
        this.currentUser = { uid: userId, ...userDoc };
        return this.currentUser;
    },
    
    async logout() {
        await signOut(auth);
        this.currentUser = null;
    },
    
    onAuthChange(callback) {
        return onAuthStateChanged(auth, async (user) => {
            if (user) {
                const profile = await this.getUserProfile(user.uid);
                if (profile) {
                    this.currentUser = { uid: user.uid, email: user.email, ...profile };
                    callback(this.currentUser);
                } else {
                    callback(null);
                }
            } else {
                this.currentUser = null;
                callback(null);
            }
        });
    },
    
    async getUserProfile(uid) {
        const snap = await getDoc(doc(db, 'users', uid));
        return snap.exists() ? snap.data() : null;
    },
    
    // ---------- ГРУППЫ ----------
    
    async getGroups() {
        const snap = await getDocs(collection(db, 'groups'));
        const groups = [];
        for (const d of snap.docs) {
            const data = { id: d.id, ...d.data() };
            // Подсчитаем количество студентов
            const studentsSnap = await getDocs(
                query(collection(db, 'students'), where('group_id', '==', d.id))
            );
            data.students_count = studentsSnap.size;
            groups.push(data);
        }
        // Сортировка в браузере (без индексов Firestore): по курсу, затем по названию
        groups.sort((a, b) => {
            if ((a.course || 0) !== (b.course || 0)) return (a.course || 0) - (b.course || 0);
            return (a.name || '').localeCompare(b.name || '');
        });
        return groups;
    },
    
    async createGroup(data) {
        return await addDoc(collection(db, 'groups'), {
            ...data,
            course: Number(data.course),
            created_at: Timestamp.now()
        });
    },
    
    async deleteGroup(id) {
        await deleteDoc(doc(db, 'groups', id));
    },
    
    // ---------- СТУДЕНТЫ ----------
    
    async getStudents(groupId = null) {
        let q = collection(db, 'students');
        if (groupId) {
            q = query(q, where('group_id', '==', groupId));
        }
        const snap = await getDocs(q);
        const students = [];
        
        for (const d of snap.docs) {
            const student = { id: d.id, ...d.data() };
            
            // Подгружаем данные пользователя
            if (student.user_id) {
                const userSnap = await getDoc(doc(db, 'users', student.user_id));
                if (userSnap.exists()) {
                    student.full_name = userSnap.data().full_name;
                    student.email = userSnap.data().email;
                }
            }
            // Подгружаем группу
            if (student.group_id) {
                const groupSnap = await getDoc(doc(db, 'groups', student.group_id));
                if (groupSnap.exists()) {
                    student.group_name = groupSnap.data().name;
                }
            }
            students.push(student);
        }
        
        students.sort((a, b) => (a.full_name || '').localeCompare(b.full_name || ''));
        return students;
    },
    
    async createStudent(data) {
        // ВАЖНО: данная функция работает только в "режиме админа без Auth"
        // Для полноценной работы студент сам регистрируется через register()
        // А админ потом дополняет данные через updateStudent
        return await addDoc(collection(db, 'students'), {
            user_id: data.user_id,
            group_id: data.group_id,
            student_card: data.student_card,
            phone: data.phone || '',
            birth_date: data.birth_date || null,
            enrollment_date: data.enrollment_date || new Date().toISOString().slice(0, 10),
            created_at: Timestamp.now()
        });
    },
    
    async deleteStudent(id) {
        await deleteDoc(doc(db, 'students', id));
    },
    
    // ---------- ПРЕПОДАВАТЕЛИ ----------
    
    async getTeachers() {
        // Берём пользователей с ролью teacher
        const q = query(collection(db, 'users'), where('role', '==', 'teacher'));
        const snap = await getDocs(q);
        const teachers = [];
        
        for (const d of snap.docs) {
            const user = { user_id: d.id, ...d.data() };
            // Дополнительные данные преподавателя
            const teacherSnap = await getDoc(doc(db, 'teachers', d.id));
            if (teacherSnap.exists()) {
                Object.assign(user, teacherSnap.data());
            }
            user.id = d.id;
            teachers.push(user);
        }
        
        teachers.sort((a, b) => (a.full_name || '').localeCompare(b.full_name || ''));
        return teachers;
    },
    
    async updateTeacher(userId, data) {
        await setDoc(doc(db, 'teachers', userId), data, { merge: true });
    },
    
    // ---------- ПРЕДМЕТЫ ----------
    
    async getSubjects() {
        const snap = await getDocs(collection(db, 'subjects'));
        const subjects = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        subjects.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        return subjects;
    },
    
    async createSubject(data) {
        return await addDoc(collection(db, 'subjects'), {
            ...data,
            hours_total: Number(data.hours_total || 0),
            created_at: Timestamp.now()
        });
    },
    
    async deleteSubject(id) {
        await deleteDoc(doc(db, 'subjects', id));
    },
    
    // ---------- РАСПИСАНИЕ ----------
    
    async getSchedule(filters = {}) {
        // Загружаем все занятия и фильтруем в браузере —
        // это исключает необходимость составных индексов Firestore
        const snap = await getDocs(collection(db, 'schedule'));
        const lessons = [];
        
        // Кеш для оптимизации
        const groupCache = {};
        const subjectCache = {};
        const teacherCache = {};
        
        for (const d of snap.docs) {
            const lesson = { id: d.id, ...d.data() };
            
            // Применяем фильтры
            if (filters.date_from && lesson.lesson_date < filters.date_from) continue;
            if (filters.date_to && lesson.lesson_date > filters.date_to) continue;
            if (filters.group_id && lesson.group_id !== filters.group_id) continue;
            if (filters.teacher_id && lesson.teacher_id !== filters.teacher_id) continue;
            
            // Группа
            if (lesson.group_id) {
                if (!groupCache[lesson.group_id]) {
                    const gs = await getDoc(doc(db, 'groups', lesson.group_id));
                    groupCache[lesson.group_id] = gs.exists() ? gs.data() : null;
                }
                lesson.group_name = groupCache[lesson.group_id]?.name || '—';
            }
            
            // Предмет
            if (lesson.subject_id) {
                if (!subjectCache[lesson.subject_id]) {
                    const ss = await getDoc(doc(db, 'subjects', lesson.subject_id));
                    subjectCache[lesson.subject_id] = ss.exists() ? ss.data() : null;
                }
                lesson.subject_name = subjectCache[lesson.subject_id]?.name || '—';
            }
            
            // Преподаватель
            if (lesson.teacher_id) {
                if (!teacherCache[lesson.teacher_id]) {
                    const ts = await getDoc(doc(db, 'users', lesson.teacher_id));
                    teacherCache[lesson.teacher_id] = ts.exists() ? ts.data() : null;
                }
                lesson.teacher_name = teacherCache[lesson.teacher_id]?.full_name || '—';
            }
            
            lessons.push(lesson);
        }
        
        lessons.sort((a, b) => {
            if (a.lesson_date !== b.lesson_date) return a.lesson_date.localeCompare(b.lesson_date);
            return (a.lesson_number || 0) - (b.lesson_number || 0);
        });
        
        return lessons;
    },
    
    async createSchedule(data) {
        return await addDoc(collection(db, 'schedule'), {
            ...data,
            lesson_number: Number(data.lesson_number),
            created_at: Timestamp.now()
        });
    },
    
    async deleteSchedule(id) {
        // Сначала удаляем связанные записи посещаемости
        const attSnap = await getDocs(
            query(collection(db, 'attendance'), where('schedule_id', '==', id))
        );
        for (const d of attSnap.docs) {
            await deleteDoc(d.ref);
        }
        await deleteDoc(doc(db, 'schedule', id));
    },
    
    // ---------- ПОСЕЩАЕМОСТЬ ----------
    
    async getAttendance(scheduleId) {
        // Получаем занятие
        const lessonSnap = await getDoc(doc(db, 'schedule', scheduleId));
        if (!lessonSnap.exists()) throw new Error('Занятие не найдено');
        const lesson = { id: lessonSnap.id, ...lessonSnap.data() };
        
        // Группа
        const gs = await getDoc(doc(db, 'groups', lesson.group_id));
        lesson.group_name = gs.exists() ? gs.data().name : '—';
        
        // Предмет
        const ss = await getDoc(doc(db, 'subjects', lesson.subject_id));
        lesson.subject_name = ss.exists() ? ss.data().name : '—';
        
        // Студенты группы
        const studentsSnap = await getDocs(
            query(collection(db, 'students'), where('group_id', '==', lesson.group_id))
        );
        const students = [];
        
        // Записи посещаемости для этого занятия
        const attSnap = await getDocs(
            query(collection(db, 'attendance'), where('schedule_id', '==', scheduleId))
        );
        const attMap = {};
        attSnap.docs.forEach(d => {
            const a = d.data();
            attMap[a.student_id] = { id: d.id, ...a };
        });
        
        for (const d of studentsSnap.docs) {
            const student = { student_id: d.id, ...d.data() };
            const userSnap = await getDoc(doc(db, 'users', student.user_id));
            if (userSnap.exists()) {
                student.full_name = userSnap.data().full_name;
            }
            const att = attMap[d.id];
            student.attendance_id = att?.id || null;
            student.status = att?.status || null;
            student.comment = att?.comment || null;
            students.push(student);
        }
        
        students.sort((a, b) => (a.full_name || '').localeCompare(b.full_name || ''));
        return { lesson, students };
    },
    
    async markAttendance(scheduleId, records) {
        const markedBy = this.currentUser?.uid;
        // Загружаем все записи посещаемости для этого занятия один раз
        const allForLesson = await getDocs(query(
            collection(db, 'attendance'),
            where('schedule_id', '==', scheduleId)
        ));
        const byStudent = {};
        allForLesson.docs.forEach(d => { byStudent[d.data().student_id] = d.ref; });
        
        for (const record of records) {
            const data = {
                schedule_id: scheduleId,
                student_id: record.student_id,
                status: record.status,
                comment: record.comment || '',
                marked_by: markedBy,
                marked_at: Timestamp.now()
            };
            
            if (byStudent[record.student_id]) {
                await updateDoc(byStudent[record.student_id], data);
            } else {
                await addDoc(collection(db, 'attendance'), data);
            }
        }
    },
    
    // ---------- ОТЧЁТЫ И СТАТИСТИКА ----------
    
    async getDashboardStats() {
        const [usersSnap, groupsSnap, studentsSnap, subjectsSnap, scheduleSnap, attSnap] = await Promise.all([
            getDocs(collection(db, 'users')),
            getDocs(collection(db, 'groups')),
            getDocs(collection(db, 'students')),
            getDocs(collection(db, 'subjects')),
            getDocs(collection(db, 'schedule')),
            getDocs(collection(db, 'attendance')),
        ]);
        
        const teachers = usersSnap.docs.filter(d => d.data().role === 'teacher').length;
        const today = new Date().toISOString().slice(0, 10);
        const todayLessons = scheduleSnap.docs.filter(d => d.data().lesson_date === today).length;
        
        // Статистика посещаемости
        const statusDist = { present: 0, absent: 0, late: 0, excused: 0 };
        let total = 0, presentLate = 0;
        
        attSnap.docs.forEach(d => {
            const status = d.data().status;
            if (statusDist.hasOwnProperty(status)) {
                statusDist[status]++;
                total++;
                if (status === 'present' || status === 'late') presentLate++;
            }
        });
        
        const attendanceRate = total > 0 ? Math.round((presentLate * 100) / total * 10) / 10 : 0;
        
        // Топ групп по посещаемости
        const groupStats = {};
        for (const studentDoc of studentsSnap.docs) {
            const groupId = studentDoc.data().group_id;
            if (!groupStats[groupId]) groupStats[groupId] = { total: 0, present: 0 };
        }
        
        for (const attDoc of attSnap.docs) {
            const att = attDoc.data();
            // Найдём студента
            const studentDoc = studentsSnap.docs.find(s => s.id === att.student_id);
            if (studentDoc) {
                const groupId = studentDoc.data().group_id;
                if (groupStats[groupId]) {
                    groupStats[groupId].total++;
                    if (att.status === 'present' || att.status === 'late') {
                        groupStats[groupId].present++;
                    }
                }
            }
        }
        
        const topGroups = [];
        for (const groupDoc of groupsSnap.docs) {
            const stat = groupStats[groupDoc.id];
            if (stat && stat.total > 0) {
                topGroups.push({
                    name: groupDoc.data().name,
                    rate: Math.round((stat.present * 100) / stat.total * 10) / 10
                });
            }
        }
        topGroups.sort((a, b) => b.rate - a.rate);
        
        return {
            total_students: studentsSnap.size,
            total_groups: groupsSnap.size,
            total_teachers: teachers,
            total_subjects: subjectsSnap.size,
            today_lessons: todayLessons,
            attendance_rate: attendanceRate,
            status_distribution: statusDist,
            top_groups: topGroups.slice(0, 5)
        };
    },
    
    async getStudentReport(studentId) {
        // Все записи посещаемости студента
        const attSnap = await getDocs(
            query(collection(db, 'attendance'), where('student_id', '==', studentId))
        );
        
        const history = [];
        const stats = { present_count: 0, absent_count: 0, late_count: 0, excused_count: 0 };
        
        // Кеш предметов
        const subjectCache = {};
        const scheduleCache = {};
        
        for (const d of attSnap.docs) {
            const att = d.data();
            stats[att.status + '_count']++;
            
            // Получаем данные занятия
            if (!scheduleCache[att.schedule_id]) {
                const ss = await getDoc(doc(db, 'schedule', att.schedule_id));
                scheduleCache[att.schedule_id] = ss.exists() ? ss.data() : null;
            }
            const lesson = scheduleCache[att.schedule_id];
            if (!lesson) continue;
            
            // Получаем предмет
            if (!subjectCache[lesson.subject_id]) {
                const subjS = await getDoc(doc(db, 'subjects', lesson.subject_id));
                subjectCache[lesson.subject_id] = subjS.exists() ? subjS.data() : null;
            }
            
            history.push({
                status: att.status,
                lesson_date: lesson.lesson_date,
                lesson_number: lesson.lesson_number,
                subject_name: subjectCache[lesson.subject_id]?.name || '—',
                comment: att.comment
            });
        }
        
        const total = stats.present_count + stats.absent_count + stats.late_count + stats.excused_count;
        const attendance_percent = total > 0 
            ? Math.round(((stats.present_count + stats.late_count) * 100) / total * 10) / 10 
            : 0;
        
        // Имя студента
        const studentSnap = await getDoc(doc(db, 'students', studentId));
        let student_name = '—';
        if (studentSnap.exists()) {
            const userSnap = await getDoc(doc(db, 'users', studentSnap.data().user_id));
            if (userSnap.exists()) student_name = userSnap.data().full_name;
        }
        
        history.sort((a, b) => (b.lesson_date || '').localeCompare(a.lesson_date || ''));
        
        return {
            stats: { ...stats, total, attendance_percent, student_name },
            history: history.slice(0, 50)
        };
    },
    
    async getGroupReport(groupId, dateFrom, dateTo) {
        // Студенты группы
        const studentsSnap = await getDocs(
            query(collection(db, 'students'), where('group_id', '==', groupId))
        );
        
        const result = [];
        
        // Расписание для этой группы в диапазоне дат
        const scheduleSnap = await getDocs(query(
            collection(db, 'schedule'),
            where('group_id', '==', groupId)
        ));
        const scheduleIds = scheduleSnap.docs
            .filter(d => {
                const dt = d.data().lesson_date;
                return dt >= dateFrom && dt <= dateTo;
            })
            .map(d => d.id);
        
        for (const studentDoc of studentsSnap.docs) {
            const student = { id: studentDoc.id, ...studentDoc.data() };
            
            // Имя
            const userSnap = await getDoc(doc(db, 'users', student.user_id));
            const student_name = userSnap.exists() ? userSnap.data().full_name : '—';
            
            const stats = { total_lessons: 0, present: 0, absent: 0, late_count: 0, excused: 0 };
            
            // Только записи посещаемости этого студента за период
            const attSnap = await getDocs(query(
                collection(db, 'attendance'),
                where('student_id', '==', studentDoc.id)
            ));
            
            for (const ad of attSnap.docs) {
                const att = ad.data();
                if (scheduleIds.includes(att.schedule_id)) {
                    stats.total_lessons++;
                    if (att.status === 'present') stats.present++;
                    else if (att.status === 'absent') stats.absent++;
                    else if (att.status === 'late') stats.late_count++;
                    else if (att.status === 'excused') stats.excused++;
                }
            }
            
            const attendance_percent = stats.total_lessons > 0
                ? Math.round(((stats.present + stats.late_count) * 100) / stats.total_lessons * 10) / 10
                : 0;
            
            result.push({
                student_name,
                student_card: student.student_card || '—',
                ...stats,
                attendance_percent
            });
        }
        
        result.sort((a, b) => a.student_name.localeCompare(b.student_name));
        return result;
    },
    
    // ================================================================
    // МАССОВЫЙ ИМПОРТ СТУДЕНТОВ (из Excel)
    // ================================================================
    
    // Получить карту существующих групп { название -> id }
    async getGroupsMap() {
        const snap = await getDocs(collection(db, 'groups'));
        const map = {};
        snap.docs.forEach(d => { map[d.data().name] = d.id; });
        return map;
    },
    
    // Создать группу и вернуть её id (используется при импорте)
    async ensureGroup(name, specialty, course) {
        const ref = await addDoc(collection(db, 'groups'), {
            name, specialty: specialty || '—', course: Number(course) || 1,
            created_at: Timestamp.now()
        });
        return ref.id;
    },
    
    // Получить множество уже существующих студбилетов (чтобы не дублировать)
    async getExistingStudentCards() {
        const snap = await getDocs(collection(db, 'students'));
        const set = new Set();
        snap.docs.forEach(d => { 
            const c = d.data().student_card;
            if (c) set.add(String(c)); 
        });
        return set;
    },
    
    // Импорт пакета студентов.
    // students: массив объектов { full_name, student_card, group_name, specialty, course, phone, birth_date, email }
    // onProgress: callback(processed, total)
    async importStudents(students, onProgress) {
        const groupsMap = await this.getGroupsMap();
        const existingCards = await this.getExistingStudentCards();
        
        let added = 0, skipped = 0, processed = 0;
        const total = students.length;
        
        // Пишем пакетами по 400 операций (лимит batch — 500)
        let batch = writeBatch(db);
        let opsInBatch = 0;
        
        const commitBatch = async () => {
            if (opsInBatch > 0) {
                await batch.commit();
                batch = writeBatch(db);
                opsInBatch = 0;
            }
        };
        
        for (const s of students) {
            processed++;
            
            // Пропускаем дубликаты по студбилету
            if (s.student_card && existingCards.has(String(s.student_card))) {
                skipped++;
                if (onProgress && processed % 25 === 0) onProgress(processed, total, added, skipped);
                continue;
            }
            
            // Создаём группу, если её ещё нет
            let groupId = groupsMap[s.group_name];
            if (!groupId) {
                groupId = await this.ensureGroup(s.group_name, s.specialty, s.course);
                groupsMap[s.group_name] = groupId;
            }
            
            // Создаём пользователя-студента (без аккаунта Auth — только профиль)
            const userRef = doc(collection(db, 'users'));
            batch.set(userRef, {
                full_name: s.full_name,
                email: s.email || '',
                role: 'student',
                is_active: true,
                imported: true,
                created_at: Timestamp.now()
            });
            opsInBatch++;
            
            // Создаём запись студента
            const studentRef = doc(collection(db, 'students'));
            batch.set(studentRef, {
                user_id: userRef.id,
                group_id: groupId,
                student_card: String(s.student_card || ''),
                phone: s.phone || '',
                birth_date: s.birth_date || null,
                enrollment_date: s.enrollment_date || '',
                imported: true,
                created_at: Timestamp.now()
            });
            opsInBatch++;
            
            if (s.student_card) existingCards.add(String(s.student_card));
            added++;
            
            // Коммитим пакет при достижении лимита
            if (opsInBatch >= 400) await commitBatch();
            
            if (onProgress && processed % 25 === 0) onProgress(processed, total, added, skipped);
        }
        
        await commitBatch();
        if (onProgress) onProgress(total, total, added, skipped);
        
        return { added, skipped, total };
    }
};

// Делаем доступным глобально для не-module скриптов
window.API = API;
