// Junior kursi — 2-Modul: Algoritmlar va Mantiq (4–5 oy)
//
// ⚠️ MUHIM TEXNIK ESLATMA:
// Dars matni JS template literal ichida yoziladi. Shuning uchun dars
// kodidagi HAR BIR `${` belgisi `\${` deb escape qilinishi SHART.
// Aks holda tashqi template literal uni interpolatsiya qilib,
// butun fayl ishga tushmay qoladi.
//
// Demolardagi cheklovlar (sandboxed iframe):
//   ✅ JavaScript, DOM, setInterval ishlaydi
//   ❌ localStorage bloklanadi
//   ❌ alert() ko'rinmaydi

export const JUNIOR_M2_CONTENT = {
  // ═══════════════════════════════════════════════════════════
  'junior.m2.l1': {
    goal: "JavaScript nima, o'zgaruvchilar qanday e'lon qilinadi va ma'lumot turlari.",
    student: `
## ⚡ JavaScript nima?

Uch oy davomida ikkita til bilan ishladingiz. Endi uchinchisi:

- **HTML** — suyak (tuzilma)
- **CSS** — teri (ko'rinish)
- **JavaScript** — miya (mantiq, harakat)

JavaScript faqat brauzerda emas, boshqa joylarda ham ishlaydi: serverda (Node.js), mobil ilovalarda (React Native), kompyuter dasturlarida (Electron).

---

## 📦 O'zgaruvchi — qutiga nom berish

O'zgaruvchi — bu qiymat saqlanadigan **nomlangan quti**.

\`\`\`javascript
let yosh = 15;
const ism = "Ahmadjon";
\`\`\`

Uchta kalit so'z bor, lekin ikkitasini ishlatasiz:

| | \`var\` | \`let\` | \`const\` |
| --- | --- | --- | --- |
| Qayta e'lon qilish | ✅ | ❌ | ❌ |
| Qiymatni o'zgartirish | ✅ | ✅ | ❌ |
| Blok ichida cheklangan | ❌ | ✅ | ✅ |
| Zamonaviy | ❌ | ✅ | ✅ |

> 💡 **Qoida:** avval \`const\` yozing. Agar qiymat o'zgarishi kerak bo'lsa — \`let\` ga o'zgartiring. \`var\` — 2015-yilgacha ishlatilgan, endi yozmang.

\`\`\`javascript
let yosh = 15;
yosh = 16;          // ✅ mumkin

const PI = 3.14159;
PI = 3;             // ❌ Xato: Assignment to constant variable
\`\`\`

---

## 🔢 Ma'lumot turlari

JavaScript'da har qiymatning **turi** bor. Asosiy beshtasini bilish yetarli:

\`\`\`demo h=380 "typeof — turni aniqlash"
<style>
  body { font-family: sans-serif; font-size: 13px; margin: 0; padding: 14px; }
  h3 { font-size: 13px; margin: 0 0 8px; color: #374151; }
  #out {
    background: #1f2937; border-radius: 8px; padding: 12px;
    font-family: monospace; font-size: 12px; line-height: 1.9;
    min-height: 230px;
  }
  #out div { border-bottom: 1px solid #374151; padding: 2px 0; }
  .qiymat { color: #fbbf24; }
  .tur { color: #86efac; }
  .izoh { color: #6b7280; }
</style>

<h3>console.log natijasi</h3>
<div id="out"></div>

<script>
  var out = document.querySelector('#out');

  function log(qiymat, izoh) {
    var qator = document.createElement('div');
    var korinish = typeof qiymat === 'string' ? '"' + qiymat + '"' : String(qiymat);
    qator.innerHTML =
      '<span class="qiymat">' + korinish + '</span>' +
      '  <span class="tur">' + typeof qiymat + '</span>' +
      (izoh ? '  <span class="izoh">// ' + izoh + '</span>' : '');
    out.appendChild(qator);
  }

  // ── SHU YERDAN O'ZGARTIRING ─────────────────────────
  var belgilanmagan;

  log("Ahmadjon");
  log(15);
  log(99.99);
  log(true);
  log(false);
  log(belgilanmagan, "qiymat berilmagan");
  log(null, "DIQQAT: object deb chiqadi!");
  log([1, 2, 3], "massiv ham object");
</script>
\`\`\`

**Beshta asosiy tur:**

| Tur | Nima | Misol |
| --- | --- | --- |
| \`string\` | matn | \`"Ahmadjon"\` |
| \`number\` | son (butun va kasr) | \`15\`, \`99.99\`, \`-5\` |
| \`boolean\` | rost yoki yolg'on | \`true\`, \`false\` |
| \`undefined\` | qiymat berilmagan | \`let x;\` |
| \`null\` | qiymat ataylab yo'q | \`let x = null;\` |

> ⚠️ Demoda ko'rgansiz: \`typeof null\` — \`"object"\` deb chiqadi. Bu **JavaScript'ning tarixiy xatosi**, 1995-yildan qolgan. Uni tuzatish mumkin emas, chunki millionlab saytlar buziladi. Shunchaki eslab qoling.

---

## 🔤 Template literal — zamonaviy matn

Matn va o'zgaruvchini birlashtirishning ikki usuli bor:

\`\`\`javascript
const ism = "Zilola";
const yosh = 14;

// Eski usul — chalkash
console.log("Salom, " + ism + "! Siz " + yosh + " yoshdasiz.");

// Zamonaviy — backtick va \${} bilan
console.log(\`Salom, \${ism}! Siz \${yosh} yoshdasiz.\`);
\`\`\`

Ikkinchisi o'qishga ancha qulay.

> 💡 **Backtick qayerda?** Klaviaturada \`1\` tugmasining chap tomonida, \`Esc\` ning ostida. U oddiy apostrof (\`'\`) emas — boshqa belgi. Adashsangiz template literal ishlamaydi.

\`\`\`demo h=340 "Template literal amalda"
<style>
  body { font-family: sans-serif; font-size: 13px; margin: 0; padding: 14px; }
  #out {
    background: #1f2937; color: #d1d5db; border-radius: 8px; padding: 12px;
    font-family: monospace; font-size: 12px; line-height: 1.9; min-height: 200px;
  }
  #out div { border-bottom: 1px solid #374151; padding: 3px 0; }
  h3 { font-size: 13px; margin: 0 0 8px; color: #374151; }
</style>

<h3>Natija</h3>
<div id="out"></div>

<script>
  var out = document.querySelector('#out');
  function log(matn) {
    var d = document.createElement('div');
    d.textContent = matn;
    out.appendChild(d);
  }

  // ── O'ZGARTIRIB KO'RING ─────────────────────────────
  var ism = "Zilola";
  var yosh = 14;

  log("Salom, " + ism + "! Siz " + yosh + " yoshdasiz.");
  log(\`Salom, \${ism}! Siz \${yosh} yoshdasiz.\`);
  log(\`2 + 2 = \${2 + 2}\`);
  log(\`Kelasi yil: \${yosh + 1} yosh\`);
  log(\`Katta harflarda: \${ism.toUpperCase()}\`);
</script>
\`\`\`

\`\${...}\` ichiga **istalgan kod** yozish mumkin: hisob, funksiya chaqiruvi, shart.

---

## 🔢 Sonlar bilan ishlash

\`\`\`demo h=400 "Arifmetika va maxsus holatlar"
<style>
  body { font-family: sans-serif; font-size: 13px; margin: 0; padding: 14px; }
  #out {
    background: #1f2937; border-radius: 8px; padding: 12px;
    font-family: monospace; font-size: 12px; line-height: 1.9; min-height: 260px;
  }
  #out div { border-bottom: 1px solid #374151; padding: 2px 0; color: #d1d5db; }
  .kod { color: #93c5fd; }
  .nat { color: #fbbf24; }
  .izoh { color: #6b7280; }
  h3 { font-size: 13px; margin: 0 0 8px; color: #374151; }
</style>

<h3>Natija</h3>
<div id="out"></div>

<script>
  var out = document.querySelector('#out');
  function sina(kod, natija, izoh) {
    var d = document.createElement('div');
    d.innerHTML = '<span class="kod">' + kod + '</span>' +
                  '  →  <span class="nat">' + natija + '</span>' +
                  (izoh ? '  <span class="izoh">// ' + izoh + '</span>' : '');
    out.appendChild(d);
  }

  sina('10 + 3', 10 + 3);
  sina('10 / 3', (10 / 3).toFixed(4) + '...');
  sina('10 % 3', 10 % 3, 'QOLDIQ — juft/toq uchun');
  sina('2 ** 10', 2 ** 10, 'daraja');
  sina('1 / 0', 1 / 0, 'cheksizlik');
  sina('"abc" / 2', String("abc" / 2), 'Not a Number');
  sina('Math.round(4.6)', Math.round(4.6));
  sina('Math.floor(4.9)', Math.floor(4.9), 'pastga');
  sina('Math.ceil(4.1)', Math.ceil(4.1), 'tepaga');
  sina('Math.max(1,5,3,9)', Math.max(1,5,3,9));
  sina('Number("42")', Number("42"), 'matndan songa');
  sina('parseInt("42px")', parseInt("42px"), 'raqamgacha o\\'qiydi');
</script>
\`\`\`

Ulardan **eng ko'p ishlatiladigani** — \`%\` (qoldiq). U bilan sonning juft yoki toqligini aniqlaysiz:

\`\`\`javascript
4 % 2   // 0  → juft
5 % 2   // 1  → toq
\`\`\`

---

## ⚠️ Tur majburlash — JavaScript'ning g'alati tomoni

\`\`\`demo h=320 "Nima uchun bunday?"
<style>
  body { font-family: sans-serif; font-size: 13px; margin: 0; padding: 14px; }
  #out {
    background: #1f2937; border-radius: 8px; padding: 12px;
    font-family: monospace; font-size: 12px; line-height: 2; min-height: 180px;
  }
  #out div { border-bottom: 1px solid #374151; padding: 3px 0; color: #d1d5db; }
  .kod { color: #93c5fd; }
  .nat { color: #fbbf24; }
  .izoh { color: #9ca3af; }
  h3 { font-size: 13px; margin: 0 0 8px; color: #374151; }
</style>

<h3>Natija</h3>
<div id="out"></div>

<script>
  var out = document.querySelector('#out');
  function sina(kod, natija, izoh) {
    var d = document.createElement('div');
    d.innerHTML = '<span class="kod">' + kod + '</span>' +
                  '  →  <span class="nat">' + natija + '</span>' +
                  '  <span class="izoh">' + izoh + '</span>';
    out.appendChild(d);
  }

  sina('5 + 3', 5 + 3, '// ikkalasi son');
  sina('"5" + 3', '"' + ("5" + 3) + '"', '// matn + son = MATN');
  sina('"5" - 3', "5" - 3, '// ayirishda songa aylanadi');
  sina('"5" * 2', "5" * 2, '// ko\\'paytirishda ham');
  sina('true + 1', true + 1, '// true = 1');
</script>
\`\`\`

Ikkinchi qatorga diqqat qiling: \`"5" + 3\` natijasi **\`"53"\`** — chunki \`+\` belgisi matn bilan ishlatilsa **birlashtiradi**, qo'shmaydi.

Bu — 35-darsda gaplashgan \`localStorage\` muammosining sababi. U har doim matn qaytaradi, shuning uchun \`Number()\` bilan aylantirish kerak.

---

## 🥉 Bronze Topshiriq

\`\`\`javascript
let ism = "Ismingiz";
console.log(ism);
console.log(typeof ism);
\`\`\`

F12 → Console'da natijani ko'ring.

---

## 🥈 Silver Topshiriq

Uchta o'zgaruvchi yarating: ism, yosh, sevimli rang. Template literal bilan o'zingiz haqingizda jumla chiqaring.

Keyin \`const\` ni qayta belgilashga urinib ko'ring va **xato xabarini o'qing**.

---

## 🥇 Gold Topshiriq

- Beshta turdagi o'zgaruvchi yarating va har biriga \`typeof\` qo'llang
- \`typeof null\` nima chiqishini toping va nima uchun ekanini yozib qo'ying
- \`"5" + 3\` va \`"5" - 3\` natijalarini taqqoslang, farqni tushuntiring

---

## ✅ Dars Xulosa

- \`const\` — asosiy tanlov, \`let\` — o'zgarsa, \`var\` — ishlatmang
- Beshta asosiy tur: \`string\`, \`number\`, \`boolean\`, \`undefined\`, \`null\`
- \`typeof null\` → \`"object"\` — tarixiy xato
- Template literal: backtick va \`\${}\`
- \`%\` — qoldiq, juft/toq aniqlash uchun
- \`"5" + 3\` = \`"53"\`, lekin \`"5" - 3\` = \`2\`

> 🚀 **Keyingi dars:** Operatorlar va if/else — shartlar bilan ishlash!
`,
    teacher: `
## 💡 O'qituvchi uchun

- Bu — 2-Modulning birinchi darsi. Bolalar 34–35-darslarda JavaScript bilan **tanishgan**, endi uni tizimli o'rganish boshlanadi. Bog'lanishni eslating.
- \`var\` ni **umuman o'rgatmang**. Faqat "eski kodda ko'rasiz, siz yozmang" deng. Ortiqcha vaqt sarflashning hojati yo'q.
- \`typeof null === "object"\` — bolalarga bu qiziq tuyuladi. "JavaScript 10 kunda yozilgan va bu xato o'shanda kirib qolgan" deb ayting. Til ham mukammal emasligini bilish foydali.
- **Tur majburlash** demosi — eng muhimi. \`"5" + 3 = "53"\` ni ko'rsating va 35-darsdagi \`localStorage\` muammosi bilan bog'lang. Bola nazariya va amaliyot orasidagi aloqani ko'radi.
- Backtick tugmasini **jismonan ko'rsating**. Ko'p bolalar uni topa olmaydi va oddiy qo'shtirnoq yozadi, keyin template literal ishlamaydi.

## ⚠️ Ko'p uchraydigan xatolar

- **Backtick o'rniga apostrof** — \`'Salom \${ism}'\` ishlamaydi, \`\${ism}\` matn bo'lib chiqadi.
- **\`const\` ga qayta qiymat berish** — xato xabarini birga o'qing: \`Assignment to constant variable\`.
- **O'zgaruvchi nomi raqamdan boshlangan** — \`let 1son = 5\` ishlamaydi.
- **O'zgaruvchi nomida tire** — \`let mening-ismim\` xato, \`meningIsmim\` (camelCase) to'g'ri.
- **\`=\` va \`===\` chalkashtirilgan** — bu keyingi darsda batafsil, lekin hozir ham uchraydi.
- **Kirill harflar bilan o'zgaruvchi nomi** — texnik jihatdan ishlaydi, lekin **qat'iyan man qiling**. Keyinchalik jiddiy muammo bo'ladi.

## 📊 Daraja belgilash

- **Bronze** — o'zgaruvchi yaratilgan, console'da ko'rinadi
- **Silver** — template literal to'g'ri ishlatilgan, const xatosi tushunilgan
- **Gold** — beshta tur, typeof natijalari, tur majburlashni **tushuntira oladi**

> Gold'ni tekshirishda so'rang: "\`"5" + 3\` nega \`53\` chiqadi?" Javob bera olsa — tushungan.
`,
  },

  // ═══════════════════════════════════════════════════════════
  'junior.m2.l3': {
    goal: "Funksiya e'lon qilish, parametrlar, return qiymati va arrow funksiyalar.",
    student: `
## 🤔 Funksiya nima?

Funksiya — **qayta ishlatiladigan kod bloki**. Bir marta yoziladi, ko'p marta chaqiriladi.

\`\`\`javascript
// ❌ Funksiyasiz — takroriy kod
console.log("Salom, Aziz!");
console.log("Salom, Malika!");
console.log("Salom, Sardor!");

// ✅ Funksiya bilan
function salomlash(ism) {
  console.log(\`Salom, \${ism}!\`);
}

salomlash("Aziz");
salomlash("Malika");
salomlash("Sardor");
\`\`\`

Farq shunda: agar salomlashish matnini o'zgartirmoqchi bo'lsangiz, birinchi variantda **uch joyni**, ikkinchisida **bitta joyni** tuzatasiz.

---

## ⚠️ Nom berishda o'zbekcha apostrof — jiddiy tuzoq

Bu — o'zbek tilida dasturlashda **eng ko'p uchraydigan xato** va uni oldindan bilish kerak.

\`\`\`javascript
// ❌ BULARNING HAMMASI SINTAKSIS XATOSI
let yig'indi = 0;
let ko'paytma = 5;
function o'chirish() { }
const o'quvchi = "Ali";
\`\`\`

JavaScript o'zgaruvchi nomida faqat **harflar, raqamlar, \`_\` va \`$\`** ni qabul qiladi. Apostrof (\`'\`) **ruxsat etilmaydi** — u matn boshlanishi deb o'qiladi va kod buziladi.

\`\`\`javascript
// ✅ TO'G'RI — apostrofsiz yozing
let yigindi = 0;
let kopaytma = 5;
function ochirish() { }
const oquvchi = "Ali";
\`\`\`

> 💡 Odat qiling: **o'zgaruvchi nomlarini ingliz tilida** yozing (\`sum\`, \`product\`, \`student\`). Shunda apostrof muammosi umuman chiqmaydi va kodingiz xalqaro standartga mos bo'ladi.
>
> Matnlar (\`"Salom, o'quvchi!"\`) esa o'zbekcha bo'laversin — ular qo'shtirnoq ichida va muammo yo'q.

---

## 📝 Funksiya tuzilishi

\`\`\`javascript
function funksiyaNomi(parametr1, parametr2) {
  // kod
  return natija;
}
\`\`\`

\`\`\`demo h=400 "Funksiyani sinab ko'ring"
<style>
  body { font-family: sans-serif; font-size: 13px; margin: 0; padding: 16px; }
  .qator { display: flex; gap: 8px; align-items: center; margin-bottom: 12px; }
  input {
    width: 70px; padding: 7px; font-size: 14px; text-align: center;
    border: 2px solid #d1d5db; border-radius: 8px; outline: none;
  }
  input:focus { border-color: #6366f1; }
  .kod {
    background: #1f2937; border-radius: 8px; padding: 12px;
    font-family: monospace; font-size: 12px; color: #d1d5db;
    line-height: 1.8; margin-bottom: 12px;
  }
  .kalit { color: #c4b5fd; }
  .nom { color: #93c5fd; }
  .qiymat { color: #fbbf24; }
  #natija {
    background: #ecfdf5; border: 1px solid #a7f3d0;
    border-radius: 8px; padding: 12px; font-family: monospace;
    font-size: 14px; color: #065f46;
  }
</style>

<div class="kod">
  <span class="kalit">function</span> <span class="nom">qoshish</span>(a, b) {<br />
  &nbsp;&nbsp;<span class="kalit">return</span> a + b;<br />
  }
</div>

<div class="qator">
  <span>qoshish(</span>
  <input type="number" id="a" value="5" />
  <span>,</span>
  <input type="number" id="b" value="3" />
  <span>)</span>
</div>

<div id="natija"></div>

<script>
  function qoshish(a, b) {
    return a + b;
  }

  var aEl = document.querySelector('#a');
  var bEl = document.querySelector('#b');
  var natijaEl = document.querySelector('#natija');

  function render() {
    var a = Number(aEl.value);
    var b = Number(bEl.value);
    var natija = qoshish(a, b);
    natijaEl.textContent = 'qoshish(' + a + ', ' + b + ')  →  ' + natija;
  }

  aEl.addEventListener('input', render);
  bEl.addEventListener('input', render);
  render();
</script>
\`\`\`

Uchta qismi bor:

- **Parametrlar** (\`a\`, \`b\`) — funksiyaga kiradigan qiymatlar
- **Tana** — bajariladigan kod
- **\`return\`** — chiqadigan qiymat

---

## 📤 return — ikki vazifa bajaradi

\`\`\`javascript
function kvadrat(son) {
  return son * son;
}

const x = kvadrat(5);   // 25
\`\`\`

\`return\` qiymat qaytaradi — **va shu bilan birga funksiyani to'xtatadi**:

\`\`\`javascript
function tekshir(son) {
  if (son < 0) {
    return "Manfiy son!";     // shu yerda TO'XTAYDI
  }
  return son + " — musbat son";   // bu yerga yetib kelmaydi
}
\`\`\`

> ⚠️ \`return\` yozilmagan funksiya \`undefined\` qaytaradi. Bu — juda ko'p uchraydigan xato:
>
> \`\`\`javascript
> function qoshish(a, b) {
>   a + b;        // return yo'q!
> }
> console.log(qoshish(2, 3));   // undefined
> \`\`\`

---

## 📌 Default parametrlar

\`\`\`javascript
function salomlash(ism = "Do'st") {
  return \`Salom, \${ism}!\`;
}

salomlash("Aziz");   // "Salom, Aziz!"
salomlash();         // "Salom, Do'st!"
\`\`\`

Parametr berilmasa, standart qiymat ishlatiladi. Bu xatolardan himoya qiladi.

---

## 🏹 Arrow funksiyalar

Bir xil ishni qisqaroq yozish usuli:

\`\`\`demo h=380 "Uch xil yozuv — bir xil natija"
<style>
  body { font-family: sans-serif; font-size: 13px; margin: 0; padding: 14px; }
  .blok {
    background: #1f2937; border-radius: 8px; padding: 12px;
    font-family: monospace; font-size: 12px; color: #d1d5db;
    line-height: 1.8; margin-bottom: 10px;
  }
  .lbl { font-family: monospace; font-size: 11px; color: #6b7280; margin: 0 0 5px; }
  .kalit { color: #c4b5fd; }
  .nom { color: #93c5fd; }
  #natija {
    background: #ecfdf5; border: 1px solid #a7f3d0;
    border-radius: 8px; padding: 10px; font-family: monospace;
    font-size: 13px; color: #065f46; margin-top: 12px;
  }
  #natija div { padding: 2px 0; }
</style>

<p class="lbl">1 — oddiy funksiya</p>
<div class="blok">
  <span class="kalit">function</span> <span class="nom">qoshish1</span>(a, b) {<br />
  &nbsp;&nbsp;<span class="kalit">return</span> a + b;<br />
  }
</div>

<p class="lbl">2 — arrow funksiya</p>
<div class="blok">
  <span class="kalit">const</span> <span class="nom">qoshish2</span> = (a, b) =&gt; {<br />
  &nbsp;&nbsp;<span class="kalit">return</span> a + b;<br />
  };
</div>

<p class="lbl">3 — arrow, qisqa shakl (return yozilmaydi)</p>
<div class="blok">
  <span class="kalit">const</span> <span class="nom">qoshish3</span> = (a, b) =&gt; a + b;
</div>

<div id="natija"></div>

<script>
  function qoshish1(a, b) { return a + b; }
  var qoshish2 = function (a, b) { return a + b; };
  var qoshish3 = function (a, b) { return a + b; };

  var out = document.querySelector('#natija');
  function log(matn) {
    var d = document.createElement('div');
    d.textContent = matn;
    out.appendChild(d);
  }

  log('qoshish1(7, 3) → ' + qoshish1(7, 3));
  log('qoshish2(7, 3) → ' + qoshish2(7, 3));
  log('qoshish3(7, 3) → ' + qoshish3(7, 3));
</script>
\`\`\`

Qisqartirish qoidalari:

\`\`\`javascript
// To'liq
const kvadrat = (x) => { return x * x; };

// Bitta amal bo'lsa — qavs va return kerak emas
const kvadrat = x => x * x;

// Parametrsiz — bo'sh qavs majburiy
const salom = () => "Salom!";
\`\`\`

> 💡 Hozircha ikkalasini ham bilish yetarli. Farqi (\`this\` bilan bog'liq) keyinroq, React o'rganganda muhim bo'ladi.

---

## 🧮 Kalkulyator funksiyasi

\`\`\`demo h=400 "Amalni tanlang"
<style>
  body { font-family: sans-serif; font-size: 13px; margin: 0; padding: 16px; text-align: center; }
  .qator { display: flex; gap: 8px; align-items: center; justify-content: center; margin-bottom: 14px; }
  input {
    width: 70px; padding: 8px; font-size: 16px; text-align: center;
    border: 2px solid #d1d5db; border-radius: 8px; outline: none;
  }
  input:focus { border-color: #6366f1; }
  .amallar { display: flex; gap: 6px; justify-content: center; margin-bottom: 16px; }
  .amal {
    width: 42px; height: 42px; font-size: 18px; cursor: pointer;
    border: 2px solid #d1d5db; border-radius: 8px; background: white;
    font-weight: 700;
  }
  .amal.faol { background: #6366f1; color: white; border-color: #6366f1; }
  #natija {
    font-size: 26px; font-weight: 700; color: #065f46;
    background: #ecfdf5; border: 1px solid #a7f3d0;
    border-radius: 10px; padding: 14px; font-family: monospace;
  }
  .xato { color: #991b1b !important; background: #fef2f2 !important; border-color: #fecaca !important; }
</style>

<div class="qator">
  <input type="number" id="a" value="10" />
  <span id="belgi" style="font-size:20px;font-weight:700">+</span>
  <input type="number" id="b" value="4" />
</div>

<div class="amallar">
  <button class="amal faol" data-amal="+">+</button>
  <button class="amal" data-amal="-">−</button>
  <button class="amal" data-amal="*">×</button>
  <button class="amal" data-amal="/">÷</button>
</div>

<div id="natija"></div>

<script>
  function hisobla(a, b, amal) {
    if (amal === '+') return a + b;
    if (amal === '-') return a - b;
    if (amal === '*') return a * b;
    if (amal === '/') {
      if (b === 0) return "Nolga bo'lib bo'lmaydi!";
      return a / b;
    }
    return "Noma'lum amal";
  }

  var joriyAmal = '+';
  var aEl = document.querySelector('#a');
  var bEl = document.querySelector('#b');
  var belgiEl = document.querySelector('#belgi');
  var natijaEl = document.querySelector('#natija');
  var tugmalar = document.querySelectorAll('.amal');

  function render() {
    var a = Number(aEl.value);
    var b = Number(bEl.value);
    var natija = hisobla(a, b, joriyAmal);

    belgiEl.textContent = joriyAmal === '*' ? '×' : joriyAmal === '/' ? '÷' : joriyAmal;

    if (typeof natija === 'number') {
      natijaEl.textContent = Math.round(natija * 1000) / 1000;
      natijaEl.className = '';
    } else {
      natijaEl.textContent = natija;
      natijaEl.className = 'xato';
    }
  }

  for (var i = 0; i < tugmalar.length; i++) {
    tugmalar[i].addEventListener('click', function () {
      for (var j = 0; j < tugmalar.length; j++) {
        tugmalar[j].classList.remove('faol');
      }
      this.classList.add('faol');
      joriyAmal = this.dataset.amal;
      render();
    });
  }

  aEl.addEventListener('input', render);
  bEl.addEventListener('input', render);
  render();
</script>
\`\`\`

Ikkinchi sonni **0** qilib, bo'lish amalini tanlang — funksiya xato xabarini qaytaradi.

---

## 🥉 Bronze Topshiriq

\`salomlash(ism)\` funksiyasini yozing va uch xil ism bilan chaqiring.

---

## 🥈 Silver Topshiriq

To'rt amal funksiyasini arrow shaklda yozing. Bo'lishda nolga bo'lish holatini tekshiring.

---

## 🥇 Gold Topshiriq

\`baho(ball)\` funksiyasi: 90+ → "A'lo", 75+ → "Yaxshi", 55+ → "Qoniqarli", qolgani → "Qoniqarsiz".

Xuddi shuni **arrow funksiya va ternary** bilan ham yozing. Ikkalasining natijasi bir xil ekaniga ishonch hosil qiling.

---

## ✅ Dars Xulosa

- Funksiya — bir marta yoziladi, ko'p marta ishlatiladi
- **Nomda apostrof ishlatmang** — \`yigindi\`, \`yig'indi\` emas
- \`return\` — qiymat qaytaradi **va funksiyani to'xtatadi**
- \`return\` yo'q bo'lsa — \`undefined\` qaytadi
- Default parametr: \`function f(x = 10)\`
- Arrow: \`const f = (a, b) => a + b;\`

> 🚀 **Keyingi dars:** Tsikllar — for va while!
`,
    teacher: `
## ⚠️ Notion kodida sintaksis xatosi bor

Asl sahifada shunday kod yozilgan:

\`\`\`javascript
function yig'indi(a, b) { return a + b; }
const ko'paytma = (a, b) => a * b;
\`\`\`

**Bu kod ishlamaydi.** JavaScript o'zgaruvchi nomida apostrof (\`'\`) ni qabul qilmaydi — u matn boshlanishi deb o'qiladi va \`SyntaxError\` chiqadi.

Bu — o'zbek tilida dasturlashda **tizimli muammo**. Bolalar tabiiy ravishda \`o'quvchi\`, \`yig'indi\`, \`ko'paytma\` deb yozadi va kod buziladi. Xato xabari (\`Unexpected identifier\`) esa sababini tushuntirmaydi.

**Yechim:** bu darsga alohida ogohlantirish bo'limi qo'shildi va tavsiya berildi — **o'zgaruvchi nomlarini ingliz tilida** yozish (\`sum\`, \`product\`, \`student\`). Matnlar o'zbekcha qolaversin, ular qo'shtirnoq ichida.

**Buni birinchi darsdayoq odat qildiring.** Keyinchalik tuzatish qiyinroq bo'ladi.

Notion'dagi asl kodni ham tuzatish kerak.

---

## 💡 O'qituvchi uchun

- Funksiyani "retsept" deb tushuntiring: bir marta yoziladi, har safar boshqa mahsulot bilan ishlatiladi. Parametrlar — mahsulotlar, \`return\` — tayyor taom.
- \`return\` **funksiyani to'xtatishini** albatta ko'rsating. \`return\` dan keyin \`console.log\` yozib qo'ying — u hech qachon ishlamaydi. Bolalar buni ko'rmaguncha tushunmaydi.
- \`return\` unutish — eng ko'p uchraydigan xato. Ataylab \`return\` siz funksiya yozing, \`undefined\` chiqqanini ko'rsating.
- Arrow funksiyalarni **majburlamang**. Ikkala shaklni ham ko'rsating, lekin bola qaysi birini qulay deb hisoblasa o'shani ishlatsin. \`this\` farqi hozircha ahamiyatsiz.
- Kalkulyator demosi — 4-oy yakuniy loyihasining kichik versiyasi. Bolalarga ayting: "oy oxirida shuni to'liq yozasiz".

## ⚠️ Ko'p uchraydigan xatolar

- **Nomda apostrof** — yuqorida batafsil.
- **\`return\` unutilgan** — funksiya \`undefined\` qaytaradi.
- **Funksiya chaqirilmagan** — \`qoshish\` yozilgan, \`qoshish(2,3)\` emas. Qavssiz — bu funksiyaning o'zi, natija emas.
- **Parametr va argument chalkashtirilgan** — bu atamalarni hozir chuqurlashtirmang.
- **\`return\` dan keyin yangi qator** — \`return\` va qiymat **bir qatorda** bo'lishi kerak, aks holda JS avtomatik nuqta-vergul qo'yadi va \`undefined\` qaytaradi. Bu — juda chalkash xato.

## 📊 Daraja belgilash

- **Bronze** — funksiya ishlaydi, uch marta chaqirilgan
- **Silver** — arrow shakl, nolga bo'lish tekshirilgan
- **Gold** — ikki xil yozuv, natijalar bir xil

> Silver'ni tekshirishda \`divide(10, 0)\` ni sinang. Xato xabari chiqmasa — shart yozilmagan.
`,
  },

  // ═══════════════════════════════════════════════════════════
  'junior.m2.l4': {
    goal: "Takroriy amallar uchun for, while, do-while va break/continue.",
    student: `
## 🤔 Tsikl nima?

\`\`\`javascript
// ❌ Tsiklsiz
console.log("1-qadam");
console.log("2-qadam");
console.log("3-qadam");
// ... 100 marta yozasizmi?

// ✅ Tsikl bilan
for (let i = 1; i <= 100; i++) {
  console.log(i + "-qadam");
}
\`\`\`

---

## 🔁 for — uch qismli

\`\`\`javascript
for (boshlanish; shart; qadam) {
  // takrorlanadigan kod
}
\`\`\`

Quyidagi demoda tsikl **qadam-baqadam** ishlaydi. "Keyingi qadam" ni bosing:

\`\`\`demo h=420 "Tsikl ichida nima bo'lyapti"
<style>
  body { font-family: sans-serif; font-size: 13px; margin: 0; padding: 14px; }

  .kod {
    background: #1f2937; border-radius: 8px; padding: 12px;
    font-family: monospace; font-size: 12px; color: #9ca3af;
    line-height: 1.9; margin-bottom: 12px;
  }
  .kod div { padding: 1px 0; }
  .kod .faol { background: #374151; color: #fbbf24; border-radius: 4px; }

  .holat { display: flex; gap: 10px; margin-bottom: 12px; }
  .quti {
    flex: 1; background: #eff6ff; border: 1px solid #bfdbfe;
    border-radius: 8px; padding: 8px; text-align: center;
  }
  .quti .nom { font-size: 10px; color: #6b7280; font-family: monospace; }
  .quti .val { font-size: 18px; font-weight: 700; color: #1e40af; font-family: monospace; }

  #chiqish {
    background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px;
    padding: 10px; font-family: monospace; font-size: 13px; color: #065f46;
    min-height: 44px; line-height: 1.6;
  }

  button {
    padding: 8px 16px; border: none; border-radius: 8px;
    background: #6366f1; color: white; font-size: 12px;
    cursor: pointer; margin-right: 6px;
  }
  button:disabled { background: #d1d5db; cursor: not-allowed; }
  #reset { background: #9ca3af; }
</style>

<div class="kod">
  <div id="k1">for (let i = 1; i &lt;= 5; i++) {</div>
  <div id="k2">&nbsp;&nbsp;console.log(i);</div>
  <div id="k3">}</div>
</div>

<div class="holat">
  <div class="quti"><div class="nom">i</div><div class="val" id="iVal">—</div></div>
  <div class="quti"><div class="nom">i &lt;= 5</div><div class="val" id="shartVal">—</div></div>
</div>

<div id="chiqish"></div>

<div style="margin-top:12px">
  <button id="keyingi">Keyingi qadam</button>
  <button id="reset">Boshidan</button>
</div>

<script>
  var i = null;
  var bosqich = 0;   // 0=boshlanish, 1=shart, 2=tana, 3=qadam, 4=tugadi
  var chiqish = [];

  var iVal = document.querySelector('#iVal');
  var shartVal = document.querySelector('#shartVal');
  var chiqishEl = document.querySelector('#chiqish');
  var keyingiBtn = document.querySelector('#keyingi');

  function tozala() {
    document.querySelector('#k1').className = '';
    document.querySelector('#k2').className = '';
    document.querySelector('#k3').className = '';
  }

  function render(faolId, izoh) {
    tozala();
    if (faolId) document.querySelector(faolId).className = 'faol';
    iVal.textContent = i === null ? '—' : i;
    shartVal.textContent = i === null ? '—' : (i <= 5 ? 'true' : 'false');
    chiqishEl.innerHTML = chiqish.join('<br />') + (izoh ? '<br /><span style="color:#6b7280">' + izoh + '</span>' : '');
  }

  function qadam() {
    if (bosqich === 0) {
      i = 1;
      bosqich = 1;
      render('#k1', 'i = 1 qilib belgilandi');
    } else if (bosqich === 1) {
      if (i <= 5) {
        bosqich = 2;
        render('#k1', 'Shart rost → tanaga kiramiz');
      } else {
        bosqich = 4;
        render('#k3', 'Shart yolgon → tsikl tugadi');
        keyingiBtn.disabled = true;
      }
    } else if (bosqich === 2) {
      chiqish.push(String(i));
      bosqich = 3;
      render('#k2', 'console.log(' + i + ')');
    } else if (bosqich === 3) {
      i++;
      bosqich = 1;
      render('#k1', 'i++ → i endi ' + i);
    }
  }

  keyingiBtn.addEventListener('click', qadam);

  document.querySelector('#reset').addEventListener('click', function () {
    i = null; bosqich = 0; chiqish = [];
    keyingiBtn.disabled = false;
    render(null, '');
  });

  render(null, '');
</script>
\`\`\`

Tartibga diqqat qiling: **shart har safar tekshiriladi**, keyin tana bajariladi, keyin \`i++\`. Shart yolg'on bo'lganda tsikl tugaydi.

---

## 🔄 Turli qadamlar

\`\`\`javascript
// Oldinga
for (let i = 1; i <= 5; i++) { }        // 1 2 3 4 5

// Teskari
for (let i = 5; i >= 1; i--) { }        // 5 4 3 2 1

// Ikkitadan
for (let i = 0; i <= 10; i += 2) { }    // 0 2 4 6 8 10
\`\`\`

\`i\` — "iterator" so'zining qisqartmasi. Odatda \`i\`, \`j\`, \`k\` ishlatiladi.

---

## 🔭 while — soni noma'lum bo'lganda

\`\`\`javascript
let i = 1;
while (i <= 5) {
  console.log(i);
  i++;              // ⚠️ BUNI UNUTMANG!
}
\`\`\`

> ⚠️ **Cheksiz tsikl xavfi.** \`while\` ichida shartni o'zgartirmasangiz, u **hech qachon to'xtamaydi** va brauzer muzlab qoladi. Sahifani yopishga to'g'ri keladi.
>
> \`for\` da bu xavf kamroq, chunki \`i++\` sintaksisning bir qismi.

\`for\` va \`while\` farqi:

- **\`for\`** — necha marta takrorlanishi **ma'lum** (1 dan 10 gacha)
- **\`while\`** — **noma'lum** (shart bajarilguncha)

---

## ⏹ break va continue

\`\`\`demo h=400 "Farqni ko'ring"
<style>
  body { font-family: sans-serif; font-size: 13px; margin: 0; padding: 14px; }
  .blok { margin-bottom: 14px; }
  .kod {
    background: #1f2937; border-radius: 8px 8px 0 0; padding: 10px;
    font-family: monospace; font-size: 11px; color: #d1d5db; line-height: 1.7;
  }
  .nat {
    background: #ecfdf5; border: 1px solid #a7f3d0; border-top: none;
    border-radius: 0 0 8px 8px; padding: 10px;
    font-family: monospace; font-size: 14px; color: #065f46; letter-spacing: 2px;
  }
  .lbl { font-family: monospace; font-size: 11px; color: #6b7280; margin: 0 0 5px; }
</style>

<div class="blok">
  <p class="lbl">break — tsiklni butunlay to'xtatadi</p>
  <div class="kod">
    for (let i = 1; i &lt;= 10; i++) {<br />
    &nbsp;&nbsp;if (i === 5) break;<br />
    &nbsp;&nbsp;console.log(i);<br />
    }
  </div>
  <div class="nat" id="n1"></div>
</div>

<div class="blok">
  <p class="lbl">continue — faqat shu qadamni o'tkazib yuboradi</p>
  <div class="kod">
    for (let i = 1; i &lt;= 10; i++) {<br />
    &nbsp;&nbsp;if (i % 2 === 0) continue;<br />
    &nbsp;&nbsp;console.log(i);<br />
    }
  </div>
  <div class="nat" id="n2"></div>
</div>

<script>
  var r1 = [];
  for (var i = 1; i <= 10; i++) {
    if (i === 5) break;
    r1.push(i);
  }
  document.querySelector('#n1').textContent = r1.join(' ');

  var r2 = [];
  for (var j = 1; j <= 10; j++) {
    if (j % 2 === 0) continue;
    r2.push(j);
  }
  document.querySelector('#n2').textContent = r2.join(' ');
</script>
\`\`\`

- **\`break\`** — chiqib ketadi, qolgani bajarilmaydi
- **\`continue\`** — shu qadamni tashlab, keyingisiga o'tadi

---

## 🎯 FizzBuzz — klassik masala

Bu masala ish intervyularida haqiqatan so'raladi.

\`\`\`demo h=400 "FizzBuzz — 1 dan 30 gacha"
<style>
  body { font-family: sans-serif; font-size: 13px; margin: 0; padding: 14px; }
  #panjara {
    display: grid; grid-template-columns: repeat(5, 1fr); gap: 5px;
  }
  .katak {
    padding: 8px 4px; border-radius: 6px; text-align: center;
    font-family: monospace; font-size: 11px; font-weight: 600;
  }
  .son { background: #f3f4f6; color: #4b5563; }
  .fizz { background: #dbeafe; color: #1e40af; }
  .buzz { background: #fef3c7; color: #92400e; }
  .fizzbuzz { background: #dcfce7; color: #166534; }
  .izoh { margin-top: 12px; font-size: 11px; color: #6b7280; line-height: 1.7; }
</style>

<div id="panjara"></div>

<p class="izoh">
  🔵 Fizz = 3 ga bo'linadi &nbsp;·&nbsp;
  🟡 Buzz = 5 ga &nbsp;·&nbsp;
  🟢 FizzBuzz = ikkalasiga ham
</p>

<script>
  var panjara = document.querySelector('#panjara');

  for (var i = 1; i <= 30; i++) {
    var matn, klass;

    if (i % 15 === 0)      { matn = 'FizzBuzz'; klass = 'fizzbuzz'; }
    else if (i % 3 === 0)  { matn = 'Fizz';     klass = 'fizz'; }
    else if (i % 5 === 0)  { matn = 'Buzz';     klass = 'buzz'; }
    else                   { matn = i;          klass = 'son'; }

    var d = document.createElement('div');
    d.className = 'katak ' + klass;
    d.textContent = matn;
    panjara.appendChild(d);
  }
</script>
\`\`\`

> 💡 **Muhim nuqta:** \`i % 15 === 0\` **birinchi** tekshiriladi. Agar \`i % 3\` ni oldin yozsangiz, 15 uchun "Fizz" chiqadi va "FizzBuzz" hech qachon ko'rinmaydi. Bu — 2-darsdagi "tartib muhim" qoidasining amaliy misoli.

---

## 📚 for...of — massiv elementlari uchun

\`\`\`javascript
const mevalar = ["olma", "nok", "o'rik"];

for (const meva of mevalar) {
  console.log(meva);
}
\`\`\`

Bu — oddiy \`for\` dan qulayroq, chunki indeks bilan ovora bo'lish shart emas. Massivlarni keyingi darsda batafsil o'rganasiz.

---

## 🥉 Bronze Topshiriq

1 dan 10 gacha sonlarni chiqaring.

---

## 🥈 Silver Topshiriq

- Faqat toq sonlarni chiqaring (\`continue\` bilan)
- FizzBuzz ni 1 dan 30 gacha yozing

---

## 🥇 Gold Topshiriq

1 dan N gacha yig'indini hisoblang (N ni o'zingiz belgilang).

Natijani formula bilan tekshiring: \`N * (N + 1) / 2\`

Ikkalasi bir xil chiqishi kerak. Chiqmasa — tsiklda xato bor.

---

## ✅ Dars Xulosa

- \`for\` — takror soni ma'lum bo'lganda
- \`while\` — noma'lum bo'lganda, lekin **cheksiz tsikl xavfi** bor
- \`break\` — to'xtatadi, \`continue\` — o'tkazib yuboradi
- FizzBuzz'da \`% 15\` **birinchi** tekshirilishi shart
- \`for...of\` — massiv elementlari uchun

> 🚀 **Keyingi dars:** Massivlar!
`,
    teacher: `
## 💡 O'qituvchi uchun

- **Qadam-baqadam demo** — bu darsning eng qimmatli qismi. Tsikl bolalar uchun sehrli qora quti. Demoni sinfda proyektorda oching va "Keyingi qadam" ni birga bosib chiqing, har qadamda so'rang: "endi nima bo'ladi?"
- \`for\` ning uch qismi qachon ishlashini ta'kidlang: boshlanish **bir marta**, shart **har safar**, qadam **tana tugagach**. Bu tartibni bilmagan bola tsiklni hech qachon to'liq tushunmaydi.
- **Cheksiz tsiklni ataylab qilib ko'rsating** — lekin o'zingizning kompyuteringizda va ogohlantirib. Brauzer muzlab qolganini ko'rgan bola \`i++\` ni boshqa unutmaydi. Keyin tabni yoping va davom eting.
- FizzBuzz — ish intervyularida haqiqatan so'raladigan masala ekanini ayting. Bu bolalarni jiddiy qiziqtiradi.
- \`% 15\` tartibi — 2-darsdagi "shartlar tartibi" mavzusining takrori. Bog'lanishni ko'rsating.

## ⚠️ Ko'p uchraydigan xatolar

- **Cheksiz tsikl** — \`while\` ichida \`i++\` yo'q. Eng xavfli xato.
- **\`<\` va \`<=\` chalkashligi** — \`i < 5\` bilan 4 tagacha, \`i <= 5\` bilan 5 tagacha. Bir qadam farq ("off-by-one") — dasturlashdagi klassik xato.
- **\`let\` o'rniga \`var\`** — hozircha muammo bermaydi, lekin funksiya ichida ishlatilganda chalkashlik chiqadi.
- **FizzBuzz tartibi noto'g'ri** — \`% 3\` birinchi yozilgan, "FizzBuzz" hech qachon chiqmaydi.
- **\`break\` va \`continue\` chalkashtirilgan** — demoni qayta ko'rsating.
- **Tsikl ichida \`i\` ni o'zgartirish** — \`for\` ichida \`i = 10\` deb yozish tsiklni buzadi.

## 📊 Daraja belgilash

- **Bronze** — tsikl ishlaydi, 1 dan 10 gacha to'g'ri chiqadi
- **Silver** — continue bilan toq sonlar, FizzBuzz to'g'ri (15 tekshiriladi)
- **Gold** — yig'indi formula bilan mos tushadi

> Silver'ni tekshirishning tez usuli: natijada **15** o'rnida "FizzBuzz" turibdimi? "Fizz" bo'lsa — tartib xato.
`,
  },

  // ═══════════════════════════════════════════════════════════
  'junior.m2.l5': {
    goal: "Massiv yaratish, elementlarga murojaat, push/pop va map/filter/reduce.",
    student: `
## 📊 Massiv nima?

Massiv — **tartibli ro'yxat**. Bitta o'zgaruvchida ko'p qiymat saqlaydi.

\`\`\`javascript
const mevalar = ["olma", "nok", "orik", "shaftoli"];
//     indeks:     0       1       2         3
\`\`\`

> ⚠️ Indeks **noldan** boshlanadi. Birinchi element — \`[0]\`, ikkinchisi — \`[1]\`. Bu dasturlashdagi eng ko'p xato manbai.

---

## 🔢 Elementlar bilan ishlash

\`\`\`demo h=400 "Massivni o'zgartirib ko'ring"
<style>
  body { font-family: sans-serif; font-size: 13px; margin: 0; padding: 14px; }

  #massiv {
    display: flex; gap: 6px; flex-wrap: wrap;
    min-height: 62px; align-items: flex-start; margin-bottom: 14px;
  }
  .el { text-align: center; }
  .el .quti {
    background: #6366f1; color: white; padding: 12px 14px;
    border-radius: 8px; font-family: monospace; font-weight: 600;
  }
  .el .idx { font-size: 10px; color: #9ca3af; font-family: monospace; margin-top: 3px; }
  .bosh { color: #9ca3af; font-style: italic; padding: 14px 0; }

  .tugmalar { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 12px; }
  button {
    padding: 7px 12px; border: none; border-radius: 7px;
    font-size: 11px; cursor: pointer; color: white; font-family: monospace;
  }
  .qosh { background: #16a34a; }
  .ochir { background: #dc2626; }
  .reset { background: #6b7280; }

  #log {
    background: #1f2937; color: #d1d5db; border-radius: 8px; padding: 10px;
    font-family: monospace; font-size: 11px; line-height: 1.7;
    min-height: 80px; max-height: 100px; overflow-y: auto;
  }
  .qaytdi { color: #fbbf24; }
</style>

<div id="massiv"></div>

<div class="tugmalar">
  <button class="qosh" id="push">push("yangi")</button>
  <button class="qosh" id="unshift">unshift("bosh")</button>
  <button class="ochir" id="pop">pop()</button>
  <button class="ochir" id="shift">shift()</button>
  <button class="reset" id="reset">Boshidan</button>
</div>

<div id="log"></div>

<script>
  var boshlangich = ['olma', 'nok', 'orik'];
  var arr = boshlangich.slice();

  var massivEl = document.querySelector('#massiv');
  var logEl = document.querySelector('#log');

  function log(matn, qaytdi) {
    var d = document.createElement('div');
    d.innerHTML = matn + (qaytdi !== undefined
      ? '  <span class="qaytdi">→ ' + JSON.stringify(qaytdi) + '</span>' : '');
    logEl.insertBefore(d, logEl.firstChild);
  }

  function render() {
    if (arr.length === 0) {
      massivEl.innerHTML = '<div class="bosh">Massiv bo\\'sh — length: 0</div>';
      return;
    }
    var html = '';
    for (var i = 0; i < arr.length; i++) {
      html += '<div class="el"><div class="quti">' + arr[i] + '</div>' +
              '<div class="idx">[' + i + ']</div></div>';
    }
    massivEl.innerHTML = html;
  }

  document.querySelector('#push').addEventListener('click', function () {
    var n = arr.push('yangi');
    log('arr.push("yangi")', n);
    render();
  });

  document.querySelector('#unshift').addEventListener('click', function () {
    var n = arr.unshift('bosh');
    log('arr.unshift("bosh")', n);
    render();
  });

  document.querySelector('#pop').addEventListener('click', function () {
    var v = arr.pop();
    log('arr.pop()', v);
    render();
  });

  document.querySelector('#shift').addEventListener('click', function () {
    var v = arr.shift();
    log('arr.shift()', v);
    render();
  });

  document.querySelector('#reset').addEventListener('click', function () {
    arr = boshlangich.slice();
    logEl.innerHTML = '';
    render();
  });

  render();
</script>
\`\`\`

Diqqat qiling: \`push\` va \`unshift\` **yangi uzunlikni** qaytaradi, \`pop\` va \`shift\` esa **o'chirilgan elementni**.

| Metod | Qayerga | Nima qaytaradi |
| --- | --- | --- |
| \`push(x)\` | Oxiriga qo'shadi | Yangi uzunlik |
| \`pop()\` | Oxiridan o'chiradi | O'chirilgan element |
| \`unshift(x)\` | Boshiga qo'shadi | Yangi uzunlik |
| \`shift()\` | Boshidan o'chiradi | O'chirilgan element |

---

## 🔍 Qidirish

\`\`\`javascript
const raqamlar = [10, 20, 30, 40, 50];

raqamlar.indexOf(30);      // 2
raqamlar.indexOf(99);      // -1  ← topilmadi
raqamlar.includes(40);     // true
\`\`\`

> ⚠️ \`indexOf\` topilmasa **\`-1\`** qaytaradi, \`false\` emas. Shuning uchun \`if (arr.indexOf(x))\` **noto'g'ri** — chunki \`-1\` truthy. To'g'risi: \`if (arr.indexOf(x) !== -1)\` yoki soddaroq — \`if (arr.includes(x))\`.

---

## 🌟 map, filter, reduce — uchta asosiy metod

Bu uchtasi zamonaviy JavaScript'ning yuragi. Ularni tushunsangiz, kod ancha qisqa va tushunarli bo'ladi.

\`\`\`demo h=420 "Uchalasi bir xil massivda"
<style>
  body { font-family: sans-serif; font-size: 12px; margin: 0; padding: 14px; }

  .qator { margin-bottom: 14px; }
  .lbl { font-family: monospace; font-size: 11px; color: #4b5563; margin: 0 0 5px; }
  .kod {
    background: #1f2937; color: #d1d5db; border-radius: 6px;
    padding: 7px 10px; font-family: monospace; font-size: 11px;
    margin-bottom: 5px;
  }
  .massiv { display: flex; gap: 4px; flex-wrap: wrap; }
  .q {
    padding: 7px 11px; border-radius: 6px;
    font-family: monospace; font-weight: 600; font-size: 12px;
  }
  .kirish { background: #e5e7eb; color: #374151; }
  .map { background: #dbeafe; color: #1e40af; }
  .filter { background: #dcfce7; color: #166534; }
  .reduce { background: #fef3c7; color: #92400e; padding: 7px 16px; }
  .strelka { color: #9ca3af; margin: 4px 0; font-size: 14px; }
</style>

<div class="qator">
  <p class="lbl">Boshlang'ich massiv</p>
  <div class="massiv" id="kirish"></div>
</div>

<div class="strelka">↓</div>

<div class="qator">
  <p class="lbl">map — HAR BIRINI o'zgartiradi, uzunlik saqlanadi</p>
  <div class="kod">sonlar.map(n =&gt; n * 2)</div>
  <div class="massiv" id="mapNat"></div>
</div>

<div class="qator">
  <p class="lbl">filter — SHARTGA MOSLARINI tanlaydi, uzunlik kamayadi</p>
  <div class="kod">sonlar.filter(n =&gt; n % 2 === 0)</div>
  <div class="massiv" id="filterNat"></div>
</div>

<div class="qator">
  <p class="lbl">reduce — HAMMASINI bitta qiymatga yig'adi</p>
  <div class="kod">sonlar.reduce((yigindi, n) =&gt; yigindi + n, 0)</div>
  <div class="massiv" id="reduceNat"></div>
</div>

<script>
  var sonlar = [1, 2, 3, 4, 5, 6];

  function chiz(id, massiv, klass) {
    var el = document.querySelector(id);
    var html = '';
    for (var i = 0; i < massiv.length; i++) {
      html += '<div class="q ' + klass + '">' + massiv[i] + '</div>';
    }
    el.innerHTML = html;
  }

  chiz('#kirish', sonlar, 'kirish');
  chiz('#mapNat', sonlar.map(function (n) { return n * 2; }), 'map');
  chiz('#filterNat', sonlar.filter(function (n) { return n % 2 === 0; }), 'filter');
  chiz('#reduceNat', [sonlar.reduce(function (a, n) { return a + n; }, 0)], 'reduce');
</script>
\`\`\`

Farqni eslab qolish oson:

- **\`map\`** — har elementni **o'zgartiradi**. Kirish 6 ta → chiqish 6 ta
- **\`filter\`** — elementlarni **tanlaydi**. Kirish 6 ta → chiqish kamroq
- **\`reduce\`** — hammasini **bitta** qiymatga yig'adi

Uchalasi ham **yangi massiv** qaytaradi — asl massiv o'zgarmaydi.

---

## 📊 Amaliy misol: o'quvchilar ro'yxati

\`\`\`demo h=400 "Chegarani o'zgartiring"
<style>
  body { font-family: sans-serif; font-size: 13px; margin: 0; padding: 14px; }
  .boshqaruv { display: flex; gap: 10px; align-items: center; margin-bottom: 14px; }
  input[type=range] { flex: 1; }
  .chegara { font-family: monospace; font-weight: 700; color: #6366f1; min-width: 34px; }

  .talaba {
    display: flex; justify-content: space-between; align-items: center;
    padding: 8px 12px; border-radius: 8px; margin-bottom: 5px;
    font-size: 13px;
  }
  .otdi { background: #dcfce7; color: #166534; }
  .otmadi { background: #f3f4f6; color: #9ca3af; }
  .ball { font-family: monospace; font-weight: 700; }

  .xulosa {
    margin-top: 12px; padding: 10px; border-radius: 8px;
    background: #eff6ff; border: 1px solid #bfdbfe;
    font-family: monospace; font-size: 12px; color: #1e40af; line-height: 1.8;
  }
</style>

<div class="boshqaruv">
  <span style="font-size:12px;color:#6b7280">O'tish chegarasi:</span>
  <input type="range" id="chegara" min="50" max="100" value="80" />
  <span class="chegara" id="chegaraVal">80</span>
</div>

<div id="royxat"></div>
<div class="xulosa" id="xulosa"></div>

<script>
  var talabalar = [
    { ism: 'Kamol',    ball: 88 },
    { ism: 'Nozima',   ball: 95 },
    { ism: 'Bobur',    ball: 72 },
    { ism: 'Hulkar',   ball: 91 },
    { ism: 'Jahongir', ball: 65 }
  ];

  var slider = document.querySelector('#chegara');
  var chegaraVal = document.querySelector('#chegaraVal');
  var royxat = document.querySelector('#royxat');
  var xulosa = document.querySelector('#xulosa');

  function render() {
    var chegara = Number(slider.value);
    chegaraVal.textContent = chegara;

    var html = '';
    for (var i = 0; i < talabalar.length; i++) {
      var t = talabalar[i];
      var klass = t.ball >= chegara ? 'otdi' : 'otmadi';
      html += '<div class="talaba ' + klass + '"><span>' + t.ism + '</span>' +
              '<span class="ball">' + t.ball + '</span></div>';
    }
    royxat.innerHTML = html;

    var otganlar = talabalar.filter(function (t) { return t.ball >= chegara; });
    var ismlar = otganlar.map(function (t) { return t.ism; });
    var yigindi = talabalar.reduce(function (s, t) { return s + t.ball; }, 0);
    var ortacha = yigindi / talabalar.length;

    xulosa.innerHTML =
      'filter → o\\'tganlar: ' + otganlar.length + ' ta<br />' +
      'map → ismlar: [' + ismlar.join(', ') + ']<br />' +
      'reduce → o\\'rtacha ball: ' + ortacha.toFixed(1);
  }

  slider.addEventListener('input', render);
  render();
</script>
\`\`\`

---

## ⚠️ sort — asl massivni o'zgartiradi

\`\`\`javascript
const sonlar = [10, 5, 25, 1, 100];

sonlar.sort();               // ❌ [1, 10, 100, 25, 5]  — NOTO'G'RI!
sonlar.sort((a, b) => a - b); // ✅ [1, 5, 10, 25, 100]
\`\`\`

Birinchi variant nima uchun noto'g'ri? Chunki \`sort()\` sonlarni **matn sifatida** solishtiradi: \`"100"\` alifbo bo'yicha \`"25"\` dan oldin keladi.

Sonlar uchun **har doim** taqqoslash funksiyasi bering: \`(a, b) => a - b\`.

Yana bir nozik nuqta: \`sort\` **asl massivni o'zgartiradi**. Asl ro'yxatni saqlamoqchi bo'lsangiz:

\`\`\`javascript
const tartiblangan = [...sonlar].sort((a, b) => a - b);
\`\`\`

\`[...sonlar]\` — bu **nusxa** yaratadi (spread operatori).

---

## 🥉 Bronze Topshiriq

Sevimli filmlaringiz massivini yarating. Birinchi va oxirgi elementni chiqaring, yangisini \`push\` bilan qo'shing, hammasini \`forEach\` bilan chiqaring.

---

## 🥈 Silver Topshiriq

\`[3, 7, 1, 9, 4, 6, 2, 8, 5]\` massivi bilan:

- \`filter\` — juft sonlar
- \`map\` — har birining kvadrati
- \`sort\` — o'sish tartibida (**asl massivni buzmasdan**)

---

## 🥇 Gold Topshiriq

O'quvchilar massivi bilan ishlang:

\`\`\`javascript
const students = [
  { name: "Ali",     score: 85 },
  { name: "Vali",    score: 92 },
  { name: "Malika",  score: 78 },
  { name: "Dilnoza", score: 95 },
  { name: "Murod",   score: 60 }
];
\`\`\`

- 80+ ball olganlarning **ismlarini** chiqaring (\`filter\` + \`map\`)
- O'rtacha ballni hisoblang (\`reduce\`)
- Ballga ko'ra kamayish tartibida chiqaring

> ⚠️ O'zgaruvchi nomlarida apostrof ishlatmang. \`alochilar\` yoki \`topStudents\` deb yozing, \`a'lochilar\` emas — bu **sintaksis xatosi** beradi.

---

## ✅ Dars Xulosa

- Indeks **noldan** boshlanadi
- \`push\`/\`pop\` — oxiriga, \`unshift\`/\`shift\` — boshiga
- \`indexOf\` topilmasa **\`-1\`** qaytaradi, \`includes\` ishlatish qulayroq
- \`map\` — o'zgartiradi, \`filter\` — tanlaydi, \`reduce\` — yig'adi
- \`sort()\` sonlarni **matn** deb solishtiradi — \`(a, b) => a - b\` bering
- \`sort\` asl massivni o'zgartiradi — \`[...arr].sort()\` bilan nusxa oling

> 🚀 **Keyingi dars:** Obyektlar!
`,
    teacher: `
## ⚠️ Notion kodida apostrof xatosi (yana)

Gold topshiriqda:

\`\`\`javascript
const a'lochilar = talabalar.filter(t => t.ball >= 80);
\`\`\`

\`a'lochilar\` — **sintaksis xatosi**. 3-darsdagi bir xil muammo.

Bu — endi **tizimli naqsh**. O'zbekcha so'zlar apostrof bilan yoziladi va ular o'zgaruvchi nomi sifatida ishlamaydi. Darsga ogohlantirish qo'shildi va Gold topshiriqdagi o'zgaruvchilar inglizcha nomlangan.

Notion'dagi asl kodni ham tuzatish kerak.

---

## 💡 O'qituvchi uchun

- **Interaktiv massiv demosi** — \`push\`/\`pop\`/\`shift\`/\`unshift\` farqini tushuntirishning eng tez yo'li. Tugmalarni bosib ko'rsating, indekslar qanday siljishini kuzating.
- \`shift\` va \`unshift\` nomlari mantiqsiz tuyuladi. Oddiy eslatma: **"un"shift — qo'shadi** (unshift = boshiga qo'sh), shift — oladi.
- **map/filter/reduce** — bu darsning eng muhim qismi. Vizual demoni ko'rsating: uchala natija bir ekranda, ranglari boshqa. "map uzunlikni saqlaydi, filter kamaytiradi, reduce bittaga yig'adi" — shu jumlani takrorlatib yozdiring.
- \`sort()\` muammosi — albatta ko'rsating. \`[10, 5, 100].sort()\` natijasini konsolda chiqaring. Bolalar hayron qoladi va sababini so'raydi. Javob: sonlar matn sifatida solishtiriladi.
- \`indexOf\` va \`-1\` tuzog'i — bu haqiqiy loyihalarda ko'p xato beradi. \`includes\` ni odat qildiring.

## ⚠️ Ko'p uchraydigan xatolar

- **Nomda apostrof** — yuqorida.
- **Indeks 1 dan boshlanadi deb o'ylash** — \`arr[1]\` birinchi element emas, ikkinchisi.
- **\`arr.length\` va oxirgi indeks chalkashligi** — oxirgi element \`arr[arr.length - 1]\`, \`arr[arr.length]\` emas (u \`undefined\`).
- **\`sort()\` taqqoslash funksiyasisiz** — sonlar noto'g'ri tartiblanadi.
- **\`sort\` asl massivni buzgan** — bola keyin asl tartibni qidiradi.
- **\`map\` o'rniga \`forEach\`** — \`forEach\` hech narsa qaytarmaydi, \`const yangi = arr.forEach(...)\` → \`undefined\`.
- **\`filter\` ichida \`return\` unutilgan** — \`arr.filter(n => { n > 5 })\` bo'sh massiv qaytaradi. Qavs ochilsa \`return\` kerak.

## 📊 Daraja belgilash

- **Bronze** — massiv yaratilgan, push va forEach ishlaydi
- **Silver** — filter/map/sort to'g'ri, asl massiv buzilmagan
- **Gold** — obyektlar massivi bilan zanjir (filter → map), reduce bilan o'rtacha

> Silver'ni tekshirish: asl massivni topshiriq oxirida chiqartiring. O'zgargan bo'lsa — \`[...arr]\` ishlatilmagan.
`,
  },

  // ═══════════════════════════════════════════════════════════
  'junior.m2.l6': {
    goal: "Obyekt yaratish, xususiyatlarga murojaat, metodlar va destructuring.",
    student: `
## 📋 Obyekt nima?

Massiv — tartibli ro'yxat. Obyekt — **nomlangan** xususiyatlar to'plami.

\`\`\`javascript
// Massiv — indeks bilan. Nima ekani noaniq
const arr = ["Ahmadjon", 15, "Toshkent"];
arr[0];   // "Ahmadjon" — lekin 0 nimani anglatadi?

// Obyekt — nom bilan. Aniq
const kishi = {
  ism: "Ahmadjon",
  yosh: 15,
  shahar: "Toshkent"
};
kishi.ism;   // "Ahmadjon" — aniq
\`\`\`

Qoida: **bir xil narsalar ro'yxati** bo'lsa massiv, **bitta narsaning xususiyatlari** bo'lsa obyekt.

---

## 🔧 Xususiyatlar bilan ishlash

\`\`\`demo h=400 "Obyektni o'zgartirib ko'ring"
<style>
  body { font-family: sans-serif; font-size: 13px; margin: 0; padding: 14px; }

  #obyekt {
    background: #1f2937; border-radius: 8px; padding: 12px;
    font-family: monospace; font-size: 12px; line-height: 1.9;
    color: #d1d5db; margin-bottom: 12px; min-height: 120px;
  }
  .kalit { color: #93c5fd; }
  .matn { color: #86efac; }
  .son { color: #fbbf24; }
  .mantiq { color: #c4b5fd; }

  .tugmalar { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 12px; }
  button {
    padding: 7px 11px; border: none; border-radius: 7px;
    font-size: 11px; cursor: pointer; color: white; font-family: monospace;
  }
  .ozg { background: #6366f1; }
  .qosh { background: #16a34a; }
  .och { background: #dc2626; }
  .res { background: #6b7280; }

  #log {
    background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px;
    padding: 10px; font-family: monospace; font-size: 11px;
    color: #1e40af; min-height: 60px; line-height: 1.7;
  }
</style>

<div id="obyekt"></div>

<div class="tugmalar">
  <button class="ozg" id="ozgartir">mashina.yil = 2024</button>
  <button class="qosh" id="qoshish">mashina.narx = 85000</button>
  <button class="och" id="ochirish">delete mashina.rangi</button>
  <button class="res" id="reset">Boshidan</button>
</div>

<div id="log"></div>

<script>
  function yangiObyekt() {
    return { marka: 'BMW', model: 'X5', yil: 2023, rangi: 'qora' };
  }

  var mashina = yangiObyekt();
  var obyektEl = document.querySelector('#obyekt');
  var logEl = document.querySelector('#log');

  function render() {
    var html = '{<br />';
    var kalitlar = Object.keys(mashina);
    for (var i = 0; i < kalitlar.length; i++) {
      var k = kalitlar[i];
      var v = mashina[k];
      var klass = typeof v === 'number' ? 'son' : typeof v === 'boolean' ? 'mantiq' : 'matn';
      var korinish = typeof v === 'string' ? '"' + v + '"' : v;
      html += '&nbsp;&nbsp;<span class="kalit">' + k + '</span>: ' +
              '<span class="' + klass + '">' + korinish + '</span>' +
              (i < kalitlar.length - 1 ? ',' : '') + '<br />';
    }
    html += '}';
    obyektEl.innerHTML = html;

    logEl.innerHTML =
      'Object.keys() → [' + Object.keys(mashina).join(', ') + ']<br />' +
      'Xususiyatlar soni: ' + Object.keys(mashina).length + '<br />' +
      '"rangi" in mashina → ' + ('rangi' in mashina);
  }

  document.querySelector('#ozgartir').addEventListener('click', function () {
    mashina.yil = 2024; render();
  });
  document.querySelector('#qoshish').addEventListener('click', function () {
    mashina.narx = 85000; render();
  });
  document.querySelector('#ochirish').addEventListener('click', function () {
    delete mashina.rangi; render();
  });
  document.querySelector('#reset').addEventListener('click', function () {
    mashina = yangiObyekt(); render();
  });

  render();
</script>
\`\`\`

Ikki xil murojaat usuli bor:

\`\`\`javascript
mashina.marka         // nuqta — ko'p ishlatiladi
mashina["marka"]      // qavs — kalit o'zgaruvchida bo'lsa

const kalit = "rangi";
mashina[kalit];       // "qora"  ← nuqta bilan ishlamaydi
\`\`\`

---

## 🔍 Xususiyat bormi?

\`\`\`javascript
const kishi = { ism: "Ali", yosh: 20 };

"ism" in kishi;      // true
"email" in kishi;    // false
kishi.email;         // undefined
\`\`\`

**Optional chaining** (\`?.\`) — chuqur xususiyatga xavfsiz murojaat:

\`\`\`javascript
const shahar = kishi.manzil?.shahar;   // undefined — xato chiqmaydi

// Busiz:
const shahar2 = kishi.manzil.shahar;   // ❌ TypeError!
\`\`\`

\`kishi.manzil\` mavjud bo'lmasa, oddiy usul **xato** beradi va dastur to'xtaydi. \`?.\` esa shunchaki \`undefined\` qaytaradi.

---

## 📌 Metod va \`this\`

Obyekt ichidagi funksiya — **metod**:

\`\`\`javascript
const kishi = {
  ism: "Malika",
  yosh: 17,

  salomlash() {
    return \`Salom! Men \${this.ism}, \${this.yosh} yoshdaman.\`;
  }
};

kishi.salomlash();   // "Salom! Men Malika, 17 yoshdaman."
\`\`\`

\`this\` — **shu obyektning o'ziga** ishora qiladi.

> ⚠️ **Muhim tuzoq:** metodda **arrow funksiya ishlatmang**, agar \`this\` kerak bo'lsa.
>
> \`\`\`javascript
> const kishi = {
>   ism: "Malika",
>   salom: () => \`Men \${this.ism}\`   // ❌ undefined!
> };
> \`\`\`
>
> Arrow funksiyaning **o'z \`this\`** i yo'q — u tashqaridan oladi. Shuning uchun obyekt metodida oddiy yozuv ishlating: \`salom() { ... }\`.

---

## 📦 Destructuring — yoyib olish

\`\`\`demo h=340 "Eski va yangi usul"
<style>
  body { font-family: sans-serif; font-size: 12px; margin: 0; padding: 14px; }
  .blok { margin-bottom: 12px; }
  .lbl { font-family: monospace; font-size: 11px; color: #6b7280; margin: 0 0 5px; }
  .kod {
    background: #1f2937; color: #d1d5db; border-radius: 6px; padding: 10px;
    font-family: monospace; font-size: 11px; line-height: 1.8;
  }
  .kalit { color: #c4b5fd; }
  .nom { color: #93c5fd; }
  #natija {
    background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px;
    padding: 10px; font-family: monospace; font-size: 12px; color: #065f46;
    line-height: 1.7;
  }
</style>

<div class="blok">
  <p class="lbl">❌ Eski usul — takroriy</p>
  <div class="kod">
    <span class="kalit">const</span> ism = kishi.ism;<br />
    <span class="kalit">const</span> yosh = kishi.yosh;<br />
    <span class="kalit">const</span> shahar = kishi.shahar;
  </div>
</div>

<div class="blok">
  <p class="lbl">✅ Destructuring — bitta qator</p>
  <div class="kod">
    <span class="kalit">const</span> { ism, yosh, shahar } = kishi;
  </div>
</div>

<div id="natija"></div>

<script>
  var kishi = { ism: 'Sardor', yosh: 22, shahar: 'Samarqand', kasb: 'Dasturchi' };

  var ism = kishi.ism;
  var yosh = kishi.yosh;
  var shahar = kishi.shahar;

  var natija = document.querySelector('#natija');
  natija.innerHTML =
    'ism → "' + ism + '"<br />' +
    'yosh → ' + yosh + '<br />' +
    'shahar → "' + shahar + '"<br />' +
    '<br />Ikkala usul ham bir xil natija beradi.';
</script>
\`\`\`

Qo'shimcha imkoniyatlar:

\`\`\`javascript
// Qayta nomlash
const { ism: fullName, yosh: age } = kishi;

// Default qiymat — xususiyat yo'q bo'lsa
const { email = "kiritilmagan" } = kishi;

// Funksiya parametrida — eng ko'p ishlatiladigan joyi
function salomlash({ ism, yosh }) {
  return \`\${ism} (\${yosh} yosh)\`;
}
salomlash(kishi);
\`\`\`

Oxirgi variant React'da doimiy ishlatiladi — 4-Modulda ko'rasiz.

---

## 📈 Spread — nusxa va birlashtirish

\`\`\`javascript
const asosiy = { ism: "Ali", yosh: 20 };
const qoshimcha = { email: "ali@mail.com", shahar: "Buxoro" };

// Birlashtirish
const toliq = { ...asosiy, ...qoshimcha };

// Nusxa olish
const nusxa = { ...asosiy };
nusxa.ism = "Vali";
console.log(asosiy.ism);   // "Ali" — asl o'zgarmadi
\`\`\`

> ⚠️ Bu **muhim**. Obyektni oddiy tenglashtirish nusxa yaratmaydi:
>
> \`\`\`javascript
> const nusxa2 = asosiy;      // ❌ nusxa EMAS
> nusxa2.ism = "Vali";
> console.log(asosiy.ism);    // "Vali" — asl ham o'zgardi!
> \`\`\`
>
> Obyekt \`=\` bilan ko'chirilganda **bir xil obyektga ikkita nom** beriladi, xolos. Nusxa uchun \`{ ...obj }\` ishlating.

---

## 📚 Object.keys, values, entries

\`\`\`javascript
const kishi = { ism: "Ali", yosh: 20, shahar: "Toshkent" };

Object.keys(kishi);     // ["ism", "yosh", "shahar"]
Object.values(kishi);   // ["Ali", 20, "Toshkent"]
Object.entries(kishi);  // [["ism","Ali"], ["yosh",20], ["shahar","Toshkent"]]
\`\`\`

\`Object.entries\` bilan obyekt bo'ylab yurish mumkin:

\`\`\`javascript
Object.entries(kishi).forEach(([kalit, qiymat]) => {
  console.log(\`\${kalit}: \${qiymat}\`);
});
\`\`\`

---

## 🥉 Bronze Topshiriq

O'zingiz haqingizda obyekt yarating: ism, yosh, shahar. Har birini alohida chiqaring, keyin template literal bilan jumla yasang.

---

## 🥈 Silver Topshiriq

- Obyektga metod qo'shing (\`this\` ishlatilgan)
- Funksiya yozing, u obyektni parametr sifatida olsin
- Xuddi shuni **destructuring** bilan ham yozing

---

## 🥇 Gold Topshiriq

O'quvchilar massivi bilan ishlang (obyektlar massivi):

\`\`\`javascript
const students = [
  { name: "Kamol",    score: 88 },
  { name: "Nozima",   score: 95 },
  { name: "Bobur",    score: 72 },
  { name: "Hulkar",   score: 91 },
  { name: "Jahongir", score: 65 }
];
\`\`\`

- Destructuring bilan har birini chiqaring
- 80+ olganlarni \`filter\` qiling
- O'rtacha ballni \`reduce\` bilan hisoblang
- Eng yuqori ballni topish uchun \`reduce\` ishlating

---

## ✅ Dars Xulosa

- Obyekt — \`{ kalit: qiymat }\`, massiv — tartibli ro'yxat
- \`.xususiyat\` yoki \`["xususiyat"]\` (kalit o'zgaruvchida bo'lsa)
- \`?.\` — xavfsiz murojaat, xato o'rniga \`undefined\`
- Metodda \`this\` kerak bo'lsa — **arrow ishlatmang**
- Destructuring: \`const { ism, yosh } = kishi\`
- \`=\` nusxa yaratmaydi — \`{ ...obj }\` ishlating
- \`Object.keys / values / entries\`

> 🚀 **Keyingi dars:** Math va tasodifiy sonlar!
`,
    teacher: `
## ⚠️ Notion kodida apostrof xatosi (uchinchi marta)

\`\`\`javascript
const to'liq = Object.assign({}, asosiy, qoshimcha);
\`\`\`

\`to'liq\` — sintaksis xatosi. Bu yerda \`toliq\` deb tuzatildi.

3-dars (\`yig'indi\`, \`ko'paytma\`), 5-dars (\`a'lochilar\`), 6-dars (\`to'liq\`) — naqsh takrorlanmoqda. Qolgan darslarni ko'chirishda ham shu narsaga e'tibor beraman.

---

## ⚠️ Darsga qo'shilgan ikkita muhim ogohlantirish

Asl sahifada yo'q, lekin bolalarni ko'p qiynaydigan ikkita narsa:

**1. Arrow funksiya va \`this\`**

Notion'da metodlar orasida shunday yozilgan:

\`\`\`javascript
tavsif: () => "Toshkent talabasi",
\`\`\`

Bu ishlaydi, chunki \`this\` ishlatilmagan. Lekin bola buni ko'rib, boshqa metodni ham arrow bilan yozadi va \`this.ism\` → \`undefined\` bo'ladi. Xato xabari chiqmaydi, shunchaki noto'g'ri natija.

Darsga ogohlantirish qo'shildi: **obyekt metodida \`this\` kerak bo'lsa, arrow ishlatmang**.

**2. Obyekt \`=\` bilan ko'chirilmaydi**

\`\`\`javascript
const nusxa = asosiy;   // nusxa EMAS — bir obyektga ikki nom
\`\`\`

Bu — dasturlashdagi eng chalkash tushunchalardan biri (reference vs value). Notion'da spread ko'rsatilgan, lekin **nima uchun** kerakligi tushuntirilmagan. Qo'shildi.

---

## 💡 O'qituvchi uchun

- **Massiv va obyekt farqini** birinchi daqiqada aniqlang: bir xil narsalar ro'yxati — massiv, bitta narsaning xususiyatlari — obyekt. Bolalar buni doim chalkashtiradi.
- Interaktiv obyekt demosi — \`delete\`, qo'shish, o'zgartirish tugmalari bilan. \`Object.keys()\` natijasi real vaqtda o'zgarishini ko'rsatadi.
- **\`=\` nusxa emasligini** albatta amalda ko'rsating. Konsolda ikkita o'zgaruvchi yarating, birini o'zgartiring, ikkinchisi ham o'zgarganini ko'rsating. Bolalar hayratlanadi va shundan keyin \`{...}\` ni tushunadi.
- Destructuring — hozircha "qulay yozuv" deb o'ting. Uning haqiqiy kuchi React'da (4-Modul) ochiladi, o'shanda eslatasiz.
- \`?.\` (optional chaining) — kichik narsa, lekin real loyihalarda juda ko'p ishlatiladi. API bilan ishlaganda (18-dars) qaytasiz.

## ⚠️ Ko'p uchraydigan xatolar

- **Nomda apostrof** — yuqorida.
- **\`kishi.kalit\` va \`kishi[kalit]\` chalkashligi** — o'zgaruvchidagi kalit uchun qavs kerak.
- **Metodda arrow + \`this\`** — \`undefined\` chiqadi, xato xabari yo'q.
- **\`=\` bilan nusxa olish** — asl obyekt ham o'zgaradi.
- **Destructuring'da nom mos kelmagan** — \`const { name } = kishi\` (obyektda \`ism\` bo'lsa) → \`undefined\`.
- **Obyekt ichida vergul unutilgan** — \`SyntaxError\`, lekin bola qatorni topa olmaydi.

## 📊 Daraja belgilash

- **Bronze** — obyekt yaratilgan, xususiyatlarga murojaat to'g'ri
- **Silver** — metod \`this\` bilan ishlaydi, destructuring qo'llangan
- **Gold** — obyektlar massivi, filter/reduce zanjiri

> Silver'ni tekshirishda metodni arrow bilan yozib ko'rsating — \`undefined\` chiqadi. Bola sababini tushuntira olsa, tushungan.
`,
  },

  // ═══════════════════════════════════════════════════════════
  'junior.m2.l7': {
    goal: "Math obyekti, tasodifiy sonlar va switch/case bilan o'yin yaratish.",
    student: `
## 🧮 Math — matematik amallar

\`Math\` — JavaScript'ga o'rnatilgan yordamchi. Uni yaratish kerak emas, shunchaki ishlatiladi.

\`\`\`demo h=400 "Yaxlitlash usullarini taqqoslang"
<style>
  body { font-family: sans-serif; font-size: 13px; margin: 0; padding: 14px; }
  .boshqaruv { display: flex; gap: 10px; align-items: center; margin-bottom: 14px; }
  input { flex: 1; }
  .qiymat { font-family: monospace; font-weight: 700; color: #6366f1; min-width: 54px; }

  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th, td { padding: 8px 10px; text-align: left; }
  thead { background: #f8f9fa; }
  th { font-size: 11px; text-transform: uppercase; color: #6c757d; letter-spacing: 1px; }
  td { border-top: 1px solid #f0f0f0; font-family: monospace; }
  .nat { font-weight: 700; color: #1e40af; }
  .izoh { color: #9ca3af; font-size: 11px; font-family: sans-serif; }
</style>

<div class="boshqaruv">
  <span style="font-size:12px;color:#6b7280">Son:</span>
  <input type="range" id="slider" min="-60" max="60" value="46" />
  <span class="qiymat" id="son"></span>
</div>

<table>
  <thead>
    <tr><th>Metod</th><th>Natija</th><th>Nima qiladi</th></tr>
  </thead>
  <tbody id="jadval"></tbody>
</table>

<script>
  var slider = document.querySelector('#slider');
  var sonEl = document.querySelector('#son');
  var jadval = document.querySelector('#jadval');

  function render() {
    var x = Number(slider.value) / 10;   // kasr son chiqishi uchun
    sonEl.textContent = x;

    var qatorlar = [
      ['Math.round(x)', Math.round(x), 'eng yaqin butun songa'],
      ['Math.floor(x)', Math.floor(x), 'PASTGA yaxlitlaydi'],
      ['Math.ceil(x)',  Math.ceil(x),  'TEPAGA yaxlitlaydi'],
      ['Math.trunc(x)', Math.trunc(x), 'kasr qismini tashlaydi'],
      ['Math.abs(x)',   Math.abs(x),   'manfiylikni olib tashlaydi']
    ];

    var html = '';
    for (var i = 0; i < qatorlar.length; i++) {
      html += '<tr><td>' + qatorlar[i][0] + '</td>' +
              '<td class="nat">' + qatorlar[i][1] + '</td>' +
              '<td class="izoh">' + qatorlar[i][2] + '</td></tr>';
    }
    jadval.innerHTML = html;
  }

  slider.addEventListener('input', render);
  render();
</script>
\`\`\`

> ⚠️ **Manfiy sonlarga diqqat.** Slayderni manfiy tomonga suring va \`floor\` bilan \`trunc\` ni taqqoslang:
>
> - \`Math.floor(-4.1)\` → **−5** (pastga, ya'ni kichikroq tomonga)
> - \`Math.trunc(-4.1)\` → **−4** (faqat kasrni tashlaydi)
>
> Musbat sonlarda ikkalasi bir xil, manfiylarda farq qiladi. Bu — ko'p uchraydigan chalkashlik.

Boshqa foydali metodlar:

\`\`\`javascript
Math.max(1, 5, 3, 9);      // 9
Math.min(1, 5, 3, 9);      // 1
Math.max(...[1, 5, 3, 9]); // 9  ← massiv bilan, spread orqali

Math.sqrt(144);            // 12   kvadrat ildiz
Math.pow(2, 10);           // 1024 daraja
2 ** 10;                   // 1024 — zamonaviy yozuv
\`\`\`

Ikki xonagacha yaxlitlash:

\`\`\`javascript
const narx = 19.876;

Math.round(narx * 100) / 100;   // 19.88  ← son
narx.toFixed(2);                // "19.88" ← MATN!
\`\`\`

> ⚠️ \`toFixed()\` **matn** qaytaradi, son emas. \`"19.88" + 1\` → \`"19.881"\` bo'lib qoladi. Hisob kerak bo'lsa \`Number()\` bilan qaytaring.

---

## 🎲 Math.random() — tasodifiy son

\`Math.random()\` **0 dan 1 gacha** kasr son beradi (1 hech qachon chiqmaydi).

Kerakli oraliqqa aylantirish formulasi:

\`\`\`javascript
// 0 dan N-1 gacha
Math.floor(Math.random() * N);

// 1 dan N gacha
Math.floor(Math.random() * N) + 1;

// min dan max gacha
function tasodifiy(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
\`\`\`

\`\`\`demo h=400 "Zar tashlash — statistika"
<style>
  body { font-family: sans-serif; font-size: 13px; margin: 0; padding: 14px; text-align: center; }

  #zar {
    font-size: 62px; margin: 0 0 6px; line-height: 1;
  }
  #kod {
    font-family: monospace; font-size: 12px; color: #6b7280; margin-bottom: 14px;
  }

  button {
    padding: 10px 20px; border: none; border-radius: 8px;
    background: #6366f1; color: white; font-size: 13px;
    cursor: pointer; margin: 0 4px 14px;
  }
  #koplab { background: #16a34a; }
  #tozala { background: #9ca3af; }

  .statistika { display: flex; gap: 4px; align-items: flex-end; height: 110px; }
  .ustun { flex: 1; display: flex; flex-direction: column; justify-content: flex-end; }
  .bar {
    background: #a5b4fc; border-radius: 4px 4px 0 0;
    min-height: 2px; transition: height 0.2s;
  }
  .yorliq { font-size: 11px; color: #6b7280; font-family: monospace; margin-top: 3px; }
  .soni { font-size: 10px; color: #9ca3af; font-family: monospace; }
  #jami { margin-top: 8px; font-size: 11px; color: #6b7280; }
</style>

<div id="zar">🎲</div>
<div id="kod">Math.floor(Math.random() * 6) + 1</div>

<button id="bitta">1 marta</button>
<button id="koplab">100 marta</button>
<button id="tozala">Tozalash</button>

<div class="statistika" id="stat"></div>
<div id="jami"></div>

<script>
  var yuzlar = ['⚀','⚁','⚂','⚃','⚄','⚅'];
  var hisob = [0, 0, 0, 0, 0, 0];

  var zarEl = document.querySelector('#zar');
  var statEl = document.querySelector('#stat');
  var jamiEl = document.querySelector('#jami');

  function tashla() {
    return Math.floor(Math.random() * 6) + 1;
  }

  function render() {
    var jami = 0;
    for (var i = 0; i < 6; i++) jami += hisob[i];

    var maks = Math.max.apply(null, hisob) || 1;
    var html = '';
    for (var i = 0; i < 6; i++) {
      var balandlik = Math.round((hisob[i] / maks) * 85);
      html += '<div class="ustun">' +
                '<div class="soni">' + hisob[i] + '</div>' +
                '<div class="bar" style="height:' + balandlik + 'px"></div>' +
                '<div class="yorliq">' + (i + 1) + '</div>' +
              '</div>';
    }
    statEl.innerHTML = html;
    jamiEl.textContent = jami > 0 ? 'Jami tashlangan: ' + jami : '';
  }

  document.querySelector('#bitta').addEventListener('click', function () {
    var n = tashla();
    hisob[n - 1]++;
    zarEl.textContent = yuzlar[n - 1];
    render();
  });

  document.querySelector('#koplab').addEventListener('click', function () {
    for (var i = 0; i < 100; i++) {
      hisob[tashla() - 1]++;
    }
    render();
  });

  document.querySelector('#tozala').addEventListener('click', function () {
    hisob = [0, 0, 0, 0, 0, 0];
    zarEl.textContent = '🎲';
    render();
  });

  render();
</script>
\`\`\`

**"100 marta" ni bir necha bor bosing.** Ustunlar asta-sekin **tenglashib** boradi — chunki har raqamning chiqish ehtimoli bir xil. Bu — tasodifiylikning muhim xususiyati: kam tashlashda notekis ko'rinadi, ko'p tashlashda tenglashadi.

---

## ⚠️ Nomlarda apostrof — eslatma

Bu darsda ko'p o'zbekcha so'zlar ishlatiladi. Yodda tuting:

\`\`\`javascript
// ❌ Sintaksis xatosi
function qog'ozToshQaychi() { }
const galabaShartlari = { qog'oz: "tosh" };   // kalit ham apostrofsiz bo'lsin

// ✅ To'g'ri
function rockPaperScissors() { }
const rules = { paper: "rock" };

// ✅ Yoki kalitni qo'shtirnoqqa oling
const rules2 = { "qog'oz": "tosh" };   // bu ishlaydi, lekin murakkab
\`\`\`

Eng oson yo'l — **nomlarni inglizcha yozish**.

---

## 🎮 Tosh-Qaychi-Qog'oz

\`\`\`demo h=420 "O'ynang — ball hisoblanadi"
<style>
  body { font-family: sans-serif; font-size: 13px; margin: 0; padding: 14px; text-align: center; }

  .tanlovlar { display: flex; gap: 10px; justify-content: center; margin-bottom: 16px; }
  .tanlov {
    font-size: 34px; padding: 10px 16px; border: 2px solid #e5e7eb;
    border-radius: 14px; background: white; cursor: pointer;
    transition: transform 0.1s, border-color 0.2s;
  }
  .tanlov:hover { border-color: #6366f1; transform: translateY(-3px); }
  .tanlov:active { transform: scale(0.95); }

  .maydon { display: flex; justify-content: center; align-items: center; gap: 20px; margin-bottom: 12px; }
  .tomon { text-align: center; }
  .tomon .belgi { font-size: 44px; line-height: 1; }
  .tomon .nom { font-size: 11px; color: #6b7280; margin-top: 3px; }
  .vs { font-size: 16px; color: #9ca3af; font-weight: 700; }

  #natija {
    font-size: 18px; font-weight: 700; min-height: 26px; margin-bottom: 14px;
  }
  .galaba { color: #16a34a; }
  .maglub { color: #dc2626; }
  .durrang { color: #6b7280; }

  .hisob {
    display: flex; justify-content: center; gap: 20px;
    font-family: monospace; font-size: 13px; color: #4b5563;
  }
  .hisob b { display: block; font-size: 20px; }
</style>

<div class="tanlovlar">
  <button class="tanlov" data-t="rock">✊</button>
  <button class="tanlov" data-t="paper">✋</button>
  <button class="tanlov" data-t="scissors">✌️</button>
</div>

<div class="maydon">
  <div class="tomon"><div class="belgi" id="siz">❔</div><div class="nom">Siz</div></div>
  <div class="vs">VS</div>
  <div class="tomon"><div class="belgi" id="komp">❔</div><div class="nom">Kompyuter</div></div>
</div>

<div id="natija">Tanlang</div>

<div class="hisob">
  <div><b id="g">0</b>g'alaba</div>
  <div><b id="m">0</b>mag'lubiyat</div>
  <div><b id="d">0</b>durrang</div>
</div>

<script>
  var belgilar = { rock: '✊', paper: '✋', scissors: '✌️' };
  var variantlar = ['rock', 'paper', 'scissors'];

  // Kim kimni yengadi
  var yengadi = {
    rock: 'scissors',      // tosh qaychini
    paper: 'rock',         // qog'oz toshni
    scissors: 'paper'      // qaychi qog'ozni
  };

  var hisob = { g: 0, m: 0, d: 0 };

  var sizEl = document.querySelector('#siz');
  var kompEl = document.querySelector('#komp');
  var natijaEl = document.querySelector('#natija');

  function oyna(tanlov) {
    var komp = variantlar[Math.floor(Math.random() * 3)];

    sizEl.textContent = belgilar[tanlov];
    kompEl.textContent = belgilar[komp];

    if (tanlov === komp) {
      natijaEl.textContent = 'Durrang 🤝';
      natijaEl.className = 'durrang';
      hisob.d++;
    } else if (yengadi[tanlov] === komp) {
      natijaEl.textContent = 'Siz yutdingiz! 🏆';
      natijaEl.className = 'galaba';
      hisob.g++;
    } else {
      natijaEl.textContent = 'Kompyuter yutdi 😄';
      natijaEl.className = 'maglub';
      hisob.m++;
    }

    document.querySelector('#g').textContent = hisob.g;
    document.querySelector('#m').textContent = hisob.m;
    document.querySelector('#d').textContent = hisob.d;
  }

  var tugmalar = document.querySelectorAll('.tanlov');
  for (var i = 0; i < tugmalar.length; i++) {
    tugmalar[i].addEventListener('click', function () {
      oyna(this.dataset.t);
    });
  }
</script>
\`\`\`

G'alaba mantiqi **obyekt** bilan yozilgan — bu \`if/else\` zanjiridan ancha qisqa:

\`\`\`javascript
const yengadi = {
  rock: 'scissors',
  paper: 'rock',
  scissors: 'paper'
};

if (yengadi[tanlov] === komp) {
  // siz yutdingiz
}
\`\`\`

Bitta satr uchta shartni almashtiradi. Bu — 6-darsdagi obyekt bilimining amaliy qo'llanishi.

---

## 🔀 switch / case

Ko'p \`else if\` o'rniga qulayroq yozuv:

\`\`\`javascript
switch (kun) {
  case 1:
    console.log("Dushanba");
    break;
  case 2:
    console.log("Seshanba");
    break;
  case 6:
  case 7:
    console.log("Dam olish kuni");   // ikki case — bitta natija
    break;
  default:
    console.log("Noto'g'ri raqam");
}
\`\`\`

> ⚠️ **\`break\` ni unutmang.** Busiz JavaScript keyingi \`case\` ga **o'tib ketadi** (buni "fall-through" deyishadi) va kutilmagan natija chiqadi.
>
> \`6\` va \`7\` misolida bu ataylab ishlatilgan — ikkala holat ham bir xil natija beradi.

Funksiya ichida \`return\` bilan yozsangiz, \`break\` kerak emas:

\`\`\`javascript
function kunNomi(n) {
  switch (n) {
    case 1: return "Dushanba";
    case 5: return "Juma";
    case 6:
    case 7: return "Dam olish";
    default: return "Noto'g'ri";
  }
}
\`\`\`

\`return\` funksiyani darhol to'xtatadi — shuning uchun \`break\` ortiqcha.

---

## 🥉 Bronze Topshiriq

\`zar()\` funksiyasini yozing (1 dan 6 gacha) va uni 5 marta chaqiring.

---

## 🥈 Silver Topshiriq

\`kunNomi(n)\` funksiyasini \`switch\` bilan yozing. 1 dan 7 gacha tsiklda chaqiring.

Noto'g'ri raqam (masalan 9) berilganda \`default\` ishlashini tekshiring.

---

## 🥇 Gold Topshiriq

Tosh-Qaychi-Qog'oz o'yinini yozing:

- Kompyuter tasodifiy tanlaydi
- G'alaba mantiqi **obyekt** bilan (\`if\` zanjiri emas)
- Ball hisoblanadi
- 5 marta o'ynab, natijani chiqaring

> ⚠️ O'zgaruvchi nomlarini inglizcha yozing: \`rock\`, \`paper\`, \`scissors\`. Apostrofli nomlar (\`qog'oz\`) sintaksis xatosi beradi.

---

## ✅ Dars Xulosa

- \`Math.floor\` vs \`Math.trunc\` — **manfiy sonlarda farq qiladi**
- \`toFixed()\` **matn** qaytaradi
- \`Math.floor(Math.random() * N) + 1\` — 1 dan N gacha
- Ko'p tashlashda tasodifiy taqsimot **tenglashadi**
- \`switch\` da \`break\` majburiy, \`return\` bo'lsa kerak emas
- Ikki \`case\` ni birlashtirish mumkin
- Murakkab \`if\` zanjirini **obyekt** bilan almashtirish mumkin

> 🚀 **Keyingi dars:** Switch, ternary va mantiqiy operatorlar chuqurroq!
`,
    teacher: `
## ⚠️ Notion kodida bir nechta sintaksis xatosi

Bu dars — apostrof muammosining **eng og'ir holati**. Uchta joyda:

\`\`\`javascript
function qog'ozToshQaychi(tanlov) { }        // ❌ funksiya nomi
const galabaShartlari = { qog'oz: "tosh" };  // ❌ obyekt kaliti
function o'yin(siz) { }                      // ❌ funksiya nomi
\`\`\`

Qiziq tomoni: xuddi shu darsda Gold topshiriqda \`{ "qog'oz": "tosh" }\` deb **qo'shtirnoq bilan** yozilgan — bu variant ishlaydi. Ya'ni bitta darsda ikki xil yozuv bor, biri ishlaydi, biri yo'q.

Bu yerda hammasi inglizcha nomlarga o'girildi (\`rock\`, \`paper\`, \`scissors\`) va darsga qisqa eslatma qo'shildi.

**Yana bir kichik xato:** izohda "tosh qaychiñi uradi" deb yozilgan — \`ñ\` ispancha harf, "qaychini" bo'lishi kerak.

Notion'dagi asl kodni tuzatish kerak.

---

## 💡 O'qituvchi uchun

- **Zar statistikasi demosi** — bu darsning eng qimmatli qismi. "100 marta" ni 5-6 bor bosdiring va ustunlar tenglashganini kuzating. Bolalar tasodifiylikni "adolatsiz" deb o'ylaydi ("menga doim 1 chiqadi"). Statistika ularning tasavvurini o'zgartiradi.
- \`Math.floor\` va \`Math.trunc\` farqini **manfiy sonda** ko'rsating. Slayderni chapga suring. Musbat tomonda farq yo'q, manfiyda bor — bu chalkashlik manbai.
- \`toFixed()\` matn qaytarishini albatta ayting. Bolalar narx hisoblashda ishlatadi va keyin qo'shishda \`"19.881"\` chiqadi.
- **Tosh-qaychi-qog'oz** — obyekt bilan mantiq yozishning eng yaxshi namunasi. Avval \`if/else\` bilan yozdiring (uzun chiqadi), keyin obyekt variantini ko'rsating. Farq ta'sirli bo'ladi.
- \`switch\` fall-through'ni **ataylab** ko'rsating: \`break\` ni olib tashlang va bir necha natija ketma-ket chiqqanini kuzating.

## ⚠️ Ko'p uchraydigan xatolar

- **Nomda apostrof** — yuqorida.
- **\`Math.random()\` ni \`Math.floor\` siz ishlatish** — kasr son chiqadi, indeks sifatida ishlamaydi.
- **Oraliq formulasi noto'g'ri** — \`Math.floor(Math.random() * 6)\` → 0-5, \`+1\` unutilgan.
- **\`break\` unutilgan** — keyingi case ham bajariladi.
- **\`switch\` da \`===\` emas \`==\`** — switch **har doim** \`===\` ishlatadi. \`switch("5")\` \`case 5\` ga tushmaydi. Bu chalkash.
- **\`toFixed\` natijasini songa aylantirmaslik** — matn qo'shilib ketadi.

## 📊 Daraja belgilash

- **Bronze** — zar funksiyasi ishlaydi, oraliq to'g'ri (1-6)
- **Silver** — switch ishlaydi, default holati qamrab olingan
- **Gold** — o'yin ishlaydi, mantiq obyekt bilan yozilgan

> Gold'ni tekshirishda \`if\` zanjirini sanang. Uchta \`else if\` bo'lsa — obyekt ishlatilmagan.
`,
  },

  // ═══════════════════════════════════════════════════════════
  'junior.m2.l8': {
    goal: "Switch fall-through, ternary zanjiri, && va || qisqartmalari, nullish coalescing.",
    student: `
## 🔗 && va || — kutilmagan xususiyat

Siz bu operatorlarni 2-darsda ko'rgansiz. Lekin ular haqida bilmagan narsangiz bor: ular **\`true\`/\`false\` emas, qiymat qaytaradi**.

\`\`\`demo h=380 "Nima qaytaradi?"
<style>
  body { font-family: sans-serif; font-size: 13px; margin: 0; padding: 14px; }
  #out {
    background: #1f2937; border-radius: 8px; padding: 12px;
    font-family: monospace; font-size: 12px; line-height: 2; min-height: 250px;
  }
  #out div { border-bottom: 1px solid #374151; padding: 2px 0; color: #d1d5db; }
  .kod { color: #93c5fd; }
  .nat { color: #fbbf24; font-weight: bold; }
  .izoh { color: #9ca3af; }
  .sarlavha { color: #a78bfa; padding-top: 8px; font-weight: bold; }
  h3 { font-size: 13px; margin: 0 0 8px; color: #374151; }
</style>

<h3>Natija</h3>
<div id="out"></div>

<script>
  var out = document.querySelector('#out');

  function sarlavha(m) {
    var d = document.createElement('div');
    d.className = 'sarlavha';
    d.textContent = m;
    out.appendChild(d);
  }

  function sina(kod, natija, izoh) {
    var d = document.createElement('div');
    var korinish = typeof natija === 'string' ? '"' + natija + '"' : String(natija);
    d.innerHTML = '<span class="kod">' + kod + '</span>' +
                  '  →  <span class="nat">' + korinish + '</span>' +
                  (izoh ? '  <span class="izoh">// ' + izoh + '</span>' : '');
    out.appendChild(d);
  }

  sarlavha('&& — birinchi FALSY ni qaytaradi');
  sina('"salom" && 42', "salom" && 42, 'ikkalasi truthy → oxirgisi');
  sina('"" && 42', "" && 42, 'birinchisi falsy → o\\'sha');
  sina('null && "salom"', null && "salom");

  sarlavha('|| — birinchi TRUTHY ni qaytaradi');
  sina('"" || "zaxira"', "" || "zaxira");
  sina('null || "zaxira"', null || "zaxira");
  sina('"bor" || "zaxira"', "bor" || "zaxira", 'birinchisi truthy → o\\'sha');

  sarlavha('Amaliy: || bilan zaxira qiymat');
  sina('ism || "Mehmon"  (ism = "")', "" || "Mehmon");
  sina('ism || "Mehmon"  (ism = "Ali")', "Ali" || "Mehmon");
</script>
\`\`\`

Bu xususiyat **zaxira qiymat** berish uchun ishlatiladi:

\`\`\`javascript
const ism = foydalanuvchiIsmi || "Mehmon";
\`\`\`

Agar \`foydalanuvchiIsmi\` bo'sh bo'lsa, \`"Mehmon"\` ishlatiladi.

---

## ❓ ?? — || ning muammosini hal qiladi

\`||\` ning jiddiy kamchiligi bor: u **barcha falsy** qiymatlarni almashtiradi. Ba'zan bu noto'g'ri.

\`\`\`demo h=340 "|| va ?? farqi"
<style>
  body { font-family: sans-serif; font-size: 13px; margin: 0; padding: 14px; }
  table { width: 100%; border-collapse: collapse; font-size: 12px; }
  th, td { padding: 8px 10px; text-align: left; font-family: monospace; }
  thead { background: #f8f9fa; }
  th { font-size: 11px; text-transform: uppercase; color: #6c757d; letter-spacing: 1px; }
  td { border-top: 1px solid #f0f0f0; }
  .xato { color: #dc2626; font-weight: 700; }
  .togri { color: #16a34a; font-weight: 700; }
  .izoh { font-size: 11px; color: #9ca3af; font-family: sans-serif; margin-top: 10px; line-height: 1.6; }
</style>

<table>
  <thead>
    <tr><th>Qiymat</th><th>qiymat || 100</th><th>qiymat ?? 100</th></tr>
  </thead>
  <tbody id="jadval"></tbody>
</table>

<p class="izoh">
  🔴 = kutilmagan natija &nbsp;·&nbsp; 🟢 = to'g'ri natija
</p>

<script>
  var qiymatlar = [
    ['0', 0],
    ['""', ""],
    ['false', false],
    ['null', null],
    ['undefined', undefined]
  ];

  var jadval = document.querySelector('#jadval');
  var html = '';

  for (var i = 0; i < qiymatlar.length; i++) {
    var nom = qiymatlar[i][0];
    var v = qiymatlar[i][1];

    var orNat = v || 100;
    var qqNat = v ?? 100;

    var orKorinish = typeof orNat === 'string' ? '""' : String(orNat);
    var qqKorinish = typeof qqNat === 'string' ? '""' : String(qqNat);

    // || noto'g'ri ishlagan holatlar: qiymat mavjud, lekin almashtirilgan
    var orXato = (v !== null && v !== undefined);
    var orKlass = orXato ? 'xato' : '';
    var qqKlass = orXato ? 'togri' : '';

    html += '<tr><td>' + nom + '</td>' +
            '<td class="' + orKlass + '">' + orKorinish + (orXato ? ' 🔴' : '') + '</td>' +
            '<td class="' + qqKlass + '">' + qqKorinish + (orXato ? ' 🟢' : '') + '</td></tr>';
  }

  jadval.innerHTML = html;
</script>
\`\`\`

Birinchi qatorga qarang: **ball 0** bo'lsa, \`ball || 100\` uni **100** ga almashtiradi. Lekin 0 — bu haqiqiy ball, xato emas!

\`??\` faqat \`null\` va \`undefined\` ni almashtiradi. Qolgan hamma qiymat — hatto \`0\` va \`""\` — o'z holicha qoladi.

\`\`\`javascript
const ball = 0;

ball || 100;   // 100  ❌ noto'g'ri
ball ?? 100;   // 0    ✅ to'g'ri
\`\`\`

> 💡 **Qoida:** son yoki matn bilan ishlaganda \`??\` ishlating. \`||\` faqat "bo'sh matn ham yaroqsiz" degan holatda to'g'ri.

---

## 🔀 switch fall-through — foydali va xavfli

\`\`\`javascript
switch (mavsum) {
  case "bahor":
  case "yoz":
    console.log("Issiq");
    break;
  case "kuz":
  case "qish":
    console.log("Sovuq");
    break;
}
\`\`\`

Bu — **ataylab** ishlatilgan fall-through. \`"bahor"\` da \`break\` yo'q, shuning uchun \`"yoz"\` ning kodiga o'tadi.

Lekin \`break\` ni **tasodifan** unutsangiz:

\`\`\`javascript
switch (kun) {
  case 1:
    console.log("Dushanba");
    // break unutildi!
  case 2:
    console.log("Seshanba");
    break;
}
// kun = 1 bo'lsa: "Dushanba" VA "Seshanba" chiqadi
\`\`\`

> ⚠️ \`switch\` **har doim \`===\`** bilan solishtiradi. Shuning uchun \`switch("5")\` da \`case 5\` ishlamaydi — matn va son boshqa.

---

## ❓ Ternary zanjiri

\`\`\`javascript
const daraja =
  ball >= 90 ? "A" :
  ball >= 75 ? "B" :
  ball >= 55 ? "C" :
               "F";
\`\`\`

Ishlaydi, lekin **uch darajadan ko'p bo'lsa o'qish qiyinlashadi**. Bunday holatda oddiy \`if/else\` yoki obyekt ishlatgan ma'qul:

\`\`\`javascript
// Obyekt bilan — o'qishga qulayroq
const izohlar = {
  A: "A'lo",
  B: "Yaxshi",
  C: "Qoniqarli",
  F: "Qoniqarsiz"
};

const izoh = izohlar[daraja];
\`\`\`

---

## 🎯 Hammasi birga

\`\`\`demo h=400 "Foydalanuvchilar ro'yxati"
<style>
  body { font-family: sans-serif; font-size: 13px; margin: 0; padding: 14px; }
  table { width: 100%; border-collapse: collapse; font-size: 12px; }
  th, td { padding: 8px 9px; text-align: left; }
  thead { background: #f8f9fa; }
  th { font-size: 10px; text-transform: uppercase; color: #6c757d; letter-spacing: 1px; }
  td { border-top: 1px solid #f0f0f0; }
  .baho { font-weight: 700; font-family: monospace; }
  .A { color: #16a34a; } .B { color: #2563eb; }
  .C { color: #ca8a04; } .F { color: #dc2626; }
  .yorliq {
    display: inline-block; padding: 2px 8px; border-radius: 20px;
    font-size: 10px; font-weight: 600;
  }
  .abonent { background: #dcfce7; color: #166534; }
  .mehmon { background: #f3f4f6; color: #6b7280; }
  .izoh { font-size: 11px; color: #9ca3af; margin-top: 10px; line-height: 1.6; }
</style>

<table>
  <thead>
    <tr><th>Ism</th><th>Status</th><th>Chegirma</th><th>Baho</th></tr>
  </thead>
  <tbody id="jadval"></tbody>
</table>

<p class="izoh">
  Dilnozaning <code>abonent</code> qiymati <code>null</code> —
  <code>??</code> uni <code>false</code> ga aylantiradi.
</p>

<script>
  var foydalanuvchilar = [
    { ism: 'Ali',     yosh: 20, abonent: true,  ball: 85 },
    { ism: 'Vali',    yosh: 15, abonent: false, ball: 92 },
    { ism: 'Malika',  yosh: 22, abonent: true,  ball: 55 },
    { ism: 'Dilnoza', yosh: 17, abonent: null,  ball: 78 }
  ];

  var jadval = document.querySelector('#jadval');
  var html = '';

  for (var i = 0; i < foydalanuvchilar.length; i++) {
    var u = foydalanuvchilar[i];

    var abonent = u.abonent ?? false;
    var status = abonent ? 'Abonent' : 'Mehmon';
    var chegirma = u.yosh < 18 ? '30%' : "yo'q";
    var baho = u.ball >= 90 ? 'A' : u.ball >= 75 ? 'B' : u.ball >= 55 ? 'C' : 'F';

    html += '<tr>' +
      '<td>' + u.ism + '</td>' +
      '<td><span class="yorliq ' + (abonent ? 'abonent' : 'mehmon') + '">' + status + '</span></td>' +
      '<td>' + chegirma + '</td>' +
      '<td class="baho ' + baho + '">' + baho + '</td>' +
      '</tr>';
  }

  jadval.innerHTML = html;
</script>
\`\`\`

---

## 🥉 Bronze Topshiriq

\`switch\` bilan hafta kunini chiqaring. Ikkita \`case\` ni birlashtiring (shanba va yakshanba → "Dam olish").

---

## 🥈 Silver Topshiriq

- Ballar massivi bo'ylab yuring, har biriga ternary bilan daraja bering
- \`||\` va \`??\` farqini ko'rsatuvchi misol yozing (ball = 0 bilan)

---

## 🥇 Gold Topshiriq

Foydalanuvchilar massivi bilan ishlang. Har biri uchun:

- \`??\` bilan status (\`abonent\` \`null\` bo'lishi mumkin)
- Ternary bilan chegirma (18 yoshdan kichik → 30%)
- Ternary zanjiri bilan baho

Natijani jadval ko'rinishida chiqaring.

---

## ✅ Dars Xulosa

- \`&&\` va \`||\` — \`true\`/\`false\` emas, **qiymat** qaytaradi
- \`||\` barcha falsy qiymatni almashtiradi — \`0\` va \`""\` ham
- \`??\` faqat \`null\` va \`undefined\` ni almashtiradi — **son bilan ishlaganda shuni ishlating**
- \`switch\` \`===\` bilan solishtiradi, \`break\` majburiy
- Ikki \`case\` ni birlashtirish — ataylab fall-through
- Ternary zanjiri uch darajadan oshmasin

> 🚀 **Keyingi dars:** Mini Demo — JS turniri!
`,
    teacher: `
## ⚠️ Bu dars 2 va 7-darslar bilan qisman takrorlanadi

Dastur tuzilishida takrorlanish bor:

| Mavzu | 2-dars | 7-dars | 8-dars |
| --- | --- | --- | --- |
| Ternary | ✅ | | ✅ |
| \`&&\` \`\\|\\|\` | ✅ | | ✅ |
| switch | | ✅ | ✅ |

Shuning uchun bu dars **yangi narsalarga** yo'naltirildi:

- \`&&\` va \`||\` ning **qaytaruvchi qiymati** (2-darsda faqat \`true\`/\`false\` sifatida ko'rilgan)
- \`??\` — mutlaqo yangi
- switch fall-through va \`===\` xususiyati
- Ternary zanjirining **chegarasi** (qachon ishlatmaslik kerak)

Takroriy qismlar qisqartirildi va oldingi darslarga havola qilindi. Agar guruhingiz 2 va 7-darslarni yaxshi o'zlashtirgan bo'lsa, bu darsni **40 daqiqada** o'tish mumkin va qolgan vaqtni amaliyotga bering.

---

## 💡 O'qituvchi uchun

- **\`||\` va \`??\` jadvali** — bu darsning eng qimmatli qismi. \`ball = 0\` misolini albatta ko'rsating: o'quvchi 0 ball olgan, lekin dastur uni 100 ga aylantirib yuboradi. Real xato, real oqibat.
- \`&&\` va \`||\` qiymat qaytarishini bolalar bilmaydi — ular buni faqat \`if\` ichida ko'rgan. Konsolda \`console.log("a" && "b")\` yozib ko'rsating. \`true\` emas, \`"b"\` chiqadi.
- \`switch\` va \`===\` — \`switch("5")\` bilan \`case 5\` ishlamasligini ko'rsating. Bu forma ma'lumotlari bilan ishlaganda (hammasi matn) real muammo beradi.
- Ternary zanjirini **uchtadan oshirmaslikni** qoida qiling. Bolalar buni "chiroyli" deb hisoblab, 6-7 darajali zanjir yozadi va keyin o'zi o'qiy olmaydi.

## 🗒 Notion'dagi mayda xato

Ternary misolida shunday yozilgan:

\`\`\`javascript
\`Siz \${yosh >= 18 ? "ovçilaysiz" : "o'yin o'ynaysiz"}\`
\`\`\`

"ovçilaysiz" — \`ç\` turkcha harf va so'z ma'noga ega emas. Ehtimol "ovoz berasiz" bo'lishi kerak edi.

Yana: Gold topshiriqda \`abonent ?? false ? "Abonent" : "Mehmon"\` deb yozilgan. Bu ishlaydi, lekin \`?? false\` **ortiqcha** — ternary allaqachon \`null\` ni falsy deb qabul qiladi. Bu yerda ikki qadamga ajratildi, o'qishga qulayroq bo'lishi uchun.

## ⚠️ Ko'p uchraydigan xatolar

- **\`??\` va \`||\` chalkashligi** — son bilan ishlaganda \`||\` ishlatish.
- **\`??\` ni \`&&\`/\`||\` bilan aralashtirish** — \`a ?? b || c\` **sintaksis xatosi**. Qavs kerak: \`(a ?? b) || c\`.
- **\`break\` unutilgan** — fall-through.
- **\`switch\` da tur mos kelmagan** — matn va son.
- **Ternary zanjiri juda uzun** — o'qib bo'lmaydi.

## 📊 Daraja belgilash

- **Bronze** — switch ishlaydi, case birlashtirilgan
- **Silver** — ternary bilan darajalar, \`||\`/\`??\` farqi ko'rsatilgan
- **Gold** — uchala texnika birga, \`??\` to'g'ri joyda

> Gold'ni tekshirish: Dilnozaning statusi to'g'ri chiqdimi? \`null\` bilan ishlash \`??\` siz noto'g'ri natija beradi.
`,
  },

  // ═══════════════════════════════════════════════════════════
  'junior.m2.l13': {
    goal: "DOM nima, elementlarni topish va ularning matni, stili, klasslarini o'zgartirish.",
    student: `
## 🌳 DOM nima?

Brauzer HTML faylni o'qiydi va uni **daraxt** ko'rinishida xotirasida saqlaydi. Bu daraxt — **DOM** (Document Object Model).

\`\`\`text
document
└── html
    ├── head
    │   └── title
    └── body
        ├── h1
        ├── p
        └── div
            ├── button
            └── span
\`\`\`

Muhimi shu: JavaScript bu daraxtni **o'zgartira oladi**. Siz HTML faylga tegmaysiz — brauzer xotirasidagi nusxani o'zgartirasiz, va ekranda darhol ko'rinadi.

---

## 🔍 Elementlarni topish

\`\`\`javascript
// Eng ko'p ishlatiladigan — CSS selektori bilan
document.querySelector("h1");        // birinchi h1
document.querySelector(".karta");    // birinchi .karta
document.querySelector("#asosiy");   // id="asosiy"

// Barchasi
document.querySelectorAll("p");      // barcha p

// Eski usul — faqat id bilan
document.getElementById("asosiy");
\`\`\`

> 💡 \`querySelector\` ichiga **CSS selektori** yoziladi — xuddi CSS faylidagidek. Siz buni 4-darsdan bilasiz. Yangi narsa o'rganish shart emas.

\`\`\`demo h=420 "Selektor yozing — mos elementlar belgilanadi"
<style>
  body { font-family: sans-serif; font-size: 13px; margin: 0; padding: 14px; }

  .kirish { display: flex; gap: 8px; margin-bottom: 12px; align-items: center; }
  .kirish span { font-family: monospace; font-size: 12px; color: #6b7280; }
  input {
    flex: 1; padding: 8px 12px; font-family: monospace; font-size: 13px;
    border: 2px solid #d1d5db; border-radius: 8px; outline: none;
  }
  input:focus { border-color: #6366f1; }

  #natija {
    font-family: monospace; font-size: 12px; color: #4b5563;
    margin-bottom: 12px; min-height: 18px;
  }

  #maydon {
    border: 1px dashed #d1d5db; border-radius: 10px; padding: 14px;
  }
  #maydon h2 { font-size: 16px; margin: 0 0 8px; }
  #maydon p { margin: 0 0 6px; }
  .karta {
    background: #f3f4f6; border-radius: 8px; padding: 8px 10px;
    margin-bottom: 6px; font-size: 12px;
  }
  .muhim { border-left: 3px solid #f59e0b; }

  .topildi {
    outline: 3px solid #6366f1 !important;
    outline-offset: 2px;
    background: #eef2ff !important;
  }
</style>

<div class="kirish">
  <span>querySelectorAll(</span>
  <input id="sel" value=".karta" />
  <span>)</span>
</div>

<div id="natija"></div>

<div id="maydon">
  <h2 id="sarlavha">Sarlavha</h2>
  <p>Birinchi paragraf</p>
  <p class="muhim">Ikkinchi paragraf (muhim)</p>
  <div class="karta">Karta 1</div>
  <div class="karta muhim">Karta 2 (muhim)</div>
  <div class="karta">Karta 3</div>
</div>

<script>
  var input = document.querySelector('#sel');
  var natija = document.querySelector('#natija');
  var maydon = document.querySelector('#maydon');

  function render() {
    // Eski belgilarni tozalaymiz
    var eski = maydon.querySelectorAll('.topildi');
    for (var i = 0; i < eski.length; i++) {
      eski[i].classList.remove('topildi');
    }

    var sel = input.value.trim();
    if (!sel) { natija.textContent = 'Selektor kiriting'; return; }

    try {
      var topilgan = maydon.querySelectorAll(sel);
      for (var j = 0; j < topilgan.length; j++) {
        topilgan[j].classList.add('topildi');
      }
      natija.textContent = topilgan.length + ' ta element topildi';
      natija.style.color = topilgan.length ? '#16a34a' : '#dc2626';
    } catch (e) {
      natija.textContent = 'Noto\\'g\\'ri selektor';
      natija.style.color = '#dc2626';
    }
  }

  input.addEventListener('input', render);
  render();
</script>
\`\`\`

Sinab ko'ring: \`p\` · \`.karta\` · \`.muhim\` · \`#sarlavha\` · \`.karta.muhim\` · \`div p\`

---

## ⚠️ Topilmasa — \`null\`

\`\`\`javascript
const yoq = document.querySelector(".mavjud-emas");
console.log(yoq);            // null

yoq.textContent = "Salom";   // ❌ TypeError!
\`\`\`

Bu — DOM bilan ishlashda **eng ko'p uchraydigan xato**:

\`\`\`text
Cannot read properties of null (reading 'textContent')
\`\`\`

Sabablari odatda uchtasi:

1. Selektorda xato (\`#btn\` o'rniga \`btn\`)
2. \`<script>\` \`<head>\` da — element hali yaratilmagan (34-dars)
3. Element haqiqatan yo'q

Xavfsiz yozuv:

\`\`\`javascript
const el = document.querySelector("#btn");
if (el) {
  el.textContent = "Salom";
}
\`\`\`

---

## 🖊️ textContent va innerHTML

\`\`\`demo h=400 "Farqi — va nima uchun muhim"
<style>
  body { font-family: sans-serif; font-size: 13px; margin: 0; padding: 14px; }
  .kirish { margin-bottom: 12px; }
  input {
    width: 100%; padding: 8px 12px; font-family: monospace; font-size: 12px;
    border: 2px solid #d1d5db; border-radius: 8px; outline: none; box-sizing: border-box;
  }
  input:focus { border-color: #6366f1; }

  .juft { display: flex; gap: 10px; }
  .yarim { flex: 1; }
  .lbl { font-family: monospace; font-size: 11px; color: #6b7280; margin: 0 0 4px; }
  .quti {
    border: 1px solid #e5e7eb; border-radius: 8px; padding: 10px;
    min-height: 60px; font-size: 13px; word-break: break-word;
  }
  .xavfsiz { background: #ecfdf5; border-color: #a7f3d0; }
  .xavfli { background: #fef2f2; border-color: #fecaca; }
  .izoh { font-size: 11px; color: #6b7280; margin-top: 12px; line-height: 1.7; }
</style>

<div class="kirish">
  <p class="lbl">Matn kiriting (HTML tegi ham yozing):</p>
  <input id="kiritish" value="&lt;b&gt;Qalin&lt;/b&gt; matn" />
</div>

<div class="juft">
  <div class="yarim">
    <p class="lbl">el.textContent = ...</p>
    <div class="quti xavfsiz" id="tc"></div>
  </div>
  <div class="yarim">
    <p class="lbl">el.innerHTML = ...</p>
    <div class="quti xavfli" id="ih"></div>
  </div>
</div>

<p class="izoh">
  Chap tomon matnni <b>o'z holicha</b> ko'rsatadi.<br />
  O'ng tomon uni <b>HTML sifatida</b> o'qiydi va bajaradi.
</p>

<script>
  var kiritish = document.querySelector('#kiritish');
  var tc = document.querySelector('#tc');
  var ih = document.querySelector('#ih');

  function render() {
    var qiymat = kiritish.value;
    tc.textContent = qiymat;
    ih.innerHTML = qiymat;
  }

  kiritish.addEventListener('input', render);
  render();
</script>
\`\`\`

Yozing: \`<b>Qalin</b>\` · \`<h1>Katta</h1>\` · \`<img src=x onerror="alert(1)">\`

> ⚠️ **Xavfsizlik.** Oxirgi misolni tushunish muhim. Agar saytingiz foydalanuvchi yozgan matnni \`innerHTML\` ga qo'ysa, u **HTML va JavaScript kiritishi** mumkin. Bu — **XSS hujumi** deb ataladi va haqiqiy saytlarni buzish uchun ishlatiladi.
>
> **Qoida:** foydalanuvchidan kelgan har qanday ma'lumot uchun **\`textContent\`** ishlating. \`innerHTML\` ni faqat **o'zingiz yozgan** HTML uchun ishlating.

---

## 🎨 Stilni o'zgartirish

\`\`\`javascript
const quti = document.querySelector(".quti");

quti.style.backgroundColor = "#3498db";
quti.style.fontSize = "18px";
quti.style.borderRadius = "8px";
\`\`\`

> ⚠️ CSS xususiyat nomlari JavaScript'da **camelCase** bo'ladi — tire ishlatilmaydi:
>
> | CSS | JavaScript |
> | --- | --- |
> | \`background-color\` | \`backgroundColor\` |
> | \`font-size\` | \`fontSize\` |
> | \`border-radius\` | \`borderRadius\` |
> | \`margin-top\` | \`marginTop\` |
>
> Sabab: \`style.font-size\` JavaScript'da "font minus size" degan ayirish amali bo'lib qoladi.

---

## 🏷️ classList — yaxshiroq yo'l

Stilni to'g'ridan-to'g'ri o'zgartirish o'rniga, **CSS klassini** almashtirish afzal:

\`\`\`demo h=400 "classList metodlari"
<style>
  body { font-family: sans-serif; font-size: 13px; margin: 0; padding: 14px; }

  #quti {
    padding: 24px; border-radius: 12px; text-align: center;
    background: #f3f4f6; color: #4b5563; font-weight: 600;
    transition: all 0.3s; margin-bottom: 14px;
    border: 2px solid transparent;
  }
  #quti.faol { background: #dbeafe; color: #1e40af; border-color: #3b82f6; }
  #quti.katta { padding: 40px; font-size: 20px; }
  #quti.dumaloq { border-radius: 50px; }

  .tugmalar { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 12px; }
  button {
    padding: 7px 12px; border: none; border-radius: 7px;
    font-size: 11px; cursor: pointer; color: white; font-family: monospace;
    background: #6366f1;
  }

  #holat {
    background: #1f2937; color: #d1d5db; border-radius: 8px; padding: 10px;
    font-family: monospace; font-size: 12px; line-height: 1.8;
  }
  .klass { color: #fbbf24; }
</style>

<div id="quti">Meni o'zgartiring</div>

<div class="tugmalar">
  <button data-a="toggle" data-k="faol">toggle("faol")</button>
  <button data-a="toggle" data-k="katta">toggle("katta")</button>
  <button data-a="toggle" data-k="dumaloq">toggle("dumaloq")</button>
  <button data-a="remove" data-k="hammasi" style="background:#9ca3af">Hammasini o'chir</button>
</div>

<div id="holat"></div>

<script>
  var quti = document.querySelector('#quti');
  var holat = document.querySelector('#holat');

  function render() {
    var klasslar = Array.prototype.slice.call(quti.classList);
    holat.innerHTML =
      'class="<span class="klass">' + klasslar.join(' ') + '</span>"<br />' +
      'classList.contains("faol") → ' + quti.classList.contains('faol') + '<br />' +
      'Klasslar soni: ' + klasslar.length;
  }

  var tugmalar = document.querySelectorAll('button');
  for (var i = 0; i < tugmalar.length; i++) {
    tugmalar[i].addEventListener('click', function () {
      var amal = this.dataset.a;
      var kalit = this.dataset.k;

      if (amal === 'toggle') {
        quti.classList.toggle(kalit);
      } else {
        quti.className = '';
      }
      render();
    });
  }

  render();
</script>
\`\`\`

| Metod | Nima qiladi |
| --- | --- |
| \`.add("nom")\` | Klass qo'shadi |
| \`.remove("nom")\` | O'chiradi |
| \`.toggle("nom")\` | Bor bo'lsa o'chiradi, yo'q bo'lsa qo'shadi |
| \`.contains("nom")\` | Bormi? \`true\`/\`false\` |

> 💡 **Nima uchun \`classList\` afzal?**
>
> \`style\` bilan o'zgartirsangiz, dizayn JavaScript ichiga tarqalib ketadi. \`classList\` bilan esa **ko'rinish CSS'da qoladi**, JavaScript faqat "qaysi holatda" ekanini boshqaradi.
>
> Bu — katta loyihalarda juda muhim. Dizaynni o'zgartirmoqchi bo'lsangiz, faqat CSS'ga qaraysiz.

---

## 🔗 Atributlar

\`\`\`javascript
const img = document.querySelector("img");

img.src = "yangi.jpg";              // to'g'ridan-to'g'ri
img.setAttribute("alt", "Tavsif");  // metod orqali
img.getAttribute("src");            // o'qish
img.removeAttribute("title");       // o'chirish

// Forma elementlari
input.value = "Salom";
input.disabled = true;
\`\`\`

---

## 🎯 Amaliy misol

\`\`\`demo h=400 "Rang o'zgartiruvchi"
<style>
  * { box-sizing: border-box; }
  body { font-family: sans-serif; font-size: 13px; margin: 0; padding: 16px; text-align: center; }

  #quti {
    width: 150px; height: 150px; margin: 0 auto 12px;
    background: #cccccc; border-radius: 12px;
    transition: background 0.3s;
  }
  #xabar {
    font-family: monospace; font-size: 14px; color: #4b5563; margin-bottom: 14px;
  }
  button {
    padding: 10px 18px; border: none; border-radius: 8px;
    font-size: 13px; cursor: pointer; color: white; margin: 0 3px;
  }
  #btn { background: #6366f1; }
  #reset { background: #9ca3af; }
</style>

<div id="quti"></div>
<div id="xabar">Rangi: #cccccc</div>

<button id="btn">Tasodifiy rang</button>
<button id="reset">Reset</button>

<script>
  var ASL_RANG = '#cccccc';

  var quti = document.querySelector('#quti');
  var xabar = document.querySelector('#xabar');

  function tasodifiyRang() {
    var harflar = '0123456789ABCDEF';
    var rang = '#';
    for (var i = 0; i < 6; i++) {
      rang += harflar[Math.floor(Math.random() * 16)];
    }
    return rang;
  }

  function rangQoy(rang) {
    quti.style.backgroundColor = rang;
    xabar.textContent = 'Rangi: ' + rang;
  }

  document.querySelector('#btn').addEventListener('click', function () {
    rangQoy(tasodifiyRang());
  });

  document.querySelector('#reset').addEventListener('click', function () {
    rangQoy(ASL_RANG);
  });
</script>
\`\`\`

---

## 🥉 Bronze Topshiriq

Sarlavha va tugma yarating. Tugma bosilganda sarlavha matni va rangi o'zgarsin.

\`\`\`javascript
const sarlavha = document.querySelector('#sarlavha');
sarlavha.textContent = "Yangi matn";
sarlavha.style.color = "#3498db";
\`\`\`

> ⚠️ HTML'da \`onclick="funksiya()"\` yozish **eski usul**. \`addEventListener\` ishlating — u zamonaviy va bir elementga bir nechta hodisa qo'shish imkonini beradi.

---

## 🥈 Silver Topshiriq

- Uchta tugma: matn, rang, o'lchamni o'zgartiradi
- Har biri \`querySelector\` bilan topilsin
- Hech qayerda \`onclick\` atributi ishlatilmasin

---

## 🥇 Gold Topshiriq

Rang o'zgartiruvchi yasang:

- Tasodifiy rang tugmasi
- Reset tugmasi (asl rangga qaytaradi)
- Rang kodi ekranda ko'rinadi
- Qo'shimcha: \`classList.toggle\` bilan qorong'i rejim

---

## ✅ Dars Xulosa

- \`querySelector\` — **CSS selektori** bilan, birinchi mos element
- \`querySelectorAll\` — barchasi
- Topilmasa **\`null\`** — tekshiring, aks holda \`TypeError\`
- \`textContent\` — xavfsiz, \`innerHTML\` — **XSS xavfi bor**
- \`style\` da camelCase: \`backgroundColor\`, \`fontSize\`
- \`classList\` afzal — ko'rinish CSS'da qoladi
- \`onclick\` atributi emas, \`addEventListener\`

> 🚀 **Keyingi dars:** Event Listeners — hodisalar bilan chuqurroq!
`,
    teacher: `
## 💡 O'qituvchi uchun

- **Selektor demosi** — bu darsning eng qimmatli qismi. Bolalar CSS selektorlarini biladi (4-dars), lekin ular DOM'da ham ishlashini bilmaydi. Demoda \`.karta.muhim\` yoki \`div p\` yozib ko'rsating — bog'lanish shu yerda tushuniladi.
- **\`null\` xatosi** — bu dars va keyingi darslarda eng ko'p uchraydigan muammo. Xato xabarini (\`Cannot read properties of null\`) doskaga yozib qo'ying va uchta sababni sanang. Bolalar bu xabarni yuzlab marta ko'radi.
- **\`textContent\` va \`innerHTML\` demosi** — XSS ni ko'rsatishning eng oson yo'li. \`<img src=x onerror="alert(1)">\` ni kiritib ko'rsating. Bolalar "sayt buzish" mavzusiga juda qiziqadi va bu qoidani bir umr eslab qoladi.
- \`classList\` ni \`style\` dan afzal ko'rishni **birinchi kundan** o'rgating. Keyin React'ga o'tganda bu fikrlash tarzi juda foyda beradi.
- camelCase — bolalar \`style.font-size\` yozadi va xato chiqmaydi (shunchaki ishlamaydi). Buni ataylab ko'rsating.

## 🗒 Notion'dagi tuzatishlar

**1. Bronze topshiriqda \`onclick\` atributi ishlatilgan:**

\`\`\`html
<button onclick="sarlavhaniOzgartir()">O'zgartir</button>
\`\`\`

Bu — eskirgan usul. Silver'da allaqachon \`addEventListener\` ko'rsatilgan, ya'ni bitta darsda ikki xil yondashuv. Bola qaysi birini ishlatishni bilmaydi.

Bu yerda Bronze ham \`addEventListener\` ga o'tkazildi va ogohlantirish qo'shildi.

**2. \`ASAL_RANG\`** — "asal" (mёd) emas, "asl" (original) bo'lishi kerak. \`ASL_RANG\` deb tuzatildi.

**3. XSS haqida ogohlantirish kuchaytirildi.** Notion'da bir qator izoh bor edi; bu yerda alohida demo va qoida qilindi, chunki bu — xavfsizlik masalasi.

## ⚠️ Ko'p uchraydigan xatolar

- **\`Cannot read properties of null\`** — element topilmadi. Uchta sababni tekshiring.
- **\`#\` yoki \`.\` unutilgan** — \`querySelector("btn")\` \`<btn>\` tegini qidiradi.
- **\`style.font-size\`** — camelCase kerak.
- **\`style.width = 200\`** — birlik yo'q. \`"200px"\` bo'lishi kerak.
- **\`querySelectorAll\` natijasiga to'g'ridan-to'g'ri murojaat** — \`document.querySelectorAll("p").textContent\` ishlamaydi. Bu — ro'yxat, tsikl kerak.
- **\`innerHTML\` bilan foydalanuvchi ma'lumoti** — XSS xavfi.
- **\`classList.toggle\` ga nuqta bilan yozish** — \`toggle(".faol")\` noto'g'ri, nuqtasiz: \`toggle("faol")\`.

## 📊 Daraja belgilash

- **Bronze** — element topiladi, matn va rang o'zgaradi, \`onclick\` ishlatilmagan
- **Silver** — uchta tugma, hammasi \`addEventListener\` bilan
- **Gold** — rang o'zgartiruvchi ishlaydi, reset bor, classList qo'llangan

> Silver'ni tekshirishda HTML'ga qarang: \`onclick\` bor bo'lsa — bajarilmagan.
`,
  },

  // ═══════════════════════════════════════════════════════════
  'junior.m2.l14': {
    goal: "addEventListener bilan foydalanuvchi harakatlariga javob berish.",
    student: `
## 🔔 Hodisa (event) nima?

Hodisa — foydalanuvchi yoki brauzerning **harakati**: bosish, yozish, sichqonchani surish, sahifani scroll qilish.

JavaScript bu harakatlarni **kuzatib turadi** va siz aytgan kodni ishga tushiradi.

\`\`\`javascript
element.addEventListener('click', function () {
  // bu kod element BOSILGANDA ishlaydi
});
\`\`\`

Uch qismi bor: **kim** (element), **nima bo'lganda** (\`'click'\`), **nima qilish** (funksiya).

---

## 📬 Event obyekti — \`e\`

Funksiya ichiga **hodisa haqidagi ma'lumot** keladi:

\`\`\`javascript
element.addEventListener('click', function (e) {
  console.log(e.type);     // 'click'
  console.log(e.target);   // qaysi element bosildi
  console.log(e.clientX);  // sichqoncha koordinatasi
});
\`\`\`

\`\`\`demo h=400 "Istalgan joyga bosing"
<style>
  body { font-family: sans-serif; font-size: 13px; margin: 0; padding: 14px; }

  #maydon {
    border: 2px dashed #d1d5db; border-radius: 10px;
    padding: 16px; margin-bottom: 12px; cursor: crosshair;
  }
  #maydon h3 { margin: 0 0 8px; font-size: 15px; }
  #maydon button {
    padding: 8px 14px; margin-right: 6px; border: none;
    border-radius: 7px; background: #6366f1; color: white;
    font-size: 12px; cursor: pointer;
  }
  #maydon .karta {
    background: #f3f4f6; border-radius: 8px; padding: 10px;
    margin-top: 8px; font-size: 12px;
  }

  #malumot {
    background: #1f2937; border-radius: 8px; padding: 12px;
    font-family: monospace; font-size: 12px; line-height: 1.9;
    color: #d1d5db; min-height: 120px;
  }
  .kalit { color: #93c5fd; }
  .qiymat { color: #fbbf24; }
</style>

<div id="maydon">
  <h3>Sarlavha</h3>
  <button id="btn1">Birinchi tugma</button>
  <button id="btn2">Ikkinchi</button>
  <div class="karta">Men kartaman — meni ham bosing</div>
</div>

<div id="malumot">Yuqoridagi maydonga bosing...</div>

<script>
  var maydon = document.querySelector('#maydon');
  var malumot = document.querySelector('#malumot');

  maydon.addEventListener('click', function (e) {
    var teg = e.target.tagName.toLowerCase();
    var id = e.target.id || '—';
    var klass = e.target.className || '—';
    var matn = (e.target.textContent || '').trim().slice(0, 30);

    malumot.innerHTML =
      '<span class="kalit">e.type</span>    → <span class="qiymat">"' + e.type + '"</span><br />' +
      '<span class="kalit">e.target</span>  → <span class="qiymat">&lt;' + teg + '&gt;</span><br />' +
      '<span class="kalit">  .id</span>     → <span class="qiymat">"' + id + '"</span><br />' +
      '<span class="kalit">  .className</span> → <span class="qiymat">"' + klass + '"</span><br />' +
      '<span class="kalit">  .textContent</span> → <span class="qiymat">"' + matn + '"</span><br />' +
      '<span class="kalit">e.clientX, Y</span> → <span class="qiymat">' + e.clientX + ', ' + e.clientY + '</span>';
  });
</script>
\`\`\`

Turli joylarga bosing — tugma, sarlavha, karta, bo'sh joy. \`e.target\` **aniq bosilgan** elementni ko'rsatadi.

---

## 🔤 input — har harfda ishlaydi

\`\`\`demo h=360 "Yozing — natija darhol o'zgaradi"
<style>
  body { font-family: sans-serif; font-size: 13px; margin: 0; padding: 14px; }
  input {
    width: 100%; padding: 10px 14px; font-size: 14px;
    border: 2px solid #d1d5db; border-radius: 8px;
    outline: none; box-sizing: border-box; margin-bottom: 12px;
    transition: border-color 0.2s;
  }
  input:focus { border-color: #6366f1; }

  .qator {
    display: flex; justify-content: space-between;
    padding: 8px 12px; border-radius: 8px; margin-bottom: 6px;
    background: #f9fafb; font-size: 13px;
  }
  .qator .nom { color: #6b7280; font-family: monospace; font-size: 11px; }
  .qator .val { font-family: monospace; font-weight: 600; color: #1e40af; }

  #oyna {
    background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px;
    padding: 12px; font-size: 15px; min-height: 24px; color: #1e40af;
    margin-bottom: 12px; word-break: break-word;
  }
</style>

<input id="kirish" placeholder="Bu yerga yozing..." />

<div id="oyna">Hech narsa kiritilmagan</div>

<div class="qator"><span class="nom">e.target.value</span><span class="val" id="v"></span></div>
<div class="qator"><span class="nom">uzunligi</span><span class="val" id="u">0</span></div>
<div class="qator"><span class="nom">KATTA HARFDA</span><span class="val" id="k"></span></div>

<script>
  var kirish = document.querySelector('#kirish');
  var oyna = document.querySelector('#oyna');

  kirish.addEventListener('input', function (e) {
    var qiymat = e.target.value;

    oyna.textContent = qiymat || 'Hech narsa kiritilmagan';
    document.querySelector('#v').textContent = '"' + qiymat + '"';
    document.querySelector('#u').textContent = qiymat.length;
    document.querySelector('#k').textContent = qiymat.toUpperCase();
  });
</script>
\`\`\`

\`input\` va \`change\` farqi:

- **\`input\`** — har harf yozilganda darhol
- **\`change\`** — maydondan chiqib ketganda (fokus yo'qolganda)

---

## ⌨️ Klaviatura hodisalari

\`\`\`demo h=340 "Maydonga bosing, keyin istalgan tugmani bosing"
<style>
  body { font-family: sans-serif; font-size: 13px; margin: 0; padding: 14px; }

  #maydon {
    border: 2px dashed #d1d5db; border-radius: 10px;
    padding: 24px; text-align: center; outline: none;
    cursor: text; transition: border-color 0.2s;
    margin-bottom: 12px;
  }
  #maydon:focus { border-color: #6366f1; background: #f5f3ff; }
  #maydon .yorlq { font-size: 12px; color: #9ca3af; }
  #maydon .tugma {
    font-size: 32px; font-family: monospace; font-weight: 700;
    color: #4f46e5; min-height: 42px; margin-top: 6px;
  }

  table { width: 100%; border-collapse: collapse; font-size: 12px; }
  td { padding: 7px 10px; border-top: 1px solid #f0f0f0; font-family: monospace; }
  td:first-child { color: #6b7280; width: 40%; }
  td:last-child { color: #1e40af; font-weight: 600; }
</style>

<div id="maydon" tabindex="0">
  <div class="yorlq">Bu yerga bosing, keyin klaviaturadan tugma bosing</div>
  <div class="tugma" id="tugma">—</div>
</div>

<table>
  <tr><td>e.key</td><td id="key">—</td></tr>
  <tr><td>e.code</td><td id="code">—</td></tr>
  <tr><td>e.ctrlKey</td><td id="ctrl">false</td></tr>
  <tr><td>e.shiftKey</td><td id="shift">false</td></tr>
</table>

<script>
  var maydon = document.querySelector('#maydon');

  maydon.addEventListener('keydown', function (e) {
    e.preventDefault();

    var korinish = e.key === ' ' ? '␣' : e.key;
    document.querySelector('#tugma').textContent = korinish;
    document.querySelector('#key').textContent = '"' + e.key + '"';
    document.querySelector('#code').textContent = '"' + e.code + '"';
    document.querySelector('#ctrl').textContent = e.ctrlKey;
    document.querySelector('#shift').textContent = e.shiftKey;
  });
</script>
\`\`\`

\`e.key\` va \`e.code\` farqi muhim:

- **\`e.key\`** — **belgi**. \`Shift\` bilan \`a\` bossangiz → \`"A"\`
- **\`e.code\`** — **jismoniy tugma**. Har doim \`"KeyA"\`, qaysi tilda yozayotganingizdan qat'i nazar

O'yin yozayotganda \`e.code\` ishlating — u klaviatura tiliga bog'liq emas.

---

## 🛑 e.preventDefault()

Ba'zi hodisalarning **standart xatti-harakati** bor:

- Havola bosilsa — boshqa sahifaga o'tadi
- Forma yuborilsa — sahifa qayta yuklanadi
- O'ng tugma bosilsa — menyu chiqadi

\`e.preventDefault()\` shuni to'xtatadi:

\`\`\`javascript
link.addEventListener('click', function (e) {
  e.preventDefault();     // sahifa o'tmaydi
  console.log('Havola bosildi');
});
\`\`\`

Yuqoridagi klaviatura demosida ham ishlatilgan — busiz \`Tab\` bosganda fokus ketib qolardi.

---

## 📊 Event delegation — muhim texnika

Muammo: ro'yxatga **yangi** element qo'shsangiz, unga listener yo'q bo'ladi.

\`\`\`demo h=400 "Ikki usulni taqqoslang"
<style>
  body { font-family: sans-serif; font-size: 13px; margin: 0; padding: 14px; }
  .juft { display: flex; gap: 12px; }
  .yarim { flex: 1; }
  .lbl { font-size: 11px; font-family: monospace; color: #6b7280; margin: 0 0 6px; min-height: 30px; }

  ul { list-style: none; padding: 0; margin: 0 0 8px; }
  li {
    background: #f3f4f6; padding: 7px 10px; border-radius: 6px;
    margin-bottom: 4px; cursor: pointer; font-size: 12px;
    transition: background 0.15s;
  }
  li:hover { background: #e5e7eb; }
  li.tanlangan { background: #c7d2fe; color: #3730a3; font-weight: 600; }

  button {
    padding: 7px 12px; border: none; border-radius: 7px;
    background: #16a34a; color: white; font-size: 11px; cursor: pointer;
    width: 100%;
  }
</style>

<div class="juft">
  <div class="yarim">
    <p class="lbl">❌ Har elementga alohida listener</p>
    <ul id="yomon">
      <li>1-element</li>
      <li>2-element</li>
    </ul>
    <button id="yomonQosh">Yangi qo'shish</button>
  </div>

  <div class="yarim">
    <p class="lbl">✅ Delegation — ota elementda bitta</p>
    <ul id="yaxshi">
      <li>1-element</li>
      <li>2-element</li>
    </ul>
    <button id="yaxshiQosh">Yangi qo'shish</button>
  </div>
</div>

<p style="font-size:11px;color:#6b7280;margin-top:12px;line-height:1.7">
  Ikkala tomonda ham elementlarni bosing — ishlaydi.<br />
  Endi <b>"Yangi qo'shish"</b> ni bosing va <b>yangi</b> elementni bosib ko'ring.<br />
  Chap tomonda ishlamaydi, o'ng tomonda ishlaydi.
</p>

<script>
  // ❌ Yomon usul — har elementga alohida
  var yomonLi = document.querySelectorAll('#yomon li');
  for (var i = 0; i < yomonLi.length; i++) {
    yomonLi[i].addEventListener('click', function () {
      this.classList.toggle('tanlangan');
    });
  }

  document.querySelector('#yomonQosh').addEventListener('click', function () {
    var ul = document.querySelector('#yomon');
    var li = document.createElement('li');
    li.textContent = (ul.children.length + 1) + '-element (yangi)';
    ul.appendChild(li);
    // Listener qo'shilmadi — shuning uchun ishlamaydi
  });

  // ✅ Yaxshi usul — ota elementda bitta listener
  document.querySelector('#yaxshi').addEventListener('click', function (e) {
    if (e.target.tagName === 'LI') {
      e.target.classList.toggle('tanlangan');
    }
  });

  document.querySelector('#yaxshiQosh').addEventListener('click', function () {
    var ul = document.querySelector('#yaxshi');
    var li = document.createElement('li');
    li.textContent = (ul.children.length + 1) + '-element (yangi)';
    ul.appendChild(li);
    // Listener kerak emas — ota element allaqachon kuzatyapti
  });
</script>
\`\`\`

Delegation ikki foyda beradi:

1. **Yangi elementlar** avtomatik ishlaydi
2. 100 ta element uchun 100 ta emas, **bitta** listener — tezroq

\`\`\`javascript
royxat.addEventListener('click', function (e) {
  if (e.target.tagName === 'LI') {
    // faqat li bosilganda
  }
});
\`\`\`

\`e.target\` — aynan bosilgan element. Shuning uchun uni tekshirish kerak, aks holda \`ul\` ning bo'sh joyiga bosilganda ham ishlaydi.

---

## 📝 To-do ro'yxati

\`\`\`demo h=420 "Ishlaydigan ro'yxat"
<style>
  * { box-sizing: border-box; }
  body { font-family: sans-serif; font-size: 13px; margin: 0; padding: 14px; }

  .kirish { display: flex; gap: 8px; margin-bottom: 12px; }
  input {
    flex: 1; padding: 10px 12px; font-size: 13px;
    border: 2px solid #d1d5db; border-radius: 8px; outline: none;
  }
  input:focus { border-color: #6366f1; }
  button.qosh {
    padding: 10px 18px; border: none; border-radius: 8px;
    background: #6366f1; color: white; font-size: 13px; cursor: pointer;
  }

  ul { list-style: none; padding: 0; margin: 0; }
  li {
    display: flex; justify-content: space-between; align-items: center;
    background: #f9fafb; border: 1px solid #e5e7eb;
    padding: 9px 12px; border-radius: 8px; margin-bottom: 5px;
  }
  li.bajarildi span { text-decoration: line-through; color: #9ca3af; }
  li span { cursor: pointer; flex: 1; }
  li .och {
    background: none; border: none; color: #dc2626;
    cursor: pointer; font-size: 15px; padding: 0 4px;
  }

  .bosh { color: #9ca3af; font-style: italic; text-align: center; padding: 16px; }
  .hisob { margin-top: 10px; font-size: 11px; color: #6b7280; font-family: monospace; }
</style>

<div class="kirish">
  <input id="input" placeholder="Vazifa yozing va Enter bosing" />
  <button class="qosh" id="qosh">Qo'shish</button>
</div>

<ul id="royxat"></ul>
<div class="hisob" id="hisob"></div>

<script>
  var input = document.querySelector('#input');
  var royxat = document.querySelector('#royxat');
  var hisob = document.querySelector('#hisob');

  function render() {
    var jami = royxat.children.length;
    var bajarilgan = royxat.querySelectorAll('li.bajarildi').length;

    if (jami === 0) {
      royxat.innerHTML = '<div class="bosh">Vazifalar yo\\'q</div>';
      hisob.textContent = '';
      return;
    }
    hisob.textContent = 'Jami: ' + jami + '  ·  Bajarilgan: ' + bajarilgan;
  }

  function vazifaQosh() {
    var matn = input.value.trim();
    if (!matn) return;

    var bosh = royxat.querySelector('.bosh');
    if (bosh) bosh.remove();

    var li = document.createElement('li');
    li.innerHTML = '<span></span><button class="och">×</button>';
    li.querySelector('span').textContent = matn;   // xavfsiz

    royxat.appendChild(li);
    input.value = '';
    input.focus();
    render();
  }

  document.querySelector('#qosh').addEventListener('click', vazifaQosh);

  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') vazifaQosh();
  });

  // Delegation — bitta listener hamma vazifa uchun
  royxat.addEventListener('click', function (e) {
    if (e.target.classList.contains('och')) {
      e.target.parentElement.remove();
      render();
    } else if (e.target.tagName === 'SPAN') {
      e.target.parentElement.classList.toggle('bajarildi');
      render();
    }
  });

  render();
</script>
\`\`\`

Diqqat qiling: matn \`textContent\` bilan qo'yilgan, \`innerHTML\` bilan emas. Bu — 13-darsdagi XSS qoidasi. Foydalanuvchi \`<img src=x onerror=...>\` yozsa ham, u oddiy matn bo'lib qoladi.

---

## 🥉 Bronze Topshiriq

Tugma va hisoblagich. Bosilganda son ortsin.

---

## 🥈 Silver Topshiriq

- Input maydoni — yozilgani darhol pastda ko'rinsin (\`input\` hodisasi)
- Enter bosilganda maydon tozalansin (\`keydown\` va \`e.key === 'Enter'\`)

---

## 🥇 Gold Topshiriq

To-do ro'yxati yasang:

- Tugma **yoki** Enter bilan qo'shiladi
- Vazifa matniga bosilganda "bajarildi" bo'ladi (chizib qo'yiladi)
- × tugmasi o'chiradi
- **Event delegation** ishlatilgan bo'lsin — har vazifaga alohida listener emas
- Matn \`textContent\` bilan qo'yilsin

---

## ✅ Dars Xulosa

- \`addEventListener('hodisa', funksiya)\` — uch qism
- \`e.target\` — **aniq bosilgan** element
- \`e.key\` — belgi, \`e.code\` — jismoniy tugma (o'yinlarda \`code\`)
- \`e.preventDefault()\` — standart xatti-harakatni to'xtatadi
- **Delegation** — ota elementda bitta listener, yangi elementlar ham ishlaydi
- Matn qo'yishda \`textContent\` — XSS dan himoya

> 🚀 **Keyingi dars:** Dinamik elementlar — createElement va appendChild!
`,
    teacher: `
## 💡 O'qituvchi uchun

- **Event obyekti demosi** bilan boshlang. Bolalar \`e\` ni "sehrli harf" deb qabul qiladi. Turli joylarga bosdirib, \`e.target\` o'zgarishini ko'rsating — shunda u aniq narsa ekanini tushunadi.
- **\`e.key\` va \`e.code\` farqi** — klaviatura demosida \`Shift+a\` bosdiring. \`key\` → \`"A"\`, \`code\` → \`"KeyA"\`. O'yin yozishda nega \`code\` kerakligi shu yerda tushuniladi.
- **Event delegation** — bu darsning eng muhim tushunchasi va eng qiyin. Ikki tomonlama demoni albatta ko'rsating: chapda yangi element **ishlamaydi**, o'ngda ishlaydi. Bola farqni ko'rgach, "nega?" deb so'raydi — o'shanda tushuntiring.
- Delegation'ni "eshik oldida turgan qorovul" deb tushuntiring: har xonaga qorovul qo'yish o'rniga, bitta kirish joyida turadi va kim kirganini ko'radi.
- To-do ro'yxati — 5-oyning asosiy loyihasi. Bolalarga ayting: "bu — kichik versiyasi, keyin uni localStorage bilan to'ldiramiz".

## 🗒 Notion'dagi tuzatishlar

**1. \`id="ro'yxat"\` — apostrofli ID**

\`\`\`html
<ul id="ro'yxat">
\`\`\`
\`\`\`javascript
document.querySelector('#ro\\'yxat')
\`\`\`

HTML buni qabul qiladi, lekin CSS selektorida apostrof **maxsus belgi** va escape talab qiladi. Kod ishlashi mumkin, lekin mo'rt va chalkash.

Bu yerda \`royxat\` deb yozildi. Qoida oddiy: **ID va class nomlarida ham apostrof ishlatmang** — o'zgaruvchi nomlaridagi kabi.

**2. Silver'da \`alert()\`**

Kabinetdagi demolar himoyalangan oynachada ishlaydi va u yerda \`alert()\` **ko'rinmaydi**. Demolarda DOM orqali ko'rsatish ishlatildi. Bolalar o'z kompyuterlarida \`alert()\` ni sinab ko'rishi mumkin.

**3. To-do misolida \`li.textContent = matn\` ishlatilgan** — bu to'g'ri. Lekin Gold quizda \`innerHTML\` bilan tugma yasalgan. Bu yerda ikkalasi aralashtirilmadi: tuzilma \`innerHTML\`, foydalanuvchi matni \`textContent\`.

## ⚠️ Ko'p uchraydigan xatolar

- **\`addEventListener('click', funksiya())\`** — qavs bilan. Funksiya **darhol** chaqiriladi va natijasi listener bo'lib qoladi. Qavssiz yozish kerak.
- **\`e\` parametri unutilgan** — \`function () { e.preventDefault(); }\` → \`e is not defined\`.
- **Delegation'da \`e.target\` tekshirilmagan** — ota elementning bo'sh joyiga bosilganda ham ishlaydi.
- **\`tagName\` kichik harfda solishtirilgan** — \`e.target.tagName === 'li'\` **ishlamaydi**. U har doim KATTA harfda: \`'LI'\`.
- **Yangi elementga listener qo'shilmagan** — delegation ishlatilmagan.
- **\`this\` arrow funksiyada** — \`addEventListener('click', () => this.classList...)\` ishlamaydi. Oddiy \`function\` ishlating yoki \`e.target\` dan foydalaning.

## 📊 Daraja belgilash

- **Bronze** — hisoblagich ishlaydi
- **Silver** — input va Enter ikkalasi ham ishlaydi
- **Gold** — to-do to'liq, **delegation ishlatilgan**

> Gold'ni tekshirishning aniq usuli: kodda \`querySelectorAll('li').forEach(... addEventListener ...)\` bormi? Bo'lsa — delegation ishlatilmagan.
`,
  },

  // ═══════════════════════════════════════════════════════════
  'junior.m2.l15': {
    goal: "createElement, appendChild va insertAdjacentHTML bilan dinamik interfeys yaratish.",
    student: `
## 🌱 Yangi element yaratish

Uch qadam: **yarat → to'ldir → qo'sh**.

\`\`\`javascript
// 1. Yaratish — hali sahifada yo'q
const li = document.createElement('li');

// 2. To'ldirish
li.textContent = "Yangi element";
li.classList.add('karta');

// 3. Sahifaga qo'shish — endi ko'rinadi
document.querySelector('ul').appendChild(li);
\`\`\`

> ⚠️ Uchinchi qadamsiz element **ko'rinmaydi**. U yaratilgan, lekin DOM daraxtiga ulanmagan. Bu — ko'p uchraydigan chalkashlik: "kod ishlayapti, lekin hech narsa chiqmayapti".

\`\`\`demo h=400 "Uch qadamni ko'ring"
<style>
  body { font-family: sans-serif; font-size: 13px; margin: 0; padding: 14px; }

  .qadamlar { display: flex; gap: 6px; margin-bottom: 12px; }
  .qadam {
    flex: 1; padding: 8px; border-radius: 8px; text-align: center;
    font-size: 11px; border: 2px solid #e5e7eb; background: #f9fafb;
    color: #9ca3af; transition: all 0.3s;
  }
  .qadam.faol { border-color: #6366f1; background: #eef2ff; color: #4f46e5; font-weight: 600; }

  #kod {
    background: #1f2937; border-radius: 8px; padding: 12px;
    font-family: monospace; font-size: 11px; color: #9ca3af;
    line-height: 1.9; margin-bottom: 12px; min-height: 76px;
  }
  #kod .yon { color: #fbbf24; }

  #natija {
    border: 2px dashed #d1d5db; border-radius: 8px; padding: 12px;
    min-height: 70px;
  }
  #natija ul { list-style: none; padding: 0; margin: 0; }
  #natija li {
    background: #dbeafe; color: #1e40af; padding: 8px 12px;
    border-radius: 6px; margin-bottom: 4px; font-size: 12px;
  }
  .bosh { color: #9ca3af; font-style: italic; font-size: 12px; }

  button {
    padding: 8px 16px; border: none; border-radius: 8px;
    background: #6366f1; color: white; font-size: 12px;
    cursor: pointer; margin-top: 12px; margin-right: 6px;
  }
  #reset { background: #9ca3af; }
</style>

<div class="qadamlar">
  <div class="qadam" id="q1">1. createElement</div>
  <div class="qadam" id="q2">2. textContent</div>
  <div class="qadam" id="q3">3. appendChild</div>
</div>

<div id="kod"></div>

<div id="natija"><ul id="royxat"></ul><div class="bosh" id="bosh">Sahifada hali hech narsa yo'q</div></div>

<button id="keyingi">Keyingi qadam</button>
<button id="reset">Boshidan</button>

<script>
  var bosqich = 0;
  var li = null;

  var kodEl = document.querySelector('#kod');
  var royxat = document.querySelector('#royxat');
  var bosh = document.querySelector('#bosh');

  function belgila(n) {
    for (var i = 1; i <= 3; i++) {
      document.querySelector('#q' + i).className = 'qadam' + (i === n ? ' faol' : '');
    }
  }

  function qadam() {
    bosqich++;

    if (bosqich === 1) {
      li = document.createElement('li');
      belgila(1);
      kodEl.innerHTML = '<span class="yon">const li = document.createElement("li");</span><br />' +
                        '<span style="color:#6b7280">// element yaratildi, lekin sahifada YO\\'Q</span>';
    } else if (bosqich === 2) {
      li.textContent = 'Yangi element';
      belgila(2);
      kodEl.innerHTML = 'const li = document.createElement("li");<br />' +
                        '<span class="yon">li.textContent = "Yangi element";</span><br />' +
                        '<span style="color:#6b7280">// matn berildi, hamon ko\\'rinmaydi</span>';
    } else if (bosqich === 3) {
      royxat.appendChild(li);
      bosh.style.display = 'none';
      belgila(3);
      kodEl.innerHTML = 'const li = document.createElement("li");<br />' +
                        'li.textContent = "Yangi element";<br />' +
                        '<span class="yon">royxat.appendChild(li);</span>  ' +
                        '<span style="color:#86efac">// MANA ENDI ko\\'rinadi</span>';
      document.querySelector('#keyingi').disabled = true;
    }
  }

  document.querySelector('#keyingi').addEventListener('click', qadam);

  document.querySelector('#reset').addEventListener('click', function () {
    bosqich = 0; li = null;
    royxat.innerHTML = '';
    bosh.style.display = '';
    kodEl.innerHTML = '';
    belgila(0);
    document.querySelector('#keyingi').disabled = false;
  });
</script>
\`\`\`

Ikkinchi qadamdan keyin ham hech narsa ko'rinmaydi — element **xotirada** bor, lekin sahifada yo'q. Faqat \`appendChild\` uni ko'rsatadi.

---

## 📍 insertAdjacentHTML — aniq joyga qo'shish

\`appendChild\` faqat **oxiriga** qo'shadi. Aniqroq nazorat kerak bo'lsa:

\`\`\`demo h=400 "To'rtta pozitsiya"
<style>
  body { font-family: sans-serif; font-size: 13px; margin: 0; padding: 14px; }

  #maydon {
    border: 2px dashed #d1d5db; border-radius: 10px;
    padding: 14px; margin-bottom: 12px; min-height: 130px;
  }
  #nishon {
    background: #6366f1; color: white; padding: 14px;
    border-radius: 8px; text-align: center; font-weight: 600;
  }
  .qoshilgan {
    background: #fef3c7; color: #92400e; padding: 7px 12px;
    border-radius: 6px; margin: 4px 0; font-size: 12px;
    font-family: monospace;
  }

  .tugmalar { display: flex; gap: 5px; flex-wrap: wrap; }
  button {
    padding: 7px 10px; border: none; border-radius: 7px;
    font-size: 11px; cursor: pointer; color: white;
    font-family: monospace; background: #6366f1;
  }
  #tozala { background: #9ca3af; }
</style>

<div id="maydon">
  <div id="nishon">NISHON element</div>
</div>

<div class="tugmalar">
  <button data-p="beforebegin">beforebegin</button>
  <button data-p="afterbegin">afterbegin</button>
  <button data-p="beforeend">beforeend</button>
  <button data-p="afterend">afterend</button>
  <button id="tozala">Tozalash</button>
</div>

<script>
  var maydon = document.querySelector('#maydon');
  var nishon = document.querySelector('#nishon');

  var tugmalar = document.querySelectorAll('button[data-p]');
  for (var i = 0; i < tugmalar.length; i++) {
    tugmalar[i].addEventListener('click', function () {
      var poz = this.dataset.p;
      nishon.insertAdjacentHTML(poz, '<div class="qoshilgan">' + poz + '</div>');
    });
  }

  document.querySelector('#tozala').addEventListener('click', function () {
    maydon.innerHTML = '';
    nishon = document.createElement('div');
    nishon.id = 'nishon';
    nishon.textContent = 'NISHON element';
    maydon.appendChild(nishon);
  });
</script>
\`\`\`

Har tugmani bosib ko'ring:

| Pozitsiya | Qayerga qo'yadi |
| --- | --- |
| \`beforebegin\` | Element **oldiga** (tashqarisiga) |
| \`afterbegin\` | Element **ichiga**, boshiga |
| \`beforeend\` | Element **ichiga**, oxiriga |
| \`afterend\` | Element **keyiniga** (tashqarisiga) |

> ⚠️ \`insertAdjacentHTML\` — bu **HTML** qabul qiladi. Foydalanuvchi ma'lumoti bilan ishlatmang (13-darsdagi XSS qoidasi). U faqat **siz yozgan** HTML uchun.

---

## 🗑️ O'chirish

\`\`\`javascript
element.remove();               // zamonaviy, sodda

container.innerHTML = '';       // hamma bolalarni tozalash
\`\`\`

---

## 🔑 Eng muhim naqsh: ma'lumot → render

Bu — bu darsning asosiy g'oyasi va u 4-oyning butun qolgan qismida ishlatiladi.

**Noto'g'ri yondashuv** — DOM'ni to'g'ridan-to'g'ri o'zgartirish:

\`\`\`javascript
// Har amalda DOM bilan alohida ishlash — chalkash bo'lib ketadi
tugma.addEventListener('click', () => {
  const li = document.createElement('li');
  royxat.appendChild(li);
});
ochirTugma.addEventListener('click', () => {
  li.remove();
});
\`\`\`

**To'g'ri yondashuv** — ma'lumotni saqlash, DOM'ni **qayta chizish**:

\`\`\`javascript
let vazifalar = [];          // 1. MA'LUMOT

function render() {          // 2. MA'LUMOTDAN EKRAN YASASH
  royxat.innerHTML = '';
  vazifalar.forEach(v => {
    const li = document.createElement('li');
    li.textContent = v.matn;
    royxat.appendChild(li);
  });
}

// 3. Ma'lumotni o'zgartirib, render() chaqirish
vazifalar.push({ matn: "Yangi" });
render();
\`\`\`

> 💡 Siz buni 1-Modulning 35-darsida ko'rgansiz (hisoblagich). O'sha yerda bitta son edi, bu yerda massiv. Prinsip bir xil: **ma'lumot o'zgaradi → \`render()\` chaqiriladi**.
>
> React va boshqa zamonaviy vositalar shu g'oyaga qurilgan.

---

## 📝 To-do ro'yxati — to'liq

\`\`\`demo h=420 "Ma'lumot massivda saqlanadi"
<style>
  * { box-sizing: border-box; }
  body { font-family: sans-serif; font-size: 13px; margin: 0; padding: 14px; }

  .kirish { display: flex; gap: 8px; margin-bottom: 12px; }
  input {
    flex: 1; padding: 10px 12px; font-size: 13px;
    border: 2px solid #d1d5db; border-radius: 8px; outline: none;
  }
  input:focus { border-color: #6366f1; }
  .qosh {
    padding: 10px 18px; border: none; border-radius: 8px;
    background: #6366f1; color: white; font-size: 13px; cursor: pointer;
  }

  ul { list-style: none; padding: 0; margin: 0 0 10px; }
  li {
    display: flex; align-items: center; gap: 10px;
    background: #f9fafb; border: 1px solid #e5e7eb;
    padding: 9px 12px; border-radius: 8px; margin-bottom: 5px;
  }
  li span { flex: 1; cursor: pointer; }
  li.bajarilgan span { text-decoration: line-through; color: #9ca3af; }
  li button {
    background: none; border: none; color: #dc2626;
    cursor: pointer; font-size: 16px; padding: 0 4px;
  }

  .bosh { color: #9ca3af; font-style: italic; text-align: center; padding: 14px; }

  #holat {
    background: #1f2937; color: #d1d5db; border-radius: 8px; padding: 10px;
    font-family: monospace; font-size: 11px; line-height: 1.7;
  }
  .kalit { color: #93c5fd; }
</style>

<div class="kirish">
  <input id="inp" placeholder="Vazifa yozing va Enter bosing" />
  <button class="qosh" id="qosh">Qo'shish</button>
</div>

<ul id="royxat"></ul>

<div id="holat"></div>

<script>
  var vazifalar = [];

  var input = document.querySelector('#inp');
  var royxat = document.querySelector('#royxat');
  var holat = document.querySelector('#holat');

  function render() {
    royxat.innerHTML = '';

    if (vazifalar.length === 0) {
      royxat.innerHTML = '<div class="bosh">Vazifalar yo\\'q</div>';
    }

    for (var i = 0; i < vazifalar.length; i++) {
      var v = vazifalar[i];

      var li = document.createElement('li');
      if (v.bajarilgan) li.classList.add('bajarilgan');
      li.dataset.i = i;

      var span = document.createElement('span');
      span.textContent = v.matn;          // xavfsiz

      var och = document.createElement('button');
      och.textContent = '×';
      och.dataset.och = '1';

      li.appendChild(span);
      li.appendChild(och);
      royxat.appendChild(li);
    }

    // Ma'lumot holatini ko'rsatamiz
    var qatorlar = [];
    for (var j = 0; j < vazifalar.length; j++) {
      qatorlar.push('  { matn: "' + vazifalar[j].matn + '", bajarilgan: ' + vazifalar[j].bajarilgan + ' }');
    }
    holat.innerHTML = '<span class="kalit">vazifalar</span> = [<br />' +
                      qatorlar.join(',<br />') + (qatorlar.length ? '<br />' : '') + ']';
  }

  function qoshish() {
    var matn = input.value.trim();
    if (!matn) return;
    vazifalar.push({ matn: matn, bajarilgan: false });
    input.value = '';
    input.focus();
    render();
  }

  document.querySelector('#qosh').addEventListener('click', qoshish);
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') qoshish();
  });

  // Delegation — 14-darsdagi texnika
  royxat.addEventListener('click', function (e) {
    var li = e.target.closest('li');
    if (!li) return;
    var i = Number(li.dataset.i);

    if (e.target.dataset.och) {
      vazifalar.splice(i, 1);
    } else {
      vazifalar[i].bajarilgan = !vazifalar[i].bajarilgan;
    }
    render();
  });

  render();
</script>
\`\`\`

Pastdagi qora oynada **ma'lumot massivi** ko'rinib turadi. Vazifa qo'shsangiz yoki bajarilgan deb belgilasangiz — avval massiv o'zgaradi, keyin ekran qayta chiziladi.

Ikkita yangi narsa ishlatilgan:

- \`li.dataset.i = i\` — elementga **indeks** yozib qo'yiladi, keyin uni topish uchun
- \`e.target.closest('li')\` — bosilgan elementdan yuqoriga qarab eng yaqin \`li\` ni topadi

---

## 🥉 Bronze Topshiriq

Tugma bosilganda ro'yxatga yangi element qo'shilsin. Elementlar raqamlansin.

---

## 🥈 Silver Topshiriq

Har elementga × tugmasi qo'shing, u elementni o'chirsin.

Delegation ishlating — har elementga alohida listener emas.

---

## 🥇 Gold Topshiriq

To-do ro'yxati yasang:

- Ma'lumot **massivda** saqlansin
- \`render()\` funksiyasi massivdan ekranni yasasin
- Qo'shish, bajarilgan deb belgilash, o'chirish ishlasin
- Har amalda ma'lumot o'zgaradi, keyin \`render()\` chaqiriladi

> ⚠️ DOM'ni to'g'ridan-to'g'ri o'zgartirmang (masalan \`li.remove()\`). Massivdan o'chirib, qayta chizing. Farqni tushunish muhim.

---

## ✅ Dars Xulosa

- \`createElement\` → \`textContent\` → \`appendChild\` — **uch qadam**
- Uchinchi qadamsiz element ko'rinmaydi
- \`insertAdjacentHTML\` — to'rtta aniq pozitsiya
- \`element.remove()\` — o'chirish
- **Ma'lumot → render** naqshi — eng muhim g'oya
- \`dataset\` bilan elementga ma'lumot yozish
- \`closest()\` — yuqoriga qarab element topish

> 🚀 **Keyingi dars:** LocalStorage — ma'lumotni saqlash!
`,
    teacher: `
## 💡 O'qituvchi uchun

- **"Ma'lumot → render" naqshi** — bu darsning haqiqiy mavzusi. \`createElement\` shunchaki vosita. Agar bola bu naqshni tushunsa, React'ga o'tish oson bo'ladi; tushunmasa — qiynaladi.
- Uni 35-darsdagi hisoblagich bilan bog'lang: o'sha yerda bitta son edi (\`son\` → \`render()\`), bu yerda massiv (\`vazifalar\` → \`render()\`). Bir xil g'oya, kattaroq masshtab.
- **Uch qadam demosi** — "kod ishlayapti, lekin hech narsa chiqmayapti" muammosini oldini oladi. Bolalar \`appendChild\` ni unutadi va uzoq qidiradi. Demoni ko'rsating: 2-qadamdan keyin ham ekran bo'sh.
- **\`insertAdjacentHTML\` demosi** — to'rtta pozitsiya nomlarini yodlash qiyin. Tugmalarni bosib ko'rsating, joylashuvni ko'rish esda qoladi.
- To-do'da **ma'lumot massivi ko'rinib turishi** — bu ataylab qilingan. Bola ekran va ma'lumot orasidagi bog'lanishni ko'radi.

## 🗒 Notion'dagi tuzatishlar

**1. Apostrofli ID (yana)**

\`\`\`javascript
document.querySelector('#o\\'chirish')
\`\`\`

Bu — 14-darsdagi bir xil muammo. ID va class nomlarida apostrof ishlatmang.

**2. Gold topshiriqda \`localStorage\`**

Dark mode topshirig'i \`localStorage\` ishlatadi, lekin u **16-darsda** o'tiladi. Ya'ni bir dars oldin talab qilinmoqda.

Bu yerda Gold topshiriq **to-do ro'yxatiga** o'zgartirildi (bu darsning asosiy mavzusiga mos). Dark mode + localStorage 16-darsga qoldirildi.

**3. Demolarda \`localStorage\` ishlatilmadi** — kabinetdagi himoyalangan oynachada u bloklanadi. 16-darsda buni batafsil tushuntiraman.

## ⚠️ Ko'p uchraydigan xatolar

- **\`appendChild\` unutilgan** — element yaratilgan, lekin ko'rinmaydi. Eng ko'p uchraydigan.
- **\`createElement('<li>')\`** — burchakli qavs **kerak emas**: \`createElement('li')\`.
- **\`innerHTML += \`** tsikl ichida — har safar butun HTML qayta o'qiladi, sekin va listener'lar yo'qoladi.
- **\`innerHTML\` bilan foydalanuvchi matni** — XSS.
- **Indeks bilan o'chirishda tartib buzilishi** — massivdan o'chirgandan keyin qayta \`render()\` qilinmasa, indekslar siljib qoladi.
- **DOM'ni ham, massivni ham alohida o'zgartirish** — ikkalasi bir-biriga mos kelmay qoladi. Faqat massivni o'zgartiring, qolganini \`render()\` qiladi.

## 📊 Daraja belgilash

- **Bronze** — element qo'shiladi va ko'rinadi
- **Silver** — o'chirish ishlaydi, delegation qo'llangan
- **Gold** — ma'lumot massivda, \`render()\` naqshi to'g'ri

> Gold'ni tekshirishning aniq usuli: kodda \`li.remove()\` bormi? Bo'lsa — DOM to'g'ridan-to'g'ri o'zgartirilgan, naqsh buzilgan.
`,
  },

  // ═══════════════════════════════════════════════════════════
  'junior.m2.l16': {
    goal: "Brauzerda ma'lumot saqlash: setItem, getItem va JSON bilan obyekt saqlash.",
    student: `
## 💾 Muammo

Hozirgacha yozgan barcha dasturlaringizda bitta kamchilik bor: **sahifani yangilasangiz hamma narsa yo'qoladi**.

To-do ro'yxati, hisoblagich, o'yin balli — hammasi \`F5\` bosilganda nolga qaytadi.

\`localStorage\` shuni hal qiladi.

---

## 🔧 To'rtta metod

\`\`\`javascript
localStorage.setItem('ism', 'Ahmadjon');   // saqlash
localStorage.getItem('ism');               // o'qish → "Ahmadjon"
localStorage.removeItem('ism');            // o'chirish
localStorage.clear();                      // hammasini tozalash
\`\`\`

Ma'lumot **brauzerda**, foydalanuvchi kompyuterida saqlanadi. Brauzer yopilsa ham qoladi.

\`\`\`demo h=420 "Saqlash va o'qish"
<style>
  body { font-family: sans-serif; font-size: 13px; margin: 0; padding: 14px; }

  .qator { display: flex; gap: 6px; margin-bottom: 8px; }
  input {
    flex: 1; padding: 8px 10px; font-size: 12px;
    border: 2px solid #d1d5db; border-radius: 7px; outline: none;
  }
  input:focus { border-color: #6366f1; }
  button {
    padding: 8px 12px; border: none; border-radius: 7px;
    font-size: 11px; cursor: pointer; color: white; font-family: monospace;
  }
  .saq { background: #16a34a; }
  .oqi { background: #6366f1; }
  .och { background: #dc2626; }
  .toz { background: #9ca3af; }

  #xotira {
    background: #1f2937; border-radius: 8px; padding: 12px;
    font-family: monospace; font-size: 12px; line-height: 1.9;
    color: #d1d5db; min-height: 100px; margin: 12px 0;
  }
  .kalit { color: #93c5fd; }
  .qiymat { color: #fbbf24; }
  .bosh { color: #6b7280; font-style: italic; }

  #natija {
    background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px;
    padding: 10px; font-family: monospace; font-size: 12px; color: #065f46;
    min-height: 38px;
  }
</style>

<div class="qator">
  <input id="kalit" placeholder="kalit" value="ism" style="max-width:110px" />
  <input id="qiymat" placeholder="qiymat" value="Ahmadjon" />
</div>

<div class="qator">
  <button class="saq" id="saqla">setItem</button>
  <button class="oqi" id="oqi">getItem</button>
  <button class="och" id="ochir">removeItem</button>
  <button class="toz" id="tozala">clear</button>
</div>

<div id="xotira"></div>
<div id="natija">Natija shu yerda chiqadi</div>

<script>
  // Himoyalangan oynachada localStorage bloklanadi.
  // Shuning uchun zaxira variant ishlatamiz — API bir xil qoladi.
  var zaxira = {};
  var haqiqiy = true;
  try {
    localStorage.setItem('__test__', '1');
    localStorage.removeItem('__test__');
  } catch (e) {
    haqiqiy = false;
  }

  var xotira = {
    setItem: function (k, v) {
      if (haqiqiy) localStorage.setItem(k, String(v));
      else zaxira[k] = String(v);
    },
    getItem: function (k) {
      if (haqiqiy) return localStorage.getItem(k);
      return k in zaxira ? zaxira[k] : null;
    },
    removeItem: function (k) {
      if (haqiqiy) localStorage.removeItem(k);
      else delete zaxira[k];
    },
    clear: function () {
      if (haqiqiy) localStorage.clear();
      else zaxira = {};
    },
    hammasi: function () {
      if (!haqiqiy) return zaxira;
      var obj = {};
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        obj[k] = localStorage.getItem(k);
      }
      return obj;
    }
  };

  var kalitEl = document.querySelector('#kalit');
  var qiymatEl = document.querySelector('#qiymat');
  var xotiraEl = document.querySelector('#xotira');
  var natijaEl = document.querySelector('#natija');

  function render() {
    var hammasi = xotira.hammasi();
    var kalitlar = Object.keys(hammasi);

    if (kalitlar.length === 0) {
      xotiraEl.innerHTML = '<span class="bosh">Xotira bo\\'sh</span>';
      return;
    }

    var html = '';
    for (var i = 0; i < kalitlar.length; i++) {
      html += '<span class="kalit">"' + kalitlar[i] + '"</span> : ' +
              '<span class="qiymat">"' + hammasi[kalitlar[i]] + '"</span><br />';
    }
    xotiraEl.innerHTML = html;
  }

  document.querySelector('#saqla').addEventListener('click', function () {
    xotira.setItem(kalitEl.value, qiymatEl.value);
    natijaEl.textContent = 'setItem("' + kalitEl.value + '", "' + qiymatEl.value + '")';
    render();
  });

  document.querySelector('#oqi').addEventListener('click', function () {
    var v = xotira.getItem(kalitEl.value);
    natijaEl.textContent = 'getItem("' + kalitEl.value + '") → ' +
                           (v === null ? 'null' : '"' + v + '"');
    render();
  });

  document.querySelector('#ochir').addEventListener('click', function () {
    xotira.removeItem(kalitEl.value);
    natijaEl.textContent = 'removeItem("' + kalitEl.value + '")';
    render();
  });

  document.querySelector('#tozala').addEventListener('click', function () {
    xotira.clear();
    natijaEl.textContent = 'clear()';
    render();
  });

  render();
</script>
\`\`\`

Mavjud bo'lmagan kalitni o'qishga urining — \`getItem\` **\`null\`** qaytaradi.

> ⚠️ **Kabinetdagi demo haqida.** Bu oynacha himoyalangan muhitda ishlaydi va u yerda haqiqiy \`localStorage\` bloklangan. Shuning uchun demo zaxira variantga o'tadi — API bir xil, lekin ma'lumot sahifa yopilganda yo'qoladi.
>
> **O'z kompyuteringizda sinang:** HTML fayl yarating, kod yozing, sahifani yangilang. Ma'lumot qolganini ko'rasiz.

---

## ⚠️ localStorage faqat MATN saqlaydi

Bu — eng muhim qoida.

\`\`\`demo h=380 "Son, massiv, obyekt saqlaganda nima bo'ladi"
<style>
  body { font-family: sans-serif; font-size: 12px; margin: 0; padding: 14px; }
  table { width: 100%; border-collapse: collapse; }
  th, td { padding: 7px 8px; text-align: left; font-family: monospace; font-size: 11px; }
  thead { background: #f8f9fa; }
  th { font-size: 10px; text-transform: uppercase; color: #6c757d; letter-spacing: 1px; }
  td { border-top: 1px solid #f0f0f0; }
  .xato { color: #dc2626; font-weight: 700; }
  .ok { color: #16a34a; font-weight: 700; }
  .izoh { font-size: 11px; color: #9ca3af; margin-top: 12px; line-height: 1.7; }
</style>

<table>
  <thead>
    <tr><th>Saqlangan</th><th>Qaytgan qiymat</th><th>typeof</th></tr>
  </thead>
  <tbody id="jadval"></tbody>
</table>

<p class="izoh">
  🔴 = tur o'zgarib ketdi &nbsp;·&nbsp; 🟢 = tur saqlandi (JSON tufayli)
</p>

<script>
  var xotira = {};

  function saqla(k, v) { xotira[k] = String(v); }
  function ol(k) { return k in xotira ? xotira[k] : null; }

  var jadval = document.querySelector('#jadval');
  var html = '';

  function qator(kirish, qaytgan, turi, yaxshi) {
    var klass = yaxshi ? 'ok' : 'xato';
    var belgi = yaxshi ? ' 🟢' : ' 🔴';
    html += '<tr><td>' + kirish + '</td>' +
            '<td class="' + klass + '">' + qaytgan + belgi + '</td>' +
            '<td>' + turi + '</td></tr>';
  }

  // Oddiy saqlash — tur yo'qoladi
  saqla('son', 42);
  var son = ol('son');
  qator('setItem("son", 42)', '"' + son + '"', typeof son, false);

  saqla('mantiq', true);
  var m = ol('mantiq');
  qator('setItem("mantiq", true)', '"' + m + '"', typeof m, false);

  saqla('massiv', [1, 2, 3]);
  var mas = ol('massiv');
  qator('setItem("massiv", [1,2,3])', '"' + mas + '"', typeof mas, false);

  saqla('obyekt', { ism: 'Ali' });
  var ob = ol('obyekt');
  qator('setItem("obyekt", {ism:"Ali"})', '"' + ob + '"', typeof ob, false);

  // JSON bilan — tur saqlanadi
  xotira['json'] = JSON.stringify({ ism: 'Ali', yosh: 20 });
  var j = JSON.parse(xotira['json']);
  qator('JSON.stringify({...})', JSON.stringify(j), typeof j, true);

  xotira['jmas'] = JSON.stringify([1, 2, 3]);
  var jm = JSON.parse(xotira['jmas']);
  qator('JSON.stringify([1,2,3])', JSON.stringify(jm) + ' (massiv)', typeof jm, true);

  jadval.innerHTML = html;
</script>
\`\`\`

To'rtinchi qatorga diqqat qiling: obyekt saqlasangiz **\`"[object Object]"\`** degan foydasiz matn chiqadi. Ma'lumot butunlay yo'qoladi.

---

## 📦 JSON — yechim

\`\`\`javascript
// Saqlashda — obyektni matnga aylantiramiz
const user = { ism: 'Aziz', yosh: 20, premium: true };
localStorage.setItem('user', JSON.stringify(user));

// O'qishda — matnni obyektga qaytaramiz
const saqlangan = localStorage.getItem('user');
const tiklangan = JSON.parse(saqlangan);

tiklangan.ism;      // 'Aziz'
tiklangan.premium;  // true  ← boolean tiklandi
\`\`\`

| Funksiya | Nima qiladi |
| --- | --- |
| \`JSON.stringify(obj)\` | Obyekt/massiv → **matn** |
| \`JSON.parse(matn)\` | Matn → **obyekt/massiv** |

---

## 🔒 \`null\` va nozik xato

\`getItem\` mavjud bo'lmagan kalitda **\`null\`** qaytaradi. Buni tekshirish shart:

\`\`\`javascript
// ❌ Xato — birinchi ochilishda yiqiladi
const vazifalar = JSON.parse(localStorage.getItem('vazifalar'));
vazifalar.push(...);      // TypeError: null.push is not a function

// ✅ To'g'ri
const saqlangan = localStorage.getItem('vazifalar');
const vazifalar = saqlangan ? JSON.parse(saqlangan) : [];
\`\`\`

Qulay yordamchi funksiyalar yozish odat:

\`\`\`javascript
function saqla(kalit, qiymat) {
  localStorage.setItem(kalit, JSON.stringify(qiymat));
}

function ol(kalit, standart = null) {
  try {
    const q = localStorage.getItem(kalit);
    return q === null ? standart : JSON.parse(q);
  } catch {
    return standart;
  }
}
\`\`\`

> ⚠️ **Nozik xatoga diqqat.** Ko'p darsliklarda \`ol\` funksiyasi shunday yoziladi:
>
> \`\`\`javascript
> const ol = (k, d) => JSON.parse(localStorage.getItem(k)) || d;
> \`\`\`
>
> Bu **noto'g'ri**. Agar saqlangan qiymat \`0\` yoki \`false\` bo'lsa, ular **falsy** va \`|| d\` ularni standart qiymatga almashtirib yuboradi.
>
> Masalan o'yin balli \`0\` bo'lsa — dastur uni "saqlanmagan" deb hisoblaydi.
>
> Bu — 8-darsda ko'rgan **\`||\` va \`??\`** muammosining aynan o'zi. Yechim: \`null\` ni **aniq tekshirish** (yuqoridagi variantdagi kabi) yoki \`??\` ishlatish.

---

## 📝 To-do + saqlash

\`\`\`demo h=420 "Vazifalar saqlanadi"
<style>
  * { box-sizing: border-box; }
  body { font-family: sans-serif; font-size: 13px; margin: 0; padding: 14px; }

  .kirish { display: flex; gap: 8px; margin-bottom: 10px; }
  input {
    flex: 1; padding: 9px 12px; font-size: 13px;
    border: 2px solid #d1d5db; border-radius: 8px; outline: none;
  }
  input:focus { border-color: #6366f1; }
  .qosh {
    padding: 9px 16px; border: none; border-radius: 8px;
    background: #6366f1; color: white; font-size: 12px; cursor: pointer;
  }

  ul { list-style: none; padding: 0; margin: 0 0 10px; }
  li {
    display: flex; align-items: center; gap: 10px;
    background: #f9fafb; border: 1px solid #e5e7eb;
    padding: 8px 12px; border-radius: 8px; margin-bottom: 4px; font-size: 12px;
  }
  li span { flex: 1; cursor: pointer; }
  li.bajarilgan span { text-decoration: line-through; color: #9ca3af; }
  li button { background: none; border: none; color: #dc2626; cursor: pointer; font-size: 15px; }

  .bosh { color: #9ca3af; font-style: italic; text-align: center; padding: 12px; font-size: 12px; }

  #saqlangan {
    background: #1f2937; color: #d1d5db; border-radius: 8px; padding: 10px;
    font-family: monospace; font-size: 10px; line-height: 1.6;
    word-break: break-all; min-height: 50px;
  }
  .lbl { font-size: 11px; color: #6b7280; font-family: monospace; margin: 0 0 4px; }
</style>

<div class="kirish">
  <input id="inp" placeholder="Vazifa yozing" />
  <button class="qosh" id="qosh">Qo'shish</button>
</div>

<ul id="royxat"></ul>

<p class="lbl">localStorage ichida nima yotibdi:</p>
<div id="saqlangan"></div>

<script>
  // Zaxira bilan xotira (himoyalangan oynacha uchun)
  var zaxira = {};
  var haqiqiy = true;
  try {
    localStorage.setItem('__t__', '1');
    localStorage.removeItem('__t__');
  } catch (e) { haqiqiy = false; }

  function xSet(k, v) { haqiqiy ? localStorage.setItem(k, v) : (zaxira[k] = v); }
  function xGet(k) { return haqiqiy ? localStorage.getItem(k) : (k in zaxira ? zaxira[k] : null); }

  function saqla(kalit, qiymat) {
    xSet(kalit, JSON.stringify(qiymat));
  }

  function ol(kalit, standart) {
    try {
      var q = xGet(kalit);
      return q === null ? standart : JSON.parse(q);
    } catch (e) {
      return standart;
    }
  }

  // Sahifa ochilganda yuklash
  var vazifalar = ol('vazifalar', []);

  var input = document.querySelector('#inp');
  var royxat = document.querySelector('#royxat');
  var saqlanganEl = document.querySelector('#saqlangan');

  function render() {
    royxat.innerHTML = '';

    if (vazifalar.length === 0) {
      royxat.innerHTML = '<div class="bosh">Vazifalar yo\\'q</div>';
    }

    for (var i = 0; i < vazifalar.length; i++) {
      var li = document.createElement('li');
      if (vazifalar[i].bajarilgan) li.classList.add('bajarilgan');
      li.dataset.i = i;

      var span = document.createElement('span');
      span.textContent = vazifalar[i].matn;

      var och = document.createElement('button');
      och.textContent = '×';
      och.dataset.och = '1';

      li.appendChild(span);
      li.appendChild(och);
      royxat.appendChild(li);
    }

    saqla('vazifalar', vazifalar);
    saqlanganEl.textContent = xGet('vazifalar') || '(bo\\'sh)';
  }

  function qoshish() {
    var matn = input.value.trim();
    if (!matn) return;
    vazifalar.push({ matn: matn, bajarilgan: false });
    input.value = '';
    input.focus();
    render();
  }

  document.querySelector('#qosh').addEventListener('click', qoshish);
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') qoshish();
  });

  royxat.addEventListener('click', function (e) {
    var li = e.target.closest('li');
    if (!li) return;
    var i = Number(li.dataset.i);

    if (e.target.dataset.och) vazifalar.splice(i, 1);
    else vazifalar[i].bajarilgan = !vazifalar[i].bajarilgan;

    render();
  });

  render();
</script>
\`\`\`

Pastdagi qora oynada \`localStorage\` ichidagi **haqiqiy matn** ko'rinib turadi — \`JSON.stringify\` natijasi.

Naqsh o'zgarmadi (15-dars): **ma'lumot o'zgaradi → \`render()\`**. Faqat \`render()\` ichiga bitta qator qo'shildi — \`saqla(...)\`.

---

## 🆚 sessionStorage va localStorage

| | \`localStorage\` | \`sessionStorage\` |
| --- | --- | --- |
| Muddati | **Cheksiz** | Tab yopilguncha |
| Boshqa tabda | Ko'rinadi | Ko'rinmaydi |
| Hajmi | ~5 MB | ~5 MB |

API **bir xil** — \`setItem\`, \`getItem\`, \`removeItem\`.

> ⚠️ **Muhim xavfsizlik qoidasi:** \`localStorage\` ga **parol, bank kartasi yoki maxfiy ma'lumot yozmang**. Uni har qanday JavaScript o'qiy oladi — shu jumladan saytga kirib qolgan zararli kod (13-darsdagi XSS).

---

## 🥉 Bronze Topshiriq

Input va ikkita tugma: "Saqlash" va "Yuklash". Kiritilgan matn saqlansin, sahifa yangilanganda tiklansin.

---

## 🥈 Silver Topshiriq

Massiv saqlang:

- Ro'yxatga element qo'shiladi
- \`JSON.stringify\` bilan saqlanadi
- Sahifa ochilganda \`JSON.parse\` bilan tiklanadi
- \`null\` holati **to'g'ri** tekshirilgan bo'lsin

---

## 🥇 Gold Topshiriq

To-do ro'yxatiga saqlashni qo'shing:

- \`saqla\` va \`ol\` yordamchi funksiyalari yozilgan
- \`ol\` funksiyasida \`|| standart\` **ishlatilmagan** (yuqoridagi xatoga tushmang)
- Sahifani yangilaganda vazifalar joyida qoladi
- Qorong'i rejim tanlovi ham saqlansin

> ⚠️ O'zgaruvchi nomlarida apostrof ishlatmang: \`oyinFaol\`, \`o'yin_faol\` emas.

---

## ✅ Dars Xulosa

- \`setItem\` / \`getItem\` / \`removeItem\` / \`clear\`
- **Faqat matn saqlaydi** — obyekt \`"[object Object]"\` bo'lib qoladi
- \`JSON.stringify\` saqlashda, \`JSON.parse\` o'qishda
- \`getItem\` mavjud bo'lmasa **\`null\`** qaytaradi
- \`|| standart\` **ishlatmang** — \`0\` va \`false\` yo'qoladi
- \`sessionStorage\` — tab yopilguncha
- **Maxfiy ma'lumot saqlamang**

> 🚀 **Keyingi dars:** Fetch API — internetdan ma'lumot olish!
`,
    teacher: `
## ⚠️ Kabinetdagi demolar haqida

Kabinetdagi jonli demolar **himoyalangan oynachada** (sandboxed iframe) ishlaydi va u yerda \`localStorage\` xavfsizlik sababli **bloklanadi**.

Shuning uchun bu darsdagi demolar shunday yozildi:

\`\`\`javascript
try {
  localStorage.setItem('__test__', '1');
  localStorage.removeItem('__test__');
} catch (e) {
  haqiqiy = false;   // zaxira variantga o'tamiz
}
\`\`\`

API bir xil qoladi, faqat ma'lumot vaqtinchalik bo'ladi.

**Bu — shunchaki chora emas.** Bu naqsh haqiqiy loyihalarda ham kerak: \`localStorage\` maxfiy rejimda, to'lgan xotirada yoki ba'zi brauzer sozlamalarida **xato tashlaydi**. Professional kod uni \`try/catch\` ga o'raydi.

**Bolalarga albatta ayting:** \`localStorage\` ni o'z kompyuterlarida, haqiqiy HTML faylda sinab ko'rishsin. Sahifani yangilab, ma'lumot qolganini ko'rish — bu darsning eng ta'sirli lahzasi.

---

## ⚠️ Notion'dagi nozik mantiqiy xato

Utility funksiya shunday yozilgan:

\`\`\`javascript
const olish = (k, d = null) => JSON.parse(localStorage.getItem(k)) || d;
\`\`\`

Bu **ko'p hollarda ishlaydi**, lekin ikkita holatda buziladi:

- Saqlangan qiymat \`0\` bo'lsa → \`0 || d\` → **\`d\`** qaytadi
- Saqlangan qiymat \`false\` bo'lsa → \`false || d\` → **\`d\`** qaytadi

Amalda bu nimani anglatadi: o'yinchining balli \`0\` bo'lsa, dastur uni "saqlanmagan" deb hisoblaydi va standart qiymatni qo'yadi. Yoki qorong'i rejim \`false\` qilib saqlangan bo'lsa, u har safar yoqilib ketadi.

Bunday xatolarni topish **juda qiyin**, chunki kod 90% holatda to'g'ri ishlaydi.

Bu — **8-darsdagi \`||\` va \`??\` mavzusining aynan o'zi**. Darsda shu bog'lanish ochiq ko'rsatildi.

To'g'ri variant:

\`\`\`javascript
return q === null ? standart : JSON.parse(q);
\`\`\`

Notion'dagi asl kodni tuzatish kerak.

---

## ⚠️ Notion'dagi boshqa xatolar

**1. Apostrofli o'zgaruvchi (yana):**

\`\`\`javascript
let o'yin_faol = false;
\`\`\`

Kliker o'yinida to'rt joyda ishlatilgan — hammasi sintaksis xatosi.

**2. \`onclick="toggle(\${i})"\` innerHTML ichida**

Bu usul global funksiyalarga tayanadi va 14-darsdagi \`addEventListener\` tamoyiliga zid. Bu yerda delegation bilan yozildi.

**3. \`alert()\`** — sandboxda ko'rinmaydi.

---

## 💡 O'qituvchi uchun

- **"\`[object Object]\`" demosi** — bu darsning eng kerakli qismi. Bolalar obyekt saqlaydi, keyin o'qiydi va foydasiz matn chiqadi. Nima bo'lganini tushunmaydi. Jadvalda buni oldindan ko'rsating.
- To-do demosida **saqlangan matn ko'rinib turishi** — ataylab. Bola \`JSON.stringify\` natijasi qanday ko'rinishini ko'radi va JSON "sehr" emasligini tushunadi.
- \`|| standart\` xatosini **amalda ko'rsating**: o'yin balli \`0\` bo'lgan holatni sinang. Kod noto'g'ri ishlaganini ko'rgan bola \`??\` ni eslab qoladi.
- **Maxfiy ma'lumot** haqidagi qoidani jiddiy o'ting. 3-Modulda Firebase bilan ishlashadi va o'sha yerda bu bilim kerak bo'ladi.

## ⚠️ Ko'p uchraydigan xatolar

- **\`JSON.parse\` unutilgan** — massiv o'rniga matn keladi, \`.push\` ishlamaydi.
- **\`JSON.stringify\` unutilgan** — \`"[object Object]"\`.
- **\`null\` tekshirilmagan** — birinchi ochilishda \`TypeError\`.
- **\`|| standart\`** — yuqorida.
- **Har o'zgarishda saqlanmagan** — \`render()\` ichiga \`saqla()\` qo'shilmagan.
- **Kalit nomi har joyda boshqacha** — \`'vazifalar'\` va \`'vazifa'\`. O'zgaruvchiga chiqarish kerak.
- **Nomda apostrof.**

## 📊 Daraja belgilash

- **Bronze** — matn saqlanadi va sahifa yangilanganda tiklanadi
- **Silver** — massiv JSON bilan saqlanadi, null to'g'ri tekshirilgan
- **Gold** — to-do to'liq saqlanadi, \`|| standart\` ishlatilmagan

> Gold'ni tekshirish: kodda \`|| []\` yoki \`|| {}\` bormi? Bo'lsa — nozik xato qolgan.
`,
  },

  // ═══════════════════════════════════════════════════════════
  'junior.m2.l18': {
    goal: "fetch() bilan tashqi API dan ma'lumot olish, async/await va xatolarni boshqarish.",
    student: `
## 🌐 API nima?

Hozirgacha barcha ma'lumot **sizning kodingizda** yozilgan edi. Haqiqiy saytlarda esa u **serverdan** keladi.

\`\`\`text
Brauzer  →  So'rov (request)   →  Server
Brauzer  ←  Javob (response)   ←  Server
\`\`\`

**API** — server bilan gaplashish qoidalari. Siz so'rov yuborasiz, u JSON qaytaradi.

| Metod | Nima qiladi |
| --- | --- |
| \`GET\` | Ma'lumot olish |
| \`POST\` | Yangi ma'lumot yuborish |
| \`PUT\` / \`PATCH\` | O'zgartirish |
| \`DELETE\` | O'chirish |

Bu darsda faqat \`GET\` bilan ishlaymiz.

---

## ⏳ Asosiy muammo: javob darhol kelmaydi

Server javob berishi uchun vaqt kerak — 0.1 soniyadan bir necha soniyagacha. JavaScript esa kutib turmaydi, u keyingi qatorga o'tadi.

\`\`\`javascript
// ❌ Bu ishlamaydi
const data = fetch(url);
console.log(data);    // Promise { <pending> } — ma'lumot emas!
\`\`\`

Shuning uchun **\`await\`** kerak — "javob kelguncha kut" degani:

\`\`\`javascript
// ✅ To'g'ri
async function olish() {
  const response = await fetch(url);    // javobni kutamiz
  const data = await response.json();   // JSON'ga aylantirishni ham
  console.log(data);
}
\`\`\`

\`await\` faqat \`async\` funksiya ichida ishlaydi. Ikkalasi juft yuradi.

> ⚠️ **Ikkita \`await\` kerak.** Birinchisi javobni kutadi, ikkinchisi uni JSON'ga aylantirishni kutadi. Ko'p bolalar ikkinchisini unutadi va \`Promise\` oladi.

---

## 🔄 Uch holat — eng muhim tushuncha

Har qanday so'rovning **uchta** holati bor va uchalasini ham ko'rsatish kerak:

1. **Yuklanmoqda** — so'rov ketdi, javob kutilmoqda
2. **Muvaffaqiyat** — ma'lumot keldi
3. **Xato** — internet yo'q, server ishlamayapti, manzil noto'g'ri

Ko'p boshlovchilar faqat ikkinchisini yozadi. Natijada foydalanuvchi bo'sh ekranga qarab o'tiradi va nima bo'layotganini bilmaydi.

\`\`\`demo h=420 "Uch holatni sinab ko'ring"
<style>
  * { box-sizing: border-box; }
  body { font-family: sans-serif; font-size: 13px; margin: 0; padding: 14px; }

  .tugmalar { display: flex; gap: 6px; margin-bottom: 12px; flex-wrap: wrap; }
  button {
    padding: 8px 14px; border: none; border-radius: 8px;
    font-size: 12px; cursor: pointer; color: white;
  }
  .ok { background: #16a34a; }
  .sekin { background: #f59e0b; }
  .xato { background: #dc2626; }

  #maydon {
    border: 1px solid #e5e7eb; border-radius: 10px;
    padding: 14px; min-height: 190px;
  }

  .yuklanmoqda { text-align: center; padding: 40px 0; color: #6b7280; }
  .spinner {
    width: 32px; height: 32px; margin: 0 auto 10px;
    border: 3px solid #e5e7eb; border-top-color: #6366f1;
    border-radius: 50%; animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .xato-quti {
    background: #fef2f2; border: 1px solid #fecaca; color: #991b1b;
    border-radius: 8px; padding: 14px; text-align: center;
  }

  .karta {
    background: #f9fafb; border: 1px solid #e5e7eb;
    border-radius: 8px; padding: 10px; margin-bottom: 6px;
  }
  .karta h4 { margin: 0 0 4px; font-size: 13px; color: #1f2937; }
  .karta p { margin: 0; font-size: 12px; color: #6b7280; }
</style>

<div class="tugmalar">
  <button class="ok" id="tez">Tez javob (0.6s)</button>
  <button class="sekin" id="sekin">Sekin javob (2.5s)</button>
  <button class="xato" id="xato">Xato holati</button>
</div>

<div id="maydon">
  <p style="color:#9ca3af;text-align:center;padding:40px 0">
    Tugmalardan birini bosing
  </p>
</div>

<script>
  var maydon = document.querySelector('#maydon');

  // Soxta API — haqiqiy fetch o'rniga taqlid.
  // Bu bizga XATO holatini ham ataylab chaqirish imkonini beradi.
  function soxtaSorov(kechikish, xatoBoladimi) {
    return new Promise(function (bajar, rad) {
      setTimeout(function () {
        if (xatoBoladimi) {
          rad(new Error('Serverga ulanib bo\\'lmadi (500)'));
        } else {
          bajar([
            { title: 'Birinchi maqola', body: 'Serverdan kelgan ma\\'lumot.' },
            { title: 'Ikkinchi maqola', body: 'Bu ham API javobi.' },
            { title: 'Uchinchi maqola', body: 'JSON formatida keladi.' }
          ]);
        }
      }, kechikish);
    });
  }

  async function yukla(kechikish, xatoBoladimi) {
    // 1. YUKLANMOQDA holati
    maydon.innerHTML = '<div class="yuklanmoqda"><div class="spinner"></div>Yuklanmoqda...</div>';

    try {
      var malumot = await soxtaSorov(kechikish, xatoBoladimi);

      // 2. MUVAFFAQIYAT holati
      var html = '';
      for (var i = 0; i < malumot.length; i++) {
        html += '<div class="karta"><h4></h4><p></p></div>';
      }
      maydon.innerHTML = html;

      var kartalar = maydon.querySelectorAll('.karta');
      for (var j = 0; j < malumot.length; j++) {
        kartalar[j].querySelector('h4').textContent = malumot[j].title;
        kartalar[j].querySelector('p').textContent = malumot[j].body;
      }

    } catch (xato) {
      // 3. XATO holati
      maydon.innerHTML = '<div class="xato-quti"><b>Xato yuz berdi</b><br />' +
                         '<span style="font-size:12px"></span></div>';
      maydon.querySelector('span').textContent = xato.message;
    }
  }

  document.querySelector('#tez').addEventListener('click', function () { yukla(600, false); });
  document.querySelector('#sekin').addEventListener('click', function () { yukla(2500, false); });
  document.querySelector('#xato').addEventListener('click', function () { yukla(1200, true); });
</script>
\`\`\`

"Sekin javob" ni bosing — spinner 2.5 soniya aylanadi. Foydalanuvchi sayt **ishlayotganini** biladi.

"Xato holati" ni bosing — tushunarli xabar chiqadi, bo'sh ekran emas.

> 💡 Bu demo **soxta API** ishlatadi — haqiqiy \`fetch\` o'rniga \`setTimeout\`. Sabab: xato holatini ataylab chaqirish uchun. Haqiqiy serverni xato beradigan qilish oson emas.
>
> Kodning tuzilishi esa bir xil: \`try\` / \`await\` / \`catch\`.

---

## 📡 Haqiqiy fetch

\`\`\`javascript
async function postlarniYukla() {
  const yuklanmoqda = document.querySelector('#yuklanmoqda');
  const xatoEl = document.querySelector('#xato');
  const royxat = document.querySelector('#royxat');

  yuklanmoqda.style.display = 'block';
  xatoEl.style.display = 'none';
  royxat.innerHTML = '';

  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');

    if (!res.ok) {
      throw new Error('HTTP xato: ' + res.status);
    }

    const data = await res.json();

    data.forEach(post => {
      const div = document.createElement('div');
      div.textContent = post.title;      // xavfsiz
      royxat.appendChild(div);
    });

  } catch (error) {
    xatoEl.style.display = 'block';
    xatoEl.textContent = 'Xato: ' + error.message;

  } finally {
    yuklanmoqda.style.display = 'none';   // har holatda bajariladi
  }
}
\`\`\`

Uchta muhim nuqta:

**1. \`res.ok\` ni tekshiring**

\`fetch\` server \`404\` yoki \`500\` qaytarganda ham **xato tashlamaydi**. U faqat internet uzilganda tashlaydi. Shuning uchun \`res.ok\` ni qo'lda tekshirish kerak.

**2. \`finally\` — har doim ishlaydi**

Muvaffaqiyat bo'ldimi, xato bo'ldimi — \`finally\` baribir bajariladi. Spinner'ni o'chirish uchun ideal joy.

**3. \`textContent\`, \`innerHTML\` emas**

API'dan kelgan ma'lumot — bu **begona ma'lumot**. Uni \`innerHTML\` ga qo'ysangiz, XSS xavfi bor (13-dars). \`textContent\` ishlating.

---

## 🧪 Bepul API'lar

Mashq qilish uchun ro'yxatdan o'tish talab qilmaydiganlari:

\`\`\`javascript
// Test ma'lumotlar — postlar, foydalanuvchilar, rasmlar
'https://jsonplaceholder.typicode.com/posts'
'https://jsonplaceholder.typicode.com/users'

// Ism bo'yicha yosh taxmini
'https://api.agify.io/?name=ali'

// Tasodifiy foydalanuvchi
'https://randomuser.me/api/?results=6'

// Kripto narxlari
'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'
\`\`\`

Har birini brauzer manzil qatoriga yozib ochib ko'ring — JSON javobini ko'rasiz.

> 💡 Ba'zi API'lar **kalit** (API key) talab qiladi, masalan ob-havo xizmatlari. Kalitni **kodga yozmang** — u GitHub'ga tushadi va kimdir ishlatishi mumkin. Buni 3-Modulda batafsil o'rganasiz.

---

## 🔍 Qidiruv — jonli misol

\`\`\`demo h=400 "Ism kiriting"
<style>
  * { box-sizing: border-box; }
  body { font-family: sans-serif; font-size: 13px; margin: 0; padding: 14px; text-align: center; }

  .kirish { display: flex; gap: 8px; margin-bottom: 16px; }
  input {
    flex: 1; padding: 10px 12px; font-size: 13px;
    border: 2px solid #d1d5db; border-radius: 8px; outline: none;
  }
  input:focus { border-color: #6366f1; }
  button {
    padding: 10px 18px; border: none; border-radius: 8px;
    background: #6366f1; color: white; font-size: 13px; cursor: pointer;
  }
  button:disabled { background: #d1d5db; cursor: not-allowed; }

  #natija { min-height: 130px; display: flex; align-items: center; justify-content: center; }

  .spinner {
    width: 30px; height: 30px;
    border: 3px solid #e5e7eb; border-top-color: #6366f1;
    border-radius: 50%; animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .javob .ism { font-size: 15px; color: #6b7280; }
  .javob .yosh { font-size: 46px; font-weight: 700; color: #6366f1; line-height: 1.1; }
  .javob .izoh { font-size: 11px; color: #9ca3af; }

  .xato { color: #991b1b; font-size: 13px; }
</style>

<div class="kirish">
  <input id="ism" placeholder="Ism kiriting (masalan: Aziz)" value="Aziz" />
  <button id="btn">Tekshirish</button>
</div>

<div id="natija">
  <span style="color:#9ca3af">Natija shu yerda chiqadi</span>
</div>

<script>
  // Soxta ma'lumotlar bazasi — demo uchun
  var bazaYosh = { aziz: 34, malika: 29, sardor: 41, zilola: 26, bobur: 37 };

  function soxtaAgify(ism) {
    return new Promise(function (bajar, rad) {
      setTimeout(function () {
        var kalit = ism.toLowerCase();
        if (kalit === 'xato') {
          rad(new Error('Serverga ulanib bo\\'lmadi'));
          return;
        }
        // Noma'lum ism uchun tasodifiy yosh
        var yosh = bazaYosh[kalit] || (20 + Math.floor(Math.random() * 30));
        bajar({ name: ism, age: yosh });
      }, 900);
    });
  }

  var input = document.querySelector('#ism');
  var btn = document.querySelector('#btn');
  var natija = document.querySelector('#natija');

  async function tekshir() {
    var ism = input.value.trim();
    if (!ism) return;

    btn.disabled = true;
    natija.innerHTML = '<div class="spinner"></div>';

    try {
      var data = await soxtaAgify(ism);

      natija.innerHTML =
        '<div class="javob">' +
          '<div class="ism"></div>' +
          '<div class="yosh"></div>' +
          '<div class="izoh">taxminiy yosh</div>' +
        '</div>';

      natija.querySelector('.ism').textContent = data.name;
      natija.querySelector('.yosh').textContent = data.age;

    } catch (xato) {
      natija.innerHTML = '<div class="xato"></div>';
      natija.querySelector('.xato').textContent = xato.message;

    } finally {
      btn.disabled = false;
    }
  }

  btn.addEventListener('click', tekshir);
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') tekshir();
  });
</script>
\`\`\`

Ikkita narsani sinab ko'ring:

- Istalgan ism yozing — 0.9 soniya kutish, keyin natija
- **"xato"** deb yozing — xato holati ishga tushadi

So'rov ketayotganda tugma **o'chiriladi** (\`btn.disabled = true\`). Busiz foydalanuvchi tugmani 10 marta bosib, 10 ta so'rov yuborishi mumkin.

---

## 🥉 Bronze Topshiriq

\`async\` funksiya yozing, u \`jsonplaceholder\` dan bitta foydalanuvchini oladi va ismini konsolga chiqaradi.

\`\`\`javascript
async function sinov() {
  const res = await fetch('https://jsonplaceholder.typicode.com/users/1');
  const user = await res.json();
  console.log(user.name, user.email);
}
sinov();
\`\`\`

---

## 🥈 Silver Topshiriq

- Barcha foydalanuvchilarni yuklab, sahifada ro'yxat qiling
- \`try/catch\` bilan xatoni ushlang
- Ma'lumot \`textContent\` bilan qo'yilsin

---

## 🥇 Gold Topshiriq

To'liq qidiruv sahifasi:

- Input va tugma
- **Uch holat**: yuklanmoqda (spinner), natija, xato
- \`res.ok\` tekshiriladi
- \`finally\` bilan spinner o'chiriladi
- So'rov ketayotganda tugma o'chiriladi

> 💡 Xato holatini sinash uchun manzilni ataylab buzing: \`typicode.comXXX\`.

---

## ✅ Dars Xulosa

- \`fetch(url)\` — Promise qaytaradi, \`await\` bilan kutiladi
- **Ikkita \`await\`**: javob uchun va \`.json()\` uchun
- \`async\` va \`await\` juft yuradi
- **Uch holat**: yuklanmoqda / muvaffaqiyat / xato
- \`res.ok\` ni **qo'lda tekshiring** — 404 xato tashlamaydi
- \`finally\` — har holatda bajariladi
- API ma'lumotini \`textContent\` bilan qo'ying
- API kalitini kodga yozmang

> 🚀 **Keyingi bosqich:** 2-Modul yakuniy loyihasi!
`,
    teacher: `
## ⚠️ Demolar soxta API ishlatadi — sababi

Kabinetdagi demolar himoyalangan oynachada ishlaydi va u yerdan tashqi serverga so'rov yuborish ishonchsiz (CORS cheklovlari).

Lekin asosiy sabab boshqa va u **pedagogik**: soxta API bilan **xato holatini ataylab chaqirish** mumkin.

Haqiqiy \`fetch\` bilan xatoni ko'rsatish uchun internetni uzish yoki manzilni buzish kerak. Soxta API'da esa tugma bosish yetarli. Bolalar uch holatni ham bir darsda ko'radi.

Kod tuzilishi bir xil: \`try\` / \`await\` / \`catch\` / \`finally\`. Faqat \`fetch\` o'rniga \`setTimeout\` ishlatilgan.

**Bolalarga albatta ayting:** haqiqiy \`fetch\` ni o'z kompyuterlarida sinashsin. Darsda \`jsonplaceholder.typicode.com/posts\` manzilini brauzerda ochib ko'rsating — JSON javobini ko'rish muhim.

---

## 🗒 Notion'dagi tuzatishlar

**1. \`maTermosOlish\`** — funksiya nomi ma'nosiz (avtomatik tuzatish artefakti bo'lsa kerak). \`malumotOlish\` bo'lishi kerak edi. Bu yerda tuzatildi.

**2. OpenWeatherMap manzilida \`key=YOUR_KEY\`** — haqiqiy parametr \`appid=\`. Bu bilan so'rov ishlamaydi. API kalit talab qiladigan xizmatlar bu darsdan olib tashlandi (ular 3-Modulga mos), o'rniga kalitsiz ishlaydigan API'lar qoldirildi.

**3. \`innerHTML\` bilan API ma'lumoti:**

\`\`\`javascript
karta.innerHTML = \`<h3>\${post.title}</h3>\`;
\`\`\`

API'dan kelgan ma'lumot — **begona ma'lumot**. \`jsonplaceholder\` xavfsiz, lekin odat xavfli. 13 va 14-darslarda \`textContent\` qoidasi o'rnatilgan edi; bu yerda u buzilgan.

Tuzatildi va darsda alohida ta'kidlandi.

---

## 💡 O'qituvchi uchun

- **Uch holat** — bu darsning asosiy g'oyasi, \`fetch\` sintaksisidan ham muhimroq. Bolalar faqat "muvaffaqiyat" holatini yozadi va sayt sekin internetda bo'sh ko'rinadi.
- "Sekin javob" tugmasini bosdiring va so'rang: "spinner bo'lmasa foydalanuvchi nima deb o'ylaydi?" Javob: "sayt buzilgan" deb o'ylaydi va ketib qoladi.
- **\`res.ok\` tuzog'i** — muhim va chalkash. \`fetch\` 404 da xato tashlamaydi. Buni ko'rsatish uchun mavjud bo'lmagan manzilga so'rov yuboring: \`/posts/99999\`. \`catch\` ishlamaydi, lekin ma'lumot ham yo'q.
- **Ikkita \`await\`** — bolalar ikkinchisini unutadi va \`Promise\` oladi. Konsolda \`Promise { <pending> }\` ko'rsating.
- Tugmani **o'chirish** (\`disabled\`) — kichik detal, lekin professional farq. Bolalar tugmani ketma-ket bosadi va 10 ta so'rov ketadi.

## ⚠️ Ko'p uchraydigan xatolar

- **\`await\` \`async\` siz** — \`SyntaxError: await is only valid in async functions\`.
- **Ikkinchi \`await\` unutilgan** — \`const data = res.json()\` → \`Promise\`.
- **\`res.ok\` tekshirilmagan** — 404 da \`undefined\` bilan ishlanadi.
- **\`catch\` yo'q** — internet uzilganda sahifa jim qoladi.
- **Yuklanmoqda holati yo'q** — foydalanuvchi bo'sh ekranga qaraydi.
- **\`finally\` o'rniga ikki joyda takrorlash** — spinner'ni o'chirish kodi \`try\` va \`catch\` da ikki marta yozilgan.
- **API ma'lumoti \`innerHTML\` bilan** — XSS xavfi.
- **CORS xatosi** — ba'zi API'lar brauzerdan to'g'ridan-to'g'ri so'rovga ruxsat bermaydi. Bu bolalarni chalkashtiradi; oldindan tekshirilgan API'lar ro'yxatini bering.

## 📊 Daraja belgilash

- **Bronze** — \`async/await\` bilan ma'lumot olinadi, konsolda ko'rinadi
- **Silver** — sahifada ro'yxat, \`try/catch\` bor, \`textContent\` ishlatilgan
- **Gold** — uch holat to'liq, \`res.ok\`, \`finally\`, tugma o'chiriladi

> Gold'ni tekshirish: manzilni ataylab buzing. Tushunarli xato xabari chiqdimi, yoki sahifa jim qoldimi?
`,
  },

  // ═══════════════════════════════════════════════════════════
  'junior.m2.l9': {
    goal: "1–8-darslarda o'rganilganlarni mustahkamlash va final loyihaga tayyorgarlik.",
    student: `
## 🎯 Bugun nima qilamiz?

Yangi mavzu yo'q. Bugun sakkiz darsda o'rganganingizni **ishlatib ko'rasiz**.

Uch qism:

1. **Individual topshiriqlar** — o'zingiz yechasiz
2. **Juftlikda ishlash** — biri yozadi, biri xato qidiradi
3. **Final loyiha rejasi** — 10–12-darslarda nima qilishingizni tanlaysiz

---

## 🧪 1-qism: Individual topshiriqlar

Har biri oldingi darslardagi bilimga tayanadi. Avval **o'zingiz** yozib ko'ring, keyin natijani tekshiring.

### Topshiriq 1 — Doira yuzasi

\`\`\`javascript
function doiraYuzi(r) {
  // Math.PI va daraja ishlatilsin
}

doiraYuzi(5);   // 78.54 chiqishi kerak (yaxlitlangan)
\`\`\`

Kerak bo'ladi: \`Math.PI\`, \`**\` yoki ko'paytirish, \`toFixed(2)\` (7-dars).

### Topshiriq 2 — Unlilar sonini hisoblash

\`\`\`javascript
function unlilarSoni(soz) {
  // so'zdagi unli harflar sonini qaytaring
}

unlilarSoni("Javascript");    // ?
unlilarSoni("Programlash");   // ?
\`\`\`

Kerak bo'ladi: \`split("")\`, \`filter\`, \`includes\` (5-dars).

> 💡 O'zbek tilida unlilar: **a, e, i, o, u, o', ʻ** — soddalik uchun faqat \`a, e, i, o, u\` bilan ishlang.

### Topshiriq 3 — Palindrom

Palindrom — oldinga ham, orqaga ham bir xil o'qiladigan so'z: \`level\`, \`radar\`, \`kayak\`.

\`\`\`javascript
function palindrom(soz) {
  // true yoki false qaytaring
}

palindrom("level");   // true
palindrom("hello");   // false
\`\`\`

Kerak bo'ladi: \`toLowerCase()\`, \`split("")\`, \`reverse()\`, \`join("")\`.

### Topshiriq 4 — Takrorlanmaydigan elementlar

\`\`\`javascript
function noyob(arr) {
  // takrorlanmaydigan elementlarni qaytaring
}

noyob([1, 2, 2, 3, 3, 3, 4]);   // [1, 2, 3, 4]
\`\`\`

Ikki yo'l bor: \`filter\` bilan yoki \`Set\` bilan. Ikkalasini ham sinab ko'ring.

### Topshiriq 5 — Juft va toqlarga ajratish

\`\`\`javascript
const sonlar = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Natija: { juft: [2,4,6,8,10], toq: [1,3,5,7,9] }
\`\`\`

\`reduce\` bilan yoki ikkita \`filter\` bilan.

---

## ✅ Natijalarni tekshiring

\`\`\`demo h=420 "Kodni yozing, natijani solishtiring"
<style>
  * { box-sizing: border-box; }
  body { font-family: sans-serif; font-size: 13px; margin: 0; padding: 14px; }

  table { width: 100%; border-collapse: collapse; font-size: 12px; }
  th, td { padding: 8px 9px; text-align: left; }
  thead { background: #f8f9fa; }
  th { font-size: 10px; text-transform: uppercase; color: #6c757d; letter-spacing: 1px; }
  td { border-top: 1px solid #f0f0f0; font-family: monospace; }
  .nat { color: #16a34a; font-weight: 700; }
  .izoh { font-size: 11px; color: #9ca3af; margin-top: 12px; line-height: 1.7; }
</style>

<table>
  <thead>
    <tr><th>Chaqiruv</th><th>Natija</th></tr>
  </thead>
  <tbody id="jadval"></tbody>
</table>

<p class="izoh">
  Bu natijalar haqiqiy kod bilan hisoblangan.<br />
  O'z yechimingiz shu qiymatlarni bersa — to'g'ri ishlayapti.
</p>

<script>
  function doiraYuzi(r) {
    return Number((Math.PI * r * r).toFixed(2));
  }

  function unlilarSoni(soz) {
    var unlilar = 'aeiou';
    return soz.toLowerCase().split('').filter(function (h) {
      return unlilar.includes(h);
    }).length;
  }

  function palindrom(soz) {
    var toza = soz.toLowerCase().replace(/[^a-z]/g, '');
    return toza === toza.split('').reverse().join('');
  }

  function noyob(arr) {
    return arr.filter(function (v, i) { return arr.indexOf(v) === i; });
  }

  function ajrat(arr) {
    return arr.reduce(function (acc, n) {
      if (n % 2 === 0) acc.juft.push(n);
      else acc.toq.push(n);
      return acc;
    }, { juft: [], toq: [] });
  }

  var sonlar = [1,2,3,4,5,6,7,8,9,10];
  var natija = ajrat(sonlar);

  var qatorlar = [
    ['doiraYuzi(5)', doiraYuzi(5)],
    ['doiraYuzi(1)', doiraYuzi(1)],
    ['unlilarSoni("Javascript")', unlilarSoni('Javascript')],
    ['unlilarSoni("Programlash")', unlilarSoni('Programlash')],
    ['palindrom("level")', palindrom('level')],
    ['palindrom("hello")', palindrom('hello')],
    ['noyob([1,2,2,3,3,3,4])', JSON.stringify(noyob([1,2,2,3,3,3,4]))],
    ['ajrat(...).juft', JSON.stringify(natija.juft)],
    ['ajrat(...).toq', JSON.stringify(natija.toq)]
  ];

  var html = '';
  for (var i = 0; i < qatorlar.length; i++) {
    html += '<tr><td>' + qatorlar[i][0] + '</td>' +
            '<td class="nat">' + qatorlar[i][1] + '</td></tr>';
  }
  document.querySelector('#jadval').innerHTML = html;
</script>
\`\`\`

---

## 🐛 2-qism: Xato topish (juftlikda)

Quyidagi kodda **uchta xato** bor. Ularni toping.

\`\`\`javascript
function yigindi(a, b) {
  return a - b;
}

function juftMi(n) {
  if (n % 2 = 0) {
    return true;
  } else {
    return false;
  }
}

const arr = [1, 2, 3, 4, 5];
const ikkilangan = arr.map(n => n + 2);
\`\`\`

Har birini toping va **nima uchun** xato ekanini tushuntiring.

\`\`\`demo h=380 "Kodni tuzating va natijani ko'ring"
<style>
  * { box-sizing: border-box; }
  body { font-family: sans-serif; font-size: 13px; margin: 0; padding: 14px; }

  #natija {
    background: #1f2937; border-radius: 8px; padding: 12px;
    font-family: monospace; font-size: 12px; line-height: 1.9;
    color: #d1d5db; min-height: 120px; margin-bottom: 12px;
  }
  .kutilgan { color: #86efac; }
  .haqiqiy { color: #f87171; }
  .mos { color: #86efac; }
  .lbl { font-size: 11px; color: #6b7280; margin: 0 0 6px; font-family: monospace; }
</style>

<p class="lbl">Hozirgi kod natijasi:</p>
<div id="natija"></div>

<p class="lbl">
  Yuqoridagi "O'zgartirib ko'rish" tugmasi bilan kodni tuzating va qayta ishga tushiring.
</p>

<script>
  // ── BU YERDA UCHTA XATO BOR — TUZATING ──────────────

  function yigindi(a, b) {
    return a - b;
  }

  function juftMi(n) {
    if (n % 2 === 0) {     // bu qator ataylab to'g'ri yozilgan (= bilan kod ishga tushmaydi)
      return true;
    } else {
      return false;
    }
  }

  var arr = [1, 2, 3, 4, 5];
  var ikkilangan = arr.map(function (n) { return n + 2; });

  // ── TEKSHIRUV ───────────────────────────────────────

  var out = document.querySelector('#natija');

  function tekshir(nom, haqiqiy, kutilgan) {
    var mos = JSON.stringify(haqiqiy) === JSON.stringify(kutilgan);
    var klass = mos ? 'mos' : 'haqiqiy';
    return '<div>' + nom + '<br />' +
           '  kutilgan: <span class="kutilgan">' + JSON.stringify(kutilgan) + '</span><br />' +
           '  natija:   <span class="' + klass + '">' + JSON.stringify(haqiqiy) + '</span>' +
           (mos ? '  ✅' : '  ❌') + '</div>';
  }

  out.innerHTML =
    tekshir('yigindi(5, 3)', yigindi(5, 3), 8) +
    tekshir('juftMi(4)', juftMi(4), true) +
    tekshir('arr.map(...)', ikkilangan, [2, 4, 6, 8, 10]);
</script>
\`\`\`

> ⚠️ **Eslatma:** ikkinchi xato (\`n % 2 = 0\`) demoda ataylab to'g'ri yozilgan. Sabab: \`=\` bilan kod **umuman ishga tushmaydi** va demo bo'sh qolardi. Uni yuqoridagi ro'yxatda o'zingiz toping.

**Juftlikda ishlash qoidasi:** biri kod yozadi (**haydovchi**), ikkinchisi kuzatadi va savol beradi (**navigator**). 10 daqiqada rol almashadi.

Navigator kod yozmaydi — u faqat so'raydi: *"bu yerda nima bo'ladi?"*, *"agar 0 kirsak-chi?"*

---

## 🚀 3-qism: Final loyiha tanlash

10–12-darslarda **bitta loyiha** yozasiz. Ikki variantdan birini tanlang.

### Variant A — Kalkulyator

\`\`\`javascript
const kalkulyator = {
  natija: 0,
  tarix: [],

  hisobla(a, amal, b) {
    switch (amal) {
      case '+': this.natija = a + b; break;
      case '-': this.natija = a - b; break;
      case '*': this.natija = a * b; break;
      case '/': this.natija = b !== 0 ? a / b : "Nolga bo'lib bo'lmaydi"; break;
    }
    this.tarix.push(a + ' ' + amal + ' ' + b + ' = ' + this.natija);
    return this.natija;
  },

  tarixniKorsat() {
    this.tarix.forEach((t, i) => console.log((i + 1) + '. ' + t));
  }
};
\`\`\`

**Talablar:** to'rt amal · nolga bo'lish tekshiruvi · oxirgi 5 amal tarixi · klaviatura bilan ishlash

### Variant B — "Sonni top" o'yini

\`\`\`javascript
function oyinYarat() {
  let sirSon = Math.floor(Math.random() * 100) + 1;
  let urinishlar = 0;
  const MAX = 10;

  return {
    taxmin(son) {
      urinishlar++;
      const qolgan = MAX - urinishlar;

      if (son === sirSon) {
        return { xabar: 'Topdingiz! ' + urinishlar + ' urinishda', tugadi: true };
      }
      if (urinishlar >= MAX) {
        return { xabar: 'Yutqazdingiz. Sir son: ' + sirSon, tugadi: true };
      }

      const maslahat = son < sirSon ? 'Kattaroq' : 'Kichikroq';
      return { xabar: maslahat + '. ' + qolgan + ' urinish qoldi.', tugadi: false };
    },

    yangi() {
      sirSon = Math.floor(Math.random() * 100) + 1;
      urinishlar = 0;
    }
  };
}
\`\`\`

**Talablar:** 1–100 oralig'ida sir son · 10 urinish · har urinishdan keyin maslahat · qayta boshlash tugmasi

> ⚠️ **Nomlarda apostrof ishlatmang.** \`oyinYarat\`, \`o'yinYarat\` emas. \`galaba\`, \`g'alaba\` emas — obyekt kalitida ham. Bu 3-darsda o'rganilgan qoida.

---

## 📋 Rejalashtirish — kod yozishdan oldin

Loyihani tanlagach, **avval funksiyalar ro'yxatini** yozing:

\`\`\`text
Kalkulyator uchun:
1. hisobla(a, amal, b)  → natijani qaytaradi
2. korsat(natija)       → ekranga chiqaradi
3. tozala()             → displeyni tozalaydi
4. tarixQosh(amal)      → tarixga yozadi
5. tarixKorsat()        → tarixni chiqaradi
\`\`\`

Bu — professional odat. Kod yozishdan oldin **nima yozishini** bilib olish vaqt tejaydi.

---

## ✅ Bugungi xulosa

- Funksiyalar, massivlar, obyektlar, tsikllar — hammasi birga ishlatildi
- Xato topish — kod yozish kabi muhim ko'nikma
- Juftlikda ishlash: **haydovchi** yozadi, **navigator** savol beradi
- Kod yozishdan oldin **reja** tuzing

> 🚀 **Keyingi darslar:** 10–11 — loyihani yozasiz, 12 — taqdimot qilasiz!
`,
    teacher: `
## ⚠️ MUHIM: javoblar o'quvchiga ko'rinmasligi kerak edi

Asl Notion sahifasida "xato topish" mashqi shunday yozilgan:

\`\`\`javascript
// XATO kod:
function yigindi(a, b) {
  return a - b;  // ❌ xato
}
...
// TO'G'RI versiyasi:
function yigindi2(a, b) { return a + b; }
\`\`\`

Ya'ni **xato ham, javob ham bir sahifada**, va xatolar \`❌\` bilan belgilab qo'yilgan. Mashqning ma'nosi yo'qoladi — bola izohni o'qiydi, xolos.

**Qanday tuzatildi:**

- O'quvchi qismida faqat **buzuq kod** qoldi, izohlarsiz
- Javoblar shu yerga — **o'qituvchi bo'limiga** ko'chirildi
- Demoda "kutilgan / natija" taqqoslash qo'shildi: bola kodni tuzatib, ✅ chiqqanini ko'radi

### Javoblar

1. **\`return a - b\`** → \`a + b\` bo'lishi kerak. Funksiya nomi \`yigindi\`, lekin ayirish qilyapti.
2. **\`if (n % 2 = 0)\`** → \`===\` bo'lishi kerak. Bitta \`=\` — bu **belgilash**, taqqoslash emas. Bu kod umuman ishga tushmaydi (\`SyntaxError\`).
3. **\`arr.map(n => n + 2)\`** → \`n * 2\`. O'zgaruvchi nomi \`ikkilangan\`, lekin 2 qo'shilyapti.

Uchalasida ham naqsh bir xil: **nom bir narsa deydi, kod boshqa narsa qiladi**. Buni bolalarga ta'kidlang — bu real loyihalarda eng ko'p uchraydigan chalkashlik.

---

## 🗒 Notion'dagi noto'g'ri natijalar

Unlilar topshirig'ida kutilgan javoblar **xato hisoblangan**:

\`\`\`javascript
console.log(unlilarSoni("Javascriprt"));  // 2  ← noto'g'ri
console.log(unlilarSoni("Programlash"));  // 4  ← noto'g'ri
\`\`\`

Haqiqiy natijalar:

- **"Javascript"** → J-**a**-v-**a**-s-c-r-**i**-p-t = **3** unli
- **"Programlash"** → P-r-**o**-g-r-**a**-m-l-**a**-s-h = **3** unli

Bundan tashqari birinchisida imlo xatosi bor: "Javascri**pr**t".

Bu jiddiy muammo: bola to'g'ri kod yozadi, natija darslikdagidan farq qiladi va **o'zini xato qilgan deb o'ylaydi**. Ishonchi tushadi.

Kabinetdagi versiyada natijalar **haqiqiy kod bilan hisoblanadi** — ular hech qachon noto'g'ri bo'lmaydi. Notion'dagi asl sahifani ham tuzatish kerak.

---

## 🗒 Apostrof xatolari (yana)

\`\`\`javascript
function o'yinYasatuvchi() { }     // ❌
const o'yin = o'yinYasatuvchi();   // ❌
return { g'alaba: true };          // ❌ obyekt kaliti
o'yin.taxminQabul(50);             // ❌
\`\`\`

Hammasi \`oyinYarat\`, \`oyin\`, \`galaba\` ga o'zgartirildi.

---

## 💡 O'qituvchi uchun

- Bu dars **takrorlash**, yangi mavzu emas. Yangi narsa o'rgatmang.
- **Individual topshiriqlarni** avval yakka yechtiring. Yordam so'rasa — javob bermang, savol bering: "5-darsda qaysi metod massivdan tanlab olardi?"
- **Juftlikda ishlash** rollarini qattiq belgilang. Navigator **klaviaturaga tegmaydi**. Bolalar buni buzadi — kuzatib turing. 10 daqiqada almashtiring.
- Navigator rolini tushuntirish qiyin. Misol bering: "sen — GPS, u — haydovchi. Sen yo'lni aytasan, rulni ushlamaysan."
- **Reja tuzish** qismini o'tkazib yubormang. Bolalar darhol kod yozishni boshlaydi va yarim yo'lda adashadi. Funksiyalar ro'yxatini **qog'ozga** yozdiring.
- Loyiha tanlashda erkinlik bering, lekin **ikkitasidan bittasi** bo'lsin. "O'z g'oyam bor" degan bolaga ruxsat bering, lekin murakkabligini tekshiring — 3 darsda tugashi kerak.

## 📊 Baholash

Bu darsda **ball qo'ymang**. Bu — mashq darsi. Kuzating va yozib boring:

- Kim topshiriqlarni mustaqil yechdi?
- Kim xatolarni topdi?
- Kim navigator rolida yaxshi savol berdi?

Bu kuzatuvlar 12-darsdagi Demo Day baholashida asqotadi.
`,
  },

  // ═══════════════════════════════════════════════════════════
  'junior.m2.l17': {
    goal: "Formani JavaScript bilan tekshirish: xato xabarlari, real vaqtda validatsiya.",
    student: `
## 🤔 Nima uchun JavaScript kerak?

1-Modulning 19-darsida HTML validatsiyasini o'rgangansiz: \`required\`, \`minlength\`, \`type="email"\`. Brauzer ularni o'zi tekshiradi.

Lekin uning chegarasi bor:

| Kerak | HTML qila oladimi |
| --- | --- |
| Maydon bo'sh emasligini tekshirish | ✅ \`required\` |
| Email formatini tekshirish | ✅ \`type="email"\` |
| Parol va tasdiqlash **mos kelishini** | ❌ |
| Xato xabarini **o'zbek tilida** ko'rsatish | ❌ |
| Yozayotganda **darhol** tekshirish | ❌ |
| Foydalanuvchi nomi **band emasligini** | ❌ |

Oxirgi to'rttasi uchun JavaScript kerak.

> 💡 **Muhim:** HTML validatsiyasini olib tashlamang. Ikkalasi birga ishlaydi — HTML asosiy himoya, JavaScript esa yaxshiroq tajriba beradi.

---

## 📝 Qiymatni olish va tekshirish

\`\`\`javascript
const input = document.querySelector('#email');

const qiymat = input.value.trim();   // trim — bo'shliqlarni kesadi

if (qiymat === '') {
  // bo'sh
}
\`\`\`

\`.trim()\` muhim: foydalanuvchi faqat probel bosgan bo'lsa, \`value\` bo'sh emas, lekin **mazmunan** bo'sh.

---

## ⏱ Qachon tekshirish kerak?

Bu — validatsiyaning eng nozik savoli.

\`\`\`demo h=420 "Uch xil vaqtni taqqoslang"
<style>
  * { box-sizing: border-box; }
  body { font-family: sans-serif; font-size: 13px; margin: 0; padding: 14px; }

  .blok { margin-bottom: 16px; }
  .lbl { font-family: monospace; font-size: 11px; color: #6b7280; margin: 0 0 5px; }

  input {
    width: 100%; padding: 9px 12px; font-size: 13px;
    border: 2px solid #d1d5db; border-radius: 8px; outline: none;
    transition: border-color 0.2s;
  }
  input:focus { border-color: #6366f1; }
  input.xato { border-color: #ef4444; }
  input.ok { border-color: #22c55e; }

  .xabar {
    font-size: 11px; margin-top: 4px; min-height: 15px;
  }
  .xabar.x { color: #dc2626; }
  .xabar.o { color: #16a34a; }

  .izoh { font-size: 11px; color: #9ca3af; line-height: 1.7; margin-top: 12px; }
</style>

<div class="blok">
  <p class="lbl">1. input — har harfda tekshiradi (bezovta qiladi)</p>
  <input id="a" placeholder="Email kiriting" />
  <div class="xabar" id="ax"></div>
</div>

<div class="blok">
  <p class="lbl">2. blur — maydondan chiqqanda (yaxshiroq)</p>
  <input id="b" placeholder="Email kiriting" />
  <div class="xabar" id="bx"></div>
</div>

<div class="blok">
  <p class="lbl">3. Aralash — blur da boshlanadi, keyin input da yangilanadi (eng yaxshi)</p>
  <input id="c" placeholder="Email kiriting" />
  <div class="xabar" id="cx"></div>
</div>

<p class="izoh">
  Har uchchalasiga <b>"ali"</b> deb yozib ko'ring va farqni sezing.<br />
  Birinchisi siz hali tugatmagan bo'lsangiz ham baqiradi.
</p>

<script>
  function emailTogrimi(v) {
    return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(v);
  }

  function tekshir(input, xabar) {
    var v = input.value.trim();
    if (v === '') {
      input.className = '';
      xabar.textContent = '';
      xabar.className = 'xabar';
      return;
    }
    if (emailTogrimi(v)) {
      input.className = 'ok';
      xabar.textContent = 'To\\'g\\'ri';
      xabar.className = 'xabar o';
    } else {
      input.className = 'xato';
      xabar.textContent = 'Email formati noto\\'g\\'ri';
      xabar.className = 'xabar x';
    }
  }

  // 1 — har harfda
  var a = document.querySelector('#a'), ax = document.querySelector('#ax');
  a.addEventListener('input', function () { tekshir(a, ax); });

  // 2 — faqat chiqqanda
  var b = document.querySelector('#b'), bx = document.querySelector('#bx');
  b.addEventListener('blur', function () { tekshir(b, bx); });

  // 3 — aralash
  var c = document.querySelector('#c'), cx = document.querySelector('#cx');
  var cTekshirilgan = false;

  c.addEventListener('blur', function () {
    cTekshirilgan = true;
    tekshir(c, cx);
  });
  c.addEventListener('input', function () {
    if (cTekshirilgan) tekshir(c, cx);   // faqat bir marta chiqqandan keyin
  });
</script>
\`\`\`

Uchinchi usul eng yaxshi va u shunday ishlaydi:

1. Foydalanuvchi yozayotganda **jim turadi** — xalaqit bermaydi
2. Maydondan chiqqanda tekshiradi
3. Xato topilgach, tuzatishni **darhol** ko'rsatadi

\`\`\`javascript
let tekshirilgan = false;

input.addEventListener('blur', () => {
  tekshirilgan = true;
  tekshir();
});

input.addEventListener('input', () => {
  if (tekshirilgan) tekshir();
});
\`\`\`

> 💡 Bu — professional saytlarda ishlatiladigan naqsh. Uni eslab qoling.

---

## 🔍 Tekshiruv funksiyalari

\`\`\`javascript
// Bo'sh emasmi
function bosh(v) {
  return v.trim() === '';
}

// Uzunlik
function qisqa(v, min) {
  return v.trim().length < min;
}

// Email — soddalashtirilgan
function emailTogrimi(v) {
  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(v);
}

// Telefon — O'zbekiston
function telefonTogrimi(v) {
  return /^\\+998\\d{9}$/.test(v.replace(/\\s/g, ''));
}

// Ikki maydon mos keladimi
function mosmi(a, b) {
  return a === b;
}
\`\`\`

> ⚠️ \`/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/\` — bu **regulyar ifoda** (regex). Uni hozircha tayyor retsept sifatida ishlating. Regex alohida katta mavzu va uni keyinroq o'rganasiz.
>
> Muhimi shuni bilish: email'ni **100% aniq** tekshirib bo'lmaydi. Haqiqiy tekshiruv — o'sha manzilga xat yuborish.

---

## 🎨 Xato xabarlarini ko'rsatish

Yaxshi xato xabari uchta shartga javob beradi:

1. **Nima noto'g'ri** ekanini aytadi
2. **Qanday tuzatishni** aytadi
3. **Maydon yonida** turadi, sahifaning tepasida emas

\`\`\`text
❌ "Xato!"
❌ "Noto'g'ri qiymat"
✅ "Parol kamida 8 ta belgidan iborat bo'lsin"
✅ "Email @ belgisini o'z ichiga olishi kerak"
\`\`\`

---

## 📋 To'liq forma

\`\`\`demo h=420 "Ro'yxatdan o'tish"
<style>
  * { box-sizing: border-box; }
  body { font-family: sans-serif; font-size: 13px; margin: 0; padding: 14px; }

  .maydon { margin-bottom: 12px; }
  label { display: block; font-weight: 600; font-size: 12px; color: #374151; margin-bottom: 4px; }

  input {
    width: 100%; padding: 9px 12px; font-size: 13px;
    border: 2px solid #e5e7eb; border-radius: 8px; outline: none;
    transition: border-color 0.2s;
  }
  input:focus { border-color: #6366f1; }
  input.xato { border-color: #ef4444; background: #fef2f2; }
  input.ok { border-color: #22c55e; }

  .xabar { font-size: 11px; color: #dc2626; margin-top: 3px; min-height: 15px; }

  button {
    width: 100%; padding: 11px; border: none; border-radius: 8px;
    background: #6366f1; color: white; font-size: 14px;
    font-weight: 600; cursor: pointer; margin-top: 4px;
  }
  button:hover { background: #4f46e5; }

  #natija {
    margin-top: 12px; padding: 12px; border-radius: 8px;
    font-size: 12px; min-height: 20px;
  }
  #natija.ok { background: #ecfdf5; border: 1px solid #a7f3d0; color: #065f46; }
  #natija.xato { background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; }
</style>

<div class="maydon">
  <label for="ism">Ism</label>
  <input id="ism" placeholder="Ismingiz" />
  <div class="xabar" id="ismX"></div>
</div>

<div class="maydon">
  <label for="email">Email</label>
  <input id="email" placeholder="email@example.com" />
  <div class="xabar" id="emailX"></div>
</div>

<div class="maydon">
  <label for="parol">Parol</label>
  <input id="parol" type="password" placeholder="Kamida 8 ta belgi" />
  <div class="xabar" id="parolX"></div>
</div>

<div class="maydon">
  <label for="parol2">Parolni tasdiqlang</label>
  <input id="parol2" type="password" placeholder="Parolni qayta kiriting" />
  <div class="xabar" id="parol2X"></div>
</div>

<button id="yubor">Ro'yxatdan o'tish</button>
<div id="natija"></div>

<script>
  var maydonlar = {
    ism: {
      el: document.querySelector('#ism'),
      xa: document.querySelector('#ismX'),
      tekshir: function (v) {
        if (v.trim() === '') return 'Ism kiritilishi shart';
        if (v.trim().length < 2) return 'Ism kamida 2 ta harfdan iborat bo\\'lsin';
        return null;
      }
    },
    email: {
      el: document.querySelector('#email'),
      xa: document.querySelector('#emailX'),
      tekshir: function (v) {
        if (v.trim() === '') return 'Email kiritilishi shart';
        if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(v.trim())) {
          return 'Email @ va nuqta belgilarini o\\'z ichiga olishi kerak';
        }
        return null;
      }
    },
    parol: {
      el: document.querySelector('#parol'),
      xa: document.querySelector('#parolX'),
      tekshir: function (v) {
        if (v === '') return 'Parol kiritilishi shart';
        if (v.length < 8) return 'Parol kamida 8 ta belgidan iborat bo\\'lsin';
        return null;
      }
    },
    parol2: {
      el: document.querySelector('#parol2'),
      xa: document.querySelector('#parol2X'),
      tekshir: function (v) {
        if (v === '') return 'Parolni tasdiqlang';
        if (v !== maydonlar.parol.el.value) return 'Parollar mos kelmadi';
        return null;
      }
    }
  };

  var natija = document.querySelector('#natija');

  function maydonTekshir(nom) {
    var m = maydonlar[nom];
    var xato = m.tekshir(m.el.value);

    if (xato) {
      m.el.className = 'xato';
      m.xa.textContent = xato;
      return false;
    }
    m.el.className = 'ok';
    m.xa.textContent = '';
    return true;
  }

  // Aralash naqsh: blur da boshlanadi, keyin input da yangilanadi
  Object.keys(maydonlar).forEach(function (nom) {
    var m = maydonlar[nom];
    m.tekshirilgan = false;

    m.el.addEventListener('blur', function () {
      m.tekshirilgan = true;
      maydonTekshir(nom);
    });

    m.el.addEventListener('input', function () {
      if (m.tekshirilgan) maydonTekshir(nom);
      // Parol o'zgarsa, tasdiqlashni ham qayta tekshiramiz
      if (nom === 'parol' && maydonlar.parol2.tekshirilgan) {
        maydonTekshir('parol2');
      }
    });
  });

  document.querySelector('#yubor').addEventListener('click', function () {
    var hammasiTogri = true;

    Object.keys(maydonlar).forEach(function (nom) {
      maydonlar[nom].tekshirilgan = true;
      if (!maydonTekshir(nom)) hammasiTogri = false;
    });

    if (hammasiTogri) {
      natija.className = 'ok';
      natija.textContent = '✅ Muvaffaqiyatli! Ma\\'lumotlar serverga yuborilardi.';
    } else {
      natija.className = 'xato';
      natija.textContent = '❌ Formada xatolar bor. Yuqorini tekshiring.';
    }
  });
</script>
\`\`\`

Sinab ko'ring: bo'sh qoldiring · noto'g'ri email · qisqa parol · mos kelmaydigan parollar.

Diqqat qiling — parolni o'zgartirsangiz, **tasdiqlash maydoni ham** qayta tekshiriladi. Bu kichik detal, lekin busiz foydalanuvchi chalkashadi.

---

## 🏗 Kod tuzilishi

Demoda har maydon **obyekt** sifatida saqlangan:

\`\`\`javascript
const maydonlar = {
  email: {
    el: document.querySelector('#email'),
    xa: document.querySelector('#emailX'),
    tekshir: (v) => {
      if (v.trim() === '') return 'Email kiritilishi shart';
      if (!emailTogrimi(v)) return 'Email formati noto\\'g\\'ri';
      return null;       // null = xato yo'q
    }
  }
};
\`\`\`

Nima uchun shunday? Chunki yangi maydon qo'shish uchun **faqat obyektga bitta yozuv** qo'shasiz. Qolgan kod o'zgarmaydi.

\`if/else\` zanjiri bilan yozsangiz, har yangi maydonda kod uzayadi va takrorlanadi.

> 💡 Bu — 6-darsdagi obyekt bilimining amaliy qo'llanishi. Xuddi 7-darsdagi tosh-qaychi-qog'oz kabi: **murakkab shartni obyektga aylantirish**.

---

## 🥉 Bronze Topshiriq

Bitta maydonli forma: ism kiritilsin, bo'sh bo'lsa xato xabari chiqsin.

---

## 🥈 Silver Topshiriq

- Uch maydon: ism, email, parol
- Har biriga o'z tekshiruvi
- Xato xabarlari **maydon yonida** ko'rinsin
- Xato bo'lsa chegara qizil, to'g'ri bo'lsa yashil

---

## 🥇 Gold Topshiriq

To'liq forma:

- Parol tasdiqlash (mos kelishini tekshirish)
- **Aralash naqsh**: \`blur\` da boshlanadi, keyin \`input\` da yangilanadi
- Maydonlar **obyektda** saqlansin, \`if/else\` zanjiri bo'lmasin
- Yuborishda hamma maydon qayta tekshirilsin

---

## ✅ Dars Xulosa

- HTML validatsiyasi asos, JavaScript — qo'shimcha
- \`.trim()\` — faqat probel yozilgan holatni ushlaydi
- **Aralash naqsh**: \`blur\` → keyin \`input\`
- Xato xabari **qanday tuzatishni** aytsin
- Xabar maydon yonida bo'lsin
- Maydonlarni **obyektda** saqlash — kod o'smaydi
- Email'ni 100% tekshirib bo'lmaydi

> 🚀 **Keyingi dars:** Fetch API — serverga ma'lumot yuborish!
`,
    teacher: `
## 🗒 Bu darsning Notion sahifasi yo'q

Modul rejasida "17-Dars: Form Validation — input.value, custom validation, error xabarlarini ko'rsatish" deb yozilgan, lekin alohida sahifa yaratilmagan.

Bu dars shu tavsif asosida yozildi va 1-Modulning 19-darsi (HTML formalar) bilan bog'landi — takrorlanmasligi uchun:

- **19-dars** (1-Modul): HTML validatsiyasi, \`:valid\`/\`:invalid\`, forma dizayni
- **17-dars** (bu): JavaScript validatsiyasi, o'zbek tilidagi xabarlar, real vaqtda tekshirish

Darsning boshida jadval bor — HTML nimani qila oladi, nimani yo'q. Bu bolalarni "nega yana forma?" degan savoldan qutqaradi.

---

## 💡 O'qituvchi uchun

- **"Qachon tekshirish kerak?"** demosi — bu darsning eng qimmatli qismi. Uch maydonga bir vaqtda \`"ali"\` deb yozdiring. Birinchisi darhol baqiradi va bu **bezovta qiladi** — bolalar buni his qiladi.
- Aralash naqshni (\`blur\` → \`input\`) **yodlatib qo'ying**. Bu — professional saytlarda ishlatiladigan yechim va bolalar uni boshqa joyda o'rganmaydi.
- **Xato xabarlari matni** — alohida mashq qiling. Doskaga yomon xabarlarni yozing ("Xato!", "Noto'g'ri") va yaxshilashni so'rang. Bu — dasturlash emas, lekin professional ko'nikma.
- **Regex** ni tushuntirishga urinmang. Tayyor retsept sifatida bering. Agar bola so'rasa — "bu alohida katta mavzu, keyinroq" deng.
- Email'ni 100% tekshirib bo'lmasligini ayting. Bolalar "mukammal" regex qidiradi va vaqt sarflaydi.

## ⚠️ Ko'p uchraydigan xatolar

- **\`.trim()\` unutilgan** — foydalanuvchi probel bosadi va forma o'tadi.
- **\`value\` o'rniga \`textContent\`** — input'da \`value\` ishlatiladi.
- **Parol tasdiqlash bir marta tekshiriladi** — parol keyin o'zgarsa, tasdiqlash eski holicha "to'g'ri" bo'lib qoladi. Demoda bu hal qilingan.
- **Xato xabari sahifa tepasida** — foydalanuvchi qaysi maydon xato ekanini bilmaydi.
- **HTML validatsiyasi olib tashlangan** — \`novalidate\` qo'yib, hamma narsani JS bilan qilish. Ikkalasi birga ishlashi kerak.
- **\`if/else\` zanjiri** — 5 maydonli formada kod 100 qatorga chiqadi va takrorlanadi.

## 📊 Daraja belgilash

- **Bronze** — bo'sh maydon ushlanadi, xabar ko'rinadi
- **Silver** — uch maydon, ranglar, xabarlar maydon yonida
- **Gold** — parol tasdiqlash, aralash naqsh, obyekt tuzilishi

> Gold'ni tekshirish: parolni kiriting, tasdiqlang, keyin **parolni o'zgartiring**. Tasdiqlash maydoni qayta tekshirilmasa — bajarilmagan.
`,
  },

  // ═══════════════════════════════════════════════════════════
  'junior.m2.l10': {
    goal: "Kod yozishdan oldin loyihani bo'laklarga ajratish va reja tuzish.",
    student: `
## 🤔 Nima uchun reja kerak?

Ko'p bola shunday qiladi: loyihani ochadi va darhol kod yozishni boshlaydi. Yarim yo'lda adashadi, kod chalkashib ketadi, qaytadan boshlaydi.

Professional dasturchi boshqacha ishlaydi: **avval nima qilishini yozadi**, keyin qiladi.

> 💡 Qurilishda ham shunday — avval chizma, keyin g'isht. Hech kim "chizmasiz qura boshlaymiz, ko'ramiz nima chiqadi" demaydi.

---

## 🧩 Dekompozitsiya — katta narsani bo'laklarga ajratish

"Kalkulyator yozaman" — bu juda katta vazifa. Uni **kichik bo'laklarga** ajratish kerak.

Har bo'lak shunday bo'lsin: **bitta narsa qiladi** va **nomi uni tushuntiradi**.

\`\`\`demo h=420 "Kalkulyatorni bo'laklarga ajratish"
<style>
  * { box-sizing: border-box; }
  body { font-family: sans-serif; font-size: 13px; margin: 0; padding: 14px; }

  .katta {
    background: #fef3c7; border: 2px solid #f59e0b;
    border-radius: 10px; padding: 14px; text-align: center;
    font-weight: 600; color: #92400e; margin-bottom: 10px;
  }
  .strelka { text-align: center; color: #9ca3af; font-size: 18px; margin-bottom: 10px; }

  .bolaklar { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
  .bolak {
    background: #eff6ff; border: 1px solid #bfdbfe;
    border-radius: 8px; padding: 10px; cursor: pointer;
    transition: all 0.2s;
  }
  .bolak:hover { border-color: #6366f1; background: #e0e7ff; }
  .bolak .nom { font-family: monospace; font-size: 12px; color: #1e40af; font-weight: 600; }
  .bolak .tav { font-size: 11px; color: #6b7280; margin-top: 3px; }

  #tafsilot {
    margin-top: 12px; background: #1f2937; border-radius: 8px; padding: 12px;
    font-family: monospace; font-size: 11px; color: #d1d5db;
    line-height: 1.8; min-height: 90px;
  }
  .kalit { color: #c4b5fd; }
  .izoh { color: #6b7280; }
</style>

<div class="katta">🧮 "Kalkulyator yozaman"</div>
<div class="strelka">↓ bo'laklarga ajratamiz</div>

<div class="bolaklar">
  <div class="bolak" data-f="hisobla">
    <div class="nom">hisobla()</div>
    <div class="tav">Ikki sonni hisoblaydi</div>
  </div>
  <div class="bolak" data-f="korsat">
    <div class="nom">korsat()</div>
    <div class="tav">Natijani ekranga chiqaradi</div>
  </div>
  <div class="bolak" data-f="tozala">
    <div class="nom">tozala()</div>
    <div class="tav">Displeyni tozalaydi</div>
  </div>
  <div class="bolak" data-f="tarixQosh">
    <div class="nom">tarixQosh()</div>
    <div class="tav">Amalni tarixga yozadi</div>
  </div>
  <div class="bolak" data-f="tarixKorsat">
    <div class="nom">tarixKorsat()</div>
    <div class="tav">Tarixni chiqaradi</div>
  </div>
  <div class="bolak" data-f="tekshir">
    <div class="nom">tekshir()</div>
    <div class="tav">Kiritilgan sonni tekshiradi</div>
  </div>
</div>

<div id="tafsilot">Bo'laklardan birini bosing</div>

<script>
  var tafsilotlar = {
    hisobla: {
      kirish: 'a (son), amal (matn), b (son)',
      chiqish: 'son yoki xato matni',
      izoh: 'Nolga bo\\'lishni tekshiradi'
    },
    korsat: {
      kirish: 'natija (son yoki matn)',
      chiqish: 'yo\\'q (ekranni o\\'zgartiradi)',
      izoh: 'textContent bilan qo\\'yadi'
    },
    tozala: {
      kirish: 'yo\\'q',
      chiqish: 'yo\\'q',
      izoh: 'Displey va joriy qiymatni nolga qaytaradi'
    },
    tarixQosh: {
      kirish: 'amal (matn)',
      chiqish: 'yo\\'q',
      izoh: 'Massivga qo\\'shadi, 5 tadan ko\\'p bo\\'lsa eskisini o\\'chiradi'
    },
    tarixKorsat: {
      kirish: 'yo\\'q',
      chiqish: 'yo\\'q',
      izoh: 'Massivdan ro\\'yxat yasaydi (render naqshi)'
    },
    tekshir: {
      kirish: 'qiymat (matn)',
      chiqish: 'true yoki false',
      izoh: 'Son ekanini va bo\\'sh emasligini tekshiradi'
    }
  };

  var tafsilot = document.querySelector('#tafsilot');
  var bolaklar = document.querySelectorAll('.bolak');

  for (var i = 0; i < bolaklar.length; i++) {
    bolaklar[i].addEventListener('click', function () {
      var f = this.dataset.f;
      var t = tafsilotlar[f];
      tafsilot.innerHTML =
        '<span class="kalit">function</span> ' + f + '(...)<br /><br />' +
        '  <span class="izoh">Nima kiradi:</span>  ' + t.kirish + '<br />' +
        '  <span class="izoh">Nima chiqadi:</span> ' + t.chiqish + '<br />' +
        '  <span class="izoh">Eslatma:</span>      ' + t.izoh;
    });
  }
</script>
\`\`\`

Har bo'lak uchun uchta savolga javob yozing:

1. **Nima kiradi?** (parametrlar)
2. **Nima chiqadi?** (\`return\`)
3. **Nima qiladi?** (bir jumlada)

Agar "nima qiladi" ni **bir jumlada** ayta olmasangiz — funksiya juda katta, uni yana bo'lish kerak.

---

## ✍️ Psevdokod — kodga o'xshash, lekin oddiy til

Murakkab joyni kod yozishdan oldin **o'z tilingizda** yozib ko'ring:

\`\`\`text
FUNKSIYA hisobla(a, amal, b):
    AGAR amal "+" bo'lsa:
        QAYTAR a + b
    AGAR amal "/" bo'lsa:
        AGAR b nolga teng bo'lsa:
            QAYTAR "Nolga bo'lib bo'lmaydi"
        QAYTAR a / b
    ...
\`\`\`

Bu — kod emas, lekin **mantiq tayyor**. Endi uni JavaScript'ga o'girish oson:

\`\`\`javascript
function hisobla(a, amal, b) {
  if (amal === '+') return a + b;
  if (amal === '/') {
    if (b === 0) return "Nolga bo'lib bo'lmaydi";
    return a / b;
  }
}
\`\`\`

> 💡 Psevdokod yozish — **vaqt sarflash emas, vaqt tejash**. Mantiqdagi xatoni qog'ozda topish, kodda topishdan ancha oson.

---

## 📋 Reja shabloni

Loyihangiz uchun shu jadvalni to'ldiring:

| Funksiya | Kirish | Chiqish | Nima qiladi |
| --- | --- | --- | --- |
| \`hisobla\` | a, amal, b | son | Ikki sonni hisoblaydi |
| \`korsat\` | natija | — | Ekranga chiqaradi |
| ... | | | |

Va ma'lumot tuzilishini belgilang:

\`\`\`javascript
// Kalkulyator uchun
let joriySon = 0;
let tarix = [];        // ["10 + 5 = 15", ...]

// "Sonni top" uchun
let sirSon = 0;
let urinishlar = 0;
const MAX_URINISH = 10;
\`\`\`

---

## 🎯 Ikki variant

### Variant A — Kalkulyator

**Majburiy:**

- To'rt amal: \`+\`, \`−\`, \`×\`, \`÷\`
- Nolga bo'lish tekshiriladi
- Natija ekranda ko'rinadi
- Tozalash tugmasi

**Qo'shimcha:**

- Oxirgi 5 amal tarixi
- Klaviatura bilan ishlash
- \`localStorage\` bilan tarix saqlanadi

### Variant B — "Sonni top"

**Majburiy:**

- 1–100 oralig'ida tasodifiy son
- 10 ta urinish
- Har urinishdan keyin "kattaroq" yoki "kichikroq"
- Qayta boshlash tugmasi

**Qo'shimcha:**

- Qolgan urinishlar ko'rinadi
- Oldingi taxminlar ro'yxati
- \`localStorage\` bilan eng yaxshi natija saqlanadi

---

## ⚠️ Rejalashtirishdagi tipik xatolar

**"Hammasini birdan qilaman"** — 15 ta imkoniyat rejalashtiriladi, 3 tasi tugallanadi. Majburiy qismni **avval** tugating, keyin qo'shimchani qo'shing.

**"Dizaynni keyin qilaman"** — dizayn oxirida qilinsa, HTML tuzilmasini qayta yozishga to'g'ri keladi. Oddiy, lekin **ishlaydigan** ko'rinishdan boshlang.

**Funksiya juda katta** — \`hammasiniQil()\` degan 80 qatorli funksiya. Uni tuzatib bo'lmaydi. Har funksiya **bitta** ish qilsin.

---

## 🥉🥈🥇 Bugungi topshiriq

Bugun **kod yozmaysiz**. Faqat reja:

- **Bronze** — variantni tanlang, majburiy imkoniyatlar ro'yxatini yozing
- **Silver** — funksiyalar jadvalini to'ldiring (kirish / chiqish / nima qiladi)
- **Gold** — eng murakkab funksiyaning psevdokodini yozing + ma'lumot tuzilishini belgilang

Rejani **qog'ozga** yozing yoki fayl yarating. 11-darsda shu reja bo'yicha kod yozasiz.

---

## ✅ Dars Xulosa

- Kod yozishdan oldin **reja** tuzing
- Katta vazifani kichik funksiyalarga ajrating
- Har funksiya uchun: kirish / chiqish / nima qiladi
- "Nima qiladi" bir jumlaga sig'masa — funksiya katta
- Psevdokod — mantiqni tekshirishning arzon usuli
- Avval **majburiy** qism, keyin qo'shimcha

> 🚀 **Keyingi dars:** Rejani kodga aylantirasiz!
`,
    teacher: `
## 🗒 Bu darsning Notion sahifasi yo'q

Modul rejasida "10-Dars: Loyiha Rejalashtirish" deb yozilgan, lekin alohida sahifa yaratilmagan. 9-darsning oxirida qisqa skelet kod bor edi — shu asosda to'liq dars yozildi.

---

## 💡 O'qituvchi uchun

- **Bu darsda kod yozdirmang.** Bolalar qarshilik qiladi: "nega bugun kod yo'q?" Javob: "chizmasiz uy qurmaymiz". Qat'iy turing — rejasiz boshlagan bola 11-darsda adashadi.
- **Dekompozitsiyani birga qiling.** Doskaga "Kalkulyator" deb yozing va bolalardan bo'laklarni so'rang. Ular aytgan har bo'lakni yozib boring. Keyin har biriga "nima kiradi, nima chiqadi?" deb so'rang.
- **"Bir jumlada ayta olmasangiz — katta"** qoidasini sinab ko'ring. Bola \`hammasiniQil()\` deb yozsa, tushuntirishni so'rang. U "avval buni, keyin buni, keyin buni..." deydi — mana shu belgisi.
- **Psevdokodni o'zbek tilida** yozdiring. Inglizcha kalit so'zlar (\`IF\`, \`RETURN\`) shart emas. Maqsad — mantiqni tekshirish, sintaksis emas.
- Qog'ozda ishlashni talab qiling. Kompyuter oldida bola darhol kod yozishga o'tadi.

## ⚠️ Kuzatiladigan holatlar

- **Juda ko'p imkoniyat rejalashtirish** — 15 ta funksiya yozadi. Uchtasini tanlab, "majburiy" deb belgilang, qolganini "keyin" ro'yxatiga o'tkazing.
- **Funksiyalar bir-biriga o'xshash** — \`korsat()\`, \`chiqar()\`, \`yoz()\` — uchtasi bir xil ish qiladi. Birlashtirishni taklif qiling.
- **Ma'lumot tuzilishi o'ylanmagan** — tarix qayerda saqlanadi? Massivdami, matndami? Buni oldindan hal qilish kerak.
- **"Men bilaman, yozmasam ham bo'ladi"** — eng ko'p uchraydigan qarshilik. Javob: "bilasiz, lekin ertaga esdan chiqadi". Yozdiring.

## 📊 Baholash

Bu darsda **rejani** baholang, kodni emas:

- **Bronze** — variant tanlangan, imkoniyatlar ro'yxati bor
- **Silver** — funksiyalar jadvali to'liq (kirish/chiqish/vazifa)
- **Gold** — psevdokod bor, ma'lumot tuzilishi belgilangan

Rejani **saqlab qo'ying**. 12-darsdagi Demo Day'da "rejaga qanchalik amal qilindi?" degan savol beriladi.
`,
  },

  // ═══════════════════════════════════════════════════════════
  'junior.m2.l11': {
    goal: "Rejani kodga aylantirish, bosqichma-bosqich ishlash va xatolarni tuzatish.",
    student: `
## 🏗 Bugun rejani kodga aylantiramiz

10-darsda yozgan rejangizni oching. Bugun uni ishlaydigan dasturga aylantirasiz.

---

## 🪜 Bosqichma-bosqich ishlash

Eng katta xato — **hammasini birdan yozish**. 200 qator yozib, keyin "ishlamayapti" deb qidirish.

To'g'ri yo'l: **kichik qadam → sinab ko'rish → keyingi qadam**.

\`\`\`text
1-qadam:  HTML tuzilmasi          → brauzerda ochib ko'ring
2-qadam:  Elementlarni topish     → console.log bilan tekshiring
3-qadam:  Bitta tugma ishlasin    → bosib ko'ring
4-qadam:  Asosiy funksiya         → console.log bilan tekshiring
5-qadam:  Natijani ekranga        → ko'ring
6-qadam:  Qolgan tugmalar
7-qadam:  Chetki holatlar (nol, bo'sh maydon)
8-qadam:  Dizayn
\`\`\`

Har qadamdan keyin **brauzerda tekshiring**. Xato chiqsa — u oxirgi qadamda, uni topish oson.

> 💡 50 qator yozib xato qidirish — 30 daqiqa. 5 qator yozib xato topish — 30 soniya.

---

## 🐛 Xato xabarlarini o'qishni o'rganing

Bolalar konsoldagi qizil xabarni ko'rib qo'rqadi va o'qimaydi. Aslida u **muammoni aytib beradi**.

\`\`\`demo h=420 "Eng ko'p uchraydigan xatolar"
<style>
  * { box-sizing: border-box; }
  body { font-family: sans-serif; font-size: 13px; margin: 0; padding: 14px; }

  .xato {
    background: #1f2937; border-left: 4px solid #ef4444;
    border-radius: 6px; padding: 10px 12px; margin-bottom: 8px;
    font-family: monospace; font-size: 11px; color: #fca5a5;
    cursor: pointer; transition: background 0.2s;
  }
  .xato:hover { background: #374151; }

  #tushuntirish {
    margin-top: 12px; background: #eff6ff; border: 1px solid #bfdbfe;
    border-radius: 8px; padding: 12px; font-size: 12px; color: #1e40af;
    line-height: 1.8; min-height: 110px;
  }
  #tushuntirish b { color: #1e3a8a; }
  #tushuntirish code {
    background: #dbeafe; padding: 1px 5px; border-radius: 3px;
    font-family: monospace; font-size: 11px;
  }
  .lbl { font-size: 11px; color: #6b7280; margin: 0 0 8px; }
</style>

<p class="lbl">Xatoni bosing — nima anglatishini ko'rasiz</p>

<div class="xato" data-x="null">TypeError: Cannot read properties of null (reading 'addEventListener')</div>
<div class="xato" data-x="undefined">TypeError: Cannot read properties of undefined (reading 'length')</div>
<div class="xato" data-x="notfunc">TypeError: hisobla is not a function</div>
<div class="xato" data-x="notdef">ReferenceError: natija is not defined</div>
<div class="xato" data-x="syntax">SyntaxError: Unexpected token '}'</div>
<div class="xato" data-x="nan">Natija: NaN</div>

<div id="tushuntirish">Yuqoridagi xatolardan birini bosing</div>

<script>
  var izohlar = {
    'null': {
      sabab: 'Element topilmadi — <code>querySelector</code> <b>null</b> qaytardi.',
      tekshir: [
        'Selektor to\\'g\\'rimi? <code>#btn</code> yozdingizmi, <code>btn</code> emasmi?',
        'HTML da o\\'sha <code>id</code> bormi?',
        '<code>&lt;script&gt;</code> <code>&lt;/body&gt;</code> dan oldinmi?'
      ]
    },
    'undefined': {
      sabab: 'O\\'zgaruvchi bor, lekin qiymati <b>undefined</b>.',
      tekshir: [
        'Funksiya <code>return</code> qilyaptimi?',
        'Massiv indeksi mavjudmi? <code>arr[10]</code> — massivda 10 ta element bormi?',
        'Obyektda o\\'sha kalit bormi?'
      ]
    },
    'notfunc': {
      sabab: 'Funksiya deb chaqirdingiz, lekin u funksiya emas.',
      tekshir: [
        'Funksiya nomi to\\'g\\'ri yozilganmi? (katta-kichik harf muhim)',
        'Funksiya <b>e\\'lon qilinganmi</b>?',
        'Nomni o\\'zgaruvchi bilan almashtirib yubormadingizmi?'
      ]
    },
    'notdef': {
      sabab: 'Bunday o\\'zgaruvchi umuman yo\\'q.',
      tekshir: [
        'Imlo xatosi bormi? <code>natija</code> va <code>natjia</code>',
        'O\\'zgaruvchi <b>boshqa funksiya ichida</b> e\\'lon qilinganmi?',
        '<code>let</code> yoki <code>const</code> yozilganmi?'
      ]
    },
    'syntax': {
      sabab: 'Kod tuzilishi buzilgan — qavs yoki tirnoq mos kelmayapti.',
      tekshir: [
        'Ochilgan har <code>{</code> uchun <code>}</code> bormi?',
        'Tirnoqlar juftmi? <code>"..."</code> yoki <code>\\'...\\'</code>',
        'VS Code da qavsga bosing — jufti yonib turadi'
      ]
    },
    'nan': {
      sabab: '<b>NaN</b> = Not a Number. Son bo\\'lmagan narsa bilan hisob qilindi.',
      tekshir: [
        '<code>input.value</code> — bu <b>matn</b>. <code>Number()</code> bilan aylantiring',
        'Bo\\'sh maydon <code>Number("")</code> → 0, lekin <code>Number("abc")</code> → NaN',
        'Tekshiring: <code>isNaN(qiymat)</code>'
      ]
    }
  };

  var tush = document.querySelector('#tushuntirish');
  var xatolar = document.querySelectorAll('.xato');

  for (var i = 0; i < xatolar.length; i++) {
    xatolar[i].addEventListener('click', function () {
      var d = izohlar[this.dataset.x];
      var html = '<b>Nima bo\\'lgan:</b> ' + d.sabab + '<br /><br /><b>Nimani tekshirish:</b><br />';
      for (var j = 0; j < d.tekshir.length; j++) {
        html += '&nbsp;&nbsp;' + (j + 1) + '. ' + d.tekshir[j] + '<br />';
      }
      tush.innerHTML = html;
    });
  }
</script>
\`\`\`

Xato xabari uch narsani aytadi:

1. **Turi** — \`TypeError\`, \`ReferenceError\`, \`SyntaxError\`
2. **Tavsifi** — nima noto'g'ri
3. **Joyi** — fayl nomi va **qator raqami** (xabarning o'ng tomonida)

Qator raqamiga bosing — DevTools sizni to'g'ri o'sha joyga olib boradi.

---

## 🔦 console.log — eng oddiy va eng kuchli vosita

Kod ishlamayotgan bo'lsa, **taxmin qilmang** — tekshiring:

\`\`\`javascript
function hisobla(a, amal, b) {
  console.log('hisobla chaqirildi:', a, amal, b);   // kirish to'g'rimi?

  const natija = a + b;
  console.log('natija:', natija);                    // hisob to'g'rimi?

  return natija;
}
\`\`\`

Ikkita tekshiruv ikkita savolga javob beradi: **funksiya chaqirilyaptimi** va **qiymatlar to'g'rimi**.

> 💡 Ko'p hollarda muammo — qiymat kutganingizdan boshqa turda. \`"5"\` va \`5\` ko'rinishda bir xil, lekin \`"5" + 3 = "53"\`.
>
> Buni ko'rish uchun: \`console.log(typeof qiymat, qiymat)\`

---

## 🎯 Chetki holatlar

Dastur "oddiy" holatda ishlashi yetarli emas. Quyidagilarni **ataylab** sinang:

**Kalkulyator uchun:**

- Nolga bo'lish
- Bo'sh maydon
- Harf kiritish (\`abc\`)
- Juda katta son
- Manfiy son

**"Sonni top" uchun:**

- Chegaradan tashqari son (0, 101, −5)
- Bo'sh maydon
- Harf kiritish
- O'yin tugagach yana taxmin qilish

> ⚠️ Foydalanuvchi **har doim** siz o'ylamagan narsani qiladi. Chetki holatlarni oldindan sinash — professional odat.

---

## ⏱ Bugungi tartib

**1. HTML va CSS skeleti** (15 daqiqa)

Chiroyli bo'lishi shart emas — tuzilma bo'lsa yetadi.

**2. Elementlarni topish** (5 daqiqa)

\`\`\`javascript
const tugma = document.querySelector('#tugma');
console.log(tugma);   // null bo'lmasligi kerak
\`\`\`

**3. Asosiy funksiya** (20 daqiqa)

Rejadagi eng muhim funksiyani yozing. \`console.log\` bilan tekshiring.

**4. Ekranga bog'lash** (15 daqiqa)

**5. Qolgan funksiyalar** (qolgan vaqt)

**6. Chetki holatlar** (uy vazifasi)

---

## 🥉🥈🥇 Baholash

- **Bronze** — asosiy funksiya ishlaydi, natija ekranda ko'rinadi
- **Silver** — barcha majburiy imkoniyatlar bor, chetki holatlar tekshirilgan
- **Gold** — qo'shimcha imkoniyat bor (tarix / \`localStorage\` / klaviatura), kod funksiyalarga ajratilgan

---

## ✅ Dars Xulosa

- **Kichik qadam → sinab ko'rish → keyingi qadam**
- Xato xabarini **o'qing** — u muammoni aytadi
- \`console.log\` bilan taxmin qilmang, tekshiring
- \`typeof\` bilan turni ham tekshiring
- Chetki holatlarni **ataylab** sinang
- Avval ishlasin, keyin chiroyli bo'lsin

> 🚀 **Keyingi dars:** Demo Day — loyihangizni ko'rsatasiz!
`,
    teacher: `
## 🗒 Bu darsning Notion sahifasi yo'q

Modul rejasida "11-Dars: Loyiha Kodlash" deb yozilgan, tafsilot berilmagan. Bu dars ikkita maqsad bilan yozildi: **bosqichma-bosqich ishlash** va **xato tuzatish**.

Ikkinchisi ayniqsa muhim — ko'p dasturlash kurslarida xato o'qishni o'rgatishmaydi, holbuki bola vaqtining yarmini shunga sarflaydi.

---

## 💡 O'qituvchi uchun

- **Xato xabarlari demosi** — bu darsning eng qimmatli qismi. Bolalar qizil matnni ko'rib panika qiladi va o'qimaydi. Demoni sinfda birga ko'rib chiqing.
- Har bola kompyuterida **DevTools Console ochiq** tursin. Buni qoida qiling. Yopiq konsol bilan ishlash — ko'zni yumib haydash.
- **Bosqichma-bosqich ishlash** — bolalar qarshilik qiladi, ular "tez" yozishni xohlaydi. Bitta bolaning 100 qator yozib xato qidirayotganini ko'rsating (albatta bo'ladi) va taqqoslang.
- \`console.log\` ni **majburiy** qiling. "Ishlamayapti" deb kelgan bolaga birinchi savol: "\`console.log\` qo'ydingizmi?" Aksariyat hollarda javob "yo'q" bo'ladi.
- **Yordam berish tartibi:** javob bermang. Savol bering:
  1. "Konsolda nima yozilgan?"
  2. "Qaysi qatorda?"
  3. "O'sha qatorda nima bor?"
  4. "\`console.log\` qo'yib ko'rdingizmi?"

  To'rttadan keyin ham topilmasa — birga qarang.

## ⚠️ Bu darsda kuzatiladigan holatlar

- **"Ishlamayapti"** deb keladi, lekin konsolni ochmagan. Bu — eng ko'p uchraydigan.
- **Kodni ko'chirib olgan** — internetdan yoki sinfdoshdan. Aniqlash oson: bitta qatorni so'rang, tushuntira olmaydi.
- **Hammasini birdan yozgan** — 150 qator, hech narsa ishlamaydi. Yechim: oxirgi ishlagan holatga qaytarib, kichik qadamlar bilan davom ettirish.
- **Dizaynga vaqt sarflagan** — 40 daqiqa rang tanlaydi, funksiya yozilmagan. Qoida: **avval ishlasin**.
- **Chetki holatlarni sinamagan** — nolga bo'lish \`Infinity\` beradi va bola buni ko'rmaydi.
- **Reja unutilgan** — 10-darsdagi rejani ochmaydi. Boshida eslатing.

## ⏱ Vaqt taqsimoti

Bu dars **bir darsda tugamaydi**. Sinfda skeletni qurdiring (HTML + elementlarni topish + asosiy funksiya), qolgani uy vazifasi.

Agar guruh sekin bo'lsa, 11-darsni ikkiga bo'ling va Demo Day'ni keyinroq o'tkazing. Tugallanmagan loyihani taqdim qilish — bolaga foydasiz.

## 📊 Baholash

Bu darsda ball qo'ymang — bu ish kuni. 12-darsda baholaysiz.

Lekin **kuzating va yozib boring**:
- Kim konsolni ishlatdi?
- Kim xatoni o'zi topdi?
- Kim rejaga amal qildi?
`,
  },

  // ═══════════════════════════════════════════════════════════
  'junior.m2.l12': {
    goal: "4-oy loyihasini taqdim qilish va JS Logic Badge olish.",
    student: `
## 🏆 Bugun loyihangizni ko'rsatasiz

To'rt oy oldin siz HTML nima ekanini bilmasdingiz. Bugun **o'zingiz yozgan dastur** bor.

Bu — imtihon emas, **taqdimot**.

---

## 📚 4-oyda nimalarni o'rgandingiz

**Asoslar:** o'zgaruvchilar va ma'lumot turlari · operatorlar va shartlar · funksiyalar · tsikllar

**Ma'lumot tuzilmalari:** massivlar va ularning metodlari (\`map\`, \`filter\`, \`reduce\`) · obyektlar · destructuring

**Amaliy:** \`Math\` va tasodifiy sonlar · \`switch\` · \`??\` va qisqartmalar

Jami **12 ta dars**. Va bugun ularning hammasi bitta loyihada.

---

## 🎤 Taqdimotingiz — 5 daqiqa

### 1. Ishlatib ko'rsating (2 daqiqa)

- Dasturni oching
- Asosiy funksiyalarni ishlatib ko'rsating
- **Ataylab xato kiriting** — nolga bo'ling, bo'sh maydon qoldiring, harf yozing

Oxirgisi muhim: dastur xatoga qanday javob berishini ko'rsatish — bu **sifat belgisi**.

### 2. Kodni tushuntiring (2 daqiqa)

- "Eng muhim funksiyam bu — ..."
- "U shunday ishlaydi: ..."
- "Eng qiyin qism ... edi, uni ... bilan yechdim"

### 3. Savollar (1 daqiqa)

---

## ✅ Taqdimotdan oldin tekshiring

- Dastur xatosiz ishlaydimi?
- Konsolda qizil xato bormi? (F12 bilan tekshiring)
- Nolga bo'lish, bo'sh maydon, harf kiritish — sinab ko'rdingizmi?
- 10-darsdagi rejangiz yoningizdami?
- Uch savolga javobingiz tayyormi?

---

## 🤝 Sinfdoshlaringizni tinglash

Har taqdimotdan keyin **kamida bitta yaxshi narsa** ayting:

- "Xato xabarlari tushunarli chiqibdi"
- "Tarix qo'shganing yaxshi fikr"
- "Klaviatura bilan ishlashi qulay"

Boshqaning ishida nima yaxshi ekanini ko'ra bilish — o'z ishingizni yaxshilashga yordam beradi.

---

## 🚀 5-oyda nima bo'ladi

JavaScript'ni **sahifaga bog'laysiz**:

- DOM — sahifa elementlarini topish va o'zgartirish
- Hodisalar — bosish, yozish, klaviatura
- Dinamik elementlar yaratish
- \`localStorage\` — ma'lumotni saqlash
- Fetch API — internetdan ma'lumot olish

4-oyda **mantiq** o'rgandingiz. 5-oyda u **ko'rinadigan** bo'ladi.

> 🏆 **Tabriklaymiz!** Siz endi shartlar, tsikllar, funksiyalar, massivlar va obyektlar bilan ishlay olasiz. Bu — dasturlashning poydevori. Qolgan hamma narsa shunga quriladi.
`,
    teacher: `
## ⏰ Jadval (90 daqiqa)

| Vaqt | Faoliyat |
| --- | --- |
| 0:00 – 0:10 | 4-oy retrospektivi |
| 0:10 – 0:55 | Taqdimotlar (har o'quvchiga 5 daqiqa) |
| 0:55 – 1:10 | Umumiy fikrlar, eng ko'p uchragan muammolar |
| 1:10 – 1:20 | JS Logic Badge topshirish 🏅 |
| 1:20 – 1:30 | 5-oy anonsi: DOM va interaktiv sahifalar |

---

## 📝 Baholash formasi

\`\`\`text
O'quvchi: _______________________  Sana: ___________
Loyiha:  [ ] Kalkulyator   [ ] Sonni Top   [ ] O'z varianti

JS Sintaksis:        [ 1 ] [ 2 ] [ 3 ] [ 4 ] [ 5 ]
Mantiqiy Tafakkur:   [ 1 ] [ 2 ] [ 3 ] [ 4 ] [ 5 ]
Loyiha Sifati:       [ 1 ] [ 2 ] [ 3 ] [ 4 ] [ 5 ]
Kod Tozaligi:        [ 1 ] [ 2 ] [ 3 ] [ 4 ] [ 5 ]
Taqdimot:            [ 1 ] [ 2 ] [ 3 ] [ 4 ] [ 5 ]

Jami: ___ / 25

Topshiriq darajasi:  [ ] 🥉 Bronze  [ ] 🥈 Silver  [ ] 🥇 Gold

Rejaga amal qildimi: [ ] Ha  [ ] Qisman  [ ] Yo'q
Chetki holatlar:     [ ] Sinalgan  [ ] Sinalmagan

Ijobiy tomoni: ____________________________________
Yaxshilash uchun: _________________________________
\`\`\`

## 🏅 Badge tizimi

| Ball | Badge | Nima oladi |
| --- | --- | --- |
| 20 – 25 | 🥇 JS Logic Badge | Sertifikat + 5-oyga kirish |
| 15 – 19 | 🥈 Qoniqarli | Sertifikat + 5-oyga kirish |
| < 15 | 🥉 Qayta topshirish | 1 hafta ichida tugatish |

---

## 💡 O'qituvchi uchun

- **"Ataylab xato kiriting"** qismini talab qiling. Bu — loyiha sifatini ko'rsatuvchi eng tez usul. Nolga bo'lganda \`Infinity\` chiqsa yoki bo'sh maydonda \`NaN\` bo'lsa — chetki holatlar sinalmagan.
- **10-darsdagi rejani** yoningizda tuting. "Rejada 6 ta funksiya bor edi, nechtasi yozildi?" degan savol foydali. Rejadan chekinish yomon emas, lekin bola sababini bilishi kerak.
- **Kod tozaligini** alohida baholang. Ishlayotgan, lekin 200 qatorli bitta funksiya — bu Silver'dan yuqori emas. 5-oyda shu kodni kengaytirish kerak bo'ladi.
- Taqdimotdan qo'rqadigan bola bo'lsa, **yoniga o'tiring** va savol berib yordam bering. Majburlab yolg'iz gapirtirmang.
- Eng yaxshi ishlarni **turli nominatsiyalarda** belgilang: "Eng toza kod", "Eng ko'p chetki holat", "Eng qiziq g'oya". Shunda g'olib bitta emas.

## ⚠️ Oldindan tayyorlang

- Kompyuterlarni sinab ko'ring — loyiha ochilishi kerak
- Sertifikat yoki badge'larni **chop eting**
- Bolalarga bir hafta oldin eslating: loyiha tugagan bo'lsin
- Tugallanmagan loyihasi bor bolalarga **oldindan** qo'shimcha vaqt bering, Demo Day'da sharmanda qilmang

## 🎓 4-oy yakunlandi

O'quvchilar endi:

- O'zgaruvchilar, shartlar, tsikllar bilan ishlaydi
- Funksiya yozadi va qayta ishlatadi
- Massiv va obyekt bilan ma'lumot saqlaydi
- \`map\`, \`filter\`, \`reduce\` ni tushunadi
- Kichik dastur loyihalashtiradi va yozadi

5-oyda bu bilim **DOM** bilan birlashadi va sahifada ko'rinadigan bo'ladi.
`,
  },

  // ═══════════════════════════════════════════════════════════
  'junior.m2.l2': {
    goal: "Taqqoslash va mantiqiy operatorlar, if/else bilan shartli mantiq.",
    student: `
## ⚖️ Taqqoslash operatorlari

Dastur qaror qabul qilishi uchun avval **taqqoslashi** kerak.

\`\`\`javascript
5 > 3       // true
5 < 3       // false
5 >= 5      // true
5 <= 4      // false
\`\`\`

Tenglikni tekshirish uchun **ikki xil** operator bor va bu — JavaScript'dagi eng muhim bilimlardan biri:

\`\`\`demo h=360 "=== va == farqi"
<style>
  body { font-family: sans-serif; font-size: 13px; margin: 0; padding: 14px; }
  #out {
    background: #1f2937; border-radius: 8px; padding: 12px;
    font-family: monospace; font-size: 12px; line-height: 2; min-height: 230px;
  }
  #out div { border-bottom: 1px solid #374151; padding: 3px 0; color: #d1d5db; }
  .kod { color: #93c5fd; }
  .rost { color: #86efac; font-weight: bold; }
  .yolgon { color: #f87171; font-weight: bold; }
  .izoh { color: #9ca3af; }
  h3 { font-size: 13px; margin: 0 0 8px; color: #374151; }
</style>

<h3>Natija</h3>
<div id="out"></div>

<script>
  var out = document.querySelector('#out');
  function sina(kod, natija, izoh) {
    var d = document.createElement('div');
    var klass = natija ? 'rost' : 'yolgon';
    d.innerHTML = '<span class="kod">' + kod + '</span>' +
                  '  →  <span class="' + klass + '">' + natija + '</span>' +
                  (izoh ? '  <span class="izoh">// ' + izoh + '</span>' : '');
    out.appendChild(d);
  }

  sina('5 === 5', 5 === 5);
  sina('5 === "5"', 5 === "5", 'tur boshqa');
  sina('5 !== "5"', 5 !== "5");

  var bosh = document.createElement('div');
  bosh.innerHTML = '<span class="izoh">— — — == (xavfli) — — —</span>';
  out.appendChild(bosh);

  sina('5 == "5"', 5 == "5", 'XAVFLI: tur e\\'tiborsiz');
  sina('0 == false', 0 == false, 'XAVFLI');
  sina('"" == false', "" == false, 'XAVFLI');
  sina('null == undefined', null == undefined, 'XAVFLI');
</script>
\`\`\`

> ⚠️ **Qoida:** har doim \`===\` va \`!==\` (uch belgili) ishlating.
>
> \`==\` turlarni **avtomatik o'zgartiradi** va kutilmagan natija beradi. Yuqoridagi demoda ko'rdingiz: \`0 == false\` → \`true\`. Bu xatolarni topish juda qiyin.

---

## 🧠 Mantiqiy operatorlar

Bir nechta shartni birlashtirish uchun:

| Operator | Nomi | Qachon \`true\` |
| --- | --- | --- |
| \`&&\` | VA (AND) | **Ikkalasi** ham rost bo'lsa |
| \`\\|\\|\` | YOKI (OR) | **Kamida bittasi** rost bo'lsa |
| \`!\` | INKOR (NOT) | Teskarisiga aylantiradi |

\`\`\`javascript
const yosh = 16;
const litsenziya = false;

if (yosh >= 18 && litsenziya) {
  console.log("Mashina haydash mumkin");
} else {
  console.log("Mashina haydab bo'lmaydi");
}
\`\`\`

Bu yerda \`&&\` ikkala shartni ham talab qiladi. Yosh yetarli bo'lsa ham, litsenziya yo'q — demak yo'q.

---

## 🔀 if / else if / else

\`\`\`demo h=400 "Harorat — sonni o'zgartirib ko'ring"
<style>
  body { font-family: sans-serif; font-size: 13px; margin: 0; padding: 16px; text-align: center; }

  #harorat {
    font-size: 46px; font-weight: 700; margin: 0 0 4px;
    transition: color 0.3s;
  }
  #natija {
    font-size: 20px; margin: 0 0 18px; min-height: 26px;
  }

  input[type=range] { width: 85%; }
  .shkala {
    display: flex; justify-content: space-between;
    width: 85%; margin: 4px auto 0;
    font-size: 10px; color: #9ca3af;
  }

  #kod {
    margin-top: 16px; background: #1f2937; border-radius: 8px;
    padding: 10px; font-family: monospace; font-size: 11px;
    color: #d1d5db; text-align: left; line-height: 1.7;
  }
  .faol { color: #fbbf24; font-weight: bold; }
</style>

<p id="harorat">25°</p>
<p id="natija"></p>

<input type="range" id="slider" min="-15" max="45" value="25" />
<div class="shkala"><span>−15°</span><span>45°</span></div>

<div id="kod"></div>

<script>
  var slider = document.querySelector('#slider');
  var haroratEl = document.querySelector('#harorat');
  var natijaEl = document.querySelector('#natija');
  var kodEl = document.querySelector('#kod');

  function render() {
    var harorat = Number(slider.value);
    var natija = '';
    var faol = 0;

    if (harorat > 35)      { natija = '🔥 Juda issiq!'; faol = 1; }
    else if (harorat > 25) { natija = '☀️ Issiq';       faol = 2; }
    else if (harorat > 15) { natija = '🌤 Iliq';        faol = 3; }
    else if (harorat > 5)  { natija = '🌧 Salqin';      faol = 4; }
    else                   { natija = '❄️ Sovuq!';      faol = 5; }

    haroratEl.textContent = harorat + '°';
    haroratEl.style.color = harorat > 25 ? '#ef4444' : harorat > 5 ? '#f59e0b' : '#3b82f6';
    natijaEl.textContent = natija;

    var qatorlar = [
      'if (harorat > 35)      { "Juda issiq" }',
      'else if (harorat > 25) { "Issiq" }',
      'else if (harorat > 15) { "Iliq" }',
      'else if (harorat > 5)  { "Salqin" }',
      'else                   { "Sovuq" }'
    ];

    var html = '';
    for (var i = 0; i < qatorlar.length; i++) {
      var klass = (i + 1) === faol ? 'faol' : '';
      html += '<div class="' + klass + '">' + qatorlar[i] + '</div>';
    }
    kodEl.innerHTML = html;
  }

  slider.addEventListener('input', render);
  render();
</script>
\`\`\`

Slayderni suring — qaysi qator ishlayotgani **sariq rangda** belgilanadi.

Muhim nuqta: JavaScript shartlarni **yuqoridan pastga** tekshiradi va **birinchi rost topilganda to'xtaydi**. Qolganlari umuman tekshirilmaydi.

> ⚠️ Shuning uchun tartib muhim. Agar \`harorat > 5\` ni birinchi yozsangiz, 40 gradus ham "Salqin" chiqadi — chunki 40 > 5 rost va tekshirish o'sha yerda to'xtaydi.

---

## 🎯 Juft yoki toq

\`\`\`demo h=340 "% operatori amalda"
<style>
  body { font-family: sans-serif; font-size: 13px; margin: 0; padding: 16px; text-align: center; }
  input[type=number] {
    font-size: 26px; padding: 8px 14px; width: 130px; text-align: center;
    border: 2px solid #d1d5db; border-radius: 10px; outline: none;
  }
  input:focus { border-color: #6366f1; }
  #natija { font-size: 26px; font-weight: 700; margin: 18px 0 6px; min-height: 34px; }
  #hisob { font-family: monospace; font-size: 13px; color: #6b7280; }
  .juft { color: #16a34a; }
  .toq { color: #ea580c; }
</style>

<p style="color:#6b7280;margin:0 0 10px">Son kiriting:</p>
<input type="number" id="son" value="17" />

<p id="natija"></p>
<p id="hisob"></p>

<script>
  var input = document.querySelector('#son');
  var natijaEl = document.querySelector('#natija');
  var hisobEl = document.querySelector('#hisob');

  function render() {
    var son = Number(input.value);
    var qoldiq = son % 2;

    if (qoldiq === 0) {
      natijaEl.textContent = son + ' — JUFT';
      natijaEl.className = 'juft';
    } else {
      natijaEl.textContent = son + ' — TOQ';
      natijaEl.className = 'toq';
    }

    hisobEl.textContent = son + ' % 2 = ' + qoldiq;
  }

  input.addEventListener('input', render);
  render();
</script>
\`\`\`

\`%\` — bo'lgandagi **qoldiq**. Juft sonni 2 ga bo'lsangiz qoldiq \`0\`, toq bo'lsa \`1\`.

---

## ❓ Ternary — qisqartma if/else

\`\`\`javascript
// Uzun yozuv
let xabar;
if (yosh >= 18) {
  xabar = "Katta";
} else {
  xabar = "Kichik";
}

// Qisqa yozuv — shart ? rost : yolgon
const xabar2 = yosh >= 18 ? "Katta" : "Kichik";
\`\`\`

Ternary — faqat **ikki variant** bo'lganda va kod qisqa bo'lganda ishlating. Uchta va undan ko'p shartda oddiy \`if/else\` o'qishga qulayroq.

---

## 🔄 Truthy va Falsy

JavaScript'da \`if\` ichiga faqat \`true\`/\`false\` emas, **istalgan qiymat** yozish mumkin. U avtomatik "rost" yoki "yolg'on" deb baholanadi.

\`\`\`demo h=380 "Qaysi qiymat if ichida ishlaydi?"
<style>
  body { font-family: sans-serif; font-size: 13px; margin: 0; padding: 14px; }
  #out {
    background: #1f2937; border-radius: 8px; padding: 12px;
    font-family: monospace; font-size: 12px; line-height: 2; min-height: 260px;
  }
  #out div { border-bottom: 1px solid #374151; padding: 2px 0; }
  .kod { color: #93c5fd; }
  .rost { color: #86efac; font-weight: bold; }
  .yolgon { color: #f87171; font-weight: bold; }
  .sarlavha { color: #9ca3af; padding-top: 8px; }
  h3 { font-size: 13px; margin: 0 0 8px; color: #374151; }
</style>

<h3>if (...) ichida qanday baholanadi</h3>
<div id="out"></div>

<script>
  var out = document.querySelector('#out');

  function sarlavha(matn) {
    var d = document.createElement('div');
    d.className = 'sarlavha';
    d.textContent = matn;
    out.appendChild(d);
  }

  function sina(kod, qiymat) {
    var d = document.createElement('div');
    var natija = qiymat ? 'TRUTHY ✅' : 'FALSY ❌';
    var klass = qiymat ? 'rost' : 'yolgon';
    d.innerHTML = '<span class="kod">' + kod + '</span>' +
                  '  →  <span class="' + klass + '">' + natija + '</span>';
    out.appendChild(d);
  }

  sarlavha('— FALSY (atigi 6 ta) —');
  sina('false', false);
  sina('0', 0);
  sina('"" (bo\\'sh matn)', "");
  sina('null', null);
  sina('undefined', undefined);
  sina('NaN', NaN);

  sarlavha('— TRUTHY (qolgan hammasi) —');
  sina('"salom"', "salom");
  sina('1', 1);
  sina('-5', -5);
  sina('"0" (matn ichida nol)', "0");
  sina('[] (bo\\'sh massiv)', []);
  sina('{} (bo\\'sh obyekt)', {});
</script>
\`\`\`

**Falsy qiymatlar atigi 6 ta:** \`false\`, \`0\`, \`""\`, \`null\`, \`undefined\`, \`NaN\`. Qolgan **hamma narsa** truthy.

Ikkita tuzoqqa diqqat qiling:

- \`"0"\` — bu **matn**, shuning uchun truthy
- \`[]\` va \`{}\` — bo'sh bo'lsa ham truthy

Amalda bu shunday ishlatiladi:

\`\`\`javascript
const ism = "";

if (ism) {
  console.log("Salom!");
} else {
  console.log("Ism kiritilmagan!");
}
\`\`\`

---

## 🥉 Bronze Topshiriq

Ikkita son taqqoslang va qaysi biri kattaligini chiqaring. Teng bo'lsa ham aytsin.

---

## 🥈 Silver Topshiriq

- Son juft yoki toqligini aniqlang (\`%\` bilan)
- Xuddi shuni **ternary** bilan ham yozing
- Ikkalasining natijasi bir xil ekaniga ishonch hosil qiling

---

## 🥇 Gold Topshiriq

Baholar tizimi yozing:

\`\`\`javascript
// 90+ → "A'lo", 75+ → "Yaxshi", 55+ → "Qoniqarli", qolgani → "Qoniqarsiz"
\`\`\`

Qo'shimcha: \`&&\` va \`\\|\\|\` bilan chegirma shartini yozing — o'quvchi bo'lsa **yoki** 18 yoshdan kichik bo'lsa chegirma bor.

---

## ✅ Dars Xulosa

- \`===\` va \`!==\` — **har doim**. \`==\` xavfli
- \`&&\` — ikkalasi, \`||\` — kamida bittasi, \`!\` — teskarisi
- \`if/else if/else\` — **birinchi rost topilganda to'xtaydi**, tartib muhim
- \`%\` — qoldiq, juft/toq aniqlash
- Ternary — faqat ikki variant bo'lganda
- Falsy atigi 6 ta: \`false\`, \`0\`, \`""\`, \`null\`, \`undefined\`, \`NaN\`

> 🚀 **Keyingi dars:** Funksiyalar — qayta ishlatiladigan kod bloklari!
`,
    teacher: `
## 💡 O'qituvchi uchun

- \`===\` va \`==\` — bu darsning **eng muhim** qismi. Demo'dagi \`0 == false → true\` ni ko'rsating va so'rang: "bu qanday xatoga olib kelishi mumkin?" Bolalar o'zi misol topsin.
- Harorat demosi — \`if/else if\` zanjirini tushuntirishning eng tez yo'li. Slayderni sekin suring, qaysi qator yonayotganini kuzating. "Nega faqat bittasi?" degan savolga javob shu yerda ko'rinadi.
- **Tartib muhimligini** albatta ko'rsating. Demoni oching, \`harorat > 5\` shartini eng tepaga ko'chiring — hamma harorat "Salqin" bo'lib qoladi. Bu — kuchli namoyish.
- Truthy/Falsy'ni **yodlatmang**. Faqat oltita falsy borligini ayting va ro'yxatni ko'rsating. Qolgani o'z-o'zidan tushuniladi.
- \`[]\` va \`{}\` truthy ekani — bu keyinchalik massivlar bilan ishlaganda muammo keltiradi. Hozir aytib qo'ying, 5-darsda eslatasiz.

## ⚠️ Ko'p uchraydigan xatolar

- **\`=\` va \`===\` chalkashtirilgan** — \`if (x = 5)\` har doim rost. Bu — klassik xato va uni topish qiyin.
- **\`if\` dan keyin nuqta-vergul** — \`if (x > 5);\` shart ishlamaydi, blok har doim bajariladi.
- **\`else if\` o'rniga ketma-ket \`if\`** — hamma shart tekshiriladi, natija kutilmagan bo'ladi.
- **Shartlar noto'g'ri tartibda** — yuqoridagi harorat misoli.
- **\`&&\` va \`||\` chalkashtirilgan** — "yoshi 18 dan katta **va** 65 dan kichik" uchun \`&&\`, lekin bolalar \`||\` yozadi.
- **Ternary ichma-ich** — uch darajali ternary o'qib bo'lmaydi. Ikki variantdan ko'p bo'lsa \`if/else\` talab qiling.

## 📊 Daraja belgilash

- **Bronze** — if/else ishlaydi, uch holat qamrab olingan
- **Silver** — % bilan juft/toq, ternary ham yozilgan
- **Gold** — baholar tizimi, mantiqiy operatorlar to'g'ri ishlatilgan

> Gold'ni tekshirishda 89, 90, 74, 75 ballarni sinang. Chegara qiymatlarda xato ko'p chiqadi (\`>\` va \`>=\` chalkashligi).
`,
  },
};
