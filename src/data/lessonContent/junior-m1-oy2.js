// Junior kursi — 1-Modul, 2-oy (13–24-darslar)
//
// Qoida junior-m1.js dagidek: student va teacher ALOHIDA maydonlarda.
// Ajratish shu yerda, yozish paytida qilinadi.

export const JUNIOR_M1_OY2_CONTENT = {
  // ═══════════════════════════════════════════════════════════
  'junior.m1.l13': {
    goal: "static, relative, absolute, fixed, sticky — elementlarni aniq joylashtirish.",
    student: `
## 📌 Position — beshta turi

Har birini o'z ko'zingiz bilan ko'ring. Qizil quti — bu bizning elementimiz:

\`\`\`demo h=380 "static / relative / absolute"
<style>
  body { font-size: 13px; }
  .demo {
    position: relative;          /* absolute uchun tayanch */
    background: #f3f4f6;
    border: 2px dashed #d1d5db;
    border-radius: 8px;
    height: 90px;
    margin-bottom: 14px;
    padding: 8px;
  }
  .lbl { font-family: monospace; font-size: 12px; color: #4b5563; margin: 0 0 4px; }
  .item { background: #93c5fd; padding: 6px 10px; border-radius: 5px;
          display: inline-block; margin-right: 6px; }
  .target { background: #f87171; color: white; }

  .s .target { position: static; }
  .r .target { position: relative; top: 24px; left: 30px; }
  .a .target { position: absolute; top: 8px; right: 8px; }
</style>

<p class="lbl">position: static — normal joyida, top/left ISHLAMAYDI</p>
<div class="demo s">
  <span class="item">1</span><span class="item target">MEN</span><span class="item">3</span>
</div>

<p class="lbl">position: relative; top: 24px; left: 30px — siljidi, LEKIN bo'sh joyi saqlandi</p>
<div class="demo r">
  <span class="item">1</span><span class="item target">MEN</span><span class="item">3</span>
</div>

<p class="lbl">position: absolute; top: 8px; right: 8px — oqimdan CHIQDI, joyi yo'qoldi</p>
<div class="demo a">
  <span class="item">1</span><span class="item target">MEN</span><span class="item">3</span>
</div>
\`\`\`

Ikkinchi va uchinchi qatorga diqqat qiling:

- **relative** — element siljidi, lekin **eski joyi bo'sh qoldi**. 3-raqam joyidan qimirlamadi.
- **absolute** — element oqimdan butunlay chiqdi, 3-raqam uning o'rnini egalladi.

---

## 🔗 absolute kimga nisbatan joylashadi?

Bu — 13-darsning eng muhim savoli. Javob: **eng yaqin \`position: static\` bo'lmagan ota elementga**.

\`\`\`demo h=340 "Ota elementda relative bor va yo'q"
<style>
  body { font-size: 13px; }
  .lbl { font-family: monospace; font-size: 12px; color: #4b5563; margin: 0 0 4px; }

  .outer {
    background: #fef3c7; border: 2px solid #f59e0b;
    height: 110px; margin-bottom: 16px; padding: 8px; border-radius: 8px;
  }
  .inner {
    background: #dbeafe; border: 2px solid #3b82f6;
    height: 70px; margin-left: 40px; padding: 8px; border-radius: 8px;
  }
  .box { position: absolute; top: 4px; right: 4px;
         background: #ef4444; color: white; padding: 4px 8px;
         border-radius: 4px; font-size: 11px; }

  .with-rel .inner { position: relative; }   /* tayanch — ko'k quti */
  /* .no-rel .inner da position yo'q → tayanch topilmaydi */
</style>

<p class="lbl">Ko'k qutida position: relative BOR → qizil quti ko'k qutining burchagida</p>
<div class="outer with-rel">
  Sariq (outer)
  <div class="inner">
    Ko'k (inner) — relative
    <span class="box">absolute</span>
  </div>
</div>

<p class="lbl">Ko'k qutida position YO'Q → qizil quti yuqoriroqqa chiqib ketdi</p>
<div class="outer no-rel">
  Sariq (outer)
  <div class="inner">
    Ko'k (inner) — position yo'q
    <span class="box">absolute</span>
  </div>
</div>
\`\`\`

> ⚠️ **Eng ko'p uchraydigan xato:** \`absolute\` ishlatasiz, lekin element kutilmagan joyga uchib ketadi. Sabab — ota elementga \`position: relative\` yozilmagan. Bu ikkisi **doim juft yuradi**.

---

## 📎 fixed va sticky

\`\`\`demo h=300 "sticky — scroll qiling"
<style>
  body { margin: 0; font-size: 13px; }
  .scroll-area { height: 260px; overflow-y: auto; background: #f9fafb; }
  .sticky-bar {
    position: sticky;
    top: 0;
    background: #1a1a2e; color: white;
    padding: 10px 14px; font-weight: 600;
    z-index: 10;
  }
  .content { padding: 12px 14px; }
  .content p { margin: 0 0 14px; }
</style>

<div class="scroll-area">
  <div class="content">
    <p>Pastga scroll qiling — quyidagi qora chiziq tepaga yopishib qoladi.</p>
  </div>
  <div class="sticky-bar">Men sticky — top: 0</div>
  <div class="content">
    <p>1. Matn...</p><p>2. Matn...</p><p>3. Matn...</p>
    <p>4. Matn...</p><p>5. Matn...</p><p>6. Matn...</p>
    <p>7. Matn...</p><p>8. Matn...</p>
  </div>
</div>
\`\`\`

- **fixed** — viewport'ga yopishadi, scroll qilsangiz ham qimirlamaydi. Navbar uchun.
- **sticky** — avval normal turadi, belgilangan joyga yetganda yopishib qoladi.

> ⚠️ \`sticky\` ishlashi uchun \`top\`, \`bottom\`, \`left\` yoki \`right\` dan **kamida bittasi** yozilishi shart. \`position: sticky\` ni yolg'iz yozsangiz — hech narsa bo'lmaydi. Bu juda ko'p uchraydigan tuzoq.

---

## 🔲 z-index — qatlam tartibi

\`\`\`demo h=280 "Kim oldinda turadi?"
<style>
  .stage { position: relative; height: 170px; background: #f9fafb;
           border-radius: 8px; border: 1px solid #e5e7eb; }
  .card {
    position: absolute; width: 110px; height: 90px;
    border-radius: 10px; color: white; padding: 10px;
    font-size: 12px; font-weight: 600;
  }
  .c1 { background: #3b82f6; top: 20px; left: 20px;  z-index: 1; }
  .c2 { background: #ef4444; top: 45px; left: 75px;  z-index: 3; }
  .c3 { background: #10b981; top: 70px; left: 130px; z-index: 2; }
  .lbl { font-family: monospace; font-size: 12px; color: #4b5563; margin: 0 0 6px; }
</style>

<p class="lbl">z-index raqamlarini o'zgartirib ko'ring</p>
<div class="stage">
  <div class="card c1">z-index: 1</div>
  <div class="card c2">z-index: 3</div>
  <div class="card c3">z-index: 2</div>
</div>
\`\`\`

> 💡 \`z-index\` **faqat positioned elementlarda** ishlaydi. \`position: static\` bo'lsa (ya'ni default), z-index yozsangiz ham hech narsa o'zgarmaydi.

Amaliy qiymatlar: navbar \`z-index: 100\`, modal fon \`900\`, modalning o'zi \`901\`. Katta oraliq qoldiring — keyin orasiga qo'shish oson bo'ladi.

---

## 🎯 Amaliy misol: bildirishnoma belgisi

\`\`\`demo h=220 "Badge — absolute ning klassik ishlatilishi"
<style>
  body { display: flex; gap: 24px; align-items: center; }

  .avatar-wrapper {
    position: relative;          /* TAYANCH */
    display: inline-block;
  }
  .avatar { width: 60px; height: 60px; border-radius: 50%; display: block; }

  .badge {
    position: absolute;
    top: -4px; right: -4px;
    width: 22px; height: 22px;
    background: #e74c3c; color: white;
    border-radius: 50%;
    font-size: 11px; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    border: 2px solid white;
  }
</style>

<div class="avatar-wrapper">
  <img class="avatar" src="https://picsum.photos/id/64/60/60" alt="Avatar" />
  <span class="badge">3</span>
</div>

<div class="avatar-wrapper">
  <img class="avatar" src="https://picsum.photos/id/91/60/60" alt="Avatar" />
  <span class="badge">12</span>
</div>
\`\`\`

Manfiy qiymatlar (\`top: -4px\`) elementni chegaradan tashqariga chiqaradi — badge shu tarzda avatarning burchagiga "osiladi".

---

## 🥉 Bronze Topshiriq

Kartochka yarating, o'ng yuqori burchagida narx belgisi tursin.

\`\`\`demo h=240 "Bronze — natija"
<style>
  .karta {
    position: relative;
    padding: 20px; border: 1px solid #e5e7eb;
    border-radius: 12px; width: 260px;
    font-family: sans-serif;
  }
  .narx {
    position: absolute;
    top: 12px; right: 12px;
    background: #3498db; color: white;
    padding: 4px 12px; border-radius: 20px;
    font-size: 13px; font-weight: 600;
  }
  h3 { margin: 0 0 6px; font-size: 16px; }
  p { margin: 0; color: #6b7280; font-size: 13px; }
</style>

<div class="karta">
  <span class="narx">150 000</span>
  <h3>Mahsulot nomi</h3>
  <p>Qisqacha tavsif shu yerda bo'ladi.</p>
</div>
\`\`\`

---

## 🥈 Silver Topshiriq

Sticky navigatsiya yarating: sahifani scroll qilganda menyu tepada qolsin.

Kerak: \`position: sticky\`, \`top: 0\`, \`z-index\`, va \`body { margin: 0 }\`.

---

## 🥇 Gold Topshiriq — modal oyna

Tugma bosilganda ochiladigan modal. **JavaScript'siz**, faqat CSS bilan:

\`\`\`demo h=340 "Gold — CSS-only modal (:target bilan)"
<style>
  body { font-family: sans-serif; font-size: 14px; }

  .open-btn {
    display: inline-block; padding: 12px 24px;
    background: #3498db; color: white; border-radius: 8px;
    text-decoration: none; font-weight: 600;
  }

  .overlay {
    position: fixed;
    inset: 0;                       /* top/right/bottom/left: 0 */
    background: rgba(0,0,0,0.6);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 900;
  }

  /* :target — manzilda #modal bo'lsa ochiladi */
  .overlay:target { display: flex; }

  .modal {
    position: relative;
    background: white; border-radius: 16px;
    padding: 28px; width: 88%; max-width: 340px;
    z-index: 901;
  }

  .modal h2 { margin: 0 0 8px; font-size: 18px; }
  .modal p { margin: 0; color: #6b7280; font-size: 13px; }

  .close-btn {
    position: absolute;
    top: 10px; right: 14px;
    font-size: 20px; color: #9ca3af;
    text-decoration: none; line-height: 1;
  }
  .close-btn:hover { color: #111827; }
</style>

<a href="#modal" class="open-btn">Modal ochish</a>

<div class="overlay" id="modal">
  <div class="modal">
    <a href="#" class="close-btn">&times;</a>
    <h2>Modal sarlavha</h2>
    <p>Bu modal faqat CSS bilan ishlaydi — <code>:target</code> psevdo-klassi orqali.</p>
  </div>
</div>
\`\`\`

Sir: \`:target\` — brauzer manzilida \`#modal\` bo'lsa ishga tushadi. Ochish tugmasi \`href="#modal"\`, yopish tugmasi \`href="#"\`.

---

## ✅ Dars Xulosa

| Position | Oqim | Nisbatan |
| --- | --- | --- |
| \`static\` | Normal | — (top/left ishlamaydi) |
| \`relative\` | Normal | O'z joyi, bo'sh joy saqlanadi |
| \`absolute\` | Chiqadi | Eng yaqin positioned ota |
| \`fixed\` | Chiqadi | Viewport |
| \`sticky\` | Aralash | Scroll pozitsiyasi |

- \`absolute\` bilan \`relative\` — **doim juft** yuradi
- \`sticky\` uchun \`top\` majburiy
- \`z-index\` faqat positioned elementlarda ishlaydi

> 🚀 **Keyingi dars:** CSS Grid — ikki o'lchamli joylashuv!
`,
    teacher: `
## 💡 O'qituvchi uchun

- \`absolute\` va \`relative\` juftligi — bu darsning **butun mazmuni**. Qolgan hamma narsa shundan kelib chiqadi. Yuqoridagi ikkinchi demoni sinfda birga o'zgartiring: \`relative\` ni qo'shing-o'chiring, qizil quti qayerga uchishini kuzating.
- "Nisbatan" so'zini har safar takrorlang: "absolute **kimga nisbatan**?" Bola bu savolga avtomatik javob beradigan bo'lsa — tushungan.
- \`sticky\` ni ko'rsatishda \`top\` ni ataylab yozmang. Ishlamaydi. Keyin qo'shing. Bu 10 soniyalik namoyish bir yillik xatolardan qutqaradi.
- \`z-index\` da 1, 2, 3 emas — 10, 100, 900 kabi katta oraliq berishni o'rgating. Sabab: keyin orasiga element qo'shish kerak bo'ladi.

## ⚠️ Notion'dagi dastur bilan nomuvofiqlik

Asl Notion sahifasida Gold topshiriq **JavaScript** bilan berilgan (\`addEventListener\`). Lekin JavaScript bu dasturda **34-darsdan** boshlanadi — ya'ni 21 dars keyin.

Shuning uchun bu yerda Gold \`:target\` psevdo-klassi bilan, **CSS-only** qilib qayta yozildi. O'quvchi hali ko'rmagan texnologiyani ishlatishga majbur bo'lmaydi.

Agar guruhingiz kuchli bo'lsa va JS variantini ko'rsatmoqchi bo'lsangiz — mayli, lekin uni **bonus** sifatida bering, baholash mezoniga kiritmang.

## ⚠️ Ko'p uchraydigan xatolar

- **Absolute element sahifaning burchagiga uchib ketgan** — ota elementda \`position: relative\` yo'q. Birinchi tekshiriladigan narsa.
- **Sticky ishlamayapti** — \`top\` yozilmagan. Ikkinchi tekshiriladigan narsa.
- **Sticky ishlamayapti (2)** — ota elementda \`overflow: hidden\` bor. Bu sticky'ni butunlay o'ldiradi va topish qiyin.
- **z-index ishlamayapti** — element \`static\`. Uchinchi tekshiriladigan narsa.
- **Fixed navbar kontentni yopib qolgan** — \`body\` yoki \`main\` ga yuqoridan \`padding\` berilmagan.

## 📊 Daraja belgilash

- **Bronze** — absolute to'g'ri ishlatilgan, ota elementda relative bor
- **Silver** — sticky ishlaydi, z-index to'g'ri, kontent yopilib qolmagan
- **Gold** — modal ochiladi va yopiladi, overlay to'g'ri, qatlam tartibi to'g'ri

> Bronze'ni tekshirishda so'rang: "\`.karta\` dan \`position: relative\` ni o'chirsak nima bo'ladi?"
`,
  },

  // ═══════════════════════════════════════════════════════════
  'junior.m1.l15': {
    goal: "Telefon, planshet va kompyuterda chiroyli ko'rinadigan sayt yaratish.",
    student: `
## 📱 Nima uchun responsive?

Dunyoda internet foydalanuvchilarining **60% dan ko'pi telefonda**. Faqat kompyuter uchun yozilgan sayt telefonda buziladi: matn mayda, gorizontal scroll paydo bo'ladi, tugmalarga barmoq tegmaydi.

Responsive Design — **bitta kod, barcha qurilma**.

---

## 🔑 Viewport meta tegi

\`\`\`html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
\`\`\`

Buni siz 1-darsdan beri yozib kelyapsiz. Endi nima uchun kerakligi ma'lum bo'ladi: bu qator bo'lmasa, telefon sahifani 980px kenglikda "o'ylab", keyin uni kichraytirib ko'rsatadi. Natijada hamma narsa mayda bo'ladi va media query'laringiz ishlamaydi.

> ⚠️ Responsive ishlamayotgan saytlarning ko'pchiligida sabab — shu bitta qator unutilgan.

---

## 📐 Media Queries — jonli sinash

Quyidagi demoda **"Ekran kengligi"** tugmalari bor. Bosing va breakpoint qanday ishga tushishini kuzating:

\`\`\`demo responsive h=260 "Media query — 768px chegarasi"
<style>
  body { font-family: sans-serif; margin: 0; padding: 16px; }

  /* MOBIL uchun asosiy stil (mobile-first) */
  .panel {
    background: #fecaca;
    border: 3px solid #ef4444;
    border-radius: 12px;
    padding: 20px;
    text-align: center;
  }
  .panel h2 { margin: 0 0 6px; font-size: 18px; color: #7f1d1d; }
  .panel p { margin: 0; font-size: 13px; color: #991b1b; }

  /* 768px va undan KENG bo'lsa */
  @media (min-width: 768px) {
    .panel {
      background: #bbf7d0;
      border-color: #16a34a;
    }
    .panel h2 { color: #14532d; }
    .panel p { color: #166534; }
  }
</style>

<div class="panel">
  <h2>Men rangimni o'zgartiraman</h2>
  <p>Qizil = 768px dan tor · Yashil = 768px va undan keng</p>
</div>
\`\`\`

375px va 768px tugmalarini navbatma-navbat bosing. Rang o'zgaradi — chunki media query ishga tushdi.

---

## 📲 Mobile-first yondashuv

Ikki xil yozish mumkin, lekin **biri to'g'riroq**:

\`\`\`css
/* ✅ MOBILE-FIRST — avval mobil, keyin kattalashtiramiz */
.container {
  padding: 16px;
  flex-direction: column;
}

@media (min-width: 768px) {
  .container {
    padding: 24px;
    flex-direction: row;
  }
}

/* ❌ DESKTOP-FIRST — avval katta, keyin kichraytiramiz */
.container {
  padding: 24px;
  flex-direction: row;
}

@media (max-width: 767px) {
  .container {
    padding: 16px;
    flex-direction: column;
  }
}
\`\`\`

Nega mobile-first afzal? Ikki sabab:

1. Telefon — eng ko'p ishlatiladigan qurilma. Asosiy kod unga mo'ljallangani mantiqiy.
2. Telefonlar odatda sekinroq. Mobile-first'da telefon **kamroq CSS** qayta ishlaydi.

**Standart breakpoint'lar:**

| Nom | Kenglik | Qurilma |
| --- | --- | --- |
| sm | 640px | Katta telefon |
| md | 768px | Planshet |
| lg | 1024px | Laptop |
| xl | 1280px | Desktop |

---

## 📸 Responsive kartochkalar

\`\`\`demo responsive h=340 "1 ustun → 2 ustun → 3 ustun"
<style>
  body { font-family: sans-serif; margin: 0; padding: 14px; }

  .kartalar {
    display: grid;
    gap: 12px;
    grid-template-columns: 1fr;          /* MOBIL: 1 ustun */
  }

  @media (min-width: 640px) {
    .kartalar { grid-template-columns: repeat(2, 1fr); }   /* 2 ustun */
  }

  @media (min-width: 1000px) {
    .kartalar { grid-template-columns: repeat(3, 1fr); }   /* 3 ustun */
  }

  .karta {
    background: #eff6ff; border: 1px solid #bfdbfe;
    border-radius: 10px; padding: 16px; font-size: 13px;
  }
  .karta b { display: block; margin-bottom: 4px; color: #1e40af; }
</style>

<div class="kartalar">
  <div class="karta"><b>Kartochka 1</b>Matn</div>
  <div class="karta"><b>Kartochka 2</b>Matn</div>
  <div class="karta"><b>Kartochka 3</b>Matn</div>
  <div class="karta"><b>Kartochka 4</b>Matn</div>
  <div class="karta"><b>Kartochka 5</b>Matn</div>
  <div class="karta"><b>Kartochka 6</b>Matn</div>
</div>
\`\`\`

### Yoki media query'siz — Grid bilan

\`\`\`demo responsive h=300 "auto-fill — media query YO'Q"
<style>
  body { font-family: sans-serif; margin: 0; padding: 14px; }

  .kartalar {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 12px;
  }

  .karta {
    background: #ecfdf5; border: 1px solid #a7f3d0;
    border-radius: 10px; padding: 16px; font-size: 13px;
  }
  .karta b { display: block; margin-bottom: 4px; color: #065f46; }
</style>

<div class="kartalar">
  <div class="karta"><b>1</b>Matn</div>
  <div class="karta"><b>2</b>Matn</div>
  <div class="karta"><b>3</b>Matn</div>
  <div class="karta"><b>4</b>Matn</div>
  <div class="karta"><b>5</b>Matn</div>
  <div class="karta"><b>6</b>Matn</div>
</div>
\`\`\`

Yuqoridagi ikkala demo bir xil natija beradi. Lekin ikkinchisida **birorta media query yo'q** — atigi bitta qator. 14-darsda ko'rgan \`auto-fill\` shu.

> 💡 Kartochkalar uchun \`auto-fill\` yetadi. Media query esa butun sahifa tuzilmasi o'zgarganda kerak — masalan yon panel yo'qolganda.

---

## 🔤 Responsive matn — clamp()

\`\`\`demo responsive h=220 "clamp() — media query'siz moslashadi"
<style>
  body { font-family: sans-serif; margin: 0; padding: 16px; }

  h1 {
    /* clamp(minimum, moslashuvchi, maksimum) */
    font-size: clamp(22px, 5vw, 46px);
    margin: 0 0 8px;
    line-height: 1.1;
  }
  p { font-size: clamp(12px, 2vw, 16px); color: #6b7280; margin: 0; }
</style>

<h1>Bu sarlavha ekranga moslashadi</h1>
<p>Kenglik tugmalarini bosib ko'ring — shrift o'zi o'zgaradi</p>
\`\`\`

\`clamp(22px, 5vw, 46px)\` — *"22px dan kichik bo'lmasin, 46px dan katta bo'lmasin, oralig'ida ekran kengligining 5% i bo'lsin."*

---

## 🍔 Hamburger menyu

Mobilda menyu yashiriladi, tugma paydo bo'ladi:

\`\`\`demo responsive h=300 "Hamburger — CSS-only (checkbox usuli)"
<style>
  body { font-family: sans-serif; margin: 0; }

  .navbar {
    display: flex; justify-content: space-between; align-items: center;
    padding: 0 16px; height: 56px; background: #1a1a2e;
  }
  .logo { color: white; font-weight: 700; letter-spacing: 1px; }

  .menu-toggle { display: none; }          /* checkbox yashirin */
  .hamburger {
    color: white; font-size: 22px; cursor: pointer;
    user-select: none; display: block;
  }

  .nav-links {
    display: none;                          /* MOBILDA yashirin */
    list-style: none; margin: 0;
    background: #24243e; padding: 12px 16px;
  }
  .nav-links li { padding: 8px 0; }
  .nav-links a { color: #cbd5e1; text-decoration: none; font-size: 14px; }

  /* Checkbox belgilansa — menyu ochiladi */
  .menu-toggle:checked ~ .nav-links { display: block; }

  /* DESKTOPDA: menyu doim ko'rinadi, hamburger yashirinadi */
  @media (min-width: 768px) {
    .hamburger { display: none; }
    .nav-links {
      display: flex; gap: 28px; background: #1a1a2e;
      padding: 0 16px 14px;
    }
    .nav-links li { padding: 0; }
  }
</style>

<input type="checkbox" id="menu" class="menu-toggle" />

<nav class="navbar">
  <span class="logo">BRAND</span>
  <label for="menu" class="hamburger">☰</label>
</nav>

<ul class="nav-links">
  <li><a href="#">Bosh sahifa</a></li>
  <li><a href="#">Haqimda</a></li>
  <li><a href="#">Loyihalar</a></li>
</ul>
\`\`\`

**375px** da: hamburger ko'rinadi, uni bosing — menyu ochiladi.
**768px** da: hamburger yo'qoladi, menyu gorizontal bo'lib qoladi.

> 💡 Bu variant JavaScript'siz ishlaydi — yashirin checkbox va \`<label>\` orqali. JavaScript'ni 34-darsdan boshlaganingizda, uni \`classList.toggle()\` bilan qayta yozasiz.

---

## 🥉 Bronze Topshiriq

Kartochkalar ro'yxati yarating: mobilda 1 ustun, 768px dan keng ekranda 2 ustun.

---

## 🥈 Silver Topshiriq

Portfolio saytingizni oching va uni responsive qiling:

- Hero bo'limi mobilda **ustun**, desktopda **qator**
- Ko'nikmalar kartochkalari mobilda 1 ustun
- Shriftlar \`clamp()\` bilan
- Gorizontal scroll **umuman bo'lmasin**

---

## 🥇 Gold Topshiriq

Hamburger menyu qo'shing. Mobilda yashirin, tugma bosilganda ochilsin. 768px dan keng ekranda hamburger yo'qolsin, menyu gorizontal bo'lsin.

---

## 🧪 Qanday tekshirish kerak

1. **F12** → yuqoridagi telefon belgisini bosing (Device Toolbar)
2. Yuqoridagi ro'yxatdan qurilma tanlang: iPhone SE, iPad
3. Yoki oynani sichqoncha bilan sudrab kichraytiring

Tekshiring: gorizontal scroll paydo bo'lyaptimi? Matn o'qilyaptimi? Tugmalarga barmoq tegadimi (kamida 44×44px)?

---

## ✅ Dars Xulosa

- \`<meta name="viewport">\` — busiz hech narsa ishlamaydi
- **Mobile-first**: asosiy stil mobil uchun, \`min-width\` bilan kattalashtirasiz
- \`@media (min-width: 768px) { }\` — media query
- \`auto-fill + minmax()\` — kartochkalar uchun media query'siz yechim
- \`clamp()\` — shriftlar uchun media query'siz yechim
- Hamburger menyu — mobil navigatsiya standarti

> 🚀 **Keyingi dars:** CSS Pseudo-elements — ::before va ::after!
`,
    teacher: `
## 💡 O'qituvchi uchun

- **DevTools Device Toolbar** ni birinchi 5 daqiqada ko'rsating (F12 → Ctrl+Shift+M). Busiz bolalar responsive'ni tekshira olmaydi va "menda ishlamayapti" deb keladi.
- Viewport tegini ataylab o'chirib ko'rsating. Telefon rejimida sahifa qanday mayda bo'lib qolishini ko'rgan bola uni boshqa unutmaydi.
- Mobile-first va desktop-first farqini **majburlab** o'rgating. Bolalar tabiiy ravishda desktop-first yozadi (chunki kompyuterda ishlaydi). \`max-width\` ishlatgan bo'lsa — qaytartiring.
- Bu darsda \`auto-fill\` ni qayta eslatish muhim. Ko'p bolalar 3 ta media query yozadi, holbuki bitta qator yetardi.

## ⚠️ Notion'dagi dastur bilan nomuvofiqlik

Asl Notion sahifasida hamburger menyu **JavaScript** bilan berilgan (\`classList.toggle\`). JavaScript esa **34-darsdan** boshlanadi.

Bu yerda checkbox + \`<label>\` usuli bilan **CSS-only** qilib qayta yozildi. Ishlashi bir xil. JavaScript o'tilgandan keyin (5-oy, DOM darslari) shu topshiriqni JS bilan qayta yozdirsangiz — juda yaxshi taqqoslash bo'ladi.

## ⚠️ Ko'p uchraydigan xatolar

- **Gorizontal scroll paydo bo'lgan** — biror elementda qat'iy \`width\` bor (masalan \`width: 500px\`). \`max-width: 100%\` bilan tuzatiladi. Bu eng ko'p uchraydigan muammo.
- **Rasm ekrandan chiqib ketgan** — \`img { max-width: 100%; height: auto; }\` reset'ga qo'shilmagan.
- **Media query ishlamayapti** — viewport tegi yo'q yoki media query CSS faylining boshida yozilgan (u **keyin** kelishi kerak, cascade qoidasi bo'yicha).
- **\`@media (min-width: 768px)\` va \`@media (max-width: 768px)\` birga** — 768px da ikkalasi ham ishlaydi, chalkashlik chiqadi. \`max-width: 767px\` yozish kerak.
- **Tugmalar juda kichik** — mobilda kamida 44×44px bo'lishi kerak (Apple va Google tavsiyasi). Buni eslatib turing.

## 📊 Daraja belgilash

- **Bronze** — media query ishlaydi, ustunlar soni o'zgaradi
- **Silver** — butun portfolio responsive, gorizontal scroll yo'q, clamp ishlatilgan
- **Gold** — hamburger menyu ishlaydi, ikkala rejimda ham to'g'ri

> Tekshirishning eng tez usuli: telefonda oching. Haqiqiy qurilmada ko'rish DevTools'dan ishonchliroq.
`,
  },

  // ═══════════════════════════════════════════════════════════
  'junior.m1.l16': {
    goal: "HTML qo'shmasdan CSS bilan dekorativ elementlar yaratish.",
    student: `
## ✨ ::before va ::after nima?

Bular — CSS yaratadigan **yashirin elementlar**. HTML'da ular yo'q, lekin sahifada ko'rinadi.

\`\`\`text
<div class="element">
   [::before]   kontent   [::after]
</div>
\`\`\`

\`\`\`css
.element::before {
  content: '';     /* ← MAJBURIY, hatto bo'sh bo'lsa ham */
  /* qolgan stillar */
}
\`\`\`

> ⚠️ \`content\` yozilmasa — element **umuman paydo bo'lmaydi**. Bu qoidani unutish — bu darsdagi eng ko'p uchraydigan xato. Element ko'rinmasa, birinchi navbatda \`content\` ni tekshiring.

---

## 🎨 Eng oddiy misol

\`\`\`demo h=240 "content bilan matn qo'shish"
<style>
  body { font-family: sans-serif; font-size: 15px; }
  p { margin: 12px 0; }

  .price::after   { content: ' so\\'m'; color: #6b7280; }
  .required::after { content: ' *'; color: #ef4444; font-weight: 700; }
  .external::after { content: ' ↗'; color: #3b82f6; }
  .quote::before  { content: '❝ '; color: #8b5cf6; font-size: 22px; }
</style>

<p class="price">150 000</p>
<p class="required">Email manzil</p>
<p><a href="#" class="external">Tashqi havola</a></p>
<p class="quote">Iqtibos boshlanishi</p>
\`\`\`

HTML'ga qarang — u yerda "so'm", "*", "↗" yo'q. Hammasi CSS'da.

---

## 📏 Sarlavha tagidagi chiziq

\`\`\`demo h=240 "h2::after bilan bezak chiziq"
<style>
  body { font-family: sans-serif; }

  h2 {
    position: relative;         /* absolute uchun tayanch */
    display: inline-block;
    padding-bottom: 12px;
    font-size: 22px;
    margin: 0 0 20px;
  }

  h2::after {
    content: '';                /* bo'sh, lekin MAJBURIY */
    position: absolute;
    left: 0;
    bottom: 0;
    width: 60px;
    height: 3px;
    background: #3498db;
    border-radius: 2px;
  }
</style>

<h2>Bizning xizmatlar</h2>
<p style="color:#6b7280;font-size:14px">
  Chiziq HTML'da yo'q — u ::after bilan yasalgan.
  Kenglikni 60px dan 100% ga o'zgartirib ko'ring.
</p>
\`\`\`

Bu — \`::after\` ning eng ko'p uchraydigan ishlatilishi. Har bir sarlavhaga qo'lda \`<div>\` qo'shish o'rniga, bitta CSS qoidasi hammasini hal qiladi.

---

## 💬 Iqtibos bezagi

\`\`\`demo h=260 "blockquote::before"
<style>
  body { font-family: Georgia, serif; }

  blockquote {
    position: relative;
    padding: 20px 20px 20px 56px;
    background: #f8f9fa;
    border-radius: 12px;
    font-style: italic;
    color: #374151;
    margin: 0;
    font-size: 15px;
  }

  blockquote::before {
    content: '❝';
    position: absolute;
    left: 14px;
    top: 8px;
    font-size: 44px;
    color: #3498db;
    line-height: 1;
  }
</style>

<blockquote>
  Kod yozishni o'rganish — fikrlashni o'rganish demakdir.
  Chunki kompyuter siz aytgan narsani emas, siz yozgan narsani bajaradi.
</blockquote>
\`\`\`

---

## 🏷️ Badge / yorliq

\`\`\`demo h=260 "::before bilan YANGI yorlig'i"
<style>
  body { font-family: sans-serif; display: flex; gap: 16px; padding-top: 14px; }

  .karta {
    position: relative;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 18px;
    width: 150px;
    font-size: 13px;
  }
  .karta h3 { margin: 0 0 4px; font-size: 15px; }
  .karta p { margin: 0; color: #6b7280; }

  .yangi::before {
    content: 'YANGI';
    position: absolute;
    top: -9px;
    right: -9px;
    background: #e74c3c;
    color: white;
    font-size: 9px;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 20px;
    letter-spacing: 1px;
  }
</style>

<div class="karta yangi">
  <h3>Mahsulot A</h3>
  <p>Yorliq bilan</p>
</div>

<div class="karta">
  <h3>Mahsulot B</h3>
  <p>Yorliqsiz</p>
</div>
\`\`\`

Ikkala kartochkaning HTML'i deyarli bir xil — farq faqat \`class="yangi"\` da. Yorliqni qo'shish yoki olib tashlash uchun HTML'ga tegish shart emas.

---

## 🎯 Hover animatsiyalari

\`\`\`demo h=280 "::after bilan uch xil hover"
<style>
  body { font-family: sans-serif; display: flex; flex-direction: column;
         gap: 22px; align-items: flex-start; padding: 10px; }

  /* 1. Chapdan o'ngga chiziq */
  .l1 { position: relative; text-decoration: none; color: #374151;
        padding-bottom: 4px; font-size: 15px; }
  .l1::after {
    content: ''; position: absolute; left: 0; bottom: 0;
    width: 0; height: 2px; background: #3498db;
    transition: width 0.3s ease;
  }
  .l1:hover::after { width: 100%; }

  /* 2. O'rtadan ikki tomonga */
  .l2 { position: relative; text-decoration: none; color: #374151;
        padding-bottom: 4px; font-size: 15px; }
  .l2::after {
    content: ''; position: absolute; left: 50%; bottom: 0;
    width: 0; height: 2px; background: #8b5cf6;
    transition: width 0.3s ease, left 0.3s ease;
  }
  .l2:hover::after { width: 100%; left: 0; }

  /* 3. Fon to'ladi */
  .l3 { position: relative; text-decoration: none; color: #374151;
        padding: 6px 10px; font-size: 15px; z-index: 1; }
  .l3::before {
    content: ''; position: absolute; inset: 0;
    background: #fbbf24; border-radius: 6px;
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.3s ease;
    z-index: -1;
  }
  .l3:hover::before { transform: scaleX(1); }
</style>

<a href="#" class="l1">1. Chapdan o'ngga chiziq</a>
<a href="#" class="l2">2. O'rtadan ikki tomonga</a>
<a href="#" class="l3">3. Fon to'ladi</a>
\`\`\`

Uchinchisida yangi hiyla bor: \`z-index: -1\` bilan \`::before\` matn **orqasiga** o'tkaziladi, \`transform-origin: left\` esa kengayish qayerdan boshlanishini belgilaydi.

---

## 🌗 Rasm ustidagi overlay

\`\`\`demo h=300 "::before bilan gradient overlay"
<style>
  body { font-family: sans-serif; display: flex; gap: 14px; }

  .karta {
    position: relative;
    overflow: hidden;
    border-radius: 12px;
    width: 170px;
  }
  .karta img { width: 100%; display: block; }

  .karta::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.75));
    opacity: 0;
    transition: opacity 0.3s;
  }
  .karta:hover::before { opacity: 1; }

  .karta::after {
    content: 'Ko\\'rish →';
    position: absolute;
    left: 14px; bottom: 12px;
    color: white; font-size: 13px; font-weight: 600;
    opacity: 0;
    transform: translateY(8px);
    transition: opacity 0.3s, transform 0.3s;
  }
  .karta:hover::after { opacity: 1; transform: translateY(0); }
</style>

<div class="karta"><img src="https://picsum.photos/id/1015/340/240" alt="Manzara" /></div>
<div class="karta"><img src="https://picsum.photos/id/1018/340/240" alt="Tog'" /></div>
\`\`\`

Bitta elementda **ikkalasi ham** ishlatilgan: \`::before\` — qorong'i gradient, \`::after\` — matn. HTML'da esa faqat \`<img>\` bor.

---

## 🥉 Bronze Topshiriq

Barcha \`h2\` sarlavhalar tagiga \`::after\` bilan ko'k chiziq qo'shing.

Kerak bo'ladi: \`position: relative\` (sarlavhaga), \`content: ''\`, \`position: absolute\`, \`width\`, \`height\`, \`background\`.

---

## 🥈 Silver Topshiriq

Navigatsiya havolalariga hover chizig'ini qo'shing — \`width: 0\` dan \`100%\` ga \`transition\` bilan.

---

## 🥇 Gold Topshiriq

Uchtasini birga qo'llang:

1. Sarlavha tagidagi bezak chiziq
2. Loyiha kartochkasiga "YANGI" yorlig'i
3. Rasm ustida hover'da chiqadigan overlay

Hammasi **HTML'ga birorta yangi element qo'shmasdan**.

---

## ✅ Dars Xulosa

- \`::before\` va \`::after\` — HTML'siz CSS elementlari
- \`content: ''\` — **majburiy**, hatto bo'sh bo'lsa ham
- Odatda \`position: absolute\` bilan birga ishlatiladi (otasida \`relative\` kerak)
- Badge, chiziq, overlay, ikonka, hover animatsiyalari uchun ideal
- Bitta elementda ikkalasini ham ishlatish mumkin

> 🚀 **Keyingi dars:** CSS Variables va Custom Properties!
`,
    teacher: `
## 💡 O'qituvchi uchun

- \`content: ''\` qoidasini **birinchi daqiqada** aytmang. Aksincha: birga kod yozing, uni ataylab tushirib qoldiring, hech narsa chiqmasligini ko'rsating, keyin qo'shing. "Nega ishlamadi?" degan savoldan keyin javob yaxshi yodda qoladi.
- \`::before\` va \`::after\` nomlari chalkashtiriladi. Oddiy qoida bering: **before — kontentdan oldin, after — kontentdan keyin**. Doskaga \`[before] KONTENT [after]\` deb yozib qo'ying.
- Bu dars 10 va 13-darslarni birlashtiradi: \`position: absolute\` (13) + \`transition\` (10). Agar bolalar o'sha ikkitasini yaxshi bilmasa — bu dars qiyin bo'ladi. Kerak bo'lsa 10 daqiqa takrorlang.
- Uchinchi hover demosidagi \`z-index: -1\` hiylasi — kuchli guruhlar uchun. Zaif guruhda uni o'tkazib yuboring.

## ⚠️ Ko'p uchraydigan xatolar

- **Element ko'rinmayapti** — \`content\` yo'q. 90% hollarda sabab shu.
- **Element noto'g'ri joyda** — otasida \`position: relative\` yo'q (13-darsdagi bir xil xato).
- **\`::before\` bitta ikki nuqta bilan yozilgan** (\`:before\`) — eski sintaksis, ishlaydi lekin o'rgatmang.
- **\`img::after\` ishlamayapti** — bu **xato emas, qoida**. \`img\`, \`input\`, \`br\` kabi "bo'sh" teglarda pseudo-element bo'lmaydi, chunki ularning ichki kontenti yo'q. Yechim: rasmni \`div\` ga o'rash. Bu bolalarni ko'p chalkashtiradi — oldindan aytib qo'ying.
- **Transition ishlamayapti** — \`::after\` da \`transition\` hover ichida yozilgan.

## 📊 Daraja belgilash

- **Bronze** — chiziq ko'rinadi, content bor, position to'g'ri
- **Silver** — hover animatsiyasi silliq ishlaydi
- **Gold** — uch effekt birga, HTML'ga yangi element qo'shilmagan

> Gold'ni tekshirishda HTML'ni ko'ring: agar bola \`<div class="chiziq">\` yozgan bo'lsa — topshiriq bajarilmagan, chunki butun maqsad shundan qochish edi.
`,
  },

  // ═══════════════════════════════════════════════════════════
  'junior.m1.l17': {
    goal: ":root da o'zgaruvchilar e'lon qilib, butun sayt bo'ylab bir joydan boshqarish.",
    student: `
## 🎨 CSS Variables nima?

Bir xil rangni CSS'da 20 joyda yozgan bo'lsangiz va uni o'zgartirish kerak bo'lsa — 20 joyni qidirib topasiz. Bittasini unutsangiz — sayt bir joyda buzuq qoladi.

CSS o'zgaruvchilar shu muammoni hal qiladi:

\`\`\`css
/* E'lon qilish — ikki chiziqcha bilan */
:root {
  --asosiy-rang: #3498db;
  --matn-rangi: #1a1a2e;
  --radius: 12px;
  --soya: 0 4px 16px rgba(0,0,0,0.1);
}

/* Ishlatish — var() funksiyasi bilan */
.tugma {
  background-color: var(--asosiy-rang);
  border-radius: var(--radius);
  box-shadow: var(--soya);
}
\`\`\`

\`:root\` — bu butun hujjat (aslida \`<html>\` tegi). U yerda e'lon qilingan o'zgaruvchi **hamma joyda** ishlaydi.

---

## 🧪 Bitta qiymat — butun sahifa

\`\`\`demo h=360 "--primary ni o'zgartiring va nima bo'lishini ko'ring"
<style>
  :root {
    --primary: #3498db;        /* ← FAQAT SHUNI o'zgartiring */
    --radius: 12px;
    --space: 16px;
  }

  body { font-family: sans-serif; padding: var(--space); font-size: 14px; }

  .btn {
    background: var(--primary);
    color: white; border: none;
    border-radius: var(--radius);
    padding: 10px 20px; cursor: pointer; font-size: 14px;
  }

  .card {
    border: 2px solid var(--primary);
    border-radius: var(--radius);
    padding: var(--space);
    margin-top: var(--space);
  }

  .card h3 { color: var(--primary); margin: 0 0 6px; }

  .badge {
    display: inline-block;
    background: var(--primary);
    color: white; padding: 3px 12px;
    border-radius: 999px; font-size: 12px;
  }

  .bar {
    height: 8px; background: var(--primary);
    border-radius: 999px; margin-top: var(--space);
  }
</style>

<button class="btn">Tugma</button>
<span class="badge">Yorliq</span>

<div class="card">
  <h3>Kartochka sarlavhasi</h3>
  <p style="margin:0;color:#6b7280">Bu yerda beshta element bor va hammasi bitta o'zgaruvchidan rang oladi.</p>
</div>

<div class="bar"></div>
\`\`\`

> 💡 **Sinab ko'ring:** "O'zgartirib ko'rish" tugmasini bosing va \`--primary\` ni \`#e74c3c\` yoki \`#16a34a\` ga almashtiring. Bitta qator — beshta element o'zgaradi.

---

## 🔁 Zaxira qiymat

\`\`\`css
color: var(--rang, #333);
\`\`\`

Agar \`--rang\` e'lon qilinmagan bo'lsa — \`#333\` ishlatiladi. Bu xatolardan himoya qiladi.

---

## 🧩 Komponent darajasidagi o'zgaruvchilar

Bu — CSS o'zgaruvchilarning eng kuchli tomoni. O'zgaruvchini **element ichida** qayta belgilash mumkin:

\`\`\`demo h=300 "Bitta .btn klassi — to'rt xil ko'rinish"
<style>
  :root {
    --btn-bg: #3498db;
    --btn-text: white;
    --btn-radius: 8px;
  }

  body { font-family: sans-serif; display: flex; gap: 10px; flex-wrap: wrap; }

  /* Asosiy stil — bitta marta yoziladi */
  .btn {
    background: var(--btn-bg);
    color: var(--btn-text);
    border-radius: var(--btn-radius);
    padding: 10px 20px;
    border: 2px solid transparent;
    cursor: pointer;
    font-size: 14px;
    transition: filter 0.2s;
  }
  .btn:hover { filter: brightness(0.9); }

  /* Variantlar — FAQAT o'zgaruvchi qayta belgilanadi */
  .btn-danger  { --btn-bg: #e74c3c; }
  .btn-success { --btn-bg: #27ae60; }
  .btn-outline {
    --btn-bg: transparent;
    --btn-text: #3498db;
    border-color: #3498db;
  }
</style>

<button class="btn">Asosiy</button>
<button class="btn btn-danger">Xavfli</button>
<button class="btn btn-success">Muvaffaqiyat</button>
<button class="btn btn-outline">Chiziqli</button>
\`\`\`

Diqqat qiling: \`.btn-danger\` da **atigi bitta qator** bor. \`padding\`, \`border-radius\`, \`transition\` — hammasi \`.btn\` dan meros qoladi. Klassik CSS'da har variant uchun hammasini qayta yozish kerak bo'lardi.

---

## 🌙 Qorong'i rejim (dark mode)

CSS o'zgaruvchilarning eng mashhur ishlatilishi. Sir oddiy: **o'zgaruvchilar to'plamini almashtirish**.

\`\`\`demo h=380 "Dark mode — tugmani bosing"
<style>
  :root {
    --bg: #ffffff;
    --bg-card: #f8f9fa;
    --text: #1a1a2e;
    --text-muted: #6b7280;
    --border: #e9ecef;
    --primary: #3498db;
  }

  /* Checkbox belgilansa — o'zgaruvchilar to'plami almashadi */
  #theme:checked ~ .page {
    --bg: #0f0f1a;
    --bg-card: #1a1a2e;
    --text: #f0f0f0;
    --text-muted: #9ca3af;
    --border: #333344;
  }

  #theme { display: none; }

  .page {
    background: var(--bg);
    color: var(--text);
    padding: 18px;
    min-height: 300px;
    font-family: sans-serif;
    transition: background 0.3s, color 0.3s;
  }

  .toggle {
    display: inline-block; cursor: pointer;
    background: var(--primary); color: white;
    padding: 8px 16px; border-radius: 8px;
    font-size: 13px; font-weight: 600;
    margin-bottom: 14px;
  }

  .card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 10px;
    transition: background 0.3s, border-color 0.3s;
  }
  .card h3 { margin: 0 0 4px; font-size: 15px; }
  .card p { margin: 0; color: var(--text-muted); font-size: 13px; }
</style>

<input type="checkbox" id="theme" />

<div class="page">
  <label for="theme" class="toggle">🌙 Rejimni almashtirish</label>

  <div class="card">
    <h3>Birinchi kartochka</h3>
    <p>Fon, matn va chegara ranglari o'zgaruvchilardan olinadi.</p>
  </div>

  <div class="card">
    <h3>Ikkinchi kartochka</h3>
    <p>Shuning uchun ikkalasi ham bir vaqtda o'zgaradi.</p>
  </div>
</div>
\`\`\`

CSS'ga qarang: qorong'i rejim uchun **birorta yangi \`.card\` qoidasi yozilmagan**. Faqat o'zgaruvchilar qiymati almashtirilgan, xolos.

> 💡 Haqiqiy loyihada bu \`[data-theme="dark"]\` atributi va JavaScript bilan qilinadi. Tanlovni \`localStorage\` ga saqlab, keyingi safar tiklanadi. Buni 5-oyda (LocalStorage darsi) o'rganasiz.

---

## 🎯 To'liq dizayn sistemasi

Professional loyihalarda o'zgaruvchilar guruhlanadi:

\`\`\`css
:root {
  /* Ranglar */
  --color-primary: #6366f1;
  --color-primary-dark: #4f46e5;
  --color-success: #22c55e;
  --color-danger: #ef4444;
  --color-warning: #f59e0b;

  /* Matn o'lchamlari */
  --text-sm: 14px;
  --text-base: 16px;
  --text-lg: 18px;
  --text-2xl: 24px;
  --text-3xl: 30px;

  /* Masofa — 4px ga karrali */
  --space-1: 4px;
  --space-2: 8px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;

  /* Radius */
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-full: 9999px;
}
\`\`\`

Masofa uchun 4px ga karrali qiymatlar — sanoat standarti. Shunda butun saytda bir xil ritm bo'ladi va "bu joyda 13px, u yerda 15px" degan tartibsizlik chiqmaydi.

---

## 🥉 Bronze Topshiriq

Portfolio saytingizni oching. Barcha takrorlanadigan ranglarni \`:root\` ga chiqaring va \`var()\` bilan almashtiring.

Kamida: asosiy rang, matn rangi, fon rangi, chegara rangi.

---

## 🥈 Silver Topshiriq

Ranglardan tashqari **o'lchamlarni** ham o'zgaruvchiga chiqaring: \`--radius\`, \`--space\`, shrift o'lchamlari.

Keyin \`--radius\` ni bir marta o'zgartiring va butun sayt burchaklari bir vaqtda o'zgarganini ko'ring.

---

## 🥇 Gold Topshiriq

Qorong'i rejim qo'shing. Yuqoridagi demodagi checkbox usulidan foydalaning yoki o'z yechimingizni toping.

Talab: **birorta ham qattiq yozilgan rang qolmasin**. Butun sayt faqat \`var()\` orqali ishlasin.

---

## ✅ Dars Xulosa

- \`--nom: qiymat\` — e'lon (ko'pincha \`:root\` da)
- \`var(--nom)\` — ishlatish
- \`var(--nom, zaxira)\` — zaxira qiymat
- O'zgaruvchini element ichida qayta belgilash mumkin — variantlar shunday yaratiladi
- Qorong'i rejim = o'zgaruvchilar to'plamini almashtirish
- Masofalar 4px ga karrali bo'lsin

> 🚀 **Keyingi dars:** CSS Animatsiyalar — @keyframes batafsil!
`,
    teacher: `
## 💡 O'qituvchi uchun

- Bu darsning qiymati **darhol ko'rinmaydi**. Kichik sahifada o'zgaruvchi ortiqcha ish bo'lib tuyuladi. Shuning uchun demonstratsiya muhim: bolaning **o'z portfoliosini** oching va asosiy rangni bir joyda o'zgartiring. 10 joyda o'zgarganini ko'rgan bola tushunadi.
- Nomlash haqida qoida bering: \`--ko-k-rang\` emas, \`--primary\`. Sabab — keyin rang o'zgarsa, nom yolg'on bo'lib qoladi. **Vazifasi** bo'yicha nomlansin, ko'rinishi bo'yicha emas.
- Komponent darajasidagi o'zgaruvchilar (\`.btn-danger { --btn-bg: red; }\`) — bu darsning eng kuchli qismi. Uni albatta ko'rsating, chunki bu Tailwind va zamonaviy framework'lar ishlash prinsipi.
- 4px ritmini o'rgating. Bolalar tasodifiy raqamlar yozadi (13px, 17px, 22px). Bitta qoida — hammasi 4 ga bo'linsin — sayt ko'rinishini keskin yaxshilaydi.

## ⚠️ Notion'dagi dastur bilan nomuvofiqlik

Asl sahifada dark mode **JavaScript** bilan berilgan (\`localStorage\`, \`dataset.theme\`). JavaScript 34-darsdan, LocalStorage esa 5-oydan boshlanadi.

Bu yerda checkbox usuli bilan CSS-only qilib yozildi — asosiy g'oya (o'zgaruvchilar to'plamini almashtirish) to'liq saqlangan. JS varianti darsda eslatib o'tilgan, lekin topshiriqqa kiritilmagan.

## ⚠️ Ko'p uchraydigan xatolar

- **\`var()\` yozilmagan** — \`color: --primary\` xato, \`color: var(--primary)\` to'g'ri.
- **O'zgaruvchi \`:root\` dan tashqarida e'lon qilingan** — masalan \`.card\` ichida. Unda u faqat \`.card\` va uning bolalarida ishlaydi. Bu xato emas, lekin bolalar buni bilmay chalkashadi.
- **Nom noto'g'ri** — \`-primary\` (bitta chiziqcha) ishlamaydi, ikkitasi shart.
- **Bo'shliq qo'yilgan** — \`var( --primary )\` ishlaydi, lekin \`--primary : #fff\` da ikki nuqta oldidagi bo'shliq muammo qiladi.
- **Katta-kichik harf** — \`--Primary\` va \`--primary\` **turli** o'zgaruvchilar. CSS'ning qolgan qismidan farqli, bu yerda registr muhim.

## 📊 Daraja belgilash

- **Bronze** — ranglar \`:root\` ga chiqarilgan, sayt buzilmagan
- **Silver** — o'lchamlar ham o'zgaruvchida, radius bir joydan boshqariladi
- **Gold** — dark mode ishlaydi, qattiq yozilgan rang qolmagan

> Gold'ni tekshirishning tez usuli: CSS'da \`#\` belgisini qidiring. \`:root\` dan tashqarida topilsa — to'liq bajarilmagan.
`,
  },

  // ═══════════════════════════════════════════════════════════
  'junior.m1.l18': {
    goal: "@keyframes bilan murakkab animatsiyalar: loading, bounce, shake, typing.",
    student: `
## 🎬 @keyframes — sintaksis

\`\`\`css
@keyframes nomi {
  0%   { /* boshlanish */ }
  50%  { /* o'rta */ }
  100% { /* tugash */ }
}

/* yoki faqat ikki nuqta */
@keyframes nomi {
  from { /* boshlanish */ }
  to   { /* tugash */ }
}

.element {
  animation: nomi 1s ease-in-out infinite;
  /*         nom  vaqt  timing     takror */
}
\`\`\`

10-darsda animatsiyalar bilan tanishgansiz. Endi ularni chuqurroq va real vazifalar uchun ishlatamiz.

---

## ⭕ Loading animatsiyalari

Har bir saytda kerak bo'ladigan uchta klassik:

\`\`\`demo h=280 "Spinner, pulse, skeleton"
<style>
  body { font-family: sans-serif; display: flex; gap: 30px; align-items: center; }
  .col { text-align: center; font-size: 12px; color: #6b7280; }

  /* 1. Spinner */
  @keyframes spin { to { transform: rotate(360deg); } }
  .spinner {
    width: 42px; height: 42px;
    border: 4px solid #e5e7eb;
    border-top-color: #3498db;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin: 0 auto 8px;
  }

  /* 2. Pulsatsiya */
  @keyframes pulse {
    0%, 100% { transform: scale(1);   opacity: 1; }
    50%      { transform: scale(1.5); opacity: 0.5; }
  }
  .dots { display: flex; gap: 8px; justify-content: center; margin-bottom: 8px; height: 42px; align-items: center; }
  .dot {
    width: 12px; height: 12px; border-radius: 50%;
    background: #8b5cf6;
    animation: pulse 1.2s ease-in-out infinite;
  }
  .dot:nth-child(2) { animation-delay: 0.2s; }
  .dot:nth-child(3) { animation-delay: 0.4s; }

  /* 3. Skeleton */
  @keyframes shimmer { to { background-position: -200% center; } }
  .skeleton {
    width: 130px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% auto;
    animation: shimmer 1.4s linear infinite;
    border-radius: 6px;
    margin-bottom: 6px;
  }
  .sk1 { height: 12px; }
  .sk2 { height: 12px; width: 100px; }
  .sk3 { height: 12px; width: 115px; margin-bottom: 8px; }
</style>

<div class="col">
  <div class="spinner"></div>
  Spinner
</div>

<div class="col">
  <div class="dots"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>
  Pulsatsiya
</div>

<div class="col">
  <div class="skeleton sk1"></div>
  <div class="skeleton sk2"></div>
  <div class="skeleton sk3"></div>
  Skeleton
</div>
\`\`\`

Uchta muhim hiyla bor:

- **Spinner** — doiraning faqat bitta tomoni (\`border-top-color\`) boshqa rangda, shuning uchun aylanish ko'rinadi
- **Nuqtalar** — bir xil animatsiya, lekin \`animation-delay\` turlicha. Shuning uchun to'lqin effekti chiqadi
- **Skeleton** — gradient fon \`200%\` kenglikda, uning pozitsiyasi siljiydi

> 💡 Skeleton — zamonaviy saytlarda spinner o'rnini egallamoqda. Sabab: foydalanuvchi kontent **qanday ko'rinishini** oldindan biladi va kutish qisqaroq tuyuladi.

---

## 🔔 Shake — xato bildirish

\`\`\`demo h=240 "Xato animatsiyasi"
<style>
  body { font-family: sans-serif; padding-top: 16px; }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%      { transform: translateX(-8px); }
    40%      { transform: translateX(8px); }
    60%      { transform: translateX(-6px); }
    80%      { transform: translateX(6px); }
  }

  .field { margin-bottom: 12px; }
  label { display: block; font-size: 12px; color: #6b7280; margin-bottom: 4px; }

  input {
    padding: 10px; border: 2px solid #d1d5db;
    border-radius: 8px; width: 220px; font-size: 14px; outline: none;
  }

  .xato input {
    border-color: #e74c3c;
    animation: shake 0.5s ease;
  }
  .xato-matn { color: #e74c3c; font-size: 12px; margin-top: 4px; }
</style>

<div class="field">
  <label>Oddiy maydon</label>
  <input value="to'g'ri@email.com" />
</div>

<div class="field xato">
  <label>Xato maydon</label>
  <input value="notogri-email" />
  <div class="xato-matn">Email formati noto'g'ri</div>
</div>
\`\`\`

Animatsiyani qayta ko'rish uchun "O'zgartirib ko'rish" ni bosib, biror harfni o'zgartiring — demo qayta yuklanadi.

---

## ⌨️ Typing — yozilayotgan matn

\`\`\`demo h=220 "Typewriter effekti"
<style>
  body { font-family: monospace; padding-top: 20px; }

  @keyframes typing { from { width: 0; } to { width: 24ch; } }
  @keyframes blink  { 50% { border-color: transparent; } }

  .typing-text {
    font-size: 18px;
    overflow: hidden;
    white-space: nowrap;
    border-right: 3px solid #1a1a2e;
    width: 0;
    animation:
      typing 3s steps(24) infinite,
      blink 0.8s step-end infinite;
  }
</style>

<p class="typing-text">Frontend Developer</p>
\`\`\`

Sir uchta narsada:

- \`white-space: nowrap\` + \`overflow: hidden\` — matn bitta qatorda, ortiqchasi kesiladi
- \`steps(24)\` — animatsiya silliq emas, **24 qadamda** ketadi. Shuning uchun harflar birma-bir chiqadi
- \`border-right\` — kursor. \`blink\` animatsiyasi uni miltillatadi

\`24ch\` — "24 ta belgi kengligi" degani. Monospace shriftda bu aniq ishlaydi.

---

## 🌊 Bounce va Float

\`\`\`demo h=240 "Sakrash va suzish"
<style>
  body { font-family: sans-serif; display: flex; gap: 50px;
         align-items: center; justify-content: center; padding-top: 30px; }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50%      { transform: translateY(-24px); }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0)     rotate(0deg); }
    33%      { transform: translateY(-12px) rotate(3deg); }
    66%      { transform: translateY(-6px)  rotate(-3deg); }
  }

  .ball {
    width: 56px; height: 56px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    color: white; font-size: 12px; font-weight: 600;
  }
  .b1 { background: #ef4444; animation: bounce 1s ease-in-out infinite; }
  .b2 { background: #3b82f6; border-radius: 14px; animation: float 4s ease-in-out infinite; }
</style>

<div class="ball b1">bounce</div>
<div class="ball b2">float</div>
\`\`\`

\`float\` da ikkita xususiyat bir vaqtda o'zgaradi — \`translateY\` va \`rotate\`. Natijada tabiiy "suzish" hissi chiqadi.

---

## ⚙️ Animation xususiyatlari to'liq

\`\`\`css
.element {
  animation-name: fadeIn;
  animation-duration: 0.5s;
  animation-timing-function: ease-out;
  animation-delay: 0.2s;
  animation-iteration-count: infinite;   /* yoki raqam */
  animation-direction: alternate;        /* normal | reverse | alternate */
  animation-fill-mode: forwards;         /* tugagach holatni saqlash */

  /* Qisqartma — shu tartibda */
  animation: fadeIn 0.5s ease-out 0.2s infinite alternate forwards;
}
\`\`\`

\`\`\`demo h=260 "direction: normal / reverse / alternate"
<style>
  body { font-family: sans-serif; font-size: 12px; }
  @keyframes slide { from { transform: translateX(0); } to { transform: translateX(240px); } }

  .track { background: #f3f4f6; border-radius: 8px; padding: 6px;
           margin-bottom: 8px; overflow: hidden; }
  .box { width: 40px; height: 30px; border-radius: 6px; background: #6366f1;
         color: white; display: flex; align-items: center; justify-content: center;
         font-size: 10px; }

  .d1 .box { animation: slide 2s linear infinite normal; }
  .d2 .box { animation: slide 2s linear infinite reverse; }
  .d3 .box { animation: slide 2s linear infinite alternate; }
  .lbl { font-family: monospace; color: #4b5563; margin: 0 0 3px; }
</style>

<p class="lbl">normal — har safar boshidan</p>
<div class="track d1"><div class="box">→</div></div>

<p class="lbl">reverse — teskari</p>
<div class="track d2"><div class="box">←</div></div>

<p class="lbl">alternate — borib-kelib</p>
<div class="track d3"><div class="box">↔</div></div>
\`\`\`

---

## ♿ prefers-reduced-motion — muhim qoida

Ba'zi odamlarda animatsiya **bosh aylanishi va ko'ngil aynishi** keltiradi (vestibulyar buzilish). Ular operatsion tizim sozlamalarida "animatsiyalarni kamaytirish" ni yoqadi.

Yaxshi sayt buni hurmat qiladi:

\`\`\`css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
\`\`\`

Bu bir necha qatorni har bir loyihangizga qo'shing. Sayt sizga xuddi shunday ko'rinadi, lekin kimdir uchun u ishlatib bo'ladigan bo'ladi.

---

## 🥉 Bronze Topshiriq

Spinner yarating: doira aylansin, faqat bitta tomoni boshqa rangda bo'lsin.

---

## 🥈 Silver Topshiriq

Uchta pulsatsiyalanuvchi nuqta yarating. Har biriga boshqa \`animation-delay\` bering, to'lqin effekti chiqsin.

---

## 🥇 Gold Topshiriq — yuklanish ekrani

Portfolio saytingizga yuklanish ekrani qo'shing:

- Markazda spinner
- Ostida typewriter effekti bilan "Yuklanmoqda..."
- \`prefers-reduced-motion\` hisobga olingan

\`\`\`demo h=300 "Gold — natija namunasi"
<style>
  body { margin: 0; font-family: sans-serif; }

  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes typing { from { width: 0; } to { width: 14ch; } }
  @keyframes blink { 50% { border-color: transparent; } }

  .loading-screen {
    position: absolute; inset: 0;
    background: #0f0f1a;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 20px;
  }

  .spinner {
    width: 48px; height: 48px;
    border: 4px solid rgba(255,255,255,0.15);
    border-top-color: #3498db;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  .typing-text {
    font-family: monospace; font-size: 15px; color: #e5e7eb;
    overflow: hidden; white-space: nowrap;
    border-right: 2px solid #3498db;
    width: 0;
    animation: typing 2s steps(14) infinite, blink 0.7s step-end infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
    }
  }
</style>

<div class="loading-screen">
  <div class="spinner"></div>
  <p class="typing-text">Yuklanmoqda...</p>
</div>
\`\`\`

> 💡 Haqiqiy saytda bu ekran sahifa yuklanib bo'lgach yashiriladi — buning uchun JavaScript kerak. Uni 5-oyda o'rganasiz. Hozircha ekranning **ko'rinishi** muhim.

---

## ✅ Dars Xulosa

- \`@keyframes\` — animatsiya bosqichlarini belgilaydi
- \`animation-delay\` turlicha bo'lsa — to'lqin effekti chiqadi
- \`steps()\` — silliq emas, qadamli animatsiya (typewriter uchun)
- \`animation-fill-mode: forwards\` — tugagach oxirgi holat saqlanadi
- \`direction: alternate\` — borib-kelib
- \`prefers-reduced-motion\` — har loyihaga qo'shing

> 🚀 **Keyingi dars:** HTML Forms — professional forma yaratish!
`,
    teacher: `
## 💡 O'qituvchi uchun

- Bu dars 10-darsning davomi, lekin farqi bor: 10-darsda animatsiya **bezak** edi, bu yerda **vazifa bajaradi** (yuklanish, xato, kutish). Shu farqni ta'kidlang.
- \`animation-delay\` bilan to'lqin effekti — eng ta'sirli namoyish. Uchta nuqtaning delay'ini 0 qilib ko'rsating (birga sakraydi, chiroyli emas), keyin 0.2s farq bering. Farq keskin.
- \`steps()\` ni tushuntirish qiyin. Oddiy yo'l: \`steps(5)\` qilib ko'rsating — sakrab-sakrab boradi. Keyin \`steps(24)\` — silliqroq. "Bu — animatsiyani necha bo'lakka bo'lish" deb ayting.
- **\`prefers-reduced-motion\` ni albatta o'ting.** Bu — bolalarga birinchi marta "sayt hamma uchun ishlashi kerak" degan fikrni beradi. Bu \`alt\` atributidan keyingi ikkinchi accessibility darsi.

## ⚠️ Notion'dagi dastur bilan nomuvofiqlik

Asl sahifadagi Gold topshiriq **JavaScript** talab qiladi (\`window.addEventListener('load')\`, \`element.remove()\`). JavaScript 34-darsdan boshlanadi.

Bu yerda topshiriq **yuklanish ekranining ko'rinishini** yasashga qisqartirildi — animatsiyalar to'liq, faqat yashirish qismi yo'q. Darsda buning sababi tushuntirilgan.

Shuningdek, shake animatsiyasidagi JS izohi (\`classList.add('xato-input')\`) olib tashlandi va o'rniga tayyor xato holati ko'rsatildi.

## ⚠️ Ko'p uchraydigan xatolar

- **Animatsiya bir marta ishlab to'xtaydi** — \`infinite\` yozilmagan.
- **Element boshlang'ich holatiga qaytib ketadi** — \`forwards\` yo'q.
- **Spinner aylanmayapti** — \`border-radius: 50%\` yo'q yoki barcha tomonlar bir xil rangda.
- **Typewriter ishlamayapti** — \`white-space: nowrap\` yoki \`overflow: hidden\` tushirib qoldirilgan. Ikkalasi ham shart.
- **\`width: 100%\` bilan typing** — noto'g'ri natija beradi, \`ch\` birligi kerak.
- **Sahifa "chaqnab" turibdi** — bolalar hamma joyga \`infinite\` animatsiya qo'yadi. Qoida o'rnating: bir ekranda **ko'pi bilan bitta** doimiy animatsiya.

## 📊 Daraja belgilash

- **Bronze** — spinner aylanadi, tekis va uzluksiz
- **Silver** — delay bilan to'lqin effekti chiqqan
- **Gold** — yuklanish ekrani to'liq, typing ishlaydi, prefers-reduced-motion bor

> Gold uchun \`prefers-reduced-motion\` ni **majburiy** qiling. Uni tekshirish oson: DevTools → Rendering → Emulate CSS prefers-reduced-motion.
`,
  },

  // ═══════════════════════════════════════════════════════════
  'junior.m1.l19': {
    goal: "form, input turlari, validatsiya attributlari va CSS bilan forma stillashtirish.",
    student: `
## 📝 Input turlari

HTML'da 20 dan ortiq input turi bor. Har biri o'z vazifasiga mo'ljallangan:

\`\`\`demo h=400 "Input turlari — hammasini sinab ko'ring"
<style>
  body { font-family: sans-serif; font-size: 13px; }
  .row { margin-bottom: 12px; }
  label { display: block; color: #6b7280; margin-bottom: 4px; font-size: 12px; }
  input, select, textarea {
    padding: 8px 10px; border: 1px solid #d1d5db;
    border-radius: 6px; font-size: 13px; width: 100%;
    font-family: inherit;
  }
  .half { display: flex; gap: 10px; }
  .half > div { flex: 1; }
</style>

<div class="half">
  <div class="row">
    <label>type="text"</label>
    <input type="text" placeholder="Oddiy matn" />
  </div>
  <div class="row">
    <label>type="email"</label>
    <input type="email" placeholder="email@example.com" />
  </div>
</div>

<div class="half">
  <div class="row">
    <label>type="password"</label>
    <input type="password" value="maxfiy" />
  </div>
  <div class="row">
    <label>type="number"</label>
    <input type="number" min="0" max="100" value="42" />
  </div>
</div>

<div class="half">
  <div class="row">
    <label>type="date"</label>
    <input type="date" />
  </div>
  <div class="row">
    <label>type="color"</label>
    <input type="color" value="#3498db" />
  </div>
</div>

<div class="row">
  <label>type="range" — sudrab ko'ring</label>
  <input type="range" min="0" max="100" value="50" />
</div>

<div class="row">
  <label>select</label>
  <select>
    <option value="">Shahar tanlang</option>
    <option>Toshkent</option>
    <option>Samarqand</option>
    <option>Buxoro</option>
  </select>
</div>
\`\`\`

To'g'ri turni tanlash muhim: telefonda \`type="email"\` bosilganda klaviaturada \`@\` belgisi chiqadi, \`type="number"\` da esa raqamli klaviatura ochiladi. Bu — foydalanuvchi uchun katta qulaylik.

---

## ☑️ Checkbox, radio va label

\`\`\`demo h=280 "label for — nima uchun kerak"
<style>
  body { font-family: sans-serif; font-size: 14px; }
  .group { margin-bottom: 18px; padding: 12px; background: #f9fafb; border-radius: 8px; }
  .item { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
  .note { font-size: 12px; color: #6b7280; margin: 0 0 8px; }
</style>

<div class="group">
  <p class="note">✅ To'g'ri: label for="..." bilan bog'langan — MATNGA bosib ko'ring</p>
  <div class="item">
    <input type="checkbox" id="qabul" />
    <label for="qabul">Shartlarga roziman</label>
  </div>
  <div class="item">
    <input type="radio" id="er" name="jins" />
    <label for="er">Erkak</label>
  </div>
  <div class="item">
    <input type="radio" id="ayol" name="jins" />
    <label for="ayol">Ayol</label>
  </div>
</div>

<div class="group">
  <p class="note">❌ Noto'g'ri: bog'lanmagan — matnga bossangiz hech narsa bo'lmaydi</p>
  <div class="item">
    <input type="checkbox" />
    <span>Shartlarga roziman</span>
  </div>
</div>
\`\`\`

Farqni sinab ko'ring: birinchi guruhda **matnga** bossangiz ham checkbox belgilanadi. Ikkinchisida — yo'q.

\`label for="qabul"\` va \`input id="qabul"\` — bu ikkisi bir xil bo'lishi kerak. Bu:

- Bosish maydonini kattalashtiradi (telefonda ayniqsa muhim)
- Ekran o'quvchi dasturlarga maydon nima uchun ekanini aytadi

> ⚠️ \`label\` va \`id\` ni bog'lash — **ixtiyoriy emas**. Har bir input uchun majburiy deb biling.

---

## ✅ Validatsiya — HTML o'zi tekshiradi

JavaScript yozmasdan ham brauzer ko'p narsani tekshiradi:

\`\`\`html
<input type="email" required />                    <!-- majburiy -->
<input type="text" minlength="3" maxlength="50" /> <!-- uzunlik -->
<input type="number" min="18" max="120" />         <!-- son chegarasi -->
<input type="tel" pattern="\\+998[0-9]{9}"
       title="+998XXXXXXXXX formatida" />          <!-- shablon -->
<input type="text" readonly value="O'zgartirib bo'lmaydi" />
<input type="text" disabled value="Faol emas" />
\`\`\`

---

## 🎨 :focus, :valid, :invalid

Bu uchtasi — formalarni jonlantiruvchi psevdo-klasslar:

\`\`\`demo h=360 "Yozing va chegara rangini kuzating"
<style>
  body { font-family: sans-serif; font-size: 14px; }
  .row { margin-bottom: 16px; }
  label { display: block; font-weight: 600; font-size: 13px;
          color: #374151; margin-bottom: 6px; }

  input {
    width: 100%;
    padding: 11px 14px;
    border: 2px solid #e5e7eb;
    border-radius: 10px;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  /* Fokusda — ko'k halqa */
  input:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
  }

  /* Yozilgan va NOTO'G'RI — qizil */
  input:invalid:not(:placeholder-shown) {
    border-color: #ef4444;
  }

  /* Yozilgan va TO'G'RI — yashil */
  input:valid:not(:placeholder-shown) {
    border-color: #22c55e;
  }

  .hint { font-size: 12px; color: #9ca3af; margin-top: 5px; }
</style>

<div class="row">
  <label>Email</label>
  <input type="email" required placeholder="email@example.com" />
  <p class="hint">Avval "salom" deb yozing (qizil), keyin "a@b.uz" (yashil)</p>
</div>

<div class="row">
  <label>Parol</label>
  <input type="password" required minlength="8" placeholder="Kamida 8 belgi" />
  <p class="hint">7 ta belgi — qizil, 8 ta — yashil</p>
</div>

<div class="row">
  <label>Yosh</label>
  <input type="number" min="7" max="99" placeholder="7 dan 99 gacha" />
  <p class="hint">5 yozing — qizil bo'ladi</p>
</div>
\`\`\`

\`:not(:placeholder-shown)\` qismi muhim. Busiz bo'sh maydon **darhol qizil** bo'lib turadi — foydalanuvchi hali hech narsa yozmagan bo'lsa ham. Bu esa yoqimsiz.

Ma'nosi: *"noto'g'ri, LEKIN faqat placeholder ko'rinmayotgan bo'lsa"* — ya'ni foydalanuvchi biror narsa yozgan bo'lsa.

---

## 🎯 Formani stillash

\`\`\`demo h=420 "To'liq forma dizayni"
<style>
  *, *::before, *::after { box-sizing: border-box; }
  body { font-family: sans-serif; background: #f3f4f6; padding: 14px; }

  .forma-wrapper {
    max-width: 380px;
    margin: 0 auto;
    padding: 28px;
    background: white;
    border-radius: 18px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.08);
  }

  h2 { margin: 0 0 20px; font-size: 20px; color: #111827; }

  .forma-guruh { margin-bottom: 16px; }

  label {
    display: block;
    margin-bottom: 6px;
    font-weight: 600;
    font-size: 13px;
    color: #374151;
  }

  input {
    width: 100%;
    padding: 11px 14px;
    border: 2px solid #e5e7eb;
    border-radius: 10px;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  input:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
  }
  input:invalid:not(:placeholder-shown) { border-color: #ef4444; }
  input:valid:not(:placeholder-shown)   { border-color: #22c55e; }

  .checkbox-row {
    display: flex; gap: 8px; align-items: center;
    margin-bottom: 20px; font-size: 13px;
  }
  .checkbox-row input { width: auto; }
  .checkbox-row label { margin: 0; font-weight: 400; }

  .btn-submit {
    width: 100%;
    padding: 13px;
    background: #6366f1;
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, transform 0.1s;
  }
  .btn-submit:hover  { background: #4f46e5; }
  .btn-submit:active { transform: scale(0.98); }
</style>

<div class="forma-wrapper">
  <h2>Ro'yxatdan o'tish</h2>

  <div class="forma-guruh">
    <label for="ism">Ism *</label>
    <input type="text" id="ism" required minlength="2" placeholder="Ismingiz" />
  </div>

  <div class="forma-guruh">
    <label for="email2">Email *</label>
    <input type="email" id="email2" required placeholder="email@example.com" />
  </div>

  <div class="forma-guruh">
    <label for="parol2">Parol *</label>
    <input type="password" id="parol2" required minlength="8" placeholder="Kamida 8 belgi" />
  </div>

  <div class="checkbox-row">
    <input type="checkbox" id="qabul2" required />
    <label for="qabul2">Foydalanish shartlariga roziman</label>
  </div>

  <button class="btn-submit">Ro'yxatdan o'tish</button>
</div>
\`\`\`

---

## 🥉 Bronze Topshiriq

Uchta maydonli forma yarating: ism, email, parol. Har biriga \`label\` bog'lang (\`for\` va \`id\`).

---

## 🥈 Silver Topshiriq

Formani stillashtiring:

- \`:focus\` da chegara rangi o'zgarsin va halqa chiqsin
- \`:valid\` va \`:invalid\` bilan yashil/qizil chegara
- \`:not(:placeholder-shown)\` ishlatilgan bo'lsin

---

## 🥇 Gold Topshiriq

To'liq ro'yxatdan o'tish formasi:

- Barcha maydonlarda \`required\` va mos validatsiya (\`minlength\`, \`type\`)
- Checkbox "shartlarga roziman" — u ham \`required\`
- Tugmada \`:hover\` va \`:active\` holatlari
- Forma markazda, soya va yumaloq burchaklar bilan

> 💡 **JavaScript haqida:** haqiqiy formada yuborilganda ma'lumot serverga ketadi va xato xabarlari ko'rsatiladi — buning uchun JavaScript kerak. U bu dasturda **34-darsdan** boshlanadi. Hozircha formaning **ko'rinishi va HTML validatsiyasi** yetarli.

---

## ✅ Dars Xulosa

- Input turlari: \`text\`, \`email\`, \`password\`, \`number\`, \`date\`, \`tel\`, \`color\`, \`range\`
- To'g'ri tur — telefonda to'g'ri klaviatura degani
- \`label for\` + \`input id\` — **majburiy**, accessibility uchun
- \`required\`, \`minlength\`, \`min\`, \`max\`, \`pattern\` — brauzer o'zi tekshiradi
- \`:focus\`, \`:valid\`, \`:invalid\` — holat bo'yicha stil
- \`:not(:placeholder-shown)\` — bo'sh maydon qizil bo'lib turmasligi uchun

> 🚀 **Keyingi dars:** CSS Gradient va Filtrlar!
`,
    teacher: `
## 💡 O'qituvchi uchun

- \`label for\` ni **telefonda** ko'rsating. Kompyuterda farq sezilmaydi, telefonda esa kichik checkbox'ga barmoq tegmaydi. Bola buni ko'rgach, har doim label yozadigan bo'ladi.
- \`type="email"\` va \`type="number"\` ni telefonda oching — klaviatura o'zgarishini ko'rsating. Bu 10 soniyalik namoyish "nega turi muhim?" degan savolga to'liq javob beradi.
- \`:not(:placeholder-shown)\` — bu darsning eng "nozik" joyi. Uni ataylab olib tashlab ko'rsating: bo'sh forma butunlay qizil bo'lib turadi. Bola farqni ko'rgach tushunadi.
- Formalar — bolalar uchun zerikarli mavzu bo'lishi mumkin. Shuning uchun darhol chiroyli dizayn qilishga o'ting: soya, radius, focus halqasi. Natija chiroyli chiqsa qiziqish paydo bo'ladi.

## ⚠️ Notion'dagi dastur bilan nomuvofiqlik

Asl sahifadagi Gold topshiriqda \`e.preventDefault()\` va \`alert()\` bilan **JavaScript** bor edi. JavaScript 34-darsdan boshlanadi.

Bu yerda topshiriq formaning **ko'rinishi va HTML validatsiyasiga** qisqartirildi. JavaScript qismi 34-darsga qoldirildi va bu darsda tushuntirildi.

## ⚠️ Ko'p uchraydigan xatolar

- **\`label\` bog'lanmagan** — \`for\` va \`id\` mos kelmaydi yoki umuman yo'q. Eng ko'p uchraydigan xato.
- **Bir sahifada bir xil \`id\`** — ikki inputga \`id="email"\` berilgan. Unda label faqat birinchisiga ishlaydi.
- **Radio tugmalarda \`name\` yo'q** — natijada hammasini bir vaqtda tanlash mumkin bo'lib qoladi. Radio guruhi \`name\` orqali bog'lanadi.
- **\`outline: none\` yozilgan, o'rniga hech narsa berilmagan** — klaviatura foydalanuvchisi qayerdaligini yo'qotadi. \`:focus\` da albatta ko'rinadigan belgi bo'lsin.
- **\`placeholder\` \`label\` o'rniga ishlatilgan** — yozishni boshlagach placeholder yo'qoladi va foydalanuvchi maydon nima uchun ekanini unutadi. Ikkalasi ham kerak.
- **\`input\` \`width: 100%\` va \`box-sizing\` yo'q** — maydon konteynerdan chiqib ketadi.

## 📊 Daraja belgilash

- **Bronze** — uch maydon, label'lar to'g'ri bog'langan
- **Silver** — focus/valid/invalid ishlaydi, :not(:placeholder-shown) bor
- **Gold** — to'liq forma, barcha validatsiya, tugma holatlari, chiroyli dizayn

> Silver'ni tekshirishning tez usuli: bo'sh formani oching. Agar hammasi qizil bo'lib tursa — \`:not(:placeholder-shown)\` yo'q.
`,
  },

  // ═══════════════════════════════════════════════════════════
  'junior.m1.l20': {
    goal: "Linear/radial gradient, CSS filter va backdrop-filter bilan vizual effektlar.",
    student: `
## 🌈 Gradientlar

\`\`\`demo h=380 "Gradient turlari"
<style>
  body { font-family: sans-serif; font-size: 12px; }
  .g {
    height: 70px; border-radius: 10px; margin-bottom: 10px;
    display: flex; align-items: center; justify-content: center;
    color: white; font-weight: 600; text-shadow: 0 1px 3px rgba(0,0,0,0.3);
  }
  .lbl { font-family: monospace; color: #4b5563; margin: 0 0 4px; }

  .g1 { background: linear-gradient(to right, #3498db, #9b59b6); }
  .g2 { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
  .g3 { background: linear-gradient(to right, #f093fb, #f5576c, #4facfe, #00f2fe); }
  .g4 { background: radial-gradient(circle, #3498db, #1a1a2e); }
</style>

<p class="lbl">linear-gradient(to right, ...)</p>
<div class="g g1">Chapdan o'ngga</div>

<p class="lbl">linear-gradient(135deg, ...)</p>
<div class="g g2">Burchak bilan</div>

<p class="lbl">linear-gradient(to right, 4 ta rang)</p>
<div class="g g3">Ko'p rangli</div>

<p class="lbl">radial-gradient(circle, ...)</p>
<div class="g g4">Markazdan</div>
\`\`\`

Yo'nalishni ikki xil berish mumkin: so'z bilan (\`to right\`, \`to bottom left\`) yoki burchak bilan (\`135deg\`). Burchak aniqroq boshqaruv beradi.

---

## 🥧 Conic gradient — diagramma

\`\`\`demo h=280 "conic-gradient bilan doiraviy diagramma"
<style>
  body { font-family: sans-serif; display: flex; gap: 26px; align-items: center; }

  .pie {
    width: 150px; height: 150px;
    border-radius: 50%;
    background: conic-gradient(
      #e74c3c 0% 30%,
      #3498db 30% 60%,
      #27ae60 60% 100%
    );
  }

  .legend { font-size: 13px; }
  .legend div { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
  .dot { width: 12px; height: 12px; border-radius: 3px; }
</style>

<div class="pie"></div>

<div class="legend">
  <div><span class="dot" style="background:#e74c3c"></span> 30% — Qizil</div>
  <div><span class="dot" style="background:#3498db"></span> 30% — Ko'k</div>
  <div><span class="dot" style="background:#27ae60"></span> 40% — Yashil</div>
</div>
\`\`\`

Diagramma qurish uchun kutubxona kerak emas — bitta CSS qatori yetarli. Foizlarni o'zgartirib ko'ring.

---

## ✨ Gradient matn

\`\`\`demo h=240 "Matnni gradient bilan bo'yash"
<style>
  body { font-family: sans-serif; }

  .gradient-matn {
    background: linear-gradient(135deg, #667eea, #764ba2);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 800;
    font-size: 38px;
    line-height: 1.15;
    margin: 0;
  }

  .g2 {
    background: linear-gradient(90deg, #f5576c, #f093fb, #4facfe);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 800;
    font-size: 28px;
    margin: 14px 0 0;
  }
</style>

<h1 class="gradient-matn">Frontend<br />Developer</h1>
<p class="g2">Uch rangli gradient</p>
\`\`\`

Uch qator kerak: matn orqasiga gradient qo'yiladi, \`background-clip: text\` uni harflar shakliga qirqadi, \`text-fill-color: transparent\` esa harflarni shaffof qiladi va orqadagi gradient ko'rinadi.

---

## 🔭 CSS Filter

\`\`\`demo h=340 "Rasm filtrlari — bir rasm, sakkiz ko'rinish"
<style>
  body { font-family: sans-serif; font-size: 11px; }
  .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
  .item { text-align: center; }
  .item img { width: 100%; border-radius: 8px; display: block; margin-bottom: 4px; }
  .lbl { font-family: monospace; color: #4b5563; }

  .f1 { filter: none; }
  .f2 { filter: grayscale(100%); }
  .f3 { filter: sepia(85%); }
  .f4 { filter: blur(3px); }
  .f5 { filter: brightness(1.4); }
  .f6 { filter: contrast(1.8); }
  .f7 { filter: hue-rotate(140deg); }
  .f8 { filter: invert(100%); }
</style>

<div class="grid">
  <div class="item"><img class="f1" src="https://picsum.photos/id/1015/200/150" alt="" /><span class="lbl">asl</span></div>
  <div class="item"><img class="f2" src="https://picsum.photos/id/1015/200/150" alt="" /><span class="lbl">grayscale</span></div>
  <div class="item"><img class="f3" src="https://picsum.photos/id/1015/200/150" alt="" /><span class="lbl">sepia</span></div>
  <div class="item"><img class="f4" src="https://picsum.photos/id/1015/200/150" alt="" /><span class="lbl">blur(3px)</span></div>
  <div class="item"><img class="f5" src="https://picsum.photos/id/1015/200/150" alt="" /><span class="lbl">brightness</span></div>
  <div class="item"><img class="f6" src="https://picsum.photos/id/1015/200/150" alt="" /><span class="lbl">contrast</span></div>
  <div class="item"><img class="f7" src="https://picsum.photos/id/1015/200/150" alt="" /><span class="lbl">hue-rotate</span></div>
  <div class="item"><img class="f8" src="https://picsum.photos/id/1015/200/150" alt="" /><span class="lbl">invert</span></div>
</div>
\`\`\`

Filtrlarni **birlashtirish** mumkin:

\`\`\`css
filter: contrast(1.2) saturate(1.4) brightness(1.1);
\`\`\`

### Hover'da filtr

\`\`\`demo h=260 "Qora-oqdan rangliga"
<style>
  body { font-family: sans-serif; display: flex; gap: 14px; }
  .card { width: 150px; border-radius: 12px; overflow: hidden; }
  .card img {
    width: 100%; display: block;
    filter: grayscale(90%);
    transition: filter 0.4s, transform 0.4s;
  }
  .card:hover img { filter: grayscale(0); transform: scale(1.05); }
  p { margin: 0 0 10px; color: #6b7280; font-size: 13px; }
</style>

<div>
  <p>Kursorni olib keling</p>
  <div style="display:flex;gap:14px">
    <div class="card"><img src="https://picsum.photos/id/1018/300/200" alt="" /></div>
    <div class="card"><img src="https://picsum.photos/id/1024/300/200" alt="" /></div>
  </div>
</div>
\`\`\`

Bu — portfolio saytlarida juda ko'p ishlatiladigan usul: rasmlar qora-oq turadi, kursor kelganda ranglanadi.

---

## 💎 backdrop-filter — shisha effekti

\`filter\` **elementning o'zini** o'zgartiradi. \`backdrop-filter\` esa **elementning orqasidagi** narsani.

\`\`\`demo h=340 "Glassmorphism"
<style>
  body { margin: 0; }

  .scene {
    min-height: 300px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    font-family: sans-serif;
  }

  /* Orqa fonda rangli doiralar — shisha effekti ko'rinishi uchun */
  .scene::before {
    content: '';
    position: absolute;
    width: 160px; height: 160px;
    background: #f5576c;
    border-radius: 50%;
    top: 20px; left: 40px;
    filter: blur(6px);
  }

  .glass {
    position: relative;
    background: rgba(255,255,255,0.15);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.25);
    border-radius: 22px;
    padding: 30px;
    color: white;
    width: 260px;
    text-align: center;
  }
  .glass .icon { font-size: 46px; margin-bottom: 10px; }
  .glass h2 { margin: 0 0 8px; font-size: 20px; }
  .glass p { margin: 0; opacity: 0.85; font-size: 13px; }
</style>

<div class="scene">
  <div class="glass">
    <div class="icon">🚀</div>
    <h2>Glassmorphism</h2>
    <p>backdrop-filter bilan yaratilgan shisha effekti</p>
  </div>
</div>
\`\`\`

Kartochka orqasidagi qizil doira **xiralashib** ko'rinib turibdi. Bu — \`backdrop-filter: blur()\` ning ishi.

Uchta shart: yarim shaffof fon (\`rgba\`), \`backdrop-filter: blur()\`, va yengil oq chegara.

> 💡 Xuddi shu usul bilan "muzli" navbar yasaladi:
> \`background: rgba(255,255,255,0.8); backdrop-filter: blur(12px);\`

---

## 🥉 Bronze Topshiriq

Hero bo'limingizga gradient fon bering. Ikki rangli \`linear-gradient\` yetadi.

---

## 🥈 Silver Topshiriq

- Sarlavhangizni gradient matn qiling
- Loyiha rasmlarini qora-oq qiling, hover'da ranglansin

---

## 🥇 Gold Topshiriq

Glassmorphism kartochka yarating:

- Gradient fon
- Orqada rangli shakl (\`::before\` bilan)
- Ustida shaffof kartochka: \`backdrop-filter: blur()\`, yengil oq chegara

---

## ✅ Dars Xulosa

- \`linear-gradient(135deg, r1, r2)\` — chiziqli
- \`radial-gradient(circle, ...)\` — markazdan
- \`conic-gradient(...)\` — doiraviy diagramma
- \`background-clip: text\` + \`text-fill-color: transparent\` — gradient matn
- \`filter\` — elementning o'zini o'zgartiradi
- \`backdrop-filter\` — orqasidagini xiralashtiradi (glassmorphism)

> 🚀 **Keyingi dars:** Rasmlar — object-fit va optimizatsiya!
`,
    teacher: `
## 💡 O'qituvchi uchun

- Bu — 2-oyning eng "zavqli" darsi. Bolalar natijani darhol ko'radi va o'zi tajriba qilishni boshlaydi. Shu qiziqishdan foydalaning, lekin oxirida qoida eslating: **gradient — bezak, asosiy vosita emas**. Butun sayt gradient bo'lsa — ko'z charchaydi.
- \`filter\` va \`backdrop-filter\` farqini albatta ajrating. Oddiy tushuntirish: "filter — **o'zini** o'zgartiradi, backdrop-filter — **orqasidagini**". Demoni ikkalasida sinab ko'rsating.
- \`conic-gradient\` bilan diagramma — bolalarga juda ta'sir qiladi. "Diagramma uchun kutubxona kerak deb o'ylagansiz-a?" deb boshlang.
- Gradient matn uchun uchta qator kerak va ular chalkash. Ularni yoddan yozdirmang — snippet sifatida saqlab qo'yishni o'rgating.

## ⚠️ Ko'p uchraydigan xatolar

- **Gradient matn ko'rinmayapti** — \`-webkit-text-fill-color: transparent\` yozilmagan yoki \`background-clip\` da \`-webkit-\` prefiksi yo'q. Ikkalasi ham kerak.
- **Gradient matn qora bo'lib qolgan** — \`color\` xususiyati \`text-fill-color\` dan keyin yozilgan va uni bekor qilgan.
- **\`backdrop-filter\` ishlamayapti** — element foni **to'liq shaffof** yoki **to'liq qattiq**. U yarim shaffof bo'lishi kerak: \`rgba(255,255,255,0.15)\`.
- **\`backdrop-filter\` ishlamayapti (2)** — orqada xiralashadigan narsa yo'q. Oq fon ustida effekt ko'rinmaydi.
- **\`filter: blur()\` butun kartochkaga qo'llangan** — matn ham xiralashadi. Faqat rasmga berish kerak.
- **Juda ko'p filtr** — \`brightness(2) contrast(3) saturate(4)\` rasmni buzadi. Qiymatlar 0.8–1.5 oralig'ida bo'lsin.

## 📊 Daraja belgilash

- **Bronze** — gradient fon ishlaydi, ranglar mos
- **Silver** — gradient matn to'g'ri, hover filtri silliq
- **Gold** — glassmorphism ishlaydi, orqa fon xiralashib ko'rinadi

> Gold'ni tekshirish: kartochka orqasida biror narsa **ko'rinib turibdimi**? Ko'rinmasa — backdrop-filter ishlamayapti, faqat shaffof fon qo'yilgan.
`,
  },

  // ═══════════════════════════════════════════════════════════
  'junior.m1.l21': {
    goal: "object-fit, aspect-ratio, lazy loading va srcset — tezkor va chiroyli rasmlar.",
    student: `
## 🖼️ object-fit — cho'zilgan rasm muammosi

Sizda 300×200 quti bor, rasm esa kvadrat. Nima bo'ladi?

\`\`\`demo h=320 "fill / cover / contain — farqni ko'ring"
<style>
  body { font-family: sans-serif; font-size: 12px; }
  .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
  .box {
    width: 100%; height: 130px;
    border: 2px solid #d1d5db; border-radius: 8px;
    overflow: hidden; background: #f3f4f6;
  }
  .box img { width: 100%; height: 100%; display: block; }
  .lbl { font-family: monospace; color: #4b5563; margin: 6px 0 0; }
  .note { font-size: 11px; color: #9ca3af; margin: 2px 0 0; }

  .f1 img { object-fit: fill; }
  .f2 img { object-fit: cover; }
  .f3 img { object-fit: contain; }
</style>

<div class="grid">
  <div>
    <div class="box f1"><img src="https://picsum.photos/id/1025/300/300" alt="" /></div>
    <p class="lbl">fill (default)</p>
    <p class="note">Cho'zilgan — it semirib ketdi</p>
  </div>
  <div>
    <div class="box f2"><img src="https://picsum.photos/id/1025/300/300" alt="" /></div>
    <p class="lbl">cover</p>
    <p class="note">Kadrlangan — nisbat to'g'ri</p>
  </div>
  <div>
    <div class="box f3"><img src="https://picsum.photos/id/1025/300/300" alt="" /></div>
    <p class="lbl">contain</p>
    <p class="note">To'liq ko'rinadi, bo'sh joy qoldi</p>
  </div>
</div>
\`\`\`

Birinchi variant — **standart holat**. Ya'ni \`object-fit\` yozmasangiz, rasmingiz shunday cho'ziladi. Portfolio saytlarida eng ko'p uchraydigan xato aynan shu.

| Qiymat | Nima qiladi | Qachon |
| --- | --- | --- |
| \`fill\` | Cho'zadi (default) | Deyarli hech qachon |
| \`cover\` | Kadrlaydi, quti to'ladi | **Eng ko'p** — kartochka, avatar, galereya |
| \`contain\` | To'liq ko'rsatadi, bo'sh joy qoladi | Logo, mahsulot surati |
| \`scale-down\` | Kichigini tanlaydi | Kam ishlatiladi |

---

## 🎯 object-position — qayerdan kadrlash

\`cover\` rasmni kesadi. Lekin **qayeridan** kesishini siz belgilashingiz mumkin:

\`\`\`demo h=300 "object-position — portret suratlar uchun muhim"
<style>
  body { font-family: sans-serif; font-size: 12px; }
  .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
  .box { width: 100%; height: 140px; border-radius: 8px; overflow: hidden; }
  .box img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .lbl { font-family: monospace; color: #4b5563; margin: 6px 0 0; }

  .p1 img { object-position: center; }
  .p2 img { object-position: top; }
  .p3 img { object-position: bottom; }
</style>

<div class="grid">
  <div>
    <div class="box p1"><img src="https://picsum.photos/id/1011/400/600" alt="" /></div>
    <p class="lbl">center (default)</p>
  </div>
  <div>
    <div class="box p2"><img src="https://picsum.photos/id/1011/400/600" alt="" /></div>
    <p class="lbl">top</p>
  </div>
  <div>
    <div class="box p3"><img src="https://picsum.photos/id/1011/400/600" alt="" /></div>
    <p class="lbl">bottom</p>
  </div>
</div>
\`\`\`

Portret suratlarda \`object-position: top\` deyarli har doim yaxshiroq — chunki odamning **yuzi tepada** bo'ladi. \`center\` bilan bosh kesilib qolishi mumkin.

---

## 📐 aspect-ratio — nisbatni saqlash

\`\`\`demo h=300 "Turli nisbatlar"
<style>
  body { font-family: sans-serif; font-size: 12px; }
  .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; align-items: start; }
  .box { border-radius: 8px; overflow: hidden; }
  .box img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .lbl { font-family: monospace; color: #4b5563; margin: 6px 0 0; }

  .r1 { aspect-ratio: 16 / 9; }
  .r2 { aspect-ratio: 1; }
  .r3 { aspect-ratio: 3 / 4; }
</style>

<div class="grid">
  <div>
    <div class="box r1"><img src="https://picsum.photos/id/1015/400/400" alt="" /></div>
    <p class="lbl">16 / 9 — video</p>
  </div>
  <div>
    <div class="box r2"><img src="https://picsum.photos/id/1015/400/400" alt="" /></div>
    <p class="lbl">1 — kvadrat</p>
  </div>
  <div>
    <div class="box r3"><img src="https://picsum.photos/id/1015/400/400" alt="" /></div>
    <p class="lbl">3 / 4 — portret</p>
  </div>
</div>
\`\`\`

\`aspect-ratio\` bilan balandlikni hisoblab o'tirish shart emas — brahzer o'zi hisoblaydi va oyna kichrayganda ham nisbat saqlanadi.

---

## ⚡ Lazy loading — sahifani tezlashtirish

\`\`\`html
<!-- Faqat ko'rinishga yaqinlashganda yuklanadi -->
<img src="rasm.jpg" alt="Tavsif" loading="lazy" width="800" height="450" />

<!-- BIRINCHI ko'rinadigan rasm — darhol yuklansin -->
<img src="hero.jpg" alt="Hero" loading="eager" fetchpriority="high" />
\`\`\`

Sahifada 30 ta rasm bo'lsa, brauzer hammasini birdan yuklaydi va sayt sekin ochiladi. \`loading="lazy"\` bilan faqat ko'rinadigan 3-4 tasi yuklanadi, qolganlari foydalanuvchi pastga tushganda.

> ⚠️ **Hero rasmga \`lazy\` qo'ymang.** U birinchi ko'rinadi, kechiktirilsa sayt "sekin" tuyuladi.

### width va height — nima uchun kerak

\`\`\`html
<img src="rasm.jpg" alt="" width="800" height="450" />
\`\`\`

CSS'da o'lcham bergan bo'lsangiz ham, HTML'da \`width\` va \`height\` yozing. Sabab: brauzer rasm yuklanmasdan **oldin** unga qancha joy kerakligini biladi va joyni bo'sh qoldiradi.

Busiz nima bo'ladi: rasm yuklanganda sahifa "sakraydi" — matn pastga suriladi. Foydalanuvchi biror narsani bosmoqchi bo'lsa, boshqasini bosib yuboradi. Bu muammo **CLS** (Cumulative Layout Shift) deb ataladi va Google saytni baholashda hisobga oladi.

---

## 🖼️ Responsive rasmlar

Telefonga 2000px kenglikdagi rasm yuborish — internetni behuda sarflash.

\`\`\`html
<!-- srcset — bir xil rasm, turli o'lchamlarda -->
<img
  src="rasm-800.jpg"
  srcset="
    rasm-400.jpg   400w,
    rasm-800.jpg   800w,
    rasm-1200.jpg 1200w
  "
  sizes="(max-width: 600px) 400px, (max-width: 1000px) 800px, 1200px"
  alt="Responsive rasm"
/>
\`\`\`

Brauzer ekran o'lchamiga qarab **o'zi** mos rasmni tanlaydi.

\`\`\`html
<!-- picture — turli qurilmada BOSHQA rasm -->
<picture>
  <source media="(max-width: 600px)" srcset="mobile.jpg" />
  <source media="(max-width: 1000px)" srcset="tablet.jpg" />
  <img src="desktop.jpg" alt="Tavsif" />
</picture>
\`\`\`

Farqi: \`srcset\` — **bir xil rasm**, turli o'lchamda. \`picture\` — **butunlay boshqa rasm** (masalan mobilda kadrlangan versiya).

---

## 🥉 Bronze Topshiriq

Portfolio saytingizdagi barcha rasmlarga \`object-fit: cover\` va \`aspect-ratio\` bering. Cho'zilgan rasm qolmasin.

---

## 🥈 Silver Topshiriq

- Barcha rasmlarga \`loading="lazy"\` (hero'dan tashqari)
- HTML'da \`width\` va \`height\` attributlari
- Portret suratlarga \`object-position: top\`

---

## 🥇 Gold Topshiriq — galereya

\`\`\`demo h=360 "Gold — natija namunasi"
<style>
  body { font-family: sans-serif; }

  .galereya {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 12px;
  }

  .galereya-item {
    aspect-ratio: 1;
    overflow: hidden;
    border-radius: 12px;
    cursor: pointer;
  }

  .galereya-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.4s ease;
  }

  .galereya-item:hover img { transform: scale(1.1); }
</style>

<div class="galereya">
  <div class="galereya-item"><img src="https://picsum.photos/id/1015/300/400" alt="" loading="lazy" /></div>
  <div class="galereya-item"><img src="https://picsum.photos/id/1016/500/300" alt="" loading="lazy" /></div>
  <div class="galereya-item"><img src="https://picsum.photos/id/1018/300/300" alt="" loading="lazy" /></div>
  <div class="galereya-item"><img src="https://picsum.photos/id/1024/400/250" alt="" loading="lazy" /></div>
  <div class="galereya-item"><img src="https://picsum.photos/id/1025/250/400" alt="" loading="lazy" /></div>
  <div class="galereya-item"><img src="https://picsum.photos/id/1039/600/300" alt="" loading="lazy" /></div>
</div>
\`\`\`

Diqqat qiling: rasmlarning **asl o'lchamlari har xil** (300×400, 500×300, 250×400...), lekin galereyada hammasi bir xil kvadrat. Buni \`aspect-ratio: 1\` va \`object-fit: cover\` qildi.

---

## ✅ Dars Xulosa

- \`object-fit: cover\` — eng ko'p ishlatiladigan, cho'zilishni oldini oladi
- \`object-position: top\` — portret suratlarda yuz kesilmasligi uchun
- \`aspect-ratio\` — nisbatni saqlash, balandlikni hisoblash shart emas
- \`loading="lazy"\` — sahifani tezlashtiradi (hero'ga qo'ymang)
- HTML'da \`width\`/\`height\` — sahifa sakramasligi uchun
- \`srcset\` — bir rasm turli o'lchamda, \`picture\` — boshqa rasm

> 🚀 **Keyingi dars:** CSS Table va ma'lumotlar jadvallari!
`,
    teacher: `
## 💡 O'qituvchi uchun

- Birinchi demo — bu darsning butun mazmuni. \`fill\` variantidagi cho'zilgan rasmni ko'rsating va so'rang: "buni oldin ko'rganmisiz?" Deyarli hamma bola o'z loyihasida shu xatoni qilgan bo'ladi.
- \`object-position: top\` ni **odam surati** bilan ko'rsating. \`center\` da boshi kesilib qolganini ko'rgan bola buni bir umr eslaydi.
- \`width\`/\`height\` va CLS haqida: sekin internetni taqlid qiling (DevTools → Network → Slow 3G) va sahifani yangilang. Rasmlar yuklanganda matn sakraganini ko'rsating. Keyin \`width\`/\`height\` qo'shib qayta ko'rsating.
- \`srcset\` va \`picture\` — nazariy qism. Bolalar hozircha bir nechta o'lchamdagi rasm tayyorlay olmaydi. Buni **tanishtirish** darajasida o'ting, topshiriqqa kiritmang.

## ⚠️ Ko'p uchraydigan xatolar

- **\`object-fit\` ishlamayapti** — rasmda \`width\` va \`height\` berilmagan. \`object-fit\` faqat o'lchami belgilangan rasmda ishlaydi.
- **\`object-fit\` konteynerga berilgan** — u \`img\` ning o'ziga beriladi, o'rab turgan \`div\` ga emas.
- **Rasm konteynerdan chiqib ketgan** — konteynerda \`overflow: hidden\` yo'q.
- **Hero rasmga \`lazy\` qo'yilgan** — sayt sekin ochilayotgandek tuyuladi. Bu keng tarqalgan "optimizatsiya" xatosi.
- **\`aspect-ratio\` bilan birga \`height\` berilgan** — ikkalasi qarama-qarshi, \`height\` yutadi va nisbat buziladi.

## 📊 Daraja belgilash

- **Bronze** — cho'zilgan rasm qolmagan, cover va aspect-ratio ishlatilgan
- **Silver** — lazy loading to'g'ri (hero'dan tashqari), width/height bor
- **Gold** — galereya turli o'lchamli rasmlarni bir xil kvadratda ko'rsatadi

> Tekshirishning tez usuli: sahifani oching va rasmlarga qarang. Odam yoki hayvon "semirgan" bo'lsa — \`object-fit\` yo'q.
`,
  },

  // ═══════════════════════════════════════════════════════════
  'junior.m1.l22': {
    goal: "HTML table elementi, semantik jadval va CSS bilan professional ko'rinish.",
    student: `
## 📋 Jadval qachon kerak?

Jadval — **ma'lumotlar** uchun: baholar ro'yxati, narxlar, statistika, jadval-dastur.

> ⚠️ Jadval **sahifa tuzilmasi** uchun ishlatilmaydi. 2000-yillarda saytlar \`<table>\` bilan quriladigan edi — bu davr o'tdi. Tuzilma uchun Flexbox va Grid bor.

---

## 🏗 Semantik jadval tuzilmasi

\`\`\`html
<table>
  <thead>                          <!-- sarlavha qatori -->
    <tr>
      <th scope="col">#</th>
      <th scope="col">Ism</th>
      <th scope="col">Ball</th>
    </tr>
  </thead>

  <tbody>                          <!-- asosiy ma'lumot -->
    <tr>
      <td>1</td>
      <td>Aziz Karimov</td>
      <td>92</td>
    </tr>
  </tbody>

  <tfoot>                          <!-- yakuniy qator -->
    <tr>
      <td colspan="2">O'rtacha</td>
      <td>85</td>
    </tr>
  </tfoot>
</table>
\`\`\`

Uchta muhim narsa:

- \`<th>\` — sarlavha katagi (\`<td>\` emas). Ekran o'quvchi dasturlar buni "ustun nomi" deb tushunadi
- \`scope="col"\` — bu sarlavha **ustunga** tegishli (\`scope="row"\` esa qatorga)
- \`colspan="2"\` — katak ikkita ustunni egallaydi

---

## 🎨 Xom jadval va bezatilgan jadval

\`\`\`demo h=400 "Farqni ko'ring"
<style>
  body { font-family: sans-serif; font-size: 13px; }
  h4 { margin: 0 0 8px; font-size: 12px; color: #6b7280; font-weight: 600; }
  .section { margin-bottom: 22px; }

  /* ── XOM jadval — hech qanday CSS yo'q ── */
  .xom table { border: 1px solid #999; }
  .xom td, .xom th { border: 1px solid #999; padding: 4px; }

  /* ── BEZATILGAN jadval ── */
  .yaxshi .jadval-wrapper {
    overflow-x: auto;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  }

  .yaxshi table {
    width: 100%;
    border-collapse: collapse;      /* chegaralar birlashadi */
    background: white;
  }

  .yaxshi thead {
    background: #f8f9fa;
    border-bottom: 2px solid #e9ecef;
  }

  .yaxshi th {
    padding: 12px 14px;
    text-align: left;
    font-weight: 600;
    color: #6c757d;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1px;
    white-space: nowrap;
  }

  .yaxshi td {
    padding: 12px 14px;
    border-bottom: 1px solid #f0f0f0;
    color: #333;
  }

  .yaxshi tbody tr:last-child td { border-bottom: none; }
  .yaxshi tbody tr:hover td { background: #f8f9ff; }

  .yaxshi tfoot td {
    font-weight: 600;
    background: #f8f9fa;
  }

  .badge {
    padding: 3px 10px; border-radius: 20px;
    font-size: 11px; font-weight: 600;
  }
  .badge-green  { background: #d4edda; color: #155724; }
  .badge-yellow { background: #fff3cd; color: #856404; }
  .badge-red    { background: #f8d7da; color: #721c24; }
</style>

<div class="section xom">
  <h4>❌ CSS'siz — o'qish qiyin</h4>
  <table>
    <thead>
      <tr><th>#</th><th>Ism</th><th>Ball</th><th>Holat</th></tr>
    </thead>
    <tbody>
      <tr><td>1</td><td>Aziz Karimov</td><td>92</td><td>A'lo</td></tr>
      <tr><td>2</td><td>Malika Umarova</td><td>78</td><td>Yaxshi</td></tr>
      <tr><td>3</td><td>Bobur Aliyev</td><td>54</td><td>Qoniqarsiz</td></tr>
    </tbody>
  </table>
</div>

<div class="section yaxshi">
  <h4>✅ CSS bilan — professional</h4>
  <div class="jadval-wrapper">
    <table>
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Ism</th>
          <th scope="col">Ball</th>
          <th scope="col">Holat</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td><td>Aziz Karimov</td><td>92</td>
          <td><span class="badge badge-green">A'lo</span></td>
        </tr>
        <tr>
          <td>2</td><td>Malika Umarova</td><td>78</td>
          <td><span class="badge badge-yellow">Yaxshi</span></td>
        </tr>
        <tr>
          <td>3</td><td>Bobur Aliyev</td><td>54</td>
          <td><span class="badge badge-red">Qoniqarsiz</span></td>
        </tr>
      </tbody>
      <tfoot>
        <tr><td colspan="2">O'rtacha</td><td>75</td><td></td></tr>
      </tfoot>
    </table>
  </div>
</div>
\`\`\`

HTML deyarli bir xil — farq faqat CSS'da. Qatorga kursorni olib keling, fon o'zgaradi.

---

## 🔑 border-collapse — eng muhim xususiyat

\`\`\`demo h=280 "separate va collapse"
<style>
  body { font-family: sans-serif; font-size: 13px; }
  .lbl { font-family: monospace; color: #4b5563; margin: 0 0 6px; }
  table { margin-bottom: 20px; }
  td, th { border: 2px solid #6366f1; padding: 8px 14px; }

  .t1 { border-collapse: separate; }   /* DEFAULT */
  .t2 { border-collapse: collapse; }
</style>

<p class="lbl">border-collapse: separate (default) — qo'sh chiziqlar</p>
<table class="t1">
  <tr><th>Ism</th><th>Ball</th></tr>
  <tr><td>Aziz</td><td>92</td></tr>
  <tr><td>Malika</td><td>78</td></tr>
</table>

<p class="lbl">border-collapse: collapse — bitta chiziq</p>
<table class="t2">
  <tr><th>Ism</th><th>Ball</th></tr>
  <tr><td>Aziz</td><td>92</td></tr>
  <tr><td>Malika</td><td>78</td></tr>
</table>
\`\`\`

Standart holatda har katakning **o'z chegarasi** bor, shuning uchun ular qo'shalanib ko'rinadi. \`collapse\` ularni birlashtiradi.

Jadval yozganingizda birinchi qatorda \`border-collapse: collapse\` yozing — buni odat qiling.

---

## 📱 Mobilda jadval

Jadval keng bo'ladi va telefonga sig'maydi. Eng oddiy yechim — gorizontal scroll:

\`\`\`css
.jadval-wrapper {
  overflow-x: auto;
}
\`\`\`

\`\`\`demo responsive h=280 "375px ni bosing — scroll paydo bo'ladi"
<style>
  body { font-family: sans-serif; font-size: 13px; margin: 0; padding: 12px; }

  .jadval-wrapper {
    overflow-x: auto;
    border-radius: 10px;
    border: 1px solid #e5e7eb;
  }

  table { width: 100%; border-collapse: collapse; min-width: 520px; }

  th, td { padding: 10px 14px; text-align: left; white-space: nowrap; }
  thead { background: #f8f9fa; }
  th { font-size: 11px; text-transform: uppercase; color: #6c757d; letter-spacing: 1px; }
  td { border-top: 1px solid #f0f0f0; }
</style>

<div class="jadval-wrapper">
  <table>
    <thead>
      <tr>
        <th>#</th><th>Ism familiya</th><th>Guruh</th><th>Ball</th><th>Davomat</th><th>Holat</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>1</td><td>Aziz Karimov</td><td>Frontend-12</td><td>92</td><td>96%</td><td>A'lo</td></tr>
      <tr><td>2</td><td>Malika Umarova</td><td>Frontend-12</td><td>78</td><td>88%</td><td>Yaxshi</td></tr>
      <tr><td>3</td><td>Bobur Aliyev</td><td>Frontend-14</td><td>54</td><td>71%</td><td>Qoniqarsiz</td></tr>
    </tbody>
  </table>
</div>
\`\`\`

\`min-width: 520px\` muhim — busiz jadval siqilib, matnlar bir-biriga yopishadi. Scroll — siqilishdan yaxshiroq.

---

## 🦓 Zebra qatorlar

\`\`\`demo h=260 "nth-child bilan navbatma-navbat fon"
<style>
  body { font-family: sans-serif; font-size: 13px; }
  table { width: 100%; border-collapse: collapse; }
  th, td { padding: 10px 14px; text-align: left; }
  thead { background: #1a1a2e; color: white; }
  th { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }

  /* Zebra — juft qatorlar boshqa fonda */
  tbody tr:nth-child(even) { background: #f8f9fa; }
  tbody tr:hover { background: #eef2ff; }
</style>

<table>
  <thead>
    <tr><th>#</th><th>Mahsulot</th><th>Narx</th></tr>
  </thead>
  <tbody>
    <tr><td>1</td><td>Noutbuk</td><td>8 500 000</td></tr>
    <tr><td>2</td><td>Sichqoncha</td><td>250 000</td></tr>
    <tr><td>3</td><td>Klaviatura</td><td>480 000</td></tr>
    <tr><td>4</td><td>Monitor</td><td>2 100 000</td></tr>
    <tr><td>5</td><td>Naushnik</td><td>760 000</td></tr>
  </tbody>
</table>
\`\`\`

Uzun jadvalda zebra qatorlar ko'zni adashtirmaydi — foydalanuvchi qatorni yo'qotmaydi. 10-darsda o'rgangan \`:nth-child(even)\` shu yerda ish beradi.

---

## 🥉 Bronze Topshiriq

5 qatorli jadval yarating: \`thead\`, \`tbody\`, \`border-collapse: collapse\` bilan.

---

## 🥈 Silver Topshiriq

- Sarlavha qatori boshqa fonda
- Zebra qatorlar (\`nth-child(even)\`)
- \`tr:hover\` da fon o'zgarsin
- \`tfoot\` bilan yakuniy qator (\`colspan\` ishlatilgan)

---

## 🥇 Gold Topshiriq

- Yuqoridagilar + holat ustunida rangli badge'lar
- Mobilda \`overflow-x: auto\` bilan gorizontal scroll
- Jadval o'ralgan konteynerda: radius va soya bilan
- \`scope\` attributlari to'g'ri qo'yilgan

---

## ✅ Dars Xulosa

- \`<thead>\`, \`<tbody>\`, \`<tfoot>\` — semantik tuzilma
- \`<th scope="col">\` — sarlavha katagi, accessibility uchun muhim
- \`border-collapse: collapse\` — birinchi navbatda yoziladigan qator
- \`overflow-x: auto\` + \`min-width\` — mobil yechim
- \`nth-child(even)\` — zebra qatorlar
- \`colspan\` — kataklarni birlashtirish
- Jadval — ma'lumot uchun, tuzilma uchun emas

> 🚀 **Keyingi dars:** 2-oy loyihasi — Shaxsiy Portfolio v2!
`,
    teacher: `
## 💡 O'qituvchi uchun

- Xom va bezatilgan jadval demosini yonma-yon ko'rsating. HTML deyarli bir xil ekanini ta'kidlang — bu bolalarga "CSS nima qila oladi" degan fikrni beradi.
- \`border-collapse\` — kichik narsa, lekin uni bilmagan bola jadvalni "chiroyli qila olmayapman" deb qiynaladi. Uni **birinchi** o'rgating, boshqa bezaklardan oldin.
- Jadval tuzilma uchun ishlatilmasligini eslating. Ba'zi bolalar internetdan eski darslik topib, \`<table>\` bilan sahifa qurishni boshlaydi.
- \`scope\` attributi ko'rinmaydigan narsa. Uni \`alt\` bilan taqqoslang: "ko'rinmaydi, lekin ko'zi ojiz odam uchun bu — jadvalni tushunish kaliti".

## ⚠️ Ko'p uchraydigan xatolar

- **\`border-collapse\` yo'q** — chegaralar qo'shalanib ko'rinadi, bola "nega xunuk?" deb tushunmaydi.
- **Sarlavhaga \`<td>\` ishlatilgan** — \`<th>\` bo'lishi kerak. Ko'rinishda farq bor (qalin, markazda), lekin asosiysi — semantika.
- **\`<tr>\` bevosita \`<table>\` ichida** — ishlaydi (brauzer \`tbody\` ni o'zi qo'shadi), lekin yozib qo'yish to'g'riroq.
- **Mobilda jadval siqilgan** — \`min-width\` yo'q. Matnlar bir-biriga yopishadi.
- **\`white-space: nowrap\` hamma katakka berilgan** — uzun matnli ustunlar juda kengayib ketadi. Faqat qisqa ustunlarga bering.
- **Jadvalga \`display: flex\` berilgan** — jadval tuzilmasi butunlay buziladi. Bu chalkash xato, chunki xato xabari chiqmaydi.

## 📊 Daraja belgilash

- **Bronze** — semantik tuzilma to'g'ri, collapse ishlatilgan
- **Silver** — zebra, hover, tfoot bilan colspan
- **Gold** — badge'lar, mobil scroll, konteyner bezagi, scope

> Gold'ni tekshirish: brauzer oynasini 375px ga kichraytiring. Jadval siqilib ketsa yoki sahifadan chiqib ketsa — bajarilmagan.
`,
  },

  // ═══════════════════════════════════════════════════════════
  'junior.m1.l23': {
    goal: "1-oydagi portfolioga 2-oyda o'rganilgan Grid, Position, animatsiya, media query va gradientni qo'shish.",
    student: `
## 🎯 Nima qo'shamiz?

Bu — yangi loyiha emas. 11-darsda yaratgan portfoliongizni **ochasiz va yaxshilaysiz**.

| # | Qo'shiladigan narsa | Qaysi darsdan |
| --- | --- | --- |
| 1 | Sticky navigatsiya | 13-dars |
| 2 | CSS Grid bilan loyihalar | 14-dars |
| 3 | Responsive + hamburger | 15-dars |
| 4 | \`::after\` bilan bezaklar | 16-dars |
| 5 | Dark mode (CSS Variables) | 17-dars |
| 6 | Yuklanish animatsiyasi | 18-dars |
| 7 | Gradient hero fon | 20-dars |
| 8 | \`object-fit\` bilan rasmlar | 21-dars |

> 💡 Bu ro'yxat — 2-oyning butun mazmuni. Agar biror punktni qanday qilishni eslay olmasangiz, o'sha darsga qaytib qarang. Bu normal.

---

## 🌈 Hero — gradient va animatsiya

\`\`\`demo h=380 "Yangilangan hero"
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: sans-serif; }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .hero {
    background: linear-gradient(135deg, #0f0f2d 0%, #1a1a4e 50%, #0d1f3c 100%);
    min-height: 340px;
    display: flex;
    align-items: center;
    padding: 30px;
    position: relative;
    overflow: hidden;
    color: white;
  }

  /* Yumshoq rangli dog'lar — chuqurlik beradi */
  .hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 30% 60%, rgba(99,102,241,0.30), transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(167,139,250,0.22), transparent 45%);
  }

  .hero-content { position: relative; z-index: 1; animation: fadeInUp 1s ease-out; }

  .greeting { font-size: 13px; opacity: 0.7; display: block; margin-bottom: 6px; }

  .hero-name {
    font-size: 38px; line-height: 1.05; letter-spacing: -1px; margin-bottom: 10px;
    background: linear-gradient(135deg, #ffffff, #a5b4fc);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .hero-role { color: #a5b4fc; font-weight: 600; margin-bottom: 20px; font-size: 15px; }

  .btn {
    display: inline-block; padding: 11px 24px; border-radius: 8px;
    text-decoration: none; font-weight: 600; font-size: 14px;
    background: #6366f1; color: white;
    transition: transform 0.25s, box-shadow 0.25s;
  }
  .btn:hover { transform: translateY(-2px); box-shadow: 0 10px 24px rgba(99,102,241,0.45); }
</style>

<section class="hero">
  <div class="hero-content">
    <span class="greeting">👋 Salom! Men —</span>
    <h1 class="hero-name">Ismingiz<br />Familiyangiz</h1>
    <p class="hero-role">Frontend Developer</p>
    <a href="#" class="btn">Loyihalarimni ko'rish</a>
  </div>
</section>
\`\`\`

Uchta narsa birlashdi: **gradient fon** (20-dars), **\`::before\` bilan rangli dog'lar** (16-dars) va **\`fadeInUp\` animatsiyasi** (18-dars).

\`z-index: 1\` muhim — busiz \`::before\` matn ustiga chiqib qoladi.

---

## 📸 Loyihalar — Grid bilan

\`\`\`demo h=380 "Birinchi karta 2 ustun egallaydi"
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: sans-serif; font-size: 13px; }

  .loyihalar-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 14px;
  }

  .loyiha-karta {
    border-radius: 14px;
    overflow: hidden;
    background: white;
    border: 1px solid #e5e7eb;
    box-shadow: 0 2px 10px rgba(0,0,0,0.06);
    transition: transform 0.3s, box-shadow 0.3s;
  }
  .loyiha-karta:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 32px rgba(0,0,0,0.14);
  }

  .rasm { aspect-ratio: 16 / 10; overflow: hidden; }
  .rasm img { width: 100%; height: 100%; object-fit: cover; display: block; }

  .info { padding: 12px; }
  .info h3 { font-size: 14px; margin-bottom: 4px; }
  .info p { color: #6b7280; font-size: 12px; }

  /* Birinchi karta — ikki ustun */
  .loyiha-karta:first-child { grid-column: span 2; }

  @media (max-width: 420px) {
    .loyiha-karta:first-child { grid-column: span 1; }
  }
</style>

<div class="loyihalar-grid">
  <article class="loyiha-karta">
    <div class="rasm"><img src="https://picsum.photos/id/180/500/300" alt="" /></div>
    <div class="info"><h3>Asosiy loyiha</h3><p>Ikki ustunni egallaydi</p></div>
  </article>
  <article class="loyiha-karta">
    <div class="rasm"><img src="https://picsum.photos/id/160/400/260" alt="" /></div>
    <div class="info"><h3>Instagram Profile</h3><p>Flexbox</p></div>
  </article>
  <article class="loyiha-karta">
    <div class="rasm"><img src="https://picsum.photos/id/119/400/260" alt="" /></div>
    <div class="info"><h3>Mening Qahramonim</h3><p>HTML</p></div>
  </article>
  <article class="loyiha-karta">
    <div class="rasm"><img src="https://picsum.photos/id/201/400/260" alt="" /></div>
    <div class="info"><h3>Restoran sahifasi</h3><p>Grid</p></div>
  </article>
</div>
\`\`\`

\`grid-column: span 2\` bilan bitta kartani ajratib ko'rsatish — portfolioda eng muhim loyihangizni birinchi o'ringa qo'yish usuli.

Mobilda esa media query uni bitta ustunga qaytaradi, aks holda kichkina ekranda g'alati ko'rinadi.

---

## ✅ 2-oy checklist

Portfolioingizda quyidagilar bo'lishi kerak:

- CSS Variables bilan dark/light rejim
- Sticky navbar (\`position: sticky\` + \`z-index\`)
- Hero'da gradient fon
- CSS Grid bilan loyihalar bo'limi
- Responsive hamburger menyu
- Yuklanish animatsiyasi yoki spinner
- \`@keyframes\` bilan kamida bitta animatsiya
- \`::before\` yoki \`::after\` ishlatilgan
- Rasmlarda \`object-fit: cover\`
- Mobilda ham chiroyli ko'rinadi, gorizontal scroll yo'q

---

## 🧪 Topshirishdan oldin

1. **DevTools → Device Toolbar** (Ctrl+Shift+M) — iPhone SE va iPad'da tekshiring
2. **Lighthouse** ishga tushiring (keyingi oyda batafsil o'rganamiz) — Performance va Accessibility ballariga qarang
3. Barcha havolalar ishlaydimi?
4. Dark rejimda matn o'qiladimi? (ba'zan kulrang matn qora fonda yo'qoladi)
5. Kodda tashlab ketilgan izohlar yoki ishlatilmagan CSS qolmadimi?

---

## 🥉🥈🥇 Baholash

- **Bronze** — checklistdan kamida 5 tasi bajarilgan, sayt buzilmagan
- **Silver** — 8 tasi bajarilgan, mobilda toza ko'rinadi
- **Gold** — hammasi bajarilgan, kod tartibli va izohlangan, dark rejim to'liq ishlaydi

> 🚀 **Keyingi dars:** Mahsulotlar katalogi — 2-oyning yakuniy amaliyoti!
`,
    teacher: `
## 💡 O'qituvchi uchun

- Bu — **yangi mavzu emas**, mustahkamlash darsi. Yangi narsa o'rgatmang. Maqsad: bola 2-oyda o'rganganini **o'z loyihasiga** qo'llay olsinmi?
- Checklist bilan ishlashni o'rgating. Bolalar odatda "hammasini qildim" deydi, lekin tekshirmaydi. Checklistni chop etib bering yoki doskaga yozing.
- Vaqt yetmaydi. 10 ta punktni bir darsda qo'shib bo'lmaydi. Darsda 2-3 tasini birga qiling (eng qiyinlarini: dark mode va hamburger), qolgani uy vazifasi.
- Dark rejimda **matn o'qilmay qolishi** — eng ko'p uchraydigan muammo. Bolalar fonni qora qiladi, lekin kulrang matnni unutadi. Buni alohida tekshiring.

## ⚠️ Ko'p uchraydigan muammolar

- **\`::before\` matn ustiga chiqib qolgan** — \`.hero-content\` ga \`position: relative; z-index: 1\` berilmagan.
- **Gradient matn dark rejimda yo'qolgan** — \`-webkit-text-fill-color: transparent\` va yangi fon rangi mos kelmagan.
- **Sticky navbar dark rejimda shaffof** — fon rangi o'zgaruvchidan olinmagan, qattiq yozilgan.
- **\`grid-column: span 2\` mobilda ham qolgan** — media query yozilmagan, kartochka ekrandan chiqib ketgan.
- **Loyihalar rasmlari turli balandlikda** — \`aspect-ratio\` yo'q, grid tartibsiz ko'rinadi.

## 📊 Baholash bo'yicha maslahat

Bu darsda **kod tozaligini** alohida baholang. 2-oy oxirida CSS fayli 500+ qatorga yetadi. Agar u izohsiz va tartibsiz bo'lsa — 3-oyda bola o'z kodini o'zi tushunmay qoladi.

Talab qiling: CSS bo'limlarga ajratilgan bo'lsin (\`/* ===== HEADER ===== */\` kabi), o'zgaruvchilar tepada bo'lsin.
`,
  },

  // ═══════════════════════════════════════════════════════════
  'junior.m1.l24': {
    goal: "Grid, Position, hover, animatsiya va formani birlashtirib do'kon katalogi yaratish.",
    student: `
## 🎯 Loyiha

Do'kon katalogi: mahsulotlar to'ri, hover'da "Savatga" tugmasi, narx belgisi, kategoriya filtri.

> ⚠️ **Muhim eslatma:** haqiqiy do'konda qidiruv va savat hisoblagichi **JavaScript** bilan qilinadi. JavaScript esa bu dasturda **34-darsdan** boshlanadi.
>
> Shuning uchun bu darsda:
> - **Filtr** — CSS bilan qilamiz (radio tugmalar orqali, quyida ko'rsatilgan)
> - **Qidiruv va savat** — faqat ko'rinishini yasaymiz, ishlashi 5-oyga qoladi
>
> Bu kamchilik emas. Katalogning **90% i** — bu CSS: to'r, kartochka, hover, responsive. JavaScript faqat oxirgi qatlamni qo'shadi.

---

## 🛍️ Mahsulot kartochkasi

\`\`\`demo h=400 "Kartochka — hover'da overlay va narx badge"
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', sans-serif; background: #f8f9fa; padding: 14px; font-size: 13px; }

  :root { --primary: #6366f1; --muted: #6b7280; }

  .mahsulotlar-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 16px;
  }

  .mahsulot-karta {
    background: white; border-radius: 14px;
    overflow: hidden; position: relative;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    transition: transform 0.3s, box-shadow 0.3s;
  }
  .mahsulot-karta:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 32px rgba(0,0,0,0.14);
  }

  .rasm-wrap { position: relative; overflow: hidden; aspect-ratio: 4 / 3; }
  .rasm-wrap img {
    width: 100%; height: 100%; object-fit: cover;
    display: block; transition: transform 0.4s;
  }
  .mahsulot-karta:hover .rasm-wrap img { transform: scale(1.08); }

  /* Narx belgisi — position: absolute */
  .narx-badge {
    position: absolute; top: 10px; right: 10px;
    background: var(--primary); color: white;
    padding: 4px 10px; border-radius: 20px;
    font-size: 11px; font-weight: 700;
    z-index: 2;
  }

  /* Overlay — hover'da chiqadi */
  .overlay {
    position: absolute; inset: 0;
    background: rgba(0,0,0,0.5);
    display: flex; align-items: center; justify-content: center;
    opacity: 0; transition: opacity 0.3s;
  }
  .mahsulot-karta:hover .overlay { opacity: 1; }

  .overlay button {
    background: white; color: var(--primary); border: none;
    padding: 8px 18px; border-radius: 24px;
    font-weight: 700; cursor: pointer; font-size: 12px;
    transition: transform 0.2s;
  }
  .overlay button:hover { transform: scale(1.06); }

  .info { padding: 12px; }
  .nomi { font-weight: 600; margin-bottom: 3px; }
  .tasnif { color: var(--muted); font-size: 11px; }
</style>

<div class="mahsulotlar-grid">
  <div class="mahsulot-karta">
    <div class="rasm-wrap">
      <img src="https://picsum.photos/id/20/400/300" alt="" loading="lazy" />
      <div class="narx-badge">14 990 000</div>
      <div class="overlay"><button>🛒 Savatga</button></div>
    </div>
    <div class="info"><p class="nomi">iPhone 15 Pro</p><p class="tasnif">telefon</p></div>
  </div>

  <div class="mahsulot-karta">
    <div class="rasm-wrap">
      <img src="https://picsum.photos/id/21/400/300" alt="" loading="lazy" />
      <div class="narx-badge">22 490 000</div>
      <div class="overlay"><button>🛒 Savatga</button></div>
    </div>
    <div class="info"><p class="nomi">MacBook Air M2</p><p class="tasnif">noutbuk</p></div>
  </div>

  <div class="mahsulot-karta">
    <div class="rasm-wrap">
      <img src="https://picsum.photos/id/22/400/300" alt="" loading="lazy" />
      <div class="narx-badge">3 490 000</div>
      <div class="overlay"><button>🛒 Savatga</button></div>
    </div>
    <div class="info"><p class="nomi">AirPods Pro</p><p class="tasnif">aksessuar</p></div>
  </div>
</div>
\`\`\`

Bitta kartochkada **beshta dars** birlashdi: Grid (14), \`position: absolute\` (13), hover overlay (16), \`object-fit\` (21), transition (10).

---

## 🔘 Filtr — JavaScript'siz

Bu — darsning eng qiziq qismi. Radio tugmalar va \`:checked\` selektori bilan filtr **CSS'da** ishlaydi:

\`\`\`demo h=420 "Filtr tugmalarini bosing — JS yo'q"
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', sans-serif; background: #f8f9fa; padding: 14px; font-size: 13px; }

  /* Radio tugmalar yashirin */
  .filtr-input { display: none; }

  .filtrlar { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }

  .filtrlar label {
    padding: 7px 16px; border: 2px solid #e5e7eb;
    border-radius: 20px; cursor: pointer; background: white;
    font-size: 12px; font-weight: 500; transition: all 0.2s;
  }
  .filtrlar label:hover { border-color: #6366f1; }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 12px;
  }

  .karta {
    background: white; border-radius: 12px; overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  }
  .karta img { width: 100%; aspect-ratio: 4/3; object-fit: cover; display: block; }
  .karta .nomi { padding: 10px; font-weight: 600; font-size: 12px; }

  /* ── SEHR SHU YERDA ──────────────────────────────
     Qaysi radio belgilangan bo'lsa:
     1. uning label'i rangli bo'ladi
     2. mos kelmaydigan kartochkalar yashiriladi     */

  #f-all:checked    ~ .filtrlar label[for="f-all"],
  #f-tel:checked    ~ .filtrlar label[for="f-tel"],
  #f-note:checked   ~ .filtrlar label[for="f-note"],
  #f-aks:checked    ~ .filtrlar label[for="f-aks"] {
    background: #6366f1; color: white; border-color: #6366f1;
  }

  #f-tel:checked  ~ .grid .karta:not(.telefon)   { display: none; }
  #f-note:checked ~ .grid .karta:not(.noutbuk)   { display: none; }
  #f-aks:checked  ~ .grid .karta:not(.aksessuar) { display: none; }
</style>

<input type="radio" name="filtr" id="f-all"  class="filtr-input" checked />
<input type="radio" name="filtr" id="f-tel"  class="filtr-input" />
<input type="radio" name="filtr" id="f-note" class="filtr-input" />
<input type="radio" name="filtr" id="f-aks"  class="filtr-input" />

<div class="filtrlar">
  <label for="f-all">Barchasi</label>
  <label for="f-tel">Telefonlar</label>
  <label for="f-note">Noutbuklar</label>
  <label for="f-aks">Aksessuarlar</label>
</div>

<div class="grid">
  <div class="karta telefon"><img src="https://picsum.photos/id/20/300/220" alt="" /><p class="nomi">iPhone 15 Pro</p></div>
  <div class="karta noutbuk"><img src="https://picsum.photos/id/21/300/220" alt="" /><p class="nomi">MacBook Air</p></div>
  <div class="karta aksessuar"><img src="https://picsum.photos/id/22/300/220" alt="" /><p class="nomi">AirPods Pro</p></div>
  <div class="karta telefon"><img src="https://picsum.photos/id/23/300/220" alt="" /><p class="nomi">Samsung S24</p></div>
  <div class="karta noutbuk"><img src="https://picsum.photos/id/24/300/220" alt="" /><p class="nomi">Dell XPS 15</p></div>
  <div class="karta aksessuar"><img src="https://picsum.photos/id/25/300/220" alt="" /><p class="nomi">Sony WH-1000XM5</p></div>
</div>
\`\`\`

Ishlash prinsipi uch qadamda:

1. Har filtr uchun yashirin \`<input type="radio">\` — hammasi bitta \`name\` da, shuning uchun faqat bittasi belgilanadi
2. \`<label for="...">\` bosilganda mos radio belgilanadi
3. \`#f-tel:checked ~ .grid .karta:not(.telefon) { display: none; }\` — telefon **bo'lmagan** kartochkalarni yashiradi

\`~\` — umumiy qo'shni selektori. "Shu elementdan **keyin keladigan** qardosh elementlar" degani. Shuning uchun radio'lar HTML'da **eng tepada** turishi shart.

> 💡 Bu usulning cheklovi bor: kategoriyalar soni oldindan ma'lum bo'lishi kerak va har biri uchun alohida qoida yozasiz. JavaScript bilan bu bir necha qatorda hal bo'ladi. 5-oyda shu katalogni JS bilan qayta yozasiz va farqni ko'rasiz.

---

## 🦴 Yuklanish skeleti

\`\`\`demo h=300 "Ma'lumot kelguncha ko'rsatiladigan holat"
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: sans-serif; background: #f8f9fa; padding: 14px; }

  @keyframes shimmer { to { background-position: -200% center; } }

  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 12px; }

  .skeleton-karta {
    background: white; border-radius: 12px; overflow: hidden; padding-bottom: 10px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  }

  .sk {
    background: linear-gradient(90deg, #f0f0f0 25%, #e2e2e2 50%, #f0f0f0 75%);
    background-size: 200% auto;
    animation: shimmer 1.4s linear infinite;
  }

  .sk-rasm { aspect-ratio: 4/3; }
  .sk-matn { height: 11px; border-radius: 4px; margin: 10px 10px 0; }
  .sk-matn.qisqa { width: 55%; }
</style>

<div class="grid">
  <div class="skeleton-karta">
    <div class="sk sk-rasm"></div>
    <div class="sk sk-matn"></div>
    <div class="sk sk-matn qisqa"></div>
  </div>
  <div class="skeleton-karta">
    <div class="sk sk-rasm"></div>
    <div class="sk sk-matn"></div>
    <div class="sk sk-matn qisqa"></div>
  </div>
  <div class="skeleton-karta">
    <div class="sk sk-rasm"></div>
    <div class="sk sk-matn"></div>
    <div class="sk sk-matn qisqa"></div>
  </div>
</div>
\`\`\`

Skeletning shakli haqiqiy kartochkaga **o'xshashi** kerak — shunda kontent kelganda sakrash bo'lmaydi.

---

## 🧭 Header — sticky va qidiruv

\`\`\`demo h=260 "Header — qidiruv ko'rinishi"
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', sans-serif; background: #f8f9fa; margin: 0; }

  .header {
    background: white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    position: sticky; top: 0; z-index: 100;
    padding: 12px 16px;
    display: flex; align-items: center; gap: 14px;
  }

  .logo { font-size: 18px; font-weight: 800; color: #6366f1; white-space: nowrap; }

  .qidiruv { flex: 1; }
  .qidiruv input {
    width: 100%; padding: 9px 16px;
    border: 2px solid #e5e7eb; border-radius: 24px;
    font-size: 13px; outline: none; transition: border-color 0.2s;
  }
  .qidiruv input:focus { border-color: #6366f1; }

  .savat {
    font-size: 13px; white-space: nowrap; cursor: pointer;
    padding: 8px 14px; background: #6366f1; color: white; border-radius: 20px;
  }

  .content { padding: 16px; color: #6b7280; font-size: 13px; }
</style>

<header class="header">
  <div class="logo">TechShop</div>
  <div class="qidiruv"><input type="search" placeholder="Mahsulot qidirish..." /></div>
  <div class="savat">🛒 0</div>
</header>

<div class="content">
  <p>Qidiruv maydoniga bosing — chegara rangi o'zgaradi.</p>
  <p style="margin-top:10px">Qidiruvning <b>ishlashi</b> uchun JavaScript kerak. Hozircha ko'rinishi tayyor.</p>
</div>
\`\`\`

---

## ✅ Baholash

**🥉 Bronze:**

- Grid bilan mahsulotlar to'ri
- Kartochkada rasm, nom, narx
- \`object-fit: cover\` ishlatilgan

**🥈 Silver:**

- Hover'da overlay va "Savatga" tugmasi
- Narx belgisi \`position: absolute\` bilan
- Sticky header
- Responsive: 1 → 2 → 3 → 4 ustun

**🥇 Gold:**

- CSS filtr ishlaydi (radio + \`:checked\`)
- Yuklanish skeleti
- Kartochka hover'da rasm kattalashadi
- Mobilda toza ko'rinadi

> 🚀 **Keyingi dars:** IntersectionObserver va scroll animatsiyalari — 3-oy boshlanadi!
`,
    teacher: `
## ⚠️ Bu darsda dastur bilan jiddiy nomuvofiqlik bor

Asl Notion sahifasida bu loyiha **to'liq JavaScript'ga** qurilgan: mahsulotlar massivi, \`render()\` funksiyasi, \`addEventListener\`, \`innerHTML\`, filtr va qidiruv mantiqi.

JavaScript esa bu dasturda **34-darsdan** boshlanadi — ya'ni 10 dars keyin. Bu — 1-Modulda uchragan nomuvofiqliklarning **eng kattasi**, chunki bu yerda JS lavha emas, loyihaning yuragi.

**Qanday qayta tuzildi:**

| Qism | Yechim |
| --- | --- |
| Mahsulotlar to'ri | CSS Grid — o'zgarishsiz |
| Kartochka, hover, badge | CSS — o'zgarishsiz |
| **Filtr** | Radio + \`:checked\` + \`~\` bilan **CSS'da** ishlaydi |
| **Qidiruv** | Faqat ko'rinishi. Ishlashi 5-oyga |
| **Savat hisoblagichi** | Faqat ko'rinishi. Ishlashi 5-oyga |

Bu — kamchilik emas, **to'g'ri ketma-ketlik**. Bolalar avval tayyor ko'rinishni quradi, keyin unga jon kiritadi. Aksincha qilib bo'lmaydi.

**Tavsiya:** 5-oyda (DOM darslari) shu katalogni qayta oching va JavaScript bilan jonlantiring. Bola o'z eski loyihasini yaxshilashi — juda kuchli o'rganish tajribasi.

---

## 💡 O'qituvchi uchun

- CSS filtr (\`:checked\` + \`~\`) — bolalarga "sehr" bo'lib tuyuladi. Uni bosqichma-bosqich ko'rsating: avval radio'ni ko'rinadigan qoldiring, keyin \`display: none\` qiling.
- \`~\` selektorini tushuntirishda tartib muhimligini ta'kidlang: radio'lar HTML'da **birinchi** bo'lishi shart. Ularni pastga ko'chirib ko'rsating — filtr ishlamay qoladi.
- Skeleton yuklanish — bolalar buni ko'p saytlarda ko'rgan, lekin nima ekanini bilmaydi. "YouTube ochilganda kulrang to'rtburchaklar" deb tushuntiring, darhol tanishadi.
- Bu — 2-oyning yakuniy loyihasi. Bir darsda tugamaydi, uy vazifasi sifatida davom etadi.

## ⚠️ Ko'p uchraydigan xatolar

- **CSS filtr ishlamayapti** — radio'lar \`.grid\` dan **keyin** turibdi. \`~\` faqat keyingi qardoshlarni ko'radi.
- **Barcha filtrlar bir vaqtda tanlanmoqda** — radio'larda \`name\` bir xil emas.
- **Overlay narx belgisini yopib qo'ygan** — \`.narx-badge\` ga \`z-index\` berilmagan.
- **Kartochkalar turli balandlikda** — rasmda \`aspect-ratio\` yo'q.
- **Sticky header ishlamayapti** — \`top: 0\` yozilmagan (13-darsdagi bir xil xato).
- **Mobilda gorizontal scroll** — grid'da \`minmax\` ning minimumi ekran kengligidan katta.

## 📊 Daraja belgilash

- **Bronze** — grid va kartochkalar to'g'ri, rasmlar cho'zilmagan
- **Silver** — hover, badge, sticky, responsive ishlaydi
- **Gold** — CSS filtr ishlaydi va bola uni **tushuntira oladi**

> Gold'ni tekshirishda so'rang: "\`~\` belgisi nima qiladi?" va "radio'larni pastga ko'chirsak nima bo'ladi?"
`,
  },

  // ═══════════════════════════════════════════════════════════
  'junior.m1.l14': {
    goal: "display: grid bilan ikki o'lchamli (satr + ustun) tartib yaratish.",
    student: `
## 🤔 Flexbox va Grid — qaysi biri qachon?

\`\`\`text
Flexbox — BIR o'lchamli: yo satr, yo ustun
Grid    — IKKI o'lchamli: satr VA ustun bir vaqtda

Flexbox uchun:  navbar, tugmalar guruhi, karta ichidagi qatorlar
Grid uchun:     sahifa tartibi, rasm galereyasi, dashboard
\`\`\`

Ikkalasi raqib emas — bitta sahifada ikkalasi ham ishlatiladi. Odatda: **Grid** bilan sahifa skeletini quriladi, **Flexbox** bilan ichidagi mayda narsalar joylashtiriladi.

---

## 🔧 Asosiy sintaksis

\`\`\`demo h=340 "grid-template-columns — turli variantlar"
<style>
  body { font-size: 13px; }
  .g { display: grid; gap: 8px; margin-bottom: 14px; }
  .g div {
    background: #6366f1; color: white; padding: 14px 0;
    text-align: center; border-radius: 6px; font-size: 12px;
  }
  .lbl { font-family: monospace; font-size: 12px; color: #4b5563; margin: 0 0 4px; }

  .g1 { grid-template-columns: 100px 100px 100px; }
  .g2 { grid-template-columns: 1fr 1fr 1fr; }
  .g3 { grid-template-columns: 1fr 2fr 1fr; }
  .g4 { grid-template-columns: repeat(4, 1fr); }
</style>

<p class="lbl">100px 100px 100px — aniq o'lcham</p>
<div class="g g1"><div>1</div><div>2</div><div>3</div></div>

<p class="lbl">1fr 1fr 1fr — teng bo'linadi (fr = fraction, ulush)</p>
<div class="g g2"><div>1</div><div>2</div><div>3</div></div>

<p class="lbl">1fr 2fr 1fr — o'rtadagi 2 barobar keng</p>
<div class="g g3"><div>1</div><div>2fr</div><div>3</div></div>

<p class="lbl">repeat(4, 1fr) — qisqartma</p>
<div class="g g4"><div>1</div><div>2</div><div>3</div><div>4</div></div>
\`\`\`

\`fr\` — Grid'ning o'ziga xos birligi. "Bo'sh joyning ulushi" degani. \`1fr 2fr 1fr\` — jami 4 ulush, o'rtadagi 2/4 = 50% oladi.

---

## 📐 grid-template-areas — sahifani chizib qo'yish

Bu — Grid'ning eng chiroyli imkoniyati. Tartibni **matn bilan chizasiz**:

\`\`\`demo h=340 "Sahifa tartibi — areas bilan"
<style>
  body { margin: 0; font-size: 13px; }

  .page {
    display: grid;
    grid-template-areas:
      "header  header  header"
      "sidebar main    main"
      "footer  footer  footer";
    grid-template-columns: 130px 1fr 1fr;
    grid-template-rows: 50px 1fr 40px;
    height: 280px;
    gap: 8px;
  }

  .page > * {
    display: flex; align-items: center; justify-content: center;
    border-radius: 8px; color: white; font-weight: 600;
  }

  .h { grid-area: header;  background: #1a1a2e; }
  .s { grid-area: sidebar; background: #6366f1; }
  .m { grid-area: main;    background: #3b82f6; }
  .f { grid-area: footer;  background: #4b5563; }
</style>

<div class="page">
  <div class="h">header</div>
  <div class="s">sidebar</div>
  <div class="m">main</div>
  <div class="f">footer</div>
</div>
\`\`\`

CSS'dagi shu qismga qarang:

\`\`\`css
grid-template-areas:
  "header  header  header"
  "sidebar main    main"
  "footer  footer  footer";
\`\`\`

Bu — sahifaning **xaritasi**. Bir nom necha marta takrorlansa, o'sha element shuncha katakni egallaydi. Keyin har elementga \`grid-area: header\` deb nomini beriladi, xolos.

> 💡 Sahifa tartibini o'zgartirmoqchi bo'lsangiz — HTML'ga tegmasdan, faqat shu matnni qayta yozasiz.

---

## 🔁 Responsive grid — repeat va minmax

Bu — Grid'ning eng kuchli qatori:

\`\`\`css
grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
\`\`\`

Ma'nosi: *"Har bir ustun kamida 200px bo'lsin. Nechta sig'sa — shuncha ustun qil. Ortgan joyni teng bo'lib ber."*

\`\`\`demo h=320 "Oynani kichraytiring — ustunlar soni o'zgaradi"
<style>
  body { font-size: 13px; }
  .auto {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 10px;
  }
  .auto div {
    background: #10b981; color: white; padding: 20px 0;
    text-align: center; border-radius: 8px; font-weight: 600;
  }
</style>

<p style="color:#6b7280;margin:0 0 10px">
  Brauzer oynasini kichraytirib-kattalashtiring — media query yozmasdan ham moslashadi
</p>

<div class="auto">
  <div>1</div><div>2</div><div>3</div>
  <div>4</div><div>5</div><div>6</div>
</div>
\`\`\`

Diqqat: bu yerda **birorta ham media query yo'q**. Grid o'zi hisoblaydi.

---

## 📸 Rasm galereyasi

\`\`\`demo h=380 "Galereya — bittasi 2 ustun egallaydi"
<style>
  body { font-size: 13px; }
  .gallery {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 10px;
  }
  .gallery-item {
    border-radius: 10px;
    overflow: hidden;
    aspect-ratio: 4/3;         /* nisbatni saqlaydi */
  }
  .gallery-item img {
    width: 100%; height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.3s;
  }
  .gallery-item:hover img { transform: scale(1.08); }

  /* Bittasini kattaroq qilamiz */
  .featured { grid-column: span 2; }
</style>

<div class="gallery">
  <div class="gallery-item featured"><img src="https://picsum.photos/id/1015/400/300" alt="" /></div>
  <div class="gallery-item"><img src="https://picsum.photos/id/1016/300/300" alt="" /></div>
  <div class="gallery-item"><img src="https://picsum.photos/id/1018/300/300" alt="" /></div>
  <div class="gallery-item"><img src="https://picsum.photos/id/1024/300/300" alt="" /></div>
  <div class="gallery-item"><img src="https://picsum.photos/id/1025/300/300" alt="" /></div>
</div>
\`\`\`

Ikkita foydali narsa bor:

- \`aspect-ratio: 4/3\` — rasm qanday bo'lishidan qat'i nazar, katak nisbati saqlanadi
- \`grid-column: span 2\` — element ikkita ustunni egallaydi

---

## 🥉 Bronze Topshiriq

3 ta teng ustunli grid yarating, ichida 6 ta kartochka bo'lsin.

\`\`\`css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
\`\`\`

---

## 🥈 Silver Topshiriq

Responsive galereya: \`repeat(auto-fill, minmax(250px, 1fr))\` bilan. Oyna kichrayganda ustunlar soni **o'zi** kamaysin. Rasmlarga \`aspect-ratio\` va \`object-fit: cover\` bering.

---

## 🥇 Gold Topshiriq — Dashboard

\`grid-template-areas\` bilan to'liq boshqaruv paneli:

\`\`\`demo h=360 "Gold — dashboard"
<style>
  body { margin: 0; font-family: sans-serif; font-size: 12px; }

  .dashboard {
    display: grid;
    grid-template-areas:
      "header header header"
      "nav    main   aside"
      "footer footer footer";
    grid-template-columns: 56px 1fr 150px;
    grid-template-rows: 48px 1fr 38px;
    height: 300px;
    gap: 1px;
    background: #e5e7eb;
  }

  .db-header {
    grid-area: header; background: #1a1a2e; color: white;
    display: flex; align-items: center; padding: 0 16px; font-weight: 600;
  }
  .db-nav {
    grid-area: nav; background: white;
    display: flex; flex-direction: column; align-items: center;
    padding-top: 12px; gap: 14px; font-size: 18px;
  }
  .db-main { grid-area: main; background: #f8f9fa; padding: 16px; }
  .db-aside { grid-area: aside; background: white; padding: 12px; color: #6b7280; }
  .db-footer {
    grid-area: footer; background: #374151; color: white;
    display: flex; align-items: center; padding: 0 16px;
  }

  .cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
  .card {
    background: white; border-radius: 8px; padding: 10px;
    border: 1px solid #e5e7eb;
  }
  .card b { display: block; font-size: 18px; color: #1a1a2e; }
  .card span { color: #6b7280; font-size: 11px; }
</style>

<div class="dashboard">
  <div class="db-header">Boshqaruv paneli</div>
  <div class="db-nav"><span>🏠</span><span>📊</span><span>⚙️</span></div>
  <div class="db-main">
    <div class="cards">
      <div class="card"><b>142</b><span>O'quvchilar</span></div>
      <div class="card"><b>12</b><span>Guruhlar</span></div>
      <div class="card"><b>94%</b><span>Davomat</span></div>
    </div>
  </div>
  <div class="db-aside">Yon panel</div>
  <div class="db-footer">© 2026</div>
</div>
\`\`\`

Diqqat qiling: tashqi skelet — **Grid**, ichkaridagi kartochkalar ham **Grid**, navigatsiya esa **Flex**. Uchalasi bir sahifada, har biri o'z vazifasida.

---

## ✅ Dars Xulosa

- \`grid-template-columns: repeat(3, 1fr)\` — 3 teng ustun
- \`fr\` — bo'sh joyning ulushi
- \`repeat(auto-fill, minmax(250px, 1fr))\` — media query'siz responsive
- \`grid-template-areas\` — tartibni matn bilan chizish
- \`grid-column: span 2\` — bitta element ko'p ustun egallashi
- \`aspect-ratio\` — nisbatni saqlash
- \`gap\` — satr va ustunlar orasi

> 🚀 **Keyingi dars:** Responsive Design va Media Queries!
`,
    teacher: `
## 💡 O'qituvchi uchun

- **Chrome DevTools'ning Grid inspektorini albatta ko'rsating.** Elements panelida \`display: grid\` bo'lgan elementga bosilsa, yonida "grid" tugmasi chiqadi. Bosilsa — sahifada grid chiziqlari va katak raqamlari ko'rinadi. Bu darslikdagi har qanday chizmadan foydali.
- \`grid-template-areas\` ni doskada **chizib** tushuntiring. Uch qator matn — bu sahifaning xaritasi. Bolalar buni juda tez tushunadi, chunki u ko'zga ko'rinadi.
- \`repeat(auto-fill, minmax(...))\` — sehrli qator. Uni yodlatib qo'ying, tushuntirishni keyingi darsga qoldiring. Bolalar avval **ishlatib** ko'rsin, keyin sababini so'rasin.
- Grid va Flexbox raqobatchi emasligini ta'kidlang. Ba'zi bolalar "endi flexbox kerak emas ekan" deb o'ylaydi. Gold demosini ko'rsating — u yerda ikkalasi birga ishlaydi.

## ⚠️ Ko'p uchraydigan xatolar

- **\`display: grid\` bolaga berilgan, otaga emas** — Flexbox'dagi kabi, \`grid\` **konteynerga** yoziladi.
- **\`grid-template-areas\` da qatorlar teng emas** — har qatorda bir xil sonda nom bo'lishi shart. \`"header header"\` va \`"nav main aside"\` — bu ishlamaydi.
- **Area nomi tirnoq ichida yozilgan** — \`grid-area: "header"\` xato, \`grid-area: header\` to'g'ri.
- **\`gap\` o'rniga \`margin\` ishlatilgan** — chekkalarida ortiqcha joy qoladi.
- **Rasmlar cho'zilgan** — \`object-fit: cover\` yo'q.
- **Bolalar hamma joyda \`fr\` ishlatadi** — navbar balandligi kabi joylarda aniq \`px\` kerakligini eslating.

## 📊 Daraja belgilash

- **Bronze** — grid ishlaydi, 3 ustun, gap bor
- **Silver** — auto-fill/minmax ishlaydi, oyna kichrayganda ustunlar soni o'zgaradi
- **Gold** — areas bilan dashboard, Grid va Flex birga to'g'ri ishlatilgan

> Silver'ni tekshirishning eng tez yo'li — brauzer oynasini sudrab kichraytirish. Ustunlar o'zi kamaysa — bajarilgan.
`,
  },
};
