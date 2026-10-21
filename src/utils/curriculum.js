// Kurs dasturlari — Notion'dagi dars rejalaridan olingan.
//
// NIMA UCHUN KERAK:
// Ilgari baho qo'yishda "Mavzu" erkin matn edi. "Flexbox", "flex box", "Flex"
// — bir mavzu uch xil yozilardi va statistikada birlashmasdi. Natijada
// "guruh qaysi darsda qoqilyapti?" degan savolga tizim javob bera olmasdi.
//
// Endi har dars barqaror `id` ga ega. Baho shu id bilan saqlanadi, shuning
// uchun darslar bo'yicha jamlash mumkin bo'ladi.
//
// ID FORMATI: <kurs>.<modul>.<dars>   masalan: junior.m1.l8
// MUHIM: mavjud id'larni O'ZGARTIRMANG — eski baholar ularga bog'langan.
// Dars nomini o'zgartirish mumkin, id'ni emas.

export const GRADE_LEVELS = {
  BRONZE: 'bronze',
  SILVER: 'silver',
  GOLD: 'gold',
};

export const GRADE_LEVEL_META = {
  bronze: {
    label: 'Bronze',
    emoji: '🥉',
    description: 'Asosni mustahkamlash — minimal talab',
    badgeClass: 'bg-orange-100 text-orange-700',
    activeClass: 'bg-orange-500 text-white border-orange-500',
    hoverClass: 'hover:border-orange-300',
    weight: 1,
  },
  silver: {
    label: 'Silver',
    emoji: '🥈',
    description: "Real loyiha elementlari — o'tish darajasi",
    badgeClass: 'bg-slate-200 text-slate-700',
    activeClass: 'bg-slate-500 text-white border-slate-500',
    hoverClass: 'hover:border-slate-400',
    weight: 2,
  },
  gold: {
    label: 'Gold',
    emoji: '🥇',
    description: 'Mustaqil, chuqur yechim',
    badgeClass: 'bg-yellow-100 text-yellow-700',
    activeClass: 'bg-yellow-500 text-white border-yellow-500',
    hoverClass: 'hover:border-yellow-300',
    weight: 3,
  },
};

export const GRADE_LEVEL_LIST = ['bronze', 'silver', 'gold'];

// Bir necha dars ketma-ket shu darajada qolsa — ogohlantirish
export const STUCK_THRESHOLD = 3;

const lessons = (moduleId, items) =>
  items.map(([n, title]) => ({
    id: `${moduleId}.l${n}`,
    n,
    title,
    label: `${n}-dars: ${title}`,
  }));

// ─────────────────────────────────────────────────────────────
// JUNIOR DEVELOPER YO'NALISHI (8 oy, 4 modul)
// Manba: Notion — "New Frontend Course — Junior Developer Yo'nalishi"
// ─────────────────────────────────────────────────────────────
const JUNIOR_M1 = lessons('junior.m1', [
  [1, 'Internet va HTML Asoslari'],
  [2, 'Multimedia va Linklar'],
  [3, "Amaliyot — Mening Qahramonim"],
  [4, 'CSS Selectors, Colors va Specificity'],
  [5, 'Tipografiya va Shriftlar'],
  [6, 'Box Model — Masofa va Ramkalar'],
  [7, 'Semantik HTML5 Teglari'],
  [8, 'Flexbox — Zamonaviy Joylashtirish'],
  [9, 'Amaliyot — Instagram Profile Header'],
  [10, 'Hover Effektlar va CSS Transitions'],
  [11, 'Portfolio — Yakuniy Loyiha'],
  [12, '1-oy Demo Day — Portfolio Taqdimoti'],
  [13, 'CSS Position va Z-index'],
  [14, 'CSS Grid'],
  [15, 'Responsive Design va Media Queries'],
  [16, 'CSS Pseudo-elements va ::before/::after'],
  [17, 'CSS Variables (Custom Properties)'],
  [18, 'CSS Animatsiyalar — @keyframes'],
  [19, 'HTML Forms — Professional Formalar'],
  [20, 'CSS Gradient va Filtrlar'],
  [21, 'Rasmlar — object-fit va Optimizatsiya'],
  [22, "CSS Table va Ma'lumotlar Jadvallari"],
  [23, 'Shaxsiy Portfolio v2'],
  [24, 'Amaliyot — Mahsulotlar Katalogi'],
  [25, 'IntersectionObserver va Scroll Animatsiyalar'],
  [26, 'CSS Scroll Snap va Slider'],
  [27, 'CSS Clamp va Fluid Typography'],
  [28, 'CSS Custom Scrollbar va UI Detallar'],
  [29, 'SEO Asoslari va Meta Teglar'],
  [30, 'Lighthouse va Performance'],
  [31, 'Git va GitHub Asoslari'],
  [32, 'VS Code Tricks va Dev Tools'],
  [33, '3-oy Loyiha — Portfolio Final Polish'],
  [34, 'JavaScript Kirish — Console va Birinchi Skript'],
  [35, 'Counter va Hisoblagich Loyiha'],
  [36, '3-oy Demo Day'],
]);

// Eslatma: 10, 11 va 17-darslar Notion'da alohida sahifa emas, modul rejasi
// matnida tasvirlangan. Rejada 24 dars ko'zda tutilgan, hozircha 18 tasi bor
// (5-oyda 19–24 yozilmagan).
const JUNIOR_M2 = lessons('junior.m2', [
  [1, "O'zgaruvchilar va Ma'lumot Turlari"],
  [2, 'Operatorlar va Shartlar (if/else)'],
  [3, 'Funksiyalar'],
  [4, 'Tsikllar — for va while'],
  [5, 'Massivlar (Arrays)'],
  [6, 'Obyektlar (Objects)'],
  [7, 'Math, Tasodifiy Sonlar va Switch'],
  [8, "Switch va Ko'p Shartli Mantiq"],
  [9, 'Mini Demo — JS Turniri'],
  [10, 'Loyiha Rejalashtirish (4-oy final)'],
  [11, 'Loyiha Kodlash (4-oy final)'],
  [12, '4-oy Demo Day — Loyiha Taqdimoti'],
  [13, "DOM ga Kirish"],
  [14, 'Event Listeners'],
  [15, 'Dinamik Elementlar va classList'],
  [16, 'LocalStorage va SessionStorage'],
  [17, 'Form Validation'],
  [18, 'Fetch API va Async/Await'],
]);

const JUNIOR_M3 = lessons('junior.m3', [
  [1, 'Firebase Nima va Loyihani Sozlash'],
  [2, "Email/Parol bilan Ro'yxatdan O'tish"],
  [3, 'Kirish, Chiqish va Sessiya (onAuthStateChanged)'],
  [4, "Firestore — Ma'lumotlar Bazasi"],
  [5, 'Real-Time onSnapshot'],
  [6, 'Security Rules va Xavfsizlik'],
  [7, 'Firebase Hosting — Deploy'],
  [8, 'Grand Final — Chat App Demo Day'],
  [9, 'Google Sign-In va Ijtimoiy Login'],
  [10, 'Firebase Storage — Rasm Yuklash'],
  [11, "Multi-page App — To'liq Auth Tizimi"],
  [12, '3-Modul Demo Day — Firebase Badge'],
]);

const JUNIOR_M4 = lessons('junior.m4', [
  [1, 'React va JSX Asoslari'],
  [2, 'useState Hook'],
  [3, 'useEffect Hook'],
  [4, 'React Router v6'],
  [5, 'useContext va Custom Hooks'],
  [6, 'Next.js App Router Kirish'],
  [7, 'Tailwind CSS'],
  [8, 'Grand Final Loyiha'],
]);

// ─────────────────────────────────────────────────────────────
// FRONTEND COURSE BY NAJOT TA'LIM (5 oy)
// Manba: Notion — "FrontEnd Course by Na`jot Ta`lim"
// Eslatma: Notion'da sahifalar "1-dars", "2-lesson" deb nomlangan.
// Quyidagi nomlar har bir dars sahifasining ichidagi "Dars mavzusi"
// bo'limidan olingan — ya'ni haqiqiy o'tilgan mavzular.
// ─────────────────────────────────────────────────────────────
const NAJOT_M1 = lessons('najot.m1', [
  [1, 'Kirish, VS Code, HTML hujjat strukturasi'],
  [2, 'Block va Inline elementlar, tables, img'],
  [3, 'Style turlari, div/span, box-model, specificity'],
  [4, 'Container, semantik teglar, inline-block mashqlar'],
  [5, 'Flexbox — header yasash, flexboxfroggy'],
  [6, 'Fontlar, letter-spacing, line-height'],
  [7, 'Flex davomi, background-image, gradient, shadow'],
  [8, 'Qaytarish — box-model, flex, selektorlar'],
  [9, 'Form'],
  [10, "Position, z-index, dropdown, CSS o'zgaruvchilar"],
  [11, 'Amaliyot'],
]);

const NAJOT_M2 = lessons('najot.m2', [
  [1, 'BEM metodologiyasi, before/after, retina, iframe, transition'],
  [2, 'Dropdown, gradient, transform, Git va GitHub asoslari'],
  [3, 'BEM amaliyot, sticky footer, GitHub Pages va Netlify deploy'],
  [4, 'CSS selektorlar (>, ~, +), checkbox, radio, fieldset'],
  [5, 'Sass/SCSS kirish — arxitektura, import, o\'zgaruvchilar'],
  [6, 'Jadval taglari (table, thead, tbody), retina rasmlar'],
  [7, 'min/max width, overflow, adaptiv verstka va media query'],
  [8, 'HTML template, SCSS mixinlar, hamburger menu'],
  [9, 'WebP va SVG rasmlar, picture elementi, admin dashboard'],
  [10, 'GitHub issues, branch, fork, pull request, carousel'],
  [11, 'Google PageSpeed, takrorlash — responsive, mixin, position'],
  [12, 'Imtihon'],
]);

const NAJOT_M3 = lessons('najot.m3', [
  [1, 'GitHub Student Pack, issue va pull request amaliyoti'],
  [2, 'Bootstrap — grid, container, breakpoints, komponentlar'],
  [3, 'Bootstrap formalar, select, checks/radios, modal, carousel'],
  [4, 'JS kirish, data types'],
  [5, 'Operatorlar, if...else'],
  [6, 'for, type conversion, prompt'],
  [7, 'while, switch..case, amaliyot'],
  [8, 'function, scope, hoisting'],
  [9, 'recursion, object, constructor function'],
  [10, 'object, prototype, array'],
  [11, 'object va array methods, string'],
  [12, 'number va symbol, methods'],
  [13, 'Imtihon'],
]);

const NAJOT_M4 = lessons('najot.m4', [
  [1, 'Errors, try...catch, module'],
  [2, 'ES6'],
  [3, 'Map, WeakMap, DOM tree, getElementById'],
  [4, 'DOM, selectors'],
  [5, 'DOM, dataset, innerHTML, outerHTML'],
  [6, 'DOM style, classList'],
  [7, 'Document fragment, event delegation, web storages'],
  [8, 'cloneNode, fragment'],
  [9, 'Promise, async functions'],
  [10, 'Amaliyot, session, cookie'],
  [11, 'Amaliyot'],
  [12, 'Amaliyot'],
  [13, 'Imtihon'],
]);

const NAJOT_M5 = lessons('najot.m5', [
  [1, 'Node.js, npm, SPA va React bilan tanishuv'],
  [2, 'React sintaksisi — komponentlar, props, children, useState'],
  [3, 'Todo app, hooks, inline style, useRef, module css'],
  [4, 'Lifecycle, useEffect, useCallback, useContext, API bilan ishlash'],
  [5, 'React Router Dom — BrowserRouter, Routes, Link, useParams'],
  [6, 'React Router davomi — NavLink, amaliyot'],
  [7, 'Context/Provider, custom hook, reusable komponentlar, forwardRef'],
  [8, 'Authentication — public/protected routes, nested routes'],
  [9, 'UI frameworklar (MUI, Ant Design), styled-components, linterlar'],
  [10, 'PropTypes'],
  [11, 'Lazy loading va Redux'],
  [12, 'Redux Toolkit, axios, svg component, Next.js'],
]);

export const CURRICULA = [
  {
    id: 'junior',
    name: "Junior Developer Yo'nalishi",
    modules: [
      { id: 'junior.m1', name: '1-Modul: Visual Foundation (1–3 oy)', lessons: JUNIOR_M1 },
      { id: 'junior.m2', name: '2-Modul: Algoritmlar va Mantiq (4–5 oy)', lessons: JUNIOR_M2 },
      { id: 'junior.m3', name: '3-Modul: Firebase (6-oy)', lessons: JUNIOR_M3 },
      { id: 'junior.m4', name: '4-Modul: React & Next.js (7–8 oy)', lessons: JUNIOR_M4 },
    ],
  },
  {
    id: 'najot',
    name: "FrontEnd Course by Najot Ta'lim",
    modules: [
      { id: 'najot.m1', name: '1-oy: HTML & CSS', lessons: NAJOT_M1 },
      { id: 'najot.m2', name: '2-oy', lessons: NAJOT_M2 },
      { id: 'najot.m3', name: '3-oy: JavaScript asoslari', lessons: NAJOT_M3 },
      { id: 'najot.m4', name: '4-oy: DOM va Async', lessons: NAJOT_M4 },
      { id: 'najot.m5', name: '5-oy: React', lessons: NAJOT_M5 },
    ],
  },
];

// Tez qidirish uchun yassi indeks: { 'junior.m1.l8': {...} }
export const LESSON_INDEX = CURRICULA.reduce((acc, course) => {
  course.modules.forEach((mod) => {
    mod.lessons.forEach((lesson) => {
      acc[lesson.id] = {
        ...lesson,
        courseId: course.id,
        courseName: course.name,
        moduleId: mod.id,
        moduleName: mod.name,
      };
    });
  });
  return acc;
}, {});

export const getCourse = (courseId) => CURRICULA.find((c) => c.id === courseId) || null;

export const getLesson = (lessonId) => LESSON_INDEX[lessonId] || null;

// Select uchun optgroup'siz variantlar (modul nomi prefiks sifatida)
export const getLessonOptions = (courseId) => {
  const course = getCourse(courseId);
  if (!course) return [];
  return course.modules.flatMap((mod) =>
    mod.lessons.map((lesson) => ({
      value: lesson.id,
      label: `${mod.name.split(':')[0].trim()} · ${lesson.label}`,
    }))
  );
};

export const getCourseOptions = () =>
  CURRICULA.map((c) => ({ value: c.id, label: c.name }));

// Darajalar ketma-ketligi: bronze → silver → gold
// Oxirgi darajadan keyin null qaytadi (gold — tepasi yo'q).
export const getNextLevel = (level) => {
  const i = GRADE_LEVEL_LIST.indexOf(level);
  if (i === -1 || i === GRADE_LEVEL_LIST.length - 1) return null;
  return GRADE_LEVEL_LIST[i + 1];
};

// O'quvchiga ko'rsatiladigan undov matni.
// Maqsad — bolani "sen Bronzesan" deb tamg'alash emas, keyingi qadamni
// ko'rsatish. Shuning uchun matn har doim harakatga chaqiradi.
export const getLevelNudge = (level) => {
  const next = getNextLevel(level);
  if (!next) {
    return { done: true, text: "Eng yuqori daraja — zo'r ish!" };
  }
  const nextMeta = GRADE_LEVEL_META[next];
  return {
    done: false,
    next,
    text: `Keyingi qadam: ${nextMeta.emoji} ${nextMeta.label} topshirig'i`,
  };
};

// Bahoda saqlangan mavzuni ko'rsatish.
// Eski baholarda lessonId yo'q — o'sha erkin matn ishlatiladi (backward compat).
export const resolveTopicLabel = (grade) => {
  if (grade?.lessonId && LESSON_INDEX[grade.lessonId]) {
    return LESSON_INDEX[grade.lessonId].label;
  }
  return grade?.topic || '—';
};
