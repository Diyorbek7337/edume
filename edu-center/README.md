# EduCenter - O'quv Markaz Boshqaruv Tizimi

## 🚀 O'rnatish

### 1. Loyihani ochish
```bash
unzip edu-center-v2.zip
cd edu-center
npm install
```

### 2. Firebase sozlash

#### Firebase Console'da:
1. https://console.firebase.google.com ga kiring
2. Yangi loyiha yarating (yoki mavjudini tanlang)
3. **Authentication** > Sign-in method > **Email/Password** ni yoqing
4. **Firestore Database** yarating (test mode yoki production)
5. Project Settings > Your apps > **Web app** qo'shing
6. Konfiguratsiyani nusxalang

### 3. .env fayl yaratish
Loyiha papkasida `.env` fayl yarating:
```
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### 4. ⚠️ MUHIM: Birinchi Direktor yaratish

#### A) Firebase Console > Authentication > Users > Add user:
- Email: `director@educenter.uz` (yoki boshqa email)
- Password: `parol123` (yoki boshqa parol)
- **"Add user" tugmasini bosing**
- Yaratilgan **User UID** ni nusxalang (masalan: `abc123xyz`)

#### B) Firebase Console > Firestore Database:
1. **"Start collection"** tugmasini bosing
2. Collection ID: `users`
3. Document ID: **yuqoridagi User UID** (`abc123xyz`)
4. Maydonlarni qo'shing:

| Maydon | Turi | Qiymat |
|--------|------|--------|
| fullName | string | Direktor Ismi |
| email | string | director@educenter.uz |
| role | string | **director** |
| phone | string | +998901234567 |

5. **"Save"** tugmasini bosing

### 5. Firestore Rules ni yuklash

Firebase Console > Firestore > Rules bo'limiga `firestore.rules` faylidagi kodlarni nusxalang va **"Publish"** bosing.

### 6. Loyihani ishga tushirish
```bash
npm run dev
```

Brauzerda: http://localhost:5173

---

## 👥 Foydalanuvchi rollari va huquqlari

| Rol | Qiymat | Huquqlar |
|-----|--------|----------|
| **Direktor** | `director` | Barcha huquqlar + Admin yaratish + Sozlamalar |
| **Admin** | `admin` | O'qituvchi, O'quvchi, Guruh, Lid, To'lov boshqarish |
| **O'qituvchi** | `teacher` | Davomat olish, Baho qo'yish, Xabar yuborish |
| **O'quvchi** | `student` | O'z ko'rsatkichlarini ko'rish, Taklif yuborish |
| **Ota-ona** | `parent` | Farzand ko'rsatkichlarini ko'rish |

---

## 🔄 Tizim ishlash tartibi

```
1. Firebase Console'da Direktor yarating
           ↓
2. Direktor tizimga kiradi
           ↓
3. Direktor → "Adminlar" sahifasidan Admin qo'shadi
           ↓
4. Admin tizimga kiradi (o'z email/parol bilan)
           ↓
5. Admin → O'qituvchi, O'quvchi, Guruh qo'shadi
           ↓
6. O'qituvchi → Davomat oladi, Baho qo'yadi
           ↓
7. O'quvchi/Ota-ona → Ko'rsatkichlarini ko'radi
```

---

## 📱 Sahifalar

### Direktor ko'radi:
- ✅ Bosh sahifa (Dashboard)
- ✅ **Adminlar** - Admin qo'shish/o'chirish
- ✅ O'quvchilar
- ✅ O'qituvchilar
- ✅ Guruhlar
- ✅ Lidlar
- ✅ To'lovlar
- ✅ Davomat
- ✅ Baholar
- ✅ Xabarlar
- ✅ Hisobotlar
- ✅ **Sozlamalar**
- ✅ Profil

### Admin ko'radi:
- ✅ Bosh sahifa
- ✅ O'quvchilar - Qo'shish/Tahrirlash/O'chirish
- ✅ O'qituvchilar - Qo'shish/Tahrirlash/O'chirish
- ✅ Guruhlar - Qo'shish/Tahrirlash/O'chirish
- ✅ Lidlar
- ✅ To'lovlar
- ✅ Davomat
- ✅ Baholar
- ✅ Xabarlar
- ✅ Hisobotlar
- ✅ Profil

### O'qituvchi ko'radi:
- ✅ Bosh sahifa
- ✅ Guruhlarim
- ✅ O'quvchilarim
- ✅ Davomat olish
- ✅ Baho qo'yish
- ✅ Xabarlar
- ✅ Profil

### O'quvchi/Ota-ona ko'radi:
- ✅ Bosh sahifa (Ko'rsatkichlar)
- ✅ Baholarim
- ✅ Davomatim
- ✅ To'lovlarim
- ✅ Taklif/Shikoyat yuborish
- ✅ Xabarlar
- ✅ Profil

---

## 🔧 Texnologiyalar

- React 18 + Vite
- Tailwind CSS
- Firebase (Auth + Firestore)
- React Router v6
- Recharts (grafiklar)
- Lucide Icons

---

## ❓ Muammolar va yechimlari

### "Missing or insufficient permissions" xatosi
**Sabab:** Firestore rules noto'g'ri yoki users kolleksiyasida rol yo'q

**Yechim:**
1. Firebase Console > Firestore > Rules - firestore.rules ni nusxalang
2. users kolleksiyasida document ID = Firebase Auth User UID bo'lishi kerak
3. `role` maydoni aniq `director`, `admin`, `teacher`, `student`, `parent` bo'lishi kerak

### Login qilganda noto'g'ri dashboard ochiladi
**Sabab:** users kolleksiyasida role maydoni noto'g'ri

**Yechim:** role maydoni qiymatini tekshiring - katta-kichik harflar muhim!

---

## 📞 Yordam kerakmi?

Savollar bo'lsa, murojaat qiling!
