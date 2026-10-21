/**
 * studentsAPI — o'quvchi/ota-ona boshqa talabalarning to'liq yozuvlarini
 * olmasligi kerak: filtrsiz `students` so'rovi yuborilmaydi, qolganlar
 * student_directory'dan (faqat ism/guruh) keladi.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

const calls = [];
let viewer = { role: 'student', uid: 'u1', childIds: [] };

vi.mock('firebase/firestore', () => ({
  collection: (_db, path) => ({ kind: 'collection', path }),
  doc: (_db, path, id) => ({ kind: 'doc', path: id ? `${path}/${id}` : path, id }),
  query: (ref, ...filters) => ({ ...ref, filters }),
  where: (field, op, value) => ({ field, op, value }),
  orderBy: () => ({}), limit: () => ({}), serverTimestamp: () => 'ts', getFirestore: () => ({}),
  increment: () => ({}), arrayUnion: () => ({}),
  addDoc: vi.fn(), updateDoc: vi.fn(), deleteDoc: vi.fn(), setDoc: vi.fn(),
  writeBatch: vi.fn(), runTransaction: vi.fn(),
  getDocs: vi.fn(async (ref) => {
    calls.push({ type: 'getDocs', path: ref.path, filters: ref.filters || [] });
    const rows = {
      'centers/c1/students': ref.filters?.[0]?.field === 'userId'
        ? [{ id: 's-me', data: { fullName: 'Men', phone: '+998901111111', parentPhone: '+998902222222', groupId: 'g1', userId: 'u1' } }]
        : [{ id: 's-me', data: {} }, { id: 's-other', data: { phone: 'SECRET' } }],
      'centers/c1/student_directory': [
        { id: 's-me', data: { fullName: 'Men', groupId: 'g1' } },
        { id: 's-other', data: { fullName: 'Sinfdosh', groupId: 'g1' } },
        { id: 's-far', data: { fullName: 'Boshqa guruh', groupId: 'g2' } },
      ],
    }[ref.path] || [];
    const filtered = rows.filter((r) => !(ref.filters || []).some((f) => f.field === 'groupId' && r.data.groupId !== f.value));
    return { docs: filtered.map((r) => ({ id: r.id, data: () => r.data, exists: () => true })) };
  }),
  getDoc: vi.fn(async (ref) => {
    calls.push({ type: 'getDoc', path: ref.path });
    const exists = ref.path === 'centers/c1/students/kid-1';
    return { id: ref.id, exists: () => exists, data: () => ({ fullName: 'Farzand', parentPhone: '+998903333333', groupId: 'g1' }) };
  }),
}));
vi.mock('firebase/auth', () => ({ createUserWithEmailAndPassword: vi.fn(), getAuth: vi.fn(), signOut: vi.fn() }));
vi.mock('firebase/app', () => ({ initializeApp: vi.fn(), getApps: () => [], getApp: vi.fn() }));
vi.mock('firebase/storage', () => ({ ref: vi.fn(), uploadBytes: vi.fn(), getDownloadURL: vi.fn() }));
vi.mock('react-toastify', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));
vi.mock('../services/sentry', () => ({ captureError: vi.fn() }));
vi.mock('../services/firebase', () => ({
  db: {}, storage: {},
  getCurrentCenter: () => 'c1',
  getCenterCollection: (n) => `centers/c1/${n}`,
  assertCenterWritable: () => {},
  getViewer: () => viewer,
  isLearnerViewer: () => viewer.role === 'student' || viewer.role === 'parent',
}));

const { studentsAPI } = await import('../services/api');

beforeEach(() => { calls.length = 0; });

describe("studentsAPI — o'quvchi", () => {
  beforeEach(() => { viewer = { role: 'student', uid: 'u1', childIds: [] }; });

  it("filtrsiz students so'rovi YUBORILMAYDI", async () => {
    await studentsAPI.getAll();
    const unfiltered = calls.filter((c) => c.type === 'getDocs' && c.path === 'centers/c1/students' && c.filters.length === 0);
    expect(unfiltered).toHaveLength(0);
  });

  it("o'z yozuvi to'liq (isMine), boshqalar — faqat katalog maydonlari", async () => {
    const list = await studentsAPI.getAll();
    const me = list.find((s) => s.id === 's-me');
    const other = list.find((s) => s.id === 's-other');
    expect(me.isMine).toBe(true);
    expect(me.phone).toBe('+998901111111');
    expect(other.isDirectoryEntry).toBe(true);
    expect(other.phone).toBeUndefined();
    expect(list.filter((s) => s.id === 's-me')).toHaveLength(1); // takrorlanmaydi
  });

  it('getByGroup faqat shu guruhni qaytaradi', async () => {
    const list = await studentsAPI.getByGroup('g1');
    expect(list.map((s) => s.id).sort()).toEqual(['s-me', 's-other']);
  });
});

describe("studentsAPI — ota-ona", () => {
  beforeEach(() => { viewer = { role: 'parent', uid: 'p1', childIds: ['kid-1', 'deleted-kid'] }; });

  it("farzandlar childIds bo'yicha get() bilan olinadi, o'chirilganlari tashlab ketiladi", async () => {
    const mine = await studentsAPI.getMine();
    expect(mine.map((s) => s.id)).toEqual(['kid-1']);
    expect(mine[0].isMine).toBe(true);
    expect(calls.some((c) => c.type === 'getDocs' && c.path === 'centers/c1/students')).toBe(false);
  });
});

describe('studentsAPI — xodim', () => {
  beforeEach(() => { viewer = { role: 'director', uid: 'd1', childIds: [] }; });

  it("to'liq ro'yxat odatdagidek", async () => {
    await studentsAPI.getAll();
    expect(calls.some((c) => c.path === 'centers/c1/students' && c.filters.length === 0)).toBe(true);
    expect(calls.some((c) => c.path === 'centers/c1/student_directory')).toBe(false);
  });
});
