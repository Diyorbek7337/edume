// Junior kursi — 3-Modul: Real-World Tools & Firebase (6-oy)
//
// ⚠️ MUHIM TEXNIK ESLATMA:
// Dars matni JS template literal ichida. Kodidagi HAR BIR `${` belgisi
// `\${` deb escape qilinishi SHART, backtick esa \` deb.
//
// Demolardagi cheklovlar (sandboxed iframe):
//   ❌ Haqiqiy Firebase ishlamaydi (tarmoq + autentifikatsiya)
//   ✅ Taqlid (simulyatsiya) bilan konsepsiyani ko'rsatish mumkin

export const JUNIOR_M3_CONTENT = {
  // ═══════════════════════════════════════════════════════════
  'junior.m3.l12': {
    goal: "Yakuniy Demo Day: to'liq ilovani taqdim etish, portfolioga tayyorlash va Firebase Developer Badge.",
    student: `
## 🏆 Bugun modul tugaydi

O'n bir darsda siz **ishlaydigan mahsulot** qurdingiz:

\`\`\`text
Auth          ro'yxatdan o'tish, kirish, chiqish, Google
Firestore     xabarlar, profillar, real-time
Rules         serverdagi himoya
Storage       rasm (yoki Firestore'ga base64)
Hosting       internetda, HTTPS bilan
Ko'p sahifa   himoyalangan yo'nalishlar
\`\`\`

Bu — mashq emas. Bu **portfolioga qo'yiladigan loyiha**.

---

## ✅ Yakuniy tekshiruv

Bandlarni belgilang — darajangiz o'zi hisoblanadi.

\`\`\`demo h=620 "Yakuniy baholash"
<style>
  * { box-sizing: border-box; }
  body { font-family: sans-serif; font-size: 13px; margin: 0; padding: 14px; }

  .bolim { margin-bottom: 12px; }
  .bolim h4 {
    margin: 0 0 6px; font-size: 11px; font-family: monospace;
    text-transform: uppercase; letter-spacing: .5px;
  }
  .b1 h4 { color: #c2691a; }
  .b2 h4 { color: #64748b; }
  .b3 h4 { color: #b45309; }

  .band {
    display: flex; align-items: flex-start; gap: 8px;
    padding: 6px 9px; border: 1px solid #e5e7eb; border-radius: 7px;
    margin-bottom: 4px; cursor: pointer; font-size: 12px; line-height: 1.5;
  }
  .band:hover { background: #f9fafb; }
  .band.bajarildi { background: #f0fdf4; border-color: #86efac; }
  .quti {
    width: 17px; height: 17px; border: 2px solid #d1d5db;
    border-radius: 4px; flex: 0 0 auto; font-size: 12px; margin-top: 1px;
    display: flex; align-items: center; justify-content: center;
    color: white; line-height: 1;
  }
  .bajarildi .quti { background: #16a34a; border-color: #16a34a; }
  .band .dars { color: #9ca3af; font-size: 10.5px; font-family: monospace; }

  #natija {
    position: sticky; bottom: 0;
    margin-top: 14px; padding: 13px; border-radius: 10px;
    text-align: center; font-size: 14px; font-weight: 700;
    border: 2px solid #e5e7eb; background: #f9fafb; color: #6b7280;
  }
  #natija small { display: block; font-weight: 400; font-size: 11.5px; margin-top: 4px; }
  .lvl-bronze { background: #fff7ed !important; border-color: #fdba74 !important; color: #c2691a !important; }
  .lvl-silver { background: #f8fafc !important; border-color: #cbd5e1 !important; color: #475569 !important; }
  .lvl-gold   { background: #fffbeb !important; border-color: #fcd34d !important; color: #b45309 !important; }
</style>

<div class="bolim b1"><h4>🥉 Bronze</h4><div id="g1"></div></div>
<div class="bolim b2"><h4>🥈 Silver</h4><div id="g2"></div></div>
<div class="bolim b3"><h4>🥇 Gold</h4><div id="g3"></div></div>

<div id="natija"></div>

<script>
  var bandlar = [
    { g: 1, t: "Ro'yxatdan o'tish va kirish ishlaydi", d: '2–3' },
    { g: 1, t: "Himoyalangan sahifa kirmasdan ochilmaydi", d: '3' },
    { g: 1, t: "Xabar yoziladi va o'qiladi", d: '4' },
    { g: 1, t: "Security Rules yozilgan (test mode emas)", d: '6' },
    { g: 1, t: "Chiqish ishlaydi", d: '3' },

    { g: 2, t: "Real-time: ikki oynada o'zi yangilanadi", d: '5' },
    { g: 2, t: "Chiqib-kirganda xabar ikkilanmaydi", d: '5' },
    { g: 2, t: "XSS himoyasi — <b>test</b> matn bo'lib chiqadi", d: '5' },
    { g: 2, t: "Faqat egasi o'z xabarini o'chiradi", d: '6' },
    { g: 2, t: "Google Sign-In ishlaydi", d: '9' },
    { g: 2, t: "Ikki usul to'qnashuvi tushunarli aytiladi", d: '9' },
    { g: 2, t: "Internetda, telefondan ham ochiladi", d: '7' },

    { g: 3, t: "Ko'p sahifa: panel yashirin boshlanadi", d: '11' },
    { g: 3, t: "Orqaga tugmasi to'g'ri ishlaydi (replace)", d: '11' },
    { g: 3, t: "Profil rasmi — kichiklashtirib saqlanadi", d: '10' },
    { g: 3, t: "Xatolar ekranda, konsolda emas", d: '2–11' },
    { g: 3, t: "Bo'sh va yuklanish holatlari bor", d: '3, 8' },
    { g: 3, t: "README yozilgan, havola ishlaydi", d: '12' }
  ];

  var holat = [];
  for (var i = 0; i < bandlar.length; i++) holat.push(false);

  var guruh = { 1: document.querySelector('#g1'), 2: document.querySelector('#g2'), 3: document.querySelector('#g3') };
  var natija = document.querySelector('#natija');
  var elementlar = [];

  function sana(g) {
    var jami = 0, bor = 0;
    for (var i = 0; i < bandlar.length; i++) {
      if (bandlar[i].g === g) { jami++; if (holat[i]) bor++; }
    }
    return { jami: jami, bor: bor, tola: bor === jami };
  }

  function yangila() {
    for (var i = 0; i < holat.length; i++) {
      elementlar[i].className = 'band' + (holat[i] ? ' bajarildi' : '');
      elementlar[i].querySelector('.quti').textContent = holat[i] ? '\\u2713' : '';
    }

    var b = sana(1), s = sana(2), g = sana(3);

    if (g.tola && s.tola && b.tola) {
      natija.className = 'lvl-gold';
      natija.innerHTML = '\\ud83e\\udd47 GOLD \\u2014 Firebase Developer' +
        '<small>Hammasi bajarildi. Bu loyihani ishga topshirishda ko\\'rsatsangiz bo\\'ladi.</small>';
    } else if (s.tola && b.tola) {
      natija.className = 'lvl-silver';
      natija.innerHTML = '\\ud83e\\udd48 SILVER' +
        '<small>Gold uchun yana ' + (g.jami - g.bor) + ' band qoldi.</small>';
    } else if (b.tola) {
      natija.className = 'lvl-bronze';
      natija.innerHTML = '\\ud83e\\udd49 BRONZE' +
        '<small>Silver uchun yana ' + (s.jami - s.bor) + ' band qoldi.</small>';
    } else {
      natija.className = '';
      natija.innerHTML = 'Bronze uchun yana ' + (b.jami - b.bor) + ' band' +
        '<small>Avvalgi darajani to\\'liq yopmasdan keyingisi berilmaydi.</small>';
    }
  }

  for (var i = 0; i < bandlar.length; i++) {
    (function (n) {
      var el = document.createElement('div');
      el.className = 'band';

      var q = document.createElement('span');
      q.className = 'quti';

      var t = document.createElement('span');
      t.style.flex = '1';
      t.textContent = bandlar[n].t;

      var d = document.createElement('span');
      d.className = 'dars';
      d.textContent = bandlar[n].d + '-dars';

      el.append(q, t, d);
      el.addEventListener('click', function () {
        holat[n] = !holat[n];
        yangila();
      });

      elementlar.push(el);
      guruh[bandlar[n].g].appendChild(el);
    })(i);
  }

  yangila();
</script>
\`\`\`

> ⚠️ **Profil rasmi** bandi Storage'siz ham bajariladi — 10-darsdagi Firestore yo'li (\`canvas\` bilan kichiklashtirib base64 saqlash) to'liq hisoblanadi. Blaze rejasi talab qilinmaydi.

---

## 🎤 Taqdimot (8 daqiqa)

**Demo — 5 daqiqa**

1. Saytni oching — \`https://...web.app\` (kompyuter **va** telefon)
2. Sinfdoshingiz **hozir** ro'yxatdan o'tsin
3. Ikki qurilmadan yozishing — real-time
4. Google Sign-In'ni ko'rsating
5. Konsolda boshqaning xabarini o'chirishga uring → \`permission-denied\`

**Tushuntirish — 3 daqiqa**

- "Firebase'ning qaysi xizmatlaridan foydalandim va nima uchun"
- "Security Rules'im nimani taqiqlaydi"
- "Eng qiyin qism **...** edi"
- "Hozir ishlamayotgan narsa: **...**"

> 💡 Oxirgi savol — eng muhimi. Kamchiligini o'zi aytgan odam kuchli dasturchi.

---

## 💼 Portfolioga tayyorlash

Loyiha ishlaydi. Endi uni **boshqa odam tushunadigan** qiling. Bu ish 20 daqiqa oladi va loyihaning qiymatini butunlay o'zgartiradi.

**1. README.md** — repozitoriyning bosh sahifasi:

\`\`\`markdown
# Chat App

Firebase asosidagi real-time chat ilovasi.

**Ishlaydigan versiya:** https://loyiham.web.app

## Imkoniyatlar
- Email/parol va Google orqali kirish
- Real vaqtda yangilanadigan xabarlar
- Faqat egasi o'z xabarini o'chira oladi
- Profil rasmi (brauzerda kichiklashtiriladi)

## Texnologiyalar
HTML, CSS, JavaScript (ES modullar), Firebase Auth, Firestore, Hosting

## Ishga tushirish
1. Firebase loyihasi yarating
2. \`public/firebase-config.js\` da sozlamalarni yozing
3. \`firebase deploy\`

## O'rgangan narsalarim
Eng qiyini — Security Rules'ning filtr emasligini tushunish edi...
\`\`\`

**2. Ekran surati** — README'ga bitta rasm qo'ying. Odamlar o'qishdan oldin **qaraydi**.

**3. Havolani sinang** — maxfiy oynada oching. Ishlayaptimi?

> 💡 **"O'rgangan narsalarim" bo'limini albatta yozing.** Ishga qabul qiluvchi kodni ham ko'radi, lekin **qanday o'ylashingizni** bilishni ham xohlaydi. Qiyinchilikni va uni qanday yechganingizni yozgan odam — o'rganishni biladigan odam.

---

## 🔧 Loyiha ishlab tursin

Kurs tugagach loyiha o'zi buzilishi mumkin. Ikki narsaga e'tibor:

| Nima | Qachon | Belgi |
| --- | --- | --- |
| **Test mode** qoidalari | 30 kunda | \`Missing or insufficient permissions\` |
| Firebase loyihasi **o'chirilishi** | Uzoq ishlatilmasa | Sayt umuman ochilmaydi |

Qoidalarni to'g'ri yozgan bo'lsangiz (6-dars) — birinchisi sizga tegmaydi.

Oyda bir marta saytingizni ochib ko'ring. Portfoliodagi **ishlamaydigan havola** — bo'lmagan havoladan yomonroq.

---

## 🗺 Bundan keyin nima?

Kursning to'liq yo'li:

\`\`\`text
1–3 oy    HTML + CSS                    1-Modul
4–5 oy    JavaScript, algoritmlar       2-Modul
6-oy      Firebase                      3-Modul   ← siz shu yerdasiz
7–8 oy    React, Next.js, Tailwind      4-Modul
\`\`\`

**Keyingi modul — React.** Nima uchun kerakligini siz allaqachon bilasiz:

| Bugun qo'lda qildingiz | React'da |
| --- | --- |
| \`menyuniQoy()\` — menyuni massivdan chizish | \`<Nav />\` komponenti |
| \`panel.hidden = true/false\` | Holat o'zgarsa — o'zi qayta chiziladi |
| \`unsubscribe()\` ni qo'lda yopish | \`useEffect\` ning \`return\` qismi |
| Har sahifada qayta yozish | Bir marta yozib, qayta ishlatish |

> 💡 React **sehrli emas**. U siz bugun qo'lda yechgan muammolarni yechadi. Shuning uchun siz uni tezroq tushunasiz — muammoni o'z terangizda his qilgansiz.

---

## 🏅 Firebase Developer

Siz endi quyidagilarni bilasiz:

- Autentifikatsiya tizimini noldan qurish
- Bulutdagi ma'lumotlar bazasi bilan ishlash
- Real vaqtda yangilanadigan interfeys
- **Serverdagi** xavfsizlik qoidalari
- Foydalanuvchi ma'lumotini himoyalash va **kamroq yig'ish**
- Loyihani internetga chiqarish

Oxirgisi eng muhimi: **ishlaydigan mahsulotni oxirigacha yetkazish**. Ko'p odam kod yozishni biladi; oxirigacha yetkazish — boshqa ko'nikma.

> 🏆 **Tabriklaymiz. Havolani do'stlaringizga yuboring — bu sizning ilovangiz.**
`,
    teacher: `
## 🔴 Yo'l xaritasi chalkash

Asl sahifadagi yakuniy sxema:

\`\`\`text
1-3 oy: HTML5 + CSS3 + JavaScript asoslari
   ↓
6-oy: Firebase ...
   ↓
4-oy JavaScript chuqurroq (DOM, Arrays, Objects)
   ↓
7-8 oy: React.js + Next.js
\`\`\`

Tartib: **1–3 → 6 → 4 → 7–8**. Oltinchi oy to'rtinchi oydan **oldin** kelgan.

Aslida 4–5 oy — bu 2-Modul ("Algoritmlar va Mantiq"), ya'ni bola uni **allaqachon** o'tgan. Sxema esa uni kelajakda deb ko'rsatyapti.

Ikkinchi chalkashlik: sahifada bir necha joyda **"4-oy React.js"** deyilgan. React — bu **4-Modul**, lekin u **7–8 oyda**. "4-Modul" va "4-oy" aralashib ketgan.

Bola yo'l xaritasiga qarab "menga yana JavaScript asoslari kerakmi?" deb o'ylaydi.

**Tuzatilgan tartib:**

\`\`\`text
1–3 oy    HTML + CSS                1-Modul
4–5 oy    JavaScript                2-Modul
6-oy      Firebase                  3-Modul
7–8 oy    React, Next.js            4-Modul
\`\`\`

---

## 🔴 Gold bepul rejada bajarib bo'lmaydi

Asl Gold talabi: **"Profil rasmi (Firebase Storage)"**.

10-darsda aniqlandi: Storage **Blaze** (karta bog'langan) rejasini talab qiladi; Spark rejasida so'rovlar \`402\`/\`403\` bilan qaytadi.

Ya'ni o'quvchilarning ko'pchiligi Gold'ni **printsipial** ravishda ololmaydi — texnik qobiliyati bilan bog'liq bo'lmagan sabab tufayli.

Tuzatildi: 10-darsdagi Firestore yo'li (canvas bilan kichiklashtirib base64 saqlash) **to'liq** hisoblanadi. O'quv maqsadi — fayl bilan ishlash va optimallashtirish — ikkala yo'lda ham bir xil bajariladi.

---

## 🔴 "Xabar 'o'qildi' belgisi" — o'rgatilmagan va qoidaga zid

Gold talabida shu band bor, lekin:

**1. Hech qaysi darsda o'rgatilmagan.** U talab qiladi: har xabarda o'qiganlar ro'yxati (massiv yoki subkolleksiya), ko'rinish kuzatuvi, guruhli yangilash.

**2. 6-darsdagi qoidamizga to'g'ridan-to'g'ri zid:**

\`\`\`javascript
match /messages/{messageId} {
  allow update: if false;    // xabarlarni tahrirlash taqiqlangan
}
\`\`\`

"O'qildi" belgisi uchun **boshqa odam** sizning xabaringizni yangilashi kerak. Ya'ni qoidani ochish talab qilinadi — va uni xavfsiz qilish (faqat \`oqiganlar\` maydoni o'zgarsin) \`diff().affectedKeys()\` bilan ishlashni talab qiladi, bu esa bu daraja uchun og'ir.

Band olib tashlandi. O'rniga shu paytgacha o'rgatilgan, lekin ko'pincha e'tibordan chetda qoladigan narsalar qo'yildi: bo'sh holat, yuklanish holati, xatolarni ekranda ko'rsatish.

> ⚠️ Bu — "o'rgatilmagan narsani talab qilish" naqshining **yettinchi** holati. 8-darsda ham shunday edi.
>
> **Tavsiya:** har topshiriq yozganda bir savol bering: *"bu yerdagi har bir narsa shu darsgacha o'rgatilganmi?"* Bu naqsh doimiy takrorlanayapti.

---

## ⚠️ "Lighthouse 80+"

Qaysi ko'rsatkich? Lighthouse to'rt xil ball beradi. Bundan tashqari login orqasidagi sahifani u tekshira olmaydi. 8-darsdagi kabi bu yerda ham olib tashlandi.

---

## ⚠️ Jadval hisobi

"Har o'quvchi 8–10 daqiqa" uchun 50 daqiqa ajratilgan — bu **5–6 o'quvchiga** yetadi. Guruhingiz kattaroq bo'lsa: taqdimotni 5 daqiqaga qisqartiring yoki ikki darsga bo'ling.

---

## 🗒 Qo'shilgan narsalar

**Portfolio bo'limi.** Asl sahifada rubrikada "GitHub URL" maydoni bor, lekin **repozitoriyni tayyorlash** haqida hech narsa yo'q. README, ekran surati, ishlaydigan havola — bu 20 daqiqalik ish va loyihaning qiymatini butunlay o'zgartiradi.

Ayniqsa **"O'rgangan narsalarim"** bo'limi muhim: ishga qabul qiluvchi kodni ham ko'radi, lekin qanday o'ylashni bilishni ham xohlaydi.

**Loyiha ishlab tursin.** Kurs tugagach loyiha o'zi buzilishi mumkin (test mode muddati, uzoq ishlatilmagan loyiha). Portfoliodagi ishlamaydigan havola — bo'lmagan havoladan yomonroq. Oyda bir marta tekshirish tavsiyasi qo'shildi.

**React bog'lanishi aniqlashtirildi.** Asl sahifadagi "Vanilla JS / React" jadvali umumiy. O'rniga bola **shu modulda qo'lda yechgan** muammolar bilan bog'landi: \`menyuniQoy\` → \`<Nav />\`, \`panel.hidden\` → holat, \`unsubscribe()\` → \`useEffect\` return. Bu ancha kuchli motivatsiya beradi.

**Baholash o'z-o'zidan hisoblanadi.** Interaktiv ro'yxat darajani hisoblaydi va har bandda qaysi darsdan ekani ko'rsatilgan — bola kamchilikni qaysi darsdan takrorlashni biladi.

---

## 💡 O'qituvchi uchun

- **Badge marosimini jiddiy qiling.** Chop etilgan sertifikat, ism yozilgan. Bu bolalar uchun kutilganidan ko'ra ko'proq narsa anglatadi va ota-onalarga ko'rsatiladi.
- **Ota-onalarni chaqiring.** Bu modul — butun kursdagi eng ko'rsatsa bo'ladigan natija. Telefonda ochilib ishlaydigan ilova — tushuntirish shart emas.
- **Havolalarni guruh chatiga tashlating.** Hamma bir-birining ilovasida ro'yxatdan o'tsin. Bu — bir vaqtning o'zida real sinov va eng qiziqarli qism.
- **Portfolio qismiga alohida vaqt ajrating.** Bolalar buni "keyin qilaman" deydi va hech qachon qilmaydi. Darsda 20 daqiqa bering va README'ni **birga** yozing.
- **Kuchsizroq ishlarni ham hurmat bilan qabul qiling.** Bronze darajasi ham — ishlaydigan, internetdagi, autentifikatsiyali ilova. Uch oy oldin bu bola \`<h1>\` yozgan edi.

## 📊 Badge mezoni

| Daraja | Nima kerak |
| --- | --- |
| 🏆 **Firebase Developer** | Silver to'liq + Gold'dan kamida 4 band |
| 🥈 **Qoniqarli** | Bronze to'liq + Silver'dan kamida 4 band |
| 🔁 **Qayta** | Bronze to'liq emas |

> **Eng tez tekshiruv (2 daqiqa):**
>
> 1. Bolaning saytini **o'z telefoningizda** oching
> 2. Ro'yxatdan o'ting
> 3. \`<b>salom</b>\` deb yozing
> 4. Chiqib, qayta kiring
> 5. \`dashboard.html\` ni maxfiy oynada oching
>
> Bu besh qadam butun modulni tekshiradi: deploy, auth, XSS himoyasi, listener ikkilanishi, sahifa himoyasi.
`,
  },

  // ═══════════════════════════════════════════════════════════
  'junior.m3.l11': {
    goal: "Ko'p sahifali ilova: modullarga bo'lish, sahifa himoyasi va yo'naltirish tuzoqlari.",
    student: `
## 🗂️ Nima uchun modullarga bo'lamiz?

Shu paytgacha har sahifada Firebase sozlamasi qaytadan yozilgan:

\`\`\`javascript
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
\`\`\`

Beshta sahifada beshta nusxa. SDK manzilini o'zgartirish kerak bo'lsa — **besh joyda** tuzatasiz. Bittasini unutsangiz — o'sha sahifa buziladi.

Yechim: bir marta yozib, hamma joyda **import qilish**.

\`\`\`text
loyiha/
├── public/                   ← faqat shu papka internetga chiqadi (7-dars)
│   ├── index.html            ← Login
│   ├── register.html
│   ├── dashboard.html        ← himoyalangan
│   ├── profile.html          ← himoyalangan
│   ├── chat.html             ← himoyalangan
│   ├── firebase-config.js    ← public/ ICHIDA bo'lishi SHART
│   ├── css/style.css
│   └── js/
│       ├── firebase.js       ← sozlash, bir marta
│       ├── auth.js           ← himoya funksiyalari
│       ├── nav.js            ← umumiy menyu
│       ├── login.js
│       ├── dashboard.js
│       └── chat.js
├── firestore.rules
└── firebase.json
\`\`\`

> ⚠️ **\`firebase-config.js\` \`public/\` ichida bo'lsin.** Uni loyiha ildizida qoldirsangiz, sayt **kompyuteringizda ishlaydi, deploy'dan keyin ishlamaydi** — chunki \`public/\` dan tashqaridagi fayllar internetga chiqmaydi.
>
> Konsolda: \`Failed to fetch dynamically imported module\`. Bu — topish qiyin xato, chunki kodda hech qanday xatolik yo'q.

---

## 🔧 firebase.js — markaziy sozlash

\`\`\`javascript
// js/firebase.js
import { initializeApp } from '.../firebase-app.js';
import { getAuth } from '.../firebase-auth.js';
import { getFirestore } from '.../firebase-firestore.js';
import { firebaseConfig } from '../firebase-config.js';

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
\`\`\`

Endi har sahifada:

\`\`\`javascript
import { auth, db } from './js/firebase.js';
\`\`\`

> 💡 \`initializeApp\` bir marta chaqiriladi — modul birinchi import qilinganda. Keyingi importlar **o'sha** nusxani oladi. Bu ES modullarining xususiyati.

---

## 🔐 Sahifa himoyasi va uchta holat

3-darsda ko'rgan edik: auth holati **uchta** bo'ladi — noma'lum, kirgan, kirmagan. Ko'p sahifali ilovada bu yana muhim bo'ladi.

\`\`\`demo h=470 "Himoya: uchta holat"
<style>
  * { box-sizing: border-box; }
  body { font-family: sans-serif; font-size: 13px; margin: 0; padding: 14px; }

  .tanlov { display: flex; gap: 6px; margin-bottom: 12px; flex-wrap: wrap; }
  .tanlov button {
    padding: 7px 11px; border: 1px solid #d1d5db; background: white;
    border-radius: 7px; font-size: 11px; cursor: pointer; font-family: monospace;
  }
  .tanlov button.faol { background: #6366f1; color: white; border-color: #6366f1; }

  .brauzer {
    border: 2px solid #d1d5db; border-radius: 10px; overflow: hidden;
  }
  .manzil {
    background: #f3f4f6; padding: 7px 11px; font-family: monospace;
    font-size: 11px; color: #4b5563; border-bottom: 1px solid #d1d5db;
  }
  .ekran {
    min-height: 150px; padding: 14px; display: flex;
    align-items: center; justify-content: center; text-align: center;
  }

  .yuklanmoqda { color: #9ca3af; font-size: 13px; }
  .maxfiy { background: #fef2f2; color: #b91c1c; font-weight: 700; }
  .panel-ok { color: #15803d; }

  .kod {
    margin-top: 12px; background: #1e293b; color: #e2e8f0; border-radius: 8px;
    padding: 11px; font-family: monospace; font-size: 10.5px;
    line-height: 1.8; white-space: pre-wrap;
  }
  .kod .faolQator { background: #334155; border-radius: 3px; }
  .kod .yon { color: #64748b; }

  #izoh {
    margin-top: 10px; border-radius: 8px; padding: 11px;
    font-size: 12px; line-height: 1.8; min-height: 66px;
  }
  .yaxshi { background: #f0fdf4; border: 2px solid #86efac; color: #15803d; }
  .yomon  { background: #fef2f2; border: 2px solid #fca5a5; color: #b91c1c; }
  #izoh code { background: rgba(0,0,0,.07); padding: 1px 5px; border-radius: 3px; font-family: monospace; font-size: 11px; }
</style>

<div class="tanlov">
  <button data-h="yuk" class="faol">1. Auth hali noma'lum</button>
  <button data-h="kirgan">2. Kirgan</button>
  <button data-h="yoq">3. Kirmagan</button>
</div>

<div class="brauzer">
  <div class="manzil">https://loyiha.web.app/dashboard.html</div>
  <div class="ekran" id="ekran"></div>
</div>

<div class="kod" id="kod"></div>
<div id="izoh"></div>

<script>
  var holatlar = {
    yuk: {
      ekran: '<span class="yuklanmoqda">⏳ Yuklanmoqda...</span>',
      qator: 0,
      sinf: 'yaxshi',
      izoh: "Firebase sessiyani qurilmadan tiklayapti. Bu <b>bir necha yuz millisekund</b> davom etadi.<br />Shu paytda sahifa <code>hidden</code> bo'lib turishi kerak \\u2014 aks holda maxfiy ma'lumot bir lahzaga ko'rinib ketadi."
    },
    kirgan: {
      ekran: '<div class="panel-ok"><b>Boshqaruv paneli</b><br /><span style="font-size:11px">ali@gmail.com</span></div>',
      qator: 2,
      sinf: 'yaxshi',
      izoh: "Foydalanuvchi topildi \\u2014 sahifa ko'rsatiladi. <code>panel.hidden = false</code>"
    },
    yoq: {
      ekran: '<span style="color:#9ca3af">\\u2192 index.html ga yo\\'naltirilmoqda</span>',
      qator: 4,
      sinf: 'yaxshi',
      izoh: "Foydalanuvchi yo'q \\u2014 login sahifasiga yo'naltiriladi. Panel <b>hech qachon ko'rinmadi</b>."
    },
    xato: {
      ekran: '<div class="maxfiy">Boshqaruv paneli<br /><span style="font-size:11px;font-weight:400">(kirmagan odam ham ko\\'ryapti!)</span></div>',
      qator: -1,
      sinf: 'yomon',
      izoh: "\\u274c <b>Himoyasiz sahifa.</b> HTML darhol chiziladi, <code>onAuthStateChanged</code> esa keyinroq ishga tushadi. Shu oraliqda maxfiy ma'lumot ko'rinib qoladi.<br />Yechim: panelni <code>hidden</code> bilan boshlang."
    }
  };

  var kodQatorlar = [
    "panel.hidden = true;            <span class='yon'>// 1. Avval YASHIR</span>",
    "",
    "onAuthStateChanged(auth, (user) => {",
    "  if (user) {",
    "    panel.hidden = false;        <span class='yon'>// 2. Kirgan \\u2192 ko'rsat</span>",
    "  } else {",
    "    location.replace('index.html');  <span class='yon'>// 3. Yo'q \\u2192 yo'naltir</span>",
    "  }",
    "});"
  ];

  // qator indekslari: 0 \\u2192 satr 0, 2 \\u2192 satr 4, 4 \\u2192 satr 6
  var xarita = { 0: 0, 2: 4, 4: 6 };

  var ekran = document.querySelector('#ekran');
  var kod = document.querySelector('#kod');
  var izoh = document.querySelector('#izoh');

  function chiz(h) {
    var d = holatlar[h];
    ekran.innerHTML = d.ekran;

    var belgilangan = xarita[d.qator];
    var html = '';
    for (var i = 0; i < kodQatorlar.length; i++) {
      html += (i === belgilangan)
        ? '<span class="faolQator">' + kodQatorlar[i] + '</span>\\n'
        : kodQatorlar[i] + '\\n';
    }
    kod.innerHTML = html;

    izoh.className = d.sinf;
    izoh.innerHTML = d.izoh;

    var t = document.querySelectorAll('.tanlov button');
    for (var j = 0; j < t.length; j++) {
      t[j].className = (t[j].dataset.h === h) ? 'faol' : '';
    }
  }

  var t = document.querySelectorAll('.tanlov button');
  for (var i = 0; i < t.length; i++) {
    t[i].addEventListener('click', function () { chiz(this.dataset.h); });
  }

  chiz('yuk');
</script>
\`\`\`

\`\`\`javascript
// js/auth.js
import { auth } from './firebase.js';
import { onAuthStateChanged, signOut } from '.../firebase-auth.js';

export function himoyalash(tayyorBolganda) {
  const panel = document.querySelector('#panel');
  panel.hidden = true;                    // avval yashir

  onAuthStateChanged(auth, (user) => {
    if (user) {
      panel.hidden = false;
      tayyorBolganda(user);
    } else {
      location.replace('index.html');
    }
  });
}
\`\`\`

> ⚠️ **\`location.href\` emas, \`location.replace\`.**
>
> \`href\` sahifani brauzer tarixiga qo'shadi. Foydalanuvchi **Orqaga** tugmasini bossa — himoyalangan sahifaga qaytadi, u yana yo'naltiradi, yana qaytadi... Orqaga tugmasi ishlamay qoladi.
>
> \`replace\` tarixda iz qoldirmaydi.

---

## 🔁 Cheksiz yo'naltirish tuzog'i

Login sahifasida teskari himoya bo'ladi: kirgan odam u yerda turmasin.

\`\`\`javascript
export function kirmaganlarUchun() {
  onAuthStateChanged(auth, (user) => {
    if (user) location.replace('dashboard.html');
  });
}
\`\`\`

Ikkalasi birga ishlaganda ehtiyot bo'ling:

\`\`\`text
dashboard.html  →  user yo'q  →  index.html
index.html      →  user bor   →  dashboard.html
dashboard.html  →  user yo'q  →  index.html
...
\`\`\`

Bu — **cheksiz aylanma**. Brauzer sahifani qayta-qayta yuklaydi va foydalanuvchi hech qayerga kirolmaydi.

Nima uchun bunday bo'lishi mumkin?

- Ikkala sahifada **boshqa** shartlar tekshirilgan
- Biri \`user\` ni, boshqasi Firestore profilini tekshiradi — profil esa yo'q
- Bitta sahifada \`replace\` ishlatilmagan

**Himoya:** o'zingizga yo'naltirmang.

\`\`\`javascript
function yonaltir(sahifa) {
  const joriy = location.pathname.split('/').pop() || 'index.html';
  if (joriy !== sahifa) location.replace(sahifa);
}
\`\`\`

---

## 📊 dashboard.js — ikkita xatoga e'tibor

\`\`\`javascript
// js/dashboard.js
import { himoyalash, chiqish } from './auth.js';
import { db } from './firebase.js';
import { collection, query, where, getCountFromServer }
  from '.../firebase-firestore.js';

himoyalash(async (user) => {
  document.querySelector('#email').textContent = user.email;

  // Xabarlar SONI
  const q = query(
    collection(db, 'messages'),
    where('uid', '==', user.uid)
  );

  const natija = await getCountFromServer(q);
  document.querySelector('#soni').textContent = natija.data().count;
});

document.querySelector('#chiqish').addEventListener('click', chiqish);
\`\`\`

**Birinchi tuzoq — \`where\` ni import qilishni unutish.**

\`\`\`text
ReferenceError: where is not defined
\`\`\`

Firestore funksiyalari alohida import qilinadi. Kodda ishlatgan **har bir** funksiya import ro'yxatida bo'lishi kerak: \`collection\`, \`query\`, \`where\`, \`orderBy\`, \`limit\`, \`onSnapshot\`, \`doc\`, \`getDoc\`, \`setDoc\`, \`addDoc\`, \`deleteDoc\`...

**Ikkinchi tuzoq — \`limit\` bilan sanash.**

\`\`\`javascript
// ❌ Har doim ko'pi bilan 5 chiqadi
const q = query(collection(db, 'messages'), where(...), limit(5));
onSnapshot(q, (snap) => {
  soni.textContent = snap.size;   // 100 ta xabar bo'lsa ham "5"
});
\`\`\`

\`snap.size\` — **kelgan hujjatlar soni**, jami emas. \`limit(5)\` qo'ysangiz, javob ham 5 tadan oshmaydi.

Sanash uchun \`getCountFromServer\` ishlating — u hujjatlarni yuklamaydi, faqat sonni oladi. Tez va arzon.

---

## 🧭 Umumiy menyu — takrorlanmasdan

Beshta sahifada bir xil menyu. Uni har HTML fayliga ko'chirib yozsangiz, bitta havolani o'zgartirish uchun **besh joyni** tuzatasiz.

Oddiy yechim — JavaScript bilan joylashtirish:

\`\`\`javascript
// js/nav.js
export function menyuniQoy(user) {
  const joriy = location.pathname.split('/').pop() || 'index.html';

  const havolalar = [
    { sahifa: 'dashboard.html', nom: 'Panel' },
    { sahifa: 'chat.html',      nom: 'Chat' },
    { sahifa: 'profile.html',   nom: 'Profil' },
  ];

  const nav = document.querySelector('#nav');

  havolalar.forEach(h => {
    const a = document.createElement('a');
    a.href = h.sahifa;
    a.textContent = h.nom;
    if (h.sahifa === joriy) a.className = 'faol';   // joriy sahifa
    nav.append(a);
  });

  const harf = document.createElement('span');
  harf.className = 'avatar';
  harf.textContent = (user.email[0] || '?').toUpperCase();
  nav.append(harf);
}
\`\`\`

Har HTML faylda faqat bitta qator:

\`\`\`html
<nav id="nav"></nav>
\`\`\`

> 💡 **Bu — "ma'lumot → render" naqshining yana bir ko'rinishi.** Menyu — ma'lumot (massiv), HTML — undan hosil bo'lgan natija. Bir joyda o'zgartirasiz, hamma joyda o'zgaradi.
>
> 4-Modulda React aynan shu ishni qiladi, faqat ancha qulayroq: siz \`<Nav />\` deb yozasiz, qolganini React bajaradi. Bugungi \`menyuniQoy\` — **komponent** tushunchasining qo'lda yozilgan varianti.

---

## ⚠️ Yo'l tuzoqlari

**Absolyut yo'l (\`/dashboard.html\`)** deploy qilingan saytda ishlaydi, lekin kompyuteringizda loyiha ildizidan ochsangiz \`public/\` ni topolmaydi.

**Nisbiy yo'l (\`dashboard.html\`)** ikkala holatda ham ishlaydi. Shuni ishlating.

**Mavjud bo'lmagan rasm.** \`<img src="/img/default-avatar.png">\` — bu faylni siz yaratmagansiz. Natijada singan rasm belgisi. 10-darsdagi harfli zaxirani ishlating.

---

## 🥉 Bronze Topshiriq

- \`js/firebase.js\` yarating, \`auth\` va \`db\` ni eksport qiling
- Kamida ikkita sahifada shuni import qiling
- Har sahifada sozlash **takrorlanmasin**

## 🥈 Silver Topshiriq

- \`js/auth.js\` da \`himoyalash()\` va \`kirmaganlarUchun()\`
- Himoyalangan sahifa **avval yashirin** bo'lsin (\`hidden\`)
- \`location.replace\` ishlatilsin — Orqaga tugmasi to'g'ri ishlasin
- Uchta sahifa: login, dashboard, chat

## 🥇 Gold Topshiriq

- \`js/nav.js\` — menyu massivdan hosil bo'lsin, joriy sahifa ajratilsin
- Profil sahifasi: ism o'zgartirish va rasm (10-dars)
- Xabarlar soni \`getCountFromServer\` bilan
- Cheksiz yo'naltirishdan himoya
- Hammasi deploy qilingan va telefonda sinalgan

---

## ✅ Dars Xulosa

- Sozlashni **bir marta** yozing, import qiling
- \`firebase-config.js\` **\`public/\` ichida** bo'lsin
- Himoyalangan sahifa **avval yashirin**, keyin ko'rsatiladi
- **\`location.replace\`** — Orqaga tugmasi buzilmasin
- Cheksiz aylanmadan himoyalaning
- Ishlatgan **har bir** Firestore funksiyasini import qiling
- Sanash uchun \`snap.size\` emas, **\`getCountFromServer\`**
- Menyuni massivdan hosil qiling — takrorlamang
- Nisbiy yo'llar ishonchliroq

> 🏆 **Keyingi dars:** Yakuniy Demo Day — Firebase Developer Badge!
`,
    teacher: `
## 🔴 Aniq ishlamaydigan kod: \`where\` import qilinmagan

Asl \`dashboard.js\`:

\`\`\`javascript
import { collection, query, orderBy, limit, onSnapshot } from '...';

const q = query(
  collection(db, 'messages'),
  where('uid', '==', user.uid),      // where import qilinmagan!
  limit(5)
);
\`\`\`

\`\`\`text
ReferenceError: where is not defined
\`\`\`

Ustiga \`orderBy\` import qilingan, lekin **ishlatilmagan** — ya'ni ro'yxat e'tiborsiz tuzilgan.

Bu xato bolalarda muntazam chiqadi, chunki Firestore'ning modulli SDK'sida har funksiya alohida import qilinadi. Darsda ochiq qoida berildi: **kodda ishlatgan har bir funksiya import ro'yxatida bo'lsin**.

---

## 🔴 Ikkinchi: "xabarlar soni" hech qachon to'g'ri chiqmaydi

\`\`\`javascript
const q = query(collection(db, 'messages'), where(...), limit(5));

onSnapshot(q, (snap) => {
  document.querySelector('#xabarlar-soni').textContent = snap.size;
});
\`\`\`

\`snap.size\` — **kelgan** hujjatlar soni. \`limit(5)\` bor, demak javob **hech qachon 5 dan oshmaydi**.

Foydalanuvchida 100 ta xabar bo'lsa ham panelda "5" turadi.

Bu — jimgina noto'g'ri ishlaydigan kod: xato bermaydi, natija esa yolg'on. Bunday xatolar eng xavflisi.

Darsda \`getCountFromServer\` ga almashtirildi — u hujjatlarni yuklamaydi, faqat sonni qaytaradi.

---

## 🔴 Uchinchi: himoyalangan sahifa bir lahzaga ko'rinadi

Asl \`himoyalash()\`:

\`\`\`javascript
export function himoyalash(callbackBilan) {
  onAuthStateChanged(auth, (user) => {
    if (user) callbackBilan(user);
    else window.location.href = '/index.html';
  });
}
\`\`\`

HTML **darhol** chiziladi, \`onAuthStateChanged\` esa Firebase sessiyani tiklagandan keyin ishga tushadi. Shu oraliqda — bir necha yuz millisekund — kirmagan odam **boshqaruv panelini ko'radi**.

Bu 3-darsda o'rgatilgan "uchta holat" muammosining aynan o'zi, lekin bu yerda qayta yuzaga chiqqan va yechim qo'llanilmagan.

Darsda \`panel.hidden = true\` bilan boshlash naqshi qo'shildi va interaktiv demo berildi — bola himoyasiz holatni **ko'radi**.

> Bu zaiflik emas (ma'lumot baribir Security Rules bilan himoyalangan), lekin **yomon tajriba** va professional ilovada bo'lmaydi.

---

## ⚠️ To'rtinchi: location.href va Orqaga tugmasi

\`window.location.href\` sahifani brauzer tarixiga qo'shadi.

Foydalanuvchi chiqib ketadi → login sahifasi. **Orqaga** bosadi → dashboard → yana yo'naltiriladi → login. Orqaga tugmasi butunlay ishlamay qoladi.

\`location.replace()\` tarixda iz qoldirmaydi. Darsda almashtirildi.

---

## ⚠️ Beshinchi: cheksiz yo'naltirish

\`himoyalash()\` va \`kirmaganlarUchun()\` bir-biriga qarshi ishlashi mumkin:

\`\`\`text
dashboard → user yo'q → index
index     → user bor  → dashboard
\`\`\`

Asl kodda bundan himoya yo'q. Amalda bu shu holatlarda chiqadi: ikkala sahifada boshqa shartlar tekshirilsa, yoki biri Firestore profilini talab qilsa (profil esa yaratilmagan).

Darsda \`yonaltir()\` yordamchisi qo'shildi — o'ziga yo'naltirmaslik tekshiruvi bilan.

---

## 🗒 Boshqa tuzatishlar

**\`firebase-config.js\` joylashuvi.** Asl fayl daraxtida u loyiha **ildizida**, \`index.html\` yonida. 7-darsda esa fayllar \`public/\` ga ko'chirilgan. Agar config \`public/\` dan tashqarida qolsa:

- Kompyuterda **ishlaydi**
- Deploy'dan keyin **ishlamaydi** — fayl internetga chiqmagan
- Konsolda: \`Failed to fetch dynamically imported module\`

Bu — topish juda qiyin xato, chunki kodda hech qanday xatolik yo'q va mahalliy sinovda hammasi joyida. Darsda fayl daraxti 7-darsga moslashtirildi.

**Absolyut yo'llar** (\`/dashboard.html\`). Deploy qilingan saytda ishlaydi, mahalliy sinovda \`public/\` ni topolmaydi. Nisbiy yo'llar tavsiya qilindi.

**\`/img/default-avatar.png\`** — bunday fayl yaratilmagan, singan rasm chiqadi. 10-darsdagi harfli zaxira ishlatilsin. (Bu 10-darsdagi placeholder muammosining takrori.)

**\`.gitignore\` izohi** — 7-darsda tuzatilgan, bu yerda ham eski holda qolgan edi.

**SDK versiyasi** qattiq yozilgan.

---

## 💡 O'qituvchi uchun

- **Bu dars — React'ga ko'prik.** Menyuni har sahifada takrorlash muammosi bugun \`menyuniQoy()\` bilan yechiladi. 4-Modulda bola \`<Nav />\` deb yozadi va "ha, men buni qo'lda qilgandim" deydi. **Bu bog'lanishni ochiq ayting** — React sehrli emas, ayni shu muammoni yechadi.
- **Himoya demosini ko'rsating.** "Himoyasiz" holatini ataylab yozing va sahifani sekin internetda oching (DevTools → Network → Slow 3G). Panel bir soniya ko'rinadi. Bu ko'rilmasa, \`hidden\` nima uchun kerakligi tushunarsiz qoladi.
- **Orqaga tugmasini sinatib ko'ring.** Chiqing, Orqaga bosing. \`href\` bilan qamalib qolasiz. \`replace\` bilan normal ishlaydi. 10 soniyalik namoyish, umrbod esda qoladi.
- **Deploy'dan keyin albatta sinang.** Bu darsdagi eng ko'p xatolar (config joylashuvi, absolyut yo'llar) faqat deploy'dan keyin chiqadi. "Kompyuterimda ishlayapti" — bu yetarli emas.
- **Import ro'yxatini tekshirishni odat qildiring.** \`ReferenceError: X is not defined\` ko'rsa, birinchi qaraydigan joy — import ro'yxati.

## ⚠️ Ko'p uchraydigan xatolar

- **\`ReferenceError: where is not defined\`** — import qilinmagan.
- **\`Failed to fetch dynamically imported module\`** — fayl \`public/\` dan tashqarida, yoki yo'l noto'g'ri, yoki \`.js\` kengaytmasi yozilmagan (ES modullarida u **majburiy**).
- **\`Cannot use import statement outside a module\`** — \`<script>\` da \`type="module"\` yo'q.
- **CORS xatosi** — sahifa \`file://\` orqali ochilgan. ES modullari uchun server kerak: Live Server yoki \`firebase serve\`.
- **Panel bir lahzaga ko'rinadi** — \`hidden\` yo'q.
- **Orqaga tugmasi ishlamaydi** — \`location.href\`.
- **Cheksiz qayta yuklanish** — ikkita himoya bir-biriga qarshi.
- **Xabarlar soni noto'g'ri** — \`limit\` bilan \`snap.size\`.

## 📊 Daraja belgilash

- **Bronze** — sozlash bitta faylda, kamida ikki sahifada import qilingan
- **Silver** — himoya ishlaydi, panel avval yashirin, \`location.replace\`, uch sahifa
- **Gold** — menyu massivdan, \`getCountFromServer\`, aylanmadan himoya, deploy qilingan

> **Tekshirish usuli:** bolaning deploy qilingan saytida \`dashboard.html\` ni **kirmasdan** to'g'ridan-to'g'ri oching (maxfiy oynada).
>
> Panel bir lahzaga ko'rinsa — \`hidden\` yo'q, Silver berilmaydi.
> Darhol login sahifasi chiqsa — to'g'ri.
>
> Keyin kiring, chiqing va **Orqaga** bosing. Qamalib qolsangiz — \`location.href\` ishlatilgan.
`,
  },

  // ═══════════════════════════════════════════════════════════
  'junior.m3.l10': {
    goal: "Rasm yuklash: brauzerda kichiklashtirish, Storage qoidalari va bepul rejadagi muqobil yo'l.",
    student: `
## 🛑 Avval muhim ogohlantirish

**Firebase Storage bepul (Spark) rejada ishlamaydi.**

2024-yil sentabrida e'lon qilingan o'zgarishga ko'ra, Cloud Storage uchun loyiha **Blaze** (to'lov kartasi bog'langan) rejasida bo'lishi shart. Spark rejasida so'rovlar \`402\` yoki \`403\` xatosi bilan qaytadi.

> Blaze rejasida ham bepul chegara bor — kichik o'quv loyihasi uchun pul ketmaydi. Lekin **karta bog'lash** talab qilinadi.

Shuning uchun bu darsda **ikkita yo'l** ko'rsatiladi:

| Yo'l | Kerak | Kimga |
| --- | --- | --- |
| **A. Firestore'ga saqlash** | Hech narsa | Hammaga — bugun ishlaydi |
| **B. Firebase Storage** | Blaze reja | Kartasi bo'lganlarga |

Ikkalasida ham **eng muhim qism bir xil**: rasmni yuborishdan oldin **kichiklashtirish**. Undan boshlaymiz.

---

## 📉 Telefon rasmi juda katta

Telefondagi bitta surat — odatda **3–8 MB**. Uni o'zgartirmasdan yuborsangiz:

- Sekin internetda yuklanmaydi
- Firestore hujjat chegarasidan (**1 MiB**) oshib ketadi
- Storage qoidasidagi 2 MB chegarasiga sig'maydi
- Avatar uchun 4000×3000 piksel **keraksiz** — ekranda 100×100 ko'rinadi

Yechim: brauzerda \`canvas\` bilan kichiklashtirish. Sinab ko'ring — **haqiqiy rasm tanlang**:

\`\`\`demo h=520 "Rasmni brauzerda kichiklashtirish"
<style>
  * { box-sizing: border-box; }
  body { font-family: sans-serif; font-size: 13px; margin: 0; padding: 14px; }

  .yuklash {
    border: 2px dashed #d1d5db; border-radius: 10px; padding: 18px;
    text-align: center; cursor: pointer; background: #fafafa;
  }
  .yuklash:hover { border-color: #6366f1; background: #f5f3ff; }
  .yuklash p { margin: 0; color: #6b7280; font-size: 12px; }
  input[type=file] { display: none; }

  .sozlama { display: flex; gap: 10px; align-items: center; margin: 12px 0; font-size: 11.5px; }
  .sozlama label { font-family: monospace; color: #6b7280; }
  input[type=range] { flex: 1; }
  .qiymat { font-family: monospace; color: #4338ca; width: 58px; }

  .panel { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .quti { border: 2px solid #e5e7eb; border-radius: 10px; padding: 10px; text-align: center; }
  .quti h4 { margin: 0 0 8px; font-size: 11px; font-family: monospace; color: #6b7280; }
  .quti img { max-width: 100%; max-height: 130px; border-radius: 7px; }
  .olcham { margin-top: 7px; font-family: monospace; font-size: 11px; }
  .katta { color: #b91c1c; }
  .kichik { color: #15803d; font-weight: 700; }

  #xulosa {
    margin-top: 12px; border-radius: 8px; padding: 11px;
    font-size: 12px; line-height: 1.8; background: #f9fafb;
    border: 2px solid #e5e7eb; color: #6b7280; min-height: 62px;
  }
  #xulosa.tola { background: #f0fdf4; border-color: #86efac; color: #15803d; }
  #xulosa code { background: rgba(0,0,0,.07); padding: 1px 5px; border-radius: 3px; font-family: monospace; font-size: 11px; }
</style>

<label class="yuklash" for="fayl">
  <p>📁 Bosing va telefoningizdagi rasmni tanlang</p>
</label>
<input type="file" id="fayl" accept="image/*" />

<div class="sozlama">
  <label>maksKeng:</label>
  <input type="range" id="kenglik" min="100" max="1200" step="50" value="400" />
  <span class="qiymat" id="kQiymat">400px</span>
</div>
<div class="sozlama">
  <label>sifat:&nbsp;&nbsp;&nbsp;&nbsp;</label>
  <input type="range" id="sifat" min="30" max="100" step="5" value="80" />
  <span class="qiymat" id="sQiymat">0.80</span>
</div>

<div class="panel">
  <div class="quti">
    <h4>Asl fayl</h4>
    <div id="aslRasm"></div>
    <div class="olcham katta" id="aslOlcham">—</div>
  </div>
  <div class="quti">
    <h4>Kichiklashtirilgan</h4>
    <div id="yangiRasm"></div>
    <div class="olcham kichik" id="yangiOlcham">—</div>
  </div>
</div>

<div id="xulosa">Rasm tanlang — farqni ko'rasiz.</div>

<script>
  var faylEl = document.querySelector('#fayl');
  var kenglik = document.querySelector('#kenglik');
  var sifat = document.querySelector('#sifat');
  var kQiymat = document.querySelector('#kQiymat');
  var sQiymat = document.querySelector('#sQiymat');
  var aslRasm = document.querySelector('#aslRasm');
  var yangiRasm = document.querySelector('#yangiRasm');
  var aslOlcham = document.querySelector('#aslOlcham');
  var yangiOlcham = document.querySelector('#yangiOlcham');
  var xulosa = document.querySelector('#xulosa');

  var joriyFayl = null;

  function olchamMatn(baytlar) {
    if (baytlar > 1024 * 1024) return (baytlar / 1024 / 1024).toFixed(2) + ' MB';
    return Math.round(baytlar / 1024) + ' KB';
  }

  // Asosiy funksiya: rasmni canvas orqali kichiklashtirish
  function kichiklashtir(fayl, maksKeng, sifatQiymat) {
    return new Promise(function (bajar, xato) {
      var oquvchi = new FileReader();

      oquvchi.onload = function (e) {
        var rasm = new Image();

        rasm.onload = function () {
          var nisbat = Math.min(1, maksKeng / rasm.width);
          var kengYangi = Math.round(rasm.width * nisbat);
          var balYangi = Math.round(rasm.height * nisbat);

          var canvas = document.createElement('canvas');
          canvas.width = kengYangi;
          canvas.height = balYangi;

          var ctx = canvas.getContext('2d');
          ctx.drawImage(rasm, 0, 0, kengYangi, balYangi);

          bajar({
            dataUrl: canvas.toDataURL('image/jpeg', sifatQiymat),
            keng: kengYangi,
            bal: balYangi,
            aslKeng: rasm.width,
            aslBal: rasm.height
          });
        };

        rasm.onerror = function () { xato(new Error('Rasm ochilmadi')); };
        rasm.src = e.target.result;
      };

      oquvchi.onerror = function () { xato(new Error('Fayl o\\'qilmadi')); };
      oquvchi.readAsDataURL(fayl);
    });
  }

  async function ishla() {
    if (!joriyFayl) return;

    xulosa.className = '';
    xulosa.textContent = 'Ishlanmoqda...';

    try {
      var n = await kichiklashtir(joriyFayl, Number(kenglik.value), Number(sifat.value) / 100);

      aslRasm.innerHTML = '';
      var a = document.createElement('img');
      a.src = URL.createObjectURL(joriyFayl);
      aslRasm.appendChild(a);

      yangiRasm.innerHTML = '';
      var y = document.createElement('img');
      y.src = n.dataUrl;
      yangiRasm.appendChild(y);

      // dataUrl uzunligidan taxminiy hajm (base64 \\u2248 4/3)
      var yangiBayt = Math.round((n.dataUrl.length - n.dataUrl.indexOf(',') - 1) * 0.75);

      aslOlcham.textContent = olchamMatn(joriyFayl.size) + '  \\u00b7  ' + n.aslKeng + '\\u00d7' + n.aslBal;
      yangiOlcham.textContent = olchamMatn(yangiBayt) + '  \\u00b7  ' + n.keng + '\\u00d7' + n.bal;

      var marta = (joriyFayl.size / yangiBayt).toFixed(1);
      var sigadi = yangiBayt < 1024 * 1024 * 0.7;

      xulosa.className = sigadi ? 'tola' : '';
      xulosa.innerHTML =
        '<b>' + marta + ' marta</b> kichraydi.<br />' +
        (sigadi
          ? "\\u2705 Firestore hujjatiga sig'adi (chegara \\u2014 <code>1 MiB</code>) va Storage'ning 2 MB qoidasidan ham o'tadi."
          : "\\u26a0\\ufe0f Hali ham katta. <code>maksKeng</code> yoki <code>sifat</code> ni kamaytiring.");
    } catch (e) {
      xulosa.className = '';
      xulosa.textContent = 'Xato: ' + e.message;
    }
  }

  faylEl.addEventListener('change', function (e) {
    joriyFayl = e.target.files[0];
    if (joriyFayl) ishla();
  });

  kenglik.addEventListener('input', function () {
    kQiymat.textContent = this.value + 'px';
    ishla();
  });

  sifat.addEventListener('input', function () {
    sQiymat.textContent = (Number(this.value) / 100).toFixed(2);
    ishla();
  });
</script>
\`\`\`

Slayderlarni suring — hajm qanday o'zgarishini ko'rasiz. **400px va 0.8 sifat** avatar uchun deyarli har doim yetarli.

> 💡 Bu — sof brauzer ishi: \`FileReader\` faylni o'qiydi, \`canvas\` qayta chizadi, \`toDataURL\` natijani matnga aylantiradi. Firebase ham, internet ham kerak emas.

---

## 🅰️ Yo'l A — Firestore'ga saqlash (bepul)

\`toDataURL\` bizga **matn** qaytaradi (\`data:image/jpeg;base64,...\`). Matnni esa Firestore'ga oddiy maydon sifatida yozish mumkin.

\`\`\`javascript
document.querySelector('#fayl').addEventListener('change', async (e) => {
  const fayl = e.target.files[0];
  if (!fayl) return;

  const user = auth.currentUser;
  if (!user) return;

  // 1. Tur tekshiruvi
  if (!fayl.type.startsWith('image/')) {
    xatoniKorsat("Faqat rasm tanlang");
    return;
  }

  // 2. Kichiklashtirish
  const dataUrl = await kichiklashtir(fayl, 400, 0.8);

  // 3. Chegara tekshiruvi — Firestore hujjati 1 MiB
  if (dataUrl.length > 700 * 1024) {
    xatoniKorsat("Rasm juda katta. Boshqasini tanlang.");
    return;
  }

  // 4. Saqlash
  await setDoc(doc(db, 'users', user.uid), {
    avatar: dataUrl,
  }, { merge: true });

  document.querySelector('#avatar').src = dataUrl;
});
\`\`\`

> ⚠️ **\`updateDoc\` emas, \`setDoc\` + \`merge\`.** \`updateDoc\` hujjat **mavjud bo'lmasa** xato beradi:
>
> \`\`\`text
> FirebaseError: No document to update
> \`\`\`
>
> Email/parol bilan ro'yxatdan o'tgan foydalanuvchida \`users/{uid}\` hujjati bo'lmasligi mumkin — 9-darsda uni faqat Google bilan kirgan foydalanuvchi uchun yaratgan edik.
>
> \`setDoc(..., { merge: true })\` ikkala holatda ham ishlaydi: hujjat bo'lsa — qo'shadi, bo'lmasa — yaratadi.

**Bu usulning chegarasi:** har rasm hujjat ichida saqlanadi, ya'ni foydalanuvchilar ro'yxatini o'qiganda hamma rasm ham yuklanadi. Avatar uchun yaxshi, **galereya uchun yaramaydi**.

---

## 🅱️ Yo'l B — Firebase Storage (Blaze reja)

Storage — fayllar uchun maxsus xizmat. Firestore ma'lumot uchun, Storage **fayl** uchun.

**Console → Storage → Get started**, keyin qoidalar:

\`\`\`javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {

    match /users/{userId}/{allPaths=**} {
      allow read: if request.auth != null;

      allow write: if request.auth != null
                   && request.auth.uid == userId
                   && request.resource.size < 2 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }

  }
}
\`\`\`

Uchta himoya: **faqat egasi**, **2 MB dan kichik**, **faqat rasm**.

\`\`\`javascript
import { getStorage, ref, uploadBytesResumable, getDownloadURL }
  from '.../firebase-storage.js';

const storage = getStorage(app);

document.querySelector('#fayl').addEventListener('change', async (e) => {
  const fayl = e.target.files[0];
  if (!fayl) return;

  const user = auth.currentUser;
  if (!user) return;

  // Kichiklashtirish — Blob ko'rinishida
  const blob = await kichiklashtirBlob(fayl, 400, 0.8);

  // Yo'l: kengaytmasiz, doimiy nom
  const storageRef = ref(storage, 'users/' + user.uid + '/avatar');

  const vazifa = uploadBytesResumable(storageRef, blob);

  vazifa.on('state_changed',
    (snap) => {
      const foiz = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
      document.querySelector('#bar').style.width = foiz + '%';
    },
    (error) => {
      xatoniKorsat(error);
    },
    async () => {
      const url = await getDownloadURL(vazifa.snapshot.ref);

      document.querySelector('#avatar').src = url;

      await setDoc(doc(db, 'users', user.uid), {
        photoURL: url,
      }, { merge: true });
    }
  );
});
\`\`\`

> 💡 **Kengaytmasiz doimiy nom** (\`avatar\`, \`avatar.jpg\` emas) ataylab tanlandi.
>
> Kengaytma qo'ysangiz, foydalanuvchi avval \`.jpg\`, keyin \`.png\` yuklasa — ikkita fayl qoladi va eskisi Storage'da **abadiy yotadi**. Doimiy nom bilan har yangi yuklash eskisining **ustiga yoziladi** va o'chirish ham kerak emas.

---

## 🔗 Yuklab olish havolasi haqida

\`getDownloadURL\` qaytaradigan manzilda **token** bo'ladi:

\`\`\`text
https://firebasestorage.googleapis.com/.../avatar?alt=media&token=a1b2c3...
\`\`\`

Muhim narsa: **bu havolani olgan har kim rasmni ko'ra oladi** — tizimga kirmasa ham, Storage qoidalaridan qat'i nazar.

Qoidalar SDK orqali murojaatni himoya qiladi, lekin token bilan havola ochiq ishlaydi.

> ⚠️ 9-darsdagi maxfiylik suhbatining davomi: bola o'z suratini yuklaydi, havola esa cheksiz muddatga ochiq bo'ladi. Agar havola biror joyga tushsa — orqaga qaytarib bo'lmaydi.
>
> Console'da **Files → ⋮ → Revoke access token** bilan havolani bekor qilish mumkin. Buni bolalarga ko'rsating.

---

## ⚠️ 6-darsdagi qoida bilan to'qnashuv

6-darsning Gold topshirig'ida shunday qoida taklif qilingan edi:

\`\`\`javascript
allow update: if egasi(userId)
              && request.resource.data.diff(resource.data)
                 .affectedKeys().hasOnly(['ism', 'bio']);
\`\`\`

Uni yozgan bo'lsangiz, bugungi \`avatar\` yoki \`photoURL\` yozish **rad etiladi** — bu maydonlar ro'yxatda yo'q.

Yechim — ro'yxatga qo'shish:

\`\`\`javascript
.hasOnly(['ism', 'bio', 'avatar', 'photoURL'])
\`\`\`

> 💡 Bu — oddiy holat: ilova o'sgani sari qoidalar ham yangilanadi. **Kod o'zgarsa, qoidani ham tekshiring.** Aks holda \`permission-denied\` chiqadi va sababi kodda emas.

---

## 🖼 Zaxira avatar

Asl darslikda boshlang'ich rasm sifatida tashqi xizmat ishlatilgan. Tashqi xizmatga tayanmang — ular o'chib ketadi va sahifangizda **singan rasm** qoladi.

Eng ishonchlisi — hech qanday rasm ishlatmaslik:

\`\`\`html
<div id="avatar-orin">A</div>
\`\`\`

\`\`\`css
#avatar-orin {
  width: 100px; height: 100px; border-radius: 50%;
  background: #6366f1; color: white;
  display: flex; align-items: center; justify-content: center;
  font-size: 40px; font-weight: 700;
}
\`\`\`

\`\`\`javascript
const harf = (user.displayName || user.email)[0].toUpperCase();
document.querySelector('#avatar-orin').textContent = harf;
\`\`\`

Bu — internet, tashqi xizmat va yuklanish talab qilmaydi. Ko'p yirik ilovalar aynan shunday qiladi.

---

## 🥉 Bronze Topshiriq

- \`<input type="file" accept="image/*">\` qo'shing
- Tanlangan faylning **nomi, hajmi va turini** ekranda ko'rsating
- 2 MB dan katta bo'lsa ogohlantirish chiqaring

## 🥈 Silver Topshiriq

- \`kichiklashtir()\` funksiyasini yozing (canvas bilan)
- Natijani **Firestore'ga** \`setDoc\` + \`merge\` bilan saqlang
- Sahifa qayta ochilganda avatar yuklansin
- Rasm yo'q bo'lsa — harfli zaxira ko'rsatilsin

## 🥇 Gold Topshiriq

- Yuklash paytida **progress** yoki "Yuklanmoqda..." ko'rinsin
- Tur va hajm tekshiruvi, tushunarli xato xabarlari bilan
- Blaze rejasi bo'lsa: Storage'ga yuklash, doimiy nom bilan
- Qoidalar yangilangan (\`hasOnly\` ro'yxatiga qo'shilgan)
- **Telefondan** rasm yuklab sinang — asosiy sinov shu

---

## ✅ Dars Xulosa

- **Storage bepul rejada ishlamaydi** — Blaze kerak
- Bepul yo'l: canvas bilan kichiklashtirib **Firestore'ga** saqlash
- Firestore hujjati chegarasi — **1 MiB**
- Telefon rasmi 3–8 MB; **400px / 0.8** avatar uchun yetarli
- **\`updateDoc\` emas, \`setDoc\` + \`merge: true\`**
- Storage'da **doimiy nom** — eski fayl qolmaydi
- Yuklab olish havolasi **ochiq** — tokenni bekor qilish mumkin
- Kod o'zgarsa — **qoidani ham tekshiring**
- Tashqi rasm xizmatlariga tayanmang

> 🚀 **Keyingi dars:** Ko'p sahifali ilova — to'liq auth tizimi.
`,
    teacher: `
## 🛑 Bu dars bugun yozilganidek o'tmaydi

**Firebase Storage bepul (Spark) rejada mavjud emas.**

2024-yil sentabrida e'lon qilingan o'zgarishga ko'ra, Cloud Storage uchun loyiha **Blaze** rejasida bo'lishi shart. Firebase hujjatlaridan: *"If your Firebase project is on the Spark pricing plan, you won't have access to any Cloud Storage buckets (including default buckets), and your API calls to buckets will return 402 or 403 errors."*

Ya'ni o'quvchilaringiz **Get started** tugmasini bosa olmaydi — karta bog'lash so'raladi.

Bu — butun darsni to'xtatadigan to'siq va asl sahifada umuman yo'q.

**Qabul qilingan yechim — ikki yo'l:**

| Yo'l | Kerak | Kimga |
| --- | --- | --- |
| **A. Firestore'ga base64** | Hech narsa | Butun sinf |
| **B. Storage** | Blaze reja | Sizda yoki kartasi borlarda |

Yo'l A o'quv maqsadi uchun to'liq yetarli va qo'shimcha foyda beradi: bola **fayl bilan ishlash** (\`FileReader\`, \`canvas\`, \`toDataURL\`), **hajm chegarasi** va **optimallashtirish** tushunchalarini o'rganadi. Bular Storage'dan ham muhimroq ko'nikmalar.

**Tavsiya:** Yo'l B ni **o'zingizning** loyihangizda ko'rsating (bir marta Blaze yoqib, budjet ogohlantirishi qo'yib). Bolalar Yo'l A bilan ishlasin.

---

## 🔴 Kod umuman ishlamaydi: apostrof

Asl koddagi qator:

\`\`\`javascript
const yo'l = \`users/\${user.uid}/avatar.\${fayl.name.split('.').pop()}\`;
const storageRef = ref(storage, yo'l);
\`\`\`

\`yo'l\` — **yaroqsiz JavaScript**. Apostrof o'zgaruvchi nomida bo'lolmaydi; JavaScript uchun u satr boshlanishi.

\`\`\`text
SyntaxError: Unexpected string
\`\`\`

Bu **butun faylni** to'xtatadi — bitta qator emas, **hech narsa ishlamaydi**.

Bola ko'chirib qo'yadi, sahifa oq qoladi va sababi ko'rinmaydi.

> ⚠️ Bu — kursda **oltinchi marta** uchrayotgan bir xil xato. 1-Modulda o'zbekcha apostroflar bir necha joyda identifikatorlarda ishlatilgan edi.
>
> **Tizimli yechim:** kod yozishda o'zbekcha so'zlarni apostrofsiz shaklda ishlating — \`yol\`, \`toliq\`, \`ochirish\`. Matnda apostrof bo'lsin, **kodda yo'q**.

---

## 🔴 Ikkinchi: updateDoc mavjud bo'lmagan hujjatda

Asl kod:

\`\`\`javascript
await updateDoc(doc(db, 'users', user.uid), { photoURL: downloadURL });
\`\`\`

\`updateDoc\` hujjat **mavjud bo'lmasa** xato beradi:

\`\`\`text
FirebaseError: No document to update
\`\`\`

9-darsda \`users/{uid}\` hujjati **faqat Google bilan kirgan** foydalanuvchi uchun yaratilgan. Email/parol bilan ro'yxatdan o'tgan bolada bu hujjat **yo'q**.

Ya'ni: rasm Storage'ga yuklanadi, progress 100% ga yetadi, keyin oxirgi qadamda xato. Bola "yuklandi-ku, nega ishlamayapti?" deydi.

Darsda \`setDoc(..., { merge: true })\` ga almashtirildi — ikkala holatda ham ishlaydi.

---

## ⚠️ Uchinchi: 6-dars qoidasi bilan to'qnashuv

6-darsning Gold topshirig'ida:

\`\`\`javascript
.affectedKeys().hasOnly(['ism', 'bio'])
\`\`\`

Buni bajargan bola bugun \`photoURL\` yozolmaydi — \`permission-denied\`.

Xatoning yomon tomoni: sabab **kodda emas**, bola kodini soatlab tekshiradi.

Darsda ochiq aytildi va umumiy qoida berildi: **kod o'zgarsa, Security Rules'ni ham tekshiring.**

---

## 🗒 Boshqa tuzatishlar

**Kengaytmali fayl nomi.** Asl kodda \`avatar.\${kengaytma}\`. Foydalanuvchi avval \`.jpg\`, keyin \`.png\` yuklasa — Storage'da **ikkita** fayl qoladi, eskisi abadiy yotadi va hajm sarflanadi. Gold'dagi "eski rasmni o'chirish" ham shu sababdan murakkablashadi.

Doimiy nom (\`avatar\`, kengaytmasiz) bilan har yuklash ustiga yoziladi — o'chirish kerak emas.

**Tashqi placeholder xizmati.** Asl kodda boshlang'ich rasm sifatida tashqi xizmat manzili yozilgan. Bunday xizmatlar o'chib ketadi va sahifada singan rasm qoladi. Harfli zaxira (CSS + birinchi harf) berildi — internet ham, tashqi xizmat ham kerak emas.

**Rasm hajmi.** Asl kod faqat 2 MB dan katta bo'lsa \`alert\` beradi va **to'xtaydi**. Telefon surati deyarli har doim 3–8 MB — ya'ni bola telefondan hech narsa yuklay olmaydi va yechim berilmagan. Kichiklashtirish qo'shildi.

**\`alert\`** o'rniga ekrandagi xabar (2-darsdan beri davom etayotgan naqsh).

**Yuklab olish havolasi.** \`getDownloadURL\` tokenli ochiq manzil qaytaradi — havolani olgan har kim, tizimga kirmasdan ko'ra oladi. Bu 9-darsdagi maxfiylik suhbatining davomi va asl sahifada yo'q.

**SDK versiyasi** qattiq yozilgan.

---

## 💡 O'qituvchi uchun

- **Kichiklashtirish demosidan boshlang.** Bola o'z telefonidagi suratni tanlaydi va 5 MB → 40 KB bo'lishini ko'radi. Bu darsning eng ta'sirli lahzasi va hech qanday Firebase talab qilmaydi.
- **Slayderlarni o'ynatishga vaqt bering.** \`maksKeng\` ni 100 ga tushirsa rasm buziladi, 1200 da hajm oshadi. "Nima uchun 400?" savoliga javob shu tajribadan keladi.
- **Blaze masalasini ochiq ayting.** Yashirmang — bolalar baribir "Get started" bosib, karta so'ralganini ko'radi. Oldindan tushuntirsangiz, chalkashlik bo'lmaydi.
- **Havola ochiqligini ko'rsating.** Rasm yuklang, \`getDownloadURL\` natijasini maxfiy oynada oching — kirmasdan ochiladi. Keyin Console'dan tokenni bekor qiling va yana oching — endi ochilmaydi. Bu bir marta ko'rilsa, esda qoladi.
- **Yo'l A ning chegarasini ham ayting.** Avatar uchun yaxshi, galereya uchun yaramaydi — chunki har rasm hujjat ichida va ro'yxat o'qilganda hammasi yuklanadi. Bu "to'g'ri vosita tanlash" haqidagi suhbat.

## ⚠️ Ko'p uchraydigan xatolar

- **\`SyntaxError\`** — apostrofli o'zgaruvchi nomi. Sahifa butunlay ishlamaydi.
- **\`No document to update\`** — \`updateDoc\` mavjud bo'lmagan hujjatda.
- **\`storage/unauthorized\`** — qoida yozilmagan, yoki \`uid\` yo'lga mos emas, yoki fayl 2 MB dan katta.
- **\`402\` / \`403\`** — Spark rejasi. Blaze kerak.
- **\`permission-denied\` Firestore'da** — 6-darsdagi \`hasOnly\` ro'yxati.
- **\`canvas\` bo'sh chiqadi** — \`img.onload\` kutilmasdan \`drawImage\` chaqirilgan. Rasm yuklanishini kutish shart.
- **Progress 100% lekin avatar o'zgarmadi** — \`getDownloadURL\` \`await\` qilinmagan, yoki \`updateDoc\` xatosi yutilgan.
- **Telefonda ishlamaydi** — \`accept="image/*"\` yo'q, yoki fayl juda katta.

## 📊 Daraja belgilash

- **Bronze** — fayl tanlanadi, nomi/hajmi/turi ko'rinadi, katta faylga ogohlantirish
- **Silver** — kichiklashtirish ishlaydi, Firestore'ga saqlanadi, qayta ochilganda yuklanadi, harfli zaxira bor
- **Gold** — progress, tekshiruvlar, qoidalar yangilangan, telefondan sinalgan

> **Tekshirish usuli:** bolaning saytiga **o'z telefoningizdagi katta surat** bilan avatar yuklang (3+ MB).
>
> Yuklansa va tez ochilsa — kichiklashtirish ishlayapti.
> "Fayl juda katta" desa — Bronze darajasi, kichiklashtirish yo'q.
> Hech narsa bo'lmasa — konsolni oching, \`SyntaxError\` bo'lishi mumkin.
>
> Ikkinchi tekshiruv: sahifani yangilang. Avatar qoldimi? Qolmasa — Firestore'ga saqlanmagan, faqat ekranda ko'rsatilgan.
`,
  },

  // ═══════════════════════════════════════════════════════════
  'junior.m3.l9': {
    goal: "GoogleAuthProvider bilan bir bosishda kirish, provayder to'qnashuvi va maxfiylik masalasi.",
    student: `
## 📸 Nima uchun?

2-darsda email/parol bilan ro'yxatdan o'tishni qildik. Muammosi bor:

- Foydalanuvchi yangi parol o'ylab topishi kerak
- Uni unutadi
- Siz "parolni tiklash" tizimini ham yozishingiz kerak

Google bilan kirish bularning hammasini olib tashlaydi: **bir bosish** va tayyor. Ustiga ism va profil rasmi ham keladi.

---

## 🔄 Jarayon qanday ketadi

\`\`\`demo h=450 "Google bilan kirish bosqichlari"
<style>
  * { box-sizing: border-box; }
  body { font-family: sans-serif; font-size: 13px; margin: 0; padding: 14px; }

  .sahna {
    border: 2px solid #e5e7eb; border-radius: 10px;
    padding: 14px; min-height: 190px; background: #fafafa;
    display: flex; align-items: center; justify-content: center;
  }

  .gbtn {
    display: flex; align-items: center; gap: 10px;
    padding: 11px 20px; border: 2px solid #e5e7eb; border-radius: 10px;
    background: white; font-size: 14px; font-weight: 500; cursor: default;
  }

  .popup {
    background: white; border: 1px solid #d1d5db; border-radius: 10px;
    box-shadow: 0 8px 24px rgba(0,0,0,.14); padding: 14px; width: 230px;
  }
  .popup h5 { margin: 0 0 10px; font-size: 12px; color: #374151; }
  .akk {
    display: flex; align-items: center; gap: 9px; padding: 7px;
    border-radius: 7px; font-size: 12px;
  }
  .akk:hover { background: #f3f4f6; }
  .rasm {
    width: 26px; height: 26px; border-radius: 50%;
    background: #6366f1; color: white; display: flex;
    align-items: center; justify-content: center; font-size: 12px; font-weight: 700;
  }

  .obj {
    background: #1e293b; color: #e2e8f0; border-radius: 8px;
    padding: 11px; font-family: monospace; font-size: 11px;
    line-height: 1.8; white-space: pre-wrap; width: 100%;
  }
  .obj .k { color: #93c5fd; }
  .obj .v { color: #86efac; }
  .obj .n { color: #f87171; }

  .qadam { display: flex; gap: 5px; margin: 12px 0; flex-wrap: wrap; }
  .qadam button {
    padding: 6px 10px; border: 1px solid #d1d5db; background: white;
    border-radius: 6px; font-size: 10.5px; cursor: pointer; font-family: monospace;
  }
  .qadam button.faol { background: #6366f1; color: white; border-color: #6366f1; }

  #izoh {
    background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px;
    padding: 11px; font-size: 12px; color: #1e40af; line-height: 1.8; min-height: 74px;
  }
  #izoh code { background: #dbeafe; padding: 1px 5px; border-radius: 3px; font-family: monospace; font-size: 11px; }
</style>

<div class="sahna" id="sahna"></div>
<div class="qadam" id="qadam"></div>
<div id="izoh"></div>

<script>
  var bosqichlar = [
    {
      nom: '1. Tugma',
      sahna: '<div class="gbtn"><b style="color:#4285f4">G</b> Google bilan kirish</div>',
      izoh: "Foydalanuvchi tugmani bosadi. Kodda: <code>signInWithPopup(auth, provider)</code>"
    },
    {
      nom: '2. Popup',
      sahna: '<div class="popup"><h5>Akkauntni tanlang</h5>' +
             '<div class="akk"><span class="rasm">A</span><div>Ali Valiyev<br /><span style="color:#9ca3af;font-size:11px">ali@gmail.com</span></div></div>' +
             '<div class="akk"><span class="rasm" style="background:#16a34a">M</span><div>Maktab<br /><span style="color:#9ca3af;font-size:11px">ali.v@maktab.uz</span></div></div>' +
             '</div>',
      izoh: "Google oynasi ochiladi. <b>Bu sizning sahifangiz emas</b> \\u2014 u Google'niki. Parol Google'da kiritiladi, sizning saytingizga hech qachon tushmaydi. Shuning uchun bu usul xavfsizroq."
    },
    {
      nom: '3. Tekshiruv',
      sahna: '<div class="obj">Google \\u2192 token\nFirebase \\u2192 tokenni tekshiradi\nFirebase \\u2192 hisob yaratadi yoki topadi</div>',
      izoh: "Firebase Google'dan kelgan tokenni tekshiradi. Agar bu email bilan hisob bo'lmasa \\u2014 yangisini yaratadi. Bo'lsa \\u2014 mavjudiga kiritadi."
    },
    {
      nom: '4. Natija',
      sahna: '<div class="obj">result.user = {\n  <span class="k">uid</span>:         <span class="v">"aBc123..."</span>,\n  <span class="k">email</span>:       <span class="v">"ali@gmail.com"</span>,\n  <span class="k">displayName</span>: <span class="v">"Ali Valiyev"</span>,\n  <span class="k">photoURL</span>:    <span class="v">"https://lh3..."</span>\n}</div>',
      izoh: "Google'dan <b>ism va rasm ham</b> keladi. Email/parol bilan kirishda esa bular <code>null</code> bo'ladi \\u2014 keyingi bosqichda ko'ring."
    },
    {
      nom: '5. Taqqoslash',
      sahna: '<div class="obj"><span style="color:#94a3b8">// Email/parol bilan kirganda:</span>\nuser = {\n  <span class="k">uid</span>:         <span class="v">"xYz789..."</span>,\n  <span class="k">email</span>:       <span class="v">"vali@gmail.com"</span>,\n  <span class="k">displayName</span>: <span class="n">null</span>,\n  <span class="k">photoURL</span>:    <span class="n">null</span>\n}</div>',
      izoh: "<b>Muhim:</b> <code>displayName</code> va <code>photoURL</code> <code>null</code> bo'lishi mumkin. Kodda <code>user.displayName.toUpperCase()</code> deb yozsangiz \\u2014 <code>TypeError</code>. Har doim tekshiring."
    }
  ];

  var sahna = document.querySelector('#sahna');
  var qadam = document.querySelector('#qadam');
  var izoh = document.querySelector('#izoh');

  function chiz(n) {
    sahna.innerHTML = bosqichlar[n].sahna;
    izoh.innerHTML = bosqichlar[n].izoh;
    var t = qadam.querySelectorAll('button');
    for (var j = 0; j < t.length; j++) t[j].className = (j === n) ? 'faol' : '';
  }

  for (var i = 0; i < bosqichlar.length; i++) {
    var b = document.createElement('button');
    b.textContent = bosqichlar[i].nom;
    b.dataset.n = i;
    b.addEventListener('click', function () { chiz(Number(this.dataset.n)); });
    qadam.appendChild(b);
  }

  chiz(0);
</script>
\`\`\`

---

## ⚙️ Console sozlash

**Authentication → Sign-in method → Google → Enable**

Ikkita narsa so'raladi: **Project support email** (o'zingizniki) va public-facing name. Saqlang.

> ⚠️ **Authorized domains** ro'yxatida saytingiz bo'lishi shart. \`localhost\` va \`.web.app\` avtomatik qo'shilgan. O'z domeningiz bo'lsa — qo'shing (7-dars), aks holda \`auth/unauthorized-domain\`.

---

## 💻 Kod

\`\`\`javascript
import { GoogleAuthProvider, signInWithPopup }
  from '.../firebase-auth.js';

const provider = new GoogleAuthProvider();

document.querySelector('#google-btn').addEventListener('click', async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Profil bormi?
    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        ism: user.displayName || user.email.split('@')[0],
        email: user.email,
        photoURL: user.photoURL || null,
        yaratilgan: serverTimestamp(),
      });
    }

    // Yo'naltirish onAuthStateChanged ichida — bu yerda emas!

  } catch (error) {
    xatoniKorsat(error);
  }
});
\`\`\`

> ⚠️ **Yo'naltirishni bu yerda yozmang.** Agar \`click\` ichida ham, \`onAuthStateChanged\` ichida ham \`window.location.href\` bo'lsa — ikkalasi bir vaqtda ishga tushadi va sahifa ikki marta yo'naltiriladi. Ba'zan profil yozib ulgurmaydi.
>
> Bitta joyda qoldiring: \`onAuthStateChanged\`.

---

## 🔴 Darsda albatta chiqadigan xato

Tasavvur qiling. 2-darsda Ali \`ali@gmail.com\` bilan **parol orqali** ro'yxatdan o'tgan. Bugun **Google bilan kirish** tugmasini bosadi va **o'sha** \`ali@gmail.com\` ni tanlaydi.

\`\`\`text
auth/account-exists-with-different-credential
\`\`\`

Firebase'da standart holatda **bir email — bitta hisob**. Ali allaqachon parol bilan ro'yxatdan o'tgan, demak Google bilan kira olmaydi.

Bu sinfingizda **deyarli hammada** chiqadi, chunki hamma o'z Gmail'i bilan ro'yxatdan o'tgan.

\`\`\`demo h=430 "Bir email, ikkita provayder"
<style>
  * { box-sizing: border-box; }
  body { font-family: sans-serif; font-size: 13px; margin: 0; padding: 14px; }

  .holat {
    background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px;
    padding: 10px; font-family: monospace; font-size: 11.5px; margin-bottom: 12px;
    line-height: 1.8;
  }
  .holat b { color: #7c3aed; }

  .tugmalar { display: flex; gap: 6px; margin-bottom: 12px; flex-wrap: wrap; }
  button {
    padding: 8px 12px; border: 1px solid #d1d5db; background: white;
    border-radius: 7px; font-size: 11.5px; cursor: pointer;
  }
  button:hover { background: #f3f4f6; }
  #tozala { background: #6b7280; color: white; border-color: #6b7280; }

  #natija {
    border-radius: 8px; padding: 12px; font-size: 12px; line-height: 1.8;
    min-height: 96px;
  }
  .ok   { background: #f0fdf4; border: 2px solid #86efac; color: #15803d; }
  .xato { background: #fef2f2; border: 2px solid #fca5a5; color: #b91c1c; }
  .bosh { background: #f9fafb; border: 2px solid #e5e7eb; color: #6b7280; }
  #natija code { background: rgba(0,0,0,.07); padding: 1px 5px; border-radius: 3px; font-family: monospace; font-size: 11px; }
</style>

<div class="holat" id="holat"></div>

<div class="tugmalar">
  <button data-a="parol">Parol bilan ro'yxatdan o'tish</button>
  <button data-a="google">Google bilan kirish</button>
  <button id="tozala">Tozalash</button>
</div>

<div id="natija" class="bosh">Tugmalardan birini bosing. Email ikkalasida ham <b>ali@gmail.com</b>.</div>

<script>
  var provayderlar = [];
  var holatEl = document.querySelector('#holat');
  var natija = document.querySelector('#natija');

  function holatChiz() {
    if (provayderlar.length === 0) {
      holatEl.innerHTML = "Firebase Authentication \\u2192 Users:  <b>bo'sh</b>";
    } else {
      holatEl.innerHTML =
        'Firebase Authentication \\u2192 Users:\\n' +
        '  ali@gmail.com   provayderlar: <b>' + provayderlar.join(', ') + '</b>';
    }
  }

  function bosildi(a) {
    if (provayderlar.length === 0) {
      provayderlar.push(a === 'parol' ? 'password' : 'google.com');
      natija.className = 'ok';
      natija.innerHTML =
        '\\u2705 <b>Hisob yaratildi.</b><br />' +
        'Bu email bilan hisob yo\\'q edi \\u2014 Firebase yangisini yaratdi va ' +
        '<code>' + provayderlar[0] + '</code> provayderini bog\\'ladi.';
      holatChiz();
      return;
    }

    var joriy = (a === 'parol') ? 'password' : 'google.com';

    if (provayderlar.indexOf(joriy) !== -1) {
      natija.className = 'ok';
      natija.innerHTML = '\\u2705 <b>Kirdi.</b> Bu provayder allaqachon bog\\'langan.';
      return;
    }

    natija.className = 'xato';
    natija.innerHTML =
      '\\u274c <code>auth/account-exists-with-different-credential</code><br /><br />' +
      'Bu email allaqachon <code>' + provayderlar[0] + '</code> bilan ro\\'yxatdan o\\'tgan. ' +
      'Firebase\\'da standart holatda <b>bir email \\u2014 bitta hisob</b>.<br /><br />' +
      '<b>Yechim:</b> foydalanuvchiga tushunarli qilib ayting: ' +
      '\\u201cSiz bu email bilan ' + (provayderlar[0] === 'password' ? 'parol' : 'Google') +
      ' orqali ro\\'yxatdan o\\'tgansiz. O\\'sha usul bilan kiring.\\u201d';
  }

  var t = document.querySelectorAll('.tugmalar button[data-a]');
  for (var i = 0; i < t.length; i++) {
    t[i].addEventListener('click', function () { bosildi(this.dataset.a); });
  }

  document.querySelector('#tozala').addEventListener('click', function () {
    provayderlar = [];
    natija.className = 'bosh';
    natija.textContent = 'Tozalandi. Qaytadan sinab ko\\'ring.';
    holatChiz();
  });

  holatChiz();
</script>
\`\`\`

**Eng muhimi — foydalanuvchiga tushunarli aytish.** \`auth/account-exists-with-different-credential\` degan yozuv hech kimga hech narsa demaydi:

\`\`\`javascript
const xabarlar = {
  'auth/account-exists-with-different-credential':
    "Bu email parol bilan ro'yxatdan o'tgan. Parolingiz bilan kiring.",
  'auth/popup-closed-by-user': 'Kirish bekor qilindi',
  'auth/popup-blocked': "Brauzer popup'ni to'sdi. Ruxsat bering yoki qayta uring",
  'auth/cancelled-popup-request': 'Bir marta bosing',
  'auth/unauthorized-domain': "Bu domen ro'yxatdan o'tmagan",
};

function xatoniKorsat(error) {
  document.querySelector('#xato').textContent =
    xabarlar[error.code] || "Xatolik yuz berdi. Qaytadan urinib ko'ring.";
  console.error(error);   // batafsili — konsolga
}
\`\`\`

> 💡 Naqsh o'zgarmaydi: **foydalanuvchiga — sodda o'zbekcha, konsolga — texnik tafsilot.** Bu 2-darsdan beri takrorlanadi.

---

## 📱 Popup telefonda ishlamasligi mumkin

\`signInWithPopup\` yangi oyna ochadi. Ba'zi joylarda bu bloklanadi:

- Telegram, Instagram ichidagi brauzerlar
- Ba'zi telefon brauzerlari
- Popup bloklagichlar

Muqobil variant — \`signInWithRedirect\`: yangi oyna emas, **o'sha sahifa** Google'ga o'tadi va qaytadi.

\`\`\`javascript
import { signInWithRedirect, getRedirectResult } from '.../firebase-auth.js';

// Yuborish
await signInWithRedirect(auth, provider);

// Qaytganda — sahifa yuklanganda tekshirish
const result = await getRedirectResult(auth);
if (result) {
  console.log('Kirdi:', result.user.email);
}
\`\`\`

> ⚠️ \`signInWithRedirect\` ham har joyda muammosiz emas — ba'zi brauzerlar uchinchi tomon cookie'larini to'sadi va bu jarayonni buzadi.
>
> **Amaliy maslahat:** popup bilan boshlang. \`auth/popup-blocked\` xatosi kelsa — redirect'ga o'ting:
>
> \`\`\`javascript
> try {
>   await signInWithPopup(auth, provider);
> } catch (e) {
>   if (e.code === 'auth/popup-blocked') {
>     await signInWithRedirect(auth, provider);
>   } else {
>     xatoniKorsat(e);
>   }
> }
> \`\`\`

---

## 🖼 Avatar — ikkita ehtiyot chorasi

\`\`\`javascript
const avatar = document.querySelector('#avatar');

// 1. null bo'lishi mumkin
if (user.photoURL) {
  avatar.src = user.photoURL;
} else {
  avatar.textContent = (user.email[0] || '?').toUpperCase();
}

// 2. URL ishlamay qolishi mumkin
avatar.addEventListener('error', () => {
  avatar.style.display = 'none';
});
\`\`\`

Google'ning rasm manzillari ba'zan ochilmaydi. \`error\` hodisasisiz sahifada **singan rasm belgisi** qoladi.

Ismni ko'rsatishda ham:

\`\`\`javascript
const ism = user.displayName || user.email.split('@')[0];
\`\`\`

---

## 🔒 Maxfiylik — bir daqiqa to'xtang

Google bilan kirishda sizning ilovangizga foydalanuvchining **haqiqiy ismi** va **haqiqiy fotosurati** keladi. Siz ularni Firestore'ga yozasiz.

6-darsdagi qoidamiz esa:

\`\`\`javascript
match /users/{userId} {
  allow read: if kirgan();     // kirgan HAR KIM o'qiy oladi
}
\`\`\`

Ya'ni: saytingizga ro'yxatdan o'tgan **har qanday odam** hamma o'quvchining ism-sharifi va rasmini ko'ra oladi. Sayt esa internetda ochiq turibdi.

**Nima qilish kerak:**

- Sinfdoshlaringizga ayting: saytingiz haqiqiy va ma'lumotlari ko'rinadi
- Chatda **taxallus** ishlatishga ruxsat bering — \`displayName\` ni majburiy qilmang
- Ilova kerak qilmaydigan ma'lumotni **saqlamang**

\`\`\`javascript
// Chatda faqat shu kerak
await setDoc(userRef, {
  ism: taxallus || user.displayName,
  email: user.email,
});
// photoURL, tug'ilgan sana va h.k. — kerak bo'lmasa yozmang
\`\`\`

> 💡 Bu qoida faqat o'quv loyihasi uchun emas. **Kerak bo'lmagan ma'lumotni yig'maslik** — professional dasturchining asosiy odati. Saqlamagan ma'lumotingiz hech qachon sizdan o'g'irlanmaydi.

---

## 🥉 Bronze Topshiriq

- Console'da Google Sign-In yoqing
- Tugma qo'shing, \`signInWithPopup\` bilan kiring
- \`user.displayName\` va \`user.email\` ni ekranda ko'rsating

## 🥈 Silver Topshiriq

- Google **va** email/parol — ikkalasi ham ishlasin
- \`auth/account-exists-with-different-credential\` uchun **tushunarli o'zbekcha xabar**
- Avatar ko'rsatilsin, \`photoURL\` \`null\` bo'lsa — birinchi harf
- Yo'naltirish faqat \`onAuthStateChanged\` ichida

## 🥇 Gold Topshiriq

- Yangi foydalanuvchida profil yaratilsin, mavjudida yaratilmasin (\`getDoc\` tekshiruvi)
- \`popup-blocked\` bo'lsa avtomatik \`signInWithRedirect\` ga o'tsin
- Avatar \`error\` hodisasi bilan himoyalangan
- Foydalanuvchi **taxallus** kirita olsin — haqiqiy ismi majburiy bo'lmasin
- Telefonda sinang: popup ishladimi?

---

## ✅ Dars Xulosa

- \`new GoogleAuthProvider()\` + \`signInWithPopup(auth, provider)\`
- Parol Google sahifasida kiritiladi — sizning saytingizga tushmaydi
- \`displayName\` va \`photoURL\` **\`null\` bo'lishi mumkin**
- **Bir email — bitta hisob**; boshqa provayder bilan kirishga urinish xato beradi
- Xato kodini emas, **tushunarli xabarni** ko'rsating
- Popup bloklansa — \`signInWithRedirect\`
- Yo'naltirish faqat bitta joyda: \`onAuthStateChanged\`
- Kerak bo'lmagan shaxsiy ma'lumotni saqlamang

> 🚀 **Keyingi dars:** Firebase Storage — o'z rasmingizni yuklash.
`,
    teacher: `
## 🔴 Darsda albatta chiqadigan, lekin yozilmagan xato

Asl sahifada xato kodlari ro'yxati bor:

\`\`\`javascript
'auth/popup-closed-by-user', 'auth/popup-blocked', 'auth/cancelled-popup-request'
\`\`\`

Lekin **eng ko'p chiqadigani yo'q**: \`auth/account-exists-with-different-credential\`.

**Nima uchun albatta chiqadi:** 2-darsda bolalar o'z Gmail manzillari bilan **parol orqali** ro'yxatdan o'tgan. Bugun **o'sha Gmail** bilan Google Sign-In bosadi.

Firebase'da standart sozlama — **"One account per email address"**. Ya'ni bir email bilan bitta hisob. Google bilan kirish rad etiladi.

Bu sinfingizda **deyarli hammada** chiqadi va dars to'xtaydi.

Firebase hujjatlarining aniq formulasi: *"If you enabled the One account per email address setting... the error \`auth/account-exists-with-different-credential\` is thrown."*

**To'liq yechim** (hisoblarni bog'lash — \`linkWithCredential\`) bu daraja uchun murakkab. Darsda amaliy yo'l tanlandi: xatoni **ushlash** va foydalanuvchiga tushunarli aytish — *"Siz bu email bilan parol orqali ro'yxatdan o'tgansiz. Parolingiz bilan kiring."*

Interaktiv demo qo'shildi: bola ikki tugmani bosib, to'qnashuvni o'z ko'zi bilan ko'radi.

**Darsda tayyorlanib boring:** bu xato chiqqanda "bu normal, hozir tushuntiraman" deyishga tayyor turing. Aks holda 15 daqiqa yo'qoladi.

---

## ⚠️ Ikkinchi: ikki marta yo'naltirish

Asl koddagi tuzilma:

\`\`\`javascript
// click ichida
window.location.href = 'dashboard.html';

// va onAuthStateChanged ichida ham
if (user) { /* dashboard */ }
\`\`\`

Ikkalasi ham bir vaqtda ishga tushadi. Ba'zan \`setDoc\` profil yozishni tugatmasdan sahifa almashadi va **profil yaratilmay qoladi**. Bu tasodifiy xato — ba'zan ishlaydi, ba'zan yo'q — shuning uchun topish juda qiyin.

Darsda yo'naltirish bitta joyda qoldirildi: \`onAuthStateChanged\`.

---

## ⚠️ Uchinchi: displayName va photoURL null bo'lishi

Asl kodda:

\`\`\`javascript
ism: user.displayName,
photoURL: user.photoURL,
\`\`\`

Google bilan kirganda bular to'la keladi. Lekin **email/parol** bilan kirgan foydalanuvchida ikkalasi ham \`null\`.

Bitta sahifada ikkala usul ham ishlasa (Silver topshirig'i aynan shu), bolaning kodi \`null\` da yiqiladi:

- \`user.displayName.toUpperCase()\` → \`TypeError\`
- \`avatar.src = null\` → singan rasm belgisi

Darsda \`||\` bilan zaxira qiymat va \`error\` hodisasi bilan himoya qo'shildi. Demoda ikkala \`user\` obyekti yonma-yon ko'rsatiladi.

---

## 🗒 Qo'shilgan boshqa narsalar

**Popup va redirect.** Asl sahifa \`signInWithPopup\` ni ishlatadi va "(yoki redirect)" deb bir marta eslatib o'tadi, lekin kodini bermaydi. Telegram yoki Instagram ichidagi brauzerda popup ochilmaydi — bolalar havolani bir-biriga Telegram orqali yuborishadi, ya'ni bu **aniq** chiqadi. \`popup-blocked\` da redirect'ga o'tish naqshi qo'shildi.

**Authorized domains.** 7-darsdagi bilan bir xil sabab — custom domenda \`auth/unauthorized-domain\`.

**Favicon o'rniga.** Asl kod tugma ikonkasi sifatida \`https://www.google.com/favicon.ico\` ni yuklaydi. Bu tashqi so'rov: sekin internetda kechikadi, bloklansa tugmada singan rasm qoladi. Darsda oddiy matnli belgiga almashtirildi.

**SDK versiyasi** qattiq yozilgan (10.7.0).

---

## 🔒 Maxfiylik — bu darsning eng muhim qismi

Asl sahifada bu umuman yo'q, lekin bu yerda **haqiqiy masala** bor.

Google Sign-In bilan ilovaga bolaning **haqiqiy ismi** va **haqiqiy fotosurati** keladi va Firestore'ga yoziladi. 6-darsdagi qoidamiz esa:

\`\`\`javascript
allow read: if kirgan();
\`\`\`

Ya'ni internetda ochiq turgan saytga ro'yxatdan o'tgan **har qanday odam** butun sinfning ism-sharifi va rasmini ko'ra oladi.

O'quvchilaringiz — bolalar. Loyiha havolasi Telegram orqali tarqaladi. Buni e'tibordan chetda qoldirib bo'lmaydi.

Darsga qo'shildi: taxallus imkoniyati, kerak bo'lmagan ma'lumotni saqlamaslik qoidasi.

> **Darsda ochiq gapiring:** "Bu sayt haqiqiy va internetda turibdi. Haqiqiy ismingizni ko'rsatishni istamasangiz — taxallus yozing. Bu to'g'ri qaror."
>
> Va professional qoidani ayting: **saqlamagan ma'lumotingiz hech qachon o'g'irlanmaydi.**

---

## 💡 O'qituvchi uchun

- **Bu dars juda qoniqarli o'tadi** — bir bosishda kirish, ism va rasm o'zi keladi. Bolalar buni yoqtiradi. Shuning uchun \`account-exists\` xatosi kayfiyatni buzmasligi uchun unga tayyor turing.
- **Popup Google'niki ekanini ta'kidlang.** Parol Google sahifasida kiritiladi, sizning saytingizga tushmaydi — shuning uchun bu usul parolni o'zingiz yig'ishdan **xavfsizroq**. Bu tushuncha keyinchalik OAuth'ni tushunishga asos bo'ladi.
- **Ikkala usulni bitta sahifada qildiring.** Aynan shunda \`null\` muammosi chiqadi va bola \`||\` zaxira qiymatining nima uchun kerakligini tushunadi.
- **Telefonda sinashni talab qiling.** Sayt allaqachon internetda (7-dars) — havolani Telegram'da yuborib, telefonda ochsin. Popup ishlamasa — redirect kerakligini o'zi ko'radi.
- Console → Authentication → Users'da provayder ustunini ko'rsating: bir foydalanuvchida \`password\`, boshqasida Google ikonkasi.

## ⚠️ Ko'p uchraydigan xatolar

- **\`auth/account-exists-with-different-credential\`** — yuqorida, eng ko'p uchraydigan.
- **\`auth/unauthorized-domain\`** — custom domen Authorized domains'da yo'q.
- **\`auth/popup-blocked\`** — brauzer to'sgan, yoki popup \`click\` hodisasidan tashqarida chaqirilgan (\`await\` dan keyin chaqirilsa brauzer uni "foydalanuvchi harakati emas" deb hisoblaydi).
- **\`auth/popup-closed-by-user\`** — foydalanuvchi oynani yopdi. Bu **xato emas**, qizil xabar ko'rsatmang.
- **\`TypeError: Cannot read properties of null\`** — \`displayName\` yoki \`photoURL\` \`null\`.
- **Profil yaratilmay qolgan** — ikki marta yo'naltirish tufayli \`setDoc\` uzilib qolgan.
- **Singan rasm belgisi** — \`photoURL\` ochilmagan, \`error\` ushlanmagan.
- **Google yoqilmagan** — Console'da Enable qilinmagan: \`auth/operation-not-allowed\`.

## 📊 Daraja belgilash

- **Bronze** — Google bilan kiradi, ism ekranda ko'rinadi
- **Silver** — ikkala usul ishlaydi, to'qnashuv xatosi tushunarli ko'rsatiladi, avatar zaxirasi bor
- **Gold** — profil bir marta yaratiladi, popup-blocked'da redirect, taxallus imkoniyati bor

> **Tekshirish usuli:** bolaning saytida **avval parol bilan** ro'yxatdan o'ting (\`test@gmail.com\`), chiqing, keyin **o'sha email** bilan Google Sign-In bosing.
>
> Tushunarli o'zbekcha xabar chiqsa — Silver.
> \`auth/account-exists-with-different-credential\` degan yozuv chiqsa yoki hech narsa bo'lmasa — yo'q.
>
> Ikkinchi tekshiruv: email/parol bilan kirgan foydalanuvchida avatar o'rnida nima turibdi? Singan rasm belgisi bo'lsa — \`photoURL\` \`null\` holati ishlanmagan.
`,
  },

  // ═══════════════════════════════════════════════════════════
  'junior.m3.l8': {
    goal: "Chat App v1 nazorat nuqtasi: ishlaydigan ilovani sinab, kamchiliklarni topib, qisqa taqdim qilish.",
    student: `
## 🎯 Bugun nima bo'ladi?

Bu — **nazorat nuqtasi**, oxirgi imtihon emas.

Ettita darsda o'rgangan hamma narsa bitta ishlaydigan ilovaga aylandi:

\`\`\`text
1-dars  Firebase sozlash
2-dars  Ro'yxatdan o'tish        ┐
3-dars  Kirish / chiqish          ├─  Auth
4-dars  Firestore CRUD            ┐
5-dars  onSnapshot real-time      ├─  Ma'lumot
6-dars  Security Rules            ┘
7-dars  Hosting                   ──  Internetda
\`\`\`

Bugun uni **sinab ko'ramiz** va **ko'rsatamiz**. Modulning oxirgi Demo Day'i 12-darsda bo'ladi — u yerda Google Sign-In, avatar va ko'p sahifali ilova ham bo'ladi.

---

## ✅ Taqdimotdan oldin o'zingizni tekshiring

Har bandni **haqiqatan bajarib ko'ring** — "ha, bor" deb o'ylash yetarli emas. Bandni bosing, qanday tekshirishni ko'rasiz.

\`\`\`demo h=560 "Taqdimotdan oldingi tekshiruv"
<style>
  * { box-sizing: border-box; }
  body { font-family: sans-serif; font-size: 13px; margin: 0; padding: 14px; }

  .bolim { margin-bottom: 10px; }
  .bolim h4 {
    margin: 0 0 6px; font-size: 11px; font-family: monospace;
    text-transform: uppercase; letter-spacing: .5px;
  }
  .bronze h4 { color: #c2691a; }
  .silver h4 { color: #64748b; }

  .band {
    display: flex; align-items: center; gap: 8px;
    padding: 7px 9px; border: 1px solid #e5e7eb; border-radius: 7px;
    margin-bottom: 4px; cursor: pointer; font-size: 12px;
  }
  .band:hover { background: #f9fafb; }
  .band.tanlangan { border-color: #6366f1; background: #eef2ff; }
  .band.bajarildi { background: #f0fdf4; border-color: #86efac; }
  .quti {
    width: 17px; height: 17px; border: 2px solid #d1d5db;
    border-radius: 4px; flex: 0 0 auto; font-size: 12px;
    display: flex; align-items: center; justify-content: center;
    color: white; line-height: 1;
  }
  .bajarildi .quti { background: #16a34a; border-color: #16a34a; }

  #qanday {
    margin-top: 10px; background: #eff6ff; border: 1px solid #bfdbfe;
    border-radius: 8px; padding: 11px; font-size: 12px;
    color: #1e40af; line-height: 1.8; min-height: 92px;
  }
  #qanday b { display: block; margin-bottom: 4px; }
  #qanday code {
    background: #dbeafe; padding: 1px 5px; border-radius: 3px;
    font-family: monospace; font-size: 11px;
  }

  #hisob {
    margin-top: 10px; padding: 9px 11px; border-radius: 8px;
    font-size: 12px; font-family: monospace; text-align: center;
    background: #f3f4f6; color: #374151;
  }
  #hisob.tola { background: #dcfce7; color: #15803d; font-weight: 700; }
</style>

<div class="bolim bronze">
  <h4>🥉 Bronze — ishlashi shart</h4>
  <div id="b1"></div>
</div>

<div class="bolim silver">
  <h4>🥈 Silver — bugungi maqsad</h4>
  <div id="b2"></div>
</div>

<div id="qanday">Bandni bosing — uni qanday tekshirish kerakligini ko'rsataman.</div>
<div id="hisob"></div>

<script>
  var bandlar = [
    { g: 1, t: "Ro'yxatdan o'tish ishlaydi", q: "Console \\u2192 Authentication \\u2192 Users. YANGI email bilan ro'yxatdan o'ting va ro'yxatda paydo bo'lishini ko'ring. Eski akkaunt bilan sinamang." },
    { g: 1, t: "Kirish ishlaydi", q: "Chiqing, keyin qayta kiring. Parolni ATAYLAB noto'g'ri yozib ko'ring \\u2014 <code>auth/invalid-credential</code> xabari foydalanuvchiga tushunarli ko'rinishda chiqishi kerak, konsolda emas." },
    { g: 1, t: "Himoyalangan sahifa", q: "Chiqqan holda <code>chat.html</code> manzilini to'g'ridan-to'g'ri yozib ochib ko'ring. Login sahifasiga yo'naltirilishi kerak. Agar chat ochilsa \\u2014 <code>onAuthStateChanged</code> tekshiruvi yo'q." },
    { g: 1, t: "Xabar yoziladi va o'qiladi", q: "Xabar yuboring, Console \\u2192 Firestore Database'da hujjat paydo bo'lishini ko'ring. <code>uid</code> va <code>vaqt</code> maydonlari bormi?" },
    { g: 1, t: "Chiqish ishlaydi", q: "Chiqing va brauzerni YOPIB qayta oching. Kirgan holatda qolmasligi kerak." },

    { g: 2, t: "Real-time (onSnapshot)", q: "IKKI oyna oching (biri maxfiy rejimda, boshqa akkaunt). Birida yozing \\u2014 ikkinchisida sahifa yangilanmasdan paydo bo'lsin." },
    { g: 2, t: "Xabar ikkilanmaydi", q: "Chiqing va qayta kiring, 3-4 marta. Xabarlar ikki-uch marta ko'rinsa \\u2014 nusxa listener bor. Yangi <code>onSnapshot</code> ochishdan oldin eskisini yoping (5-dars)." },
    { g: 2, t: "XSS himoyasi", q: "Chatga <code>&lt;b&gt;test&lt;/b&gt;</code> deb yozing. QALIN test chiqsa \\u2014 <code>innerHTML</code> ishlatilgan, XSS teshigi bor. <code>&lt;b&gt;test&lt;/b&gt;</code> matn bo'lib chiqsa \\u2014 to'g'ri." },
    { g: 2, t: "Faqat egasi o'chiradi", q: "Sinfdoshingizdan xabar yozishini so'rang va uni o'chirishga uring. Tugma ko'rinmasligi yoki xato berishi kerak." },
    { g: 2, t: "Security Rules yozilgan", q: "Console \\u2192 Firestore \\u2192 Rules'da <code>allow read, write: if true</code> QOLMAGAN bo'lsin. Pastdagi <code>match /{document=**}</code> ni tekshiring \\u2014 qoidalar birlashadi." },
    { g: 2, t: "Internetda ochiladi", q: "TELEFONINGIZDAN <code>https://...web.app</code> manzilini oching. Wi-Fi'ni o'chirib, mobil internet bilan sinang \\u2014 haqiqatan internetdami?" },
    { g: 2, t: "Oxirgi deploy yangi", q: "Kodda kichik o'zgarish qiling, <code>firebase deploy</code>, keyin <b>Ctrl+Shift+R</b>. O'zgarish ko'rinmasa \\u2014 kesh yoki deploy o'tmagan." }
  ];

  var holat = [];
  for (var i = 0; i < bandlar.length; i++) holat.push(false);

  var b1 = document.querySelector('#b1');
  var b2 = document.querySelector('#b2');
  var qanday = document.querySelector('#qanday');
  var hisob = document.querySelector('#hisob');
  var elementlar = [];

  function yangila() {
    var son = 0;
    for (var i = 0; i < holat.length; i++) {
      elementlar[i].className = 'band' + (holat[i] ? ' bajarildi' : '');
      elementlar[i].querySelector('.quti').textContent = holat[i] ? '\\u2713' : '';
      if (holat[i]) son++;
    }
    hisob.textContent = son + ' / ' + bandlar.length + ' tekshirildi';
    hisob.className = (son === bandlar.length) ? 'tola' : '';
    if (son === bandlar.length) {
      hisob.textContent = '\\u2705 Hammasi tekshirildi \\u2014 taqdimotga tayyorsiz';
    }
  }

  for (var i = 0; i < bandlar.length; i++) {
    (function (n) {
      var el = document.createElement('div');
      el.className = 'band';

      var q = document.createElement('span');
      q.className = 'quti';

      var t = document.createElement('span');
      t.textContent = bandlar[n].t;

      el.append(q, t);

      el.addEventListener('click', function (e) {
        if (e.target === q) {
          holat[n] = !holat[n];
          yangila();
        } else {
          qanday.innerHTML = '<b>' + bandlar[n].t + '</b>' + bandlar[n].q;
        }
      });

      elementlar.push(el);
      (bandlar[n].g === 1 ? b1 : b2).appendChild(el);
    })(i);
  }

  yangila();
</script>
\`\`\`

> 💡 Chap tomondagi kvadratni bossangiz — belgilanadi. Matnni bossangiz — qanday tekshirish kerakligi chiqadi.

---

## 🛡️ Security Rules ishlayotganini qanday ko'rsatish

Bu — taqdimotning eng ta'sirli qismi va ko'pchilik uni noto'g'ri qiladi.

**Ishlamaydigan usul:** DevTools → Network. Firestore ma'lumotni gRPC/WebSocket orqali yuboradi — u yerda o'qib bo'ladigan hech narsa yo'q.

**Ishlaydigan usul:** hujum qilib ko'rsatish.

1. DevTools → **Console** oching
2. Sinfdoshingizning xabari ID sini oling (Firestore Console'dan)
3. Yozing:

\`\`\`javascript
await deleteDoc(doc(db, 'messages', 'boshqaning-xabar-id'));
\`\`\`

\`\`\`text
FirebaseError: Missing or insufficient permissions.
\`\`\`

Mana shu xato — **sizning himoyangiz ishlayotganining isboti**.

> ⚠️ Buni ko'rsatish uchun \`db\`, \`doc\`, \`deleteDoc\` konsolda mavjud bo'lishi kerak. Modul skriptida ular yopiq. Taqdimotdan oldin sinab ko'ring — kerak bo'lsa vaqtincha \`window.db = db\` deb qo'ying va **ko'rsatgandan keyin olib tashlang**.

---

## 🎤 Taqdimot tuzilmasi (8 daqiqa)

**Demo — 4 daqiqa**

1. \`https://...web.app\` manzilini oching (kompyuterda **va** telefonda)
2. Sinfdoshingiz sizning saytingizda ro'yxatdan o'tsin
3. Ikki qurilmadan yozishib ko'rsating — real-time
4. Security Rules hujumini ko'rsating

**Tushuntirish — 3 daqiqa**

Uchta gapga javob bering:

- "Eng qiyin qism **...** edi, uni **...** bilan hal qildim"
- "Bitta narsani boshqacha qilgan bo'lardim: **...**"
- "Hozir ishlamayotgan narsa: **...**"

> 💡 Uchinchi savol **eng muhimi**. Kamchiligini o'zi aytgan odam — kuchli dasturchi. Yashirgan odam — hali o'rganmagan.

**Savollar — 1 daqiqa**

---

## 📝 Baholash

| Mezon | 1 | 2 | 3 | 4 | 5 |
| --- | --- | --- | --- | --- | --- |
| Auth (ro'yxat, kirish, himoya) | | | | | |
| Firestore va real-time | | | | | |
| Security Rules | | | | | |
| Deploy va internetda ishlashi | | | | | |
| Tushuntirish aniqligi | | | | | |

\`\`\`text
Jami: ___ / 25

Yaxshi ketgan:  ______________________________
Tuzatish kerak: ______________________________
Keyingi qadam:  ______________________________
\`\`\`

> **"Tushuntirish aniqligi"** — kod sifatida emas, **o'z kodini tushunishi** baholanadi. Ishlaydigan, lekin tushuntirib berolmaydigan kod — 2 ball.

---

## 🔜 Keyingi to'rt dars

Ilova ishlaydi, lekin hali yetishmaydigan narsalar bor:

| Dars | Nima qo'shiladi | Nimani hal qiladi |
| --- | --- | --- |
| **9** | Google Sign-In | Parol o'ylab topish shart emas |
| **10** | Storage | Avatar va rasm yuborish |
| **11** | Ko'p sahifali auth | Profil, sozlamalar sahifalari |
| **12** | **Demo Day** | Firebase Developer Badge |

12-darsda **to'liq** ilovani taqdim qilasiz.

---

## 🥉 Bronze Topshiriq

Yuqoridagi ro'yxatning **Bronze** qismidagi 5 banddan hammasi ishlasin.

## 🥈 Silver Topshiriq

**Silver** qismidagi 7 band ham ishlasin. Ayniqsa: XSS himoyasi va xabar ikkilanmasligi.

## 🥇 Gold Topshiriq

- Yuqoridagi hammasi
- **Xatolar foydalanuvchiga ko'rinadi** — konsolda emas, ekranda tushunarli o'zbekcha xabar
- **Bo'sh holat** — hali xabar yo'q bo'lsa "Birinchi xabarni yozing" deb turadi, bo'sh ekran emas
- **Yuklanish holati** — sahifa ochilganda "Yuklanmoqda..." ko'rinadi (3-darsdagi uch holat)
- **Telefonda ham normal ko'rinadi** — matn kichrayib ketmagan, tugmalar bosiladigan

> Bu uchtasi — kod emas, **foydalanuvchiga g'amxo'rlik**. Aynan shu narsa ishlaydigan loyihani **yaxshi** loyihadan ajratadi.

---

## ✅ Xulosa

Yetti darsda siz quyidagilarni qildingiz:

- Haqiqiy autentifikatsiya tizimi
- Bulutdagi ma'lumotlar bazasi
- Real vaqtda yangilanadigan interfeys
- Serverda ishlaydigan xavfsizlik qoidalari
- Internetda ochiq turgan, telefondan ham ishlaydigan sayt

Bu — o'quv mashqi emas. Bu **ishlaydigan mahsulot**.

> 🚀 **Keyingi dars:** Google Sign-In — bir bosishda kirish.
`,
    teacher: `
## 🔴 Tuzilmaviy muammo: ikkita Demo Day

Modulda **ikkita** Demo Day bor:

- **8-dars** — "Grand Final — Chat App Demo Day"
- **12-dars** — "3-Modul Demo Day — Firebase Developer Badge"

Ikkalasi ham Firebase Developer Badge beradi, ikkalasi ham React'ni anons qiladi, ikkalasi ham "final" deb ataladi.

Sabab aniq ko'rinadi: modul dastlab **8 darsga** rejalashtirilgan, keyin 12 ga kengaytirilgan, lekin 8-dars eski holicha qolgan.

**Bu qanday zarar keltiradi:** bola 8-darsda "tugadi, badge oldim" deb hisoblaydi va qolgan 4 darsga jiddiy qaramaydi. Yakuniy taqdimotning ta'siri ham ikkiga bo'linib, ikkalasi ham kuchsizlanadi.

**Qabul qilingan yechim:**

| | Eski | Yangi |
| --- | --- | --- |
| **8-dars** | Grand Final + Badge | **Nazorat nuqtasi** — Chat App v1 |
| **12-dars** | Demo Day + Badge | **Yakuniy Demo Day** + Badge |

Badge, React anonsi va yakuniy marosim 12-darsda qoladi. 8-dars endi "oraliq sinov" — kamchiliklarni **taqdimotdan oldin** topish uchun.

Agar siz boshqacha qaror qilsangiz (masalan, modulni 8 darsda tugatish), 9–12 darslarni keyingi modulga o'tkazish kerak bo'ladi.

---

## 🔴 Ikkinchi xato: Gold hali o'rgatilmagan narsani talab qiladi

Asl 8-darsning Gold mezonlari:

- Google Sign-In → **9-darsda** o'rgatiladi
- Foydalanuvchi profili, avatar → **10-darsda** (Storage)

Ya'ni bola hali ko'rmagan narsadan baholanadi.

Bu — kursda **beshinchi marta** uchrayotgan bir xil naqsh (1-Modulda JavaScript 34-darsgacha o'rgatilmasa ham oldinroq talab qilingan edi, 8 joyda).

> **Tavsiya:** yangi dars yozganingizda yoki mavjudini o'zgartirganingizda bitta savolni bering: *"bu topshiriqdagi har bir narsa shu darsgacha o'rgatilganmi?"* Bu naqsh takrorlanib turibdi, demak tizimli tekshiruv kerak.

8-darsning Gold mezonlari o'rniga **shu paytgacha o'rgatilgan** narsalarga asoslangan mezonlar qo'yildi: xatolarni foydalanuvchiga ko'rsatish, bo'sh holat, yuklanish holati, telefonda ko'rinish. Bular kod emas, **foydalanuvchiga g'amxo'rlik** — va aynan shu narsa yetishmaydi.

---

## ⚠️ Uchinchi: "Security Rules'ni DevTools > Network'da ko'rsating"

Bu **ishlamaydi**. Firestore ma'lumotni gRPC/WebSocket orqali uzatadi — Network panelida faqat tushunarsiz ikkilik ma'lumot ko'rinadi. Bola urinib ko'radi, hech narsa topolmaydi va bu bandni tashlab ketadi.

To'g'ri usul — **hujum qilib ko'rsatish**: konsolda boshqaning xabarini \`deleteDoc\` bilan o'chirishga urinish va \`permission-denied\` olish.

Bitta amaliy nozik joy: modul skriptida \`db\` konsolda mavjud emas. Darsda \`window.db = db\` vaqtinchalik yechimi ko'rsatildi, **ko'rsatgandan keyin olib tashlash** shartи bilan.

**Buni oldindan sinab ko'ring** — taqdimot paytida ishlamay qolsa, eng kuchli lahza yo'qoladi.

---

## 🗒 Boshqa tuzatishlar

**Jadval hisobi.** Asl jadvalda "har o'quvchi 8–10 daqiqa" uchun 50 daqiqa ajratilgan — bu **5–6 o'quvchiga** yetadi. Guruhingiz kattaroq bo'lsa jadval buziladi.

Variantlar: taqdimotni 5 daqiqaga qisqartirish, ikki darsga bo'lish, yoki juftlikda ko'rsatish (biri telefon, biri kompyuter).

**"Lighthouse 80+"** — qaysi ko'rsatkich bo'yicha? Lighthouse to'rt xil ball beradi. Bundan tashqari login orqasidagi chat sahifasini Lighthouse tekshira olmaydi. Noaniq mezon sifatida olib tashlandi.

**Tekshiruv ro'yxati endi bajariladigan.** Asl ro'yxatda "onSnapshot real-time" kabi bandlar bor edi — bola "ha, yozganman" deb belgilaydi. Endi har band uchun **aniq tekshirish usuli** berilgan: qaysi tugmani bosish, nimani ko'rish kerak.

---

## 💡 O'qituvchi uchun

- **Bu dars — tuzatish uchun, baholash uchun emas.** Buni bolalarga ochiq ayting. Agar "final" deb his qilishsa, kamchiliklarini yashirishadi — holbuki bugun ularni **topish** kerak.
- **Tekshiruv ro'yxatini birga bajaring.** Darsning birinchi yarmi — hamma o'z ilovasini ro'yxat bo'yicha sinaydi. Ikkinchi yarmi — taqdimot. Ko'pchilik shu paytda 2-3 ta buzuq narsa topadi va bu asosiy foyda.
- **Juftlikda sinash yaxshi ishlaydi.** Har bola sherigining ilovasida ro'yxatdan o'tadi, xabar yozadi, o'chirishga urinadi. O'z ilovasidagi kamchilikni o'zi ko'rmaydi, sherigi ko'radi.
- **"Hozir ishlamayotgan narsa" savolini talab qiling.** Buni aytolmagan bola yo tekshirmagan, yo yashiryapti. Ikkalasi ham muammo. Kamchiligini ochiq aytganni **maqtang** — shunda madaniyat o'rnatiladi.
- **Telefonda ochishni albatta qildiring.** Ko'pchilik faqat kompyuterda sinagan bo'ladi. Telefonda tugmalar kichik, matn sig'maydi — bu darhol ko'rinadi.

## ⚠️ Taqdimotda ko'p uchraydigan muammolar

- **"Mening kompyuterimda ishlayapti"** — deploy qilinmagan yoki eski versiya. \`firebase deploy\` + hard reload.
- **Wi-Fi orqali \`localhost\` ko'rsatish** — bu deploy emas. \`.web.app\` manzilini talab qiling.
- **Xabar ikkilanadi** — nusxa listener (5-dars).
- **Bo'sh chat** — Security Rules "filtr emas" tuzog'i (6-dars) yoki listener xatosi. Konsolni oching.
- **Xato konsolda qoladi** — foydalanuvchi hech narsa ko'rmaydi. Gold mezoni aynan shu.
- **Test mode muddati tugagan** — \`Missing or insufficient permissions\` (6-dars).

## 📊 Daraja belgilash

- **Bronze** — ro'yxatdagi birinchi 5 band ishlaydi
- **Silver** — 12 bandning hammasi, ayniqsa XSS va ikkilanish
- **Gold** — xatolar ko'rinadi, bo'sh/yuklanish holatlari bor, telefonda normal

> **Eng tez tekshiruv:** bolaning saytini **o'z telefoningizda** oching, ro'yxatdan o'ting va \`<b>salom</b>\` deb yozing.
> Uch narsa bir vaqtda ma'lum bo'ladi: deploy qilinganmi, auth ishlaydimi, XSS himoyasi bormi.
`,
  },

  // ═══════════════════════════════════════════════════════════
  'junior.m3.l7': {
    goal: "Firebase CLI bilan saytni internetga chiqarish: init, deploy, rollback va keshdagi tuzoqlar.",
    student: `
## 🌐 Nima o'zgaradi?

Shu paytgacha sayt faqat sizning kompyuteringizda ochilardi (\`file:///...\` yoki Live Server). Endi u **haqiqiy manzil**ga chiqadi:

\`\`\`text
https://loyiha-nomingiz.web.app
\`\`\`

Firebase Hosting beradigan narsalar:

| | |
| --- | --- |
| **HTTPS** | Bepul SSL sertifikat, avtomatik |
| **CDN** | Fayllar dunyo bo'ylab serverlarda — tez ochiladi |
| **Domen** | \`.web.app\` va \`.firebaseapp.com\` |
| **Tarix** | Har deploy saqlanadi, bir bosishda **orqaga qaytarish** mumkin |

> 💡 HTTPS shunchaki "chiroyli" emas. Ko'p zamonaviy brauzer imkoniyatlari (kamera, joylashuv, Service Worker) **faqat HTTPS**'da ishlaydi. \`file://\` da ular yopiq.

---

## 💻 Bir martalik tayyorgarlik

\`\`\`bash
# 1. Node.js o'rnatilganini tekshiring (nodejs.org → LTS)
node --version
npm --version

# 2. Firebase CLI
npm install -g firebase-tools

firebase --version

# 3. Google akkauntga kirish (brauzer ochiladi)
firebase login
\`\`\`

> ⚠️ **Versiya raqamlarini yodlamang.** Darsliklarda "v18.x.x bo'lishi kerak" deb yozilgan bo'lishi mumkin — bu yozilgan paytdagi versiya. Komanda javob bersa — o'rnatilgan, yetarli.

> ⚠️ **Windows'da xato:** \`firebase : File ... cannot be loaded because running scripts is disabled\`.
>
> PowerShell'ni **administrator** sifatida oching va bir marta:
>
> \`\`\`text
> Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
> \`\`\`

---

## ⚙️ firebase init — savollar va javoblar

Loyiha papkasida:

\`\`\`bash
cd loyiha/papkasi
firebase init
\`\`\`

\`\`\`demo h=480 "firebase init — har javob nima qiladi"
<style>
  * { box-sizing: border-box; }
  body { font-family: sans-serif; font-size: 13px; margin: 0; padding: 14px; }

  .term {
    background: #0f172a; color: #cbd5e1; border-radius: 9px;
    padding: 12px; font-family: monospace; font-size: 11.5px;
    line-height: 1.9; min-height: 170px;
    white-space: pre-wrap;
  }
  .term .savol { color: #fbbf24; }
  .term .javob { color: #4ade80; }
  .term .yon { color: #64748b; }

  .qadamlar { display: flex; gap: 5px; flex-wrap: wrap; margin: 12px 0; }
  .qadamlar button {
    padding: 6px 10px; border: 1px solid #d1d5db; background: white;
    border-radius: 6px; font-size: 10.5px; cursor: pointer; font-family: monospace;
  }
  .qadamlar button.faol { background: #6366f1; color: white; border-color: #6366f1; }

  #izoh {
    background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px;
    padding: 11px; font-size: 12px; color: #1e40af; line-height: 1.8; min-height: 78px;
  }
  #izoh code { background: #dbeafe; padding: 1px 5px; border-radius: 3px; font-family: monospace; font-size: 11px; }
  #izoh b { color: #b91c1c; }
</style>

<div class="term" id="term"></div>

<div class="qadamlar" id="qadamlar"></div>

<div id="izoh"></div>

<script>
  var qadamlar = [
    {
      nom: '1. Features',
      savol: '? Which Firebase features do you want to set up?',
      javob: 'Hosting  +  Firestore',
      izoh: "Bo'sh joy (Space) bilan belgilanadi, Enter bilan tasdiqlanadi.<br /><b>Faqat Hosting tanlamang!</b> Firestore ham belgilansin \\u2014 aks holda <code>firebase deploy --only firestore:rules</code> komandasi ishlamaydi va qoidalaringizni terminaldan yuborolmaysiz."
    },
    {
      nom: '2. Project',
      savol: '? Please select an option:',
      javob: 'Use an existing project  \\u2192  loyiha-nomingiz',
      izoh: "Firebase Console'da allaqachon yaratgan loyihangizni tanlang. <code>Create a new project</code> tanlasangiz, Auth va Firestore bo'sh yangi loyihaga ulanasiz va hech narsa ishlamaydi."
    },
    {
      nom: '3. Rules fayli',
      savol: '? What file should be used for Firestore Rules?',
      javob: 'firestore.rules',
      izoh: "6-darsda Console'da yozgan qoidalaringiz shu faylga <b>yuklab olinadi</b>. Endi ular loyihangizda, git'da saqlanadi va <code>firebase deploy</code> bilan yuboriladi."
    },
    {
      nom: '4. Public',
      savol: '? What do you want to use as your public directory?',
      javob: 'public',
      izoh: "<b>Eng muhim savol.</b> Bu papkadagi HAMMA NARSA internetga chiqadi.<br /><code>.</code> (nuqta) yozsangiz \\u2014 butun loyiha papkangiz ochiq bo'ladi: qoralamalar, zaxira nusxalar, shaxsiy qaydlar.<br />Pastda batafsil."
    },
    {
      nom: '5. SPA',
      savol: '? Configure as a single-page app?',
      javob: 'No',
      izoh: "Bizda bir nechta alohida HTML fayl bor (<code>login.html</code>, <code>chat.html</code>). <code>Yes</code> desangiz, barcha manzillar <code>index.html</code> ga yo'naltiriladi va boshqa sahifalar ochilmaydi.<br />React'da (4-Modul) esa <code>Yes</code> kerak bo'ladi."
    },
    {
      nom: '6. GitHub',
      savol: '? Set up automatic builds and deploys with GitHub?',
      javob: 'No',
      izoh: "Bu \\u2014 CI/CD (har git push'da avtomatik deploy). Hozircha shart emas, keyinroq qo'shsa bo'ladi."
    },
    {
      nom: '7. Overwrite',
      savol: '? File public/index.html already exists. Overwrite?',
      javob: 'No',
      izoh: "<b>Bu yerda ehtiyot bo'ling.</b> <code>Yes</code> bossangiz, Firebase o'zining namunaviy sahifasini yozadi va <b>sizning index.html ingiz o'chadi</b>. Har doim <code>No</code>."
    }
  ];

  var termEl = document.querySelector('#term');
  var qEl = document.querySelector('#qadamlar');
  var izohEl = document.querySelector('#izoh');

  function chiz(n) {
    var h = '<span class="yon">$ firebase init</span>\\n\\n';
    for (var i = 0; i <= n; i++) {
      h += '<span class="savol">' + qadamlar[i].savol + '</span>\\n';
      h += '  <span class="javob">\\u203a ' + qadamlar[i].javob + '</span>\\n\\n';
    }
    if (n === qadamlar.length - 1) {
      h += '<span class="javob">\\u2714 Firebase initialization complete!</span>\\n';
    }
    termEl.innerHTML = h;
    termEl.scrollTop = termEl.scrollHeight;

    izohEl.innerHTML = qadamlar[n].izoh;

    var t = qEl.querySelectorAll('button');
    for (var j = 0; j < t.length; j++) {
      t[j].className = (j === n) ? 'faol' : '';
    }
  }

  for (var i = 0; i < qadamlar.length; i++) {
    var b = document.createElement('button');
    b.textContent = qadamlar[i].nom;
    b.dataset.n = i;
    b.addEventListener('click', function () { chiz(Number(this.dataset.n)); });
    qEl.appendChild(b);
  }

  chiz(0);
</script>
\`\`\`

---

## 📁 "public" papkasi — eng muhim qaror

\`firebase init\` "public directory" so'raganda ko'p odam \`.\` (nuqta) yozadi. Bu **butun loyiha papkangizni** internetga chiqaradi.

\`\`\`demo h=420 "Qaysi fayllar internetga chiqadi?"
<style>
  * { box-sizing: border-box; }
  body { font-family: sans-serif; font-size: 13px; margin: 0; padding: 14px; }

  .tanlov { display: flex; gap: 6px; margin-bottom: 12px; }
  .tanlov button {
    padding: 7px 12px; border: 2px solid #d1d5db; background: white;
    border-radius: 7px; font-size: 11px; cursor: pointer; font-family: monospace;
  }
  .tanlov button.faol { border-color: #6366f1; background: #eef2ff; color: #4338ca; font-weight: 700; }

  .fayllar { font-family: monospace; font-size: 11.5px; line-height: 2; }
  .f {
    padding: 2px 8px; border-radius: 5px; margin-bottom: 2px;
    display: flex; gap: 8px;
  }
  .f .holat { flex: 0 0 105px; }
  .chiqdi { background: #fee2e2; color: #991b1b; }
  .chiqmadi { background: #f3f4f6; color: #9ca3af; }
  .ok { background: #dcfce7; color: #166534; }

  #xulosa {
    margin-top: 12px; border-radius: 8px; padding: 11px;
    font-size: 12px; line-height: 1.8;
  }
  .yomon { background: #fef2f2; border: 2px solid #fca5a5; color: #b91c1c; }
  .yaxshi { background: #f0fdf4; border: 2px solid #86efac; color: #15803d; }
</style>

<div class="tanlov">
  <button data-v="nuqta">"public": "."</button>
  <button data-v="papka" class="faol">"public": "public"</button>
</div>

<div class="fayllar" id="fayllar"></div>
<div id="xulosa"></div>

<script>
  // Loyiha papkasidagi fayllar. publicda: public/ ichidami?
  var fayllar = [
    { nom: 'public/index.html',        ichida: true },
    { nom: 'public/chat.html',         ichida: true },
    { nom: 'public/style.css',         ichida: true },
    { nom: 'public/firebase-config.js', ichida: true },
    { nom: 'firestore.rules',          ichida: false },
    { nom: 'qoralama-eski.html',       ichida: false },
    { nom: 'parollar.txt',             ichida: false },
    { nom: 'zaxira/baza-nusxa.json',   ichida: false }
  ];

  var fEl = document.querySelector('#fayllar');
  var xEl = document.querySelector('#xulosa');
  var tugmalar = document.querySelectorAll('.tanlov button');

  function chiz(v) {
    fEl.innerHTML = '';
    for (var i = 0; i < fayllar.length; i++) {
      var f = fayllar[i];
      var chiqdi = (v === 'nuqta') ? true : f.ichida;
      var kerak = f.ichida;

      var d = document.createElement('div');
      d.className = 'f ' + (chiqdi ? (kerak ? 'ok' : 'chiqdi') : 'chiqmadi');

      var h = document.createElement('span');
      h.className = 'holat';
      h.textContent = chiqdi ? '\\u2192 internetda' : '\\u2014 chiqmadi';

      var n = document.createElement('span');
      n.textContent = f.nom;

      d.append(h, n);
      fEl.appendChild(d);
    }

    if (v === 'nuqta') {
      xEl.className = 'yomon';
      xEl.innerHTML =
        '\\u274c <b>Hammasi internetda.</b> Qoralamalaringiz, zaxira nusxalaringiz, ' +
        'shaxsiy qaydlaringiz \\u2014 manzilini bilgan har kim ocha oladi. ' +
        'Qidiruv tizimlari ham topib oladi.';
    } else {
      xEl.className = 'yaxshi';
      xEl.innerHTML =
        '\\u2705 <b>Faqat kerakli fayllar.</b> Loyihaning qolgan qismi kompyuteringizda qoladi. ' +
        '<code>firestore.rules</code> ham chiqmadi \\u2014 u sayt fayli emas, ' +
        'Firebase uni alohida yo\\'l bilan oladi.';
    }

    for (var j = 0; j < tugmalar.length; j++) {
      tugmalar[j].className = (tugmalar[j].dataset.v === v) ? 'faol' : '';
    }
  }

  for (var i = 0; i < tugmalar.length; i++) {
    tugmalar[i].addEventListener('click', function () { chiz(this.dataset.v); });
  }

  chiz('papka');
</script>
\`\`\`

**Shuning uchun:** HTML, CSS, JS fayllarini \`public/\` papkasiga ko'chiring va \`init\` da \`public\` deb javob bering.

\`\`\`text
loyiha/
├── public/              ← faqat shu papka internetga chiqadi
│   ├── index.html
│   ├── chat.html
│   ├── style.css
│   └── firebase-config.js
├── firestore.rules      ← qoidalar (deploy bilan yuboriladi)
├── firebase.json
└── .firebaserc
\`\`\`

---

## 🔐 firebase-config.js ni .gitignore ga qo'shish kerakmi?

Ko'p darsliklarda "albatta qo'shing!" deb yozilgan. **Aslida shart emas** — 1-darsda ko'rgan edik: \`firebaseConfig\` maxfiy emas, u baribir sayt kodida ochiq turadi va uni har kim ko'ra oladi.

Agar \`.gitignore\` ga qo'shsangiz, o'zingizga muammo yaratasiz: boshqa kompyuterdan loyihani klon qilsangiz — ilova ishlamaydi, chunki fayl yo'q.

**Haqiqiy himoya** — Security Rules (6-dars) va Console'dagi **API key restrictions**.

Git'ga **hech qachon** tushmasligi kerak bo'lgan narsalar boshqa:

| Fayl | Nima uchun |
| --- | --- |
| \`serviceAccountKey.json\` | Server kaliti — **hamma qoidalarni chetlab o'tadi** |
| \`.env\` | Server sirlari, to'lov tizimi kalitlari |
| \`node_modules/\` | Kerak emas, juda katta |

\`\`\`text
# .gitignore
node_modules/
.env
serviceAccountKey.json
.firebase/
\`\`\`

---

## 🚀 Deploy

\`\`\`bash
firebase deploy
\`\`\`

\`\`\`text
✔  Deploy complete!

Hosting URL: https://loyiha-nomi.web.app
\`\`\`

Faqat bir qismini yuborish:

\`\`\`bash
firebase deploy --only hosting
firebase deploy --only firestore:rules
\`\`\`

> ⚠️ \`--only firestore:rules\` **faqat** \`firebase init\` da Firestore tanlangan bo'lsa ishlaydi. Faqat Hosting tanlagan bo'lsangiz:
>
> \`\`\`text
> Error: Cannot understand what targets to deploy/serve.
> \`\`\`
>
> Yechim: \`firebase init firestore\` ni qayta ishga tushiring.

---

## 🕐 "Deploy qildim, lekin hech narsa o'zgarmadi"

Bu — deploy'dan keyingi eng ko'p beriladigan savol.

Firebase Hosting statik fayllarga standart holatda **1 soatlik brauzer keshi** qo'yadi. Ya'ni siz yangi \`style.css\` yubordingiz, lekin brauzeringizda eskisi saqlanib turibdi.

**CDN darhol yangilanadi** (Firebase deploy'da uni o'zi tozalaydi), muammo faqat brauzerda.

Tekshirish tartibi:

1. **Hard reload** — \`Ctrl+Shift+R\` (Mac: \`Cmd+Shift+R\`)
2. Baribir eski bo'lsa — **maxfiy oyna** (Incognito)
3. U yerda yangi bo'lsa — demak deploy to'g'ri ketgan, gap keshda

Ishlab chiqish paytida keshni kamaytirish:

\`\`\`json
{
  "hosting": {
    "public": "public",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "headers": [
      {
        "source": "**/*.@(css|js)",
        "headers": [
          { "key": "Cache-Control", "value": "max-age=60" }
        ]
      }
    ]
  }
}
\`\`\`

---

## 🔁 Orqaga qaytarish

Yangi versiyani chiqardingiz va biror narsa buzildi. Vahima qilmang:

**Firebase Console → Hosting → Release history → ⋮ → Rollback**

Bir bosishda oldingi versiya qaytadi. Har deploy saqlanadi.

> 💡 Shuning uchun deploy qilishdan qo'rqmang. Orqaga yo'l har doim bor.

---

## 👀 Ko'rsatishdan oldin sinash

Demo Day'dan oldin sayt ishlayotganiga ishonch hosil qilish uchun:

\`\`\`bash
# Kompyuterda, deploy qilmasdan
firebase serve
\`\`\`

Yoki **preview channel** — vaqtinchalik alohida manzil:

\`\`\`bash
firebase hosting:channel:deploy sinov
\`\`\`

\`\`\`text
Channel URL: https://loyiha-nomi--sinov-a1b2c3.web.app
\`\`\`

Asosiy saytga tegmaydi, 7 kundan keyin o'zi o'chadi. O'qituvchiga ko'rsatish uchun qulay.

---

## 🌍 Custom domen

**Console → Hosting → Add custom domain** → DNS yozuvlarini domen sotib olgan joyda qo'shasiz. SSL 24 soat ichida ulanadi.

> ⚠️ **Muhim:** o'z domeningizni ulaganingizdan keyin **login ishlamay qolishi mumkin**:
>
> \`\`\`text
> auth/unauthorized-domain
> \`\`\`
>
> Sabab: Firebase Auth faqat ro'yxatdagi domenlarga ruxsat beradi. \`.web.app\` avtomatik qo'shilgan, sizning domeningiz esa yo'q.
>
> Yechim: **Console → Authentication → Settings → Authorized domains → Add domain**

---

## 🥉 Bronze Topshiriq

- CLI o'rnating, \`firebase login\`
- \`firebase init\` — **Hosting va Firestore** ikkalasini tanlang
- Fayllarni \`public/\` ga ko'chiring
- \`firebase deploy\`
- Havolani telefoningizda oching

---

## 🥈 Silver Topshiriq

- Barcha sahifalar ishlasin (login, ro'yxatdan o'tish, chat)
- Telefon va kompyuterdan bir vaqtda kirib, real-time chat qiling
- Kodda kichik o'zgarish qiling, qayta deploy qiling, **hard reload** bilan tekshiring

---

## 🥇 Gold Topshiriq

- \`firestore.rules\` loyihada saqlansin va \`firebase deploy --only firestore:rules\` bilan yuborilsin
- \`.gitignore\` to'g'ri sozlangan bo'lsin (\`node_modules\`, \`.env\`, \`serviceAccountKey.json\`)
- \`headers\` bilan kesh sozlansin
- Preview channel yarating va havolasini bering
- Rollback qilib ko'ring va qayta oldingi holatga qaytaring

---

## ✅ Dars Xulosa

\`\`\`bash
npm install -g firebase-tools   # bir marta
firebase login                  # bir marta
firebase init                   # loyiha boshida
firebase deploy                 # har o'zgarishdan keyin
\`\`\`

- \`init\` da **Hosting + Firestore** ikkalasini tanlang
- \`public\` papkasi — **faqat shu papka internetga chiqadi**
- "Overwrite index.html?" → har doim **No**
- \`firebaseConfig\` maxfiy emas; \`serviceAccountKey.json\` — maxfiy
- Deploy'dan keyin o'zgarish ko'rinmasa — **kesh**, hard reload qiling
- **Rollback** Console'da bir bosishda
- Custom domen → **Authorized domains** ga qo'shing

> 🏆 Loyihangiz endi internetda. Havolani yuboring — do'stlaringiz bilan chatlashib ko'ring!
`,
    teacher: `
## 🔴 Notion'dagi ichki ziddiyat

Asl sahifa \`firebase init\` da **faqat Hosting** tanlashni aytadi:

\`\`\`text
? Which Firebase features? → Hosting: Configure files
\`\`\`

Keyin pastda esa:

\`\`\`bash
firebase deploy --only firestore:rules
\`\`\`

**Bu komanda ishlamaydi.** Firestore \`init\` da tanlanmagan bo'lsa, \`firebase.json\` da \`firestore\` bo'limi yo'q va CLI xato beradi:

\`\`\`text
Error: Cannot understand what targets to deploy/serve.
\`\`\`

Ya'ni dars o'zi o'rgatgan komandani ishlamaydigan qilib qo'ygan. Bola buni terminalda ko'radi va nima qilishni bilmaydi.

Darsda \`init\` da **Hosting + Firestore** ikkalasini tanlash ko'rsatildi. Buning qo'shimcha foydasi: \`firestore.rules\` fayli loyihaga yuklab olinadi, ya'ni 6-darsda Console'da yozgan qoidalar endi **git'da** saqlanadi.

---

## 🔴 Xavfsizlik: "public": "."

Asl sahifa \`public directory\` uchun \`. (nuqta yoki public)\` deb yozgan — ya'ni nuqtani birinchi variant sifatida ko'rsatgan.

\`.\` degani — **butun loyiha papkasi internetga chiqadi**. \`ignore\` ro'yxati faqat \`firebase.json\`, nuqtali fayllar va \`node_modules\` ni chiqarib tashlaydi. Qolgan hamma narsa ochiq:

- \`qoralama-eski.html\`, \`test2.html\` kabi ishlanmalar
- \`.txt\` qaydlar, zaxira nusxalar
- Baza eksporti (\`.json\`)
- Kutilmagan joyda qolgan kalit fayllari

Bular hech qayerdan havola qilinmagan, lekin **manzilini bilgan har kim ocha oladi** va qidiruv tizimlari ham topadi.

Darsda \`public/\` papkasi sxemasi va interaktiv demo qo'shildi — bola qaysi fayl internetga chiqishini ko'radi.

---

## ⚠️ Uchinchi: .gitignore ziddiyati

Asl sahifada: \`firebase-config.js ← .gitignore ga qo'shing!\`

Bu **1-darsga to'g'ridan-to'g'ri zid**. U yerda (tuzatilgan holatda) \`firebaseConfig\` maxfiy emasligi, u baribir sayt kodida ochiq turishi va haqiqiy himoya Security Rules ekanligi aytilgan.

Bu bolani chalkashtiradi: "maxfiy emas, lekin yashirish kerakmi?"

Bundan tashqari amaliy zarari bor — boshqa kompyuterda klon qilganda ilova ishlamaydi va sabab tushunarsiz.

Darsda aniq chegara qo'yildi: \`firebaseConfig\` — ochiq; \`serviceAccountKey.json\` va \`.env\` — **hech qachon git'ga tushmasin**. Server kaliti barcha Security Rules'ni chetlab o'tadi, ya'ni u chindan ham xavfli.

---

## 🗒 Qo'shilgan boshqa narsalar

**1. Kesh — "deploy qildim, o'zgarmadi"**

Firebase Hosting statik fayllarga standart **1 soatlik brauzer keshi** qo'yadi. CDN deploy'da avtomatik tozalanadi, lekin brauzer eski faylni ushlab turadi.

Bu deploy'dan keyingi eng ko'p beriladigan savol va asl sahifada umuman yo'q. Bola kodini qayta-qayta tekshiradi, holbuki kod to'g'ri.

Tartib: hard reload → incognito → \`headers\` bilan kesh muddatini kamaytirish.

**2. Rollback**

Har deploy Console'da saqlanadi va bir bosishda qaytariladi. Bu psixologik jihatdan muhim: bola deploy qilishdan qo'rqmaydi.

**3. Preview channel**

\`firebase hosting:channel:deploy sinov\` — vaqtinchalik manzil, asosiy saytga tegmaydi, 7 kunda o'chadi. Demo Day va sizga ko'rsatish uchun juda qulay.

**4. auth/unauthorized-domain**

Asl sahifa custom domenni DNS darajasida tushuntiradi, lekin **login buzilishini** aytmaydi. Domen ulangandan keyin Authentication → Authorized domains ga qo'shilmasa, kirish ishlamaydi. \`.web.app\` avtomatik qo'shilgani uchun bu faqat custom domenda chiqadi — ya'ni hammasi ishlab turgan paytda birdan.

**5. "Overwrite index.html? → No"**

Asl sahifada bor, lekin oddiy qator sifatida. Darsda ta'kidlandi: \`Yes\` bossa, bola o'z sahifasini yo'qotadi.

**6. Windows ExecutionPolicy**

\`npm install -g\` dan keyin Windows'da \`firebase\` komandasi ishlamasligi mumkin. Bu darsning eng birinchi to'sig'i va asl sahifada yo'q.

**7. Versiya raqamlari**

\`node v18.x.x\`, \`firebase-tools 13.x.x\` qattiq yozilgan. Bola o'zida boshqa raqam ko'rsa "noto'g'ri o'rnatdim" deb o'ylaydi.

---

## 💡 O'qituvchi uchun

- **Bu dars — modulning hissiy cho'qqisi.** Bola havolani telefoniga yuboradi, ota-onasiga ko'rsatadi. Shu lahza uchun vaqt ajrating: hamma deploy qilib bo'lgach, havolalarni guruh chatiga tashlab, bir-birining saytiga kirib ko'ringlar.
- **CLI birinchi to'siq.** Ko'pchilik shu yerda qotadi: PATH, ExecutionPolicy, \`npm\` topilmadi. Darsning birinchi 20 daqiqasini shunga ajrating va hamma \`firebase --version\` javob berganiga ishonch hosil qiling — keyin davom eting.
- **\`public/\` ga ko'chirishni birga qiling.** Fayllar ko'chgach nisbiy yo'llar buzilishi mumkin (\`./style.css\` ishlaydi, \`../style.css\` yo'q). Konsolda 404 ko'rsating.
- **Keshni ataylab ko'rsating.** Deploy qiling, fon rangini o'zgartiring, qayta deploy qiling — o'zgarmaydi. Keyin hard reload. Bu bir marta ko'rilsa, kelajakda soatlab vaqt tejaydi.
- **Rollback'ni sinab ko'ring.** Ataylab buzilgan versiyani yuboring, keyin qaytaring.

## ⚠️ Ko'p uchraydigan xatolar

- **\`firebase\` topilmadi** — \`npm install -g\` dan keyin terminalni **qayta oching**. Windows'da ExecutionPolicy.
- **Noto'g'ri papkada \`init\`** — \`cd\` qilinmagan. \`firebase.json\` boshqa joyda paydo bo'ladi.
- **"Overwrite? → Yes"** — o'z sahifasi o'chgan.
- **\`--only firestore:rules\` xato beradi** — \`init\` da Firestore tanlanmagan.
- **Deploy'dan keyin oq sahifa** — \`public\` papkasida \`index.html\` yo'q, yoki fayllar ko'chirilmagan.
- **404 CSS/JS** — \`public/\` ga ko'chirishdan keyin nisbiy yo'llar buzilgan.
- **"O'zgarish ko'rinmayapti"** — kesh.
- **Boshqa loyihaga deploy** — \`init\` da noto'g'ri loyiha tanlangan. \`.firebaserc\` ni tekshiring.
- **\`auth/unauthorized-domain\`** — custom domen Authorized domains'da yo'q.

## 📊 Daraja belgilash

- **Bronze** — sayt \`.web.app\` da ochiladi, telefonda ham ishlaydi
- **Silver** — barcha sahifalar ishlaydi, ikki qurilmada real-time chat, qayta deploy qilingan
- **Gold** — \`firestore.rules\` loyihada va deploy qilingan, \`.gitignore\` to'g'ri, kesh sozlangan, preview channel bor

> **Tekshirish usuli:** bolaning \`.web.app\` manziliga \`/firestore.rules\` yoki \`/qoralama.html\` qo'shib ochib ko'ring.
> Fayl ochilsa — \`"public": "."\` qilingan, Gold berilmaydi.
> 404 chiqsa — to'g'ri.
>
> Ikkinchi tekshiruv: Console → Hosting → Release history'da bir nechta versiya bormi? Bo'lsa — qayta deploy qilingan.
`,
  },

  // ═══════════════════════════════════════════════════════════
  'junior.m3.l6': {
    goal: "Security Rules yozish, Rules Playground'da sinash va 'qoidalar filtr emas' qoidasini tushunish.",
    student: `
## 🛡️ Nima uchun kerak?

Shu paytgacha Firestore **Test mode**'da ishladi — ya'ni **hamma narsa ochiq**.

Bu qanchalik jiddiy? Sizning \`firebaseConfig\` sahifa kodida turibdi (1-darsda ko'rgan edik — bu normal). Demak har kim uni ko'chirib olib, o'z konsolida shunday yozishi mumkin:

\`\`\`javascript
await deleteDoc(doc(db, 'users', 'boshqa-odamning-id'));
\`\`\`

Test mode'da bu **ishlaydi**. Hammaning ma'lumotini o'chirib tashlaydi.

> 💡 1-darsda "API kalit maxfiy emas" deganimizni eslaysizmi? Mana **haqiqiy** himoya shu yerda — Security Rules. Kalitni yashirish emas, **qoidalar yozish**.

---

## 📝 Qoidalar qayerda?

**Firebase Console → Firestore Database → Rules**

\`\`\`javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    match /{document=**} {
      allow read, write: if false;   // hamma narsa yopiq
    }

  }
}
\`\`\`

Standart holat — **yopiq**. Siz faqat **ruxsat** qo'shasiz, taqiq qo'shmaysiz.

> ⚠️ **Publish** bosgandan keyin o'zgarish kuchga kirishi uchun bir daqiqagacha vaqt ketadi. Darhol sinab ko'rib "ishlamadi" degan xulosaga kelmang — biroz kuting.

---

## 🎮 Qoidalar qanday ishlaydi — sinab ko'ring

\`\`\`demo h=520 "Rules simulyatori"
<style>
  * { box-sizing: border-box; }
  body { font-family: sans-serif; font-size: 13px; margin: 0; padding: 14px; }

  .qatorlar { display: grid; grid-template-columns: auto 1fr; gap: 8px 10px; align-items: center; }
  label { font-size: 11px; color: #6b7280; font-family: monospace; }
  select {
    padding: 6px 8px; font-size: 11px; border: 2px solid #d1d5db;
    border-radius: 6px; outline: none; font-family: monospace; width: 100%;
  }
  select:focus { border-color: #6366f1; }

  .qoida {
    margin-top: 12px; background: #1e293b; color: #e2e8f0;
    border-radius: 8px; padding: 10px; font-family: monospace;
    font-size: 10.5px; line-height: 1.7; white-space: pre;
    overflow-x: auto;
  }
  .qoida .yon { color: #64748b; }
  .qoida .kalit { color: #f472b6; }
  .qoida .faol { background: #334155; border-radius: 3px; }

  #natija {
    margin-top: 12px; border-radius: 8px; padding: 12px;
    font-size: 12px; line-height: 1.7;
  }
  .ruxsat { background: #f0fdf4; border: 2px solid #86efac; color: #15803d; }
  .taqiq  { background: #fef2f2; border: 2px solid #fca5a5; color: #b91c1c; }
  #natija code { background: rgba(0,0,0,.07); padding: 1px 4px; border-radius: 3px; font-family: monospace; font-size: 11px; }
</style>

<div class="qatorlar">
  <label>Kim:</label>
  <select id="kim">
    <option value="yoq">Kirmagan (request.auth = null)</option>
    <option value="ali" selected>Ali (uid: ali_123)</option>
    <option value="vali">Vali (uid: vali_456)</option>
  </select>

  <label>Amal:</label>
  <select id="amal">
    <option value="read">read — o'qish</option>
    <option value="create">create — yaratish</option>
    <option value="update">update — o'zgartirish</option>
    <option value="delete">delete — o'chirish</option>
  </select>

  <label>Hujjat:</label>
  <select id="hujjat">
    <option value="ali">/messages/m1 — egasi Ali</option>
    <option value="vali">/messages/m2 — egasi Vali</option>
  </select>
</div>

<div class="qoida" id="qoidaEl"></div>
<div id="natija"></div>

<script>
  var kim = document.querySelector('#kim');
  var amal = document.querySelector('#amal');
  var hujjat = document.querySelector('#hujjat');
  var qoidaEl = document.querySelector('#qoidaEl');
  var natija = document.querySelector('#natija');

  var uidlar = { yoq: null, ali: 'ali_123', vali: 'vali_456' };
  var egalar = { ali: 'ali_123', vali: 'vali_456' };

  // Qoida matni: qaysi qator qaysi amalga tegishli
  var qatorlar = [
    { t: 'match /messages/{messageId} {', a: null },
    { t: '  allow read:   if request.auth != null;', a: 'read' },
    { t: '  allow create: if request.auth != null', a: 'create' },
    { t: '                && request.resource.data.uid == request.auth.uid;', a: 'create' },
    { t: '  allow update: if false;', a: 'update' },
    { t: '  allow delete: if request.auth != null', a: 'delete' },
    { t: '                && resource.data.uid == request.auth.uid;', a: 'delete' },
    { t: '}', a: null }
  ];

  function qochir(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function hisobla() {
    var uid = uidlar[kim.value];
    var ega = egalar[hujjat.value];
    var a = amal.value;

    var ruxsat = false;
    var sabab = '';

    if (a === 'read') {
      ruxsat = uid !== null;
      sabab = uid !== null
        ? 'Kirgan foydalanuvchi \\u2014 <code>request.auth != null</code> rost.'
        : 'Kirmagan \\u2014 <code>request.auth</code> bu <code>null</code>.';
    } else if (a === 'create') {
      // Yangi xabar har doim o'z uid'i bilan yaratiladi
      ruxsat = uid !== null;
      sabab = uid !== null
        ? "Kirgan va yangi hujjatdagi <code>uid</code> o'ziniki. DIQQAT: bu yerda <code>request.resource</code> \\u2014 hali yozilmagan yangi hujjat."
        : 'Kirmagan \\u2014 yaratish mumkin emas.';
    } else if (a === 'update') {
      ruxsat = false;
      sabab = "Qoidada <code>allow update: if false</code> \\u2014 xabarlarni tahrirlash umuman taqiqlangan. Kim bo'lishidan qat'i nazar.";
    } else if (a === 'delete') {
      if (uid === null) {
        ruxsat = false;
        sabab = 'Kirmagan \\u2014 <code>request.auth</code> bu <code>null</code>.';
      } else if (uid === ega) {
        ruxsat = true;
        sabab = "Hujjatdagi <code>resource.data.uid</code> foydalanuvchi uid'iga teng \\u2014 u egasi.";
      } else {
        ruxsat = false;
        sabab = "Hujjat egasi boshqa odam. <code>resource.data.uid</code> (" + ega + ") \\u2260 <code>request.auth.uid</code> (" + uid + ").";
      }
    }

    // Qoidani chizish, tegishli qatorni ajratish
    var html = '';
    for (var i = 0; i < qatorlar.length; i++) {
      var q = qochir(qatorlar[i].t);
      q = q.replace(/\\b(allow|if|match)\\b/g, '<span class="kalit">$1</span>');
      html += qatorlar[i].a === a ? '<span class="faol">' + q + '</span>\\n' : q + '\\n';
    }
    qoidaEl.innerHTML = html;

    natija.className = ruxsat ? 'ruxsat' : 'taqiq';
    natija.innerHTML =
      (ruxsat ? '\\u2705 Simulated allow' : '\\u274c Simulated deny \\u2014 permission-denied') +
      '<br />' + sabab;
  }

  kim.addEventListener('change', hisobla);
  amal.addEventListener('change', hisobla);
  hujjat.addEventListener('change', hisobla);
  hisobla();
</script>
\`\`\`

Sinab ko'ring: **Ali** bo'lib **Vali**ning xabarini o'chirmoqchi bo'ling. Taqiqlanadi. Endi Vali bo'ling — ruxsat beriladi.

---

## 🔑 Uchta asosiy o'zgaruvchi

| O'zgaruvchi | Nima | Qachon bor |
| --- | --- | --- |
| \`request.auth\` | Kim so'rayapti | Kirgan bo'lsa; aks holda \`null\` |
| \`resource.data\` | Bazadagi **mavjud** hujjat | \`read\`, \`update\`, \`delete\` |
| \`request.resource.data\` | **Yozilmoqchi** bo'lgan yangi hujjat | \`create\`, \`update\` |

> ⚠️ **Eng ko'p uchraydigan xato:** \`create\` da \`resource.data\` ishlatish.
>
> Yaratish paytida hujjat hali **yo'q**, demak \`resource\` bu \`null\`. Qoida xatoga uchraydi va **taqiqlanadi**.
>
> \`\`\`javascript
> // ❌ create hech qachon ishlamaydi
> allow create: if resource.data.uid == request.auth.uid;
>
> // ✅
> allow create: if request.resource.data.uid == request.auth.uid;
> \`\`\`

Shuni ham eslang: \`allow write\` = \`create\` + \`update\` + \`delete\` uchalasi birdan. Shuning uchun \`write\` ichida \`resource.data\` yozsangiz — yaratish buziladi. Aniqlik uchun ularni **alohida** yozgan ma'qul.

---

## 🚨 Eng katta tuzoq: qoidalar filtr emas

Bu — Firestore'dagi eng ko'p adashtiradigan narsa, shuning uchun alohida to'xtaymiz.

Tabiiy o'ylash shunday: "qoidada faqat o'z xabarlarimni o'qishga ruxsat berdim, demak \`getDocs(collection(db, 'messages'))\` menga faqat **mening** xabarlarimni qaytaradi".

**Bu noto'g'ri.** So'rov butunlay **rad etiladi**.

Firestore so'rovni **har bir hujjatni tekshirib** bajarmaydi — u so'rovning **o'zini** tekshiradi: "bu so'rov qoidaga zid hujjat qaytarishi **mumkinmi**?" Agar mumkin bo'lsa — hammasi rad etiladi.

\`\`\`javascript
// Qoida:
// allow read: if resource.data.uid == request.auth.uid;

// ❌ permission-denied — so'rov boshqaning xabarini ham qaytarishi MUMKIN
const snap = await getDocs(collection(db, 'messages'));

// ✅ ishlaydi — so'rovning o'zi qoidaga mos
const q = query(collection(db, 'messages'), where('uid', '==', user.uid));
const snap = await getDocs(q);
\`\`\`

**Qoida:** qoidada qanday cheklov bo'lsa, so'rovda ham **aynan shu cheklov** \`where\` bilan yozilishi kerak.

\`\`\`demo h=400 "Qoidalar filtr emas"
<style>
  * { box-sizing: border-box; }
  body { font-family: sans-serif; font-size: 13px; margin: 0; padding: 14px; }

  .qoida {
    background: #1e293b; color: #e2e8f0; border-radius: 8px;
    padding: 9px 11px; font-family: monospace; font-size: 11px; margin-bottom: 12px;
  }
  .qoida span { color: #64748b; }

  .variant { border: 2px solid #e5e7eb; border-radius: 10px; padding: 10px; margin-bottom: 10px; }
  .variant pre {
    margin: 0 0 8px; font-family: monospace; font-size: 11px;
    background: #f9fafb; padding: 8px; border-radius: 6px;
    white-space: pre-wrap; line-height: 1.6;
  }
  button {
    padding: 6px 11px; border: none; border-radius: 6px;
    font-size: 11px; cursor: pointer; color: white;
    background: #6366f1; font-family: monospace;
  }
  .javob { margin-top: 8px; font-size: 11.5px; min-height: 40px; line-height: 1.7; }
  .ok { color: #15803d; }
  .xato { color: #b91c1c; }
  .javob ul { margin: 5px 0 0; padding-left: 18px; font-family: monospace; font-size: 11px; color: #374151; }
</style>

<div class="qoida">
  <span>// Qoida:</span><br />
  allow read: if resource.data.uid == request.auth.uid;
</div>

<div class="variant">
  <pre>getDocs(collection(db, 'messages'))</pre>
  <button data-v="1">Ishga tushirish</button>
  <div class="javob" id="j1"></div>
</div>

<div class="variant">
  <pre>getDocs(query(
  collection(db, 'messages'),
  where('uid', '==', user.uid)
))</pre>
  <button data-v="2">Ishga tushirish</button>
  <div class="javob" id="j2"></div>
</div>

<script>
  var tugmalar = document.querySelectorAll('button');

  for (var i = 0; i < tugmalar.length; i++) {
    tugmalar[i].addEventListener('click', function () {
      var v = this.dataset.v;
      var el = document.querySelector('#j' + v);
      el.innerHTML = '<span style="color:#6b7280">Yuborilmoqda...</span>';

      setTimeout(function () {
        if (v === '1') {
          el.innerHTML =
            '<span class="xato">\\u274c FirebaseError: Missing or insufficient permissions.</span><br />' +
            "So'rov <b>boshqa odamning</b> xabarini ham qaytarishi mumkin edi. " +
            'Firestore hujjatlarni birma-bir tekshirmaydi \\u2014 butun so\\'rovni rad etadi.';
        } else {
          el.innerHTML =
            '<span class="ok">\\u2705 2 ta hujjat keldi</span>' +
            '<ul><li>m1 \\u2014 "Salom"</li><li>m3 \\u2014 "Qalaysan?"</li></ul>' +
            "<span style=\\"color:#6b7280\\">So'rovdagi <b>where</b> qoidadagi cheklov bilan bir xil.</span>";
        }
      }, 500);
    });
  }
</script>
\`\`\`

---

## 📋 Loyiha uchun to'liq qoidalar

\`\`\`javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    function kirgan() {
      return request.auth != null;
    }

    function egasi(uid) {
      return kirgan() && request.auth.uid == uid;
    }

    match /users/{userId} {
      allow read:   if kirgan();
      allow create: if egasi(userId);
      allow update: if egasi(userId);
      allow delete: if false;
    }

    match /messages/{messageId} {
      allow read: if kirgan();

      allow create: if kirgan()
                    && request.resource.data.uid == request.auth.uid
                    && request.resource.data.matn is string
                    && request.resource.data.matn.size() > 0
                    && request.resource.data.matn.size() <= 500;

      allow update: if false;

      allow delete: if kirgan()
                    && resource.data.uid == request.auth.uid;
    }

  }
}
\`\`\`

Uch narsaga e'tibor bering:

1. \`egasi()\` ichida \`kirgan()\` ham tekshiriladi — \`request.auth\` \`null\` bo'lsa \`.uid\` o'qib bo'lmaydi
2. \`matn is string\` — turni tekshirish. Aks holda kimdir \`matn\` o'rniga massiv yuborishi mumkin
3. \`.size() <= 500\` — uzunlik chegarasi. Aks holda 10 MB matn yuborib bazani to'ldirishadi

> 💡 Qoida bu — **oxirgi devor**. JavaScript'dagi tekshiruvlarni har kim aylanib o'tishi mumkin (konsol ochiq turibdi). Qoida esa **serverda** ishlaydi — uni aylanib o'tib bo'lmaydi.

---

## 🧪 Rules Playground

**Firebase Console → Firestore → Rules → Rules Playground**

Qoidani yozgandan keyin **publish qilmasdan** sinash mumkin:

1. **Simulation type** — \`get\` / \`create\` / \`update\` / \`delete\`
2. **Location** — \`/messages/test123\`
3. **Authentication** — yoqing va uid kiriting
4. **Data** — test hujjat (JSON)
5. **Run** → *Simulated allow* yoki *Simulated deny*

Yuqoridagi demo aynan shuning soddalashtirilgan ko'rinishi.

---

## ⚠️ Test mode 30 kunda o'ladi

Firestore yaratganda tanlagan **Test mode** vaqtinchalik:

\`\`\`javascript
allow read, write: if request.time < timestamp.date(2026, 4, 20);
\`\`\`

Sana o'tgach — **hamma narsa taqiqlanadi**. Ilova birdan ishlamay qoladi, kod esa o'zgarmagan.

Xato: \`FirebaseError: Missing or insufficient permissions.\`

> Bu 3-4 hafta ishlagan loyihalarda birdan chiqadi va sabab topish qiyin, chunki **siz hech narsani o'zgartirmagansiz**. Qoidalarni bugun yozib qo'ying.

---

## 🥉 Bronze Topshiriq

- Test mode qoidasini almashtiring: faqat kirganlar o'qiy va yoza olsin
- **Publish** bosing, bir daqiqa kuting
- Chiqib (\`signOut\`) sahifani ochib ko'ring → xato chiqishi kerak

---

## 🥈 Silver Topshiriq

- \`messages\` uchun: o'chirishni **faqat egasiga** ruxsat bering
- Rules Playground'da ikkita uid bilan sinang: biri ruxsat, biri taqiq olsin
- Xato callback'i (5-dars) foydalanuvchiga ko'rinadigan xabar chiqarsin

---

## 🥇 Gold Topshiriq

- Yuqoridagi to'liq qoidalarni qo'llang (uzunlik + tur tekshiruvi bilan)
- Konsoldan boshqa odamning xabarini o'chirishga **urinib ko'ring** va rad etilishini ko'rsating
- \`users\` da faqat \`ism\` va \`bio\` o'zgarishiga ruxsat bering:

\`\`\`javascript
allow update: if egasi(userId)
              && request.resource.data.diff(resource.data)
                 .affectedKeys().hasOnly(['ism', 'bio']);
\`\`\`

---

## ✅ Dars Xulosa

- Standart holat — **yopiq**; siz faqat ruxsat qo'shasiz
- \`request.auth\` — kim; \`resource.data\` — mavjud hujjat; \`request.resource.data\` — yangi hujjat
- \`create\` da \`resource\` **yo'q** — \`request.resource\` ishlating
- \`allow write\` = create + update + delete; alohida yozgan aniqroq
- **Qoidalar filtr emas** — so'rovdagi \`where\` qoidaga mos bo'lishi kerak
- Test mode **30 kunda** o'ladi
- **Publish** dan keyin bir daqiqa kuting
- Qoida serverda ishlaydi — uni aylanib o'tib bo'lmaydi

> 🚀 **Keyingi dars:** Firebase Hosting — saytni internetga chiqaramiz!
`,
    teacher: `
## 🚨 Notion'da yo'q eng muhim narsa: "qoidalar filtr emas"

Asl sahifa qoidalarni to'g'ri o'rgatadi, lekin **birorta joyda** aytmaydi: qoidada cheklov qo'ysangiz, **so'rovda ham aynan shu cheklovni** yozish kerak.

Bola darsdan keyin shunday qiladi:

\`\`\`javascript
// Qoida
allow read: if resource.data.uid == request.auth.uid;

// Kod
const snap = await getDocs(collection(db, 'messages'));
\`\`\`

Va \`Missing or insufficient permissions\` oladi.

U o'ylaydi: "qoidam noto'g'ri". Qoidani o'zgartiradi. Yana ishlamaydi. Rules Playground'da sinaydi — **u yerda ishlaydi** (chunki Playground bitta hujjatni tekshiradi, so'rovni emas). Bu yerda bola butunlay adashadi.

Firebase hujjatlarining aniq formulasi: *"Security rules are not filters... If a query could potentially return documents that the client does not have permission to read, the entire request fails."*

Ya'ni Firestore hujjatlarni birma-bir tekshirmaydi — **so'rovning o'zini** tekshiradi. So'rov qoidaga zid hujjat qaytarishi *mumkin* bo'lsa, hammasi rad etiladi.

Yechim: \`where('uid', '==', user.uid)\`.

Darsga alohida bo'lim va interaktiv demo qo'shildi.

**Darsda:** ataylab shu xatoni qildiring. Playground'da ishlashi, kodda ishlamasligi — eng kuchli tushuntirish.

---

## ⚠️ Ikkinchi bo'shliq: create da resource yo'q

Asl sahifada \`request.resource\` va \`resource\` farqi jadval ko'rinishida berilgan, lekin **nima uchun muhimligi** aytilmagan.

\`create\` paytida hujjat hali mavjud emas → \`resource\` bu \`null\` → \`resource.data.uid\` xatoga uchraydi → **taqiqlanadi**.

Bola yozadi:

\`\`\`javascript
allow write: if resource.data.uid == request.auth.uid;
\`\`\`

O'chirish ishlaydi, **yaratish ishlamaydi**. Bu juda chalkash holat, chunki qoida "qisman" ishlagandek ko'rinadi.

Shu bilan bog'liq: \`allow write\` = \`create\` + \`update\` + \`delete\`. Darsda ularni **alohida** yozish tavsiya qilindi.

---

## ⚠️ Uchinchi: request.auth null bo'lganda

Asl sahifadagi ba'zi qoidalar:

\`\`\`javascript
allow read, write: if request.auth.uid == userId;
allow update: if isOwner(userId);
\`\`\`

\`request.auth\` \`null\` bo'lsa \`.uid\` o'qish xatoga uchraydi. Firestore buni **deny** deb hisoblaydi, ya'ni natija xavfsiz — lekin qoida "nima uchun rad etildi" degan savolni chalkashtiradi va Playground'da tushunarsiz xato beradi.

Darsda \`egasi()\` funksiyasi ichiga \`kirgan()\` tekshiruvi qo'shildi.

---

## 🗒 Qo'shilgan boshqa narsalar

- **Publish kechikishi** — o'zgarish kuchga kirishi uchun bir daqiqagacha vaqt ketadi. Bola darhol sinab "ishlamadi" deb qoidani buzib tashlaydi.
- **Test mode 30 kunda o'ladi** — asl sahifada "Production'da yoping" deyilgan, lekin **avtomatik o'lishi** aytilmagan. Bu 3-4 haftalik loyihada birdan chiqadi va sabab topish juda qiyin: kod o'zgarmagan, ilova esa ishlamayapti.
- **\`matn is string\`** — tur tekshiruvi asl sahifada bor, lekin nima uchun kerakligi aytilmagan (kimdir \`matn\` o'rniga obyekt yuborishi mumkin).
- **\`request.method\`** o'zgaruvchisi asl sahifada ro'yxatda bor, lekin misolda ishlatilmagan — chalg'itmaslik uchun darsdan chiqarildi.

---

## 💡 O'qituvchi uchun

- **Boshlashning eng yaxshi yo'li — hujum.** Bolaning ilovasini oching, konsolda \`deleteDoc\` bilan uning xabarini o'chiring. U ekranda o'chganini ko'radi. Shundan keyin "nega kerak" degan savol qolmaydi.
- Bu dars **1-darsni yopadi.** U yerda "API kalit maxfiy emas" dedik va bola savolsiz qoldi: "unda nima himoya qiladi?" Javob shu yerda. Bu bog'lanishni ochiq ayting.
- **Rules Playground'ni birga oching.** Bola qoidani o'zgartirib, natijani darhol ko'radi — publish qilmasdan. Bu eng tez qaytar aloqa.
- **Playground chegarasini ham ayting:** u bitta hujjatni tekshiradi, so'rovni emas. Shuning uchun "filtr emas" xatosi Playground'da ko'rinmaydi.
- Qoidani \`git\` ga qo'shish haqida eslating: \`firestore.rules\` faylini loyihada saqlash mumkin (7-dars, Hosting/CLI).

## ⚠️ Ko'p uchraydigan xatolar

- **So'rovda \`where\` yo'q** — "filtr emas" tuzog'i. Eng ko'p vaqt yo'qotadigan xato.
- **\`create\` da \`resource\`** — yaratish ishlamaydi, o'chirish ishlaydi.
- **\`allow write\` bilan hammasini qamrab olish** — yuqoridagi xatoga olib keladi.
- **Publish bosilmagan** — qoida yozilgan, saqlanmagan. Console'da sariq ogohlantirish turadi.
- **Publish'dan keyin darhol sinash** — bir daqiqa kuting.
- **\`match /{document=**}\` ni olib tashlamaslik** — test mode qoidasi pastda qolib, hamma narsani ochib turishi mumkin. Qoidalar **birlashadi**: bittasi ruxsat bersa — ruxsat beriladi. Taqiq qo'shib bo'lmaydi, faqat ruxsatni **olib tashlash** mumkin.
- **Listener yopilmagan** — \`signOut\` dan keyin eski \`onSnapshot\` \`permission-denied\` yog'diradi (5-dars).

## 📊 Daraja belgilash

- **Bronze** — qoida yozilgan, publish qilingan, chiqqandan keyin xato chiqadi
- **Silver** — o'chirish faqat egasiga; Playground'da ikki uid bilan sinalgan
- **Gold** — uzunlik + tur tekshiruvi; boshqaning xabarini o'chirish urinishi rad etilgani **ko'rsatilgan**

> **Tekshirish usuli:** bolaning ilovasini o'z akkauntingiz bilan oching, konsolda uning xabarini \`deleteDoc\` bilan o'chirishga urining.
> O'chsa — qoida yo'q yoki noto'g'ri.
> \`permission-denied\` chiqsa — ishlayapti.
>
> Ikkinchi tekshiruv: \`getDocs(collection(db, 'messages'))\` \`where\` siz ishlayaptimi? Agar ishlasa va qoidada \`uid\` cheklovi bo'lsa — demak qoida aslida cheklamayapti.
`,
  },

  // ═══════════════════════════════════════════════════════════
  'junior.m3.l5': {
    goal: "onSnapshot bilan real-time yangilanish, unsubscribe va XSS xavfsizligi.",
    student: `
## ⚡ Real-Time nima?

Oldingi darsda \`getDocs\` ishlatdik. U **bir marta** o'qiydi. Do'stingiz yangi xabar yozsa — siz bilmaysiz, sahifani yangilashingiz kerak.

\`onSnapshot\` boshqacha: **server o'zi xabar beradi**.

\`\`\`demo h=380 "getDocs va onSnapshot farqi"
<style>
  * { box-sizing: border-box; }
  body { font-family: sans-serif; font-size: 13px; margin: 0; padding: 14px; }

  .panel { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .quti { border: 2px solid #e5e7eb; border-radius: 10px; padding: 10px; }
  .quti h4 { margin: 0 0 8px; font-size: 12px; font-family: monospace; }
  .quti.snap { border-color: #16a34a; }
  .quti.snap h4 { color: #16a34a; }
  .quti.get h4 { color: #6b7280; }

  .royxat {
    background: #f9fafb; border-radius: 7px; padding: 8px;
    min-height: 110px; font-size: 11px; font-family: monospace;
  }
  .royxat div { padding: 2px 0; }
  .yangi { color: #16a34a; font-weight: 700; }

  button {
    padding: 7px 12px; border: none; border-radius: 7px;
    font-size: 11px; cursor: pointer; color: white; font-family: monospace;
  }
  .asosiy { background: #7c3aed; }
  .kulrang { background: #6b7280; }

  .tepa { margin-bottom: 12px; display: flex; gap: 6px; align-items: center; }
  .server { font-size: 11px; color: #6b7280; font-family: monospace; }
  .eski { margin-top: 6px; font-size: 10px; color: #dc2626; font-family: monospace; min-height: 14px; }
</style>

<div class="tepa">
  <button id="yubor" class="asosiy">Serverga xabar qo'shish</button>
  <span class="server">← boshqa odam yozdi deb tasavvur qiling</span>
</div>

<div class="panel">
  <div class="quti get">
    <h4>getDocs (bir marta)</h4>
    <div class="royxat" id="getR"></div>
    <div class="eski" id="eskiBelgi"></div>
    <button id="qayta" class="kulrang" style="margin-top:6px">getDocs() qayta chaqirish</button>
  </div>

  <div class="quti snap">
    <h4>onSnapshot (avtomatik)</h4>
    <div class="royxat" id="snapR"></div>
    <div class="eski" style="color:#16a34a" id="snapBelgi"></div>
  </div>
</div>

<script>
  var server = ['Salom'];
  var getNusxa = ['Salom'];
  var son = 1;
  var yangiMatn = null;

  function chiz(el, royxat) {
    el.innerHTML = '';
    for (var i = 0; i < royxat.length; i++) {
      var d = document.createElement('div');
      d.textContent = '• ' + royxat[i];
      if (royxat[i] === yangiMatn) d.className = 'yangi';
      el.appendChild(d);
    }
  }

  var getR = document.querySelector('#getR');
  var snapR = document.querySelector('#snapR');
  var eskiBelgi = document.querySelector('#eskiBelgi');
  var snapBelgi = document.querySelector('#snapBelgi');

  function hammasi() {
    chiz(getR, getNusxa);
    chiz(snapR, server);
    var farq = server.length - getNusxa.length;
    eskiBelgi.textContent = farq > 0 ? '⚠ eskirgan — ' + farq + ' ta xabar yetishmayapti' : '';
  }

  document.querySelector('#yubor').addEventListener('click', function () {
    son++;
    var matn = 'Xabar ' + son;
    server.push(matn);
    yangiMatn = matn;

    snapBelgi.textContent = '✓ listener ishga tushdi';
    setTimeout(function () { snapBelgi.textContent = ''; }, 1500);

    hammasi();
  });

  document.querySelector('#qayta').addEventListener('click', function () {
    getNusxa = server.slice();
    hammasi();
  });

  hammasi();
</script>
\`\`\`

Chap tomonda **qo'lda** yangilash kerak. O'ng tomonda — o'zi. Chatda bu farq hal qiluvchi.

> 💡 Texnik jihatdan bu **WebSocket** ulanishi: brauzer bilan server o'rtasida doimiy "quvur" ochiq turadi.

---

## 🔔 onSnapshot asosi

\`\`\`javascript
const q = query(collection(db, 'messages'), orderBy('vaqt', 'asc'));

const unsubscribe = onSnapshot(q, (snapshot) => {
  snapshot.forEach(docSnap => {
    console.log(docSnap.id, docSnap.data());
  });
});
\`\`\`

Uch narsani eslab qoling:

1. Callback **darhol** bir marta chaqiriladi (mavjud ma'lumot bilan)
2. Keyin **har o'zgarishda** yana chaqiriladi
3. \`onSnapshot\` **funksiya qaytaradi** — uni saqlang

---

## 🛑 unsubscribe — eng ko'p unutiladigan narsa

\`\`\`javascript
const unsubscribe = onSnapshot(q, callback);

// Kerak bo'lmaganda:
unsubscribe();
\`\`\`

Nima uchun muhim?

| Chaqirilmasa | Natija |
| --- | --- |
| Sahifa almashdi | Eski listener ishlayveradi |
| Chiqib ketdi (signOut) | \`permission-denied\` xatolari |
| Bir necha marta ochildi | **Nusxa listenerlar** — xabar 2–3 marta ko'rinadi |

> ⚠️ **Eng ko'p uchraydigan xato:** \`onAuthStateChanged\` ichida \`onSnapshot\` chaqirish va uni himoyalamaslik. Auth holati ikki marta o'zgarsa — **ikkita listener** hosil bo'ladi va har xabar ikki marta chiziladi.
>
> Yechim: yangi listener ochishdan oldin eskisini yoping:
>
> \`\`\`javascript
> let unsubscribe = null;
>
> onAuthStateChanged(auth, (user) => {
>   if (unsubscribe) unsubscribe();   // eskisini yop
>   unsubscribe = user ? onSnapshot(q, chiz) : null;
> });
> \`\`\`

---

## 🔴 XSS — chatdagi eng xavfli xato

Ko'p darsliklarda shunday yozilgan:

\`\`\`javascript
div.innerHTML = '<div class="matn">' + data.matn + '</div>';   // ❌ XAVFLI
\`\`\`

Bu kod **ishlaydi** — shuning uchun xavfli ko'rinmaydi. Lekin \`data.matn\` ni **boshqa odam** yozgan. Agar u shunday yozsa:

\`\`\`text
<img src=x onerror="alert('Buzildi!')">
\`\`\`

...bu kod **chatdagi hammaning brauzerida** ishga tushadi. Bu — **XSS** (Cross-Site Scripting) hujumi.

Nima qilishi mumkin: saqlangan ma'lumotni o'g'irlash, foydalanuvchi nomidan xabar yuborish, soxta login oynasi ko'rsatish.

\`\`\`demo h=380 "XSS: innerHTML va textContent"
<style>
  * { box-sizing: border-box; }
  body { font-family: sans-serif; font-size: 13px; margin: 0; padding: 14px; }

  textarea {
    width: 100%; height: 54px; padding: 8px; font-family: monospace;
    font-size: 11px; border: 2px solid #d1d5db; border-radius: 7px;
    outline: none; resize: none;
  }
  textarea:focus { border-color: #6366f1; }

  .panel { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 12px; }
  .quti { border: 2px solid; border-radius: 10px; padding: 10px; }
  .xavfli { border-color: #fca5a5; background: #fef2f2; }
  .xavfsiz { border-color: #86efac; background: #f0fdf4; }
  .quti h4 { margin: 0 0 8px; font-size: 11px; font-family: monospace; }
  .xavfli h4 { color: #dc2626; }
  .xavfsiz h4 { color: #16a34a; }

  .natija {
    background: white; border-radius: 6px; padding: 8px;
    min-height: 70px; font-size: 12px; word-break: break-word;
  }

  .namuna { margin-top: 10px; display: flex; gap: 5px; flex-wrap: wrap; }
  .namuna button {
    padding: 5px 9px; border: 1px solid #d1d5db; background: white;
    border-radius: 6px; font-size: 10px; cursor: pointer; font-family: monospace;
  }
</style>

<p style="margin:0 0 6px;font-size:11px;color:#6b7280;font-family:monospace">data.matn — boshqa odam yozgan</p>
<textarea id="kirish"></textarea>

<div class="namuna">
  <button data-tur="oddiy">Oddiy xabar</button>
  <button data-tur="qalin">&lt;b&gt;Qalin&lt;/b&gt;</button>
  <button data-tur="xujum">☠ XSS hujumi</button>
</div>

<div class="panel">
  <div class="quti xavfli">
    <h4>❌ innerHTML</h4>
    <div class="natija" id="xavfliN"></div>
  </div>
  <div class="quti xavfsiz">
    <h4>✅ textContent</h4>
    <div class="natija" id="xavfsizN"></div>
  </div>
</div>

<script>
  var namunalar = {
    oddiy: 'Salom, qalaysan?',
    qalin: '<b>Qalin matn</b>',
    xujum: '<img src=x onerror="this.parentElement.textContent=\\'☠ KOD ISHGA TUSHDI\\'">'
  };

  var kirish = document.querySelector('#kirish');
  var xavfliN = document.querySelector('#xavfliN');
  var xavfsizN = document.querySelector('#xavfsizN');

  function yangila() {
    var matn = kirish.value;
    xavfliN.innerHTML = matn;      // ❌ brauzer buni KOD deb o'qiydi
    xavfsizN.textContent = matn;   // ✅ brauzer buni MATN deb o'qiydi
  }

  kirish.addEventListener('input', yangila);

  var tugmalar = document.querySelectorAll('.namuna button');
  for (var i = 0; i < tugmalar.length; i++) {
    tugmalar[i].addEventListener('click', function () {
      kirish.value = namunalar[this.dataset.tur];
      yangila();
    });
  }

  kirish.value = namunalar.oddiy;
  yangila();
</script>
\`\`\`

"XSS hujumi" tugmasini bosing. Chap tomonda **siz yozmagan kod ishladi**. O'ng tomonda esa hammasi oddiy matn bo'lib turibdi.

**Qoida:** foydalanuvchi yozgan matn hech qachon \`innerHTML\` ga tushmasin.

\`\`\`javascript
// ✅ TO'G'RI
const div = document.createElement('div');
div.className = 'xabar';

const matnEl = document.createElement('div');
matnEl.className = 'xabar-matn';
matnEl.textContent = data.matn;        // xavfsiz

const metaEl = document.createElement('div');
metaEl.className = 'xabar-meta';
metaEl.textContent = data.email.split('@')[0] + ' ' + vaqtMatn;

div.append(matnEl, metaEl);
\`\`\`

> 💡 \`innerHTML\` ni **o'zingiz yozgan** HTML uchun ishlatish mumkin. Xavf faqat **tashqaridan kelgan** ma'lumotda.

---

## 📜 Scroll tuzog'i

Chatda odatda oxiriga scroll qilinadi:

\`\`\`javascript
container.scrollTop = container.scrollHeight;
\`\`\`

Lekin **har snapshot'da** shuni qilsangiz — foydalanuvchi eski xabarlarni o'qiyotganda uni majburan pastga tashlaysiz.

\`\`\`javascript
// Faqat foydalanuvchi allaqachon pastda bo'lsa
const pastdami =
  container.scrollHeight - container.scrollTop - container.clientHeight < 80;

chiz(snapshot);

if (pastdami) container.scrollTop = container.scrollHeight;
\`\`\`

---

## 🔍 docChanges — nima o'zgardi

\`\`\`javascript
onSnapshot(q, (snapshot) => {
  snapshot.docChanges().forEach(change => {
    if (change.type === 'added')    console.log("Qo'shildi");
    if (change.type === 'modified') console.log("O'zgartirildi");
    if (change.type === 'removed')  console.log("O'chirildi");
  });
});
\`\`\`

Bu — hamma narsani qayta chizish o'rniga **faqat o'zgarganini** o'zgartirish imkonini beradi. 50 ta xabarda farq sezilmaydi, 500 tada — sezilarli.

> Boshida oddiy usul (hammasini qayta chizish) yetarli. \`docChanges\` — Gold darajadagi optimallashtirish.

---

## ⚠️ Xatoni ushlash

\`onSnapshot\` ikkinchi callback qabul qiladi:

\`\`\`javascript
onSnapshot(q,
  (snapshot) => { /* muvaffaqiyat */ },
  (error) => { console.error('Listener xatosi:', error); }
);
\`\`\`

Buni yozmasangiz, Security Rules qo'shilgandan keyin (6-dars) listener **jimgina o'ladi** va nima uchun ekanini bilmaysiz.

---

## 🥉 Bronze Topshiriq

- \`getDocs\` ni \`onSnapshot\` ga almashtiring
- Ikkita brauzer oynasi oching, birida xabar qo'shing, ikkinchisida **o'zi paydo bo'lishini** ko'ring

---

## 🥈 Silver Topshiriq

- To'liq chat: yuborish + real-time ro'yxat
- Matn \`textContent\` bilan chiqarilsin (\`innerHTML\` emas)
- \`unsubscribe\` chiqishda chaqirilsin
- Xato callback'i yozilsin

---

## 🥇 Gold Topshiriq

- \`docChanges()\` bilan faqat o'zgargan xabarni chizing
- Aqlli scroll (pastda bo'lsagina tushirish)
- O'z xabarini ikki marta bosib o'chirish
- Vaqt \`data.vaqt ? data.vaqt.toDate() : new Date()\` bilan hisoblansin

---

## ✅ Dars Xulosa

- \`onSnapshot(q, cb)\` — real-time, WebSocket ustida
- Callback **darhol** va **har o'zgarishda** chaqiriladi
- \`unsubscribe()\` — yopish shart, aks holda nusxa listenerlar
- Yangi listener ochishdan oldin **eskisini yoping**
- Foydalanuvchi matni → **\`textContent\`**, hech qachon \`innerHTML\` emas
- Scroll'ni faqat foydalanuvchi pastda bo'lsa tushiring
- Xato callback'ini yozing

> 🚀 **Keyingi dars:** Security Rules — kim nimani ko'rishi mumkin?
`,
    teacher: `
## 🔴 Notion'dagi jiddiy xato: XSS

Asl sahifadagi chat kodida xabar shunday chiziladi:

\`\`\`text
div.innerHTML = \`
  <div class="xabar-matn">\${data.matn}</div>
  <div class="xabar-meta">\${data.email?.split('@')[0]} \${vaqtMatn}</div>
\`;
\`\`\`

\`data.matn\` — **boshqa foydalanuvchi** Firestore'ga yozgan matn. U \`innerHTML\` ga to'g'ridan-to'g'ri tushyapti.

Ya'ni har kim chatga shunday yozsa:

\`\`\`text
<img src=x onerror="...istalgan kod...">
\`\`\`

— bu kod **chatni ochgan hamma odamning brauzerida** ishga tushadi.

Bu nazariy xavf emas: real-time chat — XSS uchun eng qulay muhit, chunki hujumchining matni **hamma ekraniga darhol** yetib boradi, qayta yuklash ham kerak emas.

**Yomoni:** kod **ishlaydi**, demak bola xatoni sezmaydi va bu odat bo'lib qoladi — keyingi barcha loyihalarida shunday yozadi.

Darsda \`createElement\` + \`textContent\` naqshiga almashtirildi va interaktiv demo qo'shildi: bola tugmani bosib, o'zi yozmagan kod ishga tushishini **ko'radi**.

**Darsda albatta qiling:** bola chatni ishga tushirgandan keyin, uning chatiga o'zingiz \`<img src=x onerror="alert('salom')">\` deb yozing. Ekranida oyna chiqadi. Bu bir umr esda qoladi.

---

## ⚠️ Ikkinchi xato: nusxa listenerlar

Asl kodda \`onAuthStateChanged\` ichida \`chatniYuklash()\` chaqiriladi va u har safar **yangi** \`onSnapshot\` ochadi. Eskisi yopilmaydi.

\`onAuthStateChanged\` bir necha marta ishga tushishi mumkin (token yangilanishi, boshqa tabdagi o'zgarish). Natija: har xabar **ikki-uch marta** chiziladi.

Bola "chizish funksiyam xato" deb qidiradi — holbuki muammo listener'da. Darsga himoya naqshi qo'shildi.

---

## ⚠️ Uchinchi: signOut'dan keyin permission-denied

Asl kodda \`unsubscribe()\` faqat "Chiqish" tugmasida chaqiriladi. Sessiya boshqa yo'l bilan tugasa (token eskirdi, boshqa tabda chiqildi), listener ochiq qoladi va Security Rules qo'shilgandan keyin (6-dars) \`permission-denied\` xatolarini yog'diradi.

Xato callback'i asl kodda bor, lekin faqat \`console.error\` — bola konsolni ochmasa ko'rmaydi.

---

## 🗒 Qo'shilgan boshqa narsalar

- **Scroll tuzog'i** — har snapshot'da pastga tushirish eski xabarlarni o'qiyotgan odamni uzadi. Shartli scroll naqshi qo'shildi.
- **\`docChanges()\`** asl darsda o'rgatilgan, lekin chat kodida **ishlatilmagan** — o'rgatilgan narsa qo'llanilmagan. Darsda ochiq aytildi: boshida oddiy usul yetarli, \`docChanges\` — Gold darajasi.
- SDK versiyasi qattiq yozilgan (10.7.0).

---

## 💡 O'qituvchi uchun

- **Ikki qurilma bilan boshlang.** Bu modulning eng kuchli lahzasi: bola telefonida yozadi, kompyuterda paydo bo'ladi. Hech qanday tugma bosilmadi. Motivatsiya shundan keyin o'z-o'zidan keladi.
- **Nusxa listener xatosini ataylab yarating.** Himoyasiz kod bilan chiqib-kirib ko'ring — xabarlar ikkilanadi. Sabab tushuntirilmasa, bu xato kurs oxirigacha ta'qib qiladi.
- **XSS demosini tez o'tmang.** Bu — butun kursdagi eng muhim xavfsizlik darsi. 2-Modulda \`innerHTML\` qulaylik sifatida o'rgatilgan edi; bu yerda uning chegarasi qo'yiladi.
- \`unsubscribe\` tushunchasini React'ga bog'lang: 4-Modulda \`useEffect\` ning \`return\` qismi aynan shu vazifani bajaradi.

## ⚠️ Ko'p uchraydigan xatolar

- **\`innerHTML\` bilan foydalanuvchi matni** — yuqorida, eng muhimi.
- **Nusxa listenerlar** — xabar ikki marta.
- **\`unsubscribe\` saqlanmagan** — \`onSnapshot(...)\` natijasi o'zgaruvchiga yozilmagan, keyin yopib bo'lmaydi.
- **\`unsubscribe\` darhol chaqirilgan** — listener bir marta ishlab o'chadi. Bola "faqat bir marta ishlayapti" deydi.
- **\`data.vaqt.toDate()\` \`null\` da** — \`serverTimestamp()\` hali qo'yilmagan, \`TypeError\`. 4-darsdagi tekshiruv kerak.
- **Indeks xatosi** — \`orderBy\` + \`where\` birga bo'lsa (4-dars).
- **\`limit\` yo'q** — 1000 ta xabarda sahifa qotadi. \`limit(50)\`.

## 📊 Daraja belgilash

- **Bronze** — ikki oynada avtomatik yangilanish ishlayapti
- **Silver** — \`textContent\`, \`unsubscribe\`, xato callback'i bor
- **Gold** — \`docChanges\`, aqlli scroll, o'chirish

> **Tekshirish usuli:** bolaning chatiga \`<b>test</b>\` deb yozing.
> Qalin **test** chiqsa — \`innerHTML\` ishlatilgan, Silver berilmaydi.
> \`<b>test</b>\` matn bo'lib chiqsa — to'g'ri.
>
> Ikkinchi tekshiruv: chiqib-kiring, xabarlar ikkilanmasligi kerak.
`,
  },

  // ═══════════════════════════════════════════════════════════
  'junior.m3.l4': {
    goal: "Firestore ma'lumotlar modeli va CRUD: addDoc, getDocs, updateDoc, deleteDoc.",
    student: `
## 🗄️ Firestore nima?

Firestore — Google'ning **ma'lumotlar bazasi**. \`localStorage\` dan farqi:

| | localStorage | Firestore |
| --- | --- | --- |
| Qayerda | Foydalanuvchi brauzerida | Google serverida |
| Kim ko'radi | Faqat o'sha odam | Siz ruxsat berganlar |
| Hajmi | ~5 MB | Amalda cheksiz |
| Boshqa qurilmada | Yo'q | Ha |

Ya'ni: telefonda yozgan xabaringizni kompyuterda ham ko'rasiz. \`localStorage\` bunga qodir emas.

---

## 🌳 Tuzilma: collection → document → field

Firestore **NoSQL** — jadvallar yo'q. Uning o'rniga uch qavatli tuzilma:

\`\`\`demo h=420 "Tuzilmani bosib ko'ring"
<style>
  * { box-sizing: border-box; }
  body { font-family: sans-serif; font-size: 13px; margin: 0; padding: 14px; }

  .daraxt { font-family: monospace; font-size: 12px; line-height: 2; }
  .qator { cursor: pointer; padding: 2px 6px; border-radius: 5px; }
  .qator:hover { background: #f3f4f6; }
  .qator.tanlangan { background: #e0e7ff; }

  .coll { color: #7c3aed; font-weight: 700; }
  .docu { color: #2563eb; }
  .fld  { color: #059669; }
  .qiymat { color: #6b7280; }

  #izoh {
    margin-top: 14px; background: #eff6ff; border: 1px solid #bfdbfe;
    border-radius: 8px; padding: 12px; font-size: 12px; color: #1e40af;
    line-height: 1.8; min-height: 80px;
  }
  #izoh code { background: #dbeafe; padding: 1px 5px; border-radius: 3px; font-family: monospace; font-size: 11px; }
</style>

<div class="daraxt">
  <div class="qator" data-t="db">📁 Ma'lumotlar bazasi</div>
  <div class="qator" data-t="coll" style="padding-left:20px">
    <span class="coll">📂 users</span> <span class="qiymat">— collection</span>
  </div>
  <div class="qator" data-t="doc" style="padding-left:40px">
    <span class="docu">📄 aBcDeFg123</span> <span class="qiymat">— document</span>
  </div>
  <div class="qator" data-t="field" style="padding-left:60px">
    <span class="fld">ism</span>: <span class="qiymat">"Ali"</span>
  </div>
  <div class="qator" data-t="field" style="padding-left:60px">
    <span class="fld">yosh</span>: <span class="qiymat">20</span>
  </div>
  <div class="qator" data-t="doc" style="padding-left:40px">
    <span class="docu">📄 hIjKlMn456</span>
  </div>
  <div class="qator" data-t="field2" style="padding-left:60px">
    <span class="fld">ism</span>: <span class="qiymat">"Vali"</span>
  </div>
  <div class="qator" data-t="field2" style="padding-left:60px">
    <span class="fld">shahar</span>: <span class="qiymat">"Buxoro"</span> ← boshqacha!
  </div>
  <div class="qator" data-t="coll2" style="padding-left:20px">
    <span class="coll">📂 messages</span>
  </div>
  <div class="qator" data-t="doc2" style="padding-left:40px">
    <span class="docu">📄 msg001</span>
  </div>
  <div class="qator" data-t="uid" style="padding-left:60px">
    <span class="fld">uid</span>: <span class="qiymat">"aBcDeFg123"</span> ← bog'lanish
  </div>
</div>

<div id="izoh">Tuzilmadagi qatorlarni bosing</div>

<script>
  var izohlar = {
    db: 'Bitta Firebase loyihasida bitta ma\\'lumotlar bazasi bo\\'ladi.',
    coll: '<b>Collection</b> — bir turdagi hujjatlar to\\'plami. SQL\\'dagi <i>jadval</i> ga o\\'xshaydi.<br />Kodda: <code>collection(db, "users")</code>',
    coll2: '<b>Collection</b> — ikkinchi to\\'plam. Har xil turdagi ma\\'lumot alohida collection\\'da saqlanadi.',
    doc: '<b>Document</b> — bitta yozuv. SQL\\'dagi <i>qator</i> ga o\\'xshaydi.<br />Bu yerdagi <code>aBcDeFg123</code> — foydalanuvchining <b>uid</b> si. Auth bilan bog\\'lash uchun shunday qilinadi.',
    doc2: '<b>Document</b> — bitta xabar. ID ni Firestore o\\'zi yaratgan (<code>addDoc</code>).',
    field: '<b>Field</b> — maydon. SQL\\'dagi <i>ustun</i> ga o\\'xshaydi.<br />Turlari: matn, son, boolean, sana, massiv, obyekt.',
    field2: '<b>Diqqat:</b> bu hujjatda <code>yosh</code> yo\\'q, lekin <code>shahar</code> bor.<br />NoSQL\\'da har hujjat <b>boshqacha</b> maydonlarga ega bo\\'lishi mumkin — SQL\\'da bu mumkin emas.',
    uid: '<b>Bog\\'lanish.</b> Xabarda <code>uid</code> maydoni bor — u <code>users</code> collection\\'idagi hujjatga ishora qiladi.<br /><br />SQL\\'dagi <i>foreign key</i> ga o\\'xshaydi, lekin Firestore buni <b>o\\'zi tekshirmaydi</b>. Bog\\'lanishni siz boshqarasiz.'
  };

  var izohEl = document.querySelector('#izoh');
  var qatorlar = document.querySelectorAll('.qator');

  for (var i = 0; i < qatorlar.length; i++) {
    qatorlar[i].addEventListener('click', function () {
      for (var j = 0; j < qatorlar.length; j++) qatorlar[j].classList.remove('tanlangan');
      this.classList.add('tanlangan');
      izohEl.innerHTML = izohlar[this.dataset.t] || '';
    });
  }
</script>
\`\`\`

Eng muhim farq: **har hujjat boshqacha maydonlarga ega bo'lishi mumkin**. SQL jadvalida hamma qator bir xil ustunlarga ega bo'lishi shart, bu yerda esa yo'q.

---

## ✍️ Yozish — addDoc va setDoc

Ikkita funksiya bor va ular **boshqa vazifa** bajaradi:

\`\`\`javascript
// addDoc — Firestore ID ni O'ZI yaratadi
const ref = await addDoc(collection(db, 'messages'), {
  matn: 'Salom!',
  uid: user.uid,
  vaqt: serverTimestamp()
});
console.log(ref.id);   // "x7Kp2mQ..." — tasodifiy

// setDoc — ID ni SIZ berasiz
await setDoc(doc(db, 'users', user.uid), {
  email: user.email,
  ism: 'Ali'
});
\`\`\`

| | \`addDoc\` | \`setDoc\` |
| --- | --- | --- |
| ID kim beradi | Firestore | Siz |
| Mavjud bo'lsa | Yangi qo'shadi | **Ustiga yozadi** |
| Qachon | Xabarlar, izohlar | Foydalanuvchi profili |

> 💡 **Foydalanuvchi profili uchun har doim \`setDoc\` + \`uid\`.** Sabab: keyin profilni topish uchun qidirish shart emas — \`doc(db, 'users', user.uid)\` deb to'g'ridan-to'g'ri olasiz.

> ⚠️ \`setDoc\` mavjud hujjatni **butunlay almashtiradi**. Faqat bitta maydonni o'zgartirmoqchi bo'lsangiz \`updateDoc\` ishlating, aks holda qolgan maydonlar **o'chib ketadi**.
>
> Yoki: \`setDoc(ref, data, { merge: true })\` — bu holda birlashtiradi.

---

## 📖 O'qish

\`\`\`javascript
// Bitta hujjat
const snap = await getDoc(doc(db, 'users', uid));

if (snap.exists()) {
  console.log(snap.data());        // { email: "...", ism: "Ali" }
} else {
  console.log('Topilmadi');
}

// Ko'p hujjat
const snapshot = await getDocs(collection(db, 'messages'));

const xabarlar = snapshot.docs.map(d => ({
  id: d.id,        // hujjat ID si — ma'lumot ichida YO'Q
  ...d.data()      // maydonlar
}));
\`\`\`

> ⚠️ \`d.id\` va \`d.data()\` — **alohida** narsalar. Hujjat ID si maydonlar ichida saqlanmaydi. Shuning uchun ularni qo'lda birlashtirish kerak: \`{ id: d.id, ...d.data() }\`
>
> Bu — keyin o'chirish yoki yangilash uchun zarur, chunki ID kerak bo'ladi.

---

## 🔍 Filtr va tartib

\`\`\`javascript
const q = query(
  collection(db, 'messages'),
  orderBy('vaqt', 'desc'),
  limit(20)
);

const snap = await getDocs(q);
\`\`\`

\`\`\`javascript
// Faqat bitta foydalanuvchining xabarlari
const q = query(
  collection(db, 'messages'),
  where('uid', '==', user.uid)
);
\`\`\`

---

## ⚠️ Indeks tuzog'i — bu albatta chiqadi

\`where\` va \`orderBy\` ni **birga** ishlatsangiz, Firestore xato beradi:

\`\`\`text
FirebaseError: The query requires an index.
You can create it here: https://console.firebase.google.com/...
\`\`\`

**Bu — xato emas, normal holat.** Firestore bunday so'rovlar uchun **indeks** (tezkor qidiruv jadvali) talab qiladi va uni oldindan yaratish kerak.

**Yechim juda oson:**

1. Konsoldagi xato xabaridagi **havolani bosing**
2. Firebase o'zi kerakli indeksni tayyorlab beradi
3. **Create index** bosing
4. 1–2 daqiqa kuting (holat "Building" dan "Enabled" ga o'tadi)
5. Sahifani yangilang — ishlaydi

> 💡 Bu tuzoqni bilmagan bola "kodim xato" deb o'ylaydi va uzoq qidiradi. Aslida xato xabarining **o'zida yechim havolasi** bor — uni o'qish kifoya.
>
> Bu — 2-Modulning 11-darsidagi qoidaning davomi: **xato xabarini o'qing**.

---

## 🕐 serverTimestamp va nozik holat

\`\`\`javascript
await addDoc(collection(db, 'messages'), {
  matn: 'Salom',
  vaqt: serverTimestamp()   // brauzer vaqti EMAS, server vaqti
});
\`\`\`

Nima uchun server vaqti? Foydalanuvchining kompyuterida soat noto'g'ri bo'lishi mumkin. Serverda esa hamma uchun bir xil.

> ⚠️ **Nozik holat:** yozgandan **darhol keyin** o'qisangiz, \`vaqt\` maydoni \`null\` bo'lishi mumkin — server hali qiymatni qo'ymagan.
>
> Shuning uchun ko'rsatishdan oldin tekshiring:
>
> \`\`\`javascript
> const vaqt = data.vaqt ? data.vaqt.toDate() : new Date();
> \`\`\`
>
> \`.toDate()\` — Firestore Timestamp'ni oddiy JavaScript \`Date\` ga aylantiradi.

---

## 🔄 Yangilash va o'chirish

\`\`\`javascript
// Faqat ko'rsatilgan maydonlar o'zgaradi
await updateDoc(doc(db, 'users', uid), {
  ism: 'Yangi ism'
});

// O'chirish
await deleteDoc(doc(db, 'messages', xabarId));
\`\`\`

---

## 📋 To'liq CRUD misoli

\`\`\`demo h=420 "Firestore taqlidi — CRUD"
<style>
  * { box-sizing: border-box; }
  body { font-family: sans-serif; font-size: 13px; margin: 0; padding: 14px; }

  .kirish { display: flex; gap: 6px; margin-bottom: 10px; }
  input {
    flex: 1; padding: 8px 10px; font-size: 12px;
    border: 2px solid #d1d5db; border-radius: 7px; outline: none;
  }
  input:focus { border-color: #6366f1; }
  button {
    padding: 8px 12px; border: none; border-radius: 7px;
    font-size: 11px; cursor: pointer; color: white; font-family: monospace;
    background: #6366f1;
  }

  .hujjat {
    background: #f9fafb; border: 1px solid #e5e7eb;
    border-radius: 8px; padding: 8px 10px; margin-bottom: 5px;
    font-family: monospace; font-size: 11px;
    display: flex; align-items: center; gap: 8px;
  }
  .hujjat .id { color: #7c3aed; }
  .hujjat .matn { flex: 1; color: #1f2937; }
  .hujjat .vaqt { color: #9ca3af; font-size: 10px; }
  .hujjat button { background: #dc2626; padding: 4px 8px; }

  .bosh { color: #9ca3af; font-style: italic; padding: 12px; text-align: center; font-size: 12px; }
  .lbl { font-size: 11px; color: #6b7280; font-family: monospace; margin: 10px 0 5px; }
</style>

<div class="kirish">
  <input id="matn" placeholder="Xabar matni" />
  <button id="qosh">addDoc</button>
  <button id="yukla" style="background:#16a34a">getDocs</button>
</div>

<p class="lbl">collection(db, "messages")</p>
<div id="royxat"></div>

<script>
  // Soxta Firestore
  var baza = [];

  function soxtaAddDoc(data) {
    return new Promise(function (bajar) {
      setTimeout(function () {
        var id = Math.random().toString(36).slice(2, 10);
        baza.push({ id: id, matn: data.matn, vaqt: new Date() });
        bajar({ id: id });
      }, 400);
    });
  }

  function soxtaGetDocs() {
    return new Promise(function (bajar) {
      setTimeout(function () { bajar(baza.slice()); }, 400);
    });
  }

  function soxtaDeleteDoc(id) {
    return new Promise(function (bajar) {
      setTimeout(function () {
        baza = baza.filter(function (d) { return d.id !== id; });
        bajar();
      }, 300);
    });
  }

  var royxat = document.querySelector('#royxat');
  var matnEl = document.querySelector('#matn');

  function chiz(hujjatlar) {
    if (hujjatlar.length === 0) {
      royxat.innerHTML = '<div class="bosh">Hujjatlar yo\\'q</div>';
      return;
    }
    royxat.innerHTML = '';
    for (var i = 0; i < hujjatlar.length; i++) {
      var d = hujjatlar[i];
      var el = document.createElement('div');
      el.className = 'hujjat';
      el.innerHTML =
        '<span class="id">' + d.id + '</span>' +
        '<span class="matn"></span>' +
        '<span class="vaqt">' + d.vaqt.toLocaleTimeString() + '</span>' +
        '<button data-id="' + d.id + '">deleteDoc</button>';
      el.querySelector('.matn').textContent = d.matn;
      royxat.appendChild(el);
    }
  }

  document.querySelector('#qosh').addEventListener('click', async function () {
    var matn = matnEl.value.trim();
    if (!matn) return;
    var ref = await soxtaAddDoc({ matn: matn });
    matnEl.value = '';
    chiz(await soxtaGetDocs());
  });

  document.querySelector('#yukla').addEventListener('click', async function () {
    royxat.innerHTML = '<div class="bosh">Yuklanmoqda...</div>';
    chiz(await soxtaGetDocs());
  });

  royxat.addEventListener('click', async function (e) {
    if (e.target.dataset.id) {
      await soxtaDeleteDoc(e.target.dataset.id);
      chiz(await soxtaGetDocs());
    }
  });

  chiz(baza);
</script>
\`\`\`

Har hujjatda **ID** (binafsha) ko'rinadi — u \`addDoc\` tomonidan yaratilgan va o'chirish uchun kerak.

---

## 🥉 Bronze Topshiriq

- \`sinov\` collection'iga bitta hujjat yozing (\`addDoc\`)
- Firebase Console → Firestore Database'da ko'ring

> Firestore'ni birinchi marta ishlatishda **Create database** bosish kerak. **Test mode** ni tanlang — Security Rules'ni 6-darsda yozamiz.

---

## 🥈 Silver Topshiriq

- \`getDocs\` bilan barcha hujjatlarni oling
- Sahifada ro'yxat qilib ko'rsating
- \`{ id: d.id, ...d.data() }\` naqshini ishlating

---

## 🥇 Gold Topshiriq

To'liq CRUD:

- \`addDoc\` — qo'shish
- \`getDocs\` + \`orderBy('vaqt', 'desc')\` — tartiblangan ro'yxat
- \`updateDoc\` — tahrirlash
- \`deleteDoc\` — o'chirish
- Foydalanuvchi profilini \`setDoc(doc(db, 'users', user.uid), ...)\` bilan saqlang

---

## ✅ Dars Xulosa

- Tuzilma: **collection → document → field**
- Har hujjat **boshqacha maydonlarga** ega bo'lishi mumkin
- \`addDoc\` — ID Firestore'dan, \`setDoc\` — ID sizdan
- Profil uchun **\`setDoc\` + \`uid\`**
- \`setDoc\` ustiga yozadi, \`updateDoc\` qisman o'zgartiradi
- \`{ id: d.id, ...d.data() }\` — ID ni qo'shish naqshi
- \`where\` + \`orderBy\` → **indeks kerak**, havolani bosing
- \`serverTimestamp()\` darhol o'qilganda \`null\` bo'lishi mumkin

> 🚀 **Keyingi dars:** onSnapshot — ma'lumot o'zi yangilanadi!
`,
    teacher: `
## ⚠️ Notion'da yozilmagan tuzoq: indeks xatosi

Asl sahifada shunday kod bor:

\`\`\`javascript
const q = query(
  collection(db, 'messages'),
  where('uid', '==', uid),
  orderBy('vaqt', 'desc')
);
\`\`\`

**Bu kod birinchi ishga tushirilganda xato beradi:**

\`\`\`text
FirebaseError: The query requires an index.
\`\`\`

Firestore \`where\` + \`orderBy\` birikmasi uchun **kompozit indeks** talab qiladi va uni oldindan yaratish kerak.

Bu darsda tushuntirilmagan. Natijada bola:

1. Darslikdagi kodni aynan yozadi
2. Xato oladi
3. Kodini qayta-qayta tekshiradi
4. Xatoni topa olmaydi — chunki **kodda xato yo'q**

Holbuki yechim xato xabarining **o'zida** bor — Firebase tayyor havola beradi, uni bosish va "Create index" tugmasini bosish kifoya.

Darsga alohida bo'lim qo'shildi va 2-Modulning 11-darsidagi qoida bilan bog'landi: **xato xabarini o'qing**.

**Darsda albatta ko'rsating:** ataylab shunday so'rov yozing, xato chiqsin, havolani bosing va indeks yaratilishini birga kuzating. Bir marta ko'rgan bola boshqa qo'rqmaydi.

---

## ⚠️ Qo'shilgan boshqa nozik joylar

**1. \`addDoc\` va \`setDoc\` farqi**

Asl sahifada ikkalasi ham ko'rsatilgan, lekin **qachon qaysi biri** kerakligi aytilmagan. Jadval qo'shildi.

Muhimi: foydalanuvchi profili uchun \`setDoc(doc(db, 'users', user.uid), ...)\` — shunda profilni qidirish shart emas.

**2. \`setDoc\` ustiga yozadi**

Bu — ma'lumot yo'qotishga olib keladigan xato. Bola profilni yangilamoqchi bo'lib \`setDoc\` ishlatadi va qolgan maydonlar **o'chib ketadi**. \`{ merge: true }\` yoki \`updateDoc\` kerak.

**3. \`serverTimestamp()\` darhol \`null\`**

Yozgandan keyin darhol o'qisangiz, vaqt maydoni hali bo'sh. Chat ilovasida bu **muntazam** uchraydi va \`.toDate()\` chaqirilganda \`TypeError\` beradi.

**4. \`d.id\` va \`d.data()\` alohida**

Bola \`d.data().id\` deb yozadi va \`undefined\` oladi. \`{ id: d.id, ...d.data() }\` naqshi alohida ta'kidlandi.

---

## 🗒 Mayda tuzatishlar

- \`yangiMalumod\` → \`yangiMalumot\` (imlo)
- \`barcha_xabarlar\` → camelCase (qolgan kod bilan izchillik uchun)
- SDK versiyasi qattiq yozilgan

---

## 💡 O'qituvchi uchun

- **Tuzilma demosi** bilan boshlang. Bolalar SQL jadvalini tasavvur qiladi va Firestore'ni shunga o'xshatadi. Demoda "har hujjat boshqacha maydonlarga ega bo'lishi mumkin" qatorini alohida bosdiring — bu SQL'da mumkin emas.
- **Firebase Console'ni yonma-yon oching.** Bola kod yozadi, Console'da hujjat **paydo bo'lishini** ko'radi. Bu — modulning eng ta'sirli lahzasi: "mening kodim Google serverida ma'lumot yaratdi".
- \`uid\` bog'lanishini ta'kidlang. 3-darsda \`user.uid\` ni ko'rgan edi, endi u ma'lumotni bog'lash uchun ishlatiladi.
- **Test mode** haqida ogohlantiring: Firestore yaratishda "Test mode" tanlanadi va u **30 kundan keyin** hamma narsani bloklaydi. 6-darsda Rules yozilgach bu muammo hal bo'ladi.

## ⚠️ Ko'p uchraydigan xatolar

- **\`Missing or insufficient permissions\`** — Firestore "Production mode"da yaratilgan yoki Test mode muddati tugagan. 6-darsgacha Test mode kerak.
- **Indeks xatosi** — yuqorida.
- **\`db\` uzatilmagan** — \`collection('users')\` xato, \`collection(db, 'users')\` to'g'ri.
- **\`await\` unutilgan** — \`getDocs\` Promise qaytaradi, \`snapshot.docs\` \`undefined\` bo'ladi.
- **\`snap.exists\` qavssiz** — bu **funksiya**: \`snap.exists()\`.
- **\`setDoc\` bilan ma'lumot yo'qotish** — yuqorida.
- **Timestamp to'g'ridan-to'g'ri ko'rsatilgan** — \`[object Object]\` chiqadi. \`.toDate()\` kerak.

## 📊 Daraja belgilash

- **Bronze** — hujjat yozildi, Console'da ko'rinadi
- **Silver** — \`getDocs\` bilan ro'yxat, \`{ id, ...data }\` naqshi
- **Gold** — to'liq CRUD, profil \`setDoc\` + \`uid\` bilan

> Gold'ni tekshirish: Firestore Console'da \`users\` collection'ini oching. Hujjat ID si foydalanuvchining \`uid\` siga tengmi? Tasodifiy ID bo'lsa — \`addDoc\` ishlatilgan, naqsh noto'g'ri.
`,
  },

  // ═══════════════════════════════════════════════════════════
  'junior.m3.l3': {
    goal: "signInWithEmailAndPassword, signOut va onAuthStateChanged bilan sessiyani boshqarish.",
    student: `
## 🔑 Kirish

Ro'yxatdan o'tish bilan deyarli bir xil — faqat funksiya nomi boshqa:

\`\`\`javascript
import { signInWithEmailAndPassword } from '...firebase-auth.js';

try {
  const natija = await signInWithEmailAndPassword(auth, email, parol);
  console.log('Kirdi:', natija.user.email);
  window.location.href = 'dashboard.html';

} catch (xato) {
  console.error(xato.code);
}
\`\`\`

Kirishda eng ko'p uchraydigan xato — **bitta**:

\`\`\`javascript
const xabarlar = {
  'auth/invalid-credential': 'Email yoki parol noto\\'g\\'ri',
  'auth/too-many-requests': 'Juda ko\\'p urinish. Biroz kutib turing.',
  'auth/network-request-failed': 'Internet aloqasini tekshiring'
};
\`\`\`

> ⚠️ 2-darsda gaplashganimizdek, \`auth/user-not-found\` va \`auth/wrong-password\` **endi ishlamaydi**. Ikkala holat uchun ham \`auth/invalid-credential\` keladi.
>
> Foydalanuvchiga ham **"Email yoki parol noto'g'ri"** deb yozing — qaysi biri ekanini aytmang. Bu xavfsizlik qoidasi.

---

## 🚪 Chiqish

\`\`\`javascript
import { signOut } from '...firebase-auth.js';

await signOut(auth);
window.location.href = 'login.html';
\`\`\`

Shu bilan tamom. Firebase sessiyani o'chiradi.

---

## 👁 onAuthStateChanged — modulning eng muhim funksiyasi

Bu — **kuzatuvchi** (listener). U bir marta ishlab to'xtamaydi, balki auth holati **har o'zgarganda** chaqiriladi:

\`\`\`javascript
onAuthStateChanged(auth, (user) => {
  if (user) {
    // kirgan
    console.log(user.email, user.uid);
  } else {
    // kirmagan
  }
});
\`\`\`

U uch holatda ishga tushadi:

1. **Sahifa yuklanganda** — Firebase eski sessiyani tekshiradi
2. **Kirganda** — \`signIn\` muvaffaqiyatli bo'lgach
3. **Chiqqanda** — \`signOut\` dan keyin

Shuning uchun UI'ni **faqat shu funksiya ichida** boshqaring. Alohida "kirdimi?" tekshiruvi yozish shart emas.

---

## ⚡ Eng ko'p uchraydigan xato: uchinchi holatni unutish

Sahifa ochilganda Firebase sessiyani tekshirish uchun **vaqt oladi** — bir necha yuz millisekund. O'sha paytda \`user\` hali ma'lum emas.

Ko'p bolalar ikki holatni yozadi: **kirgan** va **kirmagan**. Uchinchisi — **"hali noma'lum"** — unutiladi.

\`\`\`demo h=420 "Ikki sahifani taqqoslang"
<style>
  * { box-sizing: border-box; }
  body { font-family: sans-serif; font-size: 13px; margin: 0; padding: 14px; }

  .juft { display: flex; gap: 12px; }
  .yarim { flex: 1; }
  .lbl { font-family: monospace; font-size: 11px; margin: 0 0 6px; min-height: 30px; }
  .yomon-lbl { color: #dc2626; }
  .yaxshi-lbl { color: #16a34a; }

  .ekran {
    border: 2px solid #e5e7eb; border-radius: 10px;
    height: 150px; display: flex; align-items: center;
    justify-content: center; text-align: center; padding: 12px;
    font-size: 13px;
  }

  .yuklanmoqda { color: #6b7280; }
  .spinner {
    width: 26px; height: 26px; margin: 0 auto 8px;
    border: 3px solid #e5e7eb; border-top-color: #6366f1;
    border-radius: 50%; animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .kirmagan { color: #991b1b; font-weight: 600; }
  .kirgan { color: #065f46; font-weight: 600; }

  button {
    width: 100%; padding: 9px; border: none; border-radius: 8px;
    background: #6366f1; color: white; font-size: 12px;
    cursor: pointer; margin-top: 14px;
  }

  .izoh { font-size: 11px; color: #6b7280; margin-top: 12px; line-height: 1.8; }
</style>

<div class="juft">
  <div class="yarim">
    <p class="lbl yomon-lbl">❌ Ikki holat — login ekrani "chaqnaydi"</p>
    <div class="ekran" id="yomon"></div>
  </div>
  <div class="yarim">
    <p class="lbl yaxshi-lbl">✅ Uch holat — spinner ko'rinadi</p>
    <div class="ekran" id="yaxshi"></div>
  </div>
</div>

<button id="qayta">Sahifani qayta yuklash (taqlid)</button>

<p class="izoh">
  Tugmani bosing. Chap tomonda bir lahzaga <b>"Kirish kerak"</b> chiqadi,
  keyin dashboard'ga o'zgaradi.<br />
  Foydalanuvchi buni ko'radi va chalkashadi — u kirgan bo'lsa ham
  "chiqib ketdimmi?" deb o'ylaydi.
</p>

<script>
  var yomon = document.querySelector('#yomon');
  var yaxshi = document.querySelector('#yaxshi');

  function ishgaTushir() {
    // ❌ Ikki holat: boshida "kirmagan" deb hisoblaydi
    yomon.innerHTML = '<div class="kirmagan">Kirish kerak!</div>';

    // ✅ Uch holat: boshida "noma'lum"
    yaxshi.innerHTML = '<div class="yuklanmoqda"><div class="spinner"></div>Tekshirilmoqda...</div>';

    // Firebase javob berishini taqlid qilamiz (700ms)
    setTimeout(function () {
      var natija = '<div class="kirgan">✅ Xush kelibsiz!<br />' +
                   '<span style="font-size:11px;font-weight:400">ali@example.com</span></div>';
      yomon.innerHTML = natija;
      yaxshi.innerHTML = natija;
    }, 700);
  }

  document.querySelector('#qayta').addEventListener('click', ishgaTushir);
  ishgaTushir();
</script>
\`\`\`

Chap tomondagi "chaqnash" — real saytlarda ko'p uchraydigan kamchilik. U saytni **nosoz** ko'rsatadi.

Yechim oddiy: boshlang'ich holat **"kirmagan" emas, "noma'lum"** bo'lsin.

\`\`\`html
<div id="yuklanmoqda">Tekshirilmoqda...</div>
<div id="kirgan" class="yashirin">...</div>
<div id="kirmagan" class="yashirin">...</div>
\`\`\`

\`\`\`javascript
onAuthStateChanged(auth, (user) => {
  yuklanmoqda.classList.add('yashirin');   // birinchi navbatda spinnerni o'chiramiz

  if (user) {
    kirgan.classList.remove('yashirin');
    document.querySelector('#email').textContent = user.email;
  } else {
    kirmagan.classList.remove('yashirin');
  }
});
\`\`\`

HTML'da **ikkala panel ham yashirin** boshlanadi. Faqat spinner ko'rinadi.

---

## 🔄 Auth holati diagrammasi

\`\`\`text
Sahifa yuklandi
      ↓
  [noma'lum] — spinner ko'rinadi
      ↓
onAuthStateChanged chaqirildi
      ↓
   user bor?
      ├── HA ──→ Dashboard
      │            ↓ signOut() bosildi
      │       onAuthStateChanged yana chaqiriladi
      │            ↓ user = null
      └── YO'Q ─→ Login sahifasi
\`\`\`

Diqqat: \`signOut()\` dan keyin \`onAuthStateChanged\` **o'zi** chaqiriladi. Siz qo'lda UI'ni o'zgartirishingiz shart emas.

---

## 🛡 Sahifani himoyalash

Dashboard'ni faqat kirganlar ko'rishi kerak:

\`\`\`javascript
// auth-guard.js
import { getAuth, onAuthStateChanged } from '...firebase-auth.js';

export function faqatKirganlar(onUser) {
  const auth = getAuth();

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = 'login.html';
      return;
    }
    onUser(user);
  });
}

// dashboard.html da:
import { faqatKirganlar } from './auth-guard.js';

faqatKirganlar((user) => {
  document.querySelector('#email').textContent = user.email;
});
\`\`\`

Teskarisi ham kerak — kirgan odam login sahifasini ko'rmasin:

\`\`\`javascript
export function faqatKirmaganlar() {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) window.location.href = 'dashboard.html';
  });
}
\`\`\`

> ⚠️ **Muhim tushunish.** Bu yo'naltirish — **qulaylik**, xavfsizlik emas.
>
> Buzg'unchi JavaScript'ni o'chirib qo'ysa yoki DevTools bilan kodni o'zgartirsa, dashboard'ni ko'radi. Lekin u yerda **hech qanday ma'lumot bo'lmaydi** — chunki Firestore'dan ma'lumot olish uchun **Security Rules** ruxsat berishi kerak.
>
> Haqiqiy himoya serverda — 6-darsda o'rganamiz. Frontend'dagi tekshiruv faqat foydalanuvchi tajribasi uchun.

---

## 👤 user obyektida nima bor?

\`\`\`javascript
onAuthStateChanged(auth, (user) => {
  if (!user) return;

  user.uid;            // noyob ID — o'zgarmaydi
  user.email;          // email
  user.displayName;    // ism (hozircha null)
  user.photoURL;       // avatar (hozircha null)
  user.emailVerified;  // email tasdiqlanganmi
  user.metadata;       // ro'yxatdan o'tgan va oxirgi kirgan vaqt
});
\`\`\`

\`displayName\` va \`photoURL\` hozircha bo'sh. Ularni \`updateProfile()\` bilan to'ldirasiz — 11-darsda.

---

## 🥉 Bronze Topshiriq

\`dashboard.html\` yarating:

- \`onAuthStateChanged\` qo'shing
- Kirgan bo'lsa email ko'rinsin
- Kirmagan bo'lsa "Kirish kerak" yozuvi chiqsin
- Chiqish tugmasi ishlasin

---

## 🥈 Silver Topshiriq

Uchta sahifa: \`login.html\`, \`register.html\`, \`dashboard.html\`

- **Uch holat** to'g'ri ishlansin — spinner "chaqnash"ni oldini olsin
- Kirmaganlar dashboard'dan login'ga yo'naltirilsin
- Kirganlar login'dan dashboard'ga yo'naltirilsin

---

## 🥇 Gold Topshiriq

- \`auth-guard.js\` yordamchi fayli yarating
- \`faqatKirganlar()\` va \`faqatKirmaganlar()\` funksiyalari bo'lsin
- Har sahifada shu funksiyani chaqiring
- Dashboard'da \`user.metadata\` dan ro'yxatdan o'tgan sanani ko'rsating

---

## ✅ Dars Xulosa

- \`signInWithEmailAndPassword(auth, email, parol)\` — kirish
- \`signOut(auth)\` — chiqish
- \`onAuthStateChanged\` — **kuzatuvchi**, har o'zgarishda ishlaydi
- **Uch holat**: noma'lum → kirgan / kirmagan
- Boshlang'ich holat "kirmagan" **emas**, "noma'lum"
- \`signOut()\` dan keyin listener o'zi chaqiriladi
- Yo'naltirish — qulaylik, **haqiqiy himoya Security Rules'da** (6-dars)
- Kirishda asosiy xato kodi — \`auth/invalid-credential\`

> 🚀 **Keyingi dars:** Firestore — ma'lumotlar bazasi!
`,
    teacher: `
## 💡 Bu darsning asosiy g'oyasi — uchinchi holat

Notion sahifasidagi kod **to'g'ri** — u \`#yuklanmoqda\` elementini ishlatadi. Lekin **nima uchun kerakligi** tushuntirilmagan.

Natijada bola kodni ko'chiradi, keyin o'z loyihasida spinnerni tushirib qoldiradi va "chaqnash" muammosi paydo bo'ladi. Sababini bilmagani uchun tuzata olmaydi.

Darsda bu alohida bo'lim qilindi va **yonma-yon demo** qo'shildi: chap tomonda login ekrani chaqnaydi, o'ngda spinner ko'rinadi.

**Sinfda ko'rsating:** tugmani bir necha marta bosing. Bolalar chaqnashni sezadi va "bu men ko'rgan saytlarda ham bor edi" deb tan oladi.

Qoida oddiy: **boshlang'ich holat "kirmagan" emas, "noma'lum" bo'lsin.** HTML'da ikkala panel ham yashirin, faqat spinner ko'rinadi.

---

## ⚠️ Xato kodlari (2-darsdagi bir xil muammo)

Asl sahifada kirish xatolari uchun \`auth/user-not-found\` va \`auth/wrong-password\` yozilgan. Bular **yangi Firebase loyihalarida ishlamaydi** — Email Enumeration Protection tufayli ikkala holat uchun ham \`auth/invalid-credential\` keladi.

Bu yerda tuzatildi. Notion'dagi asl sahifani ham tuzatish kerak.

---

## ⚠️ Qo'shilgan muhim ogohlantirish

Asl sahifada yo'q, lekin **konseptual jihatdan zarur**:

Frontend'dagi \`window.location.href = 'login.html'\` — bu **xavfsizlik emas**. Buzg'unchi JavaScript'ni o'chirsa yoki DevTools bilan kodni o'zgartirsa, dashboard'ni ko'radi.

Lekin u yerda ma'lumot bo'lmaydi — chunki Firestore'dan o'qish uchun **Security Rules** ruxsat berishi kerak.

**Nima uchun buni hozir aytish kerak:** aks holda bola "men himoyaladim" deb o'ylaydi va 6-darsdagi Security Rules'ni **ortiqcha ish** deb qabul qiladi. Bu — 1-darsdagi API kaliti bilan bir xil xato.

Bu ikkita ogohlantirish (1-dars va bu) 6-darsga **ko'prik** vazifasini bajaradi.

---

## 🗒 Notion'dagi mayda xatolar

- Diagrammada "Login sahifasiga **yo't**" — "yo'naltir" bo'lishi kerak
- "Chiqish" sarlavhasi oldida g'alati belgi (\`🙪\`) — \`🚪\` bo'lishi kerak edi
- SDK versiyasi \`10.7.0\` qattiq yozilgan

---

## 💡 O'qituvchi uchun

- **\`onAuthStateChanged\` kuzatuvchi ekanini** ta'kidlang. Bolalar uni oddiy \`if\` deb tushunadi va bir marta ishlaydi deb o'ylaydi. Ko'rsating: \`signOut()\` bosilganda u **yana** chaqiriladi, siz hech narsa qilmasdan.
- Demoni ikki brauzer oynasida sinang: birida chiqing, ikkinchisi **o'zi** login sahifasiga qaytadi. Bu ta'sirli.
- **Yo'naltirish xavfsizlik emasligini** aniq ayting. Bolaga DevTools'da \`<div id="kirgan">\` dan \`hidden\` klassini olib tashlashni ko'rsating — dashboard ko'rinadi, lekin bo'sh. Bu — 6-darsga eng yaxshi kirish.
- \`user\` obyektidagi maydonlarni konsolda ko'rsating: \`console.log(user)\`. Bolalar \`displayName: null\` ni ko'radi va "nega bo'sh?" deb so'raydi — 11-darsga qiziqish uyg'onadi.

## ⚠️ Ko'p uchraydigan xatolar

- **Login ekrani chaqnaydi** — uchinchi holat yo'q. Eng ko'p uchraydigan.
- **\`onAuthStateChanged\` tashqarisida UI o'zgartirish** — masalan \`signIn\` dan keyin qo'lda panel ochish. Keyin holat ikki joyda boshqariladi va chalkashadi.
- **Cheksiz yo'naltirish** — \`login.html\` da \`faqatKirganlar()\` chaqirilgan. Sahifa o'zini o'ziga yo'naltiradi.
- **\`signOut\` dan keyin \`window.location\` yozilmagan** — foydalanuvchi dashboard'da qoladi (garchi listener UI'ni o'zgartirsa ham).
- **Xato kodlari eskirgan** — yuqorida.
- **\`auth\` har faylda qayta yaratilgan** — ishlaydi, lekin config takrorlanadi. \`firebase-config.js\` ga chiqarish kerak.

## 📊 Daraja belgilash

- **Bronze** — dashboard'da email ko'rinadi, chiqish ishlaydi
- **Silver** — uch sahifa, **spinner bor**, yo'naltirish ikki tomonlama
- **Gold** — \`auth-guard.js\` yozilgan, har sahifada ishlatilgan

> Silver'ni tekshirishning aniq usuli: dashboard'ni oching va **sahifani yangilang**. Login ekrani bir lahzaga chaqnasa — uchinchi holat yo'q.
`,
  },

  // ═══════════════════════════════════════════════════════════
  'junior.m3.l2': {
    goal: "createUserWithEmailAndPassword bilan ro'yxatdan o'tish va Firebase xatolarini boshqarish.",
    student: `
## 🔐 Ro'yxatdan o'tish qanday ishlaydi?

\`\`\`text
Foydalanuvchi  →  email + parol kiritadi
               →  createUserWithEmailAndPassword(auth, email, parol)
               →  Firebase tekshiradi:
                     · Email formati to'g'rimi?
                     · Bu email allaqachon bormi?
                     · Parol 6 belgidan uzunmi?
               →  ✅ UserCredential qaytaradi
               →  ❌ yoki xato tashlaydi
\`\`\`

Muhimi: **parolni siz saqlamaysiz**. U Firebase serverida shifrlanadi va siz uni hech qachon ko'rmaysiz — hatto Firebase Console'da ham.

---

## 📦 Import va asosiy kod

\`\`\`javascript
import { getAuth, createUserWithEmailAndPassword }
  from 'https://www.gstatic.com/firebasejs/VERSIYA/firebase-auth.js';

const auth = getAuth(app);

try {
  const natija = await createUserWithEmailAndPassword(auth, email, parol);
  const user = natija.user;

  console.log(user.email);   // kiritilgan email
  console.log(user.uid);     // noyob ID — juda muhim

} catch (xato) {
  console.error(xato.code);  // masalan: "auth/email-already-in-use"
}
\`\`\`

\`user.uid\` — **noyob identifikator**. Har foydalanuvchida boshqacha va u hech qachon o'zgarmaydi.

Keyingi darslarda ma'lumotlarni aynan shu \`uid\` bilan bog'laysiz: "bu xabarni kim yozdi?" degan savolga javob shu.

---

## ⚠️ Xato kodlari — eng muhim qism

Firebase xatoni \`error.code\` da beradi. Uni **o'zbek tiliga o'girish** sizning vazifangiz — foydalanuvchi \`auth/weak-password\` degan matnni tushunmaydi.

\`\`\`demo h=420 "Xato kodlarini sinab ko'ring"
<style>
  * { box-sizing: border-box; }
  body { font-family: sans-serif; font-size: 13px; margin: 0; padding: 14px; }

  .forma { max-width: 340px; }
  .maydon { margin-bottom: 10px; }
  label { display: block; font-size: 11px; font-weight: 600; color: #374151; margin-bottom: 3px; }
  input {
    width: 100%; padding: 9px 11px; font-size: 13px;
    border: 2px solid #e5e7eb; border-radius: 8px; outline: none;
  }
  input:focus { border-color: #6366f1; }

  button {
    width: 100%; padding: 10px; border: none; border-radius: 8px;
    background: #6366f1; color: white; font-size: 13px;
    font-weight: 600; cursor: pointer;
  }
  button:disabled { background: #d1d5db; cursor: not-allowed; }

  #natija {
    margin-top: 12px; padding: 11px; border-radius: 8px;
    font-size: 12px; min-height: 44px; line-height: 1.6;
  }
  #natija.ok { background: #ecfdf5; border: 1px solid #a7f3d0; color: #065f46; }
  #natija.xato { background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; }
  .kod { font-family: monospace; font-size: 11px; opacity: 0.75; }

  .maslahat {
    margin-top: 12px; font-size: 11px; color: #6b7280; line-height: 1.8;
    background: #f9fafb; border-radius: 8px; padding: 10px;
  }
  .maslahat code { background: #e5e7eb; padding: 1px 5px; border-radius: 3px; font-size: 10px; }
</style>

<div class="forma">
  <div class="maydon">
    <label>Email</label>
    <input id="email" value="yangi@example.com" />
  </div>
  <div class="maydon">
    <label>Parol</label>
    <input id="parol" type="password" value="parol123" />
  </div>
  <button id="btn">Ro'yxatdan o'tish</button>
  <div id="natija"></div>

  <div class="maslahat">
    <b>Sinab ko'ring:</b><br />
    · <code>band@example.com</code> — email band<br />
    · <code>notogri</code> — email formati<br />
    · parolni <code>123</code> qiling — zaif parol<br />
    · <code>offline@example.com</code> — internet yo'q
  </div>
</div>

<script>
  // Soxta Firebase — haqiqiy Auth bu oynachada ishlamaydi
  function soxtaRoyxat(email, parol) {
    return new Promise(function (bajar, rad) {
      setTimeout(function () {
        if (email === 'offline@example.com') {
          rad({ code: 'auth/network-request-failed' });
        } else if (!email.includes('@') || !email.includes('.')) {
          rad({ code: 'auth/invalid-email' });
        } else if (email === 'band@example.com') {
          rad({ code: 'auth/email-already-in-use' });
        } else if (parol.length < 6) {
          rad({ code: 'auth/weak-password' });
        } else {
          bajar({ user: { email: email, uid: 'uid_' + Math.random().toString(36).slice(2, 12) } });
        }
      }, 800);
    });
  }

  // Xato kodlarini o'zbek tiliga o'girish
  var xatoXabarlari = {
    'auth/email-already-in-use': 'Bu email allaqachon ro\\'yxatdan o\\'tgan. Kirishga urinib ko\\'ring.',
    'auth/invalid-email': 'Email formati noto\\'g\\'ri. Masalan: ism@example.com',
    'auth/weak-password': 'Parol juda qisqa. Kamida 6 ta belgi bo\\'lsin.',
    'auth/network-request-failed': 'Internet aloqasi yo\\'q. Ulanishni tekshiring.',
    'auth/too-many-requests': 'Juda ko\\'p urinish. Biroz kutib turing.'
  };

  var btn = document.querySelector('#btn');
  var natija = document.querySelector('#natija');

  btn.addEventListener('click', async function () {
    var email = document.querySelector('#email').value.trim();
    var parol = document.querySelector('#parol').value;

    btn.disabled = true;
    btn.textContent = 'Kutib turing...';
    natija.className = '';
    natija.textContent = '';

    try {
      var natijaObj = await soxtaRoyxat(email, parol);

      natija.className = 'ok';
      natija.innerHTML = '✅ Ro\\'yxatdan o\\'tdingiz<br />' +
        '<span class="kod">email: ' + natijaObj.user.email + '</span><br />' +
        '<span class="kod">uid: ' + natijaObj.user.uid + '</span>';

    } catch (xato) {
      var xabar = xatoXabarlari[xato.code] || 'Noma\\'lum xato yuz berdi';

      natija.className = 'xato';
      natija.innerHTML = '❌ ' + xabar + '<br />' +
        '<span class="kod">error.code: ' + xato.code + '</span>';

    } finally {
      btn.disabled = false;
      btn.textContent = "Ro'yxatdan o'tish";
    }
  });
</script>
\`\`\`

Har xatoda ikki narsa ko'rinadi: **foydalanuvchi uchun** tushunarli xabar va **siz uchun** \`error.code\`.

---

## 📋 Xato kodlari jadvali

**Ro'yxatdan o'tishda:**

| Kod | Ma'nosi |
| --- | --- |
| \`auth/email-already-in-use\` | Email allaqachon band |
| \`auth/invalid-email\` | Email formati noto'g'ri |
| \`auth/weak-password\` | Parol 6 belgidan qisqa |

**Kirishda (3-dars):**

| Kod | Ma'nosi |
| --- | --- |
| \`auth/invalid-credential\` | Email yoki parol noto'g'ri |

**Har ikkalasida:**

| Kod | Ma'nosi |
| --- | --- |
| \`auth/network-request-failed\` | Internet yo'q |
| \`auth/too-many-requests\` | Juda ko'p urinish, vaqtincha blok |

> ⚠️ **Diqqat — eskirgan ma'lumot.** Ko'p darsliklarda kirish xatolari uchun \`auth/user-not-found\` va \`auth/wrong-password\` kodlari yoziladi.
>
> Yangi Firebase loyihalarida bu kodlar **ishlamaydi**. Ular o'rniga ikkala holatda ham bitta kod keladi: \`auth/invalid-credential\`.
>
> **Nima uchun?** Bu — ataylab qilingan **xavfsizlik chorasi**.
>
> Agar dastur "bunday foydalanuvchi yo'q" va "parol noto'g'ri" deb ajratib aytsa, buzg'unchi millionlab emailni sinab, qaysilari ro'yxatdan o'tganini **aniqlab olishi** mumkin. Keyin faqat o'sha emaillar ustida ishlaydi.
>
> Bitta umumiy xabar bu imkonni yo'q qiladi. Shuning uchun foydalanuvchiga ham **"Email yoki parol noto'g'ri"** deb yozing — qaysi biri ekanini aytmang.

---

## 🏗 To'liq forma

\`\`\`javascript
const btn = document.querySelector('#btn');
const emailInput = document.querySelector('#email');
const parolInput = document.querySelector('#parol');
const xatoEl = document.querySelector('#xato');

const xatoXabarlari = {
  'auth/email-already-in-use': "Bu email allaqachon ro'yxatdan o'tgan",
  'auth/invalid-email': 'Email formati noto\\'g\\'ri',
  'auth/weak-password': 'Parol kamida 6 ta belgi bo\\'lsin',
  'auth/network-request-failed': 'Internet aloqasini tekshiring'
};

btn.addEventListener('click', async () => {
  const email = emailInput.value.trim();
  const parol = parolInput.value;

  // 1. Mahalliy tekshiruv — serverga bormasdan
  if (!email || parol.length < 6) {
    xatoEl.textContent = 'Barcha maydonlarni to\\'g\\'ri to\\'ldiring';
    return;
  }

  // 2. Tugmani o'chirish
  btn.disabled = true;
  btn.textContent = 'Kutib turing...';
  xatoEl.textContent = '';

  try {
    const natija = await createUserWithEmailAndPassword(auth, email, parol);
    console.log('Yaratildi:', natija.user.uid);

    window.location.href = 'dashboard.html';

  } catch (xato) {
    xatoEl.textContent = xatoXabarlari[xato.code] || 'Xato yuz berdi';
    console.error(xato.code);

  } finally {
    btn.disabled = false;
    btn.textContent = "Ro'yxatdan o'tish";
  }
});
\`\`\`

Uchta naqsh 2-Modulning 18-darsidan keldi:

- **Tugmani o'chirish** — ikki marta bosilmasin
- **\`try/catch/finally\`** — xatoni ushlash, tugmani qaytarish
- **Uch holat** — yuklanmoqda, muvaffaqiyat, xato

Yangi narsa faqat bitta: **mahalliy tekshiruv**. Parol 6 belgidan qisqa ekanini bilib turib serverga so'rov yuborish — vaqt isrofi. Buni oldindan tekshiring.

---

## 🔍 Console'da tekshirish

Firebase Console → **Authentication** → **Users**

Yangi foydalanuvchi ro'yxatda ko'rinadi: email, **UID**, ro'yxatdan o'tgan sana.

Parol ko'rinmaydi — u shifrlangan va hech kim, hatto siz ham uni o'qiy olmaysiz.

---

## 🥉 Bronze Topshiriq

- Email, parol va tugmadan iborat forma yarating
- \`createUserWithEmailAndPassword\` bilan ro'yxatdan o'ting
- Firebase Console'da yangi foydalanuvchini ko'ring

---

## 🥈 Silver Topshiriq

To'rtta xato holatini sinab ko'ring va **har biriga o'zbekcha xabar** yozing:

- Bo'sh forma
- Noto'g'ri email formati
- Qisqa parol (masalan \`123\`)
- Bir xil email bilan **ikki marta** ro'yxatdan o'tish

---

## 🥇 Gold Topshiriq

- Parol tasdiqlash maydoni (2-Modul, 17-dars naqshi)
- Tugma so'rov paytida o'chiriladi
- \`try/catch/finally\` to'liq
- Mahalliy tekshiruv — serverga behuda so'rov ketmasin
- Muvaffaqiyatdan keyin \`dashboard.html\` ga o'tish

---

## ✅ Dars Xulosa

- \`createUserWithEmailAndPassword(auth, email, parol)\`
- \`user.uid\` — noyob ID, keyingi darslarda doim kerak
- Parolni Firebase saqlaydi, siz ko'rmaysiz
- \`error.code\` ni **o'zbek tiliga** o'giring
- \`auth/invalid-credential\` — yangi umumiy kod (\`user-not-found\` emas)
- Umumiy xato xabari — bu **xavfsizlik**, dangasalik emas
- Mahalliy tekshiruv serverga behuda so'rovni oldini oladi

> 🚀 **Keyingi dars:** Kirish, chiqish va sessiya boshqaruvi!
`,
    teacher: `
## ⚠️ Notion'dagi xato kodlari eskirgan

Asl sahifadagi jadvalda ikkita kod bor:

\`\`\`text
auth/user-not-found   → Foydalanuvchi topilmadi
auth/wrong-password   → Parol noto'g'ri
\`\`\`

**Yangi Firebase loyihalarida bu kodlar kelmaydi.**

Firebase'da **Email Enumeration Protection** yoqilgan bo'lsa (yangi loyihalarda bu **standart holat**), ikkala holat uchun ham bitta kod qaytadi: \`auth/invalid-credential\`.

**Amalda bu nimani anglatadi:** bola darslikdagi jadval bo'yicha kod yozadi:

\`\`\`javascript
if (error.code === 'auth/wrong-password') { ... }   // hech qachon ishlamaydi
\`\`\`

Natijada noto'g'ri parol kiritilganda **"Noma'lum xato"** chiqadi. Bola sababini topa olmaydi, chunki kodi darslikka mos.

**Nima uchun Firebase bunday qildi:** agar dastur "bunday foydalanuvchi yo'q" va "parol noto'g'ri" ni ajratib aytsa, buzg'unchi email ro'yxatini **skanerlash** orqali qaysi manzillar ro'yxatdan o'tganini aniqlaydi. Bu — *email enumeration* hujumi.

Darsda bu tushuntirildi va **pedagogik imkoniyatga** aylantirildi: noaniq xato xabari — dangasalik emas, ataylab qilingan xavfsizlik chorasi. Bolalar buni bilishi foydali.

---

## 🗒 Boshqa tuzatishlar

**SDK versiyasi** — asl sahifada \`10.7.0\` qattiq yozilgan (2023-yil). Darsda versiya raqami yozilmadi: Firebase Console joriy versiya bilan tayyor kod beradi.

**Mahalliy tekshiruv qo'shildi** — asl kodda validatsiya bor, lekin nima uchun kerakligi aytilmagan. Bu yerda sabab yozildi: parol qisqa ekanini bilib turib serverga so'rov yuborish — behuda kutish.

---

## 💡 O'qituvchi uchun

- **Xato kodlari demosi** — bu darsning eng qimmatli qismi. Bolalar odatda faqat "muvaffaqiyat" yo'lini sinaydi. Demoda to'rt xato holatini ham bosib ko'rsating.
- **\`uid\` ni alohida ta'kidlang.** U 4–6-darslarda doim kerak bo'ladi: "bu ma'lumot kimga tegishli?" degan savolga javob. Hozir tushunmasa, keyin qiynaladi.
- **Parol ko'rinmasligini** ko'rsating. Firebase Console → Users → parol ustuni yo'q. Bolalar buni hayrat bilan qabul qiladi va "parolni qanday tekshiradi?" deb so'raydi. Javob: hash (shifrlash) — batafsil tushuntirish shart emas, lekin savol yaxshi.
- **Email enumeration** mavzusi — bu bolalarning birinchi marta "hujumchi qanday o'ylaydi?" degan savolga duch kelishi. Sekin va aniq o'ting.
- Bolalar haqiqiy email ishlatadi. Ogohlantiring: **test uchun** \`test1@test.com\` kabi manzillar yetadi, Firebase tasdiqlash talab qilmaydi.

## ⚠️ Ko'p uchraydigan xatolar

- **\`auth/operation-not-allowed\`** — Console'da Email/Password yoqilmagan (1-dars). Birinchi tekshiriladigan narsa.
- **\`auth/configuration-not-found\`** — config noto'g'ri nusxalangan yoki Authentication umuman sozlanmagan.
- **\`auth\` o'zgaruvchisi uzatilmagan** — \`createUserWithEmailAndPassword(email, parol)\` xato, birinchi argument \`auth\` bo'lishi kerak.
- **\`await\` \`async\` siz** — 18-darsdagi bir xil xato.
- **Xato kodi tekshirilmagan** — \`error.message\` ko'rsatiladi va u ingliz tilida, foydalanuvchi tushunmaydi.
- **Tugma o'chirilmagan** — bola ketma-ket bosadi, bir nechta so'rov ketadi.
- **\`file://\`** — 1-darsdagi CORS muammosi.

## 📊 Daraja belgilash

- **Bronze** — ro'yxatdan o'tish ishlaydi, Console'da foydalanuvchi ko'rinadi
- **Silver** — to'rt xato holati o'zbekcha xabar bilan
- **Gold** — parol tasdiqlash, tugma o'chirish, mahalliy tekshiruv

> Silver'ni tekshirish: bir xil email bilan ikki marta ro'yxatdan o'ting. "Bu email allaqachon band" degan o'zbekcha xabar chiqdimi, yoki inglizcha \`Firebase: Error (auth/email-already-in-use)\` mi?
`,
  },

  // ═══════════════════════════════════════════════════════════
  'junior.m3.l1': {
    goal: "Firebase nima, loyiha yaratish va SDK'ni sahifaga ulash.",
    student: `
## 🔥 Firebase nima?

Hozirgacha yozgan hamma narsangiz **faqat brauzerda** yashadi. \`localStorage\` ham shunday — u faqat sizning kompyuteringizda.

Muammo shunda: agar do'stingiz saytingizni ochsa, u sizning ma'lumotingizni ko'rmaydi. Chat yozib bo'lmaydi, ro'yxatdan o'tib bo'lmaydi.

Buning uchun **server** kerak. Lekin server yozish — alohida katta kasb.

**Firebase** shu muammoni hal qiladi: Google serverni o'zi boshqaradi, siz faqat undan foydalanasiz.

\`\`\`text
Oddiy sayt:
  HTML + CSS + JS  →  faqat brauzer

Firebase bilan:
  HTML + CSS + JS  →  Firebase SDK  →  Google serverlari
                                         ├─ Foydalanuvchilar (Auth)
                                         ├─ Ma'lumotlar (Firestore)
                                         ├─ Fayllar (Storage)
                                         └─ Sayt (Hosting)
\`\`\`

Bu **BaaS** deb ataladi — *Backend as a Service*, ya'ni "xizmat sifatidagi backend".

---

## 🧰 Firebase xizmatlari

| Xizmat | Nima uchun | Qaysi darsda |
| --- | --- | --- |
| **Authentication** | Ro'yxatdan o'tish, kirish | 2–3 |
| **Firestore** | Ma'lumotlar bazasi | 4–5 |
| **Security Rules** | Kim nima qila oladi | 6 |
| **Hosting** | Saytni internetga chiqarish | 7 |
| **Storage** | Rasm va fayllar | 10 |

Bu oyda beshtasini ham ishlatasiz.

---

## 💻 Loyiha yaratish

**1-qadam — Konsolga kirish**

\`console.firebase.google.com\` ga Google akkauntingiz bilan kiring.

**2-qadam — Yangi loyiha**

- **Add project** bosing
- Nom bering (masalan \`chat-app-ismingiz\`)
- Google Analytics — **kerak emas**, o'chirib qo'ying
- **Create project**

**3-qadam — Veb ilova qo'shish**

- Loyiha sahifasida **\`</>\`** (Web) ikonini bosing
- Ilovaga nom bering
- Hosting — hozircha belgilanmasin (7-darsda qo'shamiz)
- **Register app**

Oxirida Firebase sizga **konfiguratsiya** beradi. Uni nusxalab oling.

---

## 🔗 SDK ni ulash

\`\`\`html
<!DOCTYPE html>
<html lang="uz">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Firebase Test</title>
</head>
<body>

  <h1>Firebase Test</h1>
  <p id="holat">Tekshirilmoqda...</p>

  <script type="module">
    import { initializeApp } from 'https://www.gstatic.com/firebasejs/FIREBASE_VERSIYA/firebase-app.js';
    import { getAuth } from 'https://www.gstatic.com/firebasejs/FIREBASE_VERSIYA/firebase-auth.js';
    import { getFirestore } from 'https://www.gstatic.com/firebasejs/FIREBASE_VERSIYA/firebase-firestore.js';

    const firebaseConfig = {
      apiKey: "...",
      authDomain: "loyiha-nomi.firebaseapp.com",
      projectId: "loyiha-nomi",
      storageBucket: "loyiha-nomi.appspot.com",
      messagingSenderId: "123456789",
      appId: "1:123456789:web:abcdef"
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    document.querySelector('#holat').textContent = 'Firebase ulandi ✅';
  </script>
</body>
</html>
\`\`\`

Uchta narsaga diqqat:

**1. \`type="module"\`** — majburiy. Busiz \`import\` ishlamaydi.

**2. Versiya raqami** — yuqorida \`FIREBASE_VERSIYA\` deb yozilgan. Haqiqiy raqamni **Firebase Console o'zi beradi** — ro'yxatdan o'tkazgandan keyin ko'rsatiladigan koddan nusxalang. Eski versiyani yozsangiz, ba'zi funksiyalar ishlamasligi mumkin.

**3. \`type="module"\` bilan fayl \`file://\` orqali ochilmaydi** — brauzer xavfsizlik sababli bloklaydi. VS Code'ning **Live Server** kengaytmasini ishlating (1-darsda o'rnatgansiz).

> ⚠️ \`file:///C:/.../index.html\` deb ochsangiz, konsolda **CORS xatosi** chiqadi. Bu — kodingizdagi xato emas. Live Server bilan oching.

---

## 🔑 API kaliti maxfiymi? — Muhim savol

Bu savolga ko'p darsliklarda **noto'g'ri** javob beriladi. Aniq bilib oling.

\`\`\`demo h=400 "Nima ochiq, nima maxfiy"
<style>
  * { box-sizing: border-box; }
  body { font-family: sans-serif; font-size: 13px; margin: 0; padding: 14px; }

  .juft { display: flex; gap: 12px; }
  .ustun { flex: 1; }
  .sarlavha {
    font-weight: 700; font-size: 12px; padding: 8px 10px;
    border-radius: 8px 8px 0 0;
  }
  .ochiq .sarlavha { background: #dcfce7; color: #166534; }
  .maxfiy .sarlavha { background: #fee2e2; color: #991b1b; }

  .royxat {
    border: 1px solid #e5e7eb; border-top: none;
    border-radius: 0 0 8px 8px; padding: 10px;
    font-family: monospace; font-size: 11px; line-height: 1.9;
  }
  .royxat div { color: #4b5563; }

  .izoh {
    margin-top: 14px; background: #eff6ff; border: 1px solid #bfdbfe;
    border-radius: 8px; padding: 12px; font-size: 12px; color: #1e40af;
    line-height: 1.8;
  }
</style>

<div class="juft">
  <div class="ustun ochiq">
    <div class="sarlavha">✅ OCHIQ — yashirish shart emas</div>
    <div class="royxat">
      <div>apiKey</div>
      <div>authDomain</div>
      <div>projectId</div>
      <div>storageBucket</div>
      <div>messagingSenderId</div>
      <div>appId</div>
    </div>
  </div>

  <div class="ustun maxfiy">
    <div class="sarlavha">🔒 MAXFIY — hech qachon ochmang</div>
    <div class="royxat">
      <div>Service account kaliti</div>
      <div>(serviceAccountKey.json)</div>
      <div>&nbsp;</div>
      <div>Admin SDK ma'lumotlari</div>
      <div>&nbsp;</div>
      <div>Boshqa xizmatlarning</div>
      <div>maxfiy kalitlari</div>
    </div>
  </div>
</div>

<div class="izoh">
  <b>Chap tomondagilar sizning ilovangiz brauzerda ishlashi uchun kerak.</b><br />
  Ular baribir foydalanuvchi brauzeriga yuklanadi — istagan odam DevTools orqali ko'ra oladi.<br /><br />
  Ya'ni ularni yashirishning <b>iloji yo'q</b> va shart ham emas.
</div>
\`\`\`

Firebase veb konfiguratsiyasi — bu **parol emas, manzil**. U Firebase'ga "qaysi loyihaga ulanay?" deb aytadi, xolos. U hech qanday ruxsat bermaydi.

**Haqiqiy himoya uchta narsada:**

| Himoya | Nima qiladi | Qaysi darsda |
| --- | --- | --- |
| **Security Rules** | Kim nimani o'qiy/yoza oladi | 6-dars |
| **API key cheklovi** | Kalit faqat sizning domeningizdan ishlaydi | quyida |
| **App Check** | Faqat haqiqiy ilovangizdan so'rov qabul qiladi | ilg'or daraja |

> ⚠️ **Nima uchun bu muhim?**
>
> Ko'p darsliklarda "config'ni \`.gitignore\` ga qo'shing" deyiladi. Bu **noto'g'ri va zararli**:
>
> - Xavfsizlik bermaydi — kalit baribir brauzerda ko'rinadi
> - Deploy buziladi — serverda config fayli bo'lmaydi
> - Jamoada ishlash qiyinlashadi — hamkoringiz loyihani ishga tushira olmaydi
> - **Eng yomoni:** soxta xotirjamlik beradi. Bola "men himoyalandim" deb o'ylaydi va Security Rules yozmaydi
>
> Agar Security Rules yozilmasa, kalit yashirilgan bo'lsa ham **hamma narsa ochiq** qoladi.

### API kalitini cheklash — bu foydali

Google Cloud Console → **APIs & Services** → **Credentials** → kalitni tanlang → **Application restrictions** → **Websites** → o'z domeningizni qo'shing.

Shundan keyin kalit boshqa saytdan ishlatilmaydi.

---

## 🚀 Authentication yoqish

Keyingi darsda kerak bo'ladi, hozir yoqib qo'ying:

1. Firebase Console → **Authentication**
2. **Get started**
3. **Sign-in method** tabi
4. **Email/Password** — yoqing
5. **Google** — ham yoqing (9-darsda ishlatamiz)

---

## ✅ Ulanganini tekshirish

\`\`\`javascript
const app = initializeApp(firebaseConfig);

console.log('App nomi:', app.name);                    // "[DEFAULT]"
console.log('Loyiha:', app.options.projectId);         // sizning loyiha nomi
\`\`\`

Konsolda loyiha nomi chiqsa — ulanish ishladi.

---

## 🥉 Bronze Topshiriq

- Firebase loyihasi yarating
- Veb ilova qo'shing va konfiguratsiyani oling
- HTML sahifaga SDK ni ulang
- Sahifada "Firebase ulandi ✅" yozuvi chiqsin

> ⚠️ Live Server bilan oching, \`file://\` bilan emas.

---

## 🥈 Silver Topshiriq

- \`getAuth\` va \`getFirestore\` ham ulangan bo'lsin
- Konsolga loyiha nomini chiqaring
- Authentication'da Email/Password yoqilgan bo'lsin

---

## 🥇 Gold Topshiriq

- Konfiguratsiyani alohida faylga chiqaring (\`firebase-config.js\`) va \`import\` qiling

  > Bu **tartib** uchun, xavfsizlik uchun emas. Faylni \`.gitignore\` ga **qo'shmang**.

- Google Cloud Console'da API kalitiga **domen cheklovi** qo'ying
- \`localhost\` ni ham ruxsat etilgan ro'yxatga qo'shing (aks holda mahalliy sinov ishlamaydi)

---

## ✅ Dars Xulosa

- Firebase — Google'ning backend xizmati (BaaS)
- SDK \`type="module"\` bilan ulanadi
- Versiyani **Console beradigan koddan** oling
- \`file://\` bilan ochilmaydi — Live Server kerak
- Veb konfiguratsiya **maxfiy emas** — u manzil, parol emas
- Haqiqiy himoya: **Security Rules** (6-dars) + API kalit cheklovi
- Maxfiy narsa — **service account kaliti**, uni hech qachon ochmang

> 🚀 **Keyingi dars:** Email va parol bilan ro'yxatdan o'tish!
`,
    teacher: `
## ⚠️ Notion darsida qarama-qarshilik va noto'g'ri xavfsizlik modeli

Asl sahifada ikkita bir-biriga zid gap bor:

1. *"❌ XATO: konfiguratsiyani GitHub'ga push qilish. Kimdir API kalitingizni topib, Firebase'ingizni buzishi mumkin"*
2. *"⚠️ Amalda Firebase API kalitlari brauzerda ko'rinadi. Bu normal"*

Bir sahifada "yashiring" va "yashirish mumkin emas" deyilgan. Bola qaysi biriga ishonishni bilmaydi.

**To'g'ri javob — ikkinchisi.**

Firebase rasmiy hujjatlarida aniq yozilgan: Firebase xizmatlariga cheklangan API kalitlarini **maxfiy deb hisoblash shart emas**, ularni kodda yoki konfiguratsiya faylida qoldirish **xavfsiz**. Haqiqiy himoya — **Security Rules va App Check**.

**Nima uchun bu jiddiy:**

Gold topshiriq \`.gitignore\` ni talab qiladi. Bu:

- Xavfsizlik bermaydi — kalit baribir brauzerda ko'rinadi
- Deploy'ni buzadi — serverda fayl bo'lmaydi
- Jamoada ishlashni qiyinlashtiradi
- **Eng yomoni:** soxta xotirjamlik beradi. Bola "himoyalandim" deb o'ylaydi va 6-darsdagi Security Rules'ga jiddiy qaramaydi

Agar Security Rules yozilmasa, kalit yashirilgan bo'lsa ham ma'lumotlar **butunlay ochiq** qoladi. Bu — Firebase loyihalaridagi eng ko'p uchraydigan xavfsizlik muammosi.

**Qanday tuzatildi:**

- Ochiq va maxfiy ma'lumotlar jadval bilan ajratildi
- Haqiqiy himoya uchta vositada ekani ko'rsatildi
- Gold topshiriq **API kalit cheklovi** ga o'zgartirildi (bu haqiqatan foydali)
- Config'ni alohida faylga chiqarish qoldirildi, lekin **"tartib uchun, xavfsizlik uchun emas"** deb aniqlashtirildi

Notion'dagi asl sahifani ham tuzatish kerak.

---

## 🗒 Boshqa tuzatishlar

**1. SDK versiyasi qattiq yozilgan** — asl sahifada \`10.7.0\`. Bu 2023-yil versiyasi. Eskirgan versiya bilan ba'zi funksiyalar ishlamasligi mumkin.

Yechim: versiya raqami darsga yozilmadi. Firebase Console ro'yxatdan o'tkazgandan keyin **joriy versiya bilan** tayyor kod beradi — o'shani ishlatish kerak. Bu dars eskirmaydi.

**2. \`file://\` muammosi tushuntirilmagan** — \`type="module"\` bilan fayl to'g'ridan-to'g'ri ochilmaydi, CORS xatosi chiqadi. Bu — darsning **birinchi 10 daqiqasida** hamma bolada chiqadigan muammo. Alohida ogohlantirish qo'shildi.

---

## 💡 O'qituvchi uchun

- **Darsdan oldin o'zingiz bir marta o'ting.** Firebase Console interfeysi tez-tez o'zgaradi; skrinshot emas, jonli ko'rsating.
- **Live Server** ni birinchi navbatda tekshiring. \`file://\` bilan ochgan bola CORS xatosini ko'radi va "Firebase ishlamayapti" deb o'ylaydi.
- **API kalit mavzusini** jiddiy o'ting. Bu — bolalarning birinchi marta haqiqiy xavfsizlik bilan to'qnashishi. Noto'g'ri model o'rgatilsa, keyin uni tuzatish qiyin.
- Savol bering: *"Agar kalit yashirilgan bo'lsa, lekin Security Rules yozilmagan bo'lsa — ma'lumotlar himoyalanganmi?"* Javob: yo'q. Bu — 6-darsga ko'prik.
- Google akkaunt bo'lmagan bolalar bo'ladi. Buni **oldindan** hal qiling — ota-onasi bilan yoki markaz akkaunti bilan.

## ⚠️ Ko'p uchraydigan xatolar

- **\`file://\` bilan ochish** — CORS xatosi. Eng ko'p uchraydigan.
- **\`type="module"\` unutilgan** — \`import\` ishlamaydi, \`SyntaxError\`.
- **Config noto'g'ri nusxalangan** — vergul yoki qo'shtirnoq tushib qolgan.
- **Authentication yoqilmagan** — 2-darsda \`auth/operation-not-allowed\` xatosi chiqadi va sabab tushunarsiz bo'ladi.
- **Internet sekin** — SDK CDN'dan yuklanadi. Sinf internetini oldindan tekshiring.
- **Loyiha nomi band** — Firebase global unikal nom talab qiladi. Ismni qo'shishni maslahat bering.

## 📊 Daraja belgilash

- **Bronze** — sahifada "Firebase ulandi" yozuvi chiqadi
- **Silver** — auth va Firestore ham ulangan, Email/Password yoqilgan
- **Gold** — config alohida faylda, API kalitga domen cheklovi qo'yilgan

> Gold'ni tekshirish: Google Cloud Console'da kalitning **Application restrictions** bo'limiga qarang. "None" bo'lsa — bajarilmagan.
`,
  },
};
