# EduCenter — o'quv markazlar va yakka o'qituvchilar uchun boshqaruv tizimi

Multi-tenant SaaS: har bir o'quv markaz (yoki repetitor) `/register` orqali o'zi ro'yxatdan o'tadi, 30 kunlik sinov oladi, keyin tarif tanlaydi. Ota-onalar va o'quvchilar uchun Telegram bot alohida loyihada (`edu-center-bot`).

**Stack:** React 18 + Vite (PWA), Tailwind, Firebase (Auth, Firestore, Storage, Cloud Functions), i18n (uz/ru/en), Sentry, App Check.

---

## Tariflar va obuna muddati

| Tarif | Narx | O'quvchi | O'qituvchi | Guruh | Admin |
|---|---|---|---|---|---|
| Sinov (trial) | bepul, 30 kun | cheksiz | cheksiz | cheksiz | cheksiz |
| Yakka o'qituvchi (solo) | 100 000 so'm/oy | 150 | 1 | 12 | 1 |
| Asosiy (basic) | 99 000 so'm/oy | 100 | 10 | 20 | 2 |
| Pro | 199 000 so'm/oy | cheksiz | cheksiz | cheksiz | cheksiz |

Narx va limitlar manbai: `src/utils/subscriptions.js` va `functions/subscriptionLimits.js`. Ikkalasini qo'lda bir xil tuting.

**Muddat qanday ishlaydi:**

- Sinovda muddat `centers/{id}.trialEndsAt`, pullik tarifda `centers/{id}.paidUntil` maydonida turadi.
- Muddat tugagach **3 kunlik imtiyoz** beriladi. Bu davrda hamma narsa ishlaydi, faqat ogohlantirish banneri chiqadi.
- Imtiyoz tugagach markaz **faqat ko'rish rejimiga** o'tadi. Ma'lumotlar saqlanadi va ko'rinadi, lekin yangi o'quvchi, to'lov, davomat, baho kiritib bo'lmaydi. Bot ham ota-onalarga xabar yubormaydi. Direktor esa `/pricing` sahifasidan tarif arizasini yubora oladi.
- `status: 'suspended'` bo'lgan markaz ham xuddi shunday, lekin darhol, faqat ko'rish rejimida bo'ladi.
- Pullik markazda `paidUntil` yo'q bo'lsa (eski mijozlar), muddatsiz ishlaydi.

Server tomonda cheklov `firestore.rules` (`centerWritable`) orqali ishlaydi. Brauzer tomonda `src/services/firebase.js` (`assertCenterWritable`) tushunarli xato xabarini ko'rsatadi. Bir xil mantiq 3 joyda yozilgan: `firestore.rules`, `src/utils/subscriptions.js` (`getCenterAccess`) va bot loyihasidagi `functions/centerAccess.js`.

### Mijoz to'lov qilganda (super_admin)

1. `/super-admin` sahifasini oching va markazni toping.
2. **Tarif** tanlovidan kerakli tarifni tanlang. Birinchi marta pullik tarif berilganda `paidUntil` avtomatik ravishda bugundan +30 kun bo'ladi.
3. Keyingi oylarda to'lov kelganda **«+30 kun»** tugmasini bosing. Muddat hali tugamagan bo'lsa, 30 kun joriy muddat ustiga qo'shiladi. Tugagan bo'lsa, bugundan boshlab hisoblanadi.
4. Tarif arizasini «bajarildi» deb belgilang.

Direktor tarifni, muddatni, limitlarni yoki hisoblagichlarni o'zi o'zgartira olmaydi. Buni `firestore.rules` bloklaydi.

---

## Mahalliy ishga tushirish

```bash
npm install
cp .env.example .env        # Firebase web-app konfiguratsiyasini to'ldiring
npm run dev                 # http://localhost:5173
```

`.env` maydonlari: `VITE_FIREBASE_*` (majburiy), `VITE_RECAPTCHA_SITE_KEY` (App Check, prod'da tavsiya etiladi), `VITE_SENTRY_DSN` (ixtiyoriy).

Cloud Functions uchun `functions/.env` fayli kerak (`functions/.env.example`'ga qarang).

### Birinchi super_admin

1. Firebase Console → Authentication → foydalanuvchi qo'shing va uning UID'sini nusxalang.
2. Firestore → `users/{UID}` hujjatini yarating: `{ role: "super_admin", fullName: "...", email: "..." }`.
3. `/login` orqali kiring. Sizni avtomatik `/super-admin` sahifasiga yo'naltiradi.

Markazlar (direktorlar) `/register` sahifasi orqali o'zlari ro'yxatdan o'tadi, qo'lda yaratish shart emas.

---

## Deploy

```bash
npm run test:run            # unit testlar
npm run test:rules          # firestore.rules testlari (Java 11+ va Firebase emulator kerak)
npm run build
firebase deploy --only firestore:rules,firestore:indexes,functions:crm,hosting
```

### ⚠️ Shu relizni deploy qilishdan oldin (bir martalik)

Yangi qoidalar sinov muddati allaqachon tugagan markazlarni darhol faqat ko'rish rejimiga o'tkazadi. Ilgari muddat hech narsani bloklamagan edi. Shuning uchun:

```bash
# 1) Kimga ta'sir qilishini ko'ring (hech narsa yozmaydi):
node functions/scripts/subscriptionReport.js --project=<firebase-project-id>

# 2) Kerak bo'lsa, muddati o'tgan barcha sinovlarga bugundan +7 kun bering
#    (mijozlarga tarif tanlashga vaqt beriladi):
node functions/scripts/subscriptionReport.js --project=<id> --extend-expired-trials=7
```

Hisobotda «Pullik, lekin paidUntil yo'q» deb chiqqan markazlar muddatsiz ishlayveradi. Ularga SuperAdmin'da «+30 kun» bosib, to'lov sanasini boshlab qo'ying.

Rules testlarini deploy'dan oldin albatta ishga tushiring: `npm run test:rules`. Ota-onaning to'lovlarni ko'rish qoidasi o'zgargan, test shu holatni tekshiradi.

### ⚠️ O'quvchi ma'lumotlari maxfiyligi — deploy TARTIBI muhim

O'quvchi va ota-ona endi markazdagi barcha talabalar ro'yxatini (telefon, ota-ona telefoni, manzil, chegirma bilan) ololmaydi. Ular faqat o'z yozuvini ko'radi:

- o'quvchi — `students.userId` orqali;
- ota-ona — `users.childIds` orqali.

Sinfdoshlarning esa faqat ismi, guruhi va holati ko'rinadi (`centers/{id}/student_directory`). Bog'lanishlarni Cloud Functions avtomatik yuritadi. Mavjud ma'lumotlarni esa bir marta migratsiya qilish kerak. Deploy qadamlarini **shu tartibda** bajaring:

```bash
# 1) Avval functions (yangi triggerlar: onStudentWrittenPrivacy, onUserCreatedLink)
firebase deploy --only functions:crm

# 2) Mavjud ma'lumotlar: katalog + bog'lanishlar. Avval hisobotni ko'ring:
node functions/scripts/backfillStudentPrivacy.js --project=<id> --dry-run
node functions/scripts/backfillStudentPrivacy.js --project=<id>

# 3) Hisobotdagi "⚠" ro'yxatini ko'rib chiqing: farzandi topilmagan ota-onalar va
#    talaba yozuvi topilmagan o'quvchilar. Students sahifasida ularning telefoni yoki
#    "Ota-ona telefoni" maydonini to'g'rilang — trigger o'zi bog'laydi.

# 4) Shundan keyingina rules va sayt
firebase deploy --only firestore:rules,hosting
```

Rules deploy qilinib, backfill qilinmagan bo'lsa, bog'lanmagan o'quvchi va ota-onalar o'z ma'lumotlarini ko'rmay qoladi.

---

## Rollar

| Rol | Nima qila oladi |
|---|---|
| `super_admin` | Barcha markazlar, tariflar, muddatlar |
| `director` | O'z markazida hamma narsa, adminlar, sozlamalar, tarif arizasi |
| `admin` | Direktor bergan modullar (`permissions`) doirasida |
| `teacher` | O'z guruhlari: davomat, baho, uy vazifasi, test |
| `student` / `parent` | O'z (farzandining) baholari, davomati, to'lovlari, jadvali |

---

## Loyiha tuzilmasi

```
src/pages/            sahifalar (Students, Payments, Attendance, ...)
src/services/api.js   Firestore bilan barcha ishlash (markaz kolleksiyalari)
src/utils/            tariflar, qarz hisobi, validatsiya
functions/            Cloud Functions (codebase: crm) — limit hisoblagichlari, daromad statistikasi, lidlar
functions/scripts/    bir martalik migratsiya va hisobot skriptlari
tests/rules/          firestore.rules testlari (emulator)
```
