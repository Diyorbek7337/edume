import { defineConfig } from 'vitest/config';

// Firestore xavfsizlik qoidalarini real emulator ustida testlash uchun
// alohida konfiguratsiya — asosiy `npm test`dan ajratilgan, chunki bu
// testlar Firestore emulator (va u orqali Java) talab qiladi.
// Ishga tushirish: npm run test:rules
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.js'],
    testTimeout: 20000,
    hookTimeout: 20000,
  },
});
