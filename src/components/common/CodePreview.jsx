import { useEffect, useMemo, useRef, useState } from 'react';

/**
 * Kod + jonli natija.
 *
 * Chapda kod, o'ngda brauzerda qanday ko'rinishi. O'quvchi kodni
 * TAHRIRLAY oladi va natija darhol o'zgaradi — bu darslikni o'qishdan
 * ko'ra tezroq o'rgatadi.
 *
 * XAVFSIZLIK:
 * Kod <iframe sandbox="allow-scripts"> ichida ishlaydi. `allow-same-origin`
 * ATAYLAB berilmagan — shuning uchun iframe ichidagi kod:
 *   • ota sahifaga (CRM'ga) tegolmaydi
 *   • localStorage, cookie, Firebase sessiyasiga kirolmaydi
 *   • foydalanuvchi nomidan so'rov yubora olmaydi
 * Ya'ni o'quvchi nima yozsa ham, u faqat o'sha oynacha ichida qoladi.
 */

// Har bir demo ichida ishlaydigan asosiy uslublar — o'quvchi yozgan kod
// bo'sh sahifada emas, tartibli muhitda ko'rinsin.
const BASE_CSS = `
  *, *::before, *::after { box-sizing: border-box; }
  body {
    margin: 0;
    padding: 16px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
    font-size: 15px;
    line-height: 1.5;
    color: #1f2937;
    background: #ffffff;
  }
`;

const buildDoc = (code) => `<!DOCTYPE html>
<html lang="uz">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>${BASE_CSS}</style>
</head>
<body>
${code}
</body>
</html>`;

// Responsive darslar uchun qurilma kengliklari.
// Media query iframe kengligiga qarab ishlaydi, shuning uchun kenglikni
// o'zgartirish — breakpoint'larni jonli ko'rsatishning eng oson yo'li.
const DEVICES = [
  { id: 'mobile', label: '📱 375px', width: 375 },
  { id: 'tablet', label: '📱 768px', width: 768 },
  { id: 'full', label: '🖥 To\'liq', width: null },
];

const CodePreview = ({
  code = '',
  height = 220,
  editable = true,
  label,
  // responsive: kod tepada, natija pastda to'liq kenglikda + qurilma tugmalari
  responsive = false,
}) => {
  const original = useMemo(() => code.trim(), [code]);
  const [draft, setDraft] = useState(original);
  const [applied, setApplied] = useState(original);
  const [isEditing, setIsEditing] = useState(false);
  const [device, setDevice] = useState('full');
  const timer = useRef(null);

  // Dars almashsa — kodni yangisiga qaytaramiz
  useEffect(() => {
    setDraft(original);
    setApplied(original);
    setIsEditing(false);
  }, [original]);

  // Yozayotganda har harfda iframe qayta yuklanmasin
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setApplied(draft), 400);
    return () => timer.current && clearTimeout(timer.current);
  }, [draft]);

  const isDirty = draft !== original;
  const activeWidth = DEVICES.find(d => d.id === device)?.width ?? null;

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
      <div className="flex items-center justify-between gap-2 px-3 py-2 bg-gray-50 border-b border-gray-200">
        <span className="text-xs font-semibold text-gray-600">
          {label || 'Jonli misol'}
        </span>
        <div className="flex items-center gap-2">
          {isDirty && (
            <button
              type="button"
              onClick={() => setDraft(original)}
              className="text-xs text-gray-500 hover:text-gray-800 hover:underline"
            >
              Asliga qaytarish
            </button>
          )}
          {editable && (
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs font-medium text-primary-600 hover:underline"
            >
              {isEditing ? 'Tahrirlashni yopish' : "O'zgartirib ko'rish"}
            </button>
          )}
        </div>
      </div>

      {/* Qurilma kengligi tugmalari — faqat responsive rejimda */}
      {responsive && (
        <div className="flex items-center gap-2 px-3 py-2 bg-white border-b border-gray-200">
          <span className="text-xs text-gray-500">Ekran kengligi:</span>
          {DEVICES.map(d => (
            <button
              key={d.id}
              type="button"
              onClick={() => setDevice(d.id)}
              className={`text-xs px-2.5 py-1 rounded-lg border transition ${
                device === d.id
                  ? 'bg-primary-500 text-white border-primary-500'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      )}

      <div
        className={
          responsive
            ? 'divide-y divide-gray-200'
            : 'grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-200'
        }
      >
        {/* Kod */}
        <div className="min-w-0">
          {isEditing ? (
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              spellCheck={false}
              style={{ height }}
              className="w-full bg-gray-900 text-gray-100 font-mono text-[13px] leading-relaxed p-3 outline-none resize-y"
            />
          ) : (
            <pre
              style={{ height, overflow: 'auto' }}
              className="bg-gray-900 p-3 text-[13px] leading-relaxed m-0"
            >
              <code className="font-mono text-gray-100 whitespace-pre">{draft}</code>
            </pre>
          )}
        </div>

        {/* Natija */}
        <div className="min-w-0 bg-white">
          <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-400 border-b border-gray-100">
            Natija
            {responsive && activeWidth && (
              <span className="ml-2 font-normal normal-case text-gray-400">
                — {activeWidth}px
              </span>
            )}
          </div>
          <div className={responsive ? 'bg-gray-100 p-3 flex justify-center' : ''}>
            <iframe
              title={label || 'Natija'}
              srcDoc={buildDoc(applied)}
              sandbox="allow-scripts"
              style={{
                height,
                width: activeWidth ? `${activeWidth}px` : '100%',
                maxWidth: '100%',
                border: responsive ? '1px solid #d1d5db' : 'none',
                borderRadius: responsive ? '8px' : 0,
                background: 'white',
                display: 'block',
                transition: 'width 0.25s ease',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodePreview;
