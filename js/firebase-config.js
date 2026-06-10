// =====================================================================
// КОНФИГУРАЦИЯ FIREBASE
// =====================================================================
// Проект: Poseshaemost (Актюбинский высший политехнический колледж)
// Конфигурация уже заполнена вашими данными.
//
// Подробная инструкция: см. файл INSTALL.md
// =====================================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Конфигурация вашего проекта Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC20KIXMN1enJMraU9iHTIwPxapKrfbvpY",
    authDomain: "poseshaemost-136cc.firebaseapp.com",
    projectId: "poseshaemost-136cc",
    storageBucket: "poseshaemost-136cc.firebasestorage.app",
    messagingSenderId: "325177206392",
    appId: "1:325177206392:web:15d6893cd1bbd7938c6f8d",
    measurementId: "G-FP7SFTYWPJ"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Делаем доступным глобально (для совместимости с не-module скриптами)
window.firebaseAuth = auth;
window.firebaseDB = db;

console.log("✓ Firebase инициализирован");
