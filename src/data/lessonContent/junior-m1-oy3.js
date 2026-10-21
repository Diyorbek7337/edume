// Junior kursi — 1-Modul, 3-oy (25–36-darslar)
//
// Qoida oldingi fayllardagidek: student va teacher ALOHIDA maydonlarda.

export const JUNIOR_M1_OY3_CONTENT = {
  // ═══════════════════════════════════════════════════════════
  'junior.m1.l25': {
    goal: "Sahifa scroll qilinganda elementlar ko'ringan sari animatsiya bilan paydo bo'lishi.",
    student: `
## 👁️ Muammo

Sahifa ochilganda hamma element bir vaqtda paydo bo'ladi. Pastdagi bo'limlar esa foydalanuvchi ularni ko'rmasidan ancha oldin "animatsiya qilib bo'lgan" bo'ladi.

Yaxshi sayt boshqacha ishlaydi: element **ekranga kirganda** jonlanadi. Bu foydalanuvchi diqqatini boshqaradi va sayt tirik tuyuladi.

---

## ✨ CSS bilan scroll animatsiyasi

Ilgari buning uchun JavaScript kerak edi. Endi CSS o'zi hal qiladi — \`animation-timeline\` orqali.

\`\`\`css
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(40px); }
  to   { opacity: 1; transform: translateY(0); }
}

.animate {
  animation: fadeInUp linear both;
  animation-timeline: view();          /* vaqt emas — SCROLL boshqaradi */
  animation-range: entry 0% cover 35%; /* qachon boshlanib, qachon tugasin */
}
\`\`\`

Odatdagi animatsiyada vaqt o'tishi bilan kadrlar almashadi. Bu yerda esa **scroll pozitsiyasi** vaqt o'rnini bosadi.

\`\`\`demo h=380 "Ichkariga scroll qiling — elementlar jonlanadi"
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: sans-serif; font-size: 13px; padding: 16px; }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(40px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .karta {
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    border-radius: 12px;
    padding: 22px;
    margin-bottom: 18px;

    animation: fadeInUp linear both;
    animation-timeline: view();
    animation-range: entry 0% cover 35%;
  }

  .karta b { display: block; color: #1e40af; margin-bottom: 4px; }
  .intro { color: #6b7280; margin-bottom: 16px; }
</style>

<p class="intro">⬇️ Shu oynachani pastga scroll qiling</p>

<div class="karta"><b>Birinchi</b>Men ekranga kirganimda paydo bo'ldim</div>
<div class="karta"><b>Ikkinchi</b>Men ham</div>
<div class="karta"><b>Uchinchi</b>Har biri o'z navbatida</div>
<div class="karta"><b>To'rtinchi</b>Scroll'ni orqaga suring — qaytadan ko'rasiz</div>
<div class="karta"><b>Beshinchi</b>JavaScript yozilmagan</div>
<div class="karta"><b>Oltinchi</b>Faqat uch qator CSS</div>
\`\`\`

Uch qator butun ishni qildi:

| Qator | Vazifasi |
| --- | --- |
| \`animation: fadeInUp linear both\` | Qaysi animatsiya. \`both\` — boshida ham, oxirida ham holatni saqlaydi |
| \`animation-timeline: view()\` | Vaqt emas, **scroll** boshqarsin |
| \`animation-range: entry 0% cover 35%\` | Element ko'rina boshlaganda boshlansin, 35% ko'ringanda tugasin |

> ⚠️ \`both\` bo'lmasa element animatsiyadan oldin **to'liq ko'rinib** turadi va effekt yo'qoladi.

---

## 🎚️ animation-range — qachon boshlansin?

\`\`\`demo h=380 "Uchta turli oraliq"
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: sans-serif; font-size: 12px; padding: 14px; }

  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-50px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .row {
    background: #f5f3ff; border: 1px solid #ddd6fe;
    border-radius: 10px; padding: 18px; margin-bottom: 16px;
    animation: slideIn linear both;
    animation-timeline: view();
  }

  .r1 { animation-range: entry 0% entry 100%; }    /* tez tugaydi */
  .r2 { animation-range: entry 0% cover 40%; }     /* o'rtacha */
  .r3 { animation-range: entry 0% cover 80%; }     /* sekin, uzoq */

  code { font-family: monospace; color: #6d28d9; }
  .intro { color: #6b7280; margin-bottom: 14px; }
</style>

<p class="intro">⬇️ Sekin scroll qiling va farqni kuzating</p>

<div class="row"><code>entry 0% entry 100%</code> — tez tugaydi</div>
<div class="row r1"><code>entry 0% entry 100%</code></div>
<div class="row r2"><code>entry 0% cover 40%</code> — o'rtacha</div>
<div class="row r3"><code>entry 0% cover 80%</code> — sekin, uzoqroq davom etadi</div>
<div class="row r1"><code>tez</code></div>
<div class="row r3"><code>sekin</code></div>
\`\`\`

- \`entry\` — element ekranga **kira boshlagan** payt
- \`cover\` — element ekranni qanchalik egallagani
- \`exit\` — element ekrandan **chiqa boshlagan** payt

Boshlash uchun \`entry 0% cover 35%\` yetarli. Qolganini keyinroq sinab ko'rasiz.

---

## 🌊 Stagger — ketma-ket paydo bo'lish

Bir nechta element bir vaqtda chiqsa, effekt yo'qoladi. Har biriga kichik kechikish bersangiz — to'lqin hosil bo'ladi.

\`\`\`demo h=380 "animation-delay bilan to'lqin"
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: sans-serif; font-size: 12px; padding: 14px; }

  @keyframes popIn {
    from { opacity: 0; transform: scale(0.85) translateY(20px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }

  .spacer { height: 160px; display: flex; align-items: center;
            color: #6b7280; }

  .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }

  .item {
    background: #ecfdf5; border: 1px solid #a7f3d0;
    border-radius: 10px; padding: 20px 10px; text-align: center;
    color: #065f46; font-weight: 600;

    animation: popIn linear both;
    animation-timeline: view();
    animation-range: entry 0% cover 30%;
  }

  /* Har biri biroz kechroq */
  .item:nth-child(2) { animation-delay: 0.08s; }
  .item:nth-child(3) { animation-delay: 0.16s; }
  .item:nth-child(4) { animation-delay: 0.24s; }
  .item:nth-child(5) { animation-delay: 0.32s; }
  .item:nth-child(6) { animation-delay: 0.40s; }
</style>

<div class="spacer">⬇️ Pastga scroll qiling</div>

<div class="grid">
  <div class="item">1</div>
  <div class="item">2</div>
  <div class="item">3</div>
  <div class="item">4</div>
  <div class="item">5</div>
  <div class="item">6</div>
</div>

<div class="spacer">Scroll'ni orqaga surib qayta ko'ring</div>
\`\`\`

> 💡 Kechikish **kichik** bo'lsin: 0.05–0.1s. Kattaroq qiymatda foydalanuvchi kutib qoladi va bezovta bo'ladi.

---

## 📊 Progress bar animatsiyasi

Ko'nikmalar bo'limi uchun klassik effekt — chiziq ko'ringanda to'ladi:

\`\`\`demo h=380 "Ko'nikmalar — scroll bilan to'ladi"
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: sans-serif; font-size: 13px; padding: 16px; }

  .spacer { height: 150px; color: #6b7280; display: flex; align-items: center; }

  .konikma { margin-bottom: 18px; }

  .konikma-nomi {
    display: flex; justify-content: space-between;
    font-weight: 600; margin-bottom: 6px; font-size: 13px;
  }
  .konikma-nomi span { color: #6366f1; }

  .progress-bar {
    height: 9px; background: #e9ecef;
    border-radius: 5px; overflow: hidden;
  }

  @keyframes fill {
    from { width: 0; }
    to   { width: var(--w); }
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #6366f1, #8b5cf6);
    border-radius: 5px;
    width: 0;

    animation: fill linear both;
    animation-timeline: view();
    animation-range: entry 0% cover 45%;
  }
</style>

<div class="spacer">⬇️ Pastga scroll qiling</div>

<div class="konikma">
  <div class="konikma-nomi"><span>HTML / CSS</span><span>95%</span></div>
  <div class="progress-bar"><div class="progress-fill" style="--w: 95%"></div></div>
</div>

<div class="konikma">
  <div class="konikma-nomi"><span>Flexbox / Grid</span><span>85%</span></div>
  <div class="progress-bar"><div class="progress-fill" style="--w: 85%"></div></div>
</div>

<div class="konikma">
  <div class="konikma-nomi"><span>Responsive</span><span>75%</span></div>
  <div class="progress-bar"><div class="progress-fill" style="--w: 75%"></div></div>
</div>

<div class="konikma">
  <div class="konikma-nomi"><span>JavaScript</span><span>20%</span></div>
  <div class="progress-bar"><div class="progress-fill" style="--w: 20%"></div></div>
</div>

<div class="spacer">Yana pastga...</div>
\`\`\`

Bu yerda 17-darsdagi CSS o'zgaruvchilar ish berdi: har chiziqqa \`style="--w: 95%"\` yoziladi va \`@keyframes\` uni \`var(--w)\` orqali o'qiydi. Bitta animatsiya — har xil qiymat.

---

## ♿ prefers-reduced-motion

18-darsdagi qoida bu yerda ham amal qiladi — hatto muhimroq. Scroll animatsiyalari vestibulyar buzilishi bor odamlar uchun eng noqulay turdagi harakat:

\`\`\`css
@media (prefers-reduced-motion: reduce) {
  .animate,
  .progress-fill {
    animation: none;
    opacity: 1;
    transform: none;
    width: var(--w);
  }
}
\`\`\`

Diqqat qiling: animatsiyani shunchaki o'chirish yetarli emas. \`opacity: 1\` va \`width\` ni ham qaytarish kerak, aks holda element **umuman ko'rinmay qoladi**.

---

## 🥉 Bronze Topshiriq

Portfolio saytingizdagi loyiha kartochkalariga scroll animatsiyasini qo'shing: pastdan yuqoriga siljib paydo bo'lsin.

---

## 🥈 Silver Topshiriq

- Kartochkalarga stagger qo'shing (\`animation-delay\` bilan)
- Ko'nikmalar bo'limiga progress bar animatsiyasi
- \`animation-range\` ni sozlab, animatsiya juda tez yoki juda sekin bo'lmasin

---

## 🥇 Gold Topshiriq

- Har bo'limda **boshqa** animatsiya: hero — pastdan, ko'nikmalar — chapdan, loyihalar — kattalashib
- \`prefers-reduced-motion\` to'liq hisobga olingan (elementlar ko'rinib qolsin, yo'qolmasin)
- Sayt bo'ylab bitta ham "sakrash" yoki g'alati harakat yo'q

---

## ✅ Dars Xulosa

- \`animation-timeline: view()\` — vaqt o'rniga scroll boshqaradi
- \`animation-range\` — qachon boshlanib qachon tugashi
- \`both\` fill-mode **majburiy**, aks holda effekt yo'qoladi
- \`animation-delay\` bilan stagger — 0.05–0.1s yetarli
- CSS o'zgaruvchilar bilan har elementga alohida qiymat
- \`prefers-reduced-motion\` da elementlar **ko'rinib qolishi** kerak

> 🚀 **Keyingi dars:** CSS Scroll Snap — slider va karusel!
`,
    teacher: `
## ⚠️ Bu dars qayta yozildi — sababi

Asl Notion sahifasi **IntersectionObserver** API'siga qurilgan. Bu — JavaScript, va u bu dasturda 34-darsdan boshlanadi. Ya'ni bu dars 9 dars erta kelgan.

Farqi oldingi holatlardan jiddiyroq: bu yerda JavaScript topshiriqning bir qismi emas, **darsning butun mavzusi** edi.

**Yechim:** dars \`animation-timeline: view()\` — CSS scroll-driven animations asosida qayta yozildi. Bu:

- Bir xil natija beradi (element ko'ringanda animatsiya)
- Kod ancha qisqa — uch qator CSS
- 2026-yilda barcha asosiy brauzerlarda ishlaydi (Chrome 115+, Firefox 126+, Safari 17.2+)
- Bola hozirgi bilimiga mos

**IntersectionObserver'ni butunlay tashlab yubormang.** U hali ham kerak: eski brauzerlar uchun, va scroll'dan boshqa vazifalar uchun (masalan "foydalanuvchi bu reklamani ko'rdimi?"). Uni **5-oyda**, DOM darslaridan keyin bering. O'shanda bola shu darsdagi CSS variantini eslaydi va ikkalasini taqqoslaydi — bu juda kuchli dars bo'ladi.

---

## 💡 O'qituvchi uchun

- \`animation-timeline\` yangi tushuncha va bolalarga g'alati tuyuladi. Oddiy tushuntirish: "**odatdagi animatsiyani vaqt haydaydi. Bunisini esa sichqoncha g'ildiragi haydaydi.**"
- \`both\` ni ataylab olib tashlab ko'rsating. Element animatsiyadan oldin to'liq ko'rinib turadi va effekt yo'qoladi. Bir marta ko'rgan bola buni unutmaydi.
- \`animation-range\` ni birinchi darsda chuqurlashtirmang. \`entry 0% cover 35%\` ni tayyor retsept sifatida bering. Qiziqqan bola o'zi tajriba qiladi.
- Bu dars bolalarni juda qiziqtiradi va ular **hamma joyga** animatsiya qo'yishni boshlaydi. Qoida o'rnating: bir bo'limda bitta animatsiya turi.

## ⚠️ Ko'p uchraydigan xatolar

- **Animatsiya umuman ishlamayapti** — \`animation-timeline\` yozilgan, lekin \`animation\` (yoki \`animation-name\`) yo'q. Ikkalasi kerak.
- **Element boshidan ko'rinib turibdi** — \`both\` yozilmagan.
- **Element animatsiyadan keyin yo'qolib ketdi** — \`both\` o'rniga \`forwards\` yoki hech narsa yozilgan.
- **Progress bar to'lmayapti** — \`--w\` o'zgaruvchisi inline \`style\` da berilmagan yoki \`@keyframes\` da \`var(--w)\` o'rniga qattiq qiymat yozilgan.
- **prefers-reduced-motion da hamma narsa yo'qolgan** — faqat \`animation: none\` yozilgan, \`opacity\` va \`transform\` qaytarilmagan. Bu — **jiddiy xato**: animatsiyani o'chirgan foydalanuvchi bo'sh sahifa ko'radi.

## 📊 Daraja belgilash

- **Bronze** — kartochkalar scroll bilan paydo bo'ladi, both bor
- **Silver** — stagger va progress bar ishlaydi, tezlik mos
- **Gold** — turli bo'limda turli animatsiya, prefers-reduced-motion **to'g'ri** (elementlar ko'rinadi)

> Gold'ni tekshirish: DevTools → Rendering → Emulate \`prefers-reduced-motion: reduce\`. Sahifa bo'sh bo'lib qolsa — bajarilmagan.
`,
  },

  // ═══════════════════════════════════════════════════════════
  'junior.m1.l27': {
    goal: "clamp(), min(), max() funksiyalari — media query'siz moslashuvchi o'lchamlar.",
    student: `
## 📏 clamp() — uchta qiymat, bittasi tanlanadi

\`\`\`css
font-size: clamp(minimum, moslashuvchi, maksimum);
\`\`\`

Brauzer o'rtadagi qiymatni hisoblaydi. Agar u minimumdan kichik bo'lsa — minimum olinadi. Maksimumdan katta bo'lsa — maksimum.

\`\`\`css
h1 {
  font-size: clamp(24px, 5vw, 64px);
}
\`\`\`

- Telefonda \`5vw\` juda kichik chiqadi → **24px** ishlatiladi
- Planshetda \`5vw\` oraliqda → **o'sha qiymat** ishlatiladi
- Katta monitorda \`5vw\` juda katta → **64px** da to'xtaydi

\`\`\`demo responsive h=280 "Kenglik tugmalarini bosing"
<style>
  body { font-family: sans-serif; margin: 0; padding: 18px; }

  .qatiy {
    font-size: 48px;
    margin: 0 0 4px;
    line-height: 1.1;
  }

  .fluid {
    font-size: clamp(22px, 6vw, 48px);
    margin: 0 0 4px;
    line-height: 1.1;
  }

  .lbl { font-family: monospace; font-size: 11px; color: #6b7280; margin: 0 0 14px; }
  .box { padding: 12px; border-radius: 10px; margin-bottom: 12px; }
  .b1 { background: #fef2f2; border: 1px solid #fecaca; }
  .b2 { background: #ecfdf5; border: 1px solid #a7f3d0; }
</style>

<div class="box b1">
  <h2 class="qatiy">Qat'iy sarlavha</h2>
  <p class="lbl">font-size: 48px — 375px da ekrandan chiqib ketadi</p>
</div>

<div class="box b2">
  <h2 class="fluid">Moslashuvchi sarlavha</h2>
  <p class="lbl">clamp(22px, 6vw, 48px) — har kenglikda mos</p>
</div>
\`\`\`

**375px** tugmasini bosing: birinchi sarlavha ekranga sig'may qoladi, ikkinchisi kichrayadi.

---

## ⚠️ Muhim: faqat vw ishlatmang

Yuqoridagi misolda bitta kamchilik bor va u **jiddiy**.

Ko'zi ojiz yoki yaxshi ko'rmaydigan foydalanuvchilar brauzer sozlamalarida shrift o'lchamini kattalashtiradi. Agar sizning shriftingiz **faqat \`vw\`** ga bog'liq bo'lsa — u **o'zgarmaydi**. Foydalanuvchi shriftni kattalashtiradi, lekin sayt e'tibor bermaydi.

Yechim: o'rtadagi qiymatga \`rem\` qo'shish.

\`\`\`css
/* ❌ Zoom ishlamaydi */
font-size: clamp(24px, 5vw, 64px);

/* ✅ Zoom ishlaydi */
font-size: clamp(1.5rem, 1rem + 3vw, 4rem);
\`\`\`

\`1rem + 3vw\` — bu ikkalasining yig'indisi. \`rem\` qismi foydalanuvchi sozlamasiga javob beradi, \`vw\` qismi ekranga moslashadi.

> 💡 Qoida: \`clamp()\` ning **o'rtasida har doim \`rem\` bo'lsin**. Toza \`vw\` — faqat bezak elementlarda (masalan katta dekorativ raqamlarda) mumkin.

---

## 🧮 vw qanday hisoblanadi?

\`1vw\` = ekran kengligining **1%**.

| Ekran | \`5vw\` nechchi px |
| --- | --- |
| 375px (telefon) | 18.75px |
| 768px (planshet) | 38.4px |
| 1440px (laptop) | 72px |

Shuning uchun \`clamp(24px, 5vw, 64px)\` da telefonda 24px, laptopda 64px chiqadi — o'rtadagi qiymat chegaralarga urилади.

---

## 📐 Nafaqat shrift uchun

\`clamp()\` istalgan o'lcham uchun ishlaydi:

\`\`\`demo responsive h=300 "padding va width uchun clamp"
<style>
  body { font-family: sans-serif; margin: 0; background: #f3f4f6; }

  .container {
    /* Telefonda tor, kattaroq ekranda kengroq bo'shliq */
    padding: clamp(12px, 5vw, 48px);
    background: white;
    min-height: 260px;
  }

  .article {
    /* Kamida 260px, ko'pi bilan 520px, oralig'ida 90% */
    width: clamp(260px, 90%, 520px);
    margin: 0 auto;
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    border-radius: 10px;
    padding: clamp(10px, 3vw, 24px);
  }

  h3 { font-size: clamp(1.1rem, 0.9rem + 1.5vw, 1.6rem); margin: 0 0 6px; }
  p { font-size: clamp(0.85rem, 0.8rem + 0.4vw, 1rem); color: #4b5563; margin: 0; }
</style>

<div class="container">
  <div class="article">
    <h3>Maqola sarlavhasi</h3>
    <p>Konteyner bo'shlig'i, maqola kengligi va shrift — hammasi clamp bilan. Kenglik tugmalarini bosib farqni ko'ring.</p>
  </div>
</div>
\`\`\`

---

## 🎯 To'liq tipografiya sistemasi

17-darsdagi CSS o'zgaruvchilar bilan birlashtirsangiz — butun sayt bitta joydan boshqariladi va o'zi moslashadi:

\`\`\`css
:root {
  --text-sm:   clamp(0.8rem,  0.75rem + 0.2vw, 0.9rem);
  --text-base: clamp(0.95rem, 0.9rem  + 0.3vw, 1.05rem);
  --text-lg:   clamp(1.1rem,  1rem    + 0.6vw, 1.35rem);
  --text-xl:   clamp(1.35rem, 1.15rem + 1vw,   1.75rem);
  --text-2xl:  clamp(1.75rem, 1.4rem  + 1.8vw, 2.5rem);
  --text-hero: clamp(2.5rem,  1.8rem  + 3.5vw, 5rem);

  --space-sm:  clamp(8px,  2vw, 16px);
  --space-md:  clamp(16px, 4vw, 32px);
  --space-lg:  clamp(32px, 6vw, 64px);
}

body { font-size: var(--text-base); }
h1   { font-size: var(--text-hero); }
h2   { font-size: var(--text-2xl); }

.section { padding: var(--space-lg) 0; }
\`\`\`

E'tibor bering: har birining o'rtasida \`rem\` bor. Bu — yuqorida gaplashgan zoom masalasi.

---

## 📏 min() va max()

\`clamp()\` ning soddaroq qarindoshlari:

\`\`\`css
/* min() — KICHIGINI tanlaydi */
.column {
  width: min(400px, 90%);
}
/* Katta ekranda 400px (chunki 90% dan kichik) */
/* Kichik ekranda 90% (chunki 400px dan kichik) */

/* max() — KATTASINI tanlaydi */
.container {
  padding: max(16px, 4vw);
}
/* Hech qachon 16px dan kam bo'lmaydi */
\`\`\`

> ⚠️ Nomlari aldamchi. \`min()\` — "minimal kenglik" degani **emas**, "ikkalasidan kichigini tanla" degani. Bu bolalarni ko'p chalkashtiradi.

\`\`\`demo responsive h=260 "min() amalda"
<style>
  body { font-family: sans-serif; margin: 0; padding: 16px; background: #f3f4f6; }

  .col {
    width: min(400px, 90%);
    margin: 0 auto;
    background: white;
    border: 2px solid #6366f1;
    border-radius: 10px;
    padding: 20px;
    text-align: center;
    font-size: 13px;
  }
  code { font-family: monospace; color: #4f46e5; }
</style>

<div class="col">
  <p><code>width: min(400px, 90%)</code></p>
  <p style="color:#6b7280;margin-top:8px">
    Keng ekranda 400px da to'xtaydi.<br />
    Tor ekranda 90% bo'lib, chekkada bo'shliq qoldiradi.
  </p>
</div>
\`\`\`

---

## 🥉 Bronze Topshiriq

Portfolio saytingizdagi \`h1\` va \`h2\` shriftlarini \`clamp()\` ga o'tkazing. O'rtasida \`rem\` bo'lsin.

---

## 🥈 Silver Topshiriq

- Barcha sarlavha o'lchamlarini \`:root\` da o'zgaruvchi qilib, \`clamp()\` bilan yozing
- Bo'limlar orasidagi bo'shliqni (\`padding\`) ham \`clamp()\` ga o'tkazing
- Endi kamida **ikkita media query** ni o'chirib tashlashingiz mumkin bo'lishi kerak

---

## 🥇 Gold Topshiriq

- To'liq fluid tipografiya sistemasi (kamida 5 daraja)
- Konteyner kengligi \`min()\` bilan
- Brauzer shrift sozlamasini kattalashtirib tekshiring — sayt javob berishi kerak
- 375px dan 1920px gacha hech qayerda matn ekrandan chiqmasin

---

## ✅ Dars Xulosa

- \`clamp(min, ideal, max)\` — o'rtadagini tanlaydi, chegaralarda to'xtaydi
- **O'rtasida har doim \`rem\` bo'lsin** — aks holda brauzer zoom ishlamaydi
- \`1vw\` = ekran kengligining 1%
- \`min()\` — kichigini, \`max()\` — kattasini tanlaydi
- CSS o'zgaruvchilar bilan birga — butun sayt bitta joydan boshqariladi
- Media query'lar soni keskin kamayadi

> 🚀 **Keyingi dars:** Custom scrollbar va UI detallar!
`,
    teacher: `
## 💡 O'qituvchi uchun

- \`clamp()\` ni 15-darsda qisqacha ko'rgansiz. Bu yerda maqsad — uni **sistema** sifatida qo'llash: butun saytdagi barcha o'lchamlar.
- \`min()\` va \`max()\` nomlari **teskari tuyuladi**. Buni oldindan aytib qo'ying: "\`min()\` — minimal kenglik emas, ikkitasidan kichigini tanlash". Aks holda bolalar bir necha hafta chalkashadi.
- Demo'dagi kenglik tugmalari bu darsda ayniqsa foydali. 375px va To'liq orasida almashtirib ko'rsating.
- Bolalarga vazifa bering: portfoliolaridagi media query'larni sanab chiqsin, keyin \`clamp()\` qo'llagandan keyin qayta sanasin. Raqam ikki barobar kamayadi — bu ta'sirli natija.

## ⚠️ Bu darsda qo'shilgan muhim narsa (Notion'da yo'q)

Asl sahifada barcha misollar **toza \`vw\`** bilan berilgan: \`clamp(24px, 5vw, 64px)\`.

Bu **accessibility xatosi**. Brauzer sozlamalarida shrift o'lchamini kattalashtirgan foydalanuvchi (yaxshi ko'rmaydiganlar, keksalar) hech qanday o'zgarish ko'rmaydi — chunki \`vw\` ekran kengligiga bog'liq, foydalanuvchi sozlamasiga emas.

To'g'ri yozuv: \`clamp(1.5rem, 1rem + 3vw, 4rem)\` — o'rtada \`rem\` komponenti bo'lsin.

Darsda bu alohida bo'lim sifatida berildi va Gold shartiga kiritildi. **Notion'dagi asl sahifani ham shunga moslashtirish kerak.**

Buni tekshirish oson: Chrome → Settings → Appearance → Font size → Very large. Sayt javob bermasa — muammo bor.

## ⚠️ Ko'p uchraydigan xatolar

- **\`clamp()\` da vergul o'rniga probel** — \`clamp(24px 5vw 64px)\` ishlamaydi.
- **Amaliy amal atrofida probel yo'q** — \`clamp(1rem, 1rem+3vw, 4rem)\` **ishlamaydi**. CSS'da \`+\` va \`-\` atrofida probel **majburiy**: \`1rem + 3vw\`.
- **Minimum maksimumdan katta** — \`clamp(64px, 5vw, 24px)\` xato emas, lekin natija kutilmagan bo'ladi (minimum yutadi).
- **\`clamp()\` \`line-height\` ga qo'llangan** — kerak emas, \`line-height\` allaqachon nisbiy.
- **Hamma joyga \`clamp()\`** — chegara qalinligi yoki radius kabi mayda narsalarga kerak emas, kod o'qilmas bo'lib ketadi.

## 🗒 Notion'dagi xatolar

Asl sahifada ikkita mayda xato bor:

1. \`desktopda: 64px dan oshmayd\` — "oshmaydi" bo'lishi kerak
2. Oxirida "Keyingi dars: CSS Logical Properties" deb yozilgan, lekin haqiqiy 28-dars — **Custom Scrollbar**. Logical Properties dasturda umuman yo'q.

Ikkalasi ham bu yerda to'g'irlandi.

## 📊 Daraja belgilash

- **Bronze** — sarlavhalar clamp bilan, rem komponenti bor
- **Silver** — o'zgaruvchilar sistemasi, media query'lar kamaygan
- **Gold** — to'liq sistema, brauzer zoom ishlaydi, hech qayerda toshib ketish yo'q

> Gold'ni tekshirish: brauzer shrift o'lchamini "Very large" qiling. Sarlavhalar kattalashmasa — \`rem\` yo'q.
`,
  },

  // ═══════════════════════════════════════════════════════════
  'junior.m1.l28': {
    goal: "Custom scrollbar, matn qisqartirish va UI ni tugallovchi mayda detallar.",
    student: `
## 🖍 Scrollbar bezash — ikkita usul bor

Bu mavzuda tarix bor va uni bilish muhim.

**Eski usul** — \`::-webkit-scrollbar\`. Chrome va Safari'da ishlaydi, Firefox'da **hech qachon** ishlamagan. U rasmiy standart emas.

**Yangi usul** — \`scrollbar-width\` va \`scrollbar-color\`. Bular haqiqiy CSS standarti. Firefox'da ancha oldin, Chrome'da 121-versiyadan beri ishlaydi.

\`\`\`css
/* ✅ Standart usul — hamma joyda ishlaydi */
.container {
  scrollbar-width: thin;                 /* auto | thin | none */
  scrollbar-color: #c1c1c1 #f1f1f1;      /* thumb rangi, track rangi */
}
\`\`\`

\`\`\`demo h=300 "Standart usul"
<style>
  body { font-family: sans-serif; font-size: 13px; margin: 0; padding: 14px; }

  .box {
    height: 110px;
    overflow-y: auto;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    padding: 12px;
    margin-bottom: 14px;
  }

  .oddiy { }

  .bezalgan {
    scrollbar-width: thin;
    scrollbar-color: #6366f1 #ede9fe;
  }

  .lbl { font-family: monospace; font-size: 11px; color: #6b7280; margin: 0 0 5px; }
  p { margin: 0 0 8px; color: #4b5563; }
</style>

<p class="lbl">Oddiy scrollbar</p>
<div class="box oddiy">
  <p>1 — Pastga scroll qiling</p><p>2 — Matn</p><p>3 — Matn</p>
  <p>4 — Matn</p><p>5 — Matn</p><p>6 — Matn</p><p>7 — Oxiri</p>
</div>

<p class="lbl">scrollbar-width: thin + scrollbar-color</p>
<div class="box bezalgan">
  <p>1 — Pastga scroll qiling</p><p>2 — Matn</p><p>3 — Matn</p>
  <p>4 — Matn</p><p>5 — Matn</p><p>6 — Matn</p><p>7 — Oxiri</p>
</div>
\`\`\`

---

## ⚠️ Eng muhim tuzoq

Ko'p darsliklarda "ikkala usulni ham yozing, ishonchli bo'ladi" deyiladi. **Bu noto'g'ri.**

\`\`\`css
/* ❌ Bu kod kutilganidek ishlamaydi */
::-webkit-scrollbar { width: 10px; }
::-webkit-scrollbar-thumb {
  background: #6366f1;
  border-radius: 10px;      /* yumaloq burchak */
}
::-webkit-scrollbar-thumb:hover { background: #4f46e5; }

* {
  scrollbar-width: thin;              /* ← MANA SHU HAMMASINI BEKOR QILADI */
  scrollbar-color: #6366f1 #ede9fe;
}
\`\`\`

Sabab: \`scrollbar-width\` yoki \`scrollbar-color\` \`auto\` dan **boshqa** qiymatga o'rnatilgan bo'lsa, u \`::-webkit-scrollbar\` qoidalarini **butunlay bekor qiladi**.

Natijada zamonaviy Chrome'da siz yozgan yumaloq burchak ham, hover effekti ham **yo'qoladi** — faqat oddiy ingichka scrollbar qoladi.

**To'g'ri yondashuv — bittasini tanlang:**

| Vaziyat | Nima qilish |
| --- | --- |
| Oddiy rang va qalinlik yetadi | Faqat \`scrollbar-width\` + \`scrollbar-color\` |
| Yumaloq burchak, hover, murakkab dizayn kerak | Faqat \`::-webkit-scrollbar\` (Firefox'da standart qoladi) |

\`\`\`demo h=300 "Faqat webkit — yumaloq va hover bilan"
<style>
  body { font-family: sans-serif; font-size: 13px; margin: 0; padding: 14px; }

  .box {
    height: 150px;
    overflow-y: auto;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    padding: 12px;
  }

  /* scrollbar-width YOZILMAGAN — shuning uchun quyidagilar ishlaydi */
  .box::-webkit-scrollbar { width: 10px; }
  .box::-webkit-scrollbar-track {
    background: #ede9fe;
    border-radius: 10px;
  }
  .box::-webkit-scrollbar-thumb {
    background: #a78bfa;
    border-radius: 10px;
    border: 2px solid #ede9fe;
  }
  .box::-webkit-scrollbar-thumb:hover { background: #7c3aed; }

  p { margin: 0 0 10px; color: #4b5563; }
</style>

<div class="box">
  <p>Scrollbar ustiga kursorni olib keling — rangi to'qlashadi.</p>
  <p>2 — Matn</p><p>3 — Matn</p><p>4 — Matn</p>
  <p>5 — Matn</p><p>6 — Matn</p><p>7 — Matn</p>
  <p>8 — Matn</p><p>9 — Oxiri</p>
</div>
\`\`\`

### Scrollbar'ni butunlay yashirish

\`\`\`css
.no-scrollbar {
  scrollbar-width: none;              /* Firefox va Chrome 121+ */
  -ms-overflow-style: none;           /* eski Edge */
}
.no-scrollbar::-webkit-scrollbar { display: none; }   /* eski Safari */
\`\`\`

> ⚠️ Scrollbar'ni yashirish — **ehtiyotkorlik bilan**. Foydalanuvchi bu yerda scroll bo'lishini bilmay qolishi mumkin. Faqat slayder kabi aniq holatlarda ishlating (26-darsdagi kabi).

---

## ✂️ Matnni qisqartirish

Kartochkalarda matn har xil uzunlikda bo'ladi va dizayn buziladi. Yechim — qisqartirish.

\`\`\`demo h=340 "Bir qator va uch qator"
<style>
  body { font-family: sans-serif; font-size: 13px; padding: 14px; }

  .karta {
    background: white; border: 1px solid #e5e7eb;
    border-radius: 10px; padding: 14px; margin-bottom: 12px;
  }
  .lbl { font-family: monospace; font-size: 11px; color: #6b7280; margin: 0 0 6px; }

  /* Bir qatorda */
  .bir-qator {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Uch qatorda */
  .uch-qator {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  p { margin: 0; color: #4b5563; }
</style>

<div class="karta">
  <p class="lbl">Qisqartirishsiz</p>
  <p>Frontend dasturlash — bu veb-saytlarning foydalanuvchi ko'radigan qismini yaratish sohasi. HTML struktura beradi, CSS ko'rinish beradi, JavaScript esa sahifani jonlantiradi va interaktiv qiladi.</p>
</div>

<div class="karta">
  <p class="lbl">text-overflow: ellipsis — bir qator</p>
  <p class="bir-qator">Frontend dasturlash — bu veb-saytlarning foydalanuvchi ko'radigan qismini yaratish sohasi. HTML struktura beradi.</p>
</div>

<div class="karta">
  <p class="lbl">-webkit-line-clamp: 3 — uch qator</p>
  <p class="uch-qator">Frontend dasturlash — bu veb-saytlarning foydalanuvchi ko'radigan qismini yaratish sohasi. HTML struktura beradi, CSS ko'rinish beradi, JavaScript esa sahifani jonlantiradi va interaktiv qiladi. Bu uch texnologiya birgalikda ishlaydi.</p>
</div>
\`\`\`

Bir qatorli qisqartirish uchun **uchala qator ham** kerak:

\`\`\`css
white-space: nowrap;        /* qatorga sig'masin */
overflow: hidden;           /* ortiqchasi kesilsin */
text-overflow: ellipsis;    /* ... qo'yilsin */
\`\`\`

Ko'p qatorli uchun ham uchtasi:

\`\`\`css
display: -webkit-box;
-webkit-line-clamp: 3;
-webkit-box-orient: vertical;
overflow: hidden;
\`\`\`

> 💡 \`-webkit-\` prefiksi bo'lsa ham, bu barcha zamonaviy brauzerlarda ishlaydi — Firefox ham qo'llab-quvvatlaydi. Bu — prefiks standartga aylangan kam sonli holatlardan biri.

---

## 🎛️ UI ni tugallovchi mayda narsalar

\`\`\`demo h=340 "user-select, cursor, pointer-events"
<style>
  body { font-family: sans-serif; font-size: 13px; padding: 14px; }

  .row { margin-bottom: 14px; }
  .lbl { font-family: monospace; font-size: 11px; color: #6b7280; margin: 0 0 5px; }

  .logo {
    user-select: none;
    background: #1a1a2e; color: white;
    padding: 10px 16px; border-radius: 8px;
    display: inline-block; font-weight: 700; letter-spacing: 1px;
  }

  .oddiy-matn {
    background: #f3f4f6; padding: 10px 16px;
    border-radius: 8px; display: inline-block;
  }

  .btn {
    padding: 9px 18px; border: none; border-radius: 8px;
    background: #6366f1; color: white; font-size: 13px;
    transition: transform 0.1s;
  }
  .btn:active { transform: scale(0.96); }

  .c1 { cursor: pointer; }
  .c2 { cursor: not-allowed; background: #d1d5db; color: #6b7280; }
  .c3 { cursor: wait; background: #f59e0b; }

  .uzun-url {
    overflow-wrap: break-word;
    background: #f9fafb; padding: 10px;
    border-radius: 8px; border: 1px solid #e5e7eb;
    font-family: monospace; font-size: 11px;
  }
</style>

<div class="row">
  <p class="lbl">user-select: none — belgilab bo'lmaydi (sudrab ko'ring)</p>
  <span class="logo">MYBRAND</span>
  <span class="oddiy-matn">Bu matnni belgilash mumkin</span>
</div>

<div class="row">
  <p class="lbl">cursor — kursor shakli</p>
  <button class="btn c1">pointer</button>
  <button class="btn c2">not-allowed</button>
  <button class="btn c3">wait</button>
</div>

<div class="row">
  <p class="lbl">:active bilan bosilish effekti — tugmani bosib turing</p>
  <button class="btn c1">Bosing</button>
</div>

<div class="row">
  <p class="lbl">overflow-wrap: break-word — uzun URL sinadi</p>
  <div class="uzun-url">https://example.com/juda/uzun/manzil/qismlar/bilan/toladi/va/konteynerdan/chiqib/ketishi/mumkin</div>
</div>
\`\`\`

| Xususiyat | Qachon kerak |
| --- | --- |
| \`user-select: none\` | Logo, tugma, ikonka — belgilanishi mantiqsiz narsalar |
| \`cursor: pointer\` | Bosiladigan, lekin \`<button>\` bo'lmagan elementlar |
| \`cursor: not-allowed\` | O'chirilgan tugmalar |
| \`pointer-events: none\` | Ustidagi qatlam bosishga xalaqit bermasin |
| \`overflow-wrap: break-word\` | URL yoki uzun so'z konteynerdan chiqmasin |

---

## 👻 Yashirishning uch xili

Bu uchtasi chalkashtiriladi, lekin ular **butunlay boshqacha**:

\`\`\`demo h=300 "display / visibility / opacity"
<style>
  body { font-family: sans-serif; font-size: 12px; padding: 14px; }
  .qator { display: flex; gap: 8px; align-items: center; margin-bottom: 12px; }
  .q { background: #6366f1; color: white; padding: 12px 16px; border-radius: 8px; }
  .lbl { font-family: monospace; font-size: 11px; color: #6b7280; margin: 0 0 5px; }

  .yoq { display: none; }
  .korinmas { visibility: hidden; }
  .shaffof { opacity: 0; }
</style>

<p class="lbl">Hammasi ko'rinadi</p>
<div class="qator"><div class="q">1</div><div class="q">2</div><div class="q">3</div></div>

<p class="lbl">2-element: display: none — JOYI HAM YO'Q</p>
<div class="qator"><div class="q">1</div><div class="q yoq">2</div><div class="q">3</div></div>

<p class="lbl">2-element: visibility: hidden — joyi qoldi</p>
<div class="qator"><div class="q">1</div><div class="q korinmas">2</div><div class="q">3</div></div>

<p class="lbl">2-element: opacity: 0 — joyi qoldi, LEKIN bosilishi mumkin</p>
<div class="qator"><div class="q">1</div><div class="q shaffof">2</div><div class="q">3</div></div>
\`\`\`

- \`display: none\` — element yo'q, joyi ham yo'q
- \`visibility: hidden\` — ko'rinmaydi, lekin **joyi qoladi**
- \`opacity: 0\` — ko'rinmaydi, joyi qoladi va **hali ham bosiladi**

> ⚠️ \`opacity: 0\` bilan yashirilgan tugma foydalanuvchi uchun ko'rinmaydi, lekin tasodifan bosilishi mumkin. Bu — real xato manbai. Animatsiya kerak bo'lsa \`opacity\` + \`pointer-events: none\` birga ishlating.

---

## 🥉 Bronze Topshiriq

Portfolio saytingizga custom scrollbar qo'shing. **Bitta usulni** tanlang — ikkalasini aralashtirmang.

---

## 🥈 Silver Topshiriq

- Loyiha kartochkalarining tavsif matniga \`-webkit-line-clamp: 3\`
- Logotipga \`user-select: none\`
- Barcha tugmalarga \`:active\` bosilish effekti

---

## 🥇 Gold Topshiriq

- Yuqoridagilar + \`cursor\` holatlari to'g'ri (\`pointer\`, \`not-allowed\`)
- Uzun havolalar \`overflow-wrap\` bilan sinadi
- Kartochkalar **bir xil balandlikda** (line-clamp tufayli)
- Sahifada gorizontal scroll umuman yo'q

---

## ✅ Dars Xulosa

- \`scrollbar-width\` + \`scrollbar-color\` — standart usul
- \`::-webkit-scrollbar\` — ko'proq nazorat, lekin faqat Chrome/Safari
- **Ikkalasini birga yozmang** — standart usul webkit'ni bekor qiladi
- \`text-overflow: ellipsis\` — uch qator CSS kerak
- \`-webkit-line-clamp\` — ko'p qatorli qisqartirish, hamma joyda ishlaydi
- \`display: none\` / \`visibility: hidden\` / \`opacity: 0\` — uchtasi boshqacha

> 🚀 **Keyingi dars:** SEO asoslari va meta teglar!
`,
    teacher: `
## ⚠️ Notion'dagi kod zamonaviy Chrome'da ishlamaydi

Bu — bu darsdagi eng muhim tuzatish.

Asl sahifada shunday yozilgan: avval \`::-webkit-scrollbar\` qoidalari (yumaloq burchak, hover), keyin \`* { scrollbar-width: thin; scrollbar-color: ... }\`.

**Muammo:** \`scrollbar-width\` yoki \`scrollbar-color\` \`auto\` dan boshqa qiymatga o'rnatilsa, u \`::-webkit-scrollbar\` qoidalarini **butunlay bekor qiladi**. Bu — spetsifikatsiyada belgilangan xatti-harakat.

Natija: Chrome 121+ da bola yozgan yumaloq burchak ham, hover effekti ham ishlamaydi. Bola esa "nega mening kodim ishlamayapti?" deb tushunmaydi — chunki kod xato emas, faqat bir-birini bekor qiladi.

Darsda bu alohida bo'lim sifatida berildi: **bitta usulni tanlang**. Jadval bilan qaysi holatda qaysi biri kerakligi ko'rsatildi.

Notion'dagi asl sahifani ham shunga moslashtirish kerak.

---

## 💡 O'qituvchi uchun

- Scrollbar bezash — bolalarga juda yoqadi va ular buni hamma joyga qo'llaydi. Qoida o'rnating: scrollbar sayt dizayniga **mos** bo'lsin, e'tiborni tortmasin.
- Scrollbar'ni **yashirish** xavfli. "Chiroyli" deb yashirgan bola foydalanuvchini adashtiradi. Faqat slayderda (26-dars) ruxsat bering.
- \`line-clamp\` — kartochkalarni bir xil balandlikda ushlashning eng oson yo'li. Buni Grid bilan bog'lang: bolalar 14-darsda kartochkalar turli balandlikda bo'lganini ko'rgan, endi yechimini biladi.
- Uch xil yashirish (\`display\` / \`visibility\` / \`opacity\`) — demo'ni albatta ko'rsating. Uchalasining farqi faqat ko'rganda tushuniladi.

## ⚠️ Ko'p uchraydigan xatolar

- **Scrollbar bezagi ishlamayapti** — yuqoridagi konflikt. Birinchi tekshiriladigan narsa.
- **\`::-webkit-scrollbar\` \`*\` ga berilgan** — butun sahifadagi har bir scrollbar o'zgaradi, shu jumladan \`select\` ichidagi ham. Aniq konteynerga bering.
- **\`text-overflow: ellipsis\` ishlamayapti** — \`white-space: nowrap\` yoki \`overflow: hidden\` tushirib qoldirilgan. Uchalasi kerak.
- **\`line-clamp\` ishlamayapti** — \`display: -webkit-box\` yoki \`-webkit-box-orient: vertical\` yo'q. Bu ikkitasi ham majburiy.
- **\`opacity: 0\` bilan yashirilgan tugma bosilib ketyapti** — \`pointer-events: none\` qo'shilmagan. Bu xato haqiqiy saytlarda ham uchraydi.
- **\`user-select: none\` butun \`body\` ga berilgan** — foydalanuvchi hech narsani nusxa ola olmaydi. Faqat logo va tugmalarga bering.

## 📊 Daraja belgilash

- **Bronze** — scrollbar bezalgan va **ishlaydi** (konflikt yo'q)
- **Silver** — line-clamp bilan kartochkalar bir xil balandlikda
- **Gold** — cursor holatlari, overflow-wrap, gorizontal scroll yo'q

> Bronze'ni tekshirishning tez usuli: Chrome'da oching. Yumaloq burchak ko'rinmasa — \`scrollbar-width\` konflikti bor.
`,
  },

  // ═══════════════════════════════════════════════════════════
  'junior.m1.l29': {
    goal: "Google indekslaydigan to'g'ri HTML yozish: meta teglar, Open Graph, semantik tuzilma.",
    student: `
## 🔍 SEO nima?

**SEO** — Search Engine Optimization. Saytni Google qidiruvida yuqoriroq chiqarishga yordam beruvchi ishlar.

SEO ikki qismdan iborat:

- **Kontent SEO** — nima yozilgani, kalit so'zlar, maqolalar sifati. Bu — marketolog ishi.
- **Texnik SEO** — HTML qanday yozilgani. Bu — **sizning ishingiz**.

Bu darsda ikkinchisini o'rganamiz.

---

## 🏷️ title va description — qidiruvda nima ko'rinadi

Google natijalarida ko'rinadigan matn to'g'ridan-to'g'ri sizning HTML'ingizdan olinadi:

\`\`\`demo h=360 "Google natijasi qanday ko'rinadi"
<style>
  body { font-family: Arial, sans-serif; background: white; padding: 16px; }

  .natija { max-width: 560px; margin-bottom: 24px; }

  .url { color: #202124; font-size: 12px; margin-bottom: 2px; }
  .url span { color: #5f6368; }

  .sarlavha {
    color: #1a0dab; font-size: 19px; line-height: 1.3;
    margin: 0 0 3px; cursor: pointer;
  }
  .sarlavha:hover { text-decoration: underline; }

  .tavsif { color: #4d5156; font-size: 13px; line-height: 1.55; margin: 0; }

  .lbl {
    font-family: monospace; font-size: 11px; color: #6b7280;
    margin: 0 0 8px; padding-bottom: 4px; border-bottom: 1px solid #e5e7eb;
  }

  /* Uzun sarlavha — kesiladi */
  .kesilgan {
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
</style>

<p class="lbl">✅ TO'G'RI — sarlavha 58 belgi, tavsif 152 belgi</p>
<div class="natija">
  <p class="url">ahmadjon.dev <span>› portfolio</span></p>
  <h3 class="sarlavha">Ahmadjon Toshmatov — Frontend Developer | Toshkent</h3>
  <p class="tavsif">
    Toshkentlik frontend dasturchi. HTML, CSS va JavaScript bilan zamonaviy
    veb-saytlar yarataman. Portfolio, loyihalar va bog'lanish ma'lumotlari.
  </p>
</div>

<p class="lbl">❌ XATO — sarlavha juda uzun, kesilib qoladi</p>
<div class="natija">
  <p class="url">ahmadjon.dev <span>› portfolio</span></p>
  <h3 class="sarlavha kesilgan">Mening shaxsiy portfolio saytim bu yerda siz mening barcha loyihalarimni va ishlarimni ko'rishingiz mumkin</h3>
  <p class="tavsif">
    Bu sayt haqida. Bu yerda ma'lumotlar bor.
  </p>
</div>

<p class="lbl">❌ XATO — description umuman yo'q</p>
<div class="natija">
  <p class="url">ahmadjon.dev <span>› portfolio</span></p>
  <h3 class="sarlavha">Document</h3>
  <p class="tavsif" style="color:#9ca3af;font-style:italic">
    Google sahifadan tasodifiy matn oladi va u ko'pincha ma'nosiz chiqadi...
  </p>
</div>
\`\`\`

Uchinchi misolga diqqat qiling: \`<title>Document</title>\` — VS Code standart holatda shunday yozadi va **juda ko'p bola** uni o'zgartirishni unutadi.

\`\`\`html
<!-- Sarlavha: 50–60 belgi -->
<title>Ahmadjon Toshmatov — Frontend Developer | Toshkent</title>

<!-- Tavsif: 150–160 belgi -->
<meta name="description"
  content="Toshkentlik frontend dasturchi. HTML, CSS va JavaScript bilan
           zamonaviy veb-saytlar yarataman. Portfolio va loyihalar." />
\`\`\`

| Teg | Uzunlik | Nima bo'ladi oshsa |
| --- | --- | --- |
| \`title\` | 50–60 belgi | Google kesib, \`...\` qo'yadi |
| \`description\` | 150–160 belgi | Kesiladi yoki Google o'zi matn tanlaydi |

> ⚠️ \`<meta name="keywords">\` — **yozmang**. Google uni 2009-yildan beri butunlay e'tiborsiz qoldiradi. Ba'zi eski darsliklarda hamon uchraydi, lekin foydasi yo'q.

---

## 📱 Open Graph — havola ulashilganda

Telegram yoki Instagram'da havola yuborganingizda chiroyli kartochka chiqadi. U ham sizning HTML'ingizdan olinadi:

\`\`\`demo h=380 "Telegram/Facebook kartochkasi"
<style>
  body { font-family: -apple-system, 'Segoe UI', sans-serif; background: #eef2f7; padding: 16px; }

  .xabar {
    max-width: 320px;
    background: white;
    border-radius: 12px;
    padding: 10px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12);
    margin-bottom: 16px;
  }

  .karta {
    border-left: 3px solid #3390ec;
    padding-left: 10px;
  }
  .karta img {
    width: 100%; aspect-ratio: 1200 / 630;
    object-fit: cover; border-radius: 8px;
    display: block; margin-bottom: 6px;
  }
  .sayt { color: #3390ec; font-size: 12px; font-weight: 600; margin: 0 0 2px; }
  .bosh { font-size: 14px; font-weight: 600; margin: 0 0 3px; color: #111; }
  .tav  { font-size: 12px; color: #6b7280; margin: 0; line-height: 1.4; }

  .lbl { font-family: monospace; font-size: 11px; color: #6b7280; margin: 0 0 8px; }

  .yomon { border-left-color: #d1d5db; }
</style>

<p class="lbl">✅ og: teglar bilan</p>
<div class="xabar">
  <div class="karta">
    <img src="https://picsum.photos/id/180/600/315" alt="" />
    <p class="sayt">ahmadjon.dev</p>
    <p class="bosh">Ahmadjon Toshmatov — Frontend Developer</p>
    <p class="tav">Zamonaviy veb-saytlar yarataman. Portfolio va loyihalar.</p>
  </div>
</div>

<p class="lbl">❌ og: teglar yo'q</p>
<div class="xabar">
  <div class="karta yomon">
    <p class="sayt">ahmadjon.dev</p>
    <p class="bosh">Document</p>
    <p class="tav" style="color:#9ca3af;font-style:italic">Tavsif yo'q, rasm yo'q</p>
  </div>
</div>
\`\`\`

\`\`\`html
<meta property="og:type" content="website" />
<meta property="og:title" content="Ahmadjon Toshmatov — Frontend Developer" />
<meta property="og:description" content="Zamonaviy veb-saytlar yarataman." />
<meta property="og:image" content="https://ahmadjon.dev/og-image.jpg" />
<meta property="og:url" content="https://ahmadjon.dev" />
<meta property="og:site_name" content="Ahmadjon Portfolio" />

<!-- Twitter/X uchun -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Ahmadjon Toshmatov" />
<meta name="twitter:image" content="https://ahmadjon.dev/og-image.jpg" />
\`\`\`

Uchta muhim nuqta:

- \`og:image\` — **1200×630px** bo'lsin. Boshqa nisbat bo'lsa kesiladi yoki g'alati ko'rinadi
- Rasm manzili **to'liq** bo'lsin: \`https://...\`. Nisbiy yo'l (\`/og.jpg\`) ishlamaydi
- \`og:\` teglarida \`property\`, \`twitter:\` teglarida \`name\` yoziladi — bu chalkash, lekin shunday

---

## 🏗️ Semantik HTML — Google uchun

7-darsda o'rgangan semantik teglar aynan shu yerda foyda beradi:

\`\`\`html
<!-- ❌ Google nima ekanini tushunmaydi -->
<div class="header">
  <div class="menu"><div class="item">Bosh sahifa</div></div>
</div>

<!-- ✅ Google tuzilmani o'qiydi -->
<header>
  <nav aria-label="Asosiy navigatsiya">
    <ul><li><a href="/">Bosh sahifa</a></li></ul>
  </nav>
</header>
\`\`\`

Yana ikkita qoida:

\`\`\`html
<!-- h1 — sahifada FAQAT BITTA, asosiy mavzuni bildiradi -->
<h1>Frontend Developer Ahmadjon Toshmatov</h1>

<!-- alt — Google rasm qidiruvida ham topadi -->
<img src="avatar.jpg" alt="Ahmadjon Toshmatov — Frontend Developer" />
\`\`\`

---

## 📈 Core Web Vitals

Google saytni faqat mazmuniga qarab emas, **tezligiga** qarab ham baholaydi. Uchta ko'rsatkich bor:

| Ko'rsatkich | Nimani o'lchaydi | Yaxshi | Yomon |
| --- | --- | --- | --- |
| **LCP** | Eng katta element qachon yuklandi | ≤ 2.5s | > 4s |
| **INP** | Bosishga javob tezligi | ≤ 200ms | > 500ms |
| **CLS** | Sahifa qanchalik "sakraydi" | ≤ 0.1 | > 0.25 |

> ⚠️ Ba'zi eski darsliklarda **FID** ko'rsatkichi uchraydi. U 2024-yil mart oyida bekor qilingan va o'rniga **INP** kelgan. FID faqat *birinchi* bosishni o'lchardi, INP esa *barcha* interaksiyalarni.

Bu uchtasini yaxshilash uchun siz allaqachon nimadir bilasiz:

- **LCP** → hero rasmga \`fetchpriority="high"\`, shriftlarga \`preconnect\`
- **CLS** → rasmlarga \`width\` va \`height\` (21-dars)
- **INP** → JavaScript'ga bog'liq, 5-oyda o'rganasiz

---

## 🎨 Favicon

\`\`\`html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
\`\`\`

Favicon — brauzer tabidagi kichik ikonka. U bo'lmasa tabda bo'sh varaq belgisi turadi va sayt tugallanmagandek ko'rinadi.

---

## 🥉 Bronze Topshiriq

Portfolio saytingizga qo'shing:

- To'g'ri \`<title>\` (50–60 belgi, "Document" emas!)
- \`<meta name="description">\` (150–160 belgi)
- Favicon

---

## 🥈 Silver Topshiriq

- Barcha Open Graph teglari (\`og:title\`, \`og:description\`, \`og:image\`, \`og:url\`)
- \`og:image\` 1200×630px va **to'liq manzil** bilan
- Har bir rasmda mazmunli \`alt\`

---

## 🥇 Gold Topshiriq

- Yuqoridagilar + Twitter Card teglari
- Semantik HTML to'liq (\`header\`, \`nav\`, \`main\`, \`section\`, \`footer\`)
- Sahifada faqat bitta \`h1\`
- Sayt internetga chiqarilgan va Telegram'da havola ulashib tekshirilgan

---

## 🧪 Qanday tekshirish

1. Saytni deploy qiling (Netlify yoki GitHub Pages)
2. Havolani **o'zingizga Telegram'da yuboring** — kartochka chiqdimi?
3. \`metatags.io\` yoki \`opengraph.xyz\` da tekshiring
4. Google natijasini ko'rish uchun: \`site:sizningsayt.uz\` deb qidiring

> 💡 Telegram og:image'ni **keshlaydi**. Rasmni o'zgartirsangiz, eski rasm chiqishi mumkin. Havola oxiriga \`?v=2\` qo'shib sinang.

---

## ✅ Dars Xulosa

- \`title\` — 50–60 belgi, "Document" qolmasin
- \`description\` — 150–160 belgi
- \`keywords\` — **yozmang**, foydasi yo'q
- \`og:image\` — 1200×630px, to'liq manzil bilan
- Semantik HTML — Google tuzilmani o'qishi uchun
- \`alt\` — rasm qidiruvida topilish uchun
- Core Web Vitals: **LCP, INP, CLS** (FID emas)

> 🚀 **Keyingi dars:** Lighthouse va Performance!
`,
    teacher: `
## 💡 O'qituvchi uchun

- SEO — bolalar uchun mavhum mavzu, chunki natija darhol ko'rinmaydi. Shuning uchun darsni **Telegram bilan** boshlang: o'z saytingiz havolasini guruhga tashlang va kartochka chiqqanini ko'rsating. Keyin og: teglarni ko'rsating. Bog'lanish shu yerda tushuniladi.
- \`<title>Document</title>\` — bu **hamma bolada** uchraydi. VS Code \`!\` + Tab bilan shunday yozadi. Buni alohida tekshiring.
- Demo'dagi soxta Google natijasi juda foydali. Bolalar 60 belgi chegarasini eshitgan, lekin kesilgan sarlavhani ko'rmagan. Ko'rsating.
- Bolalar \`keywords\` tegini internetdan topib yozadi. "Google 2009-yildan beri e'tiborsiz qoldiradi" deb aniq ayting, aks holda ular vaqt sarflaydi.

## 🗒 Notion'dagi tuzatilgan xatolar

**1. Core Web Vitals eskirgan.** Asl sahifada \`FID/INP\` deb yozilgan. FID (First Input Delay) **2024-yil mart oyida bekor qilingan**, o'rniga INP (Interaction to Next Paint) kelgan. Ikkalasini birga yozish endi noto'g'ri.

Joriy chegaralar (75-persentil bo'yicha o'lchanadi): LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1.

**2. \`keywords\` tegi haqida noaniqlik.** Asl matnda "Google buni hisobga olmaydi, lekin yaxshilab yozish mumkin" deyilgan — bu chalkash. Google uni **butunlay** e'tiborsiz qoldiradi, yozishning foydasi yo'q.

**3. Cyrillic aralashib ketgan** — \`og:description\` da "yarataман" deb yozilgan (oxirgi uch harf kirill). Bu yerda to'g'irlandi.

## ⚠️ Ko'p uchraydigan xatolar

- **\`<title>Document</title>\`** — o'zgartirilmagan. Eng ko'p uchraydigan.
- **\`og:image\` nisbiy yo'l bilan** — \`/og.jpg\` ishlamaydi, \`https://sayt.uz/og.jpg\` kerak.
- **\`og:image\` rasmi juda katta** — 5MB rasm Telegram'da yuklanmaydi. 300KB dan kam bo'lsin.
- **\`property\` va \`name\` chalkashtirilgan** — \`og:\` teglari \`property\`, \`twitter:\` teglari \`name\` ishlatadi.
- **Bir nechta \`h1\`** — har bo'limga \`h1\` yozilgan. Faqat bitta bo'lishi kerak.
- **\`description\` juda qisqa** — "Mening saytim" kabi. Google buni ishlatmaydi, o'zi matn tanlaydi.

## 📊 Daraja belgilash

- **Bronze** — title va description to'g'ri, favicon bor
- **Silver** — og: teglar to'liq, rasm to'g'ri o'lchamda
- **Gold** — deploy qilingan va **Telegram'da tekshirilgan**

> Gold'ni tekshirishning eng oson usuli: bolaning saytini o'zingizga yuborishini so'rang. Kartochka chiqmasa — bajarilmagan.
`,
  },

  // ═══════════════════════════════════════════════════════════
  'junior.m1.l30': {
    goal: "Chrome Lighthouse bilan saytni baholash va 90+ ball olish uchun optimizatsiyalar.",
    student: `
## 🔦 Lighthouse nima?

Chrome'ga o'rnatilgan tekshiruvchi. Saytingizni ochib, **F12 → Lighthouse → Analyze page load** bosasiz va u to'rtta ball beradi:

| Bo'lim | Nimani tekshiradi |
| --- | --- |
| **Performance** | Sahifa qanchalik tez yuklanadi |
| **Accessibility** | Ko'zi ojiz va klaviatura foydalanuvchilari ishlata oladimi |
| **Best Practices** | Xavfsizlik va zamonaviy standartlar |
| **SEO** | Google topa oladimi |

Maqsad — **hammasida 90+**.

> 💡 Lighthouse'ni **Incognito** oynada yurgizing. Brauzer kengaytmalari natijani buzadi va ball noto'g'ri chiqadi.

---

## 📉 CLS — sahifa nima uchun "sakraydi"

Bu — Performance ballini eng ko'p tushiradigan muammo va uni ko'rish kerak:

\`\`\`demo h=340 "Rasm o'lchamsiz — matn sakraydi"
<style>
  body { font-family: sans-serif; font-size: 13px; padding: 14px; }

  .lbl { font-family: monospace; font-size: 11px; color: #6b7280; margin: 0 0 6px; }
  .blok { border: 1px solid #e5e7eb; border-radius: 10px; padding: 12px; margin-bottom: 14px; }

  /* Rasm "kech yuklanishini" taqlid qilamiz */
  @keyframes yuklandi {
    0%, 40%  { height: 0; }
    50%, 100% { height: 90px; }
  }

  .yomon .rasm {
    background: #93c5fd; border-radius: 8px;
    animation: yuklandi 3s ease-in-out infinite;
  }

  .yaxshi .rasm {
    height: 90px;                    /* joy oldindan band */
    background: #86efac; border-radius: 8px;
  }

  .btn {
    display: inline-block; margin-top: 8px;
    background: #6366f1; color: white;
    padding: 7px 14px; border-radius: 6px; font-size: 12px;
  }
</style>

<p class="lbl">❌ width/height YO'Q — rasm kelganda tugma pastga sakraydi</p>
<div class="blok yomon">
  <div class="rasm"></div>
  <p style="margin:8px 0 0">Matn va tugma</p>
  <span class="btn">Bosing</span>
</div>

<p class="lbl">✅ width/height BOR — joy oldindan band, sakrash yo'q</p>
<div class="blok yaxshi">
  <div class="rasm"></div>
  <p style="margin:8px 0 0">Matn va tugma</p>
  <span class="btn">Bosing</span>
</div>
\`\`\`

Birinchi blokda tugma pastga siljib turadi. Foydalanuvchi tugmani bosmoqchi bo'lganda, aynan o'sha payt rasm yuklanadi va u **boshqa narsani bosib yuboradi**.

Yechim — 21-darsda o'rgangan narsa:

\`\`\`html
<img src="rasm.jpg" alt="..." width="800" height="600" />
\`\`\`

CSS'da o'lchamni o'zgartirsangiz ham, HTML'dagi bu ikki attribut brauzerga **nisbatni** aytadi va u joyni oldindan band qiladi.

---

## ⚡ Performance uchun asosiy qadamlar

\`\`\`html
<!-- 1. Hero rasm — darhol yuklansin -->
<img src="hero.jpg" alt="Hero" fetchpriority="high" width="1200" height="600" />

<!-- 2. Pastdagi rasmlar — kechiktirilsin -->
<img src="loyiha.jpg" alt="..." loading="lazy" width="800" height="500" />

<!-- 3. Shriftlar — oldindan ulanish -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
\`\`\`

\`\`\`css
/* 4. Animatsiya — faqat transform va opacity */
.karta {
  transition: transform 0.3s, opacity 0.3s;   /* ✅ tez */
}

.karta-yomon {
  transition: width 0.3s, height 0.3s, margin 0.3s;   /* ❌ sekin */
}
\`\`\`

Nima uchun? \`transform\` va \`opacity\` ni brauzer **videokartada** hisoblaydi. \`width\`, \`height\`, \`margin\` esa butun sahifani qayta o'lchashga majbur qiladi — bu ancha og'ir.

> 💡 Qoida: animatsiya qilmoqchi bo'lsangiz, avval \`transform\` bilan qilishga harakat qiling. \`margin-left: 20px\` o'rniga \`transform: translateX(20px)\`.

---

## ♿ Accessibility — ko'pincha unutiladigan ball

Accessibility ballini ko'tarish eng oson, chunki muammolar odatda takrorlanadi.

### Fokus ko'rinishi

\`\`\`demo h=300 "Tab tugmasini bosib ko'ring"
<style>
  body { font-family: sans-serif; font-size: 13px; padding: 16px; }
  .lbl { font-family: monospace; font-size: 11px; color: #6b7280; margin: 0 0 8px; }
  .qator { margin-bottom: 20px; }

  .btn {
    padding: 9px 18px; border: none; border-radius: 8px;
    background: #6366f1; color: white; font-size: 13px;
    margin-right: 8px; cursor: pointer;
  }

  /* ❌ Fokus o'chirilgan */
  .yomon .btn:focus { outline: none; }

  /* ✅ Fokus ko'rinadi */
  .yaxshi .btn:focus-visible {
    outline: 3px solid #f59e0b;
    outline-offset: 3px;
  }
</style>

<p class="lbl">Oynachaga bosing, keyin Tab tugmasini bosib yuring</p>

<div class="qator yomon">
  <p class="lbl">❌ outline: none — qayerdaligingiz ko'rinmaydi</p>
  <button class="btn">Bir</button>
  <button class="btn">Ikki</button>
  <button class="btn">Uch</button>
</div>

<div class="qator yaxshi">
  <p class="lbl">✅ focus-visible — sariq ramka ko'rinadi</p>
  <button class="btn">Bir</button>
  <button class="btn">Ikki</button>
  <button class="btn">Uch</button>
</div>
\`\`\`

Sichqonchasiz ishlaydigan odamlar bor: qo'l shikastlanishi, ko'rish muammosi, yoki shunchaki tezlik uchun klaviatura ishlatadiganlar. \`outline: none\` ular uchun saytni **ishlatib bo'lmas** qiladi.

\`\`\`css
/* ❌ Hech qachon shunday qilmang */
button:focus { outline: none; }

/* ✅ To'g'ri yo'l */
button:focus-visible {
  outline: 3px solid #6366f1;
  outline-offset: 3px;
  border-radius: 4px;
}
\`\`\`

\`:focus-visible\` — \`:focus\` dan farqi: u **faqat klaviatura** bilan kelganda ishlaydi. Sichqoncha bilan bosilganda ramka chiqmaydi. Ya'ni dizayn ham buzilmaydi, foydalanuvchi ham yo'qolmaydi.

### Rang kontrasti

\`\`\`demo h=320 "O'qilishi qiyin va oson matn"
<style>
  body { font-family: sans-serif; font-size: 14px; padding: 16px; }
  .karta { padding: 14px; border-radius: 10px; margin-bottom: 12px; }
  .lbl { font-family: monospace; font-size: 11px; margin: 0 0 6px; }

  .yomon1 { background: white; color: #c7c7c7; }
  .yomon2 { background: #6366f1; color: #8b8fe8; }
  .yaxshi1 { background: white; color: #374151; }
  .yaxshi2 { background: #6366f1; color: #ffffff; }
</style>

<p class="lbl" style="color:#6b7280">❌ Kontrast past — o'qish qiyin</p>
<div class="karta yomon1">Bu matn oq fonda och kulrang. Kontrast 1.9:1 — talab 4.5:1</div>
<div class="karta yomon2">Bu matn ko'k fonda och ko'k. Deyarli ko'rinmaydi.</div>

<p class="lbl" style="color:#6b7280">✅ Kontrast yetarli</p>
<div class="karta yaxshi1">Bu matn oq fonda to'q kulrang. Kontrast 10.4:1 — bemalol o'qiladi.</div>
<div class="karta yaxshi2">Bu matn ko'k fonda oq. Kontrast 5.9:1 — yaxshi.</div>
\`\`\`

Talab (WCAG AA): oddiy matn uchun kamida **4.5:1**, katta matn uchun **3:1**.

Tekshirish: DevTools → elementni tanlang → Styles → rang kvadratchasiga bosing. Chrome kontrast nisbatini o'zi ko'rsatadi va ✅ yoki ⚠️ qo'yadi.

> ⚠️ Dizaynerlar och kulrang matnni yoqtiradi — u "nozik" ko'rinadi. Lekin 50 yoshdan oshgan odam yoki quyoshda telefonga qaragan odam uni **umuman o'qiy olmaydi**.

### Qolgan uchtasi

\`\`\`html
<!-- Rasm alt -->
<img src="logo.png" alt="TechShop logosi" />
<img src="bezak.svg" alt="" />          <!-- dekorativ: bo'sh alt -->

<!-- Form label -->
<label for="email">Email manzil</label>
<input type="email" id="email" />

<!-- Faqat ikonka bo'lgan tugma -->
<button aria-label="Menyuni ochish">
  <span aria-hidden="true">☰</span>
</button>
\`\`\`

Oxirgisi muhim: ekran o'quvchi \`☰\` belgisini "uch gorizontal chiziq" deb o'qiydi va foydalanuvchi hech narsa tushunmaydi. \`aria-label\` unga to'g'ri nom beradi.

---

## 📊 90+ ball uchun checklist

**Performance:**

- Rasmlarda \`width\` va \`height\`
- \`loading="lazy"\` (hero'dan tashqari)
- Hero rasmda \`fetchpriority="high"\`
- Shriftlarga \`preconnect\`
- Katta rasmlar WebP formatda

**Accessibility:**

- Barcha rasmlarda \`alt\`
- Barcha inputlarda \`label for\`
- Rang kontrasti 4.5:1 dan yuqori
- \`:focus-visible\` ishlaydi
- Ikonkali tugmalarda \`aria-label\`

**Best Practices:**

- HTTPS (Netlify va GitHub Pages o'zi beradi)
- Console'da xato yo'q
- Zamonaviy rasm formatlari

**SEO:**

- \`title\` va \`description\` bor
- Semantik HTML5
- Havolalarda tushunarli matn ("bu yerga bosing" emas)

---

## 🥉 Bronze Topshiriq

Lighthouse'ni yurgizing va **hozirgi ballaringizni yozib oling** (skrinshot oling). Keyin eng past ballni tanlang va uni yaxshilashga harakat qiling.

---

## 🥈 Silver Topshiriq

- Accessibility **90+**
- Barcha rasmlarda alt va o'lcham
- \`:focus-visible\` butun saytda ishlaydi
- Rang kontrasti tekshirilgan va tuzatilgan

---

## 🥇 Gold Topshiriq

- To'rtala ballda ham **90+**
- Oldin va keyin skrinshotlari
- Nima o'zgartirganingiz yozib chiqilgan (kamida 5 ta punkt)

---

## ✅ Dars Xulosa

- Lighthouse — F12 → Lighthouse, **Incognito** oynada
- CLS — rasmlarda \`width\`/\`height\` bo'lmasa sahifa sakraydi
- Animatsiya uchun \`transform\` va \`opacity\` — tez, boshqalari sekin
- \`outline: none\` — **hech qachon**. \`:focus-visible\` ishlating
- Rang kontrasti — kamida 4.5:1
- Ikonkali tugmalarda \`aria-label\`

> 🚀 **Keyingi dars:** Git va GitHub — kod boshqaruvi!
`,
    teacher: `
## 💡 O'qituvchi uchun

- Bu dars **o'lchanadigan natija** beradi — bu bolalarni juda rag'batlantiradi. Darsni shunday tuzing: boshida hamma Lighthouse yurgizib ball oladi, oxirida qayta yurgizadi. Ball ko'tarilganini ko'rish — kuchli motivatsiya.
- **Incognito** oynani albatta ayting. Kengaytmalar Performance ballini 20-30 punktga tushiradi va bola "menda hech narsa ishlamayapti" deb tushkunlikka tushadi.
- Ballarni tanlov qilmang. Ba'zi bolalarning kompyuteri sekinroq va Performance ballari past chiqadi — bu ularning aybi emas. **Accessibility va SEO** ballari kompyuterga bog'liq emas, ularni asosiy mezon qiling.
- CLS demosini albatta ko'rsating. "Telefonda biror narsani bosmoqchi bo'lganingizda reklama chiqib, uni bosib yuborganmisiz?" deb so'rang — hamma tanish deb javob beradi.

## ⚠️ Diqqat: focus-visible

Bolalar \`outline\` ni **xunuk** deb hisoblaydi va o'chiradi. Bu 19-darsda ham aytilgan, lekin bu yerda qayta ta'kidlang.

Yaxshi yondashuv: outline'ni o'chirish emas, **dizayniga moslashtirish**. Rangini brend rangiga o'zgartiring, \`outline-offset\` qo'shing, \`border-radius\` bering. Shunda u chiroyli bo'ladi va vazifasini bajaradi.

\`:focus\` va \`:focus-visible\` farqini ham tushuntiring — bu bolalarni ko'p chalkashtiradi. Qisqacha: \`:focus-visible\` faqat klaviatura bilan kelganda ishlaydi, shuning uchun sichqoncha bilan bosilganda ramka chiqmaydi.

## ⚠️ Ko'p uchraydigan xatolar

- **Performance juda past** — Incognito ishlatilmagan yoki sekin internet.
- **"Image elements do not have explicit width and height"** — eng ko'p uchraydigan Lighthouse ogohlantirishi. 21-darsga qayting.
- **"Background and foreground colors do not have a sufficient contrast ratio"** — och kulrang matn. Dizaynni buzmasdan to'qroq qilish kerak.
- **"Form elements do not have associated labels"** — 19-darsdagi \`label for\` muammosi.
- **"Links do not have a discernible name"** — faqat ikonka bo'lgan havola. \`aria-label\` kerak.
- **"Document does not have a meta description"** — 29-darsga qayting.

## 📊 Daraja belgilash

- **Bronze** — Lighthouse yurgizilgan, natija yozib olingan, bitta muammo tuzatilgan
- **Silver** — Accessibility 90+, focus-visible ishlaydi
- **Gold** — to'rtalasi 90+, oldin/keyin skrinshotlari, o'zgarishlar ro'yxati

> Gold uchun **oldin va keyin** skrinshotini talab qiling. Bu bolani jarayonni hujjatlashtirishga o'rgatadi — bu keyinchalik ish joyida kerak bo'ladigan ko'nikma.
`,
  },

  // ═══════════════════════════════════════════════════════════
  'junior.m1.l31': {
    goal: "git init, add, commit, push va GitHub Pages bilan saytni internetga chiqarish.",
    student: `
## 📦 Git nima va nima uchun kerak?

Fayl nomlarini shunday yozganmisiz: \`portfolio-final.html\`, \`portfolio-final2.html\`, \`portfolio-final-oxirgi.html\`?

Git aynan shu muammoni hal qiladi. U har o'zgarishni eslab qoladi va istalgan paytda orqaga qaytish imkonini beradi.

Nima beradi:

- **Xatoni qaytarish** — "kecha ishlayotgan edi" holatiga bir buyruq bilan qaytish
- **Jamoada ishlash** — bir necha kishi bir loyihada, kod aralashib ketmasdan
- **GitHub profili** — ish topishda **birinchi** so'raladigan narsa

---

## 🔧 O'rnatish va birinchi sozlash

\`\`\`bash
# 1. git-scm.com dan yuklab o'rnating

# 2. Kim ekaningizni ayting (bir marta, umrbod)
git config --global user.name "Ismingiz Familiyangiz"
git config --global user.email "email@example.com"

# 3. Standart branch nomini main qiling
git config --global init.defaultBranch main

# 4. Tekshirish
git --version
git config --list
\`\`\`

> ⚠️ **Uchinchi qator juda muhim.** Git standart holatda birinchi branch'ni \`master\` deb ataydi, GitHub esa \`main\` deb kutadi. Bu sozlamani qilmasangiz, birinchi \`push\` da shunday xato chiqadi:
>
> \`error: src refspec main does not match any\`
>
> Bu — boshlovchilarning **eng ko'p uchraydigan** to'sig'i.

---

## 🔄 Git qanday ishlaydi — uch bosqich

Git'ni tushunish uchun uchta joyni bilish kerak:

\`\`\`demo h=340 "Fayl qayerdan qayerga o'tadi"
<style>
  body { font-family: sans-serif; font-size: 12px; padding: 14px; }

  .oqim { display: flex; align-items: stretch; gap: 8px; }

  .bosqich {
    flex: 1;
    border-radius: 10px;
    padding: 12px 10px;
    text-align: center;
  }
  .b1 { background: #fef3c7; border: 2px solid #f59e0b; }
  .b2 { background: #dbeafe; border: 2px solid #3b82f6; }
  .b3 { background: #dcfce7; border: 2px solid #22c55e; }
  .b4 { background: #f3e8ff; border: 2px solid #a855f7; }

  .bosqich h4 { margin: 0 0 4px; font-size: 12px; }
  .bosqich p { margin: 0; font-size: 10px; color: #4b5563; line-height: 1.4; }

  .strelka {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    min-width: 62px;
  }
  .strelka .cmd {
    font-family: monospace; font-size: 10px;
    background: #1f2937; color: #fbbf24;
    padding: 3px 6px; border-radius: 4px;
    white-space: nowrap;
  }
  .strelka .ok { font-size: 16px; color: #9ca3af; margin-top: 2px; }

  .izoh { margin-top: 14px; color: #6b7280; font-size: 11px; line-height: 1.6; }
</style>

<div class="oqim">
  <div class="bosqich b1">
    <h4>📝 Ish papkasi</h4>
    <p>Siz tahrirlayotgan fayllar</p>
  </div>

  <div class="strelka">
    <span class="cmd">git add</span>
    <span class="ok">→</span>
  </div>

  <div class="bosqich b2">
    <h4>📋 Sahna</h4>
    <p>Saqlashga tayyorlangan fayllar</p>
  </div>

  <div class="strelka">
    <span class="cmd">git commit</span>
    <span class="ok">→</span>
  </div>

  <div class="bosqich b3">
    <h4>💾 Repo</h4>
    <p>Kompyuteringizdagi tarix</p>
  </div>

  <div class="strelka">
    <span class="cmd">git push</span>
    <span class="ok">→</span>
  </div>

  <div class="bosqich b4">
    <h4>☁️ GitHub</h4>
    <p>Internetdagi nusxa</p>
  </div>
</div>

<p class="izoh">
  <b>Nima uchun ikki bosqich (add va commit)?</b><br />
  10 ta faylni o'zgartirdingiz, lekin faqat 3 tasi bir mavzuga tegishli.
  <code>git add</code> bilan o'sha 3 tasini tanlaysiz va alohida saqlaysiz.
  Shunda tarix toza bo'ladi.
</p>
\`\`\`

---

## 🔑 Birinchi push — parol ishlamaydi

Bu — o'quvchilarni eng ko'p to'xtatadigan joy va u ko'p darsliklarda yozilmaydi.

**GitHub 2021-yil avgustdan beri parol bilan kirishni o'chirgan.** \`git push\` qilganingizda parolni so'raydi, siz GitHub parolingizni kiritasiz — va **rad etiladi**.

Ikkita yechim bor:

### Yo'l 1 — Git Credential Manager (oson, tavsiya etiladi)

Windows'da Git bilan birga o'rnatiladi. Birinchi \`push\` da brauzer oynasi ochiladi, GitHub'ga odatdagidek kirasiz — tamom. Keyingi safar so'ramaydi.

Agar oyna ochilmasa:

\`\`\`bash
git config --global credential.helper manager
\`\`\`

### Yo'l 2 — Personal Access Token (PAT)

1. GitHub → Settings → Developer settings → Personal access tokens → **Fine-grained tokens**
2. **Generate new token**
3. Repository access: o'z repongizni tanlang
4. Permissions → Contents: **Read and write**
5. Expiration: 90 kun
6. Tokenni **nusxalab oling** — u faqat bir marta ko'rsatiladi

Endi \`push\` da:

- Username: GitHub foydalanuvchi nomingiz
- Password: **parol emas, o'sha token**

> ⚠️ Tokenni hech kimga bermang va kodga yozmang. U — parol bilan teng.

---

## 🔄 Asosiy buyruqlar

\`\`\`bash
git init                    # yangi repo boshlash
git status                  # holat: nima o'zgardi?
git add index.html          # bitta faylni sahnaga
git add .                   # hammasini sahnaga
git commit -m "Xabar"       # saqlash
git log --oneline           # tarix (qisqa ko'rinishda)
git diff                    # nima o'zgardi (aniq qatorlar)
\`\`\`

\`git status\` — **eng ko'p ishlatiladigan** buyruq. Nima qilishni bilmasangiz, avval shuni yozing: Git sizga holatni aytadi va odatda keyingi qadamni ham taklif qiladi.

---

## 🌐 GitHub'ga ulash

\`\`\`bash
# 1. github.com da yangi repository yarating (public)
#    MUHIM: "Add a README file" ni BELGILAMANG — bo'sh repo kerak

# 2. Terminalda:
git remote add origin https://github.com/username/repo-nomi.git
git push -u origin main

# 3. Keyingi safar shunchaki:
git push
\`\`\`

\`-u origin main\` — bu **faqat birinchi marta** kerak. U "endi men doim shu yerga yuboraman" deb eslab qoladi.

---

## 📝 .gitignore

Ba'zi fayllar GitHub'ga **hech qachon** yuklanmasligi kerak:

\`\`\`bash
# .gitignore fayli (nuqta bilan boshlanadi)
node_modules/
.env
firebase-config.js
.DS_Store
dist/
*.log
\`\`\`

Sabablari:

- \`node_modules/\` — minglab fayl, GitHub'ni to'ldiradi va keraksiz (qayta yuklab olish mumkin)
- \`.env\`, \`firebase-config.js\` — **maxfiy kalitlar**. Ular ochiq internetga chiqsa, kimdir ishlatishi mumkin
- \`.DS_Store\` — macOS avtomatik yaratadigan keraksiz fayl

---

## 📝 Yaxshi commit xabarlari

\`\`\`demo h=340 "Yomon va yaxshi tarix"
<style>
  body { font-family: sans-serif; font-size: 12px; padding: 14px; }

  .tarix {
    background: #1f2937; border-radius: 10px;
    padding: 14px; margin-bottom: 14px;
    font-family: monospace; font-size: 11px; line-height: 1.9;
  }
  .hash { color: #fbbf24; }
  .yomon-msg { color: #f87171; }
  .yaxshi-msg { color: #86efac; }
  .lbl { font-family: monospace; font-size: 11px; color: #6b7280; margin: 0 0 6px; }
</style>

<p class="lbl">❌ Bunday tarixdan hech narsa tushunib bo'lmaydi</p>
<div class="tarix">
  <div><span class="hash">a3f21c</span> <span class="yomon-msg">o'zgartirdim</span></div>
  <div><span class="hash">9b4e77</span> <span class="yomon-msg">kod</span></div>
  <div><span class="hash">c1d8a2</span> <span class="yomon-msg">asdfgh</span></div>
  <div><span class="hash">5e9f31</span> <span class="yomon-msg">fix</span></div>
  <div><span class="hash">2a7b09</span> <span class="yomon-msg">yana</span></div>
</div>

<p class="lbl">✅ Bunda har bir qadam ko'rinib turibdi</p>
<div class="tarix">
  <div><span class="hash">a3f21c</span> <span class="yaxshi-msg">Portfolio: dark mode qo'shildi</span></div>
  <div><span class="hash">9b4e77</span> <span class="yaxshi-msg">Navbar sticky pozitsiyaga o'tkazildi</span></div>
  <div><span class="hash">c1d8a2</span> <span class="yaxshi-msg">Loyihalar bo'limi Grid bilan qayta qurildi</span></div>
  <div><span class="hash">5e9f31</span> <span class="yaxshi-msg">Xato: mobilda gorizontal scroll tuzatildi</span></div>
  <div><span class="hash">2a7b09</span> <span class="yaxshi-msg">Hero: gradient fon va animatsiya</span></div>
</div>
\`\`\`

Yaxshi xabar qoidasi: **"Bu commit nima qiladi?"** degan savolga javob bersin.

Yordamchi jumla: *"Agar bu commit qo'llansa, u ..."* — davomini yozing.

---

## 🌐 GitHub Pages — bepul hosting

Saytingizni internetga chiqarish uchun pul to'lash shart emas:

\`\`\`text
1. GitHub.com → Repository → Settings
2. Chap menyudan: Pages
3. Source: "Deploy from a branch"
4. Branch: main, Folder: / (root)
5. Save
6. 1-2 daqiqa kuting

Manzilingiz: https://username.github.io/repo-nomi
\`\`\`

Endi har \`git push\` dan keyin sayt **avtomatik yangilanadi**.

> ⚠️ Bosh sahifa fayli albatta \`index.html\` deb nomlangan bo'lsin. \`portfolio.html\` bo'lsa — GitHub uni topa olmaydi va bo'sh sahifa ko'rsatadi.

---

## 🥉 Bronze Topshiriq

Portfolio papkangizda repo yarating va kamida **3 ta commit** qiling:

\`\`\`bash
git init
git add .
git commit -m "Portfolio: dastlabki versiya"
\`\`\`

\`git log --oneline\` bilan tarixni ko'ring.

---

## 🥈 Silver Topshiriq

- GitHub'da public repository yarating
- Kodni push qiling
- \`.gitignore\` fayli bo'lsin
- Commit xabarlari **mazmunli** bo'lsin (kamida 5 ta)

---

## 🥇 Gold Topshiriq

- Yuqoridagilar + GitHub Pages yoqilgan
- Sayt haqiqiy manzilda ochiladi
- Repo'da \`README.md\` bor: loyiha nomi, tavsifi, ishlatilgan texnologiyalar, jonli havola
- Kamida 10 ta mazmunli commit

---

## ✅ Dars Xulosa

| Buyruq | Nima qiladi |
| --- | --- |
| \`git init\` | Repo boshlash |
| \`git status\` | Holat ko'rish — eng ko'p ishlatiladi |
| \`git add .\` | Barcha o'zgarishlarni sahnaga |
| \`git commit -m "..."\` | Saqlash |
| \`git push\` | GitHub'ga yuklash |
| \`git pull\` | GitHub'dan olish |
| \`git log --oneline\` | Tarixni ko'rish |

- \`init.defaultBranch main\` — **birinchi sozlash**
- GitHub **parol qabul qilmaydi** — token yoki Credential Manager
- \`.gitignore\` — maxfiy fayllar hech qachon yuklanmasin
- Commit xabari — "nima qildi" degan savolga javob bersin

> 🚀 **Keyingi dars:** VS Code tricks va DevTools chuqur!
`,
    teacher: `
## ⚠️ Notion'da yozilmagan ikkita narsa — ikkalasi ham darsni to'xtatadi

Bu darsda bolalar **albatta** ikkita to'siqqa uriladi va asl sahifada ularning ikkalasi ham yo'q.

### 1. \`main\` va \`master\` nomuvofiqligi

Git \`git init\` qilganda birinchi branch'ni **\`master\`** deb ataydi (sozlanmagan bo'lsa). GitHub esa yangi repolarda **\`main\`** ni kutadi.

Natijada \`git push -u origin main\` xato beradi:

\`error: src refspec main does not match any\`

Bola nima bo'layotganini tushunmaydi, chunki u aynan darslikdagi buyruqni yozgan.

**Yechim:** birinchi sozlashda \`git config --global init.defaultBranch main\` qo'shildi. Buni **darsning boshida**, hamma bilan birga qiling.

### 2. GitHub parolni qabul qilmaydi

GitHub 2021-yil 13-avgustdan beri Git operatsiyalari uchun parol autentifikatsiyasini **butunlay o'chirgan**.

Bola \`git push\` yozadi, parol so'raladi, u GitHub parolini kiritadi — va rad javobini oladi. Xabar chalkash bo'ladi va bola "parolim noto'g'rimi?" deb o'ylaydi.

**Yechim darsga qo'shildi, ikki yo'l bilan:**

- **Git Credential Manager** — Windows'da Git bilan birga keladi, brauzer orqali kirish. Sinf uchun eng oson.
- **Personal Access Token** — agar birinchisi ishlamasa.

**Tavsiya:** darsdan **oldin** o'zingiz sinab ko'ring. Sinfdagi kompyuterlarda Credential Manager ishlasa, PAT bilan vaqt sarflamang.

---

## 💡 O'qituvchi uchun

- Git — bolalar uchun eng **mavhum** mavzu, chunki hech narsa ko'rinmaydi. Shuning uchun darsdagi uch bosqich diagrammasini doskaga ham chizing va har buyruqdan keyin "hozir fayl qayerda?" deb so'rang.
- \`git status\` ni **odat** qildiring. Har buyruqdan keyin yozdiring. Bu ularni chalkashishdan qutqaradi.
- Commit xabarlari — bolalar \`asdfgh\` yozadi. Demo'dagi ikki tarixni ko'rsating va so'rang: "olti oydan keyin qaysi biridan foyda bo'ladi?"
- \`.gitignore\` va maxfiy kalitlar mavzusini **jiddiy** o'ting. 3-modulda Firebase kalitlari bilan ishlashadi. Hozir odat shakllansa, keyin muammo bo'lmaydi.
- Terminal bolalarni qo'rqitadi. Birinchi 10 daqiqani faqat terminalda yurishga sarflang: \`cd\`, \`ls\` (Windows'da \`dir\`), \`pwd\`.

## ⚠️ Ko'p uchraydigan xatolar

- **\`src refspec main does not match any\`** — yuqoridagi branch muammosi. Yoki hali birorta commit qilinmagan.
- **\`Authentication failed\`** — parol ishlatilgan. Token kerak.
- **\`fatal: not a git repository\`** — \`git init\` qilinmagan yoki noto'g'ri papkada.
- **\`git add .\` da \`node_modules\` ham qo'shilib ketgan** — \`.gitignore\` \`git add\` dan **oldin** yaratilishi kerak.
- **GitHub Pages bo'sh sahifa ko'rsatyapti** — bosh fayl \`index.html\` emas, yoki repo private.
- **Repo yaratishda README belgilangan** — repo bo'sh emas va push konflikt beradi. Yangi repo **bo'sh** bo'lsin.

## 📊 Daraja belgilash

- **Bronze** — lokal repo, 3+ commit, tarix ko'rinadi
- **Silver** — GitHub'da, .gitignore bor, xabarlar mazmunli
- **Gold** — Pages ishlaydi, README bor, 10+ commit

> Gold'ni tekshirish oson: bolaning sayt havolasini bosing. Ochilsa — bajarilgan.
`,
  },

  // ═══════════════════════════════════════════════════════════
  'junior.m1.l32': {
    goal: "VS Code'ning kuchli imkoniyatlari va Chrome DevTools'ni chuqur o'rganish.",
    student: `
## ⌨️ Nima uchun qisqartmalar?

Sichqoncha bilan menyudan qidirish — sekin. Professional dasturchi klaviaturadan qo'lini deyarli uzmaydi.

Hammasini birdan yodlash shart emas. **Har hafta 3 tasini** tanlang va ataylab ishlatib yuring — bir oyda ular avtomatik bo'lib qoladi.

---

## 🎯 Eng ko'p ish beradigan 10 tasi

| Qisqartma | Nima qiladi |
| --- | --- |
| \`Ctrl+P\` | Fayl nomini yozib, darhol ochish |
| \`Ctrl+Shift+P\` | Command Palette — hamma buyruq shu yerda |
| \`Ctrl+D\` | Keyingi bir xil so'zni ham tanlash |
| \`Alt+↑/↓\` | Qatorni yuqori/pastga ko'chirish |
| \`Alt+Shift+↓\` | Qatorni nusxalash |
| \`Ctrl+/\` | Izohga aylantirish |
| \`Shift+Alt+F\` | Kodni formatlash (Prettier) |
| \`Ctrl+\`\` | Terminal ochish/yopish |
| \`Alt+Click\` | Bir vaqtda bir necha joyga kursor |
| \`Ctrl+Shift+L\` | Bir xil so'zlarning **hammasini** tanlash |

> 💡 \`Ctrl+D\` — eng foydali. Bir xil class nomini 5 joyda o'zgartirish kerakmi? So'zga bosing, \`Ctrl+D\` ni 5 marta bosing, yozing. Hammasi bir vaqtda o'zgaradi.

---

## 📦 Emmet — HTML'ni tez yozish

VS Code'da o'rnatilgan. Qisqa yozuv yozib \`Tab\` bosasiz — u to'liq HTML'ga aylanadi.

\`\`\`demo h=400 "Emmet nima qiladi"
<style>
  body { font-family: sans-serif; font-size: 12px; padding: 14px; }

  .juft { margin-bottom: 16px; }

  .kirish {
    font-family: monospace; font-size: 13px;
    background: #1f2937; color: #fbbf24;
    padding: 8px 12px; border-radius: 6px 6px 0 0;
    display: block;
  }

  .chiqish {
    font-family: monospace; font-size: 11px;
    background: #111827; color: #d1d5db;
    padding: 10px 12px; border-radius: 0 0 6px 6px;
    white-space: pre; overflow-x: auto;
    margin: 0; line-height: 1.6;
  }

  .ok { color: #6b7280; font-size: 11px; padding: 2px 12px; background: #111827; }
</style>

<div class="juft">
  <code class="kirish">ul&gt;li*3</code>
  <div class="ok">↓ Tab</div>
  <pre class="chiqish">&lt;ul&gt;
  &lt;li&gt;&lt;/li&gt;
  &lt;li&gt;&lt;/li&gt;
  &lt;li&gt;&lt;/li&gt;
&lt;/ul&gt;</pre>
</div>

<div class="juft">
  <code class="kirish">nav&gt;ul&gt;li*3&gt;a</code>
  <div class="ok">↓ Tab</div>
  <pre class="chiqish">&lt;nav&gt;
  &lt;ul&gt;
    &lt;li&gt;&lt;a href=""&gt;&lt;/a&gt;&lt;/li&gt;
    &lt;li&gt;&lt;a href=""&gt;&lt;/a&gt;&lt;/li&gt;
    &lt;li&gt;&lt;a href=""&gt;&lt;/a&gt;&lt;/li&gt;
  &lt;/ul&gt;
&lt;/nav&gt;</pre>
</div>

<div class="juft">
  <code class="kirish">div.karta&gt;img+h3+p</code>
  <div class="ok">↓ Tab</div>
  <pre class="chiqish">&lt;div class="karta"&gt;
  &lt;img src="" alt=""&gt;
  &lt;h3&gt;&lt;/h3&gt;
  &lt;p&gt;&lt;/p&gt;
&lt;/div&gt;</pre>
</div>
\`\`\`

**Belgilar ma'nosi:**

| Belgi | Ma'nosi | Misol |
| --- | --- | --- |
| \`>\` | ichiga | \`ul>li\` |
| \`+\` | yoniga | \`h1+p\` |
| \`*\` | takrorlash | \`li*5\` |
| \`.\` | class | \`div.karta\` |
| \`#\` | id | \`div#app\` |
| \`[]\` | atribut | \`input[type=email]\` |
| \`{}\` | matn | \`a{Bosh sahifa}\` |

Murakkabroq misol:

\`\`\`text
.galereya>div.karta*3>img+h3{Sarlavha}+p{Matn}
\`\`\`

Bu bitta qator uch karta yaratadi, har birida rasm, sarlavha va matn bilan.

### CSS uchun ham ishlaydi

\`\`\`text
df    → display: flex
jcc   → justify-content: center
aic   → align-items: center
m10   → margin: 10px
p20-30 → padding: 20px 30px
bgc   → background-color: #fff
fw700 → font-weight: 700
\`\`\`

---

## 🔍 DevTools — Elements paneli

\`\`\`text
F12 → Elements
\`\`\`

Bu yerda uchta narsani bilish kerak:

**1. Styles** — elementga qo'llanilgan CSS qoidalari. Qiymatga bosib to'g'ridan-to'g'ri o'zgartirish mumkin. Chizib tashlangan qoidalar — ular bekor qilingan (4-darsdagi specificity).

**2. Computed** — brauzer **oxir-oqibat** nima qo'llaganini ko'rsatadi. "Nega bu element 20px emas 24px?" degan savolga javob shu yerda.

**3. Layout** — Grid yoki Flexbox ishlatilgan elementlar yonida kichik tugma chiqadi. Bosilsa, sahifada chiziqlar va katak raqamlari ko'rinadi. 14-darsda gaplashgan edik.

> 💡 DevTools'dagi o'zgarishlar **vaqtinchalik**. Sahifani yangilasangiz yo'qoladi. Bu — xavfsiz tajriba maydoni.

---

## 🌐 DevTools — Network paneli

Sahifa nima yuklayotganini ko'rsatadi: har bir rasm, CSS, shrift.

Bu yerda ikkita narsa muhim:

**Sekin internetni taqlid qilish** — yuqoridagi ro'yxatdan \`Slow 4G\` ni tanlang va sahifani yangilang. Sizning saytingiz sekin internetda qanday ochilishini ko'rasiz. Ko'p bolalar buni ko'rgach, rasmlarni optimallashtirishni jiddiy qabul qiladi.

**Hajmni ko'rish** — pastda umumiy hajm yoziladi. Agar u 3-4 MB bo'lsa — rasmlaringiz juda katta.

---

## 💻 DevTools — Console paneli

Console'da JavaScript yozish mumkin. Hali JavaScript o'rganmagansiz, lekin ikkita foydali narsa bor:

\`\`\`javascript
// Elementni topish (querySelector qisqartmasi)
$('h1')

// Uning stilini o'zgartirish
$('h1').style.color = 'red'
\`\`\`

Bu — sahifani sinab ko'rishning tez usuli.

**Xatolar ham shu yerda ko'rinadi.** Sayt kutilganidek ishlamasa, birinchi navbatda Console'ni oching. Qizil xabarlar bo'lsa — o'qing, ular odatda qaysi faylda va nechanchi qatorda muammo borligini aytadi.

---

## 📱 Device Toolbar

\`\`\`text
Ctrl+Shift+M
\`\`\`

Telefon va planshet ekranini taqlid qiladi. 15-darsda ishlatgansiz.

Uchta foydali narsa:

- Yuqoridan qurilma tanlash (iPhone SE — eng tor, eng qiyin sinov)
- Kenglikni qo'lda yozish
- Aylantirish tugmasi (gorizontal rejim)

---

## 🥉 Bronze Topshiriq

Emmet bilan quyidagilarni yozing (**qo'lda yozmang**):

\`\`\`text
nav>ul>li*4>a
div.karta*3>img+h3+p
form>div.guruh*3>label+input
\`\`\`

---

## 🥈 Silver Topshiriq

- Bir hafta davomida sichqonchasiz ishlashga harakat qiling
- \`Ctrl+D\` bilan bir vaqtda bir necha joyni tahrirlab ko'ring
- Shift+Alt+F bilan butun faylni formatlang

---

## 🥇 Gold Topshiriq

DevTools bilan tekshiruv o'tkazing:

1. Network → \`Slow 4G\` bilan saytingizni oching. Necha soniyada ochildi?
2. Umumiy hajm qancha? 2 MB dan ko'p bo'lsa — nima og'irlik qilyapti?
3. Console'da xato bormi?
4. Elements → Computed bilan biror elementning haqiqiy o'lchamini toping
5. Natijalarni yozib chiqing va **kamida bitta narsani** yaxshilang

---

## ✅ Dars Xulosa

- Har hafta **3 ta** qisqartma o'rganing, hammasini birdan emas
- \`Ctrl+D\` — bir vaqtda bir necha joyni tahrirlash
- Emmet: \`>\` ichiga, \`+\` yoniga, \`*\` takrorlash
- Elements → **Computed** — "nega bunday?" savoliga javob
- Network → **Slow 4G** — haqiqiy foydalanuvchi tajribasi
- Console — xatolar birinchi navbatda shu yerda ko'rinadi

> 🚀 **Keyingi dars:** 3-oy loyihasi — Portfolio Final Polish!
`,
    teacher: `
## 💡 O'qituvchi uchun

- Qisqartmalarni **ro'yxat qilib bermang** — bolalar yodlamaydi. O'rniga: har dars boshida bitta qisqartma e'lon qiling va o'sha kuni faqat shuni ishlatishni talab qiling.
- \`Ctrl+D\` — eng ta'sirli namoyish. Bir xil class nomini 6 joyda o'zgartirish kerak bo'lgan holatni tayyorlab keling. Avval qo'lda qiling (sekin), keyin \`Ctrl+D\` bilan (bir zumda). Farq ko'rinadi.
- Emmet bolalarga juda yoqadi. Lekin ogohlantiring: Emmet — **tez yozish** vositasi, tushunish o'rnini bosmaydi. Bola \`nav>ul>li*4>a\` yozganda nima hosil bo'lishini oldindan ayta olishi kerak.
- **Network → Slow 4G** — bu darsdagi eng qimmatli 5 daqiqa. Bolalar tez internetda ishlaydi va saytlari og'irligini sezmaydi. Sekin rejimda o'z saytini ko'rgan bola rasmlarni optimallashtirishni birinchi marta jiddiy qabul qiladi.
- Console'dagi qizil xatolarni **o'qishni** o'rgating. Bolalar ularni ko'rmaydi yoki qo'rqadi. Ataylab xato qiling (masalan \`<img src="yoq.jpg">\`) va xabarni birga o'qing.

## ⚠️ Ko'p uchraydigan xatolar

- **Emmet ishlamayapti** — fayl \`.txt\` yoki \`.md\` sifatida saqlangan. Emmet fayl turiga qarab ishlaydi, \`.html\` bo'lishi kerak.
- **\`Ctrl+/\` izoh qo'ymayapti** — kursor kod ichida emas, bo'sh joyda.
- **Prettier formatlamayapti** — kengaytma o'rnatilmagan yoki standart formatter tanlanmagan. \`Ctrl+Shift+P\` → "Format Document With" → Prettier.
- **DevTools'da o'zgarish saqlanmayapti** — bu **xato emas**, shunday bo'lishi kerak. Bolalarga aniq ayting: DevTools — sinov maydoni, kod fayldan o'zgartiriladi.
- **Console'da \`$\` ishlamayapti** — jQuery o'rnatilgan saytlarda \`$\` boshqa narsani anglatadi. O'z loyihalarida muammo bo'lmaydi.

## 📊 Daraja belgilash

- **Bronze** — Emmet bilan uchta tuzilma yozilgan, qo'lda emas
- **Silver** — qisqartmalar odatga aylangan (darsda kuzating)
- **Gold** — DevTools tekshiruvi o'tkazilgan va **natija yozilgan**

> Gold'ni tekshirishda so'rang: "Sekin internetda saytingiz necha soniyada ochildi?" Aniq raqam ayta olsa — bajargan.
`,
  },

  // ═══════════════════════════════════════════════════════════
  'junior.m1.l33': {
    goal: "Portfolioga uch oylik bilimlarni jamlash va GitHub Pages'ga chiqarish.",
    student: `
## 💼 Bu dars nima uchun?

Uch oy davomida 32 ta dars o'tdingiz. Portfolio esa har oyda bir marta yangilandi.

Bu darsda uni **oxirgi holatga** keltirasiz: hamma narsa joyida, hech qayerda buzuq joy yo'q, internetda ishlaydi.

Bu — 36-darsdagi Demo Day'da ko'rsatadigan ishingiz.

---

## ✅ HTML checklist

- Semantik teglar: \`header\`, \`nav\`, \`main\`, \`section\`, \`article\`, \`footer\`
- \`<title>\` to'g'ri (50–60 belgi, "Document" emas)
- \`<meta name="description">\` (150–160 belgi)
- Open Graph teglari: \`og:title\`, \`og:description\`, \`og:image\`, \`og:url\`
- Favicon
- **Barcha** rasmlarda mazmunli \`alt\`
- Rasmlarda \`width\` va \`height\` attributlari
- Formalarda \`label for\` + \`input id\`
- Sahifada faqat bitta \`h1\`

---

## 🎨 CSS checklist

- \`:root\` da CSS o'zgaruvchilar (ranglar, o'lchamlar, radius)
- Qorong'i rejim ishlaydi
- To'liq responsive: 375px dan 1920px gacha
- Loyihalar bo'limi — CSS Grid
- Navigatsiya — Flexbox
- Sticky navbar (\`position: sticky\` + \`z-index\` + \`top: 0\`)
- \`::before\` yoki \`::after\` bilan bezak
- \`@keyframes\` bilan kamida bitta animatsiya
- Scroll animatsiyalari (\`animation-timeline: view()\`)
- Hero'da gradient fon
- Custom scrollbar (bitta usul bilan — konfliktsiz)
- \`clamp()\` bilan fluid tipografiya, o'rtasida \`rem\`
- \`object-fit: cover\` barcha rasmlarda
- \`prefers-reduced-motion\` hisobga olingan

---

## 🚀 Deploy checklist

- GitHub'da public repository
- \`.gitignore\` bor
- Kamida 10 ta mazmunli commit
- \`README.md\`: loyiha nomi, tavsif, texnologiyalar, jonli havola
- GitHub Pages yoqilgan va sayt ochiladi
- HTTPS ishlaydi (GitHub o'zi beradi)
- Lighthouse: Performance, Accessibility, SEO — **90+**

---

## 🔮 JavaScript qismi — hali emas

Portfolioning ba'zi qismlari hozircha CSS bilan qilingan:

| Nima | Hozir | 4–5 oyda |
| --- | --- | --- |
| Qorong'i rejim | Checkbox + \`:checked\` | \`localStorage\` bilan saqlanadi |
| Hamburger menyu | Checkbox + \`:checked\` | \`classList.toggle()\` |
| Scroll animatsiyalar | \`animation-timeline\` | IntersectionObserver (eski brauzerlar uchun) |
| Aktiv menyu havolasi | — | Scroll pozitsiyasiga qarab |
| Forma yuborish | Faqat ko'rinish | Haqiqiy tekshiruv va yuborish |

Bu — kamchilik emas, **rejaning bir qismi**. Hozir sayt to'liq ishlaydi va chiroyli. 5-oyda unga jon kiritasiz.

> 💡 Shu jadvalni saqlab qo'ying. 5-oyda portfoliongizni ochib, har qatorni JavaScript bilan qayta yozasiz. O'shanda ikki yondashuvni taqqoslash — juda kuchli dars bo'ladi.

---

## 🧪 Yakuniy tekshiruv — 8 qadam

**1. Turli ekranlarda**

DevTools → Device Toolbar (\`Ctrl+Shift+M\`). iPhone SE, iPad, Desktop. Gorizontal scroll bormi? Matn chiqib ketyaptimi?

**2. Sekin internetda**

Network → \`Slow 4G\` → sahifani yangilang. Necha soniyada ochildi? Umumiy hajm qancha?

**3. Klaviatura bilan**

Sichqonchani qo'ying va faqat \`Tab\` bilan butun sahifani aylanib chiqing. Har qadamda qayerdaligingiz **ko'rinib turibdimi**?

**4. Qorong'i rejimda**

Rejimni almashtiring. Biror matn yo'qolib qoldimi? Kulrang matn qora fonda o'qiladimi?

**5. Animatsiyasiz**

DevTools → Rendering → \`Emulate prefers-reduced-motion: reduce\`. Sahifa **bo'sh bo'lib qolmadimi**?

**6. Lighthouse**

Incognito oynada yurgizing. To'rtala ball ham 90+ mi?

**7. Havolalar**

Har bir havolani bosib ko'ring. Menyu kerakli bo'limga olib boradimi? Tashqi havolalar yangi tabda ochiladimi?

**8. Telegram'da**

Sayt havolasini o'zingizga yuboring. Kartochka rasm bilan chiqdimi?

---

## 📝 README.md yozish

Ko'p bolalar buni e'tiborsiz qoldiradi, lekin **ish beruvchi birinchi shuni o'qiydi**.

\`\`\`markdown
# Portfolio — Ismingiz

Frontend developer sifatida birinchi portfolio saytim.

## 🔗 Jonli havola

https://username.github.io/portfolio

## 🛠 Ishlatilgan texnologiyalar

- HTML5 (semantik teglar)
- CSS3 (Grid, Flexbox, animatsiyalar, o'zgaruvchilar)
- Responsive dizayn (mobile-first)
- GitHub Pages

## ✨ Imkoniyatlar

- Qorong'i rejim
- Scroll animatsiyalari
- To'liq responsive: 375px dan 1920px gacha
- Lighthouse: Performance 95, Accessibility 100, SEO 100

## 📸 Skrinshot

![Portfolio](screenshot.png)

## 📬 Bog'lanish

- Email: email@example.com
- Telegram: @username
\`\`\`

---

## 🎤 Taqdimotga tayyorgarlik

36-darsda saytingizni ko'rsatasiz. Shu beshtasini oldindan tayyorlab qo'ying:

1. **Jonli havola** — telefonda ham ochib ko'rsatish uchun
2. **Qorong'i rejim** — almashtirib ko'rsatish
3. **Responsive** — DevTools'da yoki telefonda
4. **Lighthouse natijasi** — skrinshot
5. **GitHub repo** — commit tarixi bilan

Va bitta savolga javob tayyorlang: **"Eng qiyin qism nima bo'ldi va uni qanday yechdingiz?"**

---

## 🥉🥈🥇 Baholash

- **Bronze** — HTML va CSS checklistdan 70%, sayt deploy qilingan
- **Silver** — 90%, Lighthouse 90+ uchtasida, README bor
- **Gold** — hammasi, 8 qadamli tekshiruv o'tkazilgan, natijalar yozilgan

> 🚀 **Keyingi dars:** JavaScript — nihoyat sahifani jonlantiramiz!
`,
    teacher: `
## ⚠️ Notion'dagi checklistda tartib xatosi bor edi

Asl sahifadagi checklistda **"JS"** bo'limi bor va unda: dark mode toggle (\`localStorage\`), hamburger menyu, IntersectionObserver, aktiv nav havolasi.

Muammo: bu dars **33-raqamli**, JavaScript esa **34-darsdan** boshlanadi. Ya'ni o'quvchidan hali o'tilmagan narsa so'ralyapti.

**Qanday tuzatildi:** JS bo'limi checklistdan olib tashlanib, o'rniga **jadval** qo'yildi — har bir imkoniyat hozir CSS bilan qanday qilingani va 5-oyda JavaScript bilan qanday qayta yozilishi.

Bu shunchaki muammoni yashirish emas. Bola:

- Hozir nima qilganini biladi
- Nima uchun vaqtincha shunday qilganini tushunadi
- Keyin nima bo'lishini kutadi

CSS bo'limidagi "IntersectionObserver scroll animatsiyalar" ham \`animation-timeline: view()\` ga o'zgartirildi (25-darsdagi kabi).

---

## 💡 O'qituvchi uchun

- Bu — **yangi mavzu emas**. Yangi narsa o'rgatmang. Butun dars — tekshirish va tuzatish.
- 8 qadamli tekshiruvni **birga** o'ting. Bitta bolaning saytini proyektorga chiqarib, hamma qadamni ko'rsating. Keyin hamma o'zinikida takrorlaydi.
- **Klaviatura bilan yurish** (3-qadam) — eng ko'p muammo chiqadigan joy. Ko'p bolalar \`outline\` ni o'chirgan bo'ladi. Bu 30-darsda aytilgan, lekin baribir uchraydi.
- \`prefers-reduced-motion\` tekshiruvi (5-qadam) — sahifa **bo'sh bo'lib qolishi** mumkin. Bu jiddiy xato va uni faqat shu tekshiruvda topish mumkin.
- README — bolalar buni "keraksiz ish" deb hisoblaydi. Ularga bitta yaxshi va bitta bo'sh README'li repo ko'rsating. Farq darhol ko'rinadi.

## ⚠️ Bu darsda ko'p uchraydigan holatlar

- **"Menda hammasi bor"** — lekin tekshirmagan. Checklistni **chop etib** bering va qo'lda belgilashni talab qiling.
- **Lighthouse ballari past** — Incognito ishlatilmagan (30-dars).
- **Sayt ochilmayapti** — bosh fayl \`index.html\` emas yoki repo private (31-dars).
- **Qorong'i rejimda matn yo'qolgan** — kulrang matn qora fonda. Kontrast tekshirilmagan.
- **Telegram kartochkasi chiqmayapti** — \`og:image\` nisbiy yo'l bilan yozilgan (29-dars).
- **Vaqt yetmayapti** — bu normal. Darsda tekshiruvni birga qiling, tuzatish uy vazifasi.

## 📊 Baholash bo'yicha maslahat

Bu darsda **jarayonni** baholang, natijani emas. Bola 8 qadamli tekshiruvni o'tkazdimi va topilgan muammolarni yozdimi?

Mukammal sayt talab qilmang. Muhimi — bola o'z ishini **tekshirishni** o'rgansin. Bu ko'nikma undan ham qimmatroq.
`,
  },

  // ═══════════════════════════════════════════════════════════
  'junior.m1.l34': {
    goal: "JavaScript'ni HTML'ga ulash, console bilan ishlash va birinchi interaktiv element.",
    student: `
## 🎉 Uchinchi til

Uch oy davomida ikkita til o'rgandingiz:

- **HTML** — sahifada **nima** bor
- **CSS** — u **qanday ko'rinadi**

Endi uchinchisi keladi:

- **JavaScript** — sahifa **nima qiladi**

CSS bilan siz tugmani chiroyli qildingiz. JavaScript bilan u **bosilganda nimadir sodir bo'ladi**.

---

## 🔗 JS ni HTML ga ulash

\`\`\`html
<!-- 1. Ichki — sahifa ichida -->
<script>
  console.log("Salom!");
</script>

<!-- 2. Tashqi — alohida faylda (TAVSIYA ETILADI) -->
<script src="script.js"></script>

<!-- 3. defer bilan — head da yozib, DOM tayyor bo'lganda ishga tushirish -->
<script src="script.js" defer></script>
\`\`\`

> ⚠️ **Muhim qoida:** \`<script>\` ni \`</body>\` dan **oldin** yozing, yoki \`defer\` ishlating.
>
> Sabab: brauzer HTML'ni yuqoridan pastga o'qiydi. Agar JavaScript \`<head>\` da bo'lsa, u sahifa hali yaratilmasdan ishga tushadi va elementlarni topa olmaydi.

\`\`\`demo h=300 "script qayerda turishi muhim"
<style>
  body { font-family: sans-serif; font-size: 13px; padding: 14px; }
  .natija { padding: 12px; border-radius: 8px; margin-bottom: 10px; }
  .xato { background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; }
  .ok { background: #ecfdf5; border: 1px solid #a7f3d0; color: #065f46; }
  h2 { font-size: 15px; margin: 0 0 10px; }
  code { font-family: monospace; background: #f3f4f6; padding: 1px 5px; border-radius: 3px; }
</style>

<h2 id="sarlavha">Men sarlavhaman</h2>

<div class="natija xato">
  <b>❌ head da yozilsa:</b><br />
  <code>document.querySelector('#sarlavha')</code> → <code>null</code><br />
  Element hali mavjud emas, xato chiqadi.
</div>

<div class="natija ok" id="natija">
  <b>✅ body oxirida yozilsa:</b> element topildi.
</div>

<script>
  // Bu script body oxirida — shuning uchun ishlaydi
  var el = document.querySelector('#sarlavha');
  var natija = document.querySelector('#natija');
  if (el) {
    natija.innerHTML = '<b>✅ body oxirida yozilsa:</b><br />Element topildi: "' + el.textContent + '"';
  }
</script>
\`\`\`

---

## 💻 console.log — dasturchining ko'zi

\`console.log()\` — ekranga emas, **DevTools Console'iga** yozadi. Bu — kodingiz nima qilayotganini ko'rish uchun.

Quyidagi demoda console'ni taqlid qildim, chunki iframe ichida haqiqiy DevTools ochilmaydi. Kodni o'zgartirib sinab ko'ring:

\`\`\`demo h=360 "console.log natijasi"
<style>
  body { font-family: sans-serif; font-size: 13px; padding: 14px; margin: 0; }
  h3 { font-size: 13px; margin: 0 0 8px; color: #374151; }
  #console {
    background: #1f2937; color: #d1d5db;
    border-radius: 8px; padding: 12px;
    font-family: monospace; font-size: 12px;
    min-height: 150px; line-height: 1.8;
  }
  #console div { border-bottom: 1px solid #374151; padding: 2px 0; }
  .son { color: #fbbf24; }
  .matn { color: #86efac; }
  .mantiq { color: #c4b5fd; }
</style>

<h3>DevTools Console (taqlid)</h3>
<div id="console"></div>

<script>
  // Console'ni taqlid qiluvchi funksiya
  var chiqish = document.querySelector('#console');
  function log(qiymat) {
    var tur = typeof qiymat;
    var klass = tur === 'number' ? 'son' : tur === 'boolean' ? 'mantiq' : 'matn';
    var qator = document.createElement('div');
    qator.innerHTML = '<span class="' + klass + '">' + String(qiymat) + '</span>' +
                      '  <span style="color:#6b7280">// ' + tur + '</span>';
    chiqish.appendChild(qator);
  }

  // ── SHU YERDAN O'ZGARTIRING ──────────────────────────

  log("Salom, dunyo!");
  log(42);
  log(3.14);
  log(true);
  log(10 + 5);
  log("Ahmad" + " " + "Toshmatov");
  log(7 > 3);
</script>
\`\`\`

O'ng tomonda har qiymat yonida uning **turi** yozilgan: \`string\` (matn), \`number\` (son), \`boolean\` (rost/yolg'on). Bu — JavaScript'dagi asosiy uch tur.

> 💡 Haqiqiy ishda \`console.log()\` yozasiz va natijani **F12 → Console** da ko'rasiz. Buni hozir o'z kompyuteringizda sinab ko'ring.

---

## 🎯 DOM — sahifani o'zgartirish

JavaScript sahifadagi istalgan elementni topib, o'zgartira oladi.

\`\`\`javascript
// 1. Elementni topish (CSS selektori bilan!)
const sarlavha = document.querySelector('h1');
const tugma = document.querySelector('#btn');
const kartalar = document.querySelector('.karta');

// 2. Matnini o'zgartirish
sarlavha.textContent = 'Yangi matn';

// 3. Stilini o'zgartirish
sarlavha.style.color = 'red';
sarlavha.style.fontSize = '40px';
\`\`\`

Diqqat qiling: \`querySelector\` ichida **CSS selektori** yoziladi — \`#id\`, \`.class\`, \`h1\`. Siz buni 4-darsda o'rgangansiz.

\`\`\`demo h=340 "Tugmalarni bosing"
<style>
  body { font-family: sans-serif; font-size: 13px; padding: 16px; text-align: center; }
  #matn {
    font-size: 22px; font-weight: 700; margin: 20px 0;
    color: #1f2937; transition: color 0.3s, font-size 0.3s;
  }
  button {
    padding: 9px 16px; margin: 3px; border: none; border-radius: 8px;
    background: #6366f1; color: white; font-size: 12px; cursor: pointer;
  }
  button:hover { background: #4f46e5; }
</style>

<p id="matn">Meni o'zgartiring</p>

<button id="b1">Matnni o'zgartir</button>
<button id="b2">Rangni o'zgartir</button>
<button id="b3">Kattalashtir</button>
<button id="b4">Qaytar</button>

<script>
  var matn = document.querySelector('#matn');

  document.querySelector('#b1').addEventListener('click', function () {
    matn.textContent = 'Men o\\'zgardim!';
  });

  document.querySelector('#b2').addEventListener('click', function () {
    matn.style.color = '#ef4444';
  });

  document.querySelector('#b3').addEventListener('click', function () {
    matn.style.fontSize = '34px';
  });

  document.querySelector('#b4').addEventListener('click', function () {
    matn.textContent = 'Meni o\\'zgartiring';
    matn.style.color = '#1f2937';
    matn.style.fontSize = '22px';
  });
</script>
\`\`\`

---

## 👂 addEventListener — hodisani kutish

\`\`\`javascript
tugma.addEventListener('click', function () {
  // bu yerdagi kod TUGMA BOSILGANDA ishlaydi
});
\`\`\`

Uch qismi bor:

1. **Kim** — \`tugma\`
2. **Nima bo'lganda** — \`'click'\`
3. **Nima qilish** — funksiya ichidagi kod

Boshqa hodisalar: \`'mouseenter'\` (kursor keldi), \`'input'\` (yozildi), \`'keydown'\` (klavish bosildi).

---

## 🎨 Birinchi loyiha — tasodifiy rang

\`\`\`demo h=400 "Ishlaydigan loyiha — tugmani bosing"
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    transition: background 0.5s;
    min-height: 380px;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    font-family: Arial, sans-serif;
    background: #ffffff;
  }
  #rang-kodi {
    font-size: 40px; font-weight: bold; margin-bottom: 22px;
    font-family: monospace; letter-spacing: 2px;
  }
  button {
    padding: 14px 34px; font-size: 16px; border: none;
    border-radius: 12px; cursor: pointer; background: white;
    font-weight: bold; box-shadow: 0 4px 16px rgba(0,0,0,0.18);
    transition: transform 0.1s;
  }
  button:active { transform: scale(0.97); }
</style>

<p id="rang-kodi">#FFFFFF</p>
<button id="btn">Tasodifiy rang</button>

<script>
  var btn = document.querySelector('#btn');
  var rangKodi = document.querySelector('#rang-kodi');

  function tasodifiyRang() {
    var harflar = '0123456789ABCDEF';
    var rang = '#';
    for (var i = 0; i < 6; i++) {
      rang += harflar[Math.floor(Math.random() * 16)];
    }
    return rang;
  }

  btn.addEventListener('click', function () {
    var rang = tasodifiyRang();
    document.body.style.backgroundColor = rang;
    rangKodi.textContent = rang;

    // Fon yorug'mi yoki qorong'imi — matn rangini moslash
    var r = parseInt(rang.slice(1, 3), 16);
    var g = parseInt(rang.slice(3, 5), 16);
    var b = parseInt(rang.slice(5, 7), 16);
    var yorqinlik = (r * 299 + g * 587 + b * 114) / 1000;
    rangKodi.style.color = yorqinlik > 128 ? '#000' : '#fff';
  });
</script>
\`\`\`

Kodni ochib ko'ring. Hozircha hammasi tushunarli bo'lmasligi normal — bu darsda faqat **umumiy tuzilma** muhim:

- \`function\` — qayta ishlatiladigan kod bo'lagi
- \`for\` — takrorlash (6 marta harf tanlaydi)
- \`Math.random()\` — 0 va 1 orasida tasodifiy son
- \`addEventListener\` — tugma bosilganda ishga tushirish

Oxirgi to'rt qator qiziq: fon rangining **yorqinligini** hisoblaydi va matnni oq yoki qora qiladi. Aks holda och fonda oq matn ko'rinmay qolardi. Bu — 30-darsda gaplashgan **rang kontrasti**, endi kod bilan.

---

## 🥉 Bronze Topshiriq

HTML sahifa yarating, \`</body>\` oldida \`<script>\` yozing va console'ga bir necha qiymat chiqaring:

\`\`\`javascript
console.log("Mening ismim Ahmad");
console.log(2026);
console.log(10 + 5);
console.log(true);
\`\`\`

F12 → Console'da natijani ko'ring.

---

## 🥈 Silver Topshiriq

Tugma yarating. Bosilganda:

- Sarlavha matni o'zgarsin
- Sarlavha rangi o'zgarsin

Kerak: \`querySelector\`, \`addEventListener\`, \`textContent\`, \`style\`.

---

## 🥇 Gold Topshiriq

Tasodifiy rang loyihasini **o'zingiz** yozing (ko'chirmang). Qo'shimcha:

- Rang kodi ekranda ko'rinsin
- Matn rangi fonga qarab o'zgarsin
- Bo'sh joy (Space) tugmasi bosilganda ham rang o'zgarsin:

\`\`\`javascript
document.addEventListener('keydown', function (e) {
  if (e.code === 'Space') {
    e.preventDefault();
    btn.click();
  }
});
\`\`\`

---

## ✅ Dars Xulosa

- \`<script>\` — \`</body>\` oldida yoki \`defer\` bilan
- \`console.log()\` — F12 → Console'da ko'rinadi
- \`document.querySelector('...')\` — **CSS selektori** bilan element topish
- \`.textContent\` — matnni o'zgartirish
- \`.style.color\` — stilni o'zgartirish
- \`addEventListener('click', ...)\` — hodisani kutish
- Asosiy turlar: \`string\`, \`number\`, \`boolean\`

> 🚀 **Keyingi dars:** Counter — hisoblagich loyihasi!
`,
    teacher: `
## 🎉 Bu — muhim dars

Uch oydan keyin nihoyat JavaScript boshlanadi. Bolalar buni **kutib** yurishgan.

Shuning uchun bu darsni **natija bilan** boshlang, nazariya bilan emas. Tasodifiy rang loyihasini birinchi 3 daqiqada ko'rsating: "Bugun mana shuni yozamiz". Keyin orqaga qaytib tushuntiring.

---

## ⚠️ 1-Modulda JavaScript nomuvofiqligi — yakuniy holat

Bu dasturda JavaScript **34-darsdan** boshlanadi. Lekin 1-Modul topshiriqlarida u ancha oldin paydo bo'lgan edi. Jami **7 ta dars**:

| Dars | Nima talab qilingan | Qanday hal qilindi |
| --- | --- | --- |
| 13 | Modal (\`addEventListener\`) | \`:target\` bilan CSS |
| 15 | Hamburger (\`classList.toggle\`) | checkbox + \`:checked\` |
| 17 | Dark mode (\`localStorage\`) | checkbox + o'zgaruvchilar |
| 18 | Yuklanish ekrani | faqat ko'rinish |
| 19 | Forma yuborish | HTML validatsiya |
| 24 | Katalog filtri | radio + \`:checked\` + \`~\` |
| 25 | IntersectionObserver | \`animation-timeline: view()\` |
| 33 | Checklistda JS bo'limi | jadval bilan almashtirildi |

Hammasi CSS variantiga o'girildi va Notion'da ham tuzatildi.

**Endi teskari yo'nalish boshlanadi.** 5-oyda (DOM darslari) o'sha topshiriqlarni **JavaScript bilan qayta yozish** kerak. Bu — juda kuchli o'quv usuli: bola bir vazifani ikki xil vosita bilan hal qiladi va har birining chegarasini his qiladi.

Shu jadvalni saqlab qo'ying va 5-oyda ochib ko'ring.

---

## 💡 O'qituvchi uchun

- \`console.log()\` ni **F12 bilan birga** o'rgating. Bolalar uni \`alert()\` bilan chalkashtiradi va "menda hech narsa ko'rinmayapti" deydi. Console qayerdaligini har biriga ko'rsating.
- \`querySelector\` ichida **CSS selektori** yozilishini ta'kidlang. Bu — 4-darsdagi bilim. Bog'lanishni ko'rsating: "\`.karta\` CSS'da ham, JS'da ham bir xil".
- \`script\` joylashuvi muammosini **ataylab** ko'rsating: \`head\` ga qo'ying, xato chiqsin, keyin ko'chiring. Bola xato xabarini o'qishni o'rgansin.
- Bu darsda **hamma narsani tushuntirishga urinmang**. \`for\`, \`function\`, \`Math.random()\` — bular keyingi darslarda batafsil bo'ladi. Hozir maqsad: JavaScript nima qila olishini **ko'rsatish**.
- Bolalar darhol "o'yin yozamizmi?" deb so'raydi. Javob: ha, 4-oyda. Bu ularni rag'batlantiradi.

## ⚠️ Ko'p uchraydigan xatolar

- **\`Cannot read properties of null\`** — element topilmadi. Sabablari: \`script\` \`head\` da, yoki selektor xato (\`#btn\` o'rniga \`btn\`).
- **\`querySelector('#btn')\` da panjara unutilgan** — \`querySelector('btn')\` \`<btn>\` tegini qidiradi va topmaydi.
- **\`textContent\` va \`innerHTML\` chalkashtirilgan** — hozircha faqat \`textContent\` ni o'rgating, u xavfsizroq.
- **\`style.font-size\`** — JavaScript'da tire ishlatilmaydi, \`style.fontSize\` bo'lishi kerak. Bu bolalarni ko'p chalkashtiradi.
- **\`addEventListener('click')\` da qavs qo'yilgan** — \`addEventListener('click', mening())\` xato. Qavssiz: \`addEventListener('click', mening)\`.
- **Fayl \`.js\` emas \`.txt\`** — VS Code'da saqlashda kengaytma yozilmagan.

## 📊 Daraja belgilash

- **Bronze** — script ulangan, console'da natija ko'rinadi
- **Silver** — tugma bosilganda matn va rang o'zgaradi
- **Gold** — rang loyihasi **o'zi yozgan**, klaviatura ham ishlaydi

> Gold'ni tekshirishda so'rang: "\`Math.floor(Math.random() * 16)\` nima qiladi?" Ko'chirgan bola javob bera olmaydi.
`,
  },

  // ═══════════════════════════════════════════════════════════
  'junior.m1.l35': {
    goal: "DOM, hodisalar va o'zgaruvchilar — birgalikda ishlaydigan hisoblagich yasash.",
    student: `
## 🔢 Nima yasaymiz?

Ikkita loyiha: oddiy hisoblagich va sekundomer. Ikkalasi ham kichik, lekin ularda JavaScript'ning asosiy g'oyalari bor.

---

## 📦 O'zgaruvchi — qiymatni saqlash

Hisoblagich uchun sonni **biror joyda** saqlash kerak:

\`\`\`javascript
let son = 0;      // o'zgaradi
const nom = "Ahmad";  // o'zgarmaydi
\`\`\`

| Kalit so'z | Qachon |
| --- | --- |
| \`let\` | Qiymat o'zgaradi (hisoblagich, ball, vaqt) |
| \`const\` | Qiymat o'zgarmaydi (element, sozlama) |

> 💡 Odat: avval \`const\` yozing. Agar qiymat o'zgarishi kerak bo'lsa — \`let\` ga o'zgartiring. Bu xatolardan himoya qiladi.

---

## 🔢 Hisoblagich

\`\`\`demo h=360 "Tugmalarni bosing yoki ↑ ↓ tugmalaridan foydalaning"
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: Arial, sans-serif; text-align: center;
    padding: 30px 20px;
  }
  #son {
    font-size: 86px; margin: 0; font-weight: 700;
    transition: color 0.25s, transform 0.15s;
  }
  .tugmalar { display: flex; gap: 12px; justify-content: center; margin-top: 20px; }
  button {
    padding: 14px 26px; font-size: 20px; cursor: pointer;
    border-radius: 12px; border: none; color: white; font-weight: 700;
    transition: transform 0.1s;
  }
  button:active { transform: scale(0.95); }
  #ayir  { background: #e74c3c; }
  #reset { background: #95a5a6; font-size: 15px; }
  #qosh  { background: #27ae60; }
  .izoh { margin-top: 16px; color: #6b7280; font-size: 12px; }
</style>

<h1 id="son">0</h1>

<div class="tugmalar">
  <button id="ayir">−</button>
  <button id="reset">Reset</button>
  <button id="qosh">+</button>
</div>

<p class="izoh">Klaviaturada ↑ ↓ tugmalari ham ishlaydi</p>

<script>
  var sonEl = document.querySelector('#son');
  var son = 0;

  function render() {
    sonEl.textContent = son;

    if (son > 0) {
      sonEl.style.color = '#27ae60';
    } else if (son < 0) {
      sonEl.style.color = '#e74c3c';
    } else {
      sonEl.style.color = '#333333';
    }
  }

  document.querySelector('#qosh').addEventListener('click', function () {
    son = son + 1;
    render();
  });

  document.querySelector('#ayir').addEventListener('click', function () {
    son = son - 1;
    render();
  });

  document.querySelector('#reset').addEventListener('click', function () {
    son = 0;
    render();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowUp')   { son = son + 1; render(); }
    if (e.key === 'ArrowDown') { son = son - 1; render(); }
  });

  render();
</script>
\`\`\`

### Kodning tuzilishi

Diqqat qiling — bu yerda muhim naqsh bor:

\`\`\`javascript
let son = 0;              // 1. MA'LUMOT

function render() {       // 2. MA'LUMOTNI EKRANGA CHIQARISH
  sonEl.textContent = son;
}

tugma.addEventListener('click', function () {
  son = son + 1;          // 3. MA'LUMOTNI O'ZGARTIRISH
  render();               // 4. EKRANNI YANGILASH
});
\`\`\`

Bu — barcha interaktiv ilovalarning asosi. Ma'lumot o'zgaradi → ekran yangilanadi. React va boshqa zamonaviy vositalar ham aynan shu g'oyaga qurilgan.

> ⚠️ Eng ko'p uchraydigan xato: \`son\` ni o'zgartirish, lekin \`render()\` ni chaqirishni unutish. Kod ishlaydi, lekin ekranda hech narsa o'zgarmaydi.

Oxiridagi \`render()\` ham muhim — busiz sahifa ochilganda \`0\` chiqmaydi.

---

## ➕ qisqartmalar

\`\`\`javascript
son = son + 1;   →   son++;      // bittaga oshirish
son = son - 1;   →   son--;      // bittaga kamaytirish
son = son + 5;   →   son += 5;   // beshtaga oshirish
\`\`\`

Uchalasi bir xil ishlaydi. Qisqartma o'qishga qulayroq.

---

## ⏱ Sekundomer

\`\`\`demo h=400 "Boshlash, to'xtatish, lap"
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Courier New', monospace; text-align: center;
    padding: 24px 16px;
  }
  #display {
    font-size: 52px; font-weight: bold; letter-spacing: 3px;
    color: #1f2937;
  }
  .tugmalar { margin-top: 20px; display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
  button {
    padding: 11px 22px; font-size: 14px; cursor: pointer;
    border: none; border-radius: 8px; color: white;
    font-family: Arial, sans-serif; font-weight: 600;
  }
  #start { background: #27ae60; }
  #stop  { background: #e74c3c; }
  #reset { background: #95a5a6; }
  #lap   { background: #3498db; }

  #laplar {
    margin-top: 18px; font-size: 13px; color: #4b5563;
    font-family: 'Courier New', monospace;
    max-height: 90px; overflow-y: auto;
  }
  #laplar div { padding: 3px 0; border-bottom: 1px solid #f0f0f0; }
</style>

<div id="display">00:00:00</div>

<div class="tugmalar">
  <button id="start">Boshlash</button>
  <button id="stop">To'xtatish</button>
  <button id="lap">Lap</button>
  <button id="reset">Reset</button>
</div>

<div id="laplar"></div>

<script>
  var intervalId = null;
  var millisekund = 0;
  var laplar = [];

  var displayEl = document.querySelector('#display');
  var laplarEl = document.querySelector('#laplar');

  // Raqamni "05" ko'rinishiga keltirish
  function ikkiXona(son) {
    return String(son).padStart(2, '0');
  }

  function vaqtFormat(ms) {
    var min = Math.floor(ms / 60000);
    var sek = Math.floor((ms % 60000) / 1000);
    var cs  = Math.floor((ms % 1000) / 10);
    return ikkiXona(min) + ':' + ikkiXona(sek) + ':' + ikkiXona(cs);
  }

  function render() {
    displayEl.textContent = vaqtFormat(millisekund);
  }

  document.querySelector('#start').addEventListener('click', function () {
    if (intervalId) return;          // allaqachon ishlayapti
    intervalId = setInterval(function () {
      millisekund += 10;
      render();
    }, 10);
  });

  document.querySelector('#stop').addEventListener('click', function () {
    clearInterval(intervalId);
    intervalId = null;
  });

  document.querySelector('#reset').addEventListener('click', function () {
    clearInterval(intervalId);
    intervalId = null;
    millisekund = 0;
    laplar = [];
    laplarEl.innerHTML = '';
    render();
  });

  document.querySelector('#lap').addEventListener('click', function () {
    laplar.push(vaqtFormat(millisekund));
    var html = '';
    for (var i = 0; i < laplar.length; i++) {
      html += '<div>Lap ' + (i + 1) + ': ' + laplar[i] + '</div>';
    }
    laplarEl.innerHTML = html;
  });

  render();
</script>
\`\`\`

### Uchta yangi narsa

**1. \`setInterval\`** — kodni takror-takror bajaradi:

\`\`\`javascript
setInterval(function () {
  millisekund += 10;
}, 10);      // har 10 millisekundda
\`\`\`

**2. \`clearInterval\`** — to'xtatadi. Busiz sekundomer **hech qachon to'xtamaydi**.

\`\`\`javascript
clearInterval(intervalId);
\`\`\`

**3. \`padStart(2, '0')\`** — raqamni ikki xonali qiladi: \`5\` → \`"05"\`. Busiz vaqt \`1:5:3\` ko'rinishida chiqadi.

> ⚠️ \`if (intervalId) return;\` qatoriga e'tibor bering. Busiz "Boshlash" ni ikki marta bossangiz **ikkita** interval ishga tushadi va vaqt ikki barobar tez ketadi. Bu — juda ko'p uchraydigan xato.

---

## 💾 localStorage — sahifa yangilansa ham saqlanadi

\`\`\`javascript
// Saqlash
localStorage.setItem('counter', son);

// O'qish (har doim matn qaytaradi!)
let son = Number(localStorage.getItem('counter') || 0);
\`\`\`

Hisoblagichga qo'shsangiz, sahifani yangilaganda son **yo'qolmaydi**.

\`\`\`javascript
let son = Number(localStorage.getItem('counter') || 0);

function render() {
  sonEl.textContent = son;
  localStorage.setItem('counter', son);   // har o'zgarishda saqlash
}
\`\`\`

Ikkita nozik nuqta:

- \`localStorage\` **faqat matn** saqlaydi. Shuning uchun o'qiganda \`Number()\` bilan songa aylantiriladi
- \`|| 0\` — birinchi marta ochilganda \`null\` qaytadi, o'shanda \`0\` ishlatiladi

> ⚠️ Yuqoridagi demolarda \`localStorage\` **ishlatilmagan**. Sabab: bu demolar himoyalangan oynachada ishlaydi va u yerda \`localStorage\` bloklanadi. Buni **o'z kompyuteringizda**, haqiqiy faylda sinab ko'ring.

---

## 🥉 Bronze Topshiriq

Hisoblagich yasang: \`+\`, \`−\` va \`Reset\` tugmalari ishlasin.

---

## 🥈 Silver Topshiriq

- Son musbat bo'lsa yashil, manfiy bo'lsa qizil, nol bo'lsa kulrang
- Klaviatura ↑ va ↓ tugmalari ham ishlasin
- \`localStorage\` bilan saqlansin — sahifani yangilaganda son qolsin

---

## 🥇 Gold Topshiriq

Sekundomer yasang:

- Boshlash, To'xtatish, Reset
- Vaqt \`00:00:00\` ko'rinishida (\`padStart\` bilan)
- "Boshlash" ni ikki marta bosganda tezlashib ketmasin
- **Lap** tugmasi — oraliq vaqtlarni ro'yxatga qo'shsin

---

## ✅ Dars Xulosa

- \`let\` — o'zgaradigan, \`const\` — o'zgarmaydigan qiymat
- Naqsh: **ma'lumot o'zgaradi → \`render()\` chaqiriladi**
- \`son++\`, \`son--\`, \`son += 5\` — qisqartmalar
- \`setInterval\` / \`clearInterval\` — takroriy amal va uni to'xtatish
- \`padStart(2, '0')\` — \`5\` ni \`"05"\` qiladi
- \`localStorage\` — faqat matn saqlaydi, \`Number()\` bilan qaytariladi

> 🚀 **Keyingi dars:** Demo Day — 3 oylik ishingizni ko'rsatasiz!
`,
    teacher: `
## 💡 O'qituvchi uchun

- **"Ma'lumot → render"** naqshi — bu darsning eng qimmatli qismi, hisoblagichdan ham muhimroq. Uni doskaga chizing va har loyihada takrorlang. React'ga o'tganda bola shu naqshni tanib oladi.
- \`render()\` ni chaqirishni unutish — eng ko'p uchraydigan xato. Ataylab qilib ko'rsating: tugmani bosing, konsolda son o'zgarganini ko'rsating, lekin ekranda o'zgarmaganini ham. Bola farqni tushunsin.
- Sekundomerda \`if (intervalId) return;\` qatorini **olib tashlab** ko'rsating. "Boshlash" ni 3 marta bosing — vaqt uch barobar tez ketadi. Bu — kulgili va esda qoladigan namoyish.
- \`let\` va \`const\` farqini ortiqcha chuqurlashtirmang. Oddiy qoida: "o'zgaradimi — \`let\`, yo'qmi — \`const\`". Batafsil 4-oyda.

## ⚠️ Demolardagi texnik cheklov

Kabinetdagi jonli demolar **himoyalangan oynachada** (sandboxed iframe) ishlaydi. U yerda:

- ✅ JavaScript ishlaydi, DOM o'zgaradi, \`setInterval\` ishlaydi
- ❌ \`localStorage\` **bloklanadi** — xavfsizlik sababli
- ❌ \`alert()\` ko'rinmaydi

Shuning uchun demolarda \`localStorage\` ishlatilmadi, u alohida kod bloki sifatida berildi va darsda bu izohlab o'tildi.

Bolalar \`localStorage\` ni **o'z kompyuterlarida** sinashi kerak. Buni darsda ta'kidlang, aks holda ular "demoda yo'q ekan" deb o'tkazib yuboradi.

## ⚠️ Ko'p uchraydigan xatolar

- **Ekranda son o'zgarmayapti** — \`render()\` chaqirilmagan.
- **Sahifa ochilganda bo'sh** — oxirida \`render()\` yozilmagan.
- **Sekundomer tezlashib ketdi** — \`if (intervalId) return;\` yo'q.
- **Sekundomer to'xtamayapti** — \`clearInterval\` da noto'g'ri o'zgaruvchi berilgan.
- **\`localStorage\` dan kelgan son qo'shilmayapti, yopishib qolyapti** — \`"5" + 1 = "51"\`. \`Number()\` unutilgan. Bu — juda chalkash xato, bolalar uzoq qidiradi.
- **Vaqt \`1:5:3\` ko'rinishida** — \`padStart\` yo'q.
- **\`son\` \`render()\` ichida e'lon qilingan** — har chaqiruvda nolga qaytadi.

## 📊 Daraja belgilash

- **Bronze** — uch tugma ishlaydi, son o'zgaradi
- **Silver** — ranglar, klaviatura, localStorage ishlaydi
- **Gold** — sekundomer to'liq, lap ro'yxati, ikki marta bosish muammosi hal qilingan

> Silver'ni tekshirish: sahifani yangilang. Son saqlanib qolsa — bajarilgan. Agar \`"51"\` kabi g'alati qiymat chiqsa — \`Number()\` yo'q.
`,
  },

  // ═══════════════════════════════════════════════════════════
  'junior.m1.l36': {
    goal: "Uch oylik ishni namoyish qilish: portfolio taqdimoti va Junior Badge marosimi.",
    student: `
## 🏆 Bugun nima bo'ladi?

Uch oy oldin siz HTML nima ekanini bilmasdingiz. Bugun sizda **internetda ishlaydigan sayt** bor.

Bugun uni ko'rsatasiz.

Bu — imtihon emas. Bu — **nishonlash** kuni.

---

## 📚 Uch oyda nimalarni o'rgandingiz

**1-oy — Poydevor**

HTML5 semantik tuzilmasi · CSS selektorlar va specificity · Google Fonts va tipografiya · Box Model · Flexbox · Hover effektlar · Birinchi portfolio

**2-oy — Professional CSS**

CSS Grid · Position (sticky, absolute, fixed) · Media Queries va responsive · CSS o'zgaruvchilar va qorong'i rejim · \`@keyframes\` animatsiyalar · Pseudo-elementlar · Formalar · Gradient va filtrlar · Scroll animatsiyalari · SEO va Lighthouse · Git va GitHub

**3-oy — Birinchi JavaScript**

DOM bilan ishlash · Hodisalar (events) · O'zgaruvchilar · Interaktiv loyihalar

Jami **36 ta dars**. Bu — kam emas.

---

## 🎤 Taqdimotingiz — 5 daqiqa

### 1. Saytni oching (1 daqiqa)

GitHub Pages havolangizni oching. Telefonda ham ko'rsating.

### 2. Ko'rsating (2 daqiqa)

- **Responsive** — oynani kichraytiring yoki telefonda oching
- **Qorong'i rejim** — almashtiring
- **Animatsiyalar** — scroll qiling
- **Lighthouse** — ballaringiz

### 3. Aytib bering (2 daqiqa)

Shu uch savolga javob tayyorlang:

- **"Eng ko'p vaqt qaysi qismga ketdi?"**
- **"Eng qiyin narsa nima edi va uni qanday yechdingiz?"**
- **"Vaqt bo'lsa yana nima qo'shgan bo'lardingiz?"**

> 💡 Ikkinchi savol eng muhimi. "Hech qiyinchilik bo'lmadi" — yaxshi javob emas. Qiyinchilikni aytish va uni qanday yengganingizni tushuntirish — bu professional ko'nikma. Ish intervyusida ham aynan shuni so'rashadi.

---

## ✅ Taqdimotdan oldin

- Sayt havolasi ishlaydimi? **Boshqa kompyuterda** ochib ko'ring
- Telefonda ochib ko'rdingizmi?
- Lighthouse skrinshoti tayyormi?
- GitHub repo public'mi?
- Uch savolga javobingiz tayyormi?

---

## 🤝 Sinfdoshlaringizni tinglash

Har taqdimotdan keyin **kamida bitta** yaxshi narsa aytishga harakat qiling. Masalan:

- "Ranglar tanlash yaxshi chiqibdi"
- "Mobilda juda toza ko'rinyapti"
- "Animatsiya ortiqcha emas, o'lchovli"

Bu — shunchaki xushmuomalalik emas. Boshqaning ishida nima yaxshi ekanini **ko'ra bilish** — o'z ishingizni yaxshilashga yordam beradi.

---

## 🚀 4-oyda nima bo'ladi

JavaScript'ni jiddiy o'rganishni boshlaysiz:

- O'zgaruvchilar, shartlar, tsikllar
- Funksiyalar
- Massivlar va obyektlar
- **O'yinlar**: "Sonni top", kalkulyator, va boshqalar

3-oyda JavaScript bilan faqat tanishdingiz. 4-oyda unda **o'ylashni** o'rganasiz.

> 🏆 **Tabriklaymiz!** Uch oy oldin bo'sh sahifadan boshlagan edingiz. Bugun sizda haqiqiy, internetda ishlaydigan portfolio bor. Bu — kichik yutuq emas.
`,
    teacher: `
## ⏰ Jadval (90 daqiqa)

| Vaqt | Faoliyat |
| --- | --- |
| 0:00 – 0:10 | Uch oyning qisqacha retrospektivi |
| 0:10 – 0:55 | Taqdimotlar (har o'quvchiga 5 daqiqa) |
| 0:55 – 1:10 | Umumiy fikrlar, eng ko'p uchragan muammolar tahlili |
| 1:10 – 1:25 | Junior Badge marosimi 🏅 |
| 1:25 – 1:30 | 4-oy anonsi: JavaScript va o'yinlar |

> 12 tadan ko'p o'quvchi bo'lsa, taqdimot vaqtini 4 daqiqaga qisqartiring yoki ikki sessiyaga bo'ling. Shoshilib o'tkazishdan ko'ra ikkiga bo'lish yaxshi.

---

## 📝 Baholash formasi

\`\`\`text
O'quvchi: _______________________  Sana: ___________

HTML Tuzilmasi:        [ 1 ] [ 2 ] [ 3 ] [ 4 ] [ 5 ]
CSS Professional:      [ 1 ] [ 2 ] [ 3 ] [ 4 ] [ 5 ]
Responsive Dizayn:     [ 1 ] [ 2 ] [ 3 ] [ 4 ] [ 5 ]
Interaktivlik (JS):    [ 1 ] [ 2 ] [ 3 ] [ 4 ] [ 5 ]
Deploy va GitHub:      [ 1 ] [ 2 ] [ 3 ] [ 4 ] [ 5 ]

Jami: ___ / 25

GitHub Pages URL: _________________________________
Lighthouse:  Perf ___   A11y ___   SEO ___

Topshiriq darajasi:  [ ] 🥉 Bronze  [ ] 🥈 Silver  [ ] 🥇 Gold

Ijobiy tomoni: ____________________________________
Yaxshilash uchun: _________________________________
\`\`\`

## 🏅 Badge tizimi

| Ball | Badge | Nima oladi |
| --- | --- | --- |
| 20 – 25 | 🥇 Junior Frontend Badge | Sertifikat + 4-oyga kirish |
| 15 – 19 | 🥈 Qoniqarli | Sertifikat + 4-oyga kirish |
| < 15 | 🥉 Qayta topshirish | 1 hafta ichida yaxshilash |

---

## 💡 O'qituvchi uchun

- **Taqdimotdan qo'rqish** — bu yoshda normal. Muhitni xavfsiz qiling: "xato bo'lsa ham mayli", "sayt ochilmasa ham gaplashamiz".
- Har taqdimotdan keyin **kamida ikkita ijobiy fikr** bildiring, keyin bitta yaxshilash taklifi. Bu tartib muhim — ijobiydan boshlansin.
- **"Eng qiyin narsa nima edi?"** savoliga e'tibor bering. Bola aniq javob bersa — u haqiqatan ishlagan. "Hammasi oson edi" — odatda ko'chirib olganini bildiradi.
- Sinfdoshlar fikr bildirishini talab qiling, lekin **tanqid emas, faqat ijobiy**. Bu yoshda o'zaro tanqid ruhni tushiradi.
- Eng yaxshi 3 ta ishni alohida nishonlang, lekin **turli nominatsiyalarda**: "Eng ijodiy dizayn", "Eng toza kod", "Eng ko'p mehnat". Shunda g'olib bitta emas, uchta bo'ladi.

## ⚠️ Oldindan tayyorlang

- **Proyektorni sinab ko'ring.** Sayt ochilmasa, taqdimot buziladi.
- Internet sekin bo'lsa, saytlarni oldindan ochib qo'ying.
- Bolalarga **bir hafta oldin** eslating: sayt deploy qilingan bo'lsin, havola ishlasin.
- Sertifikat yoki badge'larni **oldindan chop eting**. Marosim qog'ozsiz bo'lsa, ta'sir yo'qoladi.

## 🗒 Notion'dagi tuzatilgan xato

Asl sahifadagi "3-oy" xulosasida **IntersectionObserver** yozilgan edi. Lekin 25-dars \`animation-timeline: view()\` — CSS scroll animatsiyalari asosida qayta yozilgan, chunki IntersectionObserver JavaScript API va u 34-darsdan oldin kelmasligi kerak.

Bu yerda "Scroll animatsiyalari" deb umumiy yozildi.

---

## 🎓 1-Modul yakunlandi

Bu — 36 darslik yo'lning oxiri. O'quvchilar endi:

- Semantik HTML yoza oladi
- CSS'ni professional darajada ishlata oladi (Grid, Flexbox, animatsiyalar, responsive)
- Saytni internetga chiqara oladi
- Git bilan ishlaydi
- JavaScript bilan tanish

4-oydan **2-Modul** boshlanadi: JavaScript va algoritmik fikrlash.
`,
  },

  // ═══════════════════════════════════════════════════════════
  'junior.m1.l26': {
    goal: "Pure CSS bilan gorizontal slider, karusel va snap effektlarini yaratish.",
    student: `
## 🎠 Scroll Snap nima?

Oddiy gorizontal scroll'da foydalanuvchi ixtiyoriy joyda to'xtaydi — natijada yarim rasm ko'rinib qoladi. Scroll Snap buni to'g'irlaydi: scroll **belgilangan nuqtalarga yopishadi**.

\`\`\`demo h=340 "Snap bor va yo'q — yonma-yon"
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: sans-serif; font-size: 12px; padding: 12px; }

  .lbl { font-family: monospace; color: #4b5563; margin: 0 0 6px; }

  .slider {
    display: flex;
    overflow-x: auto;
    gap: 10px;
    padding-bottom: 8px;
    margin-bottom: 18px;
  }

  .snap { scroll-snap-type: x mandatory; }
  .snap .slide { scroll-snap-align: center; }

  .slide {
    flex: 0 0 70%;
    height: 100px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    color: white; font-weight: 700; font-size: 18px;
  }

  .s1 { background: #6366f1; }
  .s2 { background: #8b5cf6; }
  .s3 { background: #a855f7; }
  .s4 { background: #d946ef; }
</style>

<p class="lbl">SNAP YO'Q — ixtiyoriy joyda to'xtaydi</p>
<div class="slider">
  <div class="slide s1">1</div>
  <div class="slide s2">2</div>
  <div class="slide s3">3</div>
  <div class="slide s4">4</div>
</div>

<p class="lbl">scroll-snap-type: x mandatory — markazga yopishadi</p>
<div class="slider snap">
  <div class="slide s1">1</div>
  <div class="slide s2">2</div>
  <div class="slide s3">3</div>
  <div class="slide s4">4</div>
</div>
\`\`\`

Ikkalasini ham o'ngga sudrab ko'ring. Birinchisi qayerda qo'yib yuborsangiz o'sha yerda qoladi. Ikkinchisi **eng yaqin slaydga tortiladi**.

---

## 🔧 Ikki qator, ikki joyda

Scroll Snap ikkita xususiyatdan iborat va ular **turli elementlarga** yoziladi:

\`\`\`css
/* 1. KONTEYNERGA — qaysi yo'nalishda snap bo'lsin */
.slider {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
}

/* 2. HAR BIR BOLAGA — qayeriga yopishsin */
.slide {
  flex: 0 0 100%;
  scroll-snap-align: start;   /* start | center | end */
}
\`\`\`

> ⚠️ Eng ko'p uchraydigan xato: \`scroll-snap-align\` ni konteynerga yozish. U **bolalarga** yoziladi.

| Qiymat | Ma'nosi |
| --- | --- |
| \`x mandatory\` | Gorizontal, **majburiy** yopishadi |
| \`x proximity\` | Gorizontal, faqat yaqin bo'lsa yopishadi |
| \`y mandatory\` | Vertikal (butun ekranli bo'limlar uchun) |

---

## 📸 Foto galereya slideri

\`\`\`demo h=360 "To'liq kenglikdagi slayder"
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: sans-serif; margin: 0; }

  .galereya {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;

    /* Scrollbar yashirish */
    scrollbar-width: none;              /* Firefox */
    -ms-overflow-style: none;           /* eski Edge */
  }
  .galereya::-webkit-scrollbar { display: none; }  /* Chrome, Safari */

  .slide {
    flex: 0 0 100%;
    scroll-snap-align: start;
    position: relative;
  }

  .slide img {
    width: 100%;
    height: 260px;
    object-fit: cover;
    display: block;
  }

  .caption {
    position: absolute;
    left: 0; right: 0; bottom: 0;
    padding: 30px 16px 14px;
    background: linear-gradient(transparent, rgba(0,0,0,0.75));
    color: white;
    font-size: 13px;
    font-weight: 600;
  }

  .hint { padding: 10px 16px; color: #6b7280; font-size: 12px; }
</style>

<div class="galereya">
  <div class="slide">
    <img src="https://picsum.photos/id/10/800/500" alt="" />
    <div class="caption">1 — O'rmon</div>
  </div>
  <div class="slide">
    <img src="https://picsum.photos/id/20/800/500" alt="" />
    <div class="caption">2 — Ish stoli</div>
  </div>
  <div class="slide">
    <img src="https://picsum.photos/id/30/800/500" alt="" />
    <div class="caption">3 — Qahva</div>
  </div>
  <div class="slide">
    <img src="https://picsum.photos/id/40/800/500" alt="" />
    <div class="caption">4 — Tabiat</div>
  </div>
</div>

<p class="hint">👉 Chapga-o'ngga sudrang</p>
\`\`\`

Scrollbar'ni yashirish uchun uchta qator kerak, chunki har brauzer o'zicha yozadi. Uchalasini ham yozing.

---

## 🔘 Navigatsiya — havolalar bilan

Slaydga o'tish tugmalarini **JavaScript'siz** qilish mumkin: oddiy anchor havolalar orqali.

\`\`\`demo h=380 "Nuqtalarni bosing — slayd almashadi"
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: sans-serif; margin: 0; }

  .wrapper { position: relative; }

  .galereya {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;          /* havola bosilganda silliq siljiydi */
    scrollbar-width: none;
  }
  .galereya::-webkit-scrollbar { display: none; }

  .slide {
    flex: 0 0 100%;
    scroll-snap-align: start;
  }
  .slide img {
    width: 100%; height: 250px;
    object-fit: cover; display: block;
  }

  .nav {
    display: flex; gap: 10px; justify-content: center;
    padding: 14px;
  }

  .nav a {
    width: 34px; height: 34px;
    border-radius: 50%;
    background: #e5e7eb;
    color: #374151;
    display: flex; align-items: center; justify-content: center;
    text-decoration: none;
    font-size: 13px; font-weight: 700;
    transition: background 0.2s, color 0.2s, transform 0.2s;
  }
  .nav a:hover {
    background: #6366f1; color: white; transform: scale(1.1);
  }

  .hint { text-align: center; color: #6b7280; font-size: 12px; padding-bottom: 10px; }
</style>

<div class="wrapper">
  <div class="galereya">
    <div class="slide" id="s1"><img src="https://picsum.photos/id/10/800/500" alt="" /></div>
    <div class="slide" id="s2"><img src="https://picsum.photos/id/20/800/500" alt="" /></div>
    <div class="slide" id="s3"><img src="https://picsum.photos/id/30/800/500" alt="" /></div>
    <div class="slide" id="s4"><img src="https://picsum.photos/id/40/800/500" alt="" /></div>
  </div>

  <div class="nav">
    <a href="#s1">1</a>
    <a href="#s2">2</a>
    <a href="#s3">3</a>
    <a href="#s4">4</a>
  </div>
</div>

<p class="hint">Raqamlarni bosing yoki rasmni sudrang</p>
\`\`\`

Sir \`scroll-behavior: smooth\` da: havola bosilganda brauzer o'sha \`id\` ga silliq siljiydi, snap esa uni joyiga tortadi.

> 💡 **Cheklov:** hozirgi slayd qaysi ekanini nuqtada belgilash (aktiv holat) CSS bilan qilib bo'lmaydi — buning uchun JavaScript kerak. Uni 5-oyda qo'shasiz.

---

## 📜 Vertikal snap — to'liq ekranli bo'limlar

\`\`\`demo h=360 "y mandatory — bo'limlar ekranga yopishadi"
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { height: 100%; font-family: sans-serif; }

  body {
    overflow-y: auto;
    scroll-snap-type: y mandatory;
    scroll-behavior: smooth;
  }

  section {
    height: 100vh;
    scroll-snap-align: start;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    color: white; text-align: center;
  }

  section h2 { font-size: 26px; margin-bottom: 6px; }
  section p { opacity: 0.85; font-size: 13px; }

  .a { background: linear-gradient(135deg, #6366f1, #8b5cf6); }
  .b { background: linear-gradient(135deg, #0ea5e9, #06b6d4); }
  .c { background: linear-gradient(135deg, #10b981, #22c55e); }
</style>

<section class="a"><h2>Birinchi bo'lim</h2><p>⬇️ Pastga scroll qiling</p></section>
<section class="b"><h2>Ikkinchi bo'lim</h2><p>Ekranga yopishdi</p></section>
<section class="c"><h2>Uchinchi bo'lim</h2><p>Sekin scroll qilsangiz ham to'liq siljiydi</p></section>
\`\`\`

Bu usul **landing page** larda ko'p ishlatiladi: har bo'lim butun ekranni egallaydi va scroll ularni birma-bir ko'rsatadi.

> ⚠️ Ehtiyot bo'ling: majburiy vertikal snap uzun matnli sahifada foydalanuvchini asabiylashtiradi. Uni faqat **qisqa, to'liq ekranli** bo'limlarda ishlating.

---

## 🥉 Bronze Topshiriq

Gorizontal slayder yarating: 4 ta rasm, \`scroll-snap-type: x mandatory\` va \`scroll-snap-align: center\`.

---

## 🥈 Silver Topshiriq

- Slaydlar to'liq kenglikda (\`flex: 0 0 100%\`)
- Scrollbar yashirilgan (uchala qator bilan)
- Rasm ustida gradient bilan izoh matni
- \`object-fit: cover\` ishlatilgan

---

## 🥇 Gold Topshiriq

- Anchor havolalar bilan navigatsiya nuqtalari
- \`scroll-behavior: smooth\`
- Portfolio saytingizga qo'shilgan (loyihalar yoki sertifikatlar galereyasi)
- Mobilda barmoq bilan sudrash tekis ishlaydi

---

## ✅ Dars Xulosa

- \`scroll-snap-type: x mandatory\` — **konteynerga**
- \`scroll-snap-align: start | center\` — **bolalarga**
- \`scroll-behavior: smooth\` — havola bosilganda silliq siljish
- Scrollbar yashirish uchun uch xil qator kerak
- \`y mandatory\` — to'liq ekranli bo'limlar uchun
- Aktiv nuqtani belgilash CSS bilan bo'lmaydi — JavaScript kerak

> 🚀 **Keyingi dars:** CSS Clamp va Fluid Typography!
`,
    teacher: `
## 💡 O'qituvchi uchun

- Birinchi demo (snap bor/yo'q) — darsning eng tez tushuntiruvchi qismi. Ikkalasini sinfda sudrab ko'rsating, so'z kerak emas.
- Ikki xususiyat **turli elementlarga** yozilishini ta'kidlang. Bu — bu darsdagi asosiy chalkashlik manbai. Doskaga chizib qo'ying: konteyner → \`scroll-snap-type\`, bola → \`scroll-snap-align\`.
- Anchor havolalar bilan navigatsiya — bolalar buni "hiyla" deb qabul qiladi va yoqtiradi. 13-darsdagi \`:target\` bilan bir xil g'oya: manzil qatori orqali boshqarish.
- Vertikal snap qiziq, lekin undan **suiiste'mol qilmaslikni** o'rgating. Uzun matnli sahifada u foydalanuvchini asabiylashtiradi.

## ⚠️ Notion'dagi dastur bilan nomuvofiqlik

Asl sahifada slayder tugmalari va nuqtalari **JavaScript** bilan qilingan (\`scrollTo\`, \`addEventListener\`, dinamik dot yaratish). JavaScript 34-darsdan boshlanadi.

Bu yerda navigatsiya **anchor havolalar** bilan qayta yozildi — \`scroll-behavior: smooth\` bilan birga u deyarli bir xil ishlaydi.

**Bitta narsa CSS bilan chiqmaydi:** aktiv nuqtani belgilash (hozir qaysi slayd ochiq). Bu darsda ochiq aytilgan va 5-oyga qoldirilgan. Bolaga "buni CSS qila olmaydi" deb rostini aytish — yaxshi dars, chunki har bir vositaning chegarasi borligini ko'rsatadi.

## ⚠️ Ko'p uchraydigan xatolar

- **Snap ishlamayapti** — \`overflow-x: auto\` yo'q. Snap faqat scroll qilinadigan konteynerda ishlaydi.
- **Snap ishlamayapti (2)** — \`scroll-snap-align\` konteynerga yozilgan, bolalarga emas.
- **Slaydlar siqilib ketgan** — \`flex: 0 0 100%\` o'rniga \`width: 100%\` yozilgan. Flex konteynerda \`flex-shrink\` ni to'xtatish kerak, aks holda hammasi bitta ekranga siqiladi.
- **Scrollbar hamon ko'rinadi** — faqat bitta qator yozilgan. Uchalasi kerak: \`scrollbar-width\`, \`-ms-overflow-style\`, \`::-webkit-scrollbar\`.
- **Vertikal snap sahifani "qamab" qo'ygan** — \`html, body { height: 100% }\` berilmagan yoki bo'limlar \`100vh\` dan baland.
- **Anchor havola sakrab o'tyapti** — \`scroll-behavior: smooth\` yozilmagan.

## 📊 Daraja belgilash

- **Bronze** — snap ishlaydi, slaydlar joyiga yopishadi
- **Silver** — to'liq kenglik, scrollbar yashirin, izoh matni bor
- **Gold** — anchor navigatsiya ishlaydi, portfolioga qo'shilgan, mobilda tekis

> Tekshirishning eng ishonchli usuli — telefonda barmoq bilan sudrash. Sichqoncha bilan sezilmaydigan muammolar o'sha yerda chiqadi.
`,
  },
};
