# 🏥 Tibbiyot — Tibbiyot Talabalari Uchun Assistent Dastur (Web, Android, iOS)

Universal cross-platform dastur: tibbiyot talabalari va yosh shifokorlar uchun sunʼiy intellekt (Google Gemini) yordamida rasmiy retseptura (`Rp.:`, `D.t.d.`, `S.`), klinik dozalar va lotincha tibbiy terminlar tahlili.

---

## 🎨 Dizayn Tizimi va Ranglar Palitrasi
* **Primary (Asosiy):** `#10367D` — Shohona to'q ko'k
* **Background (Fon):** `#EBEBEB` — Yumshoq neytral kulrang
* **Accent (Aksent):** `#A5CE00` — Bio-limon yashil

---

## 🚀 Dasturni ishga tushirish (Run)

### 1. Web brauzerda:
```bash
npm run web
```
Brauzerda `http://localhost:8081` ochiladi.

### 2. Android telefonda:
* Telefoningizga Google Play'dan **Expo Go** ilovasini o'rnating.
* Terminalda ishga tushiring:
  ```bash
  npm run android
  # yoki
  npx expo start
  ```
* Chiqqan QR-kodni telefoningizdagi Expo Go ilovasida skaner qiling.

### 3. iOS (iPhone / iPad) da:
* iPhone-ingizga App Store'dan **Expo Go** ilovasini yuklang.
* Terminalda:
  ```bash
  npx expo start
  ```
* iPhone kamerasi bilan QR-kodni skaner qiling va Expo Go da oching.

---

## 🧩 Asosiy Bo'limlar
1. 💊 **Retseptura AI:**
   * Dori nomini kiritish (Amoksitsillin, Seftriakson, Paratsetamol va h.k.).
   * Bemor toifasi tanlovi (Kattalar / Bolalar).
   * Shakli (Tabletkalar, Ampula, Malham va h.k.).
   * Natijada: Rasmiy lotincha `Rp.:` formati, farmakologik guruhi, dozalash, kontrendikatsiyalar va talaba uchun mnemotika.
2. 🏛️ **Lotincha Terminlar:**
   * Anatomik, klinik, farmatsevtik va patologik atamalar lug'ati.
   * Urg'u belgilari, grammatik kelishigi, o'zbekcha va ruscha tarjimalari.
   * Gemini AI orqali har qanday yangi lotincha so'zni chuqur etimologik tahlil qilish.
3. ⭐ **Saqlanganlar (Favorites):**
   * Retseptlar va terminlarni oflayn saqlash (`AsyncStorage`).
   * Supabase buluti bilan ixtiyoriy sinxronizatsiya.
4. ⚙️ **Sozlamalar:**
   * Google AI Studio (Gemini API) kalitini kiritish va jonli tekshirish.
   * Supabase URL va Anon Key integratsiyasi.
   * Tibbiy disclaimer.
