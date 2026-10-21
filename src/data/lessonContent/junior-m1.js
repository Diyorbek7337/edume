// Junior kursi — 1-Modul dars matnlari (Notion'dan ko'chirilgan)
//
// ⚠️ MUHIM QOIDA — IKKI MAYDON:
//   student — o'quvchi, ota-ona VA o'qituvchi ko'radi
//   teacher — FAQAT o'qituvchi/admin ko'radi
//
// Ajratish shu yerda, yozish paytida qilinadi. Dasturda "o'qituvchi
// qismini kesib tashlash" degan filtr YO'Q — chunki bunday filtr bir kun
// ishlamay qolsa, javoblar o'quvchiga chiqib ketadi. Ikki alohida maydon
// esa hech qachon adashmaydi.
//
// teacher maydoniga tushadigan narsalar:
//   • O'qituvchi uchun maslahatlar
//   • Baholash formasi va rubrika, badge ball chegaralari
//   • Dars jadvali (90 daqiqa taqsimoti)
//   • Topshiriq javoblari ("TO'G'RI versiyasi", test yechimlari)

export const JUNIOR_M1_CONTENT = {
  // ═══════════════════════════════════════════════════════════
  'junior.m1.l1': {
    goal: "Brauzer qanday ishlashini tushunish, VS Code o'rnatish va birinchi HTML sahifasini yaratish.",
    student: `
## 🌐 Internet qanday ishlaydi?

Siz brauzerga \`google.com\` yozganingizda nima bo'ladi?

1. **Brauzer** → DNS serverga so'rov yuboradi: "google.com ning IP manzili nima?"
2. **DNS** → \`142.250.185.46\` deb javob beradi
3. **Brauzer** → o'sha IP'dagi serverga HTTP so'rov yuboradi
4. **Server** → HTML, CSS, JS fayllarni qaytaradi
5. **Brauzer** → fayllarni o'qib, ekranda chiroyli sahifa ko'rsatadi

> 💡 **Xulosa:** Brauzer — HTML fayllarini o'qib, uni ekranda ko'rsatuvchi dastur. Biz HTML yozamiz, brauzer "tarjima" qiladi.

---

## 🛠 VS Code O'rnatish

**VS Code** — eng mashhur kod muharriri. Dunyodagi frontendchilarning 70%+ i ishlatadi.

1. code.visualstudio.com saytiga o'ting
2. **Download** tugmasini bosing (OS avtomatik aniqlanadi)
3. O'rnating va oching

**Kerakli kengaytmalar (Extensions):**

| Kengaytma | Nima qiladi |
| --- | --- |
| **Live Server** | Saytni real vaqtda brauzerda ko'rsatadi |
| **Prettier** | Kodingizni avtomatik formatlaydi |
| **Auto Rename Tag** | HTML teglarni juft o'zgartiradi |
| **HTML CSS Support** | CSS class nomlarini taklif qiladi |

---

## 📄 HTML nima?

**HTML** — HyperText Markup Language

- HTML veb-sahifalarni yaratish uchun **standart belgilash tili**
- HTML sahifaning **tuzilishini** tavsiflaydi
- HTML bir qator **elementlardan** iborat
- Elementlar brauzerga kontentni **qanday ko'rsatishni** aytadi

> ⚠️ **HTML — dasturlash tili emas!** U faqat kontentni belgilaydi (markup). Dasturlash keyinroq — JavaScript bilan.

---

## 🏗 HTML Hujjat Strukturasi

\`\`\`html
<!DOCTYPE html>
<html lang="uz">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>diyorbek.uz</title>
  </head>
  <body>
    <h1>Salom, Dunyo!</h1>
    <p>Bu mening birinchi veb-sahifam.</p>
  </body>
</html>
\`\`\`

**Har qatorni tushunaylik:**

| Qator | Ma'nosi |
| --- | --- |
| \`<!DOCTYPE html>\` | "Bu HTML5 hujjat" deb brauzerni ogohlantiradi |
| \`<html lang="uz">\` | Butun sahifani o'rab turuvchi asosiy teg |
| \`<head>\` | Ko'rinmaydigan ma'lumotlar: title, charset, CSS |
| \`<meta charset="UTF-8">\` | O'zbek harflari va emoji to'g'ri ko'rinadi |
| \`<meta name="viewport">\` | Mobil qurilmalarda sahifa to'g'ri ko'rinadi |
| \`<title>\` | Brauzer tabida ko'rinadigan sarlavha |
| \`<body>\` | Foydalanuvchi ko'radigan barcha kontent |

---

## 🏷 HTML Teglar qanday ishlaydi?

Ko'pchilik teglar **juft** bo'ladi — ochuvchi va yopuvchi:

\`\`\`html
<!-- Juft teglar -->
<h1>Bu sarlavha</h1>
<p>Bu paragraf</p>
<div>Bu blok</div>

<!-- Yolg'iz teglar (o'zini yopadi) -->
<img src="rasm.jpg" alt="Rasm tavsifi" />
<br />
<hr />
<input type="text" />
\`\`\`

> ❌ **Keng tarqalgan xato:** Tegni yopishni unutish!

---

## 📝 Sarlavhalar — h1 dan h6 gacha

O'ng tomonda har birining o'lchami qanday farq qilishini ko'ring. Matnlarni o'zgartirib ham ko'ring:

\`\`\`demo h=260 "Sarlavhalar o'lchami"
<h1>h1 — Eng katta sarlavha</h1>
<h2>h2 — Katta sarlavha</h2>
<h3>h3 — O'rta sarlavha</h3>
<h4>h4 — Kichik sarlavha</h4>
<h5>h5 — Juda kichik</h5>
<h6>h6 — Eng kichik sarlavha</h6>
\`\`\`

> 💡 **SEO qoidasi:** Har bir sahifada faqat **bitta** \`<h1>\` bo'lishi kerak. Bu Google uchun muhim — sahifaning asosiy mavzusini belgilaydi.

---

## 📝 Paragraflar va Matn Formatlash

\`\`\`demo h=280 "Matn teglari"
<p>Bu oddiy paragraf matni.</p>

<p>Bu <strong>muhim</strong> so'z va bu <em>kursiv</em> so'z.</p>

<p>
  <mark>belgilangan matn</mark> —
  <del>o'chirilgan matn</del> —
  <ins>qo'shilgan matn</ins> —
  <small>kichik matn</small>
</p>

<p>Formulalar: H<sub>2</sub>O va x<sup>2</sup> + y<sup>2</sup> = r<sup>2</sup></p>
\`\`\`

> 💡 \`strong\` va \`b\` ekranda bir xil ko'rinadi, lekin ma'nosi boshqa. \`strong\` — "bu muhim" degani, uni ekran o'quvchi dasturlar baland ovozda o'qiydi. \`b\` — faqat qalin qilish. Ko'zi ojiz odam saytingizni o'qiyotganda shu farq bilinadi.

---

## 💬 HTML Izohlar (Comments)

\`\`\`html
<!-- Bu izoh — brauzer ko'rsatmaydi, lekin kod o'quvchi ko'radi -->

<!-- TODO: Bu qismni keyinroq CSS bilan chiroyli qilish kerak -->
<p>Kontent</p>
\`\`\`

---

## 🔍 DevTools — Dasturchi Asboblari

Brauzerda **F12** (yoki \`Ctrl+Shift+I\`) bosing:

- **Elements** — HTML tuzilmasini ko'ring va o'zgartiring
- **Console** — JavaScript xatolarini ko'ring
- **Network** — Sahifa qanday resurslar yuklaganini ko'ring
- **Sources** — Sahifaning barcha fayllari

> 💡 DevTools'da HTML'ni o'zgartirish VAQTINCHALIK — sahifani yangilasangiz qaytadi. Bu sinab ko'rish uchun ajoyib!

---

## ⌨️ VS Code Foydali Qisqartmalar

| Qisqartma | Nima qiladi |
| --- | --- |
| \`!\` + \`Tab\` | HTML skeleton avtomatik yaratadi |
| \`Ctrl + /\` | Qatorni izohga aylantiradi |
| \`Alt + ↑/↓\` | Qatorni yuqori/pastga ko'chiradi |
| \`Ctrl + D\` | Xuddi shu so'zni ketma-ket tanlaydi |
| \`Ctrl + S\` | Saqlash (Live Server yangilaydi!) |
| \`Ctrl + Z\` | Orqaga qaytarish |

---

## 🥉 Bronze Topshiriq

O'z ismingiz bilan oddiy HTML sahifa yarating.

\`\`\`html
<!DOCTYPE html>
<html lang="uz">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mening Ismim</title>
  </head>

  <body>
    <h1>Ismingiz Familiyangiz</h1>
  </body>
</html>
\`\`\`

> ✅ **Tekshirish:** Live Server bilan brauzerda oching. Tab sarlavhasida ismingiz ko'rinishini tekshiring.

---

## 🧪 O'zingiz sinab ko'ring

Quyidagi kodni o'zgartiring — ismingizni yozing, yangi paragraf qo'shing, \`strong\` bilan biror so'zni qalin qiling. Natija o'ng tomonda darhol ko'rinadi:

\`\`\`demo h=240 "Mashq maydoni"
<h1>Sizning ismingiz</h1>

<h2>Men haqimda</h2>
<p>Men <strong>Toshkentda</strong> yashayman va <em>veb-dasturlash</em> o'rganmoqdaman.</p>

<h3>Qiziqishlarim</h3>
<p>Futbol, musiqa va kitob o'qish.</p>
\`\`\`

---

## 🥈 Silver Topshiriq

Sahifaga bo'limlar va matn formatlash qo'shing: \`h2\`, \`h3\`, \`p\`, \`strong\`, \`em\`.

Bo'limlar: "Men haqimda", "Mening qiziqishlarim", "Sevimli fanlarim".

---

## 🥇 Gold Topshiriq

To'liq tarjimai hol sahifasi yarating. Ishlatilishi shart:

- \`mark\` — muhim jumlani belgilash
- \`sub\` va \`sup\` — H<sub>2</sub>O va x<sup>2</sup> kabi
- HTML izohlar bilan kodni tushuntirish
- Kamida 3 ta bo'lim

---

## ✅ Dars Xulosa

- **DOCTYPE** — har doim birinchi qatorda
- **head** — ko'rinmaydigan ma'lumotlar (title, charset, viewport)
- **body** — foydalanuvchi ko'radigan hamma narsa
- **h1-h6** — sarlavhalar (h1 faqat bir marta!)
- **p** — paragraf
- **strong/em** — semantik, **b/i** — faqat ko'rinish
- **DevTools** — F12, har doim ochiq bo'lsin

> 🚀 **Keyingi dars:** Rasmlar, linklar va ro'yxatlar — sahifani jonlantirish vaqti!
`,
    teacher: `
## 💡 O'qituvchi uchun

- Birinchi darsda ta'rif ko'p bo'lmasin. Bola 20 daqiqadan keyin **o'z ismini** ekranda ko'rishi kerak — shu paytda qiziqish uyg'onadi.
- \`!\` + Tab qisqartmasini birinchi darsdayoq ko'rsating. Bu bolalarga "sehr" bo'lib tuyuladi va VS Code'ni yoqtirib qoladi.
- Teg yopishni unutish — eng ko'p uchraydigan xato. Ataylab xato qiling va brauzer nima ko'rsatishini birga ko'ring.

## ⏰ Vaqt taqsimoti (90 daqiqa)

| Vaqt | Faoliyat |
| --- | --- |
| 0:00 – 0:20 | Nazariya: internet, brauzer, HTML nima |
| 0:20 – 0:35 | VS Code o'rnatish, kengaytmalar |
| 0:35 – 1:20 | Amaliyot: Bronze → Silver → Gold |
| 1:20 – 1:30 | Yakun, uy vazifasi |

## ⚠️ Tekshirishda e'tibor bering

- \`<title>\` bo'sh qolganmi?
- \`lang="uz"\` yozilganmi?
- \`charset="UTF-8"\` yo'q bo'lsa o'zbek harflari buziladi — buni ko'rsating
- \`h1\` bittadan ko'pmi?
`,
  },

  // ═══════════════════════════════════════════════════════════
  'junior.m1.l2': {
    goal: "Rasmlar, havolalar va ro'yxatlar bilan ishlash — sahifani interaktiv qilish.",
    student: `
## 🖼️ Rasmlar — \`<img>\` tegi

\`\`\`demo h=260 "img — asosiy misol"
<img
  src="https://picsum.photos/id/1015/320/200"
  alt="Tog'lar orasidagi daryo"
  width="320"
/>
<p>Yuqoridagi <code>src</code> manzilini o'zgartiring — masalan id/1025 qiling.</p>
\`\`\`

**Attributlar:**

| Attribut | Kerakligi | Ma'nosi |
| --- | --- | --- |
| \`src\` | **Majburiy** | Rasm manzili (fayl yo'li yoki URL) |
| \`alt\` | **Majburiy** | Rasm yuklanmasa ko'rinadigan matn; ko'zi ojizlar uchun |
| \`width\` | Ixtiyoriy | Kenglik (px yoki %) |
| \`height\` | Ixtiyoriy | Balandlik |
| \`loading\` | Ixtiyoriy | \`lazy\` — pastga scroll qilganda yuklanadi |

### alt nima uchun kerak — o'zingiz ko'ring

\`\`\`demo h=200 "alt ishlaganda"
<p>Manzili buzilgan rasm:</p>
<img src="yoq-bunday-rasm.jpg" alt="Bu yerda tog' manzarasi bor edi" width="300" />
\`\`\`

Rasm yuklanmadi, lekin \`alt\` matni ko'rinib turibdi. Agar \`alt\` bo'lmaganida — bo'sh joy qolardi va foydalanuvchi nima yo'qolganini bilmasdi.

> ❌ **alt attributini qoldirish — keng tarqalgan xato.** Alt yo'q bo'lsa: ekran o'quvchi dasturlar sahifani tushuntirolmaydi, Google ham rasmni indekslay olmaydi.

---

## 📁 Fayl Yo'llari (Paths)

\`\`\`text
project/
├── index.html      →  images/photo.jpg
├── about.html
└── images/
    ├── photo.jpg
    └── logo.png
\`\`\`

\`\`\`html
<!-- NISBIY YO'L — eng yaxshi yondashuv -->
<img src="images/photo.jpg" alt="Rasm" />

<!-- Bir papka yuqoriga chiqish -->
<img src="../images/photo.jpg" alt="Rasm" />

<!-- MUTLAQ YO'L — faqat tashqi manbalar uchun -->
<img src="https://picsum.photos/400/300" alt="Tasodifiy rasm" />

<!-- XATO — kompyuterga xos yo'l, serverda ishlamaydi -->
<img src="C:/Users/John/Desktop/photo.jpg" alt="" />
\`\`\`

> ⚠️ Uchinchi variant sizning kompyuteringizda ishlaydi, lekin saytni internetga chiqarganingizda **hech kimda ishlamaydi**. Chunki boshqa odamda \`C:/Users/John\` degan papka yo'q.

---

## 🌆 Rasm Formatlari

| Format | Qachon ishlatish |
| --- | --- |
| **JPEG / JPG** | Fotosuratlar — kichik hajm |
| **PNG** | Shaffof fon kerak bo'lganda |
| **WebP** | Hamma holatda eng yaxshi (JPEG+PNG o'rniga) |
| **SVG** | Ikonlar va logolar — har o'lchamda aniq |
| **GIF** | Animatsiyalar (lekin WebP yaxshiroq) |

---

## 🔗 Havolalar — \`<a>\` tegi

\`\`\`demo h=300 "Havola turlari"
<style>
  a { color: #2563eb; }
  p { margin: 8px 0; }
</style>

<p><a href="https://google.com" target="_blank" rel="noopener noreferrer">Tashqi havola (yangi tab)</a></p>
<p><a href="#contact">Sahifa ichida — pastdagi bo'limga o'tish</a></p>
<p><a href="mailto:info@example.com">Email yuborish</a></p>
<p><a href="tel:+998901234567">+998 90 123 45 67</a></p>

<div style="height: 90px"></div>

<section id="contact">
  <h2>Bog'lanish</h2>
  <p>Yuqoridagi ikkinchi havola shu yerga olib keldi.</p>
</section>
\`\`\`

**target attributi:**

| Qiymat | Ma'nosi |
| --- | --- |
| \`_blank\` | Yangi tab/oynada ochadi |
| \`_self\` | Hozirgi tabda ochadi (default) |

> ⚠️ \`target="_blank"\` ishlatganda **har doim** \`rel="noopener noreferrer"\` qo'shing. Bu yangi ochilgan sahifa eski tabni boshqara olmasligini ta'minlaydi — xavfsizlik qoidasi.

---

## 📷 Rasm + Havola va figure

\`\`\`demo h=280 "figure va figcaption"
<style>
  figure { margin: 0; display: inline-block; }
  figcaption { font-size: 13px; color: #6b7280; margin-top: 6px; }
  img { border-radius: 10px; display: block; }
</style>

<figure>
  <a href="https://example.com" target="_blank" rel="noopener noreferrer">
    <img src="https://picsum.photos/id/1018/300/180" alt="Tog' cho'qqisi" />
  </a>
  <figcaption>Tog' manzarasi. © 2026 — rasmni bosib ko'ring</figcaption>
</figure>
\`\`\`

\`figure\` — rasm va uning izohini bitta mantiqiy birlikka bog'laydi. Bu shunchaki \`div\` dan semantik jihatdan to'g'riroq.

---

## 📝 Ro'yxatlar

\`\`\`demo h=340 "ul, ol va ichma-ich ro'yxat"
<style>
  body { display: flex; gap: 24px; flex-wrap: wrap; }
  h3 { font-size: 14px; margin: 0 0 6px; color: #374151; }
</style>

<div>
  <h3>ul — tartiblanmagan</h3>
  <ul>
    <li>HTML</li>
    <li>CSS</li>
    <li>JavaScript</li>
  </ul>
</div>

<div>
  <h3>ol — tartiblangan</h3>
  <ol>
    <li>HTML o'rganish</li>
    <li>CSS o'rganish</li>
    <li>JavaScript o'rganish</li>
  </ol>
</div>

<div>
  <h3>ol type="A"</h3>
  <ol type="A">
    <li>Birinchi</li>
    <li>Ikkinchi</li>
  </ol>
</div>

<div>
  <h3>Ichma-ich</h3>
  <ul>
    <li>Frontend
      <ul>
        <li>HTML</li>
        <li>CSS</li>
      </ul>
    </li>
    <li>Backend
      <ul>
        <li>Node.js</li>
      </ul>
    </li>
  </ul>
</div>
\`\`\`

### ol attributlari

\`\`\`html
<ol start="5">...</ol>      <!-- 5 dan boshlanadi -->
<ol reversed>...</ol>       <!-- teskari tartib -->
<ol type="A">...</ol>       <!-- A, B, C -->
<ol type="I">...</ol>       <!-- I, II, III -->
\`\`\`

### dl — ta'rif ro'yxati

\`\`\`demo h=200 "dl, dt, dd"
<dl>
  <dt><b>HTML</b></dt>
  <dd>HyperText Markup Language — veb-sahifalar yaratish tili</dd>

  <dt><b>CSS</b></dt>
  <dd>Cascading Style Sheets — veb-sahifalarni stillashtirish</dd>
</dl>
\`\`\`

---

## 🌐 Navigatsiya — nav + ul

\`\`\`demo h=200 "Semantik navigatsiya"
<style>
  nav ul { list-style: none; padding: 0; display: flex; gap: 20px; }
  nav a { color: #1d4ed8; text-decoration: none; }
  nav a:hover { text-decoration: underline; }
</style>

<nav>
  <ul>
    <li><a href="#">Bosh sahifa</a></li>
    <li><a href="#">Biz haqimizda</a></li>
    <li><a href="#">Portfolio</a></li>
    <li><a href="#">Bog'lanish</a></li>
  </ul>
</nav>
\`\`\`

Menyu — bu aslida **linklar ro'yxati**. Shuning uchun \`ul\` ichida yoziladi, \`nav\` esa "bu navigatsiya" deb belgilaydi.

---

## 📺 Video va Audio (HTML5)

\`\`\`html
<video width="640" height="360" controls poster="preview.jpg">
  <source src="video.mp4" type="video/mp4" />
  <source src="video.webm" type="video/webm" />
  Brauzeringiz videoni qo'llab-quvvatlamaydi.
</video>

<audio controls>
  <source src="music.mp3" type="audio/mpeg" />
</audio>
\`\`\`

Muhim attributlar: \`controls\` (tugmalar), \`autoplay\` (avtomatik), \`muted\` (autoplay uchun shart), \`loop\`, \`poster\`.

---

## 🥉 Bronze Topshiriq

Sevimli sportchilaringiz haqida sahifa: har biri uchun \`h2\`, \`img\` (alt bilan) va \`p\`.

\`\`\`demo h=300 "Bronze — natija"
<h1>Mening Sevimli Sportchilarim</h1>

<h2>Sportchi 1</h2>
<img src="https://picsum.photos/id/1062/260/160" alt="Sportchi mashq qilmoqda" width="260" />
<p>Qisqacha tavsif — kim, qaysi sport turi, nima bilan mashhur.</p>
\`\`\`

---

## 🥈 Silver Topshiriq

Bronze ustiga qo'shing:

- Har rasmni \`figure\` + \`figcaption\` ichiga oling
- Rasmni bosilganda tashqi saytga olib boradigan qiling (\`target="_blank" rel="noopener noreferrer"\`)
- Pastda "Manbalar" bo'limi — Wikipedia havolalari bilan

---

## 🥇 Gold Topshiriq

Uchta xil ro'yxat ishlatilgan sahifa yarating:

- \`ol\` — sevimli o'yinlaringiz (eng yaxshidan pastga)
- \`ul\` — sevimli ovqatlaringiz
- **Ichma-ich** \`ul\` — o'rganayotgan narsalaringiz (Frontend → HTML, CSS, JS)
- Tepada \`nav\` bilan bo'limlarga o'tadigan menyu (\`#id\` havolalar bilan)

---

## ✅ Dars Xulosa

- \`<img src="..." alt="...">\` — alt **har doim** bo'lishi shart
- \`<a href="...">\` — tashqi linkda \`target="_blank" rel="noopener noreferrer"\`
- \`<ul>\` — tartiblanmagan, \`<ol>\` — tartiblangan, \`<dl>\` — ta'rif
- \`<figure>\` + \`<figcaption>\` — rasm uchun semantik to'g'ri yondashuv
- Fayl yo'llari: **nisbiy** yo'l ishlatish, mutlaq emas

> 🚀 **Keyingi dars:** "Mening Qahramonim" — o'tilgan narsalarni bitta loyihada jamlash!
`,
    teacher: `
## 💡 O'qituvchi uchun

- \`alt\` ni "shunchaki yozish kerak" deb o'tmang. Yuqoridagi buzilgan rasm demosini sinfda ko'rsating — bola sababni ko'rgach, o'zi yozadigan bo'ladi.
- Fayl yo'li — 2-darsning eng qiyin joyi. Doskaga papka daraxtini chizing va \`../\` ni jismonan "bir qadam orqaga" deb ko'rsating.
- \`rel="noopener noreferrer"\` ni yodlatmang. "Bu xavfsizlik uchun, kattaroq bo'lganingizda sababini tushunasiz" deb o'ting — hozir yodlash muhim, sabab emas.

## ⚠️ Tekshirishda e'tibor bering

- \`alt\` bo'sh qoldirilganmi yoki "rasm" deb yozilganmi? Bu ham xato — alt **mazmunni** tasvirlashi kerak.
- Mutlaq yo'l (\`C:/...\`) ishlatilganmi?
- \`target="_blank"\` bor, \`rel\` yo'qmi?
- Ichma-ich ro'yxatda \`<ul>\` \`<li>\` ning **ichida** turibdimi? Ko'pchilik uni \`</li>\` dan keyin yozadi — bu xato.

## 📊 Daraja belgilash

- **Bronze** — rasm ko'rinadi, alt bor, tavsif yozilgan
- **Silver** — figure/figcaption to'g'ri, tashqi havolalar rel bilan
- **Gold** — uch xil ro'yxat, ichma-ich tuzilma to'g'ri, nav ishlaydi
`,
  },

  // ═══════════════════════════════════════════════════════════
  'junior.m1.l4': {
    goal: "CSS'ni HTML'ga ulash, selektorlar, ranglar va eng muhim qonun — Specificity.",
    student: `
## 🎨 CSS nima?

**CSS** — Cascading Style Sheets.

HTML — uy skeleti. CSS — uning bo'yog'i, dizayni, mebeli.

- **HTML** = Struktura (devorlar, pollar, tomlar)
- **CSS** = Ko'rinish (ranglar, shriftlar, o'lchamlar)
- **JS** = Xulq-atvor (eshik ochilishi, chiroq yoqilishi)

---

## 🔗 CSS ni HTML ga ulash — 3 xil usul

### 1. External CSS — Eng yaxshi usul ✅

\`\`\`html
<!-- index.html -->
<head>
  <link rel="stylesheet" href="style.css" />
</head>
\`\`\`

### 2. Internal CSS — faqat kichik loyiha uchun

\`\`\`html
<head>
  <style>
    body { background-color: lightblue; }
  </style>
</head>
\`\`\`

### 3. Inline CSS — kamdan-kam

\`\`\`html
<p style="color: red;">Bu qizil matn</p>
\`\`\`

\`\`\`demo h=200 "Uch usul yonma-yon"
<style>
  .internal { color: #16a34a; font-weight: 600; }
</style>

<p>Bu — hech qanday stilsiz oddiy matn.</p>
<p class="internal">Bu — internal CSS (style tegi orqali).</p>
<p style="color: #dc2626; font-weight: 600;">Bu — inline CSS (style attributi orqali).</p>
\`\`\`

> ⚠️ Har doim **External CSS** ishlating — kod alohida faylda, qayta ishlatiladi, boshqarish oson. Bu yerda demo bo'lgani uchun internal ishlatilyapti.

---

## 🎯 CSS Qoida Tuzilmasi

\`\`\`css
selektor {
  xususiyat: qiymat;
}

/* Misol */
h1 {
  color: navy;
  font-size: 32px;
  text-align: center;
}
\`\`\`

| Qism | Misol | Ma'nosi |
| --- | --- | --- |
| **Selektor** | \`h1\` | Qaysi elementga qo'llanamiz |
| **Xususiyat** | \`color\` | Nimani o'zgartiramiz |
| **Qiymat** | \`navy\` | Qanday o'zgartiramiz |
| **Deklaratsiya** | \`color: navy;\` | Xususiyat + qiymat |

---

## 🎯 CSS Selektorlar

\`\`\`demo h=360 "Selektor turlari"
<style>
  /* Tag selektor — barcha h3 lar */
  h3 { color: #1e40af; }

  /* Class selektor — nuqta bilan */
  .highlight { background: #fef08a; padding: 2px 6px; border-radius: 4px; }
  .big { font-size: 20px; }

  /* ID selektor — panjara bilan */
  #special { color: #7c3aed; font-weight: 700; }

  /* Guruh selektor */
  h3, .note { font-family: Georgia, serif; }

  /* Avlod selektor — box ichidagi p */
  .box p { color: #059669; }

  /* Bevosita avlod */
  .list > li { list-style: square; }

  /* Attribute selektor */
  a[target="_blank"] { color: #ea580c; }
</style>

<h3>Tag selektor bilan bo'yaldim</h3>
<p><span class="highlight">Class</span> va <span class="highlight big">ikkita class</span></p>
<p id="special">Men ID orqali bo'yaldim</p>

<div class="box">
  <p>Men .box ichidaman — avlod selektori</p>
</div>

<ul class="list">
  <li>Kvadrat belgi</li>
  <li>Men ham</li>
</ul>

<p><a href="#" target="_blank">target="_blank" bo'lgani uchun to'q sariq</a></p>
\`\`\`

> ⚠️ **Muhim qoida:** ID bir sahifada **faqat bir marta** ishlatiladi. Class — xohlagancha takrorlanadi.

---

## 🏔 CSS Cascading — "Sharshara" qonuni

Bir elementga bir necha qoida qo'llansa, **ketma-ketlik** muhim:

\`\`\`demo h=180 "Oxirgi qoida g'alaba qiladi"
<style>
  p { color: blue; }   /* 1 */
  p { color: red; }    /* 2 — oxirgi, shu ishlaydi */
</style>

<p>Qaysi rangdaman? Yuqoridagi ikki qoidaning o'rnini almashtirib ko'ring.</p>
\`\`\`

---

## ⚖️ CSS Specificity — Ustuvorlik hisobi

Bu CSS ning eng muhim va eng ko'p chalkashtiriladigan qismi.

\`\`\`text
Inline style   = 1000 ball
#id            =  100 ball
.class         =   10 ball
tag            =    1 ball
\`\`\`

\`\`\`demo h=280 "Kim g'alaba qiladi?"
<style>
  p       { color: #2563eb; }   /* 1 ball   — tag */
  .text   { color: #16a34a; }   /* 10 ball  — class */
  #main   { color: #9333ea; }   /* 100 ball — id */
</style>

<p>Faqat tag — ko'k (1 ball)</p>
<p class="text">Tag + class — yashil yutdi (10 ball)</p>
<p id="main" class="text">Tag + class + id — binafsha yutdi (100 ball)</p>
<p id="main" class="text" style="color: #ea580c;">Inline qo'shildi — to'q sariq yutdi (1000 ball)</p>
\`\`\`

### Murakkab misol

\`\`\`css
body p { color: blue; }            /* 1+1 = 2 */
.container p { color: green; }     /* 10+1 = 11 */
#main .text { color: red; }        /* 100+10 = 110 */
#main .text p { color: purple; }   /* 100+10+1 = 111 */
\`\`\`

> 💡 **Specificity muammolaridan qochish uchun:** ID o'rniga class ishlating, \`!important\` ishlatmang, selektor zanjirini qisqa tuting.

### !important — yashirin qurol

\`\`\`demo h=180 "!important hammasini yengadi"
<style>
  .text { color: #2563eb !important; }  /* 10 ball, lekin !important */
  #main { color: #dc2626; }             /* 100 ball — baribir yutqazdi */
</style>

<p id="main" class="text">Men ko'kman — !important tufayli</p>
\`\`\`

> ❌ \`!important\` — faqat o'zingiz yozmagan kodni (kutubxona, plugin) bekor qilishda ishlatiladi. O'z CSS'ingizda **hech qachon** ishlatmang. Aks holda keyin uni ham bekor qilish uchun yana \`!important\` kerak bo'ladi — va kod boshqarib bo'lmas holga keladi.

---

## 🌈 CSS Ranglar

\`\`\`demo h=320 "Rang yozishning 6 usuli"
<style>
  .swatch { padding: 10px 14px; margin-bottom: 6px; border-radius: 8px;
            color: white; font-family: monospace; font-size: 13px; }

  .s1 { background: red; }
  .s2 { background: #1a1a2e; }
  .s3 { background: rgb(37, 99, 235); }
  .s4 { background: rgba(220, 38, 38, 0.5); color: #111; }
  .s5 { background: hsl(160, 84%, 39%); }

  :root { --primary: #7c3aed; }
  .s6 { background: var(--primary); }
</style>

<div class="swatch s1">1. Ism bilan — red</div>
<div class="swatch s2">2. HEX — #1a1a2e</div>
<div class="swatch s3">3. RGB — rgb(37, 99, 235)</div>
<div class="swatch s4">4. RGBA — rgba(220, 38, 38, 0.5) shaffof</div>
<div class="swatch s5">5. HSL — hsl(160, 84%, 39%)</div>
<div class="swatch s6">6. O'zgaruvchi — var(--primary)</div>
\`\`\`

### Mashhur rang palitrasi

| Rang | HEX | Qachon |
| --- | --- | --- |
| Oq | \`#ffffff\` | Fon |
| Qora | \`#000000\` | Matn |
| Kulrang | \`#6c757d\` | Ikkinchi darajali matn |
| Ko'k | \`#0d6efd\` | Tugmalar |
| Yashil | \`#198754\` | Muvaffaqiyat xabari |
| Qizil | \`#dc3545\` | Xato xabari |
| Sariq | \`#ffc107\` | Ogohlantirish |

---

## 🔍 Chrome DevTools bilan CSS o'rganish

1. **F12** bosing
2. **Elements** tabini oching
3. Elementni tanlang (picker asbob bilan)
4. O'ng tarafda **Styles** panelida CSS qoidalarini ko'ring
5. Qiymatlarga bosib, to'g'ridan-to'g'ri o'zgartiring

> 💡 DevTools'da o'zgartirish vaqtinchalik — sahifani yangilasangiz qaytadi. Maqsad — tez sinab ko'rish.

---

## 🥉 Bronze Topshiriq

Alohida \`style.css\` fayl yarating, uni \`<link>\` bilan ulang va sahifa foniga rang bering.

\`\`\`css
body {
  background-color: #f5f5f5;
  margin: 0;
  padding: 20px;
}
\`\`\`

> ✅ **Tekshirish:** Sahifa foni kulrang bo'lishi kerak. Bo'lmasa — \`link\` dagi yo'lni tekshiring.

---

## 🥈 Silver Topshiriq

\`h1\` va \`p\` uchun rang, o'lcham va \`line-height\` bering. Kamida 2 ta class yarating va ularni ishlating.

---

## 🥇 Gold Topshiriq

Specificity'ni **amalda ko'rsating**: bitta paragrafga tag, class va id qoidalarini yozing, qaysi biri g'alaba qilishini tushuntiring.

\`\`\`demo h=260 "Gold — natija namunasi"
<style>
  p { color: gray; }

  .normal { color: black; }

  #intro {
    color: #27ae60;
    background-color: #e8f8f0;
    padding: 10px;
    border-left: 4px solid #27ae60;
  }
</style>

<p id="intro" class="normal">Bu kirish paragrafi — qaysi qoidadan rang oldi?</p>
<p class="normal">Bu oddiy paragraf</p>
<p>Bu esa faqat tag selektoridan rang oldi</p>
\`\`\`

**Savol:** birinchi paragraf nima uchun yashil? (Javob: \`#intro\` = 100 ball, \`.normal\` = 10 ball, \`p\` = 1 ball)

---

## ✅ Dars Xulosa

- **External CSS** — har doim alohida fayl
- **Selektor ballari:** tag (1), .class (10), #id (100), inline (1000)
- **Specificity** — ball ko'proq bo'lgan qoida g'alaba qiladi
- **Cascade** — bir xil ballda oxirgi qoida ishlaydi
- **Ranglar:** HEX, RGB, RGBA, HSL, CSS o'zgaruvchilar
- \`!important\` — faqat oxirgi chora

> 🚀 **Keyingi dars:** Google Fonts va Tipografiya — saytga professional ko'rinish berish!
`,
    teacher: `
## 💡 O'qituvchi uchun

- Specificity — 4-darsning yuragi. Uni **raqam bilan** o'rgating: doskaga 1 / 10 / 100 / 1000 yozib qo'ying va har misolda ball qo'shib chiqing.
- Bolalar \`!important\` ni topib olishsa, hamma joyda ishlatishni boshlaydi. Shuning uchun uni ataylab "yomon odat" sifatida tanishtiring: "bu — chalayotgan dori, kasallikni davolamaydi".
- ID va class farqini "pasport raqami va sinf nomi" deb tushuntiring: pasport raqami bittada bitta, sinfda esa 30 bola bo'lishi mumkin.

## ⚠️ Tekshirishda e'tibor bering

- \`<link rel="stylesheet" href="style.css">\` — \`rel\` yozilganmi? Ko'pchilik uni tushirib qoldiradi va CSS ulanmaydi.
- Class nomi raqamdan boshlanmaganmi? (\`.1box\` — ishlamaydi)
- CSS faylida HTML teglar qolib ketmaganmi? (\`<style>\` ni ham ko'chirib qo'yish — klassik xato)
- Selektor va \`{\` orasida nuqta/panjara to'g'ri qo'yilganmi?

## 📊 Daraja belgilash

- **Bronze** — external CSS ulangan va ishlayapti
- **Silver** — kamida 2 ta class, tag selektorlar, line-height ishlatilgan
- **Gold** — specificity amalda ko'rsatilgan va **og'zaki tushuntira oladi**

> Gold uchun kodning o'zi yetarli emas — bola nima uchun shu rang chiqqanini aytib bera olishi kerak.
`,
  },

  // ═══════════════════════════════════════════════════════════
  'junior.m1.l5': {
    goal: "Google Fonts, font-size, font-weight, text-align, letter-spacing, line-height — professional ko'rinishli matn.",
    student: `
## 🔤 Tipografiya nima?

Tipografiya — matnni ko'rgazmali tarzda taqdim etish san'ati. Yaxshi tipografiya o'qishni osonlashtiradi, professional ko'rinish beradi va foydalanuvchini sahifada uzoqroq ushlab turadi.

> 💡 Foydalanuvchilar sahifa dizaynini **50 millisekund** ichida baholaydi. Va birinchi ko'radigan narsasi — matn ko'rinishi.

---

## 🔤 Font oilalari

\`\`\`demo h=280 "Serif / Sans-serif / Monospace"
<style>
  div { margin-bottom: 14px; padding: 10px; background: #f9fafb; border-radius: 8px; }
  .label { font-size: 11px; color: #6b7280; font-family: monospace; margin-bottom: 4px; }
  .serif { font-family: Georgia, 'Times New Roman', serif; font-size: 19px; }
  .sans  { font-family: Arial, Helvetica, sans-serif; font-size: 19px; }
  .mono  { font-family: 'Courier New', monospace; font-size: 19px; }
</style>

<div>
  <p class="label">serif — harflarda "tirnoq" bor</p>
  <p class="serif">Salom, men serif shriftman. Kitob va gazeta uchun.</p>
</div>

<div>
  <p class="label">sans-serif — tirnoqsiz, toza</p>
  <p class="sans">Salom, men sans-serif shriftman. Zamonaviy saytlar uchun.</p>
</div>

<div>
  <p class="label">monospace — har harf bir xil kenglikda</p>
  <p class="mono">Salom, men monospace. Kod: if (x === 1)</p>
</div>
\`\`\`

| Tur | Misol | Qachon |
| --- | --- | --- |
| **Serif** | Times New Roman, Georgia | Gazeta, kitob, klassik dizayn |
| **Sans-serif** | Roboto, Inter | Zamonaviy veb-saytlar |
| **Monospace** | JetBrains Mono | Kod ko'rsatish |
| **Display** | Playfair Display | Sarlavhalar, logolar |

\`\`\`css
/* Fallback zanjiri — asosiy topilmasa, keyingisi ishlatiladi */
body { font-family: 'Roboto', 'Helvetica Neue', Arial, sans-serif; }
\`\`\`

---

## 🌐 Google Fonts — bepul shriftlar

**1-usul: HTML \`<link>\` orqali (tavsiya etiladi)**

\`\`\`html
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap"
    rel="stylesheet"
  />

  <!-- O'z CSS faylingiz KEYIN bo'lishi shart -->
  <link rel="stylesheet" href="style.css" />
</head>
\`\`\`

**2-usul: CSS \`@import\` orqali**

\`\`\`css
/* style.css ning eng birinchi qatori */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');

body { font-family: 'Inter', sans-serif; }
\`\`\`

> ⚠️ \`@import\` — \`<link>\` dan biroz sekinroq, chunki brauzer avval CSS faylini yuklab, keyin shriftni so'raydi. Haqiqiy loyihada \`<link>\` ishlating.

---

## 📏 font-size — shrift hajmi

\`\`\`demo h=300 "px, em, rem farqi"
<style>
  html { font-size: 16px; }         /* 1rem = 16px */
  .parent { font-size: 20px; padding: 10px; background: #eff6ff; border-radius: 8px; }

  .px  { font-size: 24px; }         /* har doim 24px */
  .em  { font-size: 1.5em; }        /* ota (20px) × 1.5 = 30px */
  .rem { font-size: 1.5rem; }       /* root (16px) × 1.5 = 24px */
</style>

<div class="parent">
  <p style="font-size:12px;color:#6b7280;margin:0 0 8px">Ota element: font-size: 20px</p>
  <p class="px">px — 24px (o'zgarmas)</p>
  <p class="em">em — 1.5em = 30px (otaga bog'liq!)</p>
  <p class="rem">rem — 1.5rem = 24px (html ga bog'liq)</p>
</div>
\`\`\`

**Farqi muhim:** \`em\` ota elementga bog'lanadi, shuning uchun ichma-ich elementlarda hajm kutilmaganda oshib ketadi. \`rem\` esa doim \`html\` ga qaraydi — shuning uchun **rem afzal**.

| Element | Tavsiya etilgan hajm |
| --- | --- |
| Asosiy matn | 16px – 18px |
| H1 | 32px – 64px |
| H2 | 24px – 36px |
| H3 | 20px – 28px |
| Mayda matn | 12px – 14px |

---

## 💪 font-weight — qalinlik

\`\`\`demo h=280 "100 dan 900 gacha"
<style>
  p { margin: 6px 0; font-size: 18px; font-family: Arial, sans-serif; }
</style>

<p style="font-weight:300">300 — light</p>
<p style="font-weight:400">400 — normal (default)</p>
<p style="font-weight:500">500 — medium</p>
<p style="font-weight:600">600 — semibold</p>
<p style="font-weight:700">700 — bold</p>
<p style="font-weight:900">900 — black</p>
\`\`\`

> ⚠️ Google Fonts'dan shrift yuklashda **kerakli weight'larni tanlab oling**: \`family=Roboto:wght@400;600;700\`. Har bir qo'shimcha weight — saytning yuklanish vaqtini oshiradi. Hammasini yuklash — keng tarqalgan xato.

---

## ↔️ text-align va letter-spacing

\`\`\`demo h=320 "Tekislash va harf oralig'i"
<style>
  div { padding: 8px 12px; background: #f9fafb; margin-bottom: 8px; border-radius: 6px; }
  .lbl { font-size: 11px; font-family: monospace; color: #6b7280; }
</style>

<div>
  <p class="lbl">text-align: left (default)</p>
  <p style="text-align:left">Bu matn chapga tekislangan.</p>
</div>
<div>
  <p class="lbl">text-align: center</p>
  <p style="text-align:center">Bu matn markazda.</p>
</div>
<div>
  <p class="lbl">text-align: justify</p>
  <p style="text-align:justify">Bu matn ikkala tomonga tekislangan, shuning uchun so'zlar orasidagi masofa cho'ziladi va chekkalar tekis chiqadi.</p>
</div>
<div>
  <p class="lbl">letter-spacing: 5px + uppercase</p>
  <p style="letter-spacing:5px;text-transform:uppercase;font-weight:700">Brand Name</p>
</div>
\`\`\`

\`letter-spacing\` — logolar va katta harfli sarlavhalarda ozgina kengaytirish chiroyli ko'rinadi. Oddiy paragrafda **ishlatmang** — o'qishni qiyinlashtiradi.

---

## 📏 line-height — qatorlar orasi

\`\`\`demo h=340 "1.0 / 1.6 / 2.0"
<style>
  .col { padding: 10px; background: #f9fafb; border-radius: 8px; margin-bottom: 10px; }
  .lbl { font-size: 11px; font-family: monospace; color: #6b7280; margin: 0 0 4px; }
  p.txt { margin: 0; font-size: 15px; }
</style>

<div class="col">
  <p class="lbl">line-height: 1.0 — zich, o'qish qiyin</p>
  <p class="txt" style="line-height:1.0">Frontend dasturlash — bu veb-saytlarning foydalanuvchi ko'radigan qismini yaratish. HTML struktura beradi, CSS ko'rinish beradi.</p>
</div>

<div class="col">
  <p class="lbl">line-height: 1.6 — tavsiya etiladi</p>
  <p class="txt" style="line-height:1.6">Frontend dasturlash — bu veb-saytlarning foydalanuvchi ko'radigan qismini yaratish. HTML struktura beradi, CSS ko'rinish beradi.</p>
</div>

<div class="col">
  <p class="lbl">line-height: 2.0 — juda keng</p>
  <p class="txt" style="line-height:2.0">Frontend dasturlash — bu veb-saytlarning foydalanuvchi ko'radigan qismini yaratish. HTML struktura beradi, CSS ko'rinish beradi.</p>
</div>
\`\`\`

> ⚠️ \`line-height\` ni **birliksiz** yozing: \`line-height: 1.6\`, \`24px\` emas. Birliksiz qiymat font hajmiga ko'paytiriladi, shuning uchun shrift o'zgarganda ham to'g'ri qoladi.

| Kontent turi | line-height |
| --- | --- |
| Sarlavhalar | 1.1 – 1.3 |
| Qisqa matn | 1.4 – 1.5 |
| Uzun paragraflar | 1.6 – 1.8 |
| Interfeys elementlari | 1.0 – 1.2 |

---

## 📝 Boshqa foydali xususiyatlar

\`\`\`demo h=320 "transform, decoration, shadow, truncate"
<style>
  p { margin: 8px 0; font-size: 16px; }
  .truncate {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 240px;
    background: #f3f4f6; padding: 6px; border-radius: 6px;
  }
</style>

<p style="text-transform:uppercase">text-transform: uppercase</p>
<p style="text-transform:capitalize">text-transform: capitalize — har so'z bosh harf</p>
<p style="text-decoration:underline">text-decoration: underline</p>
<p style="text-decoration:line-through">text-decoration: line-through</p>
<p style="text-shadow: 2px 2px 4px rgba(0,0,0,0.35); font-size:22px; font-weight:700">text-shadow bilan sarlavha</p>
<p class="truncate">text-overflow: ellipsis — juda uzun matn shu yerda kesiladi va uch nuqta qo'yiladi</p>
\`\`\`

---

## 🎯 To'liq tipografiya sistemasi

\`\`\`css
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700&family=Inter:wght@400;500;600&display=swap');

:root {
  --font-heading: 'Montserrat', sans-serif;
  --font-body: 'Inter', sans-serif;

  --text-base: 16px;
  --text-3xl:  30px;
  --text-5xl:  48px;
}

body {
  font-family: var(--font-body);
  font-size: var(--text-base);
  line-height: 1.6;
  color: #1a1a2e;
}

h1, h2, h3 {
  font-family: var(--font-heading);
  line-height: 1.2;
}

h1 { font-size: var(--text-5xl); font-weight: 700; }
h3 { font-size: var(--text-3xl); font-weight: 600; }
\`\`\`

O'zgaruvchilar (\`--font-heading\`) tufayli shriftni **bitta joyda** o'zgartirsangiz butun sayt yangilanadi.

---

## 🥉 Bronze Topshiriq

Google Fonts'dan bitta shrift (masalan Montserrat) ulang va butun sahifaga qo'llang.

> ✅ **Tekshirish:** Shrift ulanmasa — brauzer standart Arial'ni ko'rsatadi. DevTools → Computed → \`font-family\` ni tekshiring.

---

## 🥈 Silver Topshiriq

- \`h1\` — markazda, \`letter-spacing: 2px\`, \`font-weight: 700\`
- Paragraflar — \`font-size: 17px\`, \`line-height: 1.8\`
- Kamida ikki xil \`font-weight\` ishlatilgan

---

## 🥇 Gold Topshiriq

Ikkita shrift kombinatsiyasi (sarlavhaga serif, matnga sans-serif) va CSS o'zgaruvchilar bilan to'liq sistema:

\`\`\`demo h=380 "Gold — natija namunasi"
<style>
  :root {
    --heading: Georgia, 'Playfair Display', serif;
    --body: 'Lato', Arial, sans-serif;
  }

  body {
    font-family: var(--body);
    font-size: 17px;
    line-height: 1.8;
    color: #333;
    background: #fafafa;
    max-width: 640px;
    margin: 0 auto;
  }

  .section-label {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: #999;
    margin: 0;
  }

  h1 {
    font-family: var(--heading);
    font-size: 44px;
    letter-spacing: -1px;
    line-height: 1.1;
    margin: 4px 0 8px;
  }

  h2 {
    font-family: var(--heading);
    font-size: 28px;
    color: #555;
    margin: 24px 0 8px;
  }
</style>

<p class="section-label">Blog</p>
<h1>Tipografiya nima uchun muhim</h1>
<p>Yaxshi tanlangan shrift matnni o'qishni osonlashtiradi va saytga professional ko'rinish beradi.</p>

<h2>Ikkinchi bo'lim</h2>
<p>Sarlavha serif, asosiy matn sans-serif — bu klassik va ishonchli kombinatsiya.</p>
\`\`\`

---

## ✅ Dars Xulosa

- **Google Fonts** — bepul, sifatli. \`<link>\` bilan ulash afzal
- **rem** — eng yaxshi birlik, chunki ota elementga bog'liq emas
- **font-weight** — faqat kerakli weight'larni yuklang
- **line-height: 1.6** — paragraflar uchun standart, birliksiz yozing
- **letter-spacing** — faqat sarlavha va logolarda
- **CSS o'zgaruvchilar** — tipografiyani bir joydan boshqarish

> 🚀 **Keyingi dars:** Box Model — har element quticha sifatida: margin, padding, border!
`,
    teacher: `
## 💡 O'qituvchi uchun

- \`em\` va \`rem\` farqi — 5-darsning eng qiyin joyi. Yuqoridagi demoda ichma-ich \`em\` qo'shib ko'rsating: \`.parent\` ichida yana bitta \`em\` element yarating va hajm qanday "qor ko'chkisi" kabi oshib ketishini ko'rsating.
- Bolalar Google Fonts'dan 5-6 ta shriftni bir vaqtda yuklashadi. Buni darhol to'xtating: "bitta saytda ko'pi bilan **2 ta** shrift" degan qoidani o'rnating.
- \`line-height: 24px\` yozganlar bo'ladi. Shriftni 30px qilib, matn qanday ustma-ust tushib qolishini ko'rsating.

## ⚠️ Tekshirishda e'tibor bering

- Google Fonts \`<link>\` \`<head>\` ichidami va o'z CSS'idan **oldinmi**?
- Shrift nomi CSS'da to'g'ri yozilganmi? \`'Montserrat'\` — qo'shtirnoq va katta harf muhim
- Fallback berilganmi? \`font-family: 'Inter'\` — noto'g'ri, \`font-family: 'Inter', sans-serif\` — to'g'ri
- \`letter-spacing\` oddiy paragraflarda ishlatilganmi? Bu o'qishni qiyinlashtiradi

## 📊 Daraja belgilash

- **Bronze** — shrift ulangan va haqiqatan ishlayapti (Arial emas)
- **Silver** — letter-spacing, line-height, text-align to'g'ri qo'llangan
- **Gold** — ikki shrift kombinatsiyasi, CSS o'zgaruvchilar, izchil o'lchamlar tizimi
`,
  },

  // ═══════════════════════════════════════════════════════════
  'junior.m1.l6': {
    goal: "CSS Box Model — margin, padding, border va box-sizing. CSS ning eng asosiy kontseptsiyasi.",
    student: `
## 📦 Box Model nima?

Brauzerda **har bir HTML element — to'rtburchak quticha**. Bu quticha to'rt qismdan iborat:

\`\`\`text
+----------------------------------+
|           MARGIN                 |  ← tashqi masofa
|   +--------------------------+   |
|   |        BORDER            |   |  ← ramka
|   |   +------------------+   |   |
|   |   |     PADDING      |   |   |  ← ichki masofa
|   |   |  +------------+  |   |   |
|   |   |  |  CONTENT   |  |   |   |  ← matn, rasm
|   |   |  +------------+  |   |   |
|   |   +------------------+   |   |
|   +--------------------------+   |
+----------------------------------+
\`\`\`

Quyidagi demoda har qatlam alohida rangda. Qiymatlarni o'zgartirib ko'ring:

\`\`\`demo h=300 "Box Model — jonli"
<style>
  .outer {
    background: #fde68a;              /* MARGIN maydoni (sariq) */
    display: inline-block;
    padding: 30px;                    /* margin'ni ko'rsatish uchun */
    border-radius: 8px;
  }
  .box {
    background: #bfdbfe;              /* PADDING maydoni (ko'k) */
    border: 8px solid #7c3aed;        /* BORDER (binafsha) */
    padding: 24px;
  }
  .content {
    background: #86efac;              /* CONTENT (yashil) */
    padding: 14px 20px;
    font-weight: 600;
  }
  .legend { font-size: 12px; margin-top: 10px; color: #4b5563; }
</style>

<div class="outer">
  <div class="box">
    <div class="content">CONTENT</div>
  </div>
</div>

<p class="legend">
  🟨 margin &nbsp;·&nbsp; 🟪 border (8px) &nbsp;·&nbsp; 🟦 padding (24px) &nbsp;·&nbsp; 🟩 content
</p>
\`\`\`

---

## 🔲 Padding — ichki masofa

Padding — kontent bilan chegara o'rtasidagi bo'sh joy.

\`\`\`demo h=280 "padding qisqartmalari"
<style>
  .p { background: #dbeafe; border: 2px solid #3b82f6; margin-bottom: 10px;
       display: inline-block; }
  .inner { background: white; }
  .lbl { font-family: monospace; font-size: 12px; color: #6b7280; margin: 0 0 3px; }

  .p1 { padding: 20px; }              /* hamma tomon */
  .p2 { padding: 20px 40px; }         /* yuqori/past, chap/o'ng */
  .p3 { padding: 5px 40px 30px; }     /* yuqori, chap/o'ng, past */
  .p4 { padding: 10px 0; }            /* yuqori/past 10, yon 0 */
</style>

<p class="lbl">padding: 20px</p>
<div class="p p1"><div class="inner">Kontent</div></div>

<p class="lbl">padding: 20px 40px</p>
<div class="p p2"><div class="inner">Kontent</div></div>

<p class="lbl">padding: 5px 40px 30px</p>
<div class="p p3"><div class="inner">Kontent</div></div>

<p class="lbl">padding: 10px 0</p>
<div class="p p4"><div class="inner">Kontent</div></div>
\`\`\`

Tartib — **soat yo'nalishi**: yuqori → o'ng → pastki → chap.

Amaliy qiymatlar: tugma \`padding: 12px 24px\`, karta \`padding: 24px\`, menyu havolasi \`padding: 8px 16px\`.

---

## ➡️ Margin — tashqi masofa

\`\`\`demo h=260 "margin: 0 auto bilan markazlash"
<style>
  .wrap { background: #f3f4f6; padding: 12px; border-radius: 8px; }

  .no-auto {
    width: 200px; background: #fca5a5;
    padding: 12px; margin-bottom: 14px; border-radius: 6px;
  }
  .with-auto {
    width: 200px; background: #86efac;
    padding: 12px; margin: 0 auto; border-radius: 6px;
  }
</style>

<div class="wrap">
  <div class="no-auto">margin yo'q — chapda</div>
  <div class="with-auto">margin: 0 auto — markazda</div>
</div>
\`\`\`

> 💡 \`margin: 0 auto\` ishlashi uchun elementda **kenglik** bo'lishi shart. Kengliksiz element allaqachon butun joyni egallaydi, markazlashga hojat qolmaydi.

### Margin Collapse — kutilmagan xatti-harakat

\`\`\`demo h=280 "Vertikal marginlar birlashadi"
<style>
  .box { background: #a5b4fc; padding: 10px; text-align: center; }
  .top    { margin-bottom: 40px; }
  .bottom { margin-top: 20px; }

  .h-wrap { display: flex; margin-top: 24px; }
  .h1 { background: #fcd34d; padding: 10px; margin-right: 20px; }
  .h2 { background: #fcd34d; padding: 10px; margin-left: 20px; }
</style>

<div class="box top">margin-bottom: 40px</div>
<div class="box bottom">margin-top: 20px</div>
<p style="font-size:13px;color:#4b5563">
  Oradagi masofa 40+20=60px EMAS — atigi <b>40px</b>. Kattasi qoladi, kichigi "yutiladi".
</p>

<div class="h-wrap">
  <div class="h1">margin-right: 20</div>
  <div class="h2">margin-left: 20</div>
</div>
<p style="font-size:13px;color:#4b5563">
  Gorizontalda esa qo'shiladi: 20+20 = <b>40px</b>.
</p>
\`\`\`

Bu — CSS ning o'ziga xos xususiyati, xato emas. Faqat **vertikal** marginlarda sodir bo'ladi.

---

## 📐 Border — chegara

\`\`\`demo h=300 "border turlari va radius"
<style>
  .b { display: inline-block; padding: 14px 18px; margin: 0 8px 10px 0;
       background: #f9fafb; font-size: 14px; }

  .solid  { border: 3px solid #3b82f6; }
  .dashed { border: 3px dashed #ef4444; }
  .dotted { border: 3px dotted #10b981; }
  .double { border: 5px double #8b5cf6; }
  .left   { border-left: 6px solid #f59e0b; }

  .r0  { border: 3px solid #3b82f6; border-radius: 0; }
  .r8  { border: 3px solid #3b82f6; border-radius: 8px; }
  .r50 { border: 3px solid #3b82f6; border-radius: 50%;
         width: 70px; height: 70px; display: inline-flex;
         align-items: center; justify-content: center; padding: 0; }
</style>

<div class="b solid">solid</div>
<div class="b dashed">dashed</div>
<div class="b dotted">dotted</div>
<div class="b double">double</div>
<div class="b left">border-left</div>
<br />
<div class="b r0">radius: 0</div>
<div class="b r8">radius: 8px</div>
<div class="b r50">50%</div>
\`\`\`

Amaliy qo'llanishlar: karta \`border: 1px solid #e0e0e0; border-radius: 12px\`, iqtibos \`border-left: 4px solid\`, avatar \`border-radius: 50%\`.

---

## ⚖️ box-sizing — eng muhim qoida

Bu CSS'dagi eng ko'p bosh og'riq keltiradigan narsa.

\`\`\`demo h=340 "content-box vs border-box"
<style>
  .demo { margin-bottom: 16px; }
  .ruler { height: 6px; background: #ef4444; margin-bottom: 4px; }
  .r300 { width: 300px; }
  .lbl { font-family: monospace; font-size: 12px; color: #4b5563; margin: 0 0 6px; }

  .cbox {
    box-sizing: content-box;   /* DEFAULT */
    width: 300px;
    padding: 20px;
    border: 5px solid #7c3aed;
    background: #ddd6fe;
  }
  .bbox {
    box-sizing: border-box;
    width: 300px;
    padding: 20px;
    border: 5px solid #059669;
    background: #a7f3d0;
  }
</style>

<div class="ruler r300"></div>
<p class="lbl">↑ 300px o'lchagich</p>

<div class="demo">
  <p class="lbl">content-box (default) — haqiqiy kenglik 350px</p>
  <div class="cbox">width: 300 + padding 40 + border 10 = <b>350px</b></div>
</div>

<div class="demo">
  <p class="lbl">border-box — haqiqiy kenglik 300px</p>
  <div class="bbox">width: 300px — <b>o'zgarmadi</b></div>
</div>
\`\`\`

Yuqoridagi qizil chiziq — 300px. Birinchi quti undan **oshib ketdi**, ikkinchisi aniq mos tushdi.

### Universal reset — har doim yozing

\`\`\`css
/* style.css ning ENG BIRINCHI qatori */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
\`\`\`

> 💡 Barcha professional saytlar va framework'lar (Bootstrap, Tailwind) shu resetni ishlatadi. Uni yozmasangiz, keyinchalik har bir elementda o'lcham hisoblab o'tirasiz.

---

## 📊 outline va border farqi

\`\`\`demo h=240 "outline joy egallamaydi"
<style>
  .row { display: flex; gap: 20px; align-items: flex-start; }
  .item { background: #e0e7ff; padding: 14px; width: 150px; }
  .with-border  { border: 6px solid #4f46e5; }
  .with-outline { outline: 6px solid #4f46e5; }
  .lbl { font-family: monospace; font-size: 12px; color: #4b5563; }
</style>

<div class="row">
  <div>
    <p class="lbl">border: 6px</p>
    <div class="item with-border">Kengaydi</div>
  </div>
  <div>
    <p class="lbl">outline: 6px</p>
    <div class="item with-outline">O'lcham o'zgarmadi</div>
  </div>
</div>
\`\`\`

\`outline\` layout'ga ta'sir qilmaydi — shuning uchun u **fokus** belgisi uchun ishlatiladi.

> ❌ \`button:focus { outline: none; }\` — bu **xato**. Klaviatura bilan ishlaydigan foydalanuvchi qayerdaligini yo'qotadi. Outline'ni o'chirsangiz, o'rniga boshqa ko'rinadigan belgi bering.

---

## 🕳️ overflow — kontent toshib ketsa

\`\`\`demo h=280 "visible / hidden / auto"
<style>
  .row { display: flex; gap: 14px; }
  .b { width: 130px; height: 110px; background: #fef3c7;
       border: 2px solid #f59e0b; font-size: 13px; padding: 6px; }
  .lbl { font-family: monospace; font-size: 11px; color: #4b5563; margin: 0 0 4px; }

  .v { overflow: visible; }
  .h { overflow: hidden; }
  .a { overflow: auto; }
</style>

<div class="row">
  <div>
    <p class="lbl">visible</p>
    <div class="b v">Bu matn juda uzun va qutiga sig'maydi, shuning uchun tashqariga chiqib ketadi va boshqa elementlar ustiga tushadi.</div>
  </div>
  <div>
    <p class="lbl">hidden</p>
    <div class="b h">Bu matn juda uzun va qutiga sig'maydi, shuning uchun ortiqchasi kesib tashlanadi.</div>
  </div>
  <div>
    <p class="lbl">auto</p>
    <div class="b a">Bu matn juda uzun va qutiga sig'maydi, shuning uchun scroll paydo bo'ladi va foydalanuvchi o'qiy oladi.</div>
  </div>
</div>
\`\`\`

---

## 🥉 Bronze Topshiriq

Universal reset yozing va 200×200 kvadrat yarating.

\`\`\`css
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.square {
  width: 200px;
  height: 200px;
  background-color: #e74c3c;
}
\`\`\`

---

## 🥈 Silver Topshiriq

Kvadratga \`border: 5px\` va \`padding: 20px\` qo'shing. **DevTools'da tekshiring** — \`box-sizing: border-box\` tufayli kenglik 200px'ligicha qolganini ko'ring.

Keyin \`box-sizing\` ni o'chirib ko'ring va farqni yozib oling.

---

## 🥇 Gold Topshiriq

Ikkita quti: biri ko'k, biri qizil, orasida 50px masofa. Ikkalasida ham radius, border va markazlashtirilgan matn.

\`\`\`demo h=340 "Gold — natija namunasi"
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .box-a, .box-b {
    width: 150px; height: 150px;
    border-radius: 12px; padding: 20px;
    display: flex; align-items: center; justify-content: center;
    font-size: 32px; color: white;
  }

  .box-a {
    background-color: #3498db;
    border: 3px solid #2980b9;
    margin-bottom: 50px;
  }

  .box-b {
    background-color: #e74c3c;
    border: 3px solid #c0392b;
  }
</style>

<div class="box-a">A</div>
<div class="box-b">B</div>
\`\`\`

---

## ✅ Dars Xulosa

- **Box Model:** Content → Padding → Border → Margin
- **Padding** = ichki masofa, **Margin** = tashqi masofa
- **box-sizing: border-box** — har doim yozing
- **margin: 0 auto** — gorizontal markazlashtirish (kenglik shart)
- **Margin Collapse** — vertikal marginlar birlashadi, kattasi qoladi
- **outline** — joy egallamaydi, fokus uchun; o'chirmang

> 🚀 **Keyingi dars:** Semantik HTML5 — header, nav, main, footer!
`,
    teacher: `
## 💡 O'qituvchi uchun

- Box Model — 1-modulning eng muhim darsi. Bolaga **DevTools'ning Box Model diagrammasini** ko'rsating (Elements → Computed → pastdagi rangli kvadrat). Bu darslikdagi har qanday chizmadan yaxshiroq tushuntiradi.
- \`box-sizing\` ni "o'chirib-yoqib" ko'rsating. Bola o'lcham sakraganini ko'rgach, resetni bir umr yozadigan bo'ladi.
- Margin Collapse'ni oldindan tushuntirmang — avval bolalar "nega 60px emas?" deb so'rashsin, keyin javob bering. Savol tug'ilgandan keyin javob yaxshi yodda qoladi.

## ⚠️ Tekshirishda e'tibor bering

- Reset yozilganmi va CSS faylining **birinchi** qismidami?
- \`padding\` va \`margin\` chalkashtirilganmi? Bu eng ko'p uchraydigan xato — fonni bo'yab ko'rsating, padding fon ichida, margin tashqarisida qoladi.
- \`margin: 0 auto\` ishlatilgan, lekin \`width\` berilmaganmi?
- Qisqartmadagi tartib to'g'rimi? \`padding: 5px 40px 30px\` — uch qiymat nima anglatishini so'rang.

## 📊 Daraja belgilash

- **Bronze** — reset bor, kvadrat to'g'ri o'lchamda
- **Silver** — border/padding qo'shilgan va box-sizing farqini **tushuntira oladi**
- **Gold** — ikki quti, margin bilan masofa, flex bilan markazlash

> Silver darajaning kaliti — kod emas, tushuntirish. "Nega 200px qoldi?" deb so'rang.
`,
  },

  // ═══════════════════════════════════════════════════════════
  'junior.m1.l7': {
    goal: "div dan voz kechib, semantik teglar bilan professional tuzilma yaratish. SEO va Accessibility asoslari.",
    student: `
## 🤔 Semantik va non-semantik

\`\`\`html
<!-- NON-SEMANTIK — faqat ko'rinish, ma'no yo'q -->
<div id="header">Sarlavha</div>
<div id="nav">Navigatsiya</div>
<div id="main">Asosiy kontent</div>
<div id="footer">Pastki qism</div>

<!-- SEMANTIK — ma'noli, brauzer va Google tushunadi -->
<header>Sarlavha</header>
<nav>Navigatsiya</nav>
<main>Asosiy kontent</main>
<footer>Pastki qism</footer>
\`\`\`

Ekranda **ikkalasi bir xil ko'rinadi**. Farq — ko'rinmaydigan joyda:

| Sabab | Tushuntirish |
| --- | --- |
| **SEO** | Google \`<nav>\`, \`<article>\` ni ko'rib sahifani yaxshiroq indekslaydi |
| **Accessibility** | Ekran o'quvchi dasturlar bo'limlar orasida sakrab yura oladi |
| **Kodni o'qish** | Hamkorlar kodni tezroq tushunadi |
| **Standart** | W3C tavsiyasi |

> 💡 Ko'zi ojiz foydalanuvchi "asosiy kontentga o't" deb buyruq beradi. Agar sizda \`<main>\` bo'lmasa — u butun sahifani boshidan tinglashga majbur bo'ladi.

---

## 🏟️ Sahifa tuzilmasi

\`\`\`demo h=380 "Semantik sahifa skeleti"
<style>
  body { padding: 10px; font-size: 14px; }
  header, nav, main, section, article, aside, footer {
    border: 2px dashed; padding: 10px; margin-bottom: 8px; border-radius: 8px;
  }
  header  { border-color: #ef4444; background: #fef2f2; }
  nav     { border-color: #f59e0b; background: #fffbeb; }
  main    { border-color: #3b82f6; background: #eff6ff; }
  section { border-color: #10b981; background: #ecfdf5; }
  article { border-color: #8b5cf6; background: #f5f3ff; }
  aside   { border-color: #ec4899; background: #fdf2f8; }
  footer  { border-color: #6b7280; background: #f9fafb; }
  b { font-family: monospace; font-size: 12px; }
</style>

<header>
  <b>&lt;header&gt;</b> — sahifa yuqori qismi
  <nav><b>&lt;nav&gt;</b> — navigatsiya</nav>
</header>

<main>
  <b>&lt;main&gt;</b> — asosiy kontent (sahifada FAQAT bitta)

  <section>
    <b>&lt;section&gt;</b> — tematik bo'lim
  </section>

  <article>
    <b>&lt;article&gt;</b> — mustaqil kontent (blog posti)
  </article>

  <aside>
    <b>&lt;aside&gt;</b> — yon panel
  </aside>
</main>

<footer>
  <b>&lt;footer&gt;</b> — pastki qism
</footer>
\`\`\`

---

## 🏷️ header, nav, main

\`\`\`html
<!-- Sahifa headeri -->
<header>
  <div class="logo">
    <img src="logo.svg" alt="Kompaniya logosi" />
    <span>MyBrand</span>
  </div>
  <nav aria-label="Asosiy menyu">
    <ul>
      <li><a href="/">Bosh sahifa</a></li>
      <li><a href="/about">Biz haqimizda</a></li>
    </ul>
  </nav>
</header>

<!-- Sahifada FAQAT BITTA main -->
<main id="main-content">
  ...
</main>
\`\`\`

\`header\` faqat sahifaning tepasi emas — **har bir \`article\` ichida ham** bo'lishi mumkin:

\`\`\`html
<article>
  <header>
    <h2>Maqola sarlavhasi</h2>
    <time datetime="2026-01-15">15 Yanvar 2026</time>
  </header>
  <p>Maqola matni...</p>
</article>
\`\`\`

---

## ⚖️ section va article farqi

Bu — 7-darsning eng ko'p savol tug'diradigan joyi. Ikkita oddiy test bor:

**\`<section>\` testi:** *"Bu bo'limga boshqa sahifadan havola ko'rsatarmidim?"*
Ha bo'lsa — \`section\`. Yo'q bo'lsa — oddiy \`div\`.

**\`<article>\` testi:** *"Bu kontentni kesib olib, boshqa saytga qo'ysam ham ma'no beradimi?"*
Ha bo'lsa — \`article\`. Yo'q bo'lsa — \`section\`.

\`\`\`html
<!-- Blog posti — kesib olsa ham ma'noli → article -->
<article>
  <header>
    <h2>JavaScript nima?</h2>
    <time datetime="2026-03-15">15 Mart 2026</time>
  </header>
  <p>JavaScript — brauzerlarning dasturlash tili...</p>
  <footer>Muallif: Ahmadjon</footer>
</article>

<!-- Ichma-ich: section ichida article'lar -->
<section>
  <h2>Blog Postlar</h2>

  <article><h3>HTML asoslari</h3></article>
  <article><h3>CSS dizayn</h3></article>
</section>
\`\`\`

> ⚠️ \`section\` **har doim sarlavhali** bo'ladi. Agar bo'limga \`h2\` yoki \`h3\` yozolmayotgan bo'lsangiz — bu \`section\` emas, \`div\`.

---

## 📰 aside va footer

\`\`\`html
<!-- Yon panel -->
<aside>
  <h3>Teglar</h3>
  <ul><li>HTML</li><li>CSS</li></ul>
</aside>

<!-- Maqola ichida — qo'shimcha ma'lumot -->
<article>
  <p>JavaScript 1995-yilda yaratilgan...</p>
  <aside>
    <p><strong>Bilasizmi?</strong> JavaScript dastlab "Mocha" deb nomlangan.</p>
  </aside>
  <p>Davomi...</p>
</article>
\`\`\`

---

## 🎚️ Foydali kontent teglari

\`\`\`demo h=400 "details, progress, meter, blockquote, time"
<style>
  body { font-size: 14px; }
  section { margin-bottom: 16px; }
  h4 { margin: 0 0 6px; font-size: 13px; color: #6b7280; font-family: monospace; }
  blockquote {
    border-left: 4px solid #3b82f6; padding-left: 16px;
    margin: 0; color: #4b5563; font-style: italic;
  }
  details {
    background: #f9fafb; padding: 10px; border-radius: 8px;
    border: 1px solid #e5e7eb;
  }
  summary { cursor: pointer; font-weight: 600; }
  progress, meter { width: 100%; height: 18px; }
</style>

<section>
  <h4>&lt;details&gt; — akkordeon, JS'siz ishlaydi</h4>
  <details>
    <summary>Ko'proq o'qish (bosing)</summary>
    <p>Bu yashirin kontent edi. HTML o'zi ochib-yopadi — JavaScript kerak emas.</p>
  </details>
</section>

<section>
  <h4>&lt;blockquote&gt; — iqtibos</h4>
  <blockquote>
    HTML — veb-sahifalar yaratish uchun standart belgilash tili.
    <footer style="font-style:normal;font-size:12px">— MDN Web Docs</footer>
  </blockquote>
</section>

<section>
  <h4>&lt;progress&gt; — jarayon</h4>
  <label>HTML bilim darajasi:</label>
  <progress value="85" max="100">85%</progress>
</section>

<section>
  <h4>&lt;meter&gt; — o'lchov</h4>
  <meter value="0.7" min="0" max="1">70%</meter>
</section>

<section>
  <h4>&lt;time&gt; va &lt;mark&gt;</h4>
  <p>
    Nashr: <time datetime="2026-03-22">22 Mart 2026</time> —
    bu <mark>juda muhim</mark> ma'lumot.
  </p>
</section>
\`\`\`

\`<details>\` alohida e'tiborga loyiq: akkordeon (FAQ bo'limi) yasash uchun **JavaScript kerak emas**, HTML o'zi qiladi.

---

## 🏷️ div va span hali ham kerak

\`\`\`html
<!-- DIV — semantik ma'nosi yo'q, lekin layout uchun kerak -->
<div class="container">...</div>
<div class="card">...</div>

<!-- SPAN — matn ichida styling uchun -->
<p>Narx: <span class="price">150 000</span> so'm</p>
<p>Status: <span class="badge">Aktiv</span></p>
\`\`\`

> 💡 **Qoida:** semantik teg mavjud bo'lsa — uni ishlating. Yo'q bo'lsa — \`div\` yoki \`span\`. \`div\` yomon emas, faqat \`header\` o'rniga ishlatilishi yomon.

---

## 📱 Aria attributlari

\`\`\`html
<!-- aria-label — ekran o'quvchi uchun tavsif -->
<button aria-label="Qidiruvni yopish">✕</button>

<!-- aria-expanded — ochiq/yopiq holatni bildiradi -->
<button aria-expanded="false" aria-controls="menu">Menyu</button>

<!-- role — elementga vazifa berish -->
<div role="alert">Xato: Email noto'g'ri!</div>

<!-- aria-hidden — bezak emojini o'quvchidan yashirish -->
<span aria-hidden="true">📧</span> Xabarlar
\`\`\`

Oxirgi misol muhim: emoji ekran o'quvchida "konvert bilan xat" deb o'qiladi va foydalanuvchini chalg'itadi. \`aria-hidden\` uni o'tkazib yuboradi.

---

## 🥉 Bronze Topshiriq

\`header\`, \`main\`, \`footer\` bilan oddiy sahifa tuzing.

\`\`\`demo h=280 "Bronze — natija"
<style>
  body { font-family: Arial, sans-serif; }
  header { background: #1a1a2e; color: white; padding: 16px; border-radius: 8px; }
  header h1 { margin: 0 0 8px; font-size: 20px; }
  nav a { color: #93c5fd; margin-right: 14px; text-decoration: none; font-size: 14px; }
  main { padding: 16px 0; }
  footer { border-top: 1px solid #e5e7eb; padding-top: 12px; font-size: 13px; color: #6b7280; }
</style>

<header>
  <h1>Mening Saytim</h1>
  <nav>
    <a href="#about">Haqimda</a>
    <a href="#projects">Loyihalar</a>
    <a href="#contact">Bog'lanish</a>
  </nav>
</header>

<main>
  <section id="about">
    <h2>Men haqimda</h2>
    <p>Men frontend o'rganmoqdaman.</p>
  </section>
</main>

<footer>
  <p>&copy; 2026 Mening Saytim</p>
</footer>
\`\`\`

---

## 🥈 Silver Topshiriq

Oldingi darslarda yozgan loyihangizni oching va barcha \`<div id="...">\` larni semantik teglarga almashtiring:

\`\`\`html
<!-- OLDIN -->            <!-- KEYIN -->
<div id="header">   →     <header>
<div id="nav">      →     <nav>
<div id="main">     →     <main>
<div id="footer">   →     <footer>
\`\`\`

CSS'da ham selektorlarni yangilashni unutmang: \`#header\` → \`header\`.

---

## 🥇 Gold Topshiriq

To'liq portfolio skeleti: \`header\` + \`nav\` (aria-label bilan), \`main\` ichida ikki \`section\`, biri ichida \`article\`, \`figure\`/\`figcaption\`, \`time\` va \`address\` bilan \`footer\`.

\`\`\`demo h=400 "Gold — natija namunasi"
<style>
  body { font-family: Arial, sans-serif; font-size: 14px; max-width: 620px; }
  header { display: flex; justify-content: space-between; align-items: center;
           padding-bottom: 12px; border-bottom: 2px solid #e5e7eb; }
  .logo { font-weight: 700; letter-spacing: 1px; color: #1a1a2e; }
  nav ul { list-style: none; display: flex; gap: 16px; margin: 0; padding: 0; }
  nav a { color: #4b5563; text-decoration: none; font-size: 13px; }
  nav a:hover { color: #2563eb; }
  section { margin: 20px 0; }
  h2 { font-size: 17px; margin: 0 0 8px; }
  figure { margin: 0 0 10px; }
  figure img { border-radius: 10px; display: block; }
  figcaption { font-size: 12px; color: #6b7280; margin-top: 4px; }
  article { border: 1px solid #e5e7eb; border-radius: 10px; padding: 12px; }
  article h3 { margin: 0 0 6px; font-size: 15px; }
  article footer { border: none; font-size: 12px; color: #9ca3af; }
  footer { border-top: 1px solid #e5e7eb; padding-top: 12px; font-size: 13px; }
  address { font-style: normal; }
</style>

<header>
  <div class="logo">MyPortfolio</div>
  <nav aria-label="Asosiy menyu">
    <ul>
      <li><a href="#about">Haqimda</a></li>
      <li><a href="#projects">Loyihalar</a></li>
    </ul>
  </nav>
</header>

<main>
  <section id="about">
    <h2>Men haqimda</h2>
    <figure>
      <img src="https://picsum.photos/id/1005/120/120" alt="Mening rasmim" />
      <figcaption>Frontend Developer</figcaption>
    </figure>
    <p>HTML va CSS o'rganmoqdaman, tez orada JavaScript.</p>
  </section>

  <section id="projects">
    <h2>Loyihalarim</h2>
    <article>
      <h3>Portfolio Sayt</h3>
      <p>HTML va CSS bilan yaratilgan birinchi loyiham.</p>
      <footer><time datetime="2026-03">Mart 2026</time></footer>
    </article>
  </section>
</main>

<footer>
  <address><a href="mailto:me@example.com">me@example.com</a></address>
  <p><small>&copy; 2026</small></p>
</footer>
\`\`\`

---

## ✅ Dars Xulosa

| Teg | Qachon |
| --- | --- |
| \`<header>\` | Sahifa yoki bo'lim yuqori qismi |
| \`<nav>\` | Navigatsiya havolalari |
| \`<main>\` | Asosiy kontent — sahifada faqat 1 ta |
| \`<section>\` | Tematik bo'lim, har doim sarlavhali |
| \`<article>\` | Mustaqil kontent (blog, xabar) |
| \`<aside>\` | Yon kontent, qo'shimcha ma'lumot |
| \`<footer>\` | Sahifa yoki bo'lim pastki qismi |
| \`<figure>\` | Rasm + izoh |
| \`<details>\` | Akkordeon — JS'siz |
| \`<div>\` | Semantik ma'no kerak bo'lmaganda |

> 🚀 **Keyingi dars:** Flexbox — elementlarni gorizontal, vertikal va markazga joylashtirish!
`,
    teacher: `
## 💡 O'qituvchi uchun

- Semantik teglarning **ta'siri ko'rinmaydi** — bu darsning asosiy qiyinchiligi. Bola "baribir bir xil-ku" deydi. Yechimi: brauzerning ekran o'quvchisini (Windows'da Narrator, Ctrl+Win+Enter) 30 soniyaga yoqing va \`div\` li sahifani tinglating. Bir marta eshitgan bola boshqa unutmaydi.
- \`section\` va \`article\` farqini ta'rif bilan emas, **savol bilan** o'rgating. Darsdagi ikki testni doskaga yozib qo'ying va har misolda birga so'rang.
- \`<details>\` ni albatta ko'rsating — bolalar "JavaScript'siz akkordeon" ni ko'rib hayratlanadi va bu HTML'ga qiziqish uyg'otadi.

## ⚠️ Tekshirishda e'tibor bering

- \`<main>\` bittadan ko'pmi? Bu — eng ko'p uchraydigan xato.
- \`<section>\` sarlavhasiz qolganmi? Sarlavhasiz section — aslida div.
- Hamma joyga \`article\` yozib chiqilganmi? Ba'zi bolalar yangi tegni topib, hamma joyda ishlatishni boshlaydi.
- \`<nav>\` ichida \`<ul>\` bormi? Menyu — bu linklar ro'yxati, shunchaki bir qator \`<a>\` emas.
- CSS selektorlari yangilanganmi? \`#header\` qolib ketsa, stil yo'qoladi — bu Silver topshiriqda ko'p uchraydi.

## 📊 Daraja belgilash

- **Bronze** — header/main/footer bor, tuzilma to'g'ri
- **Silver** — eski div'lar almashtirilgan, CSS ham yangilangan, sayt buzilmagan
- **Gold** — section va article farqini **to'g'ri qo'llagan** va tushuntira oladi, aria-label bor

> Gold uchun eng muhim savol: "Nega bu yerda article, u yerda section?"
`,
  },

  // ═══════════════════════════════════════════════════════════
  'junior.m1.l10': {
    goal: ":hover, CSS transitions va transform bilan saytni jonli va interaktiv qilish.",
    student: `
## 👀 Psevdo-klasslar

Psevdo-klasslar — elementning **holati** yoki **joylashuvi** ga qarab stil berish.

\`\`\`demo h=320 "Holat psevdo-klasslari — sinab ko'ring"
<style>
  body { font-size: 14px; }
  .box { padding: 12px; margin-bottom: 8px; border-radius: 8px;
         background: #f3f4f6; border: 2px solid transparent; }

  .h:hover  { background: #dbeafe; border-color: #3b82f6; }
  .a:active { background: #fee2e2; border-color: #ef4444; }

  input { padding: 8px; border: 2px solid #d1d5db; border-radius: 6px;
          width: 200px; outline: none; }
  input:focus { border-color: #8b5cf6; background: #f5f3ff; }
  input:disabled { background: #e5e7eb; color: #9ca3af; }

  li:nth-child(odd)  { background: #eff6ff; }
  li:nth-child(even) { background: #f9fafb; }
  li { padding: 6px 10px; list-style: none; }
  ul { padding: 0; margin: 8px 0 0; }
</style>

<div class="box h">:hover — kursorni ustimga olib keling</div>
<div class="box a">:active — bosib turing</div>

<p style="margin:12px 0 4px">:focus — ichiga bosing</p>
<input placeholder="Bu yerga yozing" />

<p style="margin:12px 0 4px">:disabled</p>
<input placeholder="O'chirilgan" disabled />

<p style="margin:12px 0 0">:nth-child(odd) va (even) — zebra jadval</p>
<ul>
  <li>1-qator</li>
  <li>2-qator</li>
  <li>3-qator</li>
  <li>4-qator</li>
</ul>
\`\`\`

Boshqa foydalilari: \`:first-child\`, \`:last-child\`, \`:nth-child(3n)\` (har 3-chisi), \`:not(.active)\`.

---

## 🖌️ Psevdo-elementlar: ::before va ::after

Bular HTML'da **yo'q**, lekin CSS ularni yaratadi. \`content\` majburiy.

\`\`\`demo h=260 "::before va ::after"
<style>
  body { font-size: 15px; }

  .quote::before { content: '❝ '; color: #8b5cf6; font-size: 24px; }
  .quote::after  { content: ' ❞'; color: #8b5cf6; font-size: 24px; }

  .required::after { content: ' *'; color: #ef4444; font-weight: 700; }

  .badge::before {
    content: '';
    display: inline-block;
    width: 8px; height: 8px;
    background: #10b981;
    border-radius: 50%;
    margin-right: 6px;
  }

  p { margin: 12px 0; }
</style>

<p class="quote">Kod yozish — fikrlashning bir turi</p>
<p class="required">Email manzil</p>
<p class="badge">Onlayn</p>
\`\`\`

Uchinchi misolda yashil nuqta — HTML'da yo'q. U butunlay CSS bilan yasalgan.

---

## ✨ Transitions — silliq o'tish

\`\`\`demo h=300 "transition bor va yo'q"
<style>
  .btn {
    padding: 14px 28px; border: none; border-radius: 8px;
    color: white; font-size: 15px; cursor: pointer;
    display: block; margin-bottom: 12px; width: 220px;
  }

  .no-trans { background: #ef4444; }
  .no-trans:hover { background: #7f1d1d; }

  .with-trans { background: #10b981; transition: background-color 0.4s ease; }
  .with-trans:hover { background: #064e3b; }

  .lbl { font-family: monospace; font-size: 12px; color: #6b7280; margin: 0 0 4px; }
</style>

<p class="lbl">transition YO'Q — rang sakrab o'zgaradi</p>
<button class="btn no-trans">Ustimga keling</button>

<p class="lbl">transition: 0.4s — rang silliq oqadi</p>
<button class="btn with-trans">Ustimga keling</button>
\`\`\`

\`\`\`css
element {
  transition: property duration timing-function delay;
}

.button {
  transition: background-color 0.3s ease;        /* bitta xususiyat */
  transition: background-color 0.3s, color 0.2s; /* bir nechta */
  transition: all 0.3s ease;                     /* hammasi */
}
\`\`\`

### Timing function

\`\`\`demo h=280 "linear / ease / ease-in / ease-out"
<style>
  .track { background: #f3f4f6; border-radius: 8px; padding: 6px;
           margin-bottom: 8px; overflow: hidden; }
  .ball { width: 34px; height: 34px; border-radius: 50%;
          background: #6366f1; color: white; font-size: 11px;
          display: flex; align-items: center; justify-content: center; }
  .track:hover .ball { transform: translateX(320px); }

  .t1 .ball { transition: transform 1.2s linear; }
  .t2 .ball { transition: transform 1.2s ease; }
  .t3 .ball { transition: transform 1.2s ease-in; }
  .t4 .ball { transition: transform 1.2s ease-out; }
</style>

<p style="font-size:13px;color:#6b7280;margin:0 0 8px">
  Har qatorga kursorni olib keling — tezlanish farqini kuzating
</p>

<div class="track t1"><div class="ball">lin</div></div>
<div class="track t2"><div class="ball">ease</div></div>
<div class="track t3"><div class="ball">in</div></div>
<div class="track t4"><div class="ball">out</div></div>
\`\`\`

| Animatsiya turi | Tavsiya etilgan vaqt |
| --- | --- |
| Hover tugma | 0.2s – 0.3s |
| Panel ochish | 0.3s – 0.5s |
| Sahifa o'tish | 0.4s – 0.6s |
| Loading | 1s – 2s |

> ⚠️ 1 soniyadan uzun hover animatsiyasi — foydalanuvchini asabiylashtiradi. Sayt "sekin" tuyuladi.

---

## 💡 Transform

\`\`\`demo h=300 "translate / scale / rotate / skew"
<style>
  .grid { display: flex; gap: 12px; flex-wrap: wrap; }
  .t { width: 100px; height: 80px; background: #6366f1; color: white;
       border-radius: 8px; display: flex; align-items: center;
       justify-content: center; font-size: 12px; text-align: center;
       transition: transform 0.4s ease; cursor: pointer; }

  .t1:hover { transform: translateY(-20px); }
  .t2:hover { transform: scale(1.25); }
  .t3:hover { transform: rotate(15deg); }
  .t4:hover { transform: skewX(-12deg); }
  .t5:hover { transform: translateY(-10px) scale(1.1) rotate(-5deg); }
</style>

<p style="font-size:13px;color:#6b7280;margin:0 0 10px">Har biriga kursorni olib keling</p>

<div class="grid">
  <div class="t t1">translateY<br>(-20px)</div>
  <div class="t t2">scale<br>(1.25)</div>
  <div class="t t3">rotate<br>(15deg)</div>
  <div class="t t4">skewX<br>(-12deg)</div>
  <div class="t t5">uchtasi<br>birga</div>
</div>
\`\`\`

> 💡 \`transform\` **layout'ga ta'sir qilmaydi** — element vizual siljiydi, lekin qo'shnilari joyidan qimirlamaydi. Shuning uchun animatsiya uchun \`margin\` emas, \`transform\` ishlatiladi: u ancha tez ishlaydi.

---

## 🎨 Amaliy hover effektlar

\`\`\`demo h=340 "5 ta klassik effekt"
<style>
  body { display: flex; flex-wrap: wrap; gap: 16px; align-items: flex-start; }

  /* 1. Ko'tariladigan tugma */
  .btn {
    padding: 12px 26px; background: #3498db; color: white; border: none;
    border-radius: 8px; cursor: pointer; font-size: 14px;
    transition: background-color 0.2s, transform 0.2s, box-shadow 0.2s;
  }
  .btn:hover { background: #2980b9; transform: translateY(-3px);
               box-shadow: 0 8px 20px rgba(52,152,219,0.45); }
  .btn:active { transform: translateY(0); box-shadow: none; }

  /* 2. Outline → to'ldirilgan */
  .outline-btn {
    padding: 12px 26px; background: transparent; color: #8b5cf6;
    border: 2px solid #8b5cf6; border-radius: 8px; cursor: pointer;
    font-size: 14px; transition: background-color 0.3s, color 0.3s;
  }
  .outline-btn:hover { background: #8b5cf6; color: white; }

  /* 3. Ko'tariladigan karta */
  .card {
    background: white; border-radius: 14px; padding: 20px; width: 160px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08); font-size: 13px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .card:hover { transform: translateY(-8px); box-shadow: 0 20px 36px rgba(0,0,0,0.16); }

  /* 4. Rasm zoom */
  .img-wrap { overflow: hidden; border-radius: 12px; width: 160px; }
  .img-wrap img { width: 100%; display: block; transition: transform 0.5s ease; }
  .img-wrap:hover img { transform: scale(1.15); }

  /* 5. Chiziq chizadigan link */
  .nav-link {
    color: #374151; text-decoration: none; position: relative;
    padding-bottom: 5px; font-size: 15px; display: inline-block;
  }
  .nav-link::after {
    content: ''; position: absolute; left: 0; bottom: 0;
    width: 0; height: 2px; background: #3498db;
    transition: width 0.3s ease;
  }
  .nav-link:hover::after { width: 100%; }
</style>

<button class="btn">Ko'tariladi</button>
<button class="outline-btn">To'ladi</button>
<div class="card"><b>Karta</b><br>Ustiga keling</div>
<div class="img-wrap"><img src="https://picsum.photos/id/1015/240/150" alt="Manzara" /></div>
<a href="#" class="nav-link">Chiziq chizadi</a>
\`\`\`

Beshinchi effekt \`::after\` bilan qilingan — chiziq HTML'da yo'q, \`width: 0\` dan \`100%\` ga o'sadi.

---

## 🎥 @keyframes — murakkab animatsiyalar

\`\`\`demo h=280 "pulse / spin / fadeIn"
<style>
  body { display: flex; gap: 30px; align-items: center; }

  @keyframes pulse {
    0%   { transform: scale(1); }
    50%  { transform: scale(1.15); }
    100% { transform: scale(1); }
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .logo {
    width: 70px; height: 70px; background: #ef4444; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    color: white; font-weight: 700;
    animation: pulse 2s ease-in-out infinite;
  }

  .loader {
    width: 46px; height: 46px;
    border: 5px solid #e5e7eb;
    border-top-color: #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .fade {
    animation: fadeIn 1.2s ease-out infinite;
    font-size: 14px; background: #ecfdf5; padding: 12px 16px;
    border-radius: 8px; color: #065f46;
  }
</style>

<div class="logo">LOGO</div>
<div class="loader"></div>
<div class="fade">fadeIn</div>
\`\`\`

Ikkinchisi — haqiqiy loader. \`border-top-color\` boshqa rangda, doira aylanadi.

\`\`\`css
.element {
  animation: fadeIn 0.5s ease-out 0.2s 1 normal forwards;
  /*         nomi   vaqt  timing  kechikish  marta  yo'nalish  tugagach */
}
\`\`\`

\`forwards\` — animatsiya tugagach oxirgi holatda qoladi. Busiz element boshlang'ich holatiga qaytadi.

---

## 📱 box-shadow

\`\`\`demo h=260 "Soya darajalari"
<style>
  body { display: flex; gap: 18px; flex-wrap: wrap; }
  .s { width: 110px; height: 80px; background: white; border-radius: 12px;
       display: flex; align-items: center; justify-content: center;
       font-size: 12px; color: #4b5563; }
  body { background: #f3f4f6; padding: 24px; }

  .s1 { box-shadow: 0 1px 2px rgba(0,0,0,0.06); }
  .s2 { box-shadow: 0 4px 12px rgba(0,0,0,0.10); }
  .s3 { box-shadow: 0 16px 40px rgba(0,0,0,0.18); }
  .s4 { box-shadow: 0 8px 24px rgba(52,152,219,0.5); }
  .s5 { box-shadow: inset 0 3px 8px rgba(0,0,0,0.15); }
</style>

<div class="s s1">kichik</div>
<div class="s s2">o'rta</div>
<div class="s s3">katta</div>
<div class="s s4">rangli</div>
<div class="s s5">inset</div>
\`\`\`

Sintaksis: \`box-shadow: x y blur spread color\`. Soya qanchalik katta bo'lsa, element shunchalik "ko'tarilgan" tuyuladi.

---

## 🥉 Bronze Topshiriq

Tugma yasang: hover'da rangi o'zgarsin, \`transition\` bilan silliq bo'lsin.

---

## 🥈 Silver Topshiriq

Rasm yasang: hover'da \`scale(1.05)\` bilan kattalashsin va soya chiqsin. \`overflow: hidden\` bilan o'ralgan bo'lsin.

---

## 🥇 Gold Topshiriq — animatsiyali navigatsiya

Chiziq **o'rtadan ikki tomonga** kengaysin (\`left: 50%\` → \`left: 0\`, \`width: 0\` → \`100%\`):

\`\`\`demo h=240 "Gold — natija namunasi"
<style>
  body { background: #f9fafb; padding: 20px; }
  .navbar {
    display: flex; gap: 36px; padding: 20px 24px;
    background: white; border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  }

  .nav-link {
    color: #555; text-decoration: none; font-weight: 500; font-size: 15px;
    position: relative; padding-bottom: 6px; transition: color 0.25s;
  }

  .nav-link::after {
    content: '';
    position: absolute;
    left: 50%;          /* o'rtadan boshlanadi */
    bottom: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, #3498db, #9b59b6);
    transition: width 0.3s ease, left 0.3s ease;
    border-radius: 2px;
  }

  .nav-link:hover { color: #1a1a2e; }
  .nav-link:hover::after { width: 100%; left: 0; }
</style>

<nav class="navbar">
  <a href="#" class="nav-link">Bosh sahifa</a>
  <a href="#" class="nav-link">Portfolio</a>
  <a href="#" class="nav-link">Blog</a>
  <a href="#" class="nav-link">Bog'lanish</a>
</nav>
\`\`\`

---

## ✅ Dars Xulosa

- **:hover, :focus, :active** — eng ko'p ishlatiladigan psevdo-klasslar
- **transition** — 0.2s–0.4s optimal; uzun animatsiya sayt sekin tuyulishiga olib keladi
- **transform** — layout'ga ta'sir qilmaydi, shuning uchun tez ishlaydi
- **::before, ::after** — HTML qo'shmasdan element yaratish, \`content\` majburiy
- **@keyframes** — murakkab va takrorlanuvchi animatsiyalar
- **box-shadow** — chuqurlik va ko'tarilish hissi

> 🚀 **Keyingi dars:** Portfolio — 1-oyda o'rganilgan hamma narsani bitta saytda jamlash!
`,
    teacher: `
## 💡 O'qituvchi uchun

- Bu — 1-oyning eng "zavqli" darsi. Bolalar animatsiyani yoqtiradi, shuning uchun **haddan oshib ketish** xavfi bor. Boshidanoq qoida o'rnating: "bir sahifada 2-3 xil effekt, ko'p emas".
- \`transition\` ni tushuntirishning eng tez yo'li — demoda transition'siz va transition'li tugmalarni yonma-yon bosdirish. So'z kerak emas.
- \`transform\` va \`margin\` farqini ko'rsating: \`margin-top\` bilan animatsiya qilinsa, qo'shni elementlar ham siljiydi va "sakrash" chiqadi. \`transform\` bilan — yo'q.
- \`::after\` bilan chiziq chizish — bolalar uchun "sehr". Buni sekin, bosqichma-bosqich ko'rsating: avval \`content: ''\` va \`background\`, keyin \`position: absolute\`, keyin \`width: 0\`.

## ⚠️ Tekshirishda e'tibor bering

- \`transition\` **hover ichida** yozilganmi? Bu klassik xato — u asosiy selektorda bo'lishi kerak, aks holda faqat kirishda ishlaydi, chiqishda sakraydi.
- \`transition: all\` ishlatilganmi? Ishlaydi, lekin sekin. Aniq xususiyat yozish yaxshiroq.
- \`::after\` da \`content: ''\` yozilganmi? Busiz element umuman paydo bo'lmaydi.
- \`position: absolute\` ishlatilgan bo'lsa, otasida \`position: relative\` bormi?
- \`animation: infinite\` bilan sahifa "chaqnab" turmayaptimi? Bu ba'zi bolalarda bosh og'rig'i keltirishi mumkin.

## 📊 Daraja belgilash

- **Bronze** — hover ishlaydi, transition bor va silliq
- **Silver** — transform va box-shadow birga, overflow to'g'ri
- **Gold** — ::after bilan chiziq, ikki tomonga kengayadi, gradient ishlatilgan

> Gold'ni tekshirishda so'rang: "\`left: 50%\` nima uchun kerak?" Javob bera olsa — tushungan.
`,
  },

  // ═══════════════════════════════════════════════════════════
  'junior.m1.l3': {
    goal: "1–2 darslarda o'rganilgan HTML elementlarini bitta kichik loyihada mustaqil qo'llash.",
    student: `
## 🎯 Topshiriq

Tanlagan mashhur shaxsingiz — sportchi, musiqachi, aktyor yoki olim — haqida to'liq HTML sahifa yarating.

> 💡 **Kimni tanlash kerak?** O'zingiz qiziqadigan odamni. Bu loyihani 2 soat yozasiz — zerikarli mavzu tanlasangiz, o'zingizga qiyin bo'ladi.

---

## 📋 Talablar

| # | Talab | Teg |
| --- | --- | --- |
| 1 | 1 ta rasm (alt attributi bilan) | \`<img>\` |
| 2 | Ism sarlavha sifatida | \`<h1>\` |
| 3 | Qisqacha tarjimai hol | \`<h2>\`, \`<p>\` |
| 4 | Yutuqlari ro'yxati | \`<ol>\` yoki \`<ul>\` |
| 5 | Instagram yoki rasmiy sahifaga havola | \`<a target="_blank">\` |
| BONUS | Sevimli iqtibosi | \`<blockquote>\` |

---

## 💻 Natija taxminan shunday bo'ladi

\`\`\`demo h=400 "Namuna — o'zingiznikini yozing"
<style>
  body { font-family: Georgia, serif; max-width: 560px; line-height: 1.6; }
  h1 { font-size: 30px; margin: 0 0 4px; }
  h2 { font-size: 19px; margin: 22px 0 6px; color: #374151; }
  figure { margin: 12px 0; }
  figure img { border-radius: 10px; display: block; }
  figcaption { font-size: 12px; color: #6b7280; margin-top: 5px; }
  blockquote {
    border-left: 4px solid #f59e0b; padding-left: 16px; margin: 0;
    font-style: italic; color: #4b5563;
  }
  blockquote footer { font-size: 13px; font-style: normal; margin-top: 6px; }
  a { color: #2563eb; }
  ol, ul { padding-left: 22px; }
  li { margin-bottom: 4px; }
</style>

<h1>Qahramonning ismi</h1>

<figure>
  <img src="https://picsum.photos/id/1074/300/190" alt="Qahramonning rasmi" />
  <figcaption>Qisqacha izoh — kim, qayerda, qachon</figcaption>
</figure>

<h2>Kim u?</h2>
<p>
  <strong>To'liq ismi</strong> falon yilda falon joyda tug'ilgan. U
  <em>nima bilan mashhur</em> ekanini shu yerda yozasiz va
  <mark>eng muhim yutug'ini</mark> ajratib ko'rsatasiz.
</p>

<h2>Yutuqlari</h2>
<ol>
  <li>Birinchi katta yutug'i</li>
  <li>Ikkinchi yutug'i</li>
  <li>Uchinchi yutug'i</li>
</ol>

<h2>Sevimli iqtibosi</h2>
<blockquote>
  "Bu yerga uning mashhur gapini yozing."
  <footer>— Qahramonning ismi</footer>
</blockquote>

<h2>Qiziqarli faktlar</h2>
<ul>
  <li>Ko'pchilik bilmaydigan fakt</li>
  <li>Yana bitta qiziq narsa</li>
</ul>

<h2>Ko'proq ma'lumot</h2>
<p><a href="#" target="_blank" rel="noopener noreferrer">📸 Instagram profili</a></p>
<p><a href="#" target="_blank" rel="noopener noreferrer">📚 Wikipedia</a></p>
\`\`\`

> ⚠️ Bu — **namuna**, ko'chirib olish uchun emas. Kodni o'zingiz noldan yozing. Yozayotib esdan chiqarsangiz, oldingi darslarga qaytib qarang — bu normal, hamma shunday qiladi.

---

## 🏗 Boshlash tartibi

Noldan boshlash qiyin tuyulsa, shu tartibda boring:

1. \`!\` + Tab bilan HTML skeletini yarating
2. \`<title>\` ni to'ldiring
3. \`<h1>\` ga ismni yozing — **brauzerda ochib tekshiring**
4. Rasm qo'shing, \`alt\` ni to'ldiring — **yana tekshiring**
5. Tarjimai holni yozing
6. Ro'yxatni qo'shing
7. Havolalarni qo'shing
8. Bonus: iqtibos

> 💡 Har 2-3 qadamda brauzerni yangilab ko'ring. 50 qator yozib, keyin "nega ishlamayapti?" deb qidirishdan ko'ra, kichik qadamlar bilan borish osonroq.

---

## ✅ Topshirishdan oldin tekshiring

- \`<!DOCTYPE html>\` va \`<html lang="uz">\` bormi?
- \`<meta charset="UTF-8">\` bormi? (bo'lmasa o'zbek harflari buziladi)
- \`<title>\` to'ldirilganmi?
- Kamida 1 ta \`<img>\` bor va \`alt\` **mazmunli** yozilganmi?
- \`<h1>\` faqat bittami?
- Kamida 1 ta \`<ol>\` yoki \`<ul>\` bormi?
- Havolada \`target="_blank" rel="noopener noreferrer"\` bormi?
- Barcha teglar yopilganmi?
- Brauzerda ochib ko'rdingizmi?

> 🚀 **Keyingi dars:** CSS — sahifani chiroyli qilish vaqti keldi!
`,
    teacher: `
## 💡 O'qituvchi uchun

> Bu — **birinchi mustaqil loyiha**. Sifatdan ko'ra jarayon muhimroq.

- Bolalar turli tezlikda ishlaydi — bu **normal**. Tez tugatganlarga bonus topshiriq bermang, ularni **sekin ishlayotganlarga yordamchi** qiling. Tushuntirish — o'rganishning eng kuchli usuli.
- Har bir o'quvchiga **ijobiy fikr** bildiring. Birinchi loyihada tanqid ruhni tushiradi.
- Xato bo'lsa ham taqdim ettirsin. "Menda ishlamadi" ham natija — nima ishlamaganini aytib bersin.
- Mavzu tanlashga 5 daqiqadan ko'p vaqt bermang. Ba'zi bolalar shu yerda qotib qoladi.

## ⚠️ Bu darsda ko'p uchraydigan holatlar

- **Rasm ko'rinmayapti** — 90% hollarda fayl yo'li xato yoki rasm papkasi boshqa joyda. Internetdan URL olishni taklif qiling.
- **O'zbek harflari kvadrat bo'lib chiqyapti** — \`charset\` yo'q. Buni sinfda bir marta ko'rsating, hamma eslab qoladi.
- **Hamma narsa bitta qatorda** — \`<p>\` o'rniga \`<br>\` ishlatgan. Farqini tushuntiring.
- **Ko'chirib olish** — namunani so'zma-so'z ko'chirganlar bo'ladi. Buni jazolamang, lekin so'rang: "\`<mark>\` nima qiladi?" Javob bermasa — birga o'qib chiqing.

## 📊 Daraja belgilash

- **Bronze** — 5 ta talabdan kamida 4 tasi bajarilgan, sahifa ochiladi
- **Silver** — hammasi bajarilgan, alt matnlari mazmunli, teglar to'g'ri yopilgan
- **Gold** — bonus iqtibos bor, figure/figcaption ishlatilgan, kod tartibli (indentatsiya to'g'ri)

> Bu darsda Gold ni ko'p bermang — hali CSS yo'q, sahifa baribir oddiy ko'rinadi. Gold — **kod tozaligi** uchun.
`,
  },

  // ═══════════════════════════════════════════════════════════
  'junior.m1.l9': {
    goal: "Semantik HTML + Flexbox bilan real Instagram profil sarlavhasini qayta yaratish.",
    student: `
## 🎯 Topshiriq

Instagram profil sahifasining yuqori qismini HTML va CSS bilan qayta yarating.

**Bo'lishi shart:**

- Doiraviy avatar rasm
- Profil statistikasi (postlar, obunachilar, obunalar)
- Ism va bio
- Tugmalar

> ⚠️ **Asosiy qoida:** barcha joylashuv **faqat Flexbox** bilan. \`position: absolute\` bu darsda **taqiqlangan**. Sabab — Flexbox'ni mustahkamlash. Absolute bilan qilish osonroq, lekin siz Flexbox o'rganyapsiz.

---

## 💻 Natija

\`\`\`demo h=400 "Instagram profil header"
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: #fafafa;
    color: #262626;
    padding: 16px;
  }

  .profile-header {
    display: flex;
    align-items: flex-start;
    gap: 40px;
    padding-bottom: 24px;
    border-bottom: 1px solid #dbdbdb;
  }

  .avatar-wrapper { flex-shrink: 0; }

  .avatar {
    width: 120px; height: 120px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid white;
    outline: 3px solid #dd2a7b;
  }

  .profile-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .profile-top {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .username { font-size: 19px; font-weight: 400; }

  .btn {
    padding: 7px 16px; border-radius: 8px; font-size: 13px;
    font-weight: 600; cursor: pointer; border: none;
    transition: background-color 0.2s;
  }
  .btn-follow  { background: #0095f6; color: white; }
  .btn-follow:hover { background: #1877f2; }
  .btn-message { background: #efefef; color: #262626; }
  .btn-message:hover { background: #dbdbdb; }

  .stats { display: flex; gap: 32px; list-style: none; }
  .stat { display: flex; gap: 5px; font-size: 14px; }
  .stat-number { font-weight: 700; }

  .bio { display: flex; flex-direction: column; gap: 3px; font-size: 14px; }
  .full-name { font-weight: 600; }
  .bio-text { line-height: 1.5; }
  .bio-link { color: #00376b; text-decoration: none; font-weight: 600; }
  .bio-link:hover { text-decoration: underline; }
</style>

<header class="profile-header">
  <div class="avatar-wrapper">
    <img class="avatar" src="https://picsum.photos/id/64/150/150" alt="Profil rasmi" />
  </div>

  <div class="profile-info">
    <div class="profile-top">
      <h2 class="username">ahmadjon.dev</h2>
      <button class="btn btn-follow">Kuzatish</button>
      <button class="btn btn-message">Xabar</button>
    </div>

    <ul class="stats">
      <li class="stat"><span class="stat-number">42</span><span>postlar</span></li>
      <li class="stat"><span class="stat-number">1 204</span><span>obunachilar</span></li>
      <li class="stat"><span class="stat-number">387</span><span>obunalar</span></li>
    </ul>

    <div class="bio">
      <p class="full-name">Ahmadjon Toshmatov</p>
      <p class="bio-text">
        Frontend Developer 💻<br />
        HTML • CSS • JavaScript<br />
        Toshkent, O'zbekiston 🇺🇿
      </p>
      <a href="#" class="bio-link">🔗 github.com/ahmadjon</a>
    </div>
  </div>
</header>
\`\`\`

---

## 📊 Flex tuzilmasini tushunish

Bu loyihada Flexbox **ichma-ich** ishlatiladi — bu eng muhim tushuncha:

\`\`\`text
profile-header       [flex, align-items: flex-start]
  ├── avatar-wrapper [flex-shrink: 0]  ← siqilmasin!
  └── profile-info   [flex: 1, flex-direction: column]
        ├── profile-top  [flex, align-items: center]
        ├── stats        [flex, gap: 32px]
        └── bio          [flex-direction: column]
\`\`\`

Tashqi konteyner **qator** (row), ichkarisi esa **ustun** (column). Bitta sahifada ikkala yo'nalish ham ishlatilishi — bu normal va tez-tez uchraydi.

Ikki muhim nuqta:

- \`flex-shrink: 0\` avatarga — busiz joy yetmaganda avatar ezilib, oval bo'lib qoladi
- \`flex: 1\` profile-info ga — qolgan bo'sh joyni to'liq egallaydi

---

## 🧪 O'zingiz sinab ko'ring

Yuqoridagi demoni "O'zgartirib ko'rish" bilan oching va quyidagilarni sinab ko'ring:

1. \`.avatar-wrapper\` dan \`flex-shrink: 0\` ni o'chiring — avatar qanday o'zgaradi?
2. \`.profile-header\` da \`align-items: flex-start\` ni \`center\` ga almashtiring
3. \`.stats\` dan \`display: flex\` ni o'chiring — statistika qanday joylashadi?
4. \`.profile-info\` dan \`flex-direction: column\` ni o'chiring

Har o'zgarishdan keyin **nima uchun shunday bo'ldi** deb o'ylab ko'ring.

---

## 🥇 Gold Challenge

Instagram'ning gradient "story ring" halqasi va tasdiqlangan belgisi:

\`\`\`demo h=280 "Gold — gradient ring va verified"
<style>
  body { font-family: sans-serif; display: flex; align-items: center; gap: 24px; }

  /* Gradient halqa — ikki fon qatlami bilan */
  .avatar-ring {
    width: 110px; height: 110px;
    border-radius: 50%;
    padding: 3px;
    background: linear-gradient(135deg, #f58529, #dd2a7b, #8134af, #515bd4);
  }
  .avatar-ring img {
    width: 100%; height: 100%;
    border-radius: 50%;
    border: 3px solid white;
    object-fit: cover;
    display: block;
  }

  /* Tasdiqlangan belgi — ::after bilan */
  .username {
    font-size: 19px;
    font-weight: 500;
  }
  .username::after {
    content: ' ✔';
    color: #0095f6;
    font-size: 15px;
  }
</style>

<div class="avatar-ring">
  <img src="https://picsum.photos/id/64/150/150" alt="Profil rasmi" />
</div>

<h2 class="username">ahmadjon.dev</h2>
\`\`\`

Halqa siri: tashqi \`div\` ga gradient fon, kichik \`padding\`, ichkaridagi rasmga oq \`border\`. Halqa aslida — ko'rinib turgan padding.

---

## ✅ Tekshirish ro'yxati

- Avatar doira shaklidami (\`border-radius: 50%\`)?
- Header gorizontalmi (\`flex\`, \`row\`)?
- Statistika yonma-yonmi?
- Tugmalar bir qatordami?
- Bio vertikalmi (\`flex-direction: column\`)?
- **Hech qayerda \`position: absolute\` yo'qmi?**
- Oyna kichraytirilganda tuzilma buzilmayaptimi?
- DevTools'da har elementning Box Model'ini tekshirdingizmi?

> 🚀 **Keyingi dars:** Hover effektlar va Transitions!
`,
    teacher: `
## 💡 O'qituvchi uchun

- Bu — Flexbox'ni **mustahkamlash** darsi, yangi mavzu emas. Yangi xususiyat kiritmang; bolalar 8-darsdagi bilimni ishlatishi kerak.
- \`position: absolute\` taqig'i muhim. Ba'zi bolalar internetdan yechim topib, absolute bilan qiladi. Buni darhol to'xtating va sababini tushuntiring: "Instagram'ning o'zi buni flex bilan qilgan".
- **Ichma-ich flex** — bu darsning asosiy o'rganish nuqtasi. Doskaga daraxt chizib, qaysi konteyner row, qaysi biri column ekanini birga belgilang.
- DevTools'da elementga bosilganda Flexbox belgisi chiqadi (Chrome'da kichik "flex" tugmasi). Uni bosib, flex chiziqlarini ko'rsating — bolalar buni juda yoqtiradi.

## ⚠️ Ko'p uchraydigan xatolar

- **Avatar oval bo'lib qolgan** — \`flex-shrink: 0\` yo'q yoki \`object-fit: cover\` yozilmagan. Ikkalasini ham tekshiring.
- **\`border-radius: 50%\` ishlamayapti** — kenglik va balandlik teng emas.
- **Statistika ustun bo'lib qolgan** — \`.stats\` ga \`display: flex\` berilmagan. \`ul\` standart holatda vertikal.
- **\`list-style: none\` unutilgan** — statistika oldida nuqtalar turibdi.
- **Hammasi bitta ustunda** — tashqi konteynerga \`display: flex\` berilmagan.
- **Reset yozilmagan** — \`ul\` ning standart \`padding\` i tuzilmani suradi.

## 📊 Daraja belgilash

- **Bronze** — avatar doira, header gorizontal, asosiy elementlar joyida
- **Silver** — ichma-ich flex to'g'ri, tugmalar va statistika joyida, absolute yo'q
- **Gold** — gradient ring, verified belgisi, oyna kichraytirilganda ham buzilmaydi

> Silver'ni tekshirishda so'rang: "\`flex: 1\` nima qildi?" va "\`flex-shrink: 0\` nima uchun kerak?"
`,
  },

  // ═══════════════════════════════════════════════════════════
  'junior.m1.l11': {
    goal: "1-oyda o'rganilgan HTML5 + CSS3 + Flexbox + animatsiyalar bilan shaxsiy portfolio sayt yaratish.",
    student: `
## 💼 Portfolio nima?

Portfolio — frontend developer uchun **vizitka-sayt**. Ishga yollanishda birinchi tekshiriladigan narsa.

Yaxshi portfolio nima beradi:

- Real loyihalaringizni bir joyda ko'rsatadi
- Imkoniyatlaringizni gapirmasdan isbotlaydi
- Sizni "o'rganayotgan odam" emas, **"ishlaydigan developer"** sifatida ko'rsatadi

> 💡 Bu loyiha bir marta yozilib tashlanmaydi. Uni butun kurs davomida yangilab borasiz — har yangi loyiha shu yerga qo'shiladi.

---

## 🗂️ Fayl tuzilmasi

\`\`\`text
portfolio/
├── index.html
├── style.css
└── images/
    ├── avatar.jpg
    └── project-1.jpg
\`\`\`

---

## 🎨 Natija

\`\`\`demo h=420 "Portfolio — hero va ko'nikmalar"
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --primary: #3498db;
    --primary-dark: #2980b9;
    --text: #1a1a2e;
    --text-light: #666;
    --bg-light: #f8f9fa;
    --border: #e9ecef;
    --radius: 14px;
  }

  body {
    font-family: -apple-system, 'Segoe UI', sans-serif;
    line-height: 1.6; color: var(--text); font-size: 14px;
  }

  .hero {
    display: flex; align-items: center; gap: 28px;
    padding: 20px; background: linear-gradient(135deg, #f8f9fa, #fff);
    border-radius: var(--radius); margin-bottom: 20px;
  }
  .hero-content { flex: 1; }
  .greeting { font-size: 13px; color: var(--text-light); display: block; }
  .hero-name { font-size: 32px; line-height: 1.1; letter-spacing: -1px; margin: 4px 0 6px; }
  .hero-role { color: var(--primary); font-weight: 600; margin-bottom: 10px; }
  .hero-desc { color: var(--text-light); font-size: 13px; margin-bottom: 16px; }

  .hero-actions { display: flex; gap: 10px; flex-wrap: wrap; }
  .btn {
    display: inline-flex; align-items: center; justify-content: center;
    padding: 10px 20px; border-radius: 8px; font-size: 13px; font-weight: 600;
    text-decoration: none; border: 2px solid transparent; cursor: pointer;
    transition: all 0.25s ease;
  }
  .btn-primary { background: var(--primary); color: white; }
  .btn-primary:hover {
    background: var(--primary-dark); transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(52,152,219,0.4);
  }
  .btn-outline { border-color: var(--primary); color: var(--primary); }
  .btn-outline:hover { background: var(--primary); color: white; }

  .hero-image { flex: 0 0 130px; }
  .hero-image img {
    width: 130px; height: 130px; border-radius: 50%;
    object-fit: cover; border: 4px solid white;
    box-shadow: 0 16px 40px rgba(0,0,0,0.14);
  }

  .section-label {
    display: inline-block; font-size: 11px; font-weight: 600;
    letter-spacing: 3px; text-transform: uppercase; color: var(--primary);
  }
  h2 { font-size: 22px; margin: 4px 0 14px; }

  .skills-grid { display: flex; gap: 12px; }
  .skill-card {
    flex: 1; background: white; border: 1px solid var(--border);
    border-radius: var(--radius); padding: 16px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .skill-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 32px rgba(0,0,0,0.12);
  }
  .skill-icon { font-size: 28px; }
  .skill-card h3 { font-size: 16px; margin: 6px 0 4px; }
  .skill-card p { color: var(--text-light); font-size: 12px; }
</style>

<section class="hero">
  <div class="hero-content">
    <span class="greeting">👋 Salom! Men —</span>
    <h1 class="hero-name">Ismingiz<br />Familiyangiz</h1>
    <p class="hero-role">Frontend Developer</p>
    <p class="hero-desc">
      HTML, CSS va JavaScript bilan zamonaviy va chiroyli veb-saytlar yarataman.
    </p>
    <div class="hero-actions">
      <a href="#" class="btn btn-primary">Loyihalarimni ko'rish</a>
      <a href="#" class="btn btn-outline">Bog'lanish</a>
    </div>
  </div>
  <div class="hero-image">
    <img src="https://picsum.photos/id/1005/200/200" alt="Mening rasmim" />
  </div>
</section>

<span class="section-label">Texnologiyalar</span>
<h2>Ko'nikmalarim</h2>
<div class="skills-grid">
  <div class="skill-card">
    <div class="skill-icon">🏗️</div>
    <h3>HTML5</h3>
    <p>Semantik belgilash, Accessibility, SEO</p>
  </div>
  <div class="skill-card">
    <div class="skill-icon">🎨</div>
    <h3>CSS3</h3>
    <p>Flexbox, animatsiyalar, responsive</p>
  </div>
  <div class="skill-card">
    <div class="skill-icon">⚡</div>
    <h3>JavaScript</h3>
    <p>Tez orada o'rganaman</p>
  </div>
</div>
\`\`\`

---

## 🖼️ Loyihalar bo'limi — overlay effekti

\`\`\`demo h=340 "Loyiha kartochkasi — hover'da overlay"
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, 'Segoe UI', sans-serif; font-size: 13px; }

  .projects-grid { display: flex; gap: 16px; flex-wrap: wrap; }

  .project-card {
    flex: 0 0 calc(50% - 8px);
    border-radius: 14px; overflow: hidden;
    box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .project-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 40px rgba(0,0,0,0.16);
  }

  .project-image { position: relative; overflow: hidden; height: 130px; }
  .project-image img {
    width: 100%; height: 100%; object-fit: cover;
    transition: transform 0.5s ease;
  }

  .project-overlay {
    position: absolute; inset: 0;
    background: rgba(26,26,46,0.8);
    display: flex; align-items: center; justify-content: center;
    opacity: 0; transition: opacity 0.3s ease;
  }
  .project-card:hover .project-image img { transform: scale(1.08); }
  .project-card:hover .project-overlay { opacity: 1; }

  .btn-white {
    background: white; color: #1a1a2e; padding: 8px 18px;
    border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 12px;
  }

  .project-info { padding: 14px; background: white; }
  .project-info h3 { font-size: 15px; margin-bottom: 4px; }
  .project-info p { color: #666; font-size: 12px; margin-bottom: 10px; }
  .project-tags { display: flex; gap: 6px; flex-wrap: wrap; }
  .tag {
    padding: 3px 10px; background: #f8f9fa; border: 1px solid #e9ecef;
    border-radius: 100px; font-size: 11px; color: #666;
  }
</style>

<p style="color:#666;margin-bottom:10px">Kartochka ustiga kursorni olib keling</p>

<div class="projects-grid">
  <article class="project-card">
    <div class="project-image">
      <img src="https://picsum.photos/id/180/400/260" alt="Loyiha 1" />
      <div class="project-overlay"><a href="#" class="btn-white">Ko'rish</a></div>
    </div>
    <div class="project-info">
      <h3>Mening Qahramonim</h3>
      <p>HTML bilan yaratilgan birinchi loyiha</p>
      <div class="project-tags"><span class="tag">HTML</span></div>
    </div>
  </article>

  <article class="project-card">
    <div class="project-image">
      <img src="https://picsum.photos/id/160/400/260" alt="Loyiha 2" />
      <div class="project-overlay"><a href="#" class="btn-white">Ko'rish</a></div>
    </div>
    <div class="project-info">
      <h3>Instagram Profile</h3>
      <p>Flexbox bilan profil header</p>
      <div class="project-tags">
        <span class="tag">HTML</span><span class="tag">CSS</span><span class="tag">Flexbox</span>
      </div>
    </div>
  </article>
</div>
\`\`\`

Overlay siri: \`position: absolute; inset: 0\` bilan rasm ustiga to'liq qoplanadi, \`opacity: 0\` bilan yashiriladi, hover'da \`opacity: 1\` bo'ladi.

---

## 🎯 CSS o'zgaruvchilar — sistema qurish

\`\`\`css
:root {
  --primary:      #3498db;
  --primary-dark: #2980b9;
  --text:         #1a1a2e;
  --text-light:   #666;
  --bg-light:     #f8f9fa;
  --border:       #e9ecef;

  --shadow-sm: 0 1px 4px rgba(0,0,0,0.08);
  --shadow-lg: 0 16px 48px rgba(0,0,0,0.12);

  --radius-sm: 8px;
  --radius-md: 16px;
}
\`\`\`

Bu — professional yondashuv. Rangni o'zgartirmoqchi bo'lsangiz **bitta joyda** o'zgartirasiz, butun sayt yangilanadi.

---

## 📝 Bonus: sahifa yuklanish animatsiyasi

\`\`\`demo h=300 "Ketma-ket paydo bo'lish"
<style>
  body { font-family: sans-serif; font-size: 14px; }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .card {
    background: #eff6ff; border: 1px solid #bfdbfe;
    border-radius: 12px; padding: 16px; margin-bottom: 10px;
  }

  /* Har biri biroz kechikib chiqadi */
  .card:nth-child(1) { animation: fadeInUp 0.6s ease-out 0.0s both; }
  .card:nth-child(2) { animation: fadeInUp 0.6s ease-out 0.2s both; }
  .card:nth-child(3) { animation: fadeInUp 0.6s ease-out 0.4s both; }
</style>

<div class="card">Birinchi — darhol</div>
<div class="card">Ikkinchi — 0.2s kechikib</div>
<div class="card">Uchinchi — 0.4s kechikib</div>
\`\`\`

\`animation-delay\` ni bosqichma-bosqich oshirish — bu "stagger" deb ataladi va professional saytlarda tez-tez ishlatiladi.

\`both\` muhim: animatsiyadan **oldin ham, keyin ham** holatni saqlaydi. Busiz element avval ko'rinib, keyin yo'qolib, keyin qaytadi.

---

## 🔧 Foydali qo'shimchalar

\`\`\`css
html {
  scroll-behavior: smooth;   /* menyu bosilganda silliq sirg'aladi */
}

.hero-name {
  font-size: clamp(40px, 6vw, 72px);   /* ekran o'lchamiga moslashadi */
}

.header {
  position: fixed; top: 0; left: 0; right: 0;
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(12px);          /* orqadagi kontent xiralashadi */
}
\`\`\`

---

## ✅ Topshirish talablari

**🥉 Bronze — minimum:**

- Semantik HTML5 tuzilmasi (header, main, footer, section, article)
- Google Fonts ulangan
- CSS o'zgaruvchilar ishlatilgan
- Kamida 2 ta hover effekt

**🥈 Silver — yaxshi:**

- Yuqoridagilar + Flexbox bilan to'g'ri joylashuv
- CSS transitions ishlaydi va silliq
- Kamida 2 ta loyiha kartochkasi

**🥇 Gold — a'lo:**

- Yuqoridagilar + \`@keyframes\` animatsiyalar
- \`::before\` yoki \`::after\` ishlatilgan
- Sahifa professional va tugallangan ko'rinadi
- GitHub'ga yuklangan

---

## ✅ Topshirishdan oldin

- Barcha havolalar ishlaydimi (menyu bosilganda kerakli bo'limga tushadimi)?
- Rasmlarda \`alt\` bormi?
- Oyna kichraytirilganda tuzilma buzilmayaptimi?
- Hover effektlar hamma tugmada ishlaydimi?
- Kodda ortiqcha izoh yoki tashlab ketilgan qism qolmadimi?
- \`<title>\` va \`<meta name="description">\` to'ldirilganmi?

> 🚀 **Keyingi dars:** Demo Day — sinf oldida taqdimot!
`,
    teacher: `
## 💡 O'qituvchi uchun

- Bu — 1-oyning yakuniy loyihasi. Uni **bir darsda** tugatib bo'lmaydi; 11-dars — boshlash va tuzilmani qurish, qolgani uy vazifasi.
- Bolalarni **noldan** boshlashga majburlang. Ba'zilari tayyor shablon yuklab oladi — bu ularga zarar. Aniqlash oson: kodda ular tushunmaydigan qismlar bo'ladi. Bitta-ikkita qatorni so'rab ko'ring.
- Dizaynni mukammal qilishga vaqt sarflatmang. Maqsad — **o'rganilganni qo'llash**, dizayner bo'lish emas. "Ishlaydi va tartibli" yetarli.
- Portfolio matnini o'zbek tilida yozishga ruxsat bering. Ingliz tilida yozishga majburlash bolani mavzudan chalg'itadi.

## ⚠️ Ko'p uchraydigan muammolar

- **Fixed header kontentni yopib qolgan** — \`main\` ga yuqoridan \`padding\` berilmagan. Bu deyarli hamma bolada chiqadi.
- **\`scroll-behavior: smooth\` ishlamayapti** — \`html\` ga emas, \`body\` ga yozilgan.
- **Overlay ko'rinmayapti** — otasida \`position: relative\` yo'q.
- **Rasmlar cho'zilib ketgan** — \`object-fit: cover\` yozilmagan.
- **Loyihalar kartochkasi bir qatorga sig'magan** — \`flex-wrap: wrap\` yo'q yoki \`calc()\` da \`gap\` hisobga olinmagan.
- **CSS 800 qator, hammasi tartibsiz** — izoh bilan bo'limlarga ajratishni o'rgating. Bu keyingi oylarda juda foyda beradi.

## 📊 Baholash bo'yicha maslahat

Bu loyihada **kod tozaligi** ni alohida baholang. Sayt chiroyli, lekin CSS tartibsiz bo'lsa — Silver'dan yuqori bermang. Sabab: keyingi oyda shu kodni ular o'zi o'qiy olishi kerak.

Gold uchun GitHub'ga yuklash sharti bor, lekin 31-darsgacha Git o'tilmaydi. Shuning uchun hozircha buni **ixtiyoriy** qiling yoki GitHub Desktop bilan ko'rsating.

## 🗒 Notion'dagi xato

Asl Notion sahifasidagi hero matnida buzuq jumla bor edi: *"...veb-saytlar yaratamanBir narsa bekor"*. Bu yerda to'g'irlab yozildi. Notion'dagi asl sahifani ham tuzatib qo'ying.
`,
  },

  // ═══════════════════════════════════════════════════════════
  'junior.m1.l8': {
    goal: "display: flex bilan elementlarni gorizontal, vertikal va markazga chiroyli joylashtirish.",
    student: `
## ❓ Flexbox nima va nima uchun kerak?

Flexbox'dan oldin (CSS2 davrida) elementlarni joylashtirish uchun \`float\`, \`position\`, \`table\` ishlatilar edi — bular murakkab va noto'g'ri natijalar berardi.

**Flexbox** — CSS3 da 2009-yilda taqdim etilgan, 2015-yildan barcha brauzerlarda ishlaydi.

\`\`\`css
/* Eski usul — dahshatli */
.element {
  float: left;
  margin-right: 10px;
  clear: both;  /* !!! */
}

/* Zamonaviy — Flexbox */
.container {
  display: flex;
  gap: 10px;
}
\`\`\`

---

## 📏 Flex Kontseptsiyasi: Container va Items

\`\`\`html
<!-- FLEX CONTAINER -->
<div class="container">
  <!-- FLEX ITEMS -->
  <div class="item">1</div>
  <div class="item">2</div>
  <div class="item">3</div>
</div>
\`\`\`

\`\`\`css
.container {
  display: flex;     /* Flexbox yoqildi! */
                     /* Barcha to'g'ridan-to'g'ri bolalar flex item bo'ldi */
}
\`\`\`

**Asosiy o'qlar:** MAIN AXIS — asosiy yo'nalish, CROSS AXIS — unga perpendikulyar.

---

## 🎛️ Container Xususiyatlari

### flex-direction — Yo'nalish

\`\`\`css
.container {
  display: flex;

  flex-direction: row;            /* → chapdan o'ngga (DEFAULT) */
  flex-direction: row-reverse;    /* ← o'ngdan chapga */
  flex-direction: column;         /* ↓ yuqoridan pastga */
  flex-direction: column-reverse; /* ↑ pastdan yuqoriga */
}
\`\`\`

### justify-content — MAIN AXIS bo'yicha

Hamma qiymatlarni bir vaqtda ko'ring:

\`\`\`demo h=340 "justify-content — 6 ta qiymat"
<style>
  .row { display: flex; background: #eef2ff; margin-bottom: 8px;
         padding: 6px; border-radius: 8px; }
  .box { width: 42px; height: 34px; background: #6366f1; color: #fff;
         border-radius: 6px; display: flex; align-items: center;
         justify-content: center; font-size: 14px; }
  .name { font-size: 12px; color: #4b5563; margin: 0 0 2px; font-family: monospace; }

  .r1 { justify-content: flex-start; }
  .r2 { justify-content: flex-end; }
  .r3 { justify-content: center; }
  .r4 { justify-content: space-between; }
  .r5 { justify-content: space-around; }
  .r6 { justify-content: space-evenly; }
</style>

<p class="name">flex-start (default)</p>
<div class="row r1"><div class="box">1</div><div class="box">2</div><div class="box">3</div></div>

<p class="name">flex-end</p>
<div class="row r2"><div class="box">1</div><div class="box">2</div><div class="box">3</div></div>

<p class="name">center</p>
<div class="row r3"><div class="box">1</div><div class="box">2</div><div class="box">3</div></div>

<p class="name">space-between</p>
<div class="row r4"><div class="box">1</div><div class="box">2</div><div class="box">3</div></div>

<p class="name">space-around</p>
<div class="row r5"><div class="box">1</div><div class="box">2</div><div class="box">3</div></div>

<p class="name">space-evenly</p>
<div class="row r6"><div class="box">1</div><div class="box">2</div><div class="box">3</div></div>
\`\`\`

> 💡 **Sinab ko'ring:** "O'zgartirib ko'rish" tugmasini bosing va \`.r3\` dagi \`center\` ni \`space-between\` ga almashtiring. Natija darhol o'zgaradi.

### align-items — CROSS AXIS bo'yicha

\`\`\`demo h=300 "align-items — 4 ta qiymat"
<style>
  .wrap { display: flex; gap: 10px; }
  .col { flex: 1; }
  .name { font-size: 12px; font-family: monospace; color: #4b5563; margin: 0 0 4px; }
  .row {
    display: flex; gap: 6px; height: 110px;
    background: #eef2ff; padding: 6px; border-radius: 8px;
  }
  .box { width: 30px; background: #6366f1; color: #fff; border-radius: 5px;
         display: flex; align-items: center; justify-content: center; font-size: 12px; }
  .tall { height: 60px; }

  .a1 { align-items: stretch; }
  .a2 { align-items: flex-start; }
  .a3 { align-items: center; }
  .a4 { align-items: flex-end; }
</style>

<div class="wrap">
  <div class="col">
    <p class="name">stretch</p>
    <div class="row a1"><div class="box">1</div><div class="box">2</div></div>
  </div>
  <div class="col">
    <p class="name">flex-start</p>
    <div class="row a2"><div class="box tall">1</div><div class="box tall">2</div></div>
  </div>
  <div class="col">
    <p class="name">center</p>
    <div class="row a3"><div class="box tall">1</div><div class="box tall">2</div></div>
  </div>
  <div class="col">
    <p class="name">flex-end</p>
    <div class="row a4"><div class="box tall">1</div><div class="box tall">2</div></div>
  </div>
</div>
\`\`\`

> 💡 Birinchi ustunda qutilar balandlikni **o'zi to'ldirgan** — bu \`stretch\`, ya'ni standart holat. Qolganlarida qutiga aniq balandlik berilgan, shuning uchun joylashuv farqi ko'rinadi.

### ⭐ Elementni To'liq Markazga Joylashtirish

Frontend'dagi eng ko'p ishlatiladigan uch qator. \`align-items\` qatorini o'chirib ko'ring — quti yuqoriga chiqib ketadi:

\`\`\`demo h=260 "Markazlash — 3 qator"
<style>
  .center-box {
    display: flex;
    justify-content: center;   /* gorizontal markaz */
    align-items: center;       /* vertikal markaz */

    height: 180px;             /* balandlik SHART! */
    background: #f3f4f6;
    border: 2px dashed #d1d5db;
    border-radius: 12px;
  }
  .item {
    background: #10b981; color: white;
    padding: 16px 28px; border-radius: 10px; font-weight: 600;
  }
</style>

<div class="center-box">
  <div class="item">Men markazdaman</div>
</div>
\`\`\`

> ⚠️ **Eng ko'p uchraydigan xato:** \`align-items: center\` ishlamayotgandek tuyulsa — konteynerda **balandlik yo'q**. Balandliksiz "vertikal markaz" degan tushuncha ma'nosiz. Yuqoridagi \`height: 180px\` ni o'chirib ko'ring.

### flex-wrap — Qator Sinishi

\`\`\`css
.container {
  display: flex;

  flex-wrap: nowrap;        /* bir qatorda (DEFAULT) — itemlar siqiladi */
  flex-wrap: wrap;          /* joy yetmasa keyingi qatorga tushadi */
  flex-wrap: wrap-reverse;  /* teskari tartibda keyingi qatorga */
}
\`\`\`

### gap — Elementlar Orasidagi Masofa

\`\`\`css
.container {
  display: flex;

  gap: 16px;           /* hamma tomondan 16px */
  gap: 20px 10px;      /* row-gap: 20px, column-gap: 10px */
}
\`\`\`

> 💡 \`gap\` — margin'dan yaxshiroq, chunki tashqi elementlarda ortiqcha bo'sh joy qoldirmaydi!

---

## 📦 Item Xususiyatlari

### flex-grow — O'sish

\`\`\`demo h=200 "flex-grow — bo'sh joyni bo'lish"
<style>
  .row { display: flex; gap: 8px; background: #eef2ff; padding: 8px; border-radius: 8px; }
  .item { background: #6366f1; color: #fff; padding: 20px 0;
          text-align: center; border-radius: 6px; font-size: 14px; }

  .item-1 { flex-grow: 1; }   /* 1 ulush */
  .item-2 { flex-grow: 2; }   /* 2 ulush — 2 barobar keng */
  .item-3 { flex-grow: 1; }   /* 1 ulush */
</style>

<div class="row">
  <div class="item item-1">grow: 1</div>
  <div class="item item-2">grow: 2</div>
  <div class="item item-3">grow: 1</div>
</div>
\`\`\`

Jami 1+2+1 = 4 ulush. O'rtadagi element 2/4 = **50%** joyni oladi.

### flex-shrink va flex-basis

\`\`\`css
.item {
  flex-shrink: 1;      /* joy yetmasa siqiladi (DEFAULT) */
  flex-shrink: 0;      /* hech qachon siqilmaydi */

  flex-basis: auto;    /* kontent hajmiga qarab (DEFAULT) */
  flex-basis: 200px;   /* minimal 200px */
  flex-basis: 33%;     /* 3 ta teng ustun */
}
\`\`\`

### flex — Qisqartma (grow + shrink + basis)

\`\`\`css
.item {
  flex: 1;             /* flex: 1 1 0 */
  flex: auto;          /* flex: 1 1 auto */
  flex: none;          /* flex: 0 0 auto */
  flex: 0 0 200px;     /* o'smaydi, siqilmaydi, 200px qoladi */
}

/* Teng kenglikdagi ustunlar */
.column { flex: 1; }
\`\`\`

### align-self va order

\`\`\`css
.item-special {
  align-self: center;   /* faqat bu item markazda */
}

.item-1 { order: 2; }   /* uchinchi ko'rinadi */
.item-2 { order: 1; }   /* ikkinchi ko'rinadi */
.item-3 { order: -1; }  /* BIRINCHI ko'rinadi! */
\`\`\`

---

## 📱 Amaliy Misollar

### Navigatsiya Bar

Bu — Gold topshiriqning tayyor namunasi. Kodni o'qing, keyin o'zingiznikini noldan yozing:

\`\`\`demo h=300 "Navbar — space-between"
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .navbar {
    display: flex;
    justify-content: space-between;  /* logo chap, tugma o'ng */
    align-items: center;
    padding: 0 24px;
    height: 64px;
    background-color: #1a1a2e;
    border-radius: 10px;
  }

  .logo {
    font-size: 20px; font-weight: 700;
    color: #3498db; letter-spacing: 2px;
  }

  .nav-links {
    display: flex;
    gap: 28px;
    list-style: none;
  }

  .nav-links a {
    color: #ccc; text-decoration: none;
    font-size: 14px; transition: color 0.3s;
  }
  .nav-links a:hover { color: white; }

  .cta-btn {
    background-color: #3498db; color: white; border: none;
    padding: 9px 20px; border-radius: 6px; cursor: pointer; font-size: 14px;
  }
</style>

<nav class="navbar">
  <div class="logo">MyBrand</div>
  <ul class="nav-links">
    <li><a href="#">Bosh sahifa</a></li>
    <li><a href="#">Portfolio</a></li>
    <li><a href="#">Haqimda</a></li>
  </ul>
  <button class="cta-btn">Bog'lanish</button>
</nav>
\`\`\`

### Karta Grid

\`\`\`css
.cards-container {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  padding: 24px;
}

.card {
  flex: 0 0 calc(33.333% - 16px);  /* 3 ustun */
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

/* Mobilda 1 ustun */
@media (max-width: 768px) {
  .card { flex: 1 1 100%; }
}
\`\`\`

---

## 🥉 Bronze Topshiriq

3 ta kvadratni yonma-yon joylashtiring. Natija shunday bo'lishi kerak:

\`\`\`demo h=200 "Bronze — natija"
<style>
  .container {
    display: flex;
    gap: 16px;
    padding: 20px;
  }

  .box {
    width: 90px;
    height: 90px;
    background-color: #3498db;
    color: white;
    font-size: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
  }
</style>

<div class="container">
  <div class="box">1</div>
  <div class="box">2</div>
  <div class="box">3</div>
</div>
\`\`\`

> 💡 Kodni ko'chirib olmang — o'zingiz noldan yozing. Bu yerdagi misol faqat **natija qanday bo'lishi kerakligini** ko'rsatish uchun.

---

## 🥈 Silver Topshiriq

Xuddi shu 3 ta elementni **ekranning to'liq markaziga** joylashtiring va ularni doira shakliga keltiring.

Kerak bo'ladi: \`justify-content: center\`, \`align-items: center\`, \`height: 100vh\`, \`border-radius: 50%\`.

---

## 🥇 Gold Topshiriq

To'liq navigatsiya paneli yasang:

- Chapda logo, o'rtada menyu linklari, o'ngda tugma
- \`justify-content: space-between\` bilan
- Linklarga \`hover\` effekti
- \`position: sticky\` bilan tepada qotib turadigan qilib

---

## ✅ Dars Xulosa

| Xususiyat | Ma'nosi |
| --- | --- |
| \`display: flex\` | Flexbox yoqish |
| \`flex-direction\` | Yo'nalish (row/column) |
| \`justify-content\` | Main axis bo'yicha |
| \`align-items\` | Cross axis bo'yicha |
| \`flex-wrap\` | Qator sinishi |
| \`gap\` | Elementlar orasidagi masofa |
| \`flex: 1\` | Teng taqsimlash |
| \`order\` | Tartibni o'zgartirish |

**Eng ko'p ishlatiladigan:**

\`\`\`css
/* Markaz qilish */
display: flex; justify-content: center; align-items: center;

/* Space-between navigatsiya */
display: flex; justify-content: space-between; align-items: center;

/* Teng ustunlar */
display: flex; gap: 24px;  /* .item { flex: 1; } */
\`\`\`

> 🚀 **Keyingi dars:** Hover effektlar va CSS Transitions — sahifani animatsiyali qilish!
`,
    teacher: `
## 💡 O'qituvchi uchun

- \`justify-content\` va \`align-items\` ni chalkashtirish — eng ko'p uchraydigan xato. \`flex-direction: column\` qilib ko'rsating: o'qlar almashadi va bola farqni **ko'rib** tushunadi.
- \`align-items\` ishlamayotgandek tuyulsa — konteynerda balandlik yo'q. Buni oldindan aytmang, bola o'zi topsin.
- **flexboxfroggy.com** — dars oxirida 10 daqiqa o'ynatish. Bolalar uchun eng samarali mustahkamlash.

## ⚠️ Gold topshiriqni tekshirishda

- \`box-sizing: border-box\` qo'yilganmi? Qo'yilmasa padding kenglikni buzadi.
- \`list-style: none\` unutilganmi?
- \`text-decoration: none\` linklardan olib tashlanganmi?
- \`position: sticky\` bilan birga \`top: 0\` yozilganmi? \`top\`siz sticky ishlamaydi — bu klassik tuzoq.

## 📊 Daraja belgilash

- **Bronze** — uchta quti yonma-yon turibdi, gap bor
- **Silver** — markazlash to'g'ri, 100vh ishlatilgan
- **Gold** — navbar to'liq, hover ishlaydi, sticky ishlaydi
`,
  },

  // ═══════════════════════════════════════════════════════════
  'junior.m1.l12': {
    goal: "1-oy davomida o'rganilgan bilimlarni namoyish qilish va o'z saytini sinf oldida taqdim etish.",
    student: `
## 📌 Demo Day nima?

Demo Day — bu imtihon **emas**. Bu **taqdimot va nishonlash** kuni.

Har bir o'quvchi:

1. O'z loyihasini doskada ko'rsatadi
2. Nima qilganini aytib beradi
3. Qiyinchilik va yechimini ulashadi
4. Sinfdoshlar savollariga javob beradi

> 💡 Xato bo'lsa ham mayli. Biz bu yerda o'rganish uchunmiz, baho olish uchun emas.

---

## 🎤 Taqdimotingiz qanday bo'ladi (5 daqiqa)

### 1. Saytingizni ko'rsating (2 daqiqa)

- Brauzerni proyektorga ulab, saytni oching
- Hamma bo'limlarni ko'rsating
- Hover effektlarni namoyish qiling

### 2. O'zingiz tushuntiring (2 daqiqa)

Shu uchta jumlaga javob tayyorlang:

- "Men bu saytda ... yasadim"
- "Eng ko'p vaqt ... ga sarfladim"
- "Eng qiyin qism ... edi"

### 3. Savollar (1 daqiqa)

- O'qituvchi 1 ta savol beradi
- Sinfdoshlar ixtiyoriy savol berishadi

---

## ✅ Taqdimotdan oldin tekshiring

- Sayt Live Server'da xatosiz ochiladimi?
- Barcha rasmlar ko'rinyaptimi (alt matnlar yozilganmi)?
- Linklar bosilganda ishlaydimi?
- Hover effektlar sezilyaptimi?
- Kodda ortiqcha izohlar yoki tashlab ketilgan qismlar qolmadimi?

---

## 📚 1-oyda nimalarni o'rgandingiz

| Dars | Mavzu |
| --- | --- |
| 1 | HTML asoslari, VS Code |
| 2 | Rasmlar, linklar, ro'yxatlar |
| 3 | Amaliyot: "Mening Qahramonim" |
| 4 | CSS, selektorlar, specificity |
| 5 | Google Fonts, tipografiya |
| 6 | Box Model |
| 7 | Semantik HTML5 |
| 8 | Flexbox |
| 9 | Amaliyot: Instagram Profile |
| 10 | Hover va Transitions |
| 11 | Portfolio kodlash |
| 12 | Demo Day 🏆 |

---

## 🚀 2-oyda nima bo'ladi

Saytingizni **professional** darajaga olib chiqamiz:

- Saytingiz telefonda ham chiroyli ko'rinadi (responsive)
- Elementlarni harakatlantirishni o'rganasiz (@keyframes)
- CSS Grid bilan murakkab joylashuvlar yasaysiz

> 🚀 **Tabriklaymiz!** Siz HTML5 va CSS3 asoslarini o'rgandingiz. Frontend dasturchi yo'lida birinchi qadamni qo'ydingiz.
`,
    teacher: `
## ⏰ Jadval (90 daqiqa)

| Vaqt | Faoliyat |
| --- | --- |
| 0:00 – 0:10 | Kirish so'z. O'qituvchi 1-oyni xotirlab beradi |
| 0:10 – 0:55 | Taqdimotlar (har o'quvchiga 5 daqiqa) |
| 0:55 – 1:10 | Umumiy fikrlar va takomillashtirish yo'llari |
| 1:10 – 1:25 | 1-oy Badge topshirish marosimi 🏅 |
| 1:25 – 1:30 | 2-oy anonsi: CSS Grid, animatsiyalar, responsive |

## 📝 Baholash formasi

\`\`\`text
O'quvchi ismi: _____________________

HTML Tuzilishi:      [ 1 ]  [ 2 ]  [ 3 ]  [ 4 ]  [ 5 ]
CSS Ko'rinishi:      [ 1 ]  [ 2 ]  [ 3 ]  [ 4 ]  [ 5 ]
Loyiha Sifati:       [ 1 ]  [ 2 ]  [ 3 ]  [ 4 ]  [ 5 ]
Kod Tozaligi:        [ 1 ]  [ 2 ]  [ 3 ]  [ 4 ]  [ 5 ]
Taqdimot:            [ 1 ]  [ 2 ]  [ 3 ]  [ 4 ]  [ 5 ]

Jami: ___ / 25

Topshiriq darajasi:  [ ] 🥉 Bronze   [ ] 🥈 Silver   [ ] 🥇 Gold

Ijobiy tomoni: _________________________________
Yaxshilash uchun: _______________________________
\`\`\`

## 🏅 Badge tizimi

| Ball | Badge | Nima oladi |
| --- | --- | --- |
| 20 – 25 | 🥇 1-oy Badge — HTML & CSS | Sertifikat + 2-oyga kirish |
| 15 – 19 | 🥈 Qoniqarli | Sertifikat + 2-oyga kirish |
| < 15 | 🥉 Qayta topshirish | 1 hafta ichida loyihani yaxshilash |

## 💡 O'qituvchi uchun maslahatlar

> **Har bir o'quvchi taqdimot qilishdan qo'rqadi.** Muhit xavfsiz bo'lsin.

- Taqdimotdan oldin: "Xato bo'lsa ham mayli, biz o'rganish uchun bu yerdamiz" — ayting
- Har taqdimotdan keyin **kamida 2 ta ijobiy fikr** bildiring
- "Qiyin savol" bermang — bu imtihon emas
- Eng yaxshi 3 saytni alohida nishonlang ("Ijodiy dizayn", "Eng aniq kod", "Eng ko'p urinish")

> 🗓 **JavaScript 4-oydan boshlanadi** (2-Modul). Uni hozir va'da qilmang.
`,
  },
};
