import { Fragment, useMemo } from 'react';
import CodePreview from './CodePreview';

/**
 * Dars matnini ko'rsatuvchi komponent.
 *
 * NIMA UCHUN O'Z RENDERERIMIZ:
 * Loyihada markdown kutubxonasi yo'q va yangi bog'liqlik qo'shishni
 * xohlamadik. Bu renderer React elementlarini qaytaradi —
 * dangerouslySetInnerHTML ishlatilmaydi, shuning uchun XSS xavfi yo'q.
 *
 * QO'LLAB-QUVVATLANADI:
 *   ## Sarlavha            → h2
 *   ### Kichik sarlavha    → h3
 *   ```lang ... ```        → kod bloki
 *   ```demo ... ```        → kod + JONLI NATIJA (o'zgartirsa bo'ladi)
 *                            ```demo h=320 "Sarlavha"       — balandlik va nom
 *                            ```demo responsive ...          — qurilma kengligi tugmalari
 *                            ```demo-static ...              — tahrirlab bo'lmaydi
 *   > matn                 → callout (emoji bilan boshlansa rangli)
 *   - element              → belgilangan ro'yxat
 *   1. element             → raqamli ro'yxat
 *   | a | b |              → jadval (ikkinchi qator ---)
 *   ---                    → ajratuvchi chiziq
 *   **qalin** *kursiv* `kod` → matn ichida (ichma-ich ham ishlaydi)
 *
 * QO'LLAB-QUVVATLANMAYDI (dars matnida ishlatmang):
 *   [matn](havola)  — havolalar
 *   ![rasm](...)    — rasmlar (demo bloki ichida <img> ishlating)
 *   # Sarlavha      — h1 (dars sarlavhasi allaqachon bor)
 */

// ── Matn ichidagi formatlash: `kod`, **qalin**, *kursiv* ──────
//
// REKURSIV: **qalin ichida `kod`** kabi ichma-ich holatlar to'g'ri
// ishlashi uchun qalin/kursiv ichidagi matn qayta tahlil qilinadi.
// Kod esa atomar — uning ichida formatlash qidirilmaydi, chunki
// `<h1>` kabi belgilar kodda o'z holicha qolishi kerak.
//
// Tartib muhim: kod → qalin → kursiv.
// Alternatsiyada qalin (`**`) kursivdan (`*`) OLDIN turadi, aks holda
// **matn** ni kursiv deb noto'g'ri o'qib qo'yadi.
// MUHIM: regex HAR CHAQIRUVDA yangidan yaratiladi.
// Modul darajasida umumiy /g regex ishlatilsa, rekursiv chaqiruv
// uning lastIndex holatini buzadi va tashqi tsikl adashadi.
const makeInlineRe = () => /(`[^`]+`)|(\*\*[^*]+?\*\*)|(\*[^*\n]+?\*)/g;

const renderInline = (text, keyPrefix = 'i') => {
  if (!text) return null;

  const re = makeInlineRe();
  const parts = [];
  let last = 0;
  let match;
  let n = 0;

  while ((match = re.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));

    const [token, codeTok, boldTok, italicTok] = match;
    const key = `${keyPrefix}-${n++}`;

    if (codeTok) {
      parts.push(
        <code
          key={key}
          className="px-1.5 py-0.5 rounded bg-gray-100 text-[0.85em] font-mono text-pink-700"
        >
          {codeTok.slice(1, -1)}
        </code>
      );
    } else if (boldTok) {
      parts.push(
        <strong key={key} className="font-semibold text-gray-900">
          {renderInline(boldTok.slice(2, -2), key)}
        </strong>
      );
    } else if (italicTok) {
      parts.push(
        <em key={key} className="italic">
          {renderInline(italicTok.slice(1, -1), key)}
        </em>
      );
    }

    last = match.index + token.length;
  }

  if (last < text.length) parts.push(text.slice(last));
  return parts;
};

// ── Callout rangini boshidagi emoji bo'yicha tanlash ──────────
const calloutStyle = (text) => {
  if (/^\s*(⚠️|❌)/.test(text)) return 'bg-orange-50 border-orange-300 text-orange-900';
  if (/^\s*(✅|🚀)/.test(text)) return 'bg-green-50 border-green-300 text-green-900';
  if (/^\s*💡/.test(text)) return 'bg-blue-50 border-blue-300 text-blue-900';
  return 'bg-gray-50 border-gray-300 text-gray-700';
};

// ── Markdown → blok ro'yxati ──────────────────────────────────
const parseBlocks = (md) => {
  const lines = (md || '').replace(/\r\n/g, '\n').split('\n');
  const blocks = [];
  let i = 0;

  const isTableRow = (l) => /^\s*\|.*\|\s*$/.test(l);
  const splitRow = (l) =>
    l.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());

  while (i < lines.length) {
    const line = lines[i];

    // Bo'sh qator
    if (!line.trim()) { i++; continue; }

    // Kod bloki yoki jonli demo
    if (line.trim().startsWith('```')) {
      const info = line.trim().slice(3).trim();
      const code = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        code.push(lines[i]);
        i++;
      }
      i++; // yopuvchi ```

      if (/^demo\b/.test(info)) {
        // ```demo h=320 "Flexbox markazlash"
        const heightMatch = info.match(/\bh=(\d{2,4})\b/);
        const labelMatch = info.match(/"([^"]+)"/);
        blocks.push({
          type: 'demo',
          code: code.join('\n'),
          height: heightMatch ? Number(heightMatch[1]) : 220,
          label: labelMatch ? labelMatch[1] : null,
          // ```demo-static — o'quvchi tahrirlay olmaydi
          editable: !/\bdemo-static\b/.test(info),
          // ```demo responsive — qurilma kengligi tugmalari bilan
          responsive: /\bresponsive\b/.test(info),
        });
      } else {
        blocks.push({ type: 'code', lang: info, code: code.join('\n') });
      }
      continue;
    }

    // Ajratuvchi
    if (/^---+$/.test(line.trim())) {
      blocks.push({ type: 'hr' });
      i++;
      continue;
    }

    // Sarlavhalar
    const h = line.match(/^(#{2,4})\s+(.*)$/);
    if (h) {
      blocks.push({ type: `h${h[1].length}`, text: h[2] });
      i++;
      continue;
    }

    // Jadval
    if (isTableRow(line) && isTableRow(lines[i + 1] || '') && /-{3,}/.test(lines[i + 1])) {
      const head = splitRow(line);
      i += 2;
      const rows = [];
      while (i < lines.length && isTableRow(lines[i])) {
        rows.push(splitRow(lines[i]));
        i++;
      }
      blocks.push({ type: 'table', head, rows });
      continue;
    }

    // Callout / iqtibos
    if (line.trim().startsWith('>')) {
      const buf = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        buf.push(lines[i].trim().replace(/^>\s?/, ''));
        i++;
      }
      blocks.push({ type: 'callout', text: buf.join('\n') });
      continue;
    }

    // Ro'yxatlar
    if (/^\s*[-*]\s+/.test(line) || /^\s*\d+\.\s+/.test(line)) {
      const ordered = /^\s*\d+\.\s+/.test(line);
      const items = [];
      while (
        i < lines.length &&
        (/^\s*[-*]\s+/.test(lines[i]) || /^\s*\d+\.\s+/.test(lines[i]))
      ) {
        items.push(lines[i].replace(/^\s*(?:[-*]|\d+\.)\s+/, ''));
        i++;
      }
      blocks.push({ type: 'list', ordered, items });
      continue;
    }

    // Oddiy paragraf (ketma-ket qatorlarni birlashtiramiz)
    const buf = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith('```') &&
      !lines[i].trim().startsWith('>') &&
      !/^(#{2,4})\s+/.test(lines[i]) &&
      !/^---+$/.test(lines[i].trim()) &&
      !/^\s*[-*]\s+/.test(lines[i]) &&
      !/^\s*\d+\.\s+/.test(lines[i]) &&
      !isTableRow(lines[i])
    ) {
      buf.push(lines[i]);
      i++;
    }
    blocks.push({ type: 'p', text: buf.join(' ') });
  }

  return blocks;
};

const LessonContent = ({ markdown, className = '' }) => {
  const blocks = useMemo(() => parseBlocks(markdown), [markdown]);

  if (!blocks.length) return null;

  return (
    <div className={`space-y-4 text-[15px] leading-relaxed text-gray-700 ${className}`}>
      {blocks.map((b, idx) => {
        const key = `b-${idx}`;

        switch (b.type) {
          case 'h2':
            return (
              <h2 key={key} className="text-lg font-bold text-gray-900 pt-2">
                {renderInline(b.text, key)}
              </h2>
            );
          case 'h3':
            return (
              <h3 key={key} className="text-base font-semibold text-gray-900 pt-1">
                {renderInline(b.text, key)}
              </h3>
            );
          case 'h4':
            return (
              <h4 key={key} className="text-sm font-semibold text-gray-800">
                {renderInline(b.text, key)}
              </h4>
            );

          case 'demo':
            return (
              <CodePreview
                key={key}
                code={b.code}
                height={b.height}
                label={b.label}
                editable={b.editable}
                responsive={b.responsive}
              />
            );

          case 'code':
            return (
              <pre
                key={key}
                className="overflow-x-auto rounded-xl bg-gray-900 p-4 text-[13px] leading-relaxed"
              >
                <code className="font-mono text-gray-100 whitespace-pre">{b.code}</code>
              </pre>
            );

          case 'callout':
            return (
              <div
                key={key}
                className={`rounded-xl border-l-4 px-4 py-3 text-sm ${calloutStyle(b.text)}`}
              >
                {b.text.split('\n').map((l, j) => (
                  <p key={`${key}-l-${j}`} className={j > 0 ? 'mt-1' : ''}>
                    {renderInline(l, `${key}-${j}`)}
                  </p>
                ))}
              </div>
            );

          case 'list': {
            const Tag = b.ordered ? 'ol' : 'ul';
            return (
              <Tag
                key={key}
                className={`space-y-1 pl-5 ${b.ordered ? 'list-decimal' : 'list-disc'}`}
              >
                {b.items.map((it, j) => (
                  <li key={`${key}-i-${j}`}>{renderInline(it, `${key}-${j}`)}</li>
                ))}
              </Tag>
            );
          }

          case 'table':
            return (
              <div key={key} className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {b.head.map((cell, j) => (
                        <th
                          key={`${key}-h-${j}`}
                          className="px-3 py-2 text-left font-semibold text-gray-700"
                        >
                          {renderInline(cell, `${key}-h-${j}`)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((row, j) => (
                      <tr key={`${key}-r-${j}`} className="border-t border-gray-100">
                        {row.map((cell, k) => (
                          <td key={`${key}-r-${j}-${k}`} className="px-3 py-2 align-top">
                            {renderInline(cell, `${key}-r-${j}-${k}`)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          case 'hr':
            return <hr key={key} className="border-gray-200" />;

          default:
            return (
              <p key={key}>
                <Fragment>{renderInline(b.text, key)}</Fragment>
              </p>
            );
        }
      })}
    </div>
  );
};

export default LessonContent;
