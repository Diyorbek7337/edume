/**
 * src/utils/subscriptions.js — haqiqiy modul testlari
 */
import { describe, it, expect } from 'vitest';
import {
  SUBSCRIPTION_PLANS,
  checkLimit,
  hasFeature,
  isTrialExpired,
  trialDaysLeft,
  getVisiblePlans,
  trialUpgradeHint,
  formatPrice,
} from '../utils/subscriptions';

describe('formatPrice — yiqilmasligi shart', () => {
  it('mavjud tarif narxini formatlaydi', () => {
    expect(formatPrice(SUBSCRIPTION_PLANS.pro)).toContain('199');
    expect(formatPrice(SUBSCRIPTION_PLANS.trial)).toBe('Bepul (30 kun)');
  });

  it('undefined plan bilan YIQILMAYDI (regressiya)', () => {
    // Markazda SUBSCRIPTION_PLANS'da yo'q tarif nomi turgan bo'lsa
    // SUBSCRIPTION_PLANS[sub] undefined qaytaradi. Ilgari bu yerda
    // undefined.price o'qilib butun Sozlamalar sahifasi yiqilardi:
    // "Cannot read properties of undefined (reading 'price')"
    expect(() => formatPrice(undefined)).not.toThrow();
    expect(() => formatPrice(null)).not.toThrow();
    expect(() => formatPrice({})).not.toThrow();
    expect(formatPrice(undefined)).toBe('—');
  });

  it("noma'lum tarif nomi Sozlamalar sahifasini yiqitmaydi", () => {
    expect(() => formatPrice(SUBSCRIPTION_PLANS['yolgon-tarif'])).not.toThrow();
  });
});

describe('getVisiblePlans — markaz turiga qarab tarif tanlash', () => {
  it("yakka o'qituvchiga Solo va Pro ko'rsatiladi (Basic emas)", () => {
    const plans = getVisiblePlans('solo', 'trial');
    expect(plans).toEqual(['solo', 'pro']);
    expect(plans).not.toContain('basic');
  });

  it("o'quv markazga Basic va Pro ko'rsatiladi (Solo emas)", () => {
    const plans = getVisiblePlans('center', 'trial');
    expect(plans).toEqual(['basic', 'pro']);
    expect(plans).not.toContain('solo');
  });

  it("type yo'q eski markazlar markaz sifatida ko'riladi", () => {
    // Migratsiyagacha yaratilgan markazlarda `type` maydoni yo'q
    expect(getVisiblePlans(undefined, 'trial')).toEqual(['basic', 'pro']);
  });

  it('Solo va Basic HECH QACHON birga ko\'rsatilmaydi', () => {
    // Asosiy pozitsiyalash qoidasi: Solo (100,000) Basic'dan (99,000) qimmat,
    // yonma-yon ko'rinsa mijoz chalkashadi.
    ['solo', 'center', undefined, null, 'boshqa'].forEach(type => {
      const plans = getVisiblePlans(type, 'trial');
      expect(plans.includes('solo') && plans.includes('basic')).toBe(false);
    });
  });

  it("joriy tarif ro'yxatda bo'lmasa ham ko'rsatiladi", () => {
    // super_admin markaz turiga mos kelmaydigan tarif bergan bo'lsa, mijoz
    // o'zi nimada turganini baribir ko'rishi kerak
    const plans = getVisiblePlans('center', 'solo');
    expect(plans[0]).toBe('solo');
    expect(plans).toContain('basic');
  });

  it("noma'lum joriy tarif ro'yxatga qo'shilmaydi", () => {
    expect(getVisiblePlans('center', 'yolgon-tarif')).toEqual(['basic', 'pro']);
  });

  it("trial joriy tarif sifatida qo'shilmaydi", () => {
    expect(getVisiblePlans('center', 'trial')).toEqual(['basic', 'pro']);
  });
});

describe('resolveCenterType — eski markazlar uchun migratsiya (backfill)', () => {
  const load = async () => (await import('../../functions/subscriptionLimits.js')).resolveCenterType;

  it("mavjud type ga TEGMAYDI (solo)", async () => {
    const resolveCenterType = await load();
    expect(resolveCenterType({ type: 'solo', subscription: 'pro' })).toBe('solo');
  });

  it("mavjud type ga TEGMAYDI (center)", async () => {
    const resolveCenterType = await load();
    // Tarifi solo bo'lsa ham, qo'lda 'center' qo'yilgan bo'lsa o'zgarmaydi
    expect(resolveCenterType({ type: 'center', subscription: 'solo' })).toBe('center');
  });

  it("tarifi 'solo' bo'lsa yakka o'qituvchi deb belgilanadi", async () => {
    const resolveCenterType = await load();
    expect(resolveCenterType({ subscription: 'solo' })).toBe('solo');
  });

  it("qolgan hamma holatda 'center' — hozirgi xatti-harakat saqlanadi", async () => {
    const resolveCenterType = await load();
    expect(resolveCenterType({ subscription: 'basic' })).toBe('center');
    expect(resolveCenterType({ subscription: 'trial' })).toBe('center');
    expect(resolveCenterType({})).toBe('center');
    expect(resolveCenterType(null)).toBe('center');
  });

  it("bitta o'qituvchisi borligiga qarab TAXMIN QILMAYDI", async () => {
    const resolveCenterType = await load();
    // Yangi ochilgan markazda ham 1 o'qituvchi bo'lishi mumkin — uni yakka
    // o'qituvchi deb belgilash noto'g'ri tarif ko'rsatishga olib kelardi
    expect(resolveCenterType({ subscription: 'basic', usage: { teachers: 1 } })).toBe('center');
  });

  it('idempotent — ikkinchi marta ishga tushirilganda natija o\'zgarmaydi', async () => {
    const resolveCenterType = await load();
    const first = resolveCenterType({ subscription: 'solo' });
    const second = resolveCenterType({ subscription: 'solo', type: first });
    expect(second).toBe(first);
  });

  it("natija getVisiblePlans tushunadigan qiymat bo'ladi", async () => {
    const resolveCenterType = await load();
    ['solo', 'basic', 'trial', 'pro'].forEach(sub => {
      const type = resolveCenterType({ subscription: sub });
      const plans = getVisiblePlans(type, sub);
      expect(plans.length).toBeGreaterThan(0);
      expect(plans.includes('solo') && plans.includes('basic')).toBe(false);
    });
  });
});

describe('trialUpgradeHint — banner narx matni', () => {
  it('narxlarni SUBSCRIPTION_PLANS dan oladi (qo\'lda yozilmaydi)', () => {
    const hint = trialUpgradeHint('center');
    expect(hint).toContain(SUBSCRIPTION_PLANS.basic.priceUzs.toLocaleString());
    expect(hint).toContain(SUBSCRIPTION_PLANS.pro.priceUzs.toLocaleString());
  });

  it("yakka o'qituvchiga Solo narxi ko'rsatiladi", () => {
    const hint = trialUpgradeHint('solo');
    expect(hint).toContain(SUBSCRIPTION_PLANS.solo.priceUzs.toLocaleString());
    expect(hint).not.toContain(SUBSCRIPTION_PLANS.basic.nameUz);
  });

  it('eskirgan 249,000 narxi qaytib kelmaydi (regressiya)', () => {
    // DashboardLayout'da qo'lda yozilgan Pro narxi 249,000 edi, aslida 199,000
    expect(SUBSCRIPTION_PLANS.pro.priceUzs).toBe(199000);
    expect(trialUpgradeHint('center')).not.toContain('249');
  });
});

describe('checkLimit', () => {
  it('limit ichida ruxsat beradi', () => {
    const result = checkLimit('basic', 'students', 50);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(50);
  });

  it('limitga yetganda bloklaydi', () => {
    const result = checkLimit('basic', 'students', 100);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it('cheksiz (-1) tarifda doim ruxsat beradi', () => {
    expect(checkLimit('pro', 'students', 10000).allowed).toBe(true);
    expect(checkLimit('trial', 'students', 10000).allowed).toBe(true);
  });

  it("noma'lum tarif trial deb qabul qilinadi", () => {
    expect(checkLimit('nonexistent', 'students', 5).allowed).toBe(true);
  });
});

describe('hasFeature', () => {
  it('pro tarifda telegram bor', () => {
    expect(hasFeature('pro', 'telegramNotifications')).toBe(true);
  });

  it('basic tarifda telegram yo\'q', () => {
    expect(hasFeature('basic', 'telegramNotifications')).toBe(false);
  });

  it("mavjud bo'lmagan feature false qaytaradi", () => {
    expect(hasFeature('pro', 'nonexistentFeature')).toBe(false);
  });
});

describe('isTrialExpired', () => {
  it('trial bo\'lmagan tarifda false', () => {
    expect(isTrialExpired({ subscription: 'pro' })).toBe(false);
  });

  it('muddati o\'tgan trialda true', () => {
    const past = new Date(Date.now() - 24 * 60 * 60 * 1000);
    expect(isTrialExpired({ subscription: 'trial', trialEndsAt: past.toISOString() })).toBe(true);
  });

  it('muddati o\'tmagan trialda false', () => {
    const future = new Date(Date.now() + 24 * 60 * 60 * 1000);
    expect(isTrialExpired({ subscription: 'trial', trialEndsAt: future.toISOString() })).toBe(false);
  });

  it('Firestore Timestamp (toDate) ni qabul qiladi', () => {
    const past = new Date(Date.now() - 1000);
    expect(isTrialExpired({ subscription: 'trial', trialEndsAt: { toDate: () => past } })).toBe(true);
  });
});

describe('trialDaysLeft', () => {
  it('qolgan kunlarni hisoblaydi', () => {
    const in5days = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
    const days = trialDaysLeft({ subscription: 'trial', trialEndsAt: in5days.toISOString() });
    expect(days).toBeGreaterThanOrEqual(4);
    expect(days).toBeLessThanOrEqual(5);
  });

  it("o'tgan muddat uchun 0 qaytaradi", () => {
    const past = new Date(Date.now() - 24 * 60 * 60 * 1000);
    expect(trialDaysLeft({ subscription: 'trial', trialEndsAt: past.toISOString() })).toBe(0);
  });

  it('trial bo\'lmagan tarifda null', () => {
    expect(trialDaysLeft({ subscription: 'pro' })).toBe(null);
  });
});

describe('SUBSCRIPTION_PLANS konsistentligi', () => {
  it('har bir tarifda limits va features bor', () => {
    for (const plan of Object.values(SUBSCRIPTION_PLANS)) {
      expect(plan.limits).toBeDefined();
      expect(plan.features).toBeDefined();
      expect(plan.limits.students).toBeDefined();
      expect(plan.limits.teachers).toBeDefined();
      expect(plan.limits.groups).toBeDefined();
    }
  });

  it('Cloud Functions dagi SUBSCRIPTION_LIMITS frontend bilan sinxron', async () => {
    // functions/subscriptionLimits.js qo'lda sinxron tutiladi — bu test
    // ikkisi ajralib ketsa CI da ushlab qoladi
    const { SUBSCRIPTION_LIMITS } = await import('../../functions/subscriptionLimits.js');
    for (const [planKey, limits] of Object.entries(SUBSCRIPTION_LIMITS)) {
      const plan = SUBSCRIPTION_PLANS[planKey];
      expect(plan, `${planKey} tarifi frontendda yo'q`).toBeDefined();
      expect(limits.students).toBe(plan.limits.students);
      expect(limits.teachers).toBe(plan.limits.teachers);
      expect(limits.groups).toBe(plan.limits.groups);
    }
  });
});

// ==================== OBUNA HOLATI (getCenterAccess) ====================
import { getCenterAccess, isCenterWritable, extendFrom, GRACE_DAYS } from '../utils/subscriptions';

describe('getCenterAccess — muddat, imtiyoz, faqat-o\'qish', () => {
  const NOW = new Date('2026-10-10T12:00:00Z');
  const days = (d) => new Date(NOW.getTime() + d * 24 * 60 * 60 * 1000);

  it('sinov tugamagan — active, qolgan kunlar hisoblanadi', () => {
    const a = getCenterAccess({ subscription: 'trial', trialEndsAt: days(5) }, NOW);
    expect(a.state).toBe('active');
    expect(a.daysLeft).toBe(5);
  });

  it('sinov kecha tugagan — grace (imtiyoz), yozish mumkin', () => {
    const c = { subscription: 'trial', trialEndsAt: days(-1) };
    expect(getCenterAccess(c, NOW).state).toBe('grace');
    expect(isCenterWritable(c, NOW)).toBe(true);
  });

  it(`${GRACE_DAYS} kundan ko'p o'tgan — expired, yozish mumkin emas`, () => {
    const c = { subscription: 'trial', trialEndsAt: days(-(GRACE_DAYS + 1)) };
    expect(getCenterAccess(c, NOW).state).toBe('expired');
    expect(isCenterWritable(c, NOW)).toBe(false);
  });

  it("pullik tarif paidUntil bo'yicha tekshiriladi (trialEndsAt e'tiborga olinmaydi)", () => {
    expect(getCenterAccess({ subscription: 'pro', trialEndsAt: days(-100), paidUntil: days(10) }, NOW).state).toBe('active');
    expect(getCenterAccess({ subscription: 'basic', paidUntil: days(-10) }, NOW).state).toBe('expired');
  });

  it("pullik tarif, paidUntil yo'q (eski mijoz) — muddatsiz active", () => {
    const a = getCenterAccess({ subscription: 'pro', trialEndsAt: null }, NOW);
    expect(a.state).toBe('active');
    expect(a.endsAt).toBeNull();
  });

  it("suspended — muddatdan qat'i nazar faqat o'qish", () => {
    const c = { subscription: 'pro', status: 'suspended', paidUntil: days(30) };
    expect(getCenterAccess(c, NOW).state).toBe('suspended');
    expect(isCenterWritable(c, NOW)).toBe(false);
  });

  it('Firestore Timestamp (toDate) ham qabul qilinadi', () => {
    const ts = { toDate: () => days(2) };
    expect(getCenterAccess({ subscription: 'trial', trialEndsAt: ts }, NOW).state).toBe('active');
  });

  it("markaz ma'lumoti yo'q bo'lsa active (ilova yiqilmaydi)", () => {
    expect(getCenterAccess(null, NOW).state).toBe('active');
  });
});

describe('extendFrom — obunani uzaytirish', () => {
  const NOW = new Date('2026-10-10T12:00:00Z');
  const DAY = 24 * 60 * 60 * 1000;

  it("muddat hali tugamagan — joriy muddat ustiga qo'shiladi (oldindan to'lov yo'qolmaydi)", () => {
    const current = new Date(NOW.getTime() + 10 * DAY);
    expect(extendFrom(current, 30, NOW).getTime()).toBe(current.getTime() + 30 * DAY);
  });

  it('muddat tugagan — bugundan boshlab hisoblanadi', () => {
    const past = new Date(NOW.getTime() - 20 * DAY);
    expect(extendFrom(past, 30, NOW).getTime()).toBe(NOW.getTime() + 30 * DAY);
  });

  it("muddat yo'q — bugundan boshlab", () => {
    expect(extendFrom(null, 30, NOW).getTime()).toBe(NOW.getTime() + 30 * DAY);
  });
});
