# 🎓 Система учёта посещаемости — АВПК

> Дипломный проект студента  
> **Актюбинский высший политехнический колледж**

Веб-приложение для автоматизации учёта посещаемости занятий студентов колледжа.

![Status](https://img.shields.io/badge/status-готов-success)
![License](https://img.shields.io/badge/license-MIT-blue)
![Tech](https://img.shields.io/badge/tech-Firebase-orange)

---

## 🚀 Быстрый старт

📖 **Подробная инструкция: [INSTALL.md](INSTALL.md)**

Краткая версия:

1. Создайте проект в [Firebase Console](https://console.firebase.google.com)
2. Включите **Authentication** (Email/Password) и **Firestore Database**
3. Вставьте свой `firebaseConfig` в файл `js/firebase-config.js`
4. Откройте `index.html` через локальный сервер или GitHub Pages
5. Зарегистрируйтесь как администратор

---

## 🛠 Технологии

| Слой | Технология |
|------|------------|
| **Frontend** | HTML5, CSS3, JavaScript (ES6 модули) |
| **База данных** | Cloud Firestore (NoSQL) |
| **Аутентификация** | Firebase Authentication |
| **Хостинг** | GitHub Pages (бесплатный) |
| **Шрифты** | Manrope, Fraunces (Google Fonts) |

---

## ✨ Возможности системы

### Для администратора
- 👥 Управление группами и студентами
- 📚 Управление предметами и преподавателями  
- 📅 Создание расписания занятий
- 📊 Просмотр сводной статистики и отчётов
- 📥 Экспорт отчётов в формате CSV

### Для преподавателя
- 📅 Просмотр своего расписания
- ✅ Отметка посещаемости с 4 статусами:
  - Присутствовал
  - Опоздал
  - По уважительной причине
  - Отсутствовал
- 📊 Просмотр отчётов по группам

### Для студента
- 📅 Просмотр своего расписания
- 📈 Просмотр своей посещаемости и статистики

---

## 📁 Структура проекта

```
.
├── index.html                  # Главная страница (SPA)
├── css/
│   └── style.css               # Стили приложения
├── js/
│   ├── firebase-config.js      # 🔧 Конфигурация Firebase
│   ├── api.js                  # Работа с Firestore и Auth
│   ├── components.js           # UI-компоненты (тосты, модалки)
│   ├── pages.js                # Страницы приложения
│   └── app.js                  # Главный модуль (роутинг)
├── INSTALL.md                  # 📘 Полная инструкция по установке
├── README.md                   # Этот файл
└── .gitignore                  # Git-исключения
```

---

## 🗄 Структура базы данных Firestore

База данных состоит из 6 коллекций:

### `users` — пользователи
```javascript
{
  uid: "abc123",
  email: "user@example.com",
  full_name: "Иванов Иван Иванович",
  role: "admin" | "teacher" | "student",
  is_active: true,
  created_at: Timestamp
}
```

### `groups` — учебные группы
```javascript
{
  name: "ИС-21",
  specialty: "Информационные системы",
  course: 2,
  created_at: Timestamp
}
```

### `students` — студенты (привязка пользователя к группе)
```javascript
{
  user_id: "abc123",
  group_id: "xyz789",
  student_card: "2024001",
  phone: "+77011234567",
  birth_date: "2005-03-15",
  enrollment_date: "2023-09-01"
}
```

### `subjects` — учебные предметы
```javascript
{
  name: "Программирование на Python",
  code: "PYT-101",
  hours_total: 120,
  description: "..."
}
```

### `schedule` — расписание
```javascript
{
  group_id: "xyz789",
  subject_id: "subj123",
  teacher_id: "tchr456",
  lesson_date: "2025-06-15",
  lesson_number: 1,
  classroom: "301"
}
```

### `attendance` — посещаемость
```javascript
{
  schedule_id: "sch123",
  student_id: "stu456",
  status: "present" | "absent" | "late" | "excused",
  comment: "",
  marked_by: "uid_преподавателя",
  marked_at: Timestamp
}
```

---

## 🎨 Скриншоты

После запуска вы увидите:
- 🏠 **Экран входа** с брендингом АВПК
- 📊 **Дашборд** со статистикой
- 📅 **Расписание занятий** по дням
- ✅ **Удобную отметку посещаемости** с большими кнопками
- 📋 **Управление группами, студентами, предметами**
- 📈 **Отчёты с экспортом в CSV**

---

## 🔐 Безопасность

- Аутентификация через Firebase Auth (отраслевой стандарт)
- Хеширование паролей выполняет Firebase
- Защита от SQL-инъекций (NoSQL база данных)
- Гибкая ролевая модель (admin / teacher / student)
- Настраиваемые правила безопасности Firestore

---

## 🌐 Демо-режим / Развёртывание

Проект можно бесплатно развернуть на **GitHub Pages**:
1. Загрузите проект в свой репозиторий на GitHub
2. Включите GitHub Pages в настройках репозитория
3. Добавьте свой `*.github.io` домен в разрешённые в Firebase

Подробнее — в [INSTALL.md](INSTALL.md).

---

## 📝 Лицензия

MIT License. Свободно для использования в учебных целях.

---

## 👨‍🎓 Автор

Дипломный проект студента  
**Актюбинский высший политехнический колледж**  
2025

---

## 🤝 Использованные источники

- [Firebase Documentation](https://firebase.google.com/docs)
- [MDN Web Docs](https://developer.mozilla.org/)
- [Google Fonts](https://fonts.google.com/) — Manrope, Fraunces
